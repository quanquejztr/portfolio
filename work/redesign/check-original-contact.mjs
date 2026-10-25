import { Browser, sleep } from '/Users/luongtricuong/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import assert from 'node:assert/strict';
const browser = await Browser.launch();
try {
 for (const width of [1440,390]) {
  const page = await browser.newPage({width,height:900,mobile:width===390});
  await page.goto('http://localhost:3000/',{settleMs:1200});
  await page.eval(()=>document.fonts.ready);
  await page.eval(()=>document.querySelector('#contact').scrollIntoView({behavior:'instant'}));
  await sleep(800);
  assert.ok(await page.eval(()=>document.documentElement.scrollWidth<=innerWidth+1));
  assert.equal(await page.eval(()=>document.querySelector('.original-message-box').getAttribute('name')),'contact');
  await page.eval(()=>document.querySelector('#contact-sender').focus());
  await page.send('Input.insertText',{text:'Alex'});
  await page.eval(()=>document.querySelector('#contact-email').focus());
  await page.send('Input.insertText',{text:'alex@example.com'});
  await page.eval(()=>document.querySelector('#contact-message').focus());
  await page.send('Input.insertText',{text:'Hello Cuong'});
  await page.eval(()=>document.querySelector('.contact-send-button').click());
  await sleep(400);
  assert.match(await page.eval(()=>document.querySelector('.contact-form-status').textContent),/published site/);
  await page.eval(()=>document.querySelector('#contact').scrollIntoView({behavior:'instant'}));
  await page.screenshot({path:`/Users/luongtricuong/portfolio/.taste-skill/redesign/interaction-checks/original-contact-${width}.jpg`});
  assert.deepEqual(page.consoleErrors,[]);
  console.log(`${width}px: original box visible; no overflow; direct form and preview guard work.`);
 }
} finally { await browser.close(); }
