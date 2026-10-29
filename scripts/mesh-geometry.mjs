// Original triangular mesh helpers. This constructs geometry; lighting,
// clipping and depth-buffered rendering still belong to the chosen engine.
import {clamp,hash01} from './motion-math.mjs';
const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y,z:a.z-b.z});
const add=(a,b)=>({x:a.x+b.x,y:a.y+b.y,z:a.z+b.z});
const mul=(a,s)=>({x:a.x*s,y:a.y*s,z:a.z*s});
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const cross=(a,b)=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
const unit=a=>{const length=Math.hypot(a.x,a.y,a.z);if(length<1e-12)throw new Error('Degenerate normal/axis');return mul(a,1/length);};
function rotateAxis(p,axis,angle){
  const c=Math.cos(angle),s=Math.sin(angle);
  return add(add(mul(p,c),mul(cross(axis,p),s)),mul(axis,dot(axis,p)*(1-c)));
}

export function makeFacets(vertices,triangles){
  return triangles.map((indices,id)=>{
    if(indices.length!==3||indices.some(i=>!Number.isInteger(i)||!vertices[i]))throw new Error(`Invalid triangle ${id}`);
    const points=indices.map(i=>({...vertices[i]}));
    if(points.some(p=>![p.x,p.y,p.z].every(Number.isFinite)))throw new Error('Nonfinite mesh vertex');
    const centroid=mul(points.reduce(add,{x:0,y:0,z:0}),1/3);
    const normal=unit(cross(sub(points[1],points[0]),sub(points[2],points[0])));
    const area=Math.hypot(...Object.values(cross(sub(points[1],points[0]),sub(points[2],points[0]))))*.5;
    return {id,points,centroid,normal,area};
  });
}

export function cubeFacets(size=2){
  if(!(size>0&&Number.isFinite(size)))throw new RangeError('Cube size must be positive');
  const h=size/2;
  const vertices=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(([x,y,z])=>({x:x*h,y:y*h,z:z*h}));
  return makeFacets(vertices,[[0,2,1],[0,3,2],[4,5,6],[4,6,7],[0,4,7],[0,7,3],[1,2,6],[1,6,5],[0,1,5],[0,5,4],[3,7,6],[3,6,2]]);
}

export function facetPose(facet,amount,{distance=100,spin=.7,seed=17}={}){
  const u=clamp(amount);
  if(u===0)return {id:facet.id,points:facet.points.map(p=>({...p})),centroid:{...facet.centroid},normal:{...facet.normal}};
  const axis=unit({x:hash01(facet.id*3,seed)*2-1,y:hash01(facet.id*3+1,seed)*2-1,z:hash01(facet.id*3+2,seed)*2-1});
  const angle=(hash01(facet.id,seed+1)*2-1)*spin*u;
  const centroid=add(facet.centroid,mul(facet.normal,distance*u));
  return {id:facet.id,centroid,normal:rotateAxis(facet.normal,axis,angle),points:facet.points.map(p=>add(centroid,rotateAxis(sub(p,facet.centroid),axis,angle)))};
}
