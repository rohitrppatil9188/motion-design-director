// Inspect the saved mux, not the render plan. Optional muted browser playback
// verifies playback only; it is explicitly not subjective audio audition.
import fs from 'node:fs';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {spawnSync} from 'node:child_process';
import {loadPlaywright,serve} from './render-utils.mjs';

const {values:v}=parseArgs({options:{input:{type:'string'},report:{type:'string'},width:{type:'string'},height:{type:'string'},fps:{type:'string'},duration:{type:'string'},frames:{type:'string'},'require-audio':{type:'boolean',default:false},'max-true-peak':{type:'string'},playback:{type:'boolean',default:false},'module-root':{type:'string'}}});
if(!v.input)throw new Error('Supply --input path/to/finished.mp4');
for(const key of ['width','height','fps','duration','frames','max-true-peak']){
  if(v[key]===undefined)continue;
  const number=Number(v[key]);
  if(!Number.isFinite(number)||(key!=='max-true-peak'&&number<=0)||(['width','height','frames'].includes(key)&&!Number.isInteger(number)))throw new Error(`Invalid --${key}: expected a finite ${key==='max-true-peak'?'number':'positive value'}`);
}
const input=path.resolve(v.input),errors=[];
function run(binary,args){const r=spawnSync(binary,args,{encoding:'utf8',maxBuffer:16*1024*1024,windowsHide:true});if(r.status!==0)throw new Error(`${binary} failed: ${r.stderr??r.error}`);return r;}
const probe=JSON.parse(run('ffprobe',['-v','error','-count_frames','-show_streams','-show_format','-of','json',input]).stdout);
const video=probe.streams.find(s=>s.codec_type==='video'),audio=probe.streams.find(s=>s.codec_type==='audio');
if(!video)throw new Error('No video stream');
const ratio=value=>{const [a,b]=value.split('/').map(Number);return a/b;};
const actual={width:video.width,height:video.height,fps:ratio(video.avg_frame_rate),frames:Number(video.nb_read_frames),duration:Number(probe.format.duration),audio:audio?{codec:audio.codec_name,sampleRate:Number(audio.sample_rate),channels:audio.channels,duration:Number(audio.duration)}:null};
for(const key of ['width','height','fps','frames','duration'])if(!Number.isFinite(actual[key])||actual[key]<=0)errors.push(`Video ${key} is invalid or unavailable`);
for(const key of ['width','height','fps','duration','frames'])if(v[key]!==undefined&&Math.abs(actual[key]-Number(v[key]))>(key==='duration'?.002:1e-5))errors.push(`${key}: expected ${v[key]}, got ${actual[key]}`);
if(v['require-audio']&&!audio)errors.push('Expected audio is missing');
const decoded=run('ffmpeg',['-v','error','-xerror','-i',input,'-f','null','-']);
if(decoded.stderr.trim())errors.push('Decoder reported errors');
let loudness=null;
if(audio){
  const result=run('ffmpeg',['-hide_banner','-i',input,'-vn','-af','loudnorm=I=-15:TP=-1.5:LRA=7:print_format=json','-f','null','-']);
  const match=result.stderr.match(/\{\s*"input_i"[\s\S]*?\}/);
  if(!match)throw new Error('Audio loudness could not be parsed');
  const m=JSON.parse(match[0]);loudness={integratedLUFS:Number(m.input_i),truePeakDBTP:Number(m.input_tp),rangeLU:Number(m.input_lra)};
  if(!Object.values(loudness).every(Number.isFinite))errors.push('Audio measurement is nonfinite');
  if(v['max-true-peak']!==undefined&&loudness.truePeakDBTP>Number(v['max-true-peak']))errors.push(`True peak ${loudness.truePeakDBTP} exceeds ${v['max-true-peak']} dBTP`);
}
let playback=null;
if(v.playback){
  const host=await serve(path.dirname(input));let browser;
  try{
    browser=await loadPlaywright(v['module-root']).chromium.launch({headless:true});
    const page=await browser.newPage();page.setDefaultTimeout(Math.max(30000,actual.duration*2000+5000));
    playback=await page.evaluate(async({url,timeout})=>{
      const video=document.createElement('video');video.muted=true;video.playsInline=true;video.controls=true;document.body.append(video);
      const done=new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Playback did not end in time')),timeout);video.addEventListener('ended',()=>{clearTimeout(timer);resolve();},{once:true});video.addEventListener('error',()=>{clearTimeout(timer);reject(new Error(`Video error ${video.error?.code}`));},{once:true});});
      done.catch(()=>{});video.src=url;await video.play();await done;
      return {ended:video.ended,currentTime:video.currentTime,width:video.videoWidth,height:video.videoHeight,muted:video.muted,subjectivelyAuditioned:false};
    },{url:`${host.url}/${encodeURIComponent(path.basename(input))}`,timeout:Math.max(20000,actual.duration*2000+5000)});
    if(!playback.ended)errors.push('Browser playback did not end');
  }finally{if(browser)await browser.close();await host.close();}
}
const report={passed:errors.length===0,input:path.basename(input),actual,fullDecode:true,loudness,playback,subjectivelyAuditioned:false,errors};
const dest=path.resolve(v.report??path.join(path.dirname(input),'media-verification.json'));fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));if(errors.length)process.exitCode=1;
