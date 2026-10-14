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
  await page.goto('http://fitness.test/');
  await page.getByRole('button',{name:"I'll start my own",exact:true}).click();
  await page.evaluate(async()=>{
   for(let i=0;i<3;i++){
    await dbOps.exercises.add({id:'motion'+i,name:['Motion Bench','Motion Row','Motion Squat'][i],type:'reps',categories:['push'],weightDefault:'weight'});
    await dbOps.sets.add({id:'motion-set'+i,exerciseId:'motion'+i,exerciseName:['Motion Bench','Motion Row','Motion Squat'][i],date:getTodayString(),weight:100,weightType:'lbs',reps:10,setOrder:1});
   }
  });
  await page.reload();await page.locator('.exercise-group').first().waitFor();
  const card=i=>page.locator('.exercise-group').filter({has:page.locator('.exercise-name',{hasText:['Motion Bench','Motion Row','Motion Squat'][i]})});
  const click=i=>card(i).locator('.exercise-collapsible').evaluate(el=>el.click());
  const state=i=>card(i).evaluate(el=>{const p=el.querySelector('.exercise-expanded-content'),d=p.firstElementChild;return {height:p.getBoundingClientRect().height,auto:p.style.height,inert:p.inert,children:d.children.length,padding:parseFloat(getComputedStyle(el).paddingTop),opacity:+getComputedStyle(d).opacity,transform:getComputedStyle(d).transform,expanded:el.querySelector('.exercise-collapsible').getAttribute('aria-expanded'),animations:el.getAnimations({subtree:true}).filter(a=>a.effect.target===el||a.effect.target===p||a.effect.target===d).map(a=>({target:a.effect.target===el?'card':a.effect.target===p?'height':'contents',duration:a.effect.getTiming().duration,delay:a.effect.getTiming().delay,easing:a.effect.getTiming().easing,current:a.currentTime}))};});
  await click(0);let start=await state(0);
  assert.equal(start.expanded,'true');assert.equal(start.inert,false);assert.equal(start.animations.length,3);
  assert.deepEqual(start.animations.map(a=>[a.target,a.duration,a.delay]),[['card',700,0],['height',700,0],['contents',600,100]]);
  assert(start.animations.every(a=>a.easing==='cubic-bezier(0.4, 0, 0.2, 1)'));
  await page.waitForTimeout(250);const mid=await state(0);assert(mid.padding>0&&mid.padding<8);assert(mid.opacity>0&&mid.opacity<1);assert(mid.height>0);
  await page.waitForTimeout(550);const opened=await state(0);assert.equal(opened.auto,'auto');assert.equal(opened.padding,8);assert.equal(opened.opacity,1);
  await page.screenshot({path:path.join(__dirname,'open-390.png')});
  await click(0);const close=await state(0);assert.equal(close.inert,true);assert(close.children>0);assert.deepEqual(close.animations.map(a=>[a.target,a.duration,a.delay]),[['card',600,100],['height',600,100],['contents',700,0]]);
  await page.waitForTimeout(800);const closed=await state(0);assert.equal(closed.height,0);assert.equal(closed.children,0);assert.equal(closed.padding,0);assert.equal(closed.opacity,0);
  checks.push('Exact 700ms clock, easing, 100ms staged contents, animated padding/wash; close retains DOM and blocks interaction until completion.');
  // Reverse while opening, and again while closing: no old completion may restore auto.
  await click(0);await page.waitForTimeout(220);await click(0);await page.waitForTimeout(70);await click(0);await page.waitForTimeout(850);assert.equal((await state(0)).auto,'auto');assert.equal((await state(0)).opacity,1);
  await click(0);await page.waitForTimeout(850);assert.equal((await state(0)).height,0);
  await click(0);await page.waitForTimeout(500);await click(1);await page.waitForTimeout(80);await click(2);await page.waitForTimeout(950);
  assert.equal((await state(0)).height,0);assert.equal((await state(1)).height,0);assert.equal((await state(2)).auto,'auto');
  checks.push('Repeated reversals settle correctly; A → B → C leaves only C open, without stale height timers or a shared closing slot.');
  await page.emulateMedia({reducedMotion:'reduce'});await click(2);assert.equal((await state(2)).height,0);await click(0);assert.equal((await state(0)).auto,'auto');assert.equal((await state(0)).animations.length,0);
  checks.push('Reduced motion commits immediately with no animation or content delay.');
  for(const width of [320,390,430]){await page.setViewportSize({width,height:844});const g=await card(0).evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth}));assert(g.scroll<=g.width+1);}
  // The real logging action still opens its picker; stored sets remain untouched by motion.
  await card(0).getByRole('button',{name:'+ Add Set',exact:true}).click();await page.waitForTimeout(100);
  assert(await page.locator('.modal').count()>0);
  assert.equal(await page.evaluate(async()=> (await dbOps.sets.getByDate(getTodayString())).length),3);
  await page.locator('#set-weight-input').fill('105');
  await page.getByRole('button',{name:'Use 105 lbs',exact:true}).click();
  await page.getByLabel('Custom reps',{exact:true}).fill('11');
  await page.getByRole('button',{name:'Log 11 reps',exact:true}).click();
  await page.waitForFunction(async()=> (await dbOps.sets.getByDate(getTodayString())).length===4);
  await page.reload();
  const stored=await page.evaluate(()=>dbOps.sets.getByDate(getTodayString()));
  assert.equal(stored.length,4);assert(stored.some(s=>s.exerciseId==='motion0'&&s.weight===105&&s.reps===11));
  checks.push('320/390/430px geometry fits; Add Set logs 105 lbs × 11 through the real pickers, preserves original records, and persists after reload.');
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify({passed:true,checks,opening:start,closing:close,errors},null,2));
  console.log(JSON.stringify({passed:true,checks}));
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
