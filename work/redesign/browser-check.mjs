import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
import { Browser, sleep } from '/Users/luongtricuong/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
const root = resolve('build');
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.glb':'model/gltf-binary'};
const server = createServer((req,res) => {
  const path = resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if (!path.startsWith(root + '/') && path !== root) { res.writeHead(403); return res.end(); }
  const file = path === root ? resolve(root,'index.html') : path;
  if (!existsSync(file)) { res.writeHead(404); return res.end(); }
  res.setHeader('Content-Type',mime[extname(file)] || 'application/octet-stream');
  res.end(readFileSync(file));
});
await new Promise(done => server.listen(0,'127.0.0.1',done));
const url = `http://127.0.0.1:${server.address().port}/`;
const out = resolve('.taste-skill/redesign/interaction-checks'); mkdirSync(out,{recursive:true});
const browser = await Browser.launch();
try {
  for (const width of [1440,768,390]) {
    const page = await browser.newPage({ width, height: width===768 ? 1024 : width===390 ? 844 : 900, mobile:width===390 });
    await page.goto(url,{settleMs:1200});
    await page.eval(() => document.fonts.ready);
    const overflow = await page.eval(() => document.documentElement.scrollWidth - innerWidth);
    assert.ok(overflow <= 1,`No page overflow at ${width}: ${overflow}`);
    await page.eval(() => { document.querySelector('#projects').scrollIntoView({behavior:'instant'}); });
    await sleep(800);
    await page.screenshot({path:`${out}/projects-${width}.jpg`});
    assert.equal(await page.eval(() => document.querySelectorAll('.selected-work article').length),1);
    assert.equal(await page.eval(() => document.querySelector('.work-source-link').href),'https://github.com/quanquejztr/airside_machine');
    assert.ok(await page.eval(() => document.querySelector('.work-preview-media img').naturalWidth > 0));
    assert.equal(await page.eval(() => /NextLeg|JobTracker|DevShield|Diminished JavaCompiler/.test(document.querySelector('.selected-work').innerText)),false);
    assert.equal(await page.eval(() => /Use your mouse wheel or swipe to explore|School, university & a few internships along the way|Scroll to focus a flight/.test(document.body.innerText)),false);
    await page.eval(() => { const trigger=document.querySelector('.team-trigger'); trigger.scrollIntoView({behavior:'instant'}); trigger.click(); });
    await sleep(850);
    assert.equal(await page.eval(() => document.querySelector('#about-preview').getAttribute('aria-hidden')),'false');
    await page.eval(() => document.querySelector('#about-preview').scrollIntoView({behavior:'instant',block:'center'}));
    await sleep(500);
    await page.screenshot({path:`${out}/team-${width}.jpg`});
    await page.eval(() => document.querySelector('button[aria-label="Next team photo"]').click());
    assert.match(await page.eval(() => document.querySelector('.team-photo-main').src),/02.jpg$/);
    await page.eval(() => document.querySelector('button[aria-label="Close team photo preview"]').click());
    assert.equal(await page.eval(() => document.activeElement.classList.contains('team-trigger')),true);
    await page.eval(() => { document.querySelector('#boarding-passes').scrollIntoView({behavior:'instant'}); const list=document.querySelector('.flight-pass-scroll'); list.scrollTop+=64; list.dispatchEvent(new Event('scroll')); });
    await sleep(350);
    assert.equal(await page.eval(() => document.querySelectorAll('.wallet-pass-focused').length),1);
    assert.equal(await page.eval(() => document.querySelectorAll('.future-trip-list li').length),5);
    await page.screenshot({path:`${out}/flights-${width}.jpg`});
    await page.eval(() => document.querySelector('button[aria-label="Show whole world"]').click());
    await page.eval(() => document.querySelector('button[aria-label="Zoom in on map"]').click());
    assert.match(await page.eval(() => document.querySelector('.flight-map-geography').getAttribute('transform')),/scale\(1.4\)/);
    await page.eval(() => { document.querySelector('.original-pass-open').click(); });
    assert.equal(await page.eval(() => document.querySelector('.boarding-pass-dialog').open),true);
    await page.eval(() => document.querySelector('button[aria-label="Close enlarged boarding pass"]').click());
    assert.equal(await page.eval(() => document.querySelector('.boarding-pass-dialog').open),false);
    await page.eval(() => { document.querySelector('#contact').scrollIntoView({behavior:'instant'}); document.querySelector('.contact-message').open=true; document.querySelector('#contact-sender').focus(); });
    await page.send('Input.insertText',{text:'Alex & Sam'});
    await page.eval(() => document.querySelector('#contact-email').focus());
    await page.send('Input.insertText',{text:'alex@example.com'});
    await page.eval(() => document.querySelector('#contact-message').focus());
    await page.send('Input.insertText',{text:'Hello Cuong'});
    await page.eval(() => document.querySelector('.contact-send-button').click());
    await sleep(100);
    assert.match(await page.eval(() => document.querySelector('.contact-form-status').innerText),/published site/);
    assert.equal(await page.eval(() => document.querySelector('#contact-message').value),'Hello Cuong');
    await page.eval(() => { document.querySelector('.contact-message').open=false; document.querySelector('#contact').scrollIntoView({behavior:'instant'}); });
    await sleep(800);
    await page.screenshot({path:`${out}/contact-${width}.jpg`});
    assert.deepEqual(page.consoleErrors,[]);
    console.log(`${width}px: no page overflow; Airside-only project, removed instructions, team gallery, focus restoration, pass focus, map zoom, pass modal and local form-preview guard passed.`);
    await browser.send('Target.closeTarget',{targetId:page.targetId});
  }
} finally { await browser.close(); server.close(); }
