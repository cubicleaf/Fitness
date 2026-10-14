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
  const checkFocus=async()=>page.evaluate(()=>{
    const failures=[];for(const el of document.querySelectorAll('button,input,textarea,select,a[href],[tabindex]')){
      if(el.disabled||!el.getClientRects().length||el.closest('[inert]'))continue;
      el.focus({preventScroll:true});const s=getComputedStyle(el);
      if(s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>0||s.boxShadow!=='none')failures.push({tag:el.tagName,label:el.getAttribute('aria-label')||el.textContent.slice(0,40),outline:s.outline,shadow:s.boxShadow});
    }return failures;
  });
  assert.deepEqual(await checkFocus(),[]);
  await page.getByRole('button',{name:'Add New Activity',exact:true}).click();
  assert.deepEqual(await checkFocus(),[]);
  await page.getByRole('button',{name:'Search activities',exact:true}).click();
  const search=page.getByRole('textbox',{name:'Search your activities',exact:true});await search.focus();
  assert.equal(await search.evaluate(el=>getComputedStyle(el).outlineStyle),'none');
  assert(await search.evaluate(el=>document.activeElement===el));
  const before=await search.evaluate(el=>{el.blur();return getComputedStyle(el).backgroundColor});await search.focus();const after=await search.evaluate(el=>getComputedStyle(el).backgroundColor);assert.notEqual(before,after);
  await page.screenshot({path:path.join(__dirname,'search-focus-390.png')});
  await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Close activity search');
  assert.deepEqual(await checkFocus(),[]);
  checks.push('Native focus and keyboard Tab remain functional; visible search uses fill without outline/shadow. Every mounted control on daily/Add Activity/search is ring-free.');
  await page.getByRole('button',{name:'Close activity search',exact:true}).click();
  await page.getByRole('button',{name:'Create New Activity',exact:true}).click();
  assert.deepEqual(await checkFocus(),[]);
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  await page.locator('.modal-header .close-btn').click();
  await page.evaluate(async()=>{await dbOps.exercises.add({id:'focusqa',name:'Focus QA',type:'reps',categories:['push'],weightDefault:'weight'});await dbOps.sets.add({id:'focusqas',exerciseId:'focusqa',exerciseName:'Focus QA',date:getTodayString(),weight:100,weightType:'lbs',reps:10,setOrder:1});});
  await page.reload();await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('.exercise-collapsible').click();assert.deepEqual(await checkFocus(),[]);
  await page.getByRole('button',{name:'+ Add Set',exact:true}).click();await page.locator('#set-weight-input').waitFor();assert.deepEqual(await checkFocus(),[]);
  await page.locator('#set-weight-input').fill('100');await page.getByRole('button',{name:'Use 100 lbs',exact:true}).click();await page.locator('.rep-grid').waitFor();assert.deepEqual(await checkFocus(),[]);
  for(let i=0;i<4&&await page.locator('.modal-header .close-btn').count();i++)await page.locator('.modal-header .close-btn').click();await page.getByRole('button',{name:'Settings',exact:true}).click();assert.deepEqual(await checkFocus(),[]);
  checks.push('Focused controls also checked on New Activity, expanded daily card, weight picker, rep picker and Settings; all are ring-free.');
  // Render the actual shared history component with short/long sets and notes.
  await page.evaluate(()=>{
    document.querySelector('#qa-history')?.remove();const el=document.createElement('div');el.id='qa-history';el.style.cssText='position:fixed;inset:0;z-index:900;background:var(--bg-page);padding:16px;overflow:auto';document.body.append(el);
    const sets=Array.from({length:12},(_,i)=>({id:'qa'+i,weight:110,weightType:'lbs',reps:12,setOrder:i+1}));
    window.qaHistoryRoot=ReactDOM.createRoot(el);qaHistoryRoot.render(React.createElement('div',null,
      ...[{sets:sets.slice(0,2),note:null},{sets:sets.slice(0,2),note:{freeText:'V bar'}},{sets,note:null},{sets,note:{freeText:'V bar'}}].map((row,i)=>React.createElement('section',{key:i,'data-qa-row':i,style:{marginBottom:24}},React.createElement(HistorySessionRow,{date:'2026-10-01',sets:row.sets,note:row.note,unit:'lbs',onNavigate:()=>{}})))));
  });await page.locator('[data-qa-row="3"]').waitFor();
  for(const width of [320,390,430]){
    await page.setViewportSize({width,height:844});await page.waitForTimeout(150);
    const result=await page.locator('#qa-history .history-session-sets').evaluateAll(nodes=>nodes.map(el=>({overflow:el.scrollWidth>el.clientWidth+1,masked:el.classList.contains('is-truncated'),mask:getComputedStyle(el).maskImage,width:el.clientWidth,scroll:el.scrollWidth})));
    for(const r of result){assert.equal(r.masked,r.overflow);if(r.overflow)assert(r.mask.includes('10px'));else assert.equal(r.mask,'none');}
    assert.equal(result[0].masked,false);assert.equal(result[1].masked,false);assert.equal(result[2].masked,true);assert.equal(result[3].masked,true);
    await page.screenshot({path:path.join(__dirname,'history-'+width+'.png')});
  }
  await page.locator('[data-qa-row="3"] .history-session-view-all').click();await page.getByText('Sets · Oct 1',{exact:true}).waitFor();
  assert.equal(await page.locator('.quick-detail-overlay .set-box').count(),12);
  checks.push('Actual shared history rows at 320/390/430px: short sets (with/without notes) stay unmasked; long sets fade only at final right 10px; View all retains all 12 sets.');
  assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify({passed:true,checks,errors},null,2));console.log(JSON.stringify({passed:true,checks}));
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
