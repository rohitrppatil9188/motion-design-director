const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
const W=960,H=540,FPS=30,CREAM='#f2eddf',INK='#1d2421',ACCENT='#d65337';
const front=document.createElement('canvas');front.width=W;front.height=H;const f=front.getContext('2d');
const clamp=x=>Math.max(0,Math.min(1,x)),lerp=(a,b,t)=>a+(b-a)*t;
const smooth=x=>{x=clamp(x);return x*x*(3-2*x)};
const cubic=x=>1-Math.pow(1-clamp(x),3);
const easeIn=x=>Math.pow(clamp(x),3);
const range=(t,a,b)=>clamp((t-a)/(b-a));
const corners=[[0,0],[W,0],[W,H],[0,H]];
// A single explicit geometric glyph means the counter and aperture share
// the very same contour; there is no guessed ellipse over a font glyph.
const OC={x:414,y:270,outer:76,inner:36};
const outer=[[0,-132],[96,-48],[132,0],[48,96],[0,132],[-96,48],[-132,0],[-48,-96]];
const fills=[ACCENT,ACCENT,INK,INK,ACCENT,ACCENT,INK,INK];
const facets=outer.map((p,i)=>{const q=outer[(i+1)%outer.length],c=[(p[0]+q[0])/3,(p[1]+q[1])/3];return{id:i,vertices:[[0,0],p,q],centroid:c,angle:Math.atan2(c[1],c[0]),distance:84+(i%3)*16,turn:(i%2?1:-1)*(.21+.04*i)}});
function text(c,s,x,y,size,weight=700,fill=INK,align='left',family='Inter'){c.font=`${weight} ${size}px ${family}`;c.textAlign=align;c.textBaseline='alphabetic';c.fillStyle=fill;c.fillText(s,x,y);}
function bg(c,color=CREAM){c.fillStyle=color;c.fillRect(0,0,W,H)}
function diamond(c,x,y,r,color){c.beginPath();c.moveTo(x,y-r);c.lineTo(x+r,y);c.lineTo(x,y+r);c.lineTo(x-r,y);c.closePath();c.fillStyle=color;c.fill();}
function footer(c){text(c,'A CREATIVE PRACTICE',60,488,11,600);text(c,'FIELD NOTES',900,488,11,650,INK,'right')}
function moveWord(c,t){
  const u=cubic(range(t,0,.23)),dy=24*(1-u);c.save();c.globalAlpha=u;
  text(c,'IDEAS TAKE',61,115,20,600);c.restore();
  c.save();c.beginPath();c.rect(50,175,880,180);c.clip();c.translate(0,dy);
  // Display role is a broad grotesk; O is the circular carrier drawn in place.
  text(c,'F',208,346,200,900);c.beginPath();c.arc(OC.x,OC.y,OC.outer,0,Math.PI*2);c.arc(OC.x,OC.y,OC.inner,0,Math.PI*2,true);c.fillStyle=ACCENT;c.fill('evenodd');
  text(c,'RM',502,346,200,900);c.restore();
  c.save();c.globalAlpha=smooth(range(t,.1,.33));text(c,'Make the thought tangible.',62,415,17,450);footer(c);c.restore();
}
function opening(t){
  middle(1.8);bg(f);moveWord(f,t);
  const dy=24*(1-cubic(range(t,0,.23)));
  f.save();f.globalCompositeOperation='destination-out';f.beginPath();f.arc(OC.x,OC.y+dy,OC.inner,0,Math.PI*2);f.fill();f.restore();ctx.drawImage(front,0,0);
}
function geometryState(t){
 const split=smooth(range(t,1.98,2.64))*(1-smooth(range(t,2.84,3.63)));
 const settle=smooth(range(t,3.95,4.57));
 return{split,scale:lerp(1,.295,settle),x:lerp(480,177,settle),y:270,angle:lerp(-.055,0,smooth(range(t,1.8,1.98))),settle};
}
function module(c,t){
 const s=geometryState(t);c.save();c.translate(s.x,s.y);c.scale(s.scale,s.scale);c.rotate(s.angle);
 facets.forEach(facet=>{
   const {centroid:cent,angle,distance,turn}=facet,explode=s.split;
   const tx=Math.cos(angle)*distance*explode,ty=Math.sin(angle)*distance*explode;
   c.save();c.translate(cent[0]+tx,cent[1]+ty);c.rotate(turn*explode);
   c.beginPath();facet.vertices.forEach((v,j)=>{const x=v[0]-cent[0],y=v[1]-cent[1];j?c.lineTo(x,y):c.moveTo(x,y)});c.closePath();c.fillStyle=fills[facet.id];c.fill();
   // Subpixel overlap prevents raster cracks in the landed vector silhouette.
   c.strokeStyle=fills[facet.id];c.lineWidth=.65;c.stroke();c.restore();
 });c.restore();
}
function middle(t){
 bg(ctx);
 const reveal=1-smooth(range(t,3.95,4.2));
 ctx.save();ctx.globalAlpha=reveal;
 text(ctx,'GIVE IDEAS',60,108,19,650);text(ctx,'FORM.',900,460,62,900,INK,'right','Barlow');
 ctx.strokeStyle=INK;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(60,127);ctx.lineTo(900,127);ctx.stroke();
 ctx.restore();
 module(ctx,t);
 const show=smooth(range(t,4.16,4.58));
 ctx.save();ctx.globalAlpha=show;
 ctx.beginPath();ctx.rect(255,199,660,150);ctx.clip();const offset=30*(1-show);
 text(ctx,'FIELD NOTES',260,275+offset,67,900);
 text(ctx,'Ideas become movement.',263,315+offset,20,450);
 ctx.restore();
 ctx.save();ctx.globalAlpha=show;text(ctx,'OBSERVE. SHAPE. MAKE.',60,488,11,600);text(ctx,'A CREATIVE PRACTICE',900,488,11,600,INK,'right');ctx.restore();
}
function portal(t){
 middle(Math.max(t,1.8));
 bg(f);moveWord(f,1);
 const u=easeIn(range(t,1,1.8)),cx=lerp(OC.x,480,smooth(range(t,1,1.8))),cy=OC.y;
 const coverage=Math.max(...corners.map(p=>Math.hypot(p[0]-480,p[1]-cy)))+3;
 const r=lerp(OC.inner,coverage,u),scale=r/OC.inner;
 // Evaluate front scene afresh, transformed about the same O counter.
 bg(f);f.save();f.translate(cx,cy);f.scale(scale,scale);f.translate(-OC.x,-OC.y);moveWord(f,1);f.restore();
 // The old cream field is removed only inside the exact expanding counter.
 f.save();f.globalCompositeOperation='destination-out';f.beginPath();f.arc(cx,cy,r,0,Math.PI*2);f.fill();f.restore();
 ctx.drawImage(front,0,0);
}
function renderFrame(t){t=Math.max(0,Math.min(t,6-1/FPS));ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';if(t<1)opening(t);else if(t<1.8)portal(t);else middle(t);}
window.filmInfo={width:W,height:H,fps:FPS,duration:6,frameCount:180,palette:{cream:CREAM,ink:INK,accent:ACCENT}};
window.renderFrame=renderFrame;window.renderAt=n=>renderFrame(n/FPS);
window.geometryState=geometryState;
window.ready=(async()=>{await document.fonts.load('900 200px Inter');await document.fonts.load('900 62px Barlow');await document.fonts.ready;window.fontChecks={Inter:document.fonts.check('900 200px Inter'),Barlow:document.fonts.check('900 62px Barlow')};renderFrame(0)})();
let playing=false,origin=0;const scrub=document.querySelector('#scrub');
document.querySelector('#play').onclick=async()=>{await window.ready;playing=!playing;origin=performance.now()-Number(scrub.value)*1000;if(playing)requestAnimationFrame(tick)};
scrub.oninput=()=>{playing=false;renderFrame(Number(scrub.value))};
function tick(now){if(!playing)return;const t=((now-origin)/1000)%6;renderFrame(t);scrub.value=t;requestAnimationFrame(tick)}
