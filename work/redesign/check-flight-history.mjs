import { Browser } from '/Users/luongtricuong/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import assert from 'node:assert/strict';
const browser=await Browser.launch();
try {
 const page=await browser.newPage({width:1440,height:1000});
 await page.goto('http://localhost:3000/',{settleMs:1200});
 assert.match(await page.eval(()=>document.querySelector('.flight-pass-toolbar').textContent),/92 flights/);
 assert.equal(await page.eval(()=>document.querySelectorAll('li[data-cycle="1"]').length),65);
 assert.ok(await page.eval(()=>[...document.querySelectorAll('[data-route]')].some(p=>p.dataset.route==='CAN-PEK')));
 assert.ok(await page.eval(()=>[...document.querySelectorAll('[data-route]')].every(p=>!p.getAttribute('d').includes('NaN'))));
 await page.eval(()=>document.querySelector('button[aria-label="Show whole world"]').click());
 assert.match(await page.eval(()=>document.querySelector('.flight-map-geography').getAttribute('transform')),/scale\(1\)/);
 assert.deepEqual(page.consoleErrors,[]);
 console.log('Browser: 92 flights, 65 passes, historical routes valid, whole-world view works, no script errors.');
} finally {await browser.close();}
