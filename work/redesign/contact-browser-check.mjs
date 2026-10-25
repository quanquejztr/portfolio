import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
import { Browser, sleep } from '/Users/luongtricuong/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
const root=resolve('build');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
let reject=false; const requests=[];
const server=createServer((req,res)=>{
 if(req.method==='POST'){
  let body=''; req.on('data',chunk=>body+=chunk); req.on('end',()=>{
   requests.push({path:req.url,headers:req.headers,body});
   setTimeout(()=>{res.writeHead(reject?503:200,{'Content-Type':'text/plain'});res.end(reject?'Unavailable':'Accepted');},250);
  }); return;
 }
 const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!path.startsWith(root+'/')&&path!==root){res.writeHead(403);return res.end();}
 const file=path===root?resolve(root,'index.html'):path;
 if(!existsSync(file)){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.end(readFileSync(file));
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
const browser=await Browser.launch({extraArgs:['--host-resolver-rules=MAP portfolio.test 127.0.0.1']});
try {
 const page=await browser.newPage({width:1440,height:900});
 await page.goto(`http://portfolio.test:${server.address().port}/`,{settleMs:800});
 await page.eval(()=>{document.querySelector('.contact-message').open=true;document.querySelector('#contact').scrollIntoView({behavior:'instant'});});
 const fill=async()=>{
  for(const [id,text] of [['contact-sender','Alex & Sam'],['contact-email','alex@example.com'],['contact-message','A browser test message']]){
   await page.eval(id=>document.getElementById(id).focus(),id);await page.send('Input.insertText',{text});
  }
 };
 await fill();
 await page.eval(()=>document.querySelector('.contact-send-button').click());
 assert.equal(await page.eval(()=>document.querySelector('.contact-send-button').disabled),true);
 await sleep(650);
 assert.match(await page.eval(()=>document.querySelector('.contact-form-status').textContent),/has been submitted/);
 assert.equal(requests.length,1);
 const body=new URLSearchParams(requests[0].body);
 assert.equal(body.get('form-name'),'contact');assert.equal(body.get('name'),'Alex & Sam');
 assert.equal(body.get('email'),'alex@example.com');assert.equal(body.get('message'),'A browser test message');assert.equal(body.get('bot-field'),'');
 assert.equal(await page.eval(()=>document.querySelector('#contact-message').value),'');
 reject=true;await fill();await page.eval(()=>document.querySelector('.contact-send-button').click());await sleep(650);
 assert.match(await page.eval(()=>document.querySelector('[role="alert"]').textContent),/couldn’t be sent/);
 assert.equal(await page.eval(()=>document.querySelector('#contact-message').value),'A browser test message');
 assert.equal(await page.eval(()=>document.querySelector('.contact-send-button').disabled),false);
 await page.screenshot({path:'.taste-skill/redesign/interaction-checks/contact-form-error-1440.jpg'});
 assert.deepEqual(page.consoleErrors,[]);
 console.log('Real-browser form test passed against a local mock endpoint: URL-encoded fields, pending state, accepted submission, field reset, HTTP failure, preserved message, retry. No email was sent.');
}finally{await browser.close();server.close();}
