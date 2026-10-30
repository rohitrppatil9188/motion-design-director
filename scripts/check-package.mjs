import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const ignored=new Set(['.git','node_modules','out','dist','coverage','__pycache__']);
const binary=new Set(['.ttf','.mp4','.png','.jpg','.jpeg','.webp']);
const errors=[];
const hash=data=>createHash('sha256').update(data).digest('hex');
function walk(directory){
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
    if(ignored.has(entry.name))return [];
    const absolute=path.join(directory,entry.name);
    if(entry.isSymbolicLink()){errors.push(`${path.relative(root,absolute)}: symlinks are not distributable`);return [];}
    return entry.isDirectory()?walk(absolute):[absolute];
  });
}
const files=walk(root).sort();
const patterns=[
  ['GitHub token',/\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{30,})\b/g],
  ['cloud access key',/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ['API credential',/\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{24,}|AIza[A-Za-z0-9_-]{30,}|xox[baprs]-[A-Za-z0-9-]{20,})\b/g],
  ['private key',/-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g],
  ['private machine path',/(?<![A-Za-z0-9_])(?:[A-Za-z]:[\\/]|\/Users\/|\/home\/)[^\s<>"\r\n]{2,}/g],
  ['credential assignment',/"(?:api_key|access_token|client_secret|secret_access_key|password)"\s*:\s*"[^"\s]{16,}"/gi],
];
const records=[];
for(const file of files){
  const relative=path.relative(root,file).split(path.sep).join('/');
  if(relative==='PACKAGE-MANIFEST.json')continue;
  if(relative.split('/').some(part=>/^\.env(?:\.|$)|^\.npmrc$|\.(?:pem|key|p12|pfx)$/i.test(part)))errors.push(`${relative}: forbidden credential/config filename`);
  const data=fs.readFileSync(file);
  if(!binary.has(path.extname(file).toLowerCase())){
    const text=data.toString('utf8');
    for(const [name,pattern] of patterns){
      pattern.lastIndex=0;const match=pattern.exec(text);
      if(match){const line=text.slice(0,match.index).split('\n').length;errors.push(`${relative}:${line}: ${name} pattern (value suppressed)`);}
    }
    if(file.endsWith('.json')){try{JSON.parse(text);}catch{errors.push(`${relative}: invalid JSON`);}}
    if(file.endsWith('.md'))for(const match of text.matchAll(/\]\(([^)]+)\)/g)){
      const target=match[1].replace(/^<|>$/g,'').split('#')[0];
      if(!target||/^(?:https?:|mailto:)/.test(target))continue;
      const resolved=path.resolve(path.dirname(file),decodeURIComponent(target));
      if(!fs.existsSync(resolved))errors.push(`${relative}: missing local link ${target}`);
    }
  }
  records.push({path:relative,bytes:data.length,sha256:hash(data)});
}
for(const name of ['README.md','LICENSE','INSTALL.md','THIRD_PARTY_NOTICES.md','CONTRIBUTING.md','SECURITY.md','SKILL.md'])if(!fs.existsSync(path.join(root,name)))errors.push(`Missing ${name}`);
const skill=fs.readFileSync(path.join(root,'SKILL.md'),'utf8');
if(!/^---\r?\nname: motion-design-director\r?\n/m.test(skill)||!skill.includes('description:'))errors.push('Invalid skill entry metadata');
const sources=JSON.parse(fs.readFileSync(path.join(root,'references/source-attributions.json'),'utf8'));
if(sources.length!==50||new Set(sources.map(s=>s.source_sha256)).size!==50)errors.push('Corpus must contain 50 distinct source hashes');
let frames=0;
for(const source of sources){
  const csv=fs.readFileSync(path.join(root,`references/measurements/frames/${source.id}.csv`),'utf8').trim().split(/\r?\n/);
  if(csv.length-1!==source.frames)errors.push(`${source.id}: frame count mismatch`);
  let previous=-Infinity;
  for(const row of csv.slice(1)){const time=Number(row.split(',')[1]);if(!Number.isFinite(time)||time<previous){errors.push(`${source.id}: invalid frame timestamps`);break;}previous=time;}
  frames+=source.frames;
}
if(frames!==40056)errors.push('Corpus total must be 40,056 native frames');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
records.sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
const manifest={name:pkg.name,version:pkg.version,licence:'MIT; font exceptions in THIRD_PARTY_NOTICES.md',filmsStudied:50,nativeFramesMeasured:frames,creatorMediaIncluded:false,files:records};
const destination=path.join(root,'PACKAGE-MANIFEST.json');
if(process.argv.includes('--write-manifest')){
  if(errors.length)throw new Error(errors.join('\n'));
  fs.writeFileSync(destination,JSON.stringify(manifest,null,2)+'\n');
}else{
  if(!fs.existsSync(destination))errors.push('Manifest missing; run npm run manifest');
  else if(JSON.stringify(JSON.parse(fs.readFileSync(destination,'utf8')))!==JSON.stringify(manifest))errors.push('Manifest is stale; review changes, then run npm run manifest');
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log(JSON.stringify({passed:true,distributableFiles:records.length+1,studies:50,nativeFrameRows:frames,privacyPatterns:'no matches',localMarkdownLinks:'resolved',manifest:'current'}));
