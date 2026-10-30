import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {serve} from '../scripts/render-utils.mjs';
import {spring01,spherePoint,torusPoint,fitFont} from '../scripts/motion-math.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
async function fixture(t){
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'motion-director-test-'));
  const project=path.join(temp,'project');fs.mkdirSync(project);
  fs.writeFileSync(path.join(project,'index.html'),'<!doctype html><title>Public fixture</title>');
  fs.writeFileSync(path.join(project,'clip.mp4'),'0123456789abcdef');
  fs.writeFileSync(path.join(project,'.env'),'fixture configuration');
  fs.mkdirSync(path.join(project,'.git'));fs.writeFileSync(path.join(project,'.git','config'),'fixture git metadata');
  fs.writeFileSync(path.join(temp,'outside.txt'),'outside fixture');
  const host=await serve(project);
  t.after(async()=>{await host.close();const target=path.resolve(temp);assert.equal(path.dirname(target),path.resolve(os.tmpdir()));assert.ok(path.basename(target).startsWith('motion-director-test-'));fs.rmSync(target,{recursive:true,force:true});});
  return {...host,temp,project};
}
function request(host,urlPath,options={}){
  return new Promise((resolve,reject)=>{
    const req=http.request(host.url+urlPath,options,res=>{const chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks).toString()}));});req.on('error',reject);req.end();
  });
}
test('preview serves public files and HEAD without a body',async t=>{
  const host=await fixture(t);const page=await request(host,'/index.html');assert.equal(page.status,200);assert.match(page.body,/Public fixture/);
  const head=await request(host,'/clip.mp4',{method:'HEAD'});assert.equal(head.status,200);assert.equal(head.body,'');assert.equal(Number(head.headers['content-length']),16);
});
test('preview refuses hidden configuration and Git metadata',async t=>{
  const host=await fixture(t);
  for(const name of ['/.env','/.git/config']){const r=await request(host,name);assert.equal(r.status,403,name);assert.ok(!r.body.includes('fixture'));}
});
test('preview validates Host and HTTP method',async t=>{
  const host=await fixture(t);assert.equal((await request(host,'/index.html',{headers:{Host:'untrusted.test'}})).status,403);
  assert.equal((await request(host,'/index.html',{method:'POST'})).status,405);
});
test('preview provides bounded byte ranges for video seeking',async t=>{
  const host=await fixture(t);const r=await request(host,'/clip.mp4',{headers:{Range:'bytes=2-5'}});
  assert.equal(r.status,206);assert.equal(r.body,'2345');assert.equal(r.headers['content-range'],'bytes 2-5/16');assert.equal(r.headers['content-type'],'video/mp4');
  assert.equal((await request(host,'/clip.mp4',{headers:{Range:'bytes=99-100'}})).status,416);
});
test('preview blocks traversal and symlink escapes',async t=>{
  const host=await fixture(t);const escaped=await request(host,'/..%2foutside.txt');assert.ok([403,404].includes(escaped.status));assert.ok(!escaped.body.includes('outside fixture'));
  try{fs.symlinkSync(path.join(host.temp,'outside.txt'),path.join(host.project,'linked.txt'),'file');}
  catch(error){if(['EPERM','EACCES'].includes(error.code)){t.diagnostic('Symlink creation unavailable on this Windows account');return;}throw error;}
  assert.equal((await request(host,'/linked.txt')).status,403);
});
test('media verifier rejects nonnumeric expected values before probing',()=>{
  const r=spawnSync(process.execPath,['scripts/verify-media.mjs','--input','assets/example/rendered/offset.mp4','--fps','not-a-number'],{cwd:root,encoding:'utf8',windowsHide:true});
  assert.notEqual(r.status,0);assert.match(r.stderr,/Invalid --fps/);
});
test('motion helpers reject degenerate parameters',()=>{
  assert.throws(()=>spring01(.4,7.5,0),/cycles/);
  assert.throws(()=>spherePoint(.5,100),/sphere/);
  assert.throws(()=>torusPoint(0,0),/torus/);
});
test('font fitting returns a whole-pixel size within both ink bounds',()=>{
  const ctx={font:'',measureText(text){const size=Number(/ ([\d.]+)px /.exec(this.font)[1]);const width=text.length*size*.6;return {actualBoundingBoxLeft:0,actualBoundingBoxRight:width,actualBoundingBoxAscent:size*.75,actualBoundingBoxDescent:size*.2,width};}};
  const fit=fitFont(ctx,'SIZE','Example',900,120,40,200);
  assert.ok(Number.isInteger(fit.size),'Subpixel fitting can depend on browser font-cache quantization');
  assert.equal(fit.size,42);assert.ok(fit.right-fit.left<=120);assert.ok(fit.bottom-fit.top<=40);
  assert.throws(()=>fitFont(ctx,'SIZE','Example',900,.1,.1,200),/fit/);
});
