import { Browser, sleep } from '/Users/luongtricuong/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { mkdirSync } from 'node:fs';
const browser=await Browser.launch();
try {
 const page=await browser.newPage({width:1440,height:900});
 await page.goto('http://127.0.0.1:8877/',{settleMs:2500});
 await page.eval(() => document.querySelector('button[data-win="catalog"]').click());
 await sleep(1200);
 console.log(await page.eval(() => ({text:document.body.innerText.slice(0,2400),errors:[...document.querySelectorAll('img')].filter(i=>!i.complete||!i.naturalWidth).length})));
 mkdirSync('.taste-skill/redesign/airside',{recursive:true});
 await page.screenshot({path:'.taste-skill/redesign/airside/catalog.png',format:'png'});
}finally{await browser.close();}
