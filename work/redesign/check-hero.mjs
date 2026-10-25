import { Browser } from '/Users/luongtricuong/.agents/skills/design-taste-frontend/scripts/lib/cdp.mjs';
const b=await Browser.launch();
try{
 const p=await b.newPage({width:390,height:844,mobile:true});await p.goto('http://localhost:3000/',{settleMs:500});
 console.log(await p.eval(()=>[...document.querySelectorAll('.intro-rotator-list li')].map(item=>{const range=document.createRange();range.selectNodeContents(item);const rect=range.getBoundingClientRect();return {text:item.textContent,textHeight:rect.height,rowHeight:item.clientHeight,font:getComputedStyle(item).fontSize};})));
}finally{await b.close();}
