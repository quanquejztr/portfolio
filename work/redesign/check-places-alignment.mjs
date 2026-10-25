import { Browser, sleep } from '/Users/luongtricuong/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import assert from 'node:assert/strict';
const browser=await Browser.launch();
try {
 for(const width of [1440,768,390]) {
 const page=await browser.newPage({width,height:1000,mobile:width===390});
 await page.goto('http://localhost:3000/',{settleMs:1200});
 await page.eval(()=>document.fonts.ready);
 await page.eval(()=>document.querySelector('#boarding-passes').scrollIntoView({behavior:'instant'}));
 await sleep(750);
 const bounds=await page.eval(()=>{ const project=document.querySelector('.selected-work').getBoundingClientRect(), places=document.querySelector('.flight-archive-split').getBoundingClientRect(); return {project:{x:project.x,width:project.width},places:{x:places.x,width:places.width}}; });
 assert.ok(Math.abs(bounds.project.x-bounds.places.x)<1);
 assert.ok(Math.abs(bounds.project.width-bounds.places.width)<1);
 assert.ok(await page.eval(()=>document.documentElement.scrollWidth<=innerWidth+1));
 assert.equal(await page.eval(()=>document.querySelectorAll('.wallet-pass-focused').length),1);
 await page.screenshot({path:`/Users/luongtricuong/portfolio/.taste-skill/redesign/interaction-checks/places-aligned-${width}.jpg`});
 console.log(`${width}px: Places content matches Projects edges; no overflow; one focused pass.`);
 }
} finally {await browser.close();}
