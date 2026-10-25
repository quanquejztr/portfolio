import { Browser } from '/Users/luongtricuong/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import assert from 'node:assert/strict';
const browser=await Browser.launch();
try {
 for(const width of [1440,390]) {
 const page=await browser.newPage({width,height:900,mobile:width===390});
 await page.goto('http://localhost:3000/',{settleMs:900});
 const labels=await page.eval(()=>[...document.querySelectorAll('.hero-nav button')].map(b=>b.textContent));
 assert.deepEqual(labels,['About','Timeline','Tech Stack','Projects','Places I Have Been','Contact']);
 const targets=await page.eval(()=>['about','timeline','tech-stack','projects','boarding-passes','contact'].every(id=>document.getElementById(id)));
 assert.ok(targets);
 assert.ok(await page.eval(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.screenshot({path:`/Users/luongtricuong/portfolio/.taste-skill/redesign/interaction-checks/menu-${width}.jpg`});
 console.log(`${width}px: all six sections present, resume removed, no overflow.`);
 }
} finally { await browser.close(); }
