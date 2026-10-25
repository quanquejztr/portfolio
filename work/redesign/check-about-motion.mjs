import { Browser, sleep } from '/Users/luongtricuong/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import assert from 'node:assert/strict';
const browser=await Browser.launch();
try {
 for(const width of [1440,390]) {
 const page=await browser.newPage({width,height:1000,mobile:width===390});
 await page.goto('http://localhost:3000/',{settleMs:1200});
 await page.eval(()=>document.fonts.ready);
 await page.eval(()=>document.querySelector('.about-section').scrollIntoView({behavior:'instant'}));
 await sleep(700);
 const before=await page.eval(()=>document.querySelector('.about-content').getBoundingClientRect().width);
 await page.eval(()=>document.querySelector('.team-trigger').click());
 await sleep(120);
 const middle=await page.eval(()=>document.querySelector('.about-content').getBoundingClientRect().width);
 await sleep(850);
 const after=await page.eval(()=>document.querySelector('.about-content').getBoundingClientRect().width);
 if(width>800) assert.ok(middle>before+1 && middle<after-1,JSON.stringify({before,middle,after}));
 assert.ok(await page.eval(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.eval(()=>document.querySelector('.about-section').scrollIntoView({behavior:'instant'}));
 await page.screenshot({path:`/Users/luongtricuong/portfolio/.taste-skill/redesign/interaction-checks/about-smooth-${width}.jpg`});
 await page.eval(()=>document.querySelector('button[aria-label="Close team photo preview"]').click());
 await sleep(850);
 const closed=await page.eval(()=>document.querySelector('.about-content').getBoundingClientRect().width);
 assert.ok(Math.abs(closed-before)<1);
 assert.equal(await page.eval(()=>document.activeElement.classList.contains('team-trigger')),true);
 console.log(`${width}px: opening and closing verified; ${JSON.stringify({before,middle,after})}; no overflow.`);
 }
} finally {await browser.close();}
