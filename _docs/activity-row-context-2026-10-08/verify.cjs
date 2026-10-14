const {chromium}=require('/Users/cubicleaf/.npm/_npx/e41f203b7505f1fb/node_modules/playwright');
const assert=require('node:assert/strict'), fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Users/cubicleaf/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
 const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'}),page=await context.newPage();
 page.setDefaultTimeout(10000);const errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 const btn=name=>page.getByRole('button',{name,exact:true});
 try{
 await page.goto('http://127.0.0.1:8774');await btn("I'll start my own").click();
 await page.evaluate(async()=>{
  const today=getTodayString(),prior=addDays(today,-1),older=addDays(today,-10);
  await dbOps.routines.put({id:'pull',name:'Pull Day',mode:'split',splitName:'pull',manualOrder:null});await dbOps.dayRoutines.set(today,'pull');
  const names=['High Pull-ups','Hammer Curls','Cable Rows','Barbell Curl','Pulley Cable Row','Chin-ups','Long band workout with a name that wraps on small phones','No history','Did some only','Timed distance','Neutral notes'];
  for(let i=0;i<names.length;i++)await dbOps.exercises.add({id:'ex'+i,name:names[i],type:i===9?'timed':i===10?'neutral':'reps',categories:['pull'],weightDefault:'weight'});
  for(let i=0;i<6;i++){
   for(let j=0;j<24-i;j++)await dbOps.sets.add({id:`old${i}-${j}`,exerciseId:'ex'+i,exerciseName:names[i],date:older,weight:50,weightType:'lbs',reps:99,duration:null,setOrder:j+1});
   for(const j of [2,0,1])await dbOps.sets.add({id:`last${i}-${j}`,exerciseId:'ex'+i,exerciseName:names[i],date:i===3?today:prior,weight:i===0?null:100,weightType:i===0?'bodyweight':'lbs',reps:[12,12,10][j],duration:null,setOrder:j+1});
  }
  for(let j=0;j<14;j++)await dbOps.sets.add({id:'band'+j,exerciseId:'ex6',exerciseName:names[6],date:prior,weight:null,weightType:'banded',bandedColor:'Extra heavy purple resistance band '+j,reps:20+j,duration:null,setOrder:j+1});
  await dbOps.sets.add({id:'presence',exerciseId:'ex8',exerciseName:names[8],date:prior,isPresenceOnly:true,reps:null,duration:null,weightType:'none',setOrder:1});
  await dbOps.sets.add({id:'mixedPresence',exerciseId:'ex1',exerciseName:names[1],date:prior,isPresenceOnly:true,reps:null,duration:null,weightType:'none',setOrder:4});
  await dbOps.sets.add({id:'timed',exerciseId:'ex9',exerciseName:names[9],date:prior,type:'timed',reps:null,duration:900,distance:2,distanceUnit:'mi',weightType:'none',setOrder:1});
  await dbOps.sets.add({id:'neutral',exerciseId:'ex10',exerciseName:names[10],date:today,type:'neutral',isPlaceholder:true,reps:null,duration:null,weightType:'none',setOrder:1});
 });
 await page.reload();await page.locator('.day-display').click();await page.locator('.day-activity-row').first().waitFor();
 const row=name=>page.locator('.day-activity-row').filter({has:page.locator('.day-activity-name',{hasText:name})});
 const toggle=name=>row(name).locator('.day-activity-context');
 const detail=name=>row(name).locator('.day-activity-detail');
 assert.equal(await page.locator('.day-activity-context').count(),11);
 assert.equal(await page.locator('.day-detail-weight-control, .day-detail-weight-value, .day-detail-context').count(),0);
 assert(!(await page.locator('.day-detail-modal').textContent()).includes('No weight'));
 assert.equal(await page.locator('.day-activity-last-workout').count(),0);
 for(const width of [320,390,430,1000]){
  await page.setViewportSize({width,height:844});await page.waitForTimeout(200);
  const g=await page.locator('.day-detail-modal').evaluate(el=>{const controls=[...el.querySelector('.day-detail-actions').children].map(e=>e.getBoundingClientRect().toJSON());const help=el.querySelector('.day-detail-help');return {width:el.clientWidth,scroll:el.scrollWidth,controls,helpBackground:getComputedStyle(help).backgroundColor,helpBorder:getComputedStyle(help).borderWidth,helpRadius:getComputedStyle(help).borderRadius};});
  assert(g.scroll<=g.width);assert.equal(g.controls.length,3);assert(g.controls.every(c=>c.y===g.controls[0].y));assert.equal(g.helpBackground,'rgba(0, 0, 0, 0)');assert.equal(g.helpBorder,'0px');assert.equal(g.helpRadius,'0px');
  const align=await row('Hammer Curls').evaluate(el=>{const meta=el.querySelector('.day-activity-meta').getBoundingClientRect(),i=el.querySelector('.day-activity-context').getBoundingClientRect();return {meta:meta.toJSON(),i:i.toJSON()};});
  assert(align.i.x>=align.meta.right);assert(align.i.width>=44&&align.i.height>=44);assert(Math.abs((align.meta.y+align.meta.height/2)-(align.i.y+align.i.height/2))<1);
  await page.screenshot({path:path.join(__dirname,'summary-'+width+'.png')});
 }
 await page.setViewportSize({width:390,height:844});
 await toggle('Hammer Curls').click();await page.waitForTimeout(100);const outOpacity=await detail('Hammer Curls').evaluate(el=>Number(getComputedStyle(el).opacity));assert(outOpacity>0&&outOpacity<1);
 assert.equal(await detail('High Pull-ups').getAttribute('data-view'),'summary');
 await page.waitForTimeout(500);assert.deepEqual(await row('Hammer Curls').locator('.set-box').allTextContents(),['100 lbs × 12','× 12','× 10']);assert.equal(await page.locator('.day-activity-last-workout').count(),1);
 await toggle('Cable Rows').click();await page.waitForTimeout(600);assert.equal(await page.locator('.day-activity-last-workout').count(),2);assert.equal(await detail('Hammer Curls').getAttribute('data-view'),'workout');
 for(const width of [320,390,430,1000]){await page.setViewportSize({width,height:844});await page.waitForTimeout(100);await page.screenshot({path:path.join(__dirname,'context-'+width+'.png')});}
 await toggle('Hammer Curls').click();await page.waitForTimeout(600);assert.equal(await detail('Hammer Curls').getAttribute('data-view'),'summary');assert.equal(await detail('Cable Rows').getAttribute('data-view'),'workout');
 await toggle('Hammer Curls').click();await page.waitForTimeout(40);await toggle('Hammer Curls').click();await page.waitForTimeout(600);assert.equal(await detail('Hammer Curls').getAttribute('data-view'),'summary');
 await page.emulateMedia({reducedMotion:'reduce'});await toggle('High Pull-ups').focus();await page.keyboard.press('Space');await page.waitForTimeout(30);assert.equal(await detail('High Pull-ups').getAttribute('data-view'),'workout');assert.equal(await detail('High Pull-ups').evaluate(el=>getComputedStyle(el).opacity),'1');await page.keyboard.press('Enter');await page.waitForTimeout(30);assert.equal(await detail('High Pull-ups').getAttribute('data-view'),'summary');
 await toggle('Long band workout').click();await page.waitForTimeout(30);assert.equal(await row('Long band workout').locator('.set-box').count(),14);
 const longGeometry=await row('Long band workout').evaluate(el=>({toggle:el.querySelector('.day-activity-context').getBoundingClientRect().top,details:el.querySelector('.day-activity-detail-row').getBoundingClientRect().top,overflow:el.scrollWidth>el.clientWidth}));assert(Math.abs(longGeometry.toggle-longGeometry.details)<1);assert(!longGeometry.overflow);
 await toggle('No history').click();await page.waitForTimeout(30);assert((await row('No history').textContent()).includes('No workout logged yet'));
 checks.push('Each activity has its own 44px context button at the far right, vertically aligned with its summary/date. Independent rows open, stay open, and close without changing other rows.');
 checks.push('250ms fade-out/fade-in works; rapid taps settle correctly; keyboard and reduced-motion switching work; all 14 long set badges are retained.');
 await page.getByRole('button',{name:'About split activities',exact:true}).click();await page.locator('.field-note-modal-card').getByText('Split activities',{exact:true}).waitFor();await btn('Close field note').click();
 await btn('Change Split').click();await btn('Edit').click();await page.getByRole('heading',{name:'Edit Categories',exact:true}).waitFor();await btn('Cancel').click();await btn('pull Day Activities').click();await row('Hammer Curls').locator('.day-activity-open').click();await page.locator('.history-session-row').first().waitFor();
 assert.deepEqual(await page.locator('.history-session-row').first().locator('.set-box').allTextContents(),['100 lbs × 12','× 12','× 10']);
 checks.push('No weight concept remains on this screen. Both split controls and bare question SVG fit one top row at 320/390/430/1000px. Help, split editing, and separate history navigation work.');
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify({checks,errors},null,2));console.log(checks);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
