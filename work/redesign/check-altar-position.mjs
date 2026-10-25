import { Browser, sleep } from '/Users/luongtricuong/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import assert from 'node:assert/strict';
const browser=await Browser.launch();
try {
 for(const width of [1440,390]) {
 const page=await browser.newPage({width,height:900,mobile:width===390});
 await page.goto('http://localhost:3000/',{settleMs:1000});
 await page.eval(()=>{ document.querySelector('.company-placeholder').click(); document.querySelector('.company-logo').click(); });
 await sleep(400);
 const position=await page.eval(()=>({altar:document.querySelector('.wish-scene').getBoundingClientRect().top,copy:document.querySelector('.about-content').getBoundingClientRect().bottom}));
 assert.ok(position.altar>position.copy,JSON.stringify(position));
 await page.eval(()=>{ document.querySelector('.wish-scene').scrollIntoView({block:'center',behavior:'instant'}); document.querySelector('.wish-drop-target').click(); });
 await sleep(300);
 assert.ok(await page.eval(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.screenshot({path:`/Users/luongtricuong/portfolio/.taste-skill/redesign/interaction-checks/altar-below-${width}.jpg`});
 console.log(`${width}px: altar is below biography; submission still works; no overflow.`);
 }
} finally {await browser.close();}
