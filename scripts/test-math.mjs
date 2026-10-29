import assert from 'node:assert/strict';
import {clamp, cubicBezier, spring01, hash01, polarContour, morphContours, project3, rotate3, spherePoint, torusPoint, coverRadius, progress} from './motion-math.mjs';
import {cubeFacets,facetPose,makeFacets} from './mesh-geometry.mjs';

const close = (a, b, eps = 1e-7) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);
const linear = cubicBezier(1 / 3, 1 / 3, 2 / 3, 2 / 3);
for (let i = 0; i <= 100; i++) close(linear(i / 100), i / 100);
assert.throws(() => cubicBezier(-0.1, 0, 1, 1));
assert.throws(() => progress(0, 1, 1));
close(spring01(0), 0); close(spring01(1), 1);
assert.ok(spring01(0.6) > 1, 'Spring should demonstrate a restrained overshoot');
for (let i = 0; i < 1000; i++) assert.ok(Number.isFinite(spring01(i / 999)));
const ids = [27, 0, 99, 3, 27];
assert.equal(ids.map(i => hash01(i, 17))[0], ids.map(i => hash01(i, 17))[4]);
assert.ok(new Set(Array.from({length:1000}, (_, i) => hash01(i))).size > 990);
const a = polarContour({count:96, radius:200}), b = polarContour({count:96, radius:200, sides:4});
assert.deepEqual(morphContours(a, b, 0).map(({x,y})=>({x,y})), a);
assert.deepEqual(morphContours(a, b, 1).map(({x,y})=>({x,y})), b);
assert.throws(() => morphContours(a, b.slice(1), 0.5));
assert.equal(project3({x:0,y:0,z:-1050}), null);
const p = project3({x:100,y:50,z:0}); close(p.x,1060); close(p.y,590);
const r = rotate3({x:1,y:0,z:0}, 0,Math.PI/2); close(r.x,0); close(r.z,-1);
for (let i=0;i<500;i++) {
  const s=spherePoint(i,500,3); close(Math.hypot(s.x,s.y,s.z),3);
  const t=torusPoint(i,500,3,1); assert.ok(Math.hypot(t.x,t.z)>=2-1e-9 && Math.hypot(t.x,t.z)<=4+1e-9);
}
const radius=coverRadius(230,740,1920,1080);
for (const [x,y] of [[0,0],[1920,0],[0,1080],[1920,1080]]) assert.ok(Math.hypot(x-230,y-740)<radius);
assert.equal(clamp(-1),0); assert.equal(clamp(3),1);
const cube=cubeFacets(2);assert.equal(cube.length,12);close(cube.reduce((s,f)=>s+f.area,0),24);
for(const facet of cube){
  assert.ok(facet.normal.x*facet.centroid.x+facet.normal.y*facet.centroid.y+facet.normal.z*facet.centroid.z>0,'Cube normal points inward');
  assert.deepEqual(facetPose(facet,0).points,facet.points);
  const moved=facetPose(facet,1,{distance:10});assert.ok(moved.points.every(p=>Object.values(p).every(Number.isFinite)));
  close(Math.hypot(moved.centroid.x-facet.centroid.x,moved.centroid.y-facet.centroid.y,moved.centroid.z-facet.centroid.z),10);
  assert.deepEqual(facetPose(facet,0).points,facet.points,'Reassembly drifted');
}
assert.throws(()=>makeFacets([{x:0,y:0,z:0}],[[0,0,0]]));
console.log('Motion invariants passed: Bezier inversion, spring endpoints, stable IDs, contour and facet correspondence, outward mesh normals, exact reassembly, camera clipping, volume geometry, aperture coverage.');
