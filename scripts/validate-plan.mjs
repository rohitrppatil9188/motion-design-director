// Dependency-free semantic timing checks. The JSON Schema also supports full
// structural validation with any draft-2020-12 JSON Schema validator.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const file=path.resolve(process.argv[2]??'assets/example/shot-plan.json');
const p=JSON.parse(fs.readFileSync(file,'utf8'));
assert.ok(p.title&&p.direction&&p.invariants?.length,'Direction/title/invariants are required');
const f=p.format;
for(const key of ['width','height','frameCount'])assert.ok(Number.isInteger(f[key])&&f[key]>0,`Invalid ${key}`);
assert.ok(Number.isFinite(f.fps)&&f.fps>0&&Number.isFinite(f.durationSeconds)&&f.durationSeconds>0,'Invalid timebase');
assert.equal(f.frameCount,Math.round(f.fps*f.durationSeconds),'Duration/frame count mismatch');
assert.ok(p.shots?.length,'At least one shot is required');
let next=0;const ids=new Set();
for(const s of p.shots){
  assert.ok(s.id&&!ids.has(s.id),'Shot IDs must be unique');ids.add(s.id);
  assert.equal(s.startFrame,next,`${s.id}: timeline gap/overlap`);
  assert.ok(Number.isInteger(s.endFrame)&&s.endFrame>s.startFrame,`${s.id}: invalid range`);
  for(const k of ['enterFrames','holdFrames','exitFrames'])assert.ok(Number.isInteger(s[k])&&s[k]>=0,`${s.id}: invalid ${k}`);
  assert.equal(s.enterFrames+s.holdFrames+s.exitFrames,s.endFrame-s.startFrame,`${s.id}: phases must cover the shot`);
  assert.ok(s.objects?.length&&s.motionLaw&&s.transition&&s.inherited,`${s.id}: missing construction/handoff`);
  next=s.endFrame;
}
assert.equal(next,f.frameCount,'Final shot does not end at frameCount');
assert.equal(p.audio.samples,Math.round(f.durationSeconds*p.audio.sampleRate),'Audio sample count mismatch');
for(const e of p.audioEvents)assert.ok(Number.isFinite(e.seconds)&&e.seconds>=0&&e.seconds<f.durationSeconds&&e.role,'Invalid audio event');
if(p.densityCurve){let previous=-Infinity;for(const e of p.densityCurve){assert.ok(Number.isFinite(e.seconds)&&e.seconds>=previous&&e.seconds>=0&&e.seconds<=f.durationSeconds&&Number.isFinite(e.density)&&e.density>=0&&e.density<=1,'Invalid density curve');previous=e.seconds;}}
for(const font of p.fonts)assert.ok(font.licence&&fs.existsSync(path.resolve(path.dirname(file),font.file)),`Missing font/licence: ${font.file}`);
console.log(JSON.stringify({passed:true,file,shots:p.shots.length,frames:f.frameCount,audioSamples:p.audio.samples}));
