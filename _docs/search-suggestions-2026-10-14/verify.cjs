const {chromium}=require('/Users/cubicleaf/.npm/_npx/e41f203b7505f1fb/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../..');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/Users/cubicleaf/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
 const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'}),page=await context.newPage();
 const errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('http://fitness.test/**',async route=>{
  const relative=decodeURIComponent(new URL(route.request().url()).pathname).replace(/^\//,'')||'index.html';
  const file=path.resolve(root,relative);
  if(!file.startsWith(root+'/'))return route.abort();
  if(!fs.existsSync(file))return route.fulfill({status:404,body:''});
  const type=file.endsWith('.html')?'text/html':file.endsWith('.js')?'text/javascript':file.endsWith('.svg')?'image/svg+xml':file.endsWith('.csv')?'text/csv':'application/octet-stream';
  await route.fulfill({body:fs.readFileSync(file),contentType:type});
 });
 try {
  await page.goto('http://fitness.test/');await page.getByRole('button',{name:"I'll start my own",exact:true}).click();
  await page.evaluate(async()=>{
   const names=['Bench Press','Dumbbell Bench Press','Incline Bench Press','Decline Bench Press','Close Grip Bench Press','Dumbbell Shoulder Press','Cable Rows','Calf Raises','Outdoor Run'];
   for(let i=0;i<names.length;i++){
    await dbOps.exercises.add({id:'sq'+i,name:names[i],type:i===8?'timed':'reps',categories:[i<6?'push':i===6?'pull':i===7?'legs':'cardio'],weightDefault:'weight'});
    await dbOps.sets.add({id:'sqs'+i,exerciseId:'sq'+i,exerciseName:names[i],date:addDays(getTodayString(),-i),weight:100,weightType:'lbs',reps:i===8?null:12,duration:i===8?1200:null,setOrder:1});
   }
   await dbOps.exercises.add({id:'unlogged',name:'Never logged activity',type:'reps',categories:['other']});
  });await page.reload();
  const openPicker=async()=>{await page.getByRole('button',{name:'Add New Activity',exact:true}).click();await page.getByRole('region',{name:'Activity splits',exact:true}).waitFor();};
  await openPicker();const rail=page.getByRole('region',{name:'Activity splits',exact:true});await rail.getByRole('button',{name:'legs',exact:true}).click();
  const openSearch=()=>page.getByRole('button',{name:'Search activities',exact:true}).click();await openSearch();
  const input=page.getByRole('combobox',{name:'Search your activities',exact:true}),panel=page.locator('.activity-search-suggestions');await panel.waitFor();
  assert.deepEqual(await panel.locator('strong').allTextContents(),['Bench Press','Dumbbell Bench Press','Incline Bench Press','Decline Bench Press']);
  assert(await panel.evaluate(el=>el.parentElement===document.body));
  assert.equal(await input.evaluate(el=>getComputedStyle(el).outlineStyle),'none');
  for(const width of [320,390,430]){await page.setViewportSize({width,height:844});await page.waitForTimeout(120);const b=await panel.boundingBox();assert(b.x>=0&&b.x+b.width<=width+1);assert.equal(await panel.getByRole('option').count(),4);await page.screenshot({path:path.join(__dirname,'recent-'+width+'.png')});}
  await input.fill('bench');await page.getByRole('button',{name:'View all 5 matches ›',exact:true}).waitFor();assert.equal(await panel.getByRole('option').count(),4);assert.equal(await page.locator('.exercise-picker-section:visible').count(),0);
  await page.getByRole('button',{name:'View all 5 matches ›',exact:true}).click();assert.equal(await panel.count(),0);assert.equal(await page.locator('.exercise-picker-name').count(),5);assert.equal(await input.inputValue(),'bench');
  await input.fill('db press');await panel.waitFor();assert((await panel.locator('strong').allTextContents()).includes('Dumbbell Bench Press'));assert((await panel.locator('strong').allTextContents()).includes('Dumbbell Shoulder Press'));
  await input.fill('claf raises');await page.waitForTimeout(50);assert.deepEqual(await panel.locator('strong').allTextContents(),['Calf Raises']);
  await input.fill('bench');await page.waitForTimeout(50);await input.press('ArrowDown');await input.press('Enter');
  await page.getByRole('button',{name:'Log a Set',exact:true}).waitFor();assert.equal(await panel.count(),0);
  await page.locator('.modal-header .close-btn').click();await input.waitFor();assert.equal(await input.inputValue(),'bench');await panel.waitFor();
  await input.press('Escape');assert.equal(await panel.count(),0);await input.press('Escape');await rail.waitFor();assert.equal(await rail.locator('.active').innerText(),'legs');
  await openSearch();await input.fill('zzzz');await page.getByRole('status').filter({hasText:'No strong name matches.'}).waitFor();assert.equal(await panel.getByRole('option').count(),0);
  await input.fill('');await page.waitForTimeout(50);assert.equal(await panel.getByRole('option').count(),4);
  await page.locator('.modal-header h2').click();assert.equal(await panel.count(),0);
  await page.locator('.modal-header .close-btn').click();assert.equal(await panel.count(),0);
  const count=await page.evaluate(async()=>(await dbOps.sets.getAll()).length);assert.equal(count,9);
  // Empty-library and sparse-history behavior in separate fresh context.
  await page.evaluate(async()=>{for(const ex of await dbOps.exercises.getAll())await dbOps.exercises.delete(ex.id);for(const set of await dbOps.sets.getAll())await dbOps.sets.delete(set.id);});await page.reload();await openPicker();await openSearch();await panel.waitFor();assert.equal(await panel.getByRole('option').count(),0);assert((await panel.innerText()).includes('No recently logged activities yet.'));
  checks.push('Recent activities come from actual stored sets despite missing legacy lastUsed; current split does not hide recent/typed choices. Never-logged activities are not invented as recents.');
  checks.push('Actual name matcher handles aliases/typos; four suggestions maximum; View all exposes all five bench matches without duplicate background results.');
  checks.push('Keyboard selection opens the real activity context; Back preserves query; Escape/outside dismissal and split restoration work; no sets logged by choosing. Empty library stays honest.');
  checks.push('Body portal stays within 320/390/430px; focus remains ring-free; closing the picker removes the panel.');
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify({passed:true,checks,errors},null,2));console.log(JSON.stringify({passed:true,checks}));
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
