import {TAU, clamp, lerp, progress, smoother, arrive, spring01, hash01, rotate3, project3, spherePoint, torusPoint, mixPoint, fitFont} from '../../scripts/motion-math.mjs';

const canvas=document.querySelector('#film'), ctx=canvas.getContext('2d',{alpha:false});
const W=1920,H=1080,FPS=60;
const C={paper:'#f4f1e9',ink:'#17181a',blue:'#2e35ef',yellow:'#ffd14a',light:'#a6b5ff'};
const boundaries=[113,281,450,619,788], ends=[...boundaries,900];
const backgrounds=[C.paper,C.blue,C.paper,C.ink,C.yellow,C.paper];
const fontCache=new Map();
const particles=Array.from({length:1900},(_,i)=>({sphere:spherePoint(i,1900,315),torus:torusPoint(i,1900,240,100),id:i}));

function rect(x,y,w,h,colour){ctx.fillStyle=colour;ctx.fillRect(x,y,w,h);}
function line(x1,y1,x2,y2,colour,width=2){ctx.strokeStyle=colour;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function circle(x,y,r,colour){if(r<=0)return;ctx.fillStyle=colour;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();}
function label(text,x,y,colour=C.ink,size=23,align='left'){
  ctx.save();ctx.fontKerning='normal';ctx.font=`500 ${size}px Inter`;ctx.fillStyle=colour;ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.fillText(text,x,y);ctx.restore();
}
function type(text,cx,cy,width,height,colour,{family='"Barlow Condensed"',weight=900,outline=false}={}){
  ctx.save();ctx.fontKerning='normal';ctx.textAlign='left';ctx.textBaseline='alphabetic';
  const key=JSON.stringify([text,width,height,family,weight]);
  let b=fontCache.get(key);
  if(!b){b=fitFont(ctx,text,family,weight,width,height,750);fontCache.set(key,b);}
  ctx.font=`${weight} ${b.size}px ${family}`;ctx.fillStyle=colour;ctx.strokeStyle=colour;
  const x=cx-(b.left+b.right)/2,y=cy-(b.top+b.bottom)/2;
  if(outline){ctx.lineWidth=2.3;ctx.strokeText(text,x,y);}else ctx.fillText(text,x,y);
  ctx.restore();
}
function revealWord(text,cx,cy,width,height,colour,u,options={}){
  ctx.save();const q=arrive(u);
  ctx.beginPath();ctx.rect(cx-width/2-8,cy-height/2-6,width+16,height+14);ctx.clip();
  type(text,cx,cy+(1-q)*(height+25),width,height,colour,options);ctx.restore();
}
function mark(cx,cy,size,colour,phase=1){
  ctx.save();ctx.translate(cx,cy);ctx.rotate(-Math.PI/4);
  for(let i=0;i<3;i++){
    const q=spring01(clamp(phase-i*0.12));
    rect(-size*.44+size*.13*i,-size*.33+size*.25*i,size*.72*q,size*.15,colour);
  }
  ctx.restore();
}
function folio(index,colour=C.ink){
  label('OFFSET / MOTION STUDIES',100,73,colour,22);
  label(`0${index+1} — 06`,1820,73,colour,22,'right');
  line(100,94,1820,94,colour,1.3);
}

function opening(f){
  folio(0);const t=f/FPS;
  const words=[['ONE',285,360],['SMALL',525,710],['SHIFT.',780,760]];
  for(let i=0;i<words.length;i++){
    const [text,y,w]=words[i];revealWord(text,520,y,w,205,C.ink,progress(t,0.08+i*.13,.65+i*.13));
  }
  const move=arrive(progress(t,.18,1.1));
  mark(1415,510,lerp(105,405,move),C.blue,clamp(.35+t*1.6));
  for(let i=0;i<3;i++){
    const q=progress(t,.35+i*.11,1.2+i*.11);
    line(1150,780+i*14,1150+q*(480-i*55),780+i*14,C.blue,3-i*.7);
  }
  label('A NEW PERSPECTIVE BEGINS WITH A SHIFT.',100,1000,C.ink,24);
  label('01 / IMPULSE',1820,1000,C.ink,24,'right');
}

function statement(f){
  const t=(f-113)/FPS;folio(1,C.paper);
  const words=[['CHANGES',920,290,1530],['THE',465,540,620],['FIELD.',1110,790,1360]];
  words.forEach(([word,x,y,width],i)=>revealWord(word,x,y,width,218,C.paper,progress(t,.08+i*.1,.55+i*.1)));
  const u=smoother(progress(t,.45,1.1));
  ctx.save();ctx.translate(1515,540);ctx.rotate(-t*.7);
  for(let i=0;i<12;i++){
    const a=i/12*TAU;ctx.save();ctx.rotate(a);rect(115,-10,70*u,20,C.yellow);ctx.restore();
  }
  circle(0,0,45*u,C.yellow);ctx.restore();
  label('ONE IDEA. MANY POSSIBILITIES.',100,1000,C.paper,24);
  label('02 / AMPLIFY',1820,1000,C.paper,24,'right');
}

function tileMotif(x,y,side,rotation,colour,kind){
  ctx.save();ctx.translate(x,y);ctx.rotate(rotation);ctx.fillStyle=colour;
  if(kind===0){ctx.beginPath();ctx.arc(0,0,side*.38,0,TAU);ctx.fill();}
  else if(kind===1){rect(-side*.35,-side*.35,side*.7,side*.7,colour);}
  else {
    ctx.beginPath();ctx.moveTo(-side*.43,-side*.43);ctx.lineTo(side*.43,-side*.43);ctx.arc(-side*.43,-side*.43,side*.86,0,Math.PI/2);ctx.closePath();ctx.fill();
  }
  ctx.restore();
}
function field(f){
  const t=(f-281)/FPS;folio(2);
  revealWord('FIND THE PATTERN.',645,210,1090,120,C.ink,progress(t,0,.4));
  const depth=smoother(progress(t,.8,1.8));
  const cells=[];
  for(let row=0;row<5;row++)for(let col=0;col<11;col++){
    const id=row*11+col,xx=(col-5)*145,yy=(row-2)*138;
    const d=Math.hypot(col-5,row-2),wave=Math.sin(d*1.1-t*4.5)*Math.exp(-d*.05);
    const h=(wave+1)*35*depth;
    const p=rotate3({x:xx,y:yy,z:-h},-.65*depth,.24*depth,-.1*depth);
    const pr=project3(p,{cx:960,cy:650,focal:1600,distance:1600});
    cells.push({id,row,col,wave,h,x:xx,y:yy,p:pr,sort:p.z});
  }
  cells.sort((a,b)=>b.sort-a.sort);
  for(const c of cells){
    const colour=(c.row+c.col)%4===0?C.blue:(c.row+c.col)%4===1?C.ink:C.yellow;
    const q=arrive(progress(t,.02+c.col*.012+c.row*.02,.45+c.col*.012+c.row*.02));
    const side=120*q;
    if(side<.01)continue;
    const pp=(x,y,z)=>project3(rotate3({x:c.x+x,y:c.y+y,z},-.65*depth,.24*depth,-.1*depth),{cx:960,cy:650,focal:1600,distance:1600});
    const path=points=>{ctx.beginPath();points.forEach((p,i)=>{const v=pp(...p);if(i)ctx.lineTo(v.x,v.y);else ctx.moveTo(v.x,v.y);});ctx.closePath();};
    const s=side*.47;
    if(depth>.01){
      path([[-s,-s,0],[-s,s,0],[-s,s,-c.h],[-s,-s,-c.h]]);ctx.fillStyle=colour===C.blue?'#2026aa':colour===C.yellow?'#c29a27':'#101114';ctx.fill();
      path([[-s,s,0],[s,s,0],[s,s,-c.h],[-s,s,-c.h]]);ctx.fillStyle=colour===C.blue?'#171c80':colour===C.yellow?'#9e7c21':'#0a0b0d';ctx.fill();
    }
    path([[-s,-s,-c.h],[s,-s,-c.h],[s,s,-c.h],[-s,s,-c.h]]);
    ctx.fillStyle=C.paper;ctx.fill();ctx.save();ctx.globalAlpha=depth*.32;ctx.strokeStyle=C.ink;ctx.lineWidth=1;ctx.stroke();ctx.restore();
    ctx.save();ctx.clip();
    const angle=Math.floor((c.row+c.col)%4)*Math.PI/2+c.wave*.4*depth;
    const rot=(x,y)=>[x*Math.cos(angle)-y*Math.sin(angle),x*Math.sin(angle)+y*Math.cos(angle),-c.h];
    let points=[];
    if(c.id%3===0){for(let j=0;j<40;j++)points.push(rot(side*.34*Math.cos(j/40*TAU),side*.34*Math.sin(j/40*TAU)));}
    else if(c.id%3===1){points=[[-.33,-.33],[.33,-.33],[.33,.33],[-.33,.33]].map(([x,y])=>rot(x*side,y*side));}
    else {points.push(rot(-s,-s));for(let j=0;j<=24;j++){const a=j/24*Math.PI/2;points.push(rot(-s+2*s*Math.cos(a),-s+2*s*Math.sin(a)));}}
    path(points);ctx.fillStyle=colour;ctx.fill();ctx.restore();
  }
  label('A SHARED MODULE. A TRAVELLING WAVE.',100,1000,C.ink,24);
  label('03 / FORM',1820,1000,C.ink,24,'right');
}

function volume(f){
  const t=(f-450)/FPS;folio(3,C.paper);
  ['GIVE','IDEAS','SPACE.'].forEach((word,i)=>revealWord(word,445,355+i*160,660,138,C.paper,progress(t,.07+i*.1,.48+i*.1),{family:'Inter',weight:800}));
  const morph=smoother(progress(t,.65,2));
  const pts=[];
  for(const p of particles){
    const a=mixPoint(p.sphere,p.torus,morph);
    const rot=rotate3(a,.25+t*.25,t*.47,-.18);
    const pr=project3(rot,{cx:1320,cy:555,focal:1300,distance:1100});
    if(pr)pts.push({...pr,id:p.id,z:rot.z});
  }
  pts.sort((a,b)=>b.z-a.z);
  // Stable, intentionally faint construction ring behind the point volume.
  ctx.save();ctx.strokeStyle='#454963';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(1320,555,430,158,-.3,0,TAU);ctx.stroke();ctx.restore();
  const entrance=arrive(progress(t,.03,.55));
  for(const p of pts){
    ctx.save();ctx.globalAlpha=lerp(.2,1,clamp((350-p.z)/700))*entrance;
    circle(lerp(1320,p.x,entrance),lerp(555,p.y,entrance),(p.id%7===0?2.7:1.8)*p.scale,p.id%11===0?C.yellow:p.z<0?C.paper:C.light);ctx.restore();
  }
  label('SAME POINTS. ANOTHER DIMENSION.',100,1000,C.paper,24);
  label('04 / SPACE',1820,1000,C.paper,24,'right');
}

function blobPath(time){
  ctx.beginPath();const count=200;
  for(let i=0;i<=count;i++){
    const a=i/count*TAU;
    const r=310+49*Math.sin(3*a-time*1.7)+24*Math.sin(5*a+time*1.1);
    const x=Math.cos(a)*r,y=Math.sin(a)*r;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.closePath();
}
function feeling(f){
  const t=(f-619)/FPS;folio(4);
  // Repeated background type remains subordinate to a crisp foreground block.
  ctx.save();ctx.globalAlpha=.12;
  for(let i=0;i<3;i++)type('CHANGE',970,290+i*260,1740,220,C.ink,{outline:true});ctx.restore();
  ctx.save();ctx.translate(1360,555);ctx.rotate(-.15+t*.13);
  const grow=arrive(progress(t,.03,.55));ctx.scale(grow,grow);
  blobPath(t);ctx.save();ctx.clip();
  const base=ctx.createLinearGradient(-280,-300,330,350);base.addColorStop(0,'#10164d');base.addColorStop(.43,C.blue);base.addColorStop(.76,'#788bff');base.addColorStop(1,'#151d83');ctx.fillStyle=base;ctx.fillRect(-500,-500,1000,1000);
  const light=ctx.createRadialGradient(-100+80*Math.sin(t),-170,10,-35,-70,370);light.addColorStop(0,'#f4f1e9');light.addColorStop(.22,'#c4cdff');light.addColorStop(.55,'#727dff80');light.addColorStop(1,'#2e35ef00');ctx.fillStyle=light;ctx.fillRect(-500,-500,1000,1000);
  ctx.restore();ctx.lineWidth=2;ctx.strokeStyle='#10164d';ctx.stroke();
  // A graphic highlight strip clipped to the illustrated surface.
  ctx.save();blobPath(t);ctx.clip();ctx.translate(-170+60*Math.sin(t),-20);ctx.rotate(-.7);ctx.globalAlpha=.24;rect(-20,-500,44,1000,C.paper);ctx.restore();ctx.restore();
  ['FEEL','THE','CHANGE.'].forEach((word,i)=>revealWord(word,510,340+i*190,790,168,C.ink,progress(t,.07+i*.09,.48+i*.09)));
  mark(105,890,75,C.blue,1);
  label('HARD GEOMETRY. SOFT EXPRESSION.',100,1000,C.ink,24);
  label('05 / FEELING',1820,1000,C.ink,24,'right');
}

function identity(f){
  const t=(f-788)/FPS;folio(5);
  // All geometry reaches its terminal state well before the final 90-frame hold.
  mark(395,505,255,C.blue,clamp(t*5+0.35));
  revealWord('OFFSET',1130,510,1020,265,C.ink,progress(t,.02,.32));
  line(645,720,1640,720,C.ink,2);
  label('A SMALL SHIFT. A NEW PERSPECTIVE.',645,778,C.ink,27);
  label('DESIGN IN MOTION',100,1000,C.ink,24);
  label('ORIGINAL STUDY / 15 SECONDS',1820,1000,C.ink,24,'right');
}
const scenes=[opening,statement,field,volume,feeling,identity];

function renderAt(frame){
  const f=clamp(frame,0,899.99999);
  let scene=ends.findIndex(end=>f<end);if(scene<0)scene=5;
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.clearRect(0,0,W,H);
  rect(0,0,W,H,backgrounds[scene]);scenes[scene](f);
  // Each curtain covers the entire frame at the scene boundary, then leaves.
  for(let b=0;b<boundaries.length;b++){
    const delta=(f-boundaries[b])/FPS;
    if(delta<-.28||delta>.34)continue;
    for(let i=0;i<7;i++){
      const delay=i*.018;
      const a=delta<0?arrive(progress(delta,-.28+delay,-.01)):1;
      const e=delta>=0?arrive(progress(delta,delay,.20+delay)):0;
      const x=Math.floor(i*W/7)-1;
      rect(x,-H+H*a+H*e,Math.ceil((i+1)*W/7)-x+1,H+2,backgrounds[b+1]);
    }
  }
  return {frame:f,scene:scene+1};
}
window.ready=(async()=>{
  await Promise.all([document.fonts.load('900 200px "Barlow Condensed"'),document.fonts.load('800 120px Inter'),document.fonts.load('500 24px Inter')]);
  await document.fonts.ready;
  if(!document.fonts.check('900 200px "Barlow Condensed"')||!document.fonts.check('800 120px Inter'))throw new Error('Bundled fonts did not load');
  window.renderAt=renderAt;window.renderFrame=time=>renderAt(time*FPS);
  window.filmInfo={duration:15,fps:FPS,width:W,height:H,frameCount:900,title:'OFFSET',audio:'Original synthesis; render with scripts/synth-audio.mjs'};
  renderAt(0);return true;
})();

// Used only when a verifier reports a changed frame; no scene state is mutated.
window.inspectFontFits=()=>{
  ctx.save();ctx.fontKerning='normal';ctx.textAlign='left';ctx.textBaseline='alphabetic';
  const result=[...fontCache].map(([key,cached])=>{
    const [text,width,height,family,weight]=JSON.parse(key);
    const fresh=fitFont(ctx,text,family,weight,width,height,750);
    return {text,width,height,family,weight,cached,fresh};
  });ctx.restore();return result;
};

const scrub=document.querySelector('#scrub'),output=document.querySelector('#time'),play=document.querySelector('#play');
let playing=false,origin=0;
scrub.addEventListener('input',()=>{playing=false;play.textContent='Play visuals';window.renderFrame?.(Number(scrub.value));output.value=`${Number(scrub.value).toFixed(2)} s`;});
play.addEventListener('click',async()=>{
  await window.ready;playing=!playing;play.textContent=playing?'Pause':'Play visuals';origin=performance.now()-Number(scrub.value)*1000;
  if(playing)requestAnimationFrame(tick);
});
function tick(now){if(!playing)return;let t=(now-origin)/1000;if(t>=15){t=0;origin=now;}window.renderFrame(t);scrub.value=t;output.value=`${t.toFixed(2)} s`;requestAnimationFrame(tick);}
