import fs from 'node:fs';
import path from 'node:path';
const SR=48000,D=6,N=SR*D,L=new Float64Array(N),R=new Float64Array(N);let seed=73542;
const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296*2-1};
function put(t,d,fn,pan=0){const a=Math.round(t*SR),n=Math.min(Math.round(d*SR),N-a);for(let j=0;j<n;j++){const s=j/SR,v=fn(s,j/d/SR),l=Math.sqrt((1-pan)/2),r=Math.sqrt((1+pan)/2);L[a+j]+=v*l;R[a+j]+=v*r}}
function pluck(t,f,amp,d=.65,pan=0){put(t,d,(s)=>amp*(1-Math.exp(-s*650))*Math.exp(-s*6.5)*(Math.sin(2*Math.PI*f*s)+.2*Math.sin(2*Math.PI*f*2.005*s)),pan)}
function hit(t,amp=.2){put(t,.5,s=>amp*(1-Math.exp(-s*1600))*Math.exp(-s*15)*Math.sin(2*Math.PI*(68*s+12*(1-Math.exp(-s*30))/30)))}
function breath(t,d,amp,pan=0){let low=0;put(t,d,(s,u)=>{low=.92*low+.08*rnd();return amp*Math.pow(Math.sin(Math.PI*u),2)*low},pan)}
// Original restrained six-second phrase: D / A / E, articulated at visual events.
pluck(0,293.6648,.24,.75,-.25);pluck(.08,440,.09,.6,.25);
pluck(.5,220,.09,.75,.1);breath(1,.8,.32,-.15);hit(1.8,.28);pluck(1.8,146.8324,.2,1.3,0);
breath(2.05,.65,.2,.3);pluck(2.12,587.3295,.11,.5,-.3);pluck(2.31,659.255,.08,.5,.25);pluck(2.5,440,.1,.7,-.2);
breath(2.84,.78,.28,-.15);hit(3.63,.18);pluck(3.63,293.6648,.18,1.2,.1);
for(const [i,f] of [146.8324,220,293.6648,329.6276,440].entries())put(4.43+i*.008,1.56,(s)=>.085*(1-Math.exp(-s*55))*Math.exp(-s*2.7)*Math.sin(2*Math.PI*f*s),(i-2)*.16);
// Soft continuous bed, no abrupt sample boundaries or clipped tail.
for(let i=0;i<N;i++){const t=i/SR,fade=Math.min(1,t/.025,(D-t)/.24),bed=.012*Math.sin(2*Math.PI*73.4162*t)*Math.pow(Math.sin(Math.PI*t/D),2);L[i]=(L[i]+bed)*fade;R[i]=(R[i]+bed)*fade}
let peak=0;for(let i=0;i<N;i++)peak=Math.max(peak,Math.abs(L[i]),Math.abs(R[i]));const gain=.78/peak;
const b=Buffer.alloc(44+N*4);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(2,22);b.writeUInt32LE(SR,24);b.writeUInt32LE(SR*4,28);b.writeUInt16LE(4,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(N*4,40);for(let i=0;i<N;i++){b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,L[i]*gain))*32767),44+i*4);b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,R[i]*gain))*32767),46+i*4)}
const dest=path.resolve(process.argv[2]??'out/field-notes.wav');fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,b);console.log(JSON.stringify({file:dest,samples:N,sampleRate:SR,channels:2,originalSynthesis:true,peak:.78,auditioned:false}));
