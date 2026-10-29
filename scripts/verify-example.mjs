import assert from 'node:assert/strict';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {parseArgs} from 'node:util';
import {openFilm} from './render-utils.mjs';

const {values:v}=parseArgs({options:{'module-root':{type:'string'},output:{type:'string',default:'out/browser-verification.json'}}});
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const film=await openFilm({root,entry:path.join(root,'assets/example/index.html'),moduleRoot:v['module-root'],width:960,height:540});
try{
  const info=await film.page.evaluate(()=>({info:window.filmInfo,fonts:[...document.fonts].map(f=>({family:f.family,status:f.status}))}));
  assert.equal(info.info.frameCount,900);
  assert.ok(info.fonts.every(f=>f.status==='loaded'));
  const frames=[0,60,112,113,280,281,449,450,540,618,619,700,787,788,840,899];
  const hashes={};
  for(const f of frames){await film.page.evaluate(n=>window.renderAt(n),f);hashes[f]=createHash('sha256').update(await film.canvas.screenshot({type:'png'})).digest('hex');}
  for(const f of [...frames].reverse()){
    await film.page.evaluate(n=>window.renderAt(n),f);
    assert.equal(createHash('sha256').update(await film.canvas.screenshot({type:'png'})).digest('hex'),hashes[f],`Out-of-order frame ${f} changed`);
  }
  assert.equal(hashes[840],hashes[899],'Closing hold is not stable');
  for(const f of [113,281,450,619,788]){
    const colours=await film.page.evaluate(n=>{window.renderAt(n);const c=document.querySelector('canvas').getContext('2d');const a=c.getImageData(0,0,1920,1080).data;const keys=new Map();for(let i=0;i<a.length;i+=4*127){const key=`${a[i]},${a[i+1]},${a[i+2]}`;keys.set(key,(keys.get(key)??0)+1);}return [...keys];},f);
    assert.equal(colours.length,1,`Curtain has uncovered pixels at ${f}: ${JSON.stringify(colours)}`);
  }
  assert.deepEqual(film.errors,[]);
  const report={passed:true,checks:['font loading','16 out-of-order seek hashes','stable final hold','five full-coverage transition boundaries','no browser errors'],info,hashes};
  const output=path.resolve(v.output);fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({passed:true,report:output,checks:report.checks}));
}finally{await film.close();}
