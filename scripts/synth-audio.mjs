// Original deterministic stereo PCM synthesis. No source-film audio or samples.
import fs from 'node:fs';
import path from 'node:path';
import {parseArgs} from 'node:util';
import {hash01, clamp, smooth, TAU} from './motion-math.mjs';

const {values} = parseArgs({options:{output:{type:'string',default:'out/offset.wav'},duration:{type:'string',default:'15'},bpm:{type:'string',default:'128'}}});
const rate=48000, duration=Number(values.duration), bpm=Number(values.bpm);
if (!(duration>0 && duration<=300 && bpm>30 && bpm<300)) throw new Error('Invalid duration/BPM');
const count=Math.round(duration*rate), left=new Float64Array(count), right=new Float64Array(count);
const beat=60/bpm;
function add(start,length,fn,pan=0) {
  const first=Math.max(0,Math.round(start*rate)), last=Math.min(count,Math.round((start+length)*rate));
  const l=Math.sqrt((1-pan)/2), r=Math.sqrt((1+pan)/2);
  for(let i=first;i<last;i++){const t=i/rate-start; const v=fn(t,i); left[i]+=v*l;right[i]+=v*r;}
}
// Spacious low pulse, more active in the central development; spare final hold.
for(let n=0;n*beat<duration-1.8;n++) {
  const start=n*beat;
  const energy=n<4?0.48:n<10?0.7:0.9;
  add(start,0.32,t=>0.42*energy*Math.sin(TAU*(48*t+6*(1-Math.exp(-22*t))))*Math.exp(-16*t)*smooth(t/0.003));
  if(n>=4) {
    const hz=[65.406,65.406,77.782,58.270][Math.floor(n/4)%4];
    add(start+beat*0.5,beat*0.85,t=>0.105*Math.sin(TAU*hz*t)*Math.exp(-7*t)*smooth(t/0.012));
  }
}
for(let n=0;n*beat*0.5<duration-1.9;n++) {
  const start=n*beat*0.5;
  if(start<1.6) continue;
  add(start,0.07,(t,i)=>0.055*(hash01(i,91)*2-1)*Math.exp(-70*t)*smooth(t/0.001),n%2?-0.3:0.3);
}
// A clear but restrained ascending motif, with soft stereo repeats.
const notes=[261.626,329.628,391.995,523.251,391.995,329.628,293.665,391.995];
for(let n=0;n<24;n++) {
  const start=(4+n)*beat, hz=notes[n%notes.length];
  if(start>duration-2) break;
  for(let echo=0;echo<3;echo++) add(start+echo*beat*0.75,0.8,t=>0.067*Math.pow(0.4,echo)*(Math.sin(TAU*hz*t)+0.22*Math.sin(TAU*hz*2*t))*Math.exp(-5*t)*smooth(t/0.014),echo%2?0.35:-0.2);
}
// Section swells end at the designed scene boundaries; no extracted whooshes.
for(const end of [1.875,4.6875,7.5,10.3125,13.125]) {
  add(end-0.3,0.43,(t,i)=>{
    const a=t<0.3?Math.pow(t/0.3,2):Math.exp(-(t-0.3)*35);
    return 0.08*(hash01(i,202)*2-1)*a*Math.sin(TAU*(750*t+2200*t*t));
  },0.1);
}
// Final chord: broad arrival, then a clean tail.
for(const [i,hz] of [130.813,195.998,261.626,329.628].entries()) {
  add(13.125,duration-13.125,t=>0.085*Math.sin(TAU*hz*t)*smooth(t/0.025)*Math.exp(-1.9*t),(i-1.5)*0.3);
}
let peak=0;
for(let i=0;i<count;i++) {
  const t=i/rate, fade=smooth(t/0.008)*(1-smooth((t-(duration-0.35))/0.35));
  left[i]*=fade;right[i]*=fade;peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));
}
const gain=0.77/Math.max(peak,1e-9); // Headroom before optional loudness mastering.
const header=Buffer.alloc(44), pcm=Buffer.alloc(count*4);
header.write('RIFF');header.writeUInt32LE(36+pcm.length,4);header.write('WAVE',8);header.write('fmt ',12);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(2,22);header.writeUInt32LE(rate,24);header.writeUInt32LE(rate*4,28);header.writeUInt16LE(4,32);header.writeUInt16LE(16,34);header.write('data',36);header.writeUInt32LE(pcm.length,40);
for(let i=0;i<count;i++){pcm.writeInt16LE(Math.round(clamp(left[i]*gain,-1,1)*32767),i*4);pcm.writeInt16LE(Math.round(clamp(right[i]*gain,-1,1)*32767),i*4+2);}
const dest=path.resolve(values.output);fs.mkdirSync(path.dirname(dest),{recursive:true});
fs.writeFileSync(dest,Buffer.concat([header,pcm]));
console.log(JSON.stringify({output:dest,sample_rate:rate,channels:2,samples:count,seconds:count/rate,original_synthesis:true,subjectively_auditioned:false}));
