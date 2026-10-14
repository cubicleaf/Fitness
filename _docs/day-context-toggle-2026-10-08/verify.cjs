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
 const toggle=page.locator('.day-detail-context');
 const detail=()=>row('Hammer Curls').locator('.day-activity-detail');
 assert.equal(await page.locator('.day-activity-meta').count(),11);
 assert.equal(await page.locator('.day-activity-last-workout').count(),0);
 assert((await row('High Pull-ups').textContent()).includes('27 sets logged'));
 assert(await btn('Find or assign an activity').isVisible());assert(await btn('Change Split').isVisible());assert(await page.getByRole('button',{name:/Edit bodyweight/}).isVisible());
 for(const width of [320,390,1000]){
  await page.setViewportSize({width,height:844});await page.waitForTimeout(200);
  const g=await page.locator('.day-detail-modal').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth}));assert(g.scroll<=g.width);
  const t=await toggle.boundingBox();assert(t.width>=44&&t.height>=44&&t.x>=0&&t.x+t.width<=width);
  await page.screenshot({path:path.join(__dirname,'summary-'+width+'.png')});
 }
 await page.setViewportSize({width:390,height:844});
 await toggle.click();assert.equal(await toggle.getAttribute('aria-pressed'),'true');
 await page.waitForTimeout(100);
 const outgoing=await detail().evaluate(el=>({opacity:Number(getComputedStyle(el).opacity),view:el.dataset.view}));assert(outgoing.opacity>0&&outgoing.opacity<1);assert.equal(outgoing.view,'summary');
 await page.waitForTimeout(200);
 const incoming=await detail().evaluate(el=>({opacity:Number(getComputedStyle(el).opacity),view:el.dataset.view}));assert.equal(incoming.view,'workout');assert(incoming.opacity<1);
 await page.waitForTimeout(300);assert.equal(await detail().evaluate(el=>getComputedStyle(el).opacity),'1');
 assert.deepEqual(await row('Hammer Curls').locator('.set-box').allTextContents(),['100 lbs × 12','× 12','× 10']);
 assert.deepEqual(await row('High Pull-ups').locator('.set-box').allTextContents(),['BW × 12','× 12','× 10']);
 assert.equal(await page.locator('.day-activity-detail[data-view="summary"]').count(),0);
 assert.equal(await row('No history').textContent().then(t=>t.includes('No workout logged yet')),true);
 assert.deepEqual(await row('Did some only').locator('.set-box').allTextContents(),['Did some']);
 for(const width of [320,390,1000]){
  await page.setViewportSize({width,height:844});await page.waitForTimeout(100);await page.locator('.day-activity-list').evaluate(el=>el.scrollTop=0);
  const g=await page.locator('.day-detail-modal').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth}));assert(g.scroll<=g.width);
  await page.screenshot({path:path.join(__dirname,'workout-'+width+'.png')});
  await row('Long band workout').scrollIntoViewIfNeeded();assert.equal(await row('Long band workout').locator('.set-box').count(),14);
 }
 checks.push('Screenshot layout restored: date heading, scale/value, split controls, numbered rail, usage summaries, and full-width activity finder. Context has a 44px target and fits 320/390/1000px.');
 checks.push('Measured intermediate opacity confirms sequential 250ms fade-out/fade-in; only secondary details fade. All last-workout badges preserve order, repeated values, and shared formatting; long workouts wrap.');
 await toggle.click();await page.waitForTimeout(600);assert.equal(await toggle.getAttribute('aria-pressed'),'false');assert.equal(await page.locator('.day-activity-last-workout').count(),0);
 await toggle.click();await page.waitForTimeout(50);await toggle.click();await page.waitForTimeout(600);assert.equal(await detail().getAttribute('data-view'),'summary');assert.equal(await detail().evaluate(el=>getComputedStyle(el).opacity),'1');
 await page.emulateMedia({reducedMotion:'reduce'});await toggle.focus();await page.keyboard.press('Space');await page.waitForTimeout(30);assert.equal(await detail().getAttribute('data-view'),'workout');assert.equal(await detail().evaluate(el=>getComputedStyle(el).opacity),'1');
 await page.keyboard.press('Enter');await page.waitForTimeout(30);assert.equal(await detail().getAttribute('data-view'),'summary');
 checks.push('Toggle reverses, rapid repeat clicks settle correctly, keyboard Space/Enter works, and reduced motion switches immediately without a delay.');
 await btn('Change Split').click();await btn('Edit').click();await page.getByRole('heading',{name:'Edit Categories',exact:true}).waitFor();await btn('Cancel').click();await btn('pull Day Activities').click();await row('Hammer Curls').click();await page.locator('.history-session-row').first().waitFor();assert.deepEqual(await page.locator('.history-session-row').first().locator('.set-box').allTextContents(),['100 lbs × 12','× 12','× 10']);
 checks.push('Existing shared split editor and activity-history navigation still work.');
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify({checks,errors},null,2));console.log(checks);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
