import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';

export function loadPlaywright(moduleRoot) {
  const require=createRequire(import.meta.url);
  try {return moduleRoot?require(path.resolve(moduleRoot,'playwright')):require('playwright');}
  catch(error){throw new Error('Playwright is unavailable. Run npm install and npx playwright install chromium, or supply --module-root pointing to an existing node_modules directory.',{cause:error});}
}

export async function serve(root) {
  const absolute=fs.realpathSync(path.resolve(root));
  const mime={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.ttf':'font/ttf','.woff2':'font/woff2','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.wav':'audio/wav','.mp4':'video/mp4'};
  const server=http.createServer((request,response)=>{
    const port=server.address()?.port;
    if(![`127.0.0.1:${port}`,`localhost:${port}`].includes(request.headers.host)){response.writeHead(403);response.end();return;}
    if(!['GET','HEAD'].includes(request.method)){response.writeHead(405,{'Allow':'GET, HEAD'});response.end();return;}
    let decoded;
    try{decoded=decodeURIComponent(new URL(request.url,'http://localhost').pathname);}catch{response.writeHead(400);response.end();return;}
    if(decoded.split(/[\\/]/).some(part=>part.startsWith('.')||/\.(?:pem|key|p12|pfx)$/i.test(part))){response.writeHead(403);response.end();return;}
    const target=path.resolve(absolute,`.${decoded}`);
    const relative=path.relative(absolute,target);
    if(relative.startsWith('..')||path.isAbsolute(relative)){response.writeHead(403);response.end();return;}
    try{
      // realpath also blocks symlink escapes from the served directory.
      const actual=fs.realpathSync(target),actualRelative=path.relative(absolute,actual);
      if(actualRelative.startsWith('..')||path.isAbsolute(actualRelative)){response.writeHead(403);response.end();return;}
      const stat=fs.statSync(actual);
      if(!stat.isFile()){response.writeHead(404);response.end();return;}
      const headers={'Content-Type':mime[path.extname(actual)]??'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
      let start=0,end=stat.size-1,status=200;
      if(request.headers.range){
        const match=/^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
        if(!match||(!match[1]&&!match[2])){response.writeHead(416,{'Content-Range':`bytes */${stat.size}`});response.end();return;}
        if(match[1]){start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),end):end;}
        else{const length=Number(match[2]);start=Math.max(0,stat.size-length);}
        if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>end||start>=stat.size){response.writeHead(416,{'Content-Range':`bytes */${stat.size}`});response.end();return;}
        status=206;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
      }
      headers['Content-Length']=Math.max(0,end-start+1);
      response.writeHead(status,headers);
      if(request.method==='HEAD'||stat.size===0){response.end();return;}
      const stream=fs.createReadStream(actual,{start,end});stream.on('error',()=>response.destroy());response.on('close',()=>stream.destroy());stream.pipe(response);
    }catch{response.writeHead(404);response.end();}
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  return {server,url:`http://127.0.0.1:${server.address().port}`,close:()=>new Promise(resolve=>server.close(resolve))};
}

export async function openFilm({root,entry,moduleRoot,width=1920,height=1080}) {
  const relative=path.relative(path.resolve(root),path.resolve(entry));
  if(relative.startsWith('..')||path.isAbsolute(relative))throw new Error('Entry must be inside the served project root');
  const host=await serve(root);
  let browser;
  try{
    browser=await loadPlaywright(moduleRoot).chromium.launch({headless:true});
    const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
    const url=host.url+'/'+relative.split(path.sep).map(encodeURIComponent).join('/');
    await page.goto(url,{waitUntil:'networkidle'});
    await page.addStyleTag({content:'.render-mode main{padding:0;display:block;min-height:0}.render-mode canvas{display:block;width:100vw!important;height:100vh!important;max-width:none!important}.render-mode footer{display:none!important}html,body{margin:0!important;overflow:hidden!important}'});
    await page.evaluate(()=>document.documentElement.classList.add('render-mode'));
    await page.waitForFunction(()=>typeof window.renderFrame==='function',{},{timeout:20000});
    await page.evaluate(async()=>{await window.ready;});
    if(errors.length)throw new Error(errors.join('\n'));
    return {page,browser,host,errors,canvas:page.locator('canvas').first(),close:async()=>{await browser.close();await host.close();}};
  }catch(error){if(browser)await browser.close();await host.close();throw error;}
}
