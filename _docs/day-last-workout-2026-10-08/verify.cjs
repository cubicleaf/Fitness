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
 assert.deepEqual(await row('High Pull-ups').locator('.set-box').allTextContents(),['BW × 12','× 12','× 10']);
 assert.deepEqual(await row('Hammer Curls').locator('.set-box').allTextContents(),['100 lbs × 12','× 12','× 10']);
 assert.equal(await row('No history').locator('.set-box').count(),0);assert.equal(await row('Neutral notes').locator('.set-box').count(),0);
 assert.deepEqual(await row('Did some only').locator('.set-box').allTextContents(),['Did some']);
 assert.equal(await row('Timed distance').locator('.set-box').count(),1);
 assert.equal(await row('Barbell Curl').locator('.day-activity-node svg').count(),1);
 assert.equal(await page.locator('.day-detail-weight-compact, .day-detail-find, .day-activity-meta').count(),0);
 const expected=await page.evaluate(async()=>{
  const output={};for(const ex of await dbOps.exercises.getAll()){
   const all=(await dbOps.sets.getByExerciseId(ex.id)).filter(s=>!isNeutralAnchorSet(s));const latest=all.map(s=>s.date).sort().reverse()[0];const sets=getVisibleSets(all.filter(s=>s.date===latest).sort((a,b)=>(a.setOrder||0)-(b.setOrder||0)));
   output[ex.name]=sets.map((s,i)=>formatSetBox(s,sets[i-1],'lbs'));
  }return output;
 });
 for(const [name,sets] of Object.entries(expected))assert.deepEqual(await row(name).locator('.set-box').allTextContents(),sets);
 checks.push('Latest saved session only, original set order, repeated loads/reps, bodyweight, timed distance, presence-only, empty history, and neutral placeholders render with shared log formatting.');
 for(const width of [320,390,430,1000]){
  await page.setViewportSize({width,height:844});await page.waitForTimeout(250);
  const geometry=await page.locator('.day-detail-modal').evaluate(el=>{
   const help=el.querySelector('.day-detail-help').getBoundingClientRect(),split=[...el.querySelectorAll('.day-detail-tab')][1].getBoundingClientRect();
   const rows=[...el.querySelectorAll('.day-activity-row')].map(r=>({h:r.getBoundingClientRect().height,overflow:r.scrollWidth>r.clientWidth+1}));
   const list=el.querySelector('.day-activity-list');return {overflow:el.scrollWidth>el.clientWidth+1,help:help.toJSON(),split:split.toJSON(),rows,listScroll:list.scrollHeight>list.clientHeight};
  });
  assert(!geometry.overflow);assert(geometry.help.x>=geometry.split.right);assert.equal(geometry.help.y,geometry.split.y);assert(geometry.help.width>=44&&geometry.help.height>=44);assert(geometry.listScroll);assert(geometry.rows.every(r=>r.h>=44&&!r.overflow));
  await page.locator('.day-activity-list').evaluate(el=>el.scrollTop=0);await page.screenshot({path:path.join(__dirname,'activities-'+width+'.png')});
  const band=row('Long band workout');await band.scrollIntoViewIfNeeded();assert.equal(await band.locator('.set-box').count(),14);const boxes=await band.locator('.set-box').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().toJSON()));assert(boxes.at(-1).y>boxes[0].y);assert(boxes.every(b=>b.x>=0&&b.right<=width));
  if(width===390)await page.screenshot({path:path.join(__dirname,'all-sets-390.png')});
 }
 checks.push('320/390/430/1000px layouts fit; help sits directly beside Choose Split with a 44px target; all 14 long set badges wrap and remain reachable by vertical scrolling.');
 await page.setViewportSize({width:390,height:844});await btn('About split activities').click();await page.locator('.field-note-modal-card').getByText('Your split activities',{exact:true}).waitFor();await btn('Close field note').click();
 await btn('Choose Split').click();await btn('Edit').click();await page.getByRole('heading',{name:'Edit Categories',exact:true}).waitFor();await btn('Cancel').click();await btn('Activities').click();await row('Hammer Curls').click();await page.locator('.history-session-row').first().waitFor();
 assert.deepEqual(await page.locator('.history-session-row').first().locator('.set-box').allTextContents(),expected['Hammer Curls']);
 checks.push('Help describes the current screen; shared split editor still opens/returns; activity tap opens history whose latest measured workout matches these badges.');
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify({checks,errors},null,2));console.log(checks);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
