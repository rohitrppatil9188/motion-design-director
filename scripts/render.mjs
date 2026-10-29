import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {spawn,spawnSync} from 'node:child_process';
import {once} from 'node:events';
import {openFilm} from './render-utils.mjs';

const packageRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {values:v}=parseArgs({options:{entry:{type:'string',default:'assets/example/index.html'},root:{type:'string'},output:{type:'string',default:'out/offset.mp4'},audio:{type:'string'},'module-root':{type:'string'},'still-frames':{type:'string'},width:{type:'string',default:'1920'},height:{type:'string',default:'1080'},fps:{type:'string',default:'60'},duration:{type:'string',default:'15'},'stills-only':{type:'boolean',default:false},overwrite:{type:'boolean',default:false}}});
const root=path.resolve(v.root??packageRoot),entry=path.resolve(v.entry),output=path.resolve(v.output);
const width=Number(v.width),height=Number(v.height),fps=Number(v.fps),duration=Number(v.duration),frames=Math.round(fps*duration);
if(![width,height,fps,duration].every(x=>Number.isFinite(x)&&x>0)||!Number.isInteger(width)||!Number.isInteger(height)||width%2||height%2||frames<1)throw new Error('Invalid format: even integer dimensions, positive fps/duration required');
if(!v['stills-only']&&fs.existsSync(output)&&!v.overwrite)throw new Error('Output exists; choose a new path or explicitly use --overwrite');
fs.mkdirSync(path.dirname(output),{recursive:true});
const stillDir=path.join(path.dirname(output),'stills');fs.mkdirSync(stillDir,{recursive:true});
const audio=v.audio?path.resolve(v.audio):null;
let audioFilter=null,audioMeasure=null;
if(audio&&!v['stills-only']){
  // Extra PCM headroom anticipates AAC reconstruction overshoot. Verify the
  // encoded file; codec behaviour is not guaranteed by the input ceiling.
  const measure=spawnSync('ffmpeg',['-hide_banner','-i',audio,'-vn','-af','loudnorm=I=-15:TP=-2.8:LRA=7:print_format=json','-f','null','-'],{encoding:'utf8',maxBuffer:8*1024*1024,windowsHide:true});
  if(measure.status!==0)throw new Error(`Audio analysis failed: ${measure.stderr??measure.error}`);
  const match=measure.stderr.match(/\{\s*"input_i"[\s\S]*?\}/);
  if(!match)throw new Error('Could not parse loudness measurements');
  audioMeasure=JSON.parse(match[0]);
  if(!['input_i','input_tp','input_lra','input_thresh','target_offset'].every(k=>Number.isFinite(Number(audioMeasure[k]))))throw new Error('Nonfinite audio loudness measurement');
  audioFilter=`loudnorm=I=-15:TP=-2.8:LRA=7:measured_I=${audioMeasure.input_i}:measured_TP=${audioMeasure.input_tp}:measured_LRA=${audioMeasure.input_lra}:measured_thresh=${audioMeasure.input_thresh}:offset=${audioMeasure.target_offset}:linear=true:print_format=summary,aresample=48000,apad=whole_dur=${duration},atrim=duration=${duration},asetpts=PTS-STARTPTS`;
}
const film=await openFilm({root,entry,moduleRoot:v['module-root'],width,height});
let encoder=null,encoded=false;
const started=Date.now();
try{
  const info=await film.page.evaluate(()=>window.filmInfo??null);
  if(info){
    if(info.fps!==undefined&&Math.abs(Number(info.fps)-fps)>1e-6)throw new Error(`Project fps ${info.fps} differs from CLI fps ${fps}. Set --fps to the project's timebase.`);
    const projectDuration=info.duration??info.durationSeconds;
    if(projectDuration!==undefined&&Math.abs(Number(projectDuration)-duration)>1/fps/2)throw new Error(`Project duration ${projectDuration} differs from CLI duration ${duration}. Set --duration to the complete project duration.`);
    if(info.frameCount!==undefined&&Number(info.frameCount)!==frames)throw new Error(`Project frameCount ${info.frameCount} differs from requested ${frames}`);
    if(info.width&&info.height&&Math.abs(info.width/info.height-width/height)>1e-6)throw new Error('Output aspect ratio differs from project; redesign the layout rather than stretching the canvas');
  }
  const sampleFrames=v['still-frames']?v['still-frames'].split(',').map(Number):[0,.04,.087,.167,.24,.353,.44,.54,.647,.727,.807,.92,1].map(q=>Math.min(frames-1,Math.round(q*(frames-1))));
  if(sampleFrames.some(n=>!Number.isInteger(n)||n<0||n>=frames))throw new Error('--still-frames requires comma-separated integer frames inside the project');
  const times=[...new Set(sampleFrames)].sort((a,b)=>a-b).map(n=>n/fps);
  const snapshots=[];
  for(const t of times){
    await film.page.evaluate(time=>window.renderFrame(time),t);
    const name=`frame-${Math.round(t*fps).toString().padStart(4,'0')}.jpg`;
    await film.canvas.screenshot({path:path.join(stillDir,name),type:'jpeg',quality:90});snapshots.push({time:t,file:`stills/${name}`});
  }
  fs.writeFileSync(path.join(path.dirname(output),'stills.json'),JSON.stringify(snapshots,null,2)+'\n');
  if(v['stills-only']){console.log(JSON.stringify({stills:stillDir,count:snapshots.length,errors:film.errors}));}
  else{
    const args=['-hide_banner','-y','-f','image2pipe','-vcodec','png','-framerate',String(fps),'-i','pipe:0'];
    if(audio)args.push('-i',audio,'-af',audioFilter);
    args.push('-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-frames:v',String(frames),'-t',String(duration));
    if(audio)args.push('-c:a','aac','-b:a','192k','-ar','48000');else args.push('-an');
    args.push('-movflags','+faststart',output);
    encoder=spawn('ffmpeg',args,{stdio:['pipe','ignore','pipe'],windowsHide:true});
    let logs='';encoder.stderr.on('data',chunk=>{logs+=chunk.toString();});
    let spawnError=null;encoder.on('error',error=>{spawnError=error;});
    const finished=new Promise((resolve,reject)=>{encoder.once('error',reject);encoder.once('close',(code,signal)=>code===0?resolve():reject(new Error(`FFmpeg exited ${code??signal}: ${logs.slice(-5000)}`)));});
    // Attach rejection immediately to avoid unhandled rejection if encoding fails early.
    finished.catch(()=>{});
    encoder.stdin.on('error',()=>{});
    for(let n=0;n<frames;n++){
      if(spawnError)throw spawnError;
      if(encoder.exitCode!==null)throw new Error(`Encoder stopped: ${logs.slice(-3000)}`);
      await film.page.evaluate(time=>window.renderFrame(time),n/fps);
      const png=await film.canvas.screenshot({type:'png'});
      if(!encoder.stdin.write(png))await Promise.race([once(encoder.stdin,'drain'),finished.then(()=>{throw new Error('Encoder closed before accepting every frame');})]);
      if(n%120===0)console.log(`Rendered ${n}/${frames} frames`);
    }
    encoder.stdin.end();await finished;encoded=true;
    if(film.errors.length)throw new Error(film.errors.join('\n'));
    fs.writeFileSync(path.join(path.dirname(output),'render-report.json'),JSON.stringify({output,width,height,fps,frames,duration,elapsedSeconds:(Date.now()-started)/1000,audio,masteringInput:audioMeasure,masteringFilter:audioFilter,renderErrors:film.errors,subjectivelyAuditioned:false},null,2)+'\n');
    console.log(JSON.stringify({output,frames,seconds:duration,elapsedSeconds:(Date.now()-started)/1000}));
  }
}finally{
  if(encoder&&!encoded&&encoder.exitCode===null)encoder.kill();
  await film.close();
}
