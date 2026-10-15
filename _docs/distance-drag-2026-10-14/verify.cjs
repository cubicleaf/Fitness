const {chromium}=require('/Users/cubicleaf/.npm/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Users/cubicleaf/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
 const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block',hasTouch:true}),page=await context.newPage(),errors=[];
 page.setDefaultTimeout(8000);page.on('pageerror',e=>errors.push(e.message));
 await page.route('http://fitness.test/**',async route=>{const file=path.resolve(root,decodeURIComponent(new URL(route.request().url()).pathname).replace(/^\//,'')||'index.html');if(!file.startsWith(root+'/')||!fs.existsSync(file))return route.fulfill({status:404,body:''});await route.fulfill({body:fs.readFileSync(file),contentType:file.endsWith('.html')?'text/html':file.endsWith('.js')?'text/javascript':'application/octet-stream'});});
 const button=n=>page.getByRole('button',{name:n,exact:true});
 const input=page.getByRole('textbox',{name:'Exact distance',exact:true}),ruler=page.getByRole('slider',{name:'Distance; drag right to increase, left to decrease'});
 async function open(name='Run'){await button('Add New Activity').click();await page.locator('.exercise-picker-item').filter({has:page.getByText(name,{exact:true})}).click();await button('Log a Set').click();await page.getByText('Log a completed duration',{exact:true}).waitFor();}
 async function gesture(dx,dy=0,cancel=false){await ruler.scrollIntoViewIfNeeded();const b=await ruler.boundingBox(),x=b.x+b.width/2,y=b.y+30;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+dx,y+dy,{steps:4});if(cancel)await ruler.dispatchEvent('pointercancel',{pointerId:1});await page.mouse.up();}
 const sets=()=>page.evaluate(()=>dbOps.sets.getAll());
 try{
 await page.goto('http://fitness.test/');await button("I'll start my own").click();
 await page.evaluate(async()=>{
  for(const [id,name] of [['run','Run'],['sauna','Sauna']])await dbOps.exercises.add({id,name,type:'timed',categories:[],weightDefault:'none',weightMeaning:'total',createdAt:Date.now()});
  await dbOps.sets.add({id:'last-run',exerciseId:'run',exerciseName:'Run',date:addDays(getTodayString(),-1),setOrder:1,weight:0,weightType:'none',duration:1200,distance:3.1,distanceUnit:'mi'});
  await dbOps.sets.add({id:'future-run',exerciseId:'run',exerciseName:'Run',date:addDays(getTodayString(),1),setOrder:1,weight:0,weightType:'none',duration:1200,distance:9,distanceUnit:'mi'});
 });await page.reload();await open();
 assert.equal(await input.inputValue(),'');await button('Use last · 3.1 mi').click();assert.equal(await input.inputValue(),'3.1');
 await gesture(6);assert.equal(await input.inputValue(),'3.1');await gesture(80);assert.equal(await input.inputValue(),'3.6');await gesture(-32);assert.equal(await input.inputValue(),'3.4');
 await gesture(16,50);assert.equal(await input.inputValue(),'3.4');assert.equal(await ruler.evaluate(e=>getComputedStyle(e).touchAction),'pan-y');
 await ruler.focus();await ruler.press('Home');assert.equal(await input.inputValue(),'0');await ruler.press('ArrowLeft');assert.equal(await input.inputValue(),'0');await ruler.press('Shift+ArrowRight');assert.equal(await input.inputValue(),'0.01');await ruler.press('ArrowRight');assert.equal(await input.inputValue(),'0.11');
 await input.fill('3,60');await input.press('Enter');assert.equal(await input.inputValue(),'3.60');
 await button('Change distance unit; currently mi').click();assert.equal(await input.inputValue(),'5.79');await button('Change distance unit; currently km').click();assert.equal(await input.inputValue(),'3.6');
 await input.fill('12.34');await input.press('Enter');assert.equal(await input.inputValue(),'12.34');
 await input.fill('');await input.press('Tab');assert.equal(await input.inputValue(),'');await button('Change distance unit; currently mi').click();assert.equal(await input.inputValue(),'');await button('Use last · 4.99 km').click();assert.equal(await input.inputValue(),'4.99');
 for(const width of [320,390,430]){await page.setViewportSize({width,height:844});await page.waitForTimeout(150);const b=await page.locator('.distance-drag').boundingBox();assert(b.x>=0&&b.x+b.width<=width+1);for(const e of await page.locator('.distance-drag input,.distance-drag button').all()){const q=await e.boundingBox();assert(q.height>=44&&q.width>=44);}await ruler.focus();assert.equal(await ruler.evaluate(e=>getComputedStyle(e).outlineStyle),'none');await page.screenshot({path:path.join(__dirname,'distance-'+width+'.png')});}

 // Exercise real touch dispatch, including browser cancellation for vertical panning.
 await page.setViewportSize({width:390,height:568});await ruler.scrollIntoViewIfNeeded();await input.fill('4.99');await input.press('Enter');
 const cdp=await context.newCDPSession(page);
 async function touch(dx,dy){const b=await ruler.boundingBox(),x=b.x+b.width/2,y=b.y+35;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/8,y:y+dy*i/8}]});await page.waitForTimeout(20);}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(80);}
 await touch(80,0);assert.equal(await input.inputValue(),'5.49');await touch(-80,0);assert.equal(await input.inputValue(),'4.99');
 const scroll=()=>page.evaluate(()=>[...document.querySelectorAll('*')].reduce((s,e)=>s+e.scrollTop,0));
 const before=await scroll();await touch(0,-70);assert.equal(await input.inputValue(),'4.99');assert((await scroll())>before,'Vertical touch scrolls the modal instead of changing distance');
 await ruler.scrollIntoViewIfNeeded();await ruler.dispatchEvent('pointerdown',{pointerId:99,pointerType:'touch',isPrimary:true,button:0,clientX:100,clientY:100});await ruler.dispatchEvent('pointercancel',{pointerId:99});await ruler.dispatchEvent('pointermove',{pointerId:99,clientX:180,clientY:100});assert.equal(await input.inputValue(),'4.99');
 await page.emulateMedia({reducedMotion:'reduce'});await ruler.focus();await ruler.press('ArrowRight');assert.equal(await input.inputValue(),'5.09');await input.fill('4.99');await input.press('Enter');await page.emulateMedia({reducedMotion:'no-preference'});
 await page.setViewportSize({width:390,height:844});
 // The draft survives the separate load picker (the timed screen unmounts).
 await page.getByRole('button',{name:/^Load: .*Tap to change/}).click();
 await button('Add weight').click();await page.locator('.weight-use-button').waitFor();await page.locator('.weight-use-button').click();await input.waitFor();assert.equal(await input.inputValue(),'4.99');
 // Log through an existing duration preset, then reload the same isolated database.
 await input.fill('5.25');await button('Log 5:00').click();await page.waitForFunction(()=>dbOps.sets.getAll().then(a=>a.length===3));
 let saved=(await sets()).find(s=>!['last-run','future-run'].includes(s.id));assert.equal(saved.distance,5.25);assert.equal(saved.distanceUnit,'km');assert.equal(saved.duration,300);
 await page.reload();assert.equal((await sets()).find(s=>s.id===saved.id).distance,5.25);await open();assert.equal(await input.inputValue(),'');await button('Use last · 3.26 mi').waitFor();
 await input.fill('2.75');await page.getByRole('button',{name:/^Time this activity/}).click();await button('Start Stopwatch').click();await page.waitForTimeout(1100);await button('Pause').click();await page.getByRole('button',{name:/^Log 0:0[1-9]$/}).click();await page.waitForFunction(()=>dbOps.sets.getAll().then(a=>a.length===4));assert((await sets()).some(s=>s.distance===2.75 && s.distanceUnit==='mi' && s.duration>=1 && s.duration<10));
 await page.reload();await open();assert.equal(await input.inputValue(),'');await button('Log 5:00').click();await page.waitForFunction(()=>dbOps.sets.getAll().then(a=>a.length===5));assert((await sets()).some(s=>s.exerciseId==='run' && s.distance===null));

 await page.reload();await open('Sauna');assert.equal(await ruler.count(),0);await button('Log 5:00').click();await page.waitForFunction(()=>dbOps.sets.getAll().then(a=>a.length===6));assert.equal((await sets()).find(s=>s.exerciseId==='sauna').distance,null);
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify({passed:true,errors,checks:['Drag direction, sensitivity, threshold, vertical intent, zero clamp and keyboard hundredths','Exact typed decimals/comma, clearing, unit conversion and actual prior distance excluding future sessions','320/390/430px layout, 44px controls, ring-free focus','Actual preset and stopwatch logging, stored unit/distance/duration and reload; optional empty distance; no ruler on non-distance activity','Real touch scrubbing and vertical modal scrolling, pointer cancellation, reduced motion, weight-picker draft retention']},null,2));
 console.log('PASS distance logging and interaction checks');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
