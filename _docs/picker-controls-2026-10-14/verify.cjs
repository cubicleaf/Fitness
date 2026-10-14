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
  await page.getByRole('button',{name:'Add New Activity',exact:true}).click();
  const picker=page.locator('.exercise-picker-content'), rail=page.getByRole('region',{name:'Activity splits',exact:true});
  const create=page.getByRole('button',{name:'Create New Activity',exact:true});
  for(const width of [320,390,430]){
    await page.setViewportSize({width,height:844});await page.waitForTimeout(150);
    const g=await rail.evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,tops:[...el.querySelectorAll('button')].map(b=>b.getBoundingClientRect().top)}));
    assert(g.scroll>g.width);assert(g.tops.every(y=>Math.abs(y-g.tops[0])<1));
    const button=await create.evaluate(el=>({text:el.textContent,width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,plate:!!el.querySelector('.auto-squircle-svg path')}));
    assert(button.text.includes('Create activity'));assert(button.width>150);assert(button.height>=44);assert(button.plate);
    const bounds=await picker.evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth}));assert(bounds.scroll<=bounds.width+1);
    await page.screenshot({path:path.join(__dirname,'picker-'+width+'.png')});
  }
  await rail.getByRole('button',{name:'other',exact:true}).click();
  assert((await rail.getByRole('button',{name:'other',exact:true}).getAttribute('class')).includes('active'));
  await rail.getByRole('button',{name:'Edit',exact:true}).click();
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  await rail.waitFor();
  await page.getByRole('button',{name:'Search activities',exact:true}).click();
  await page.getByRole('textbox',{name:'Search your activities',exact:true}).fill('test');
  await page.getByRole('button',{name:'Clear activity search',exact:true}).click();
  await page.getByRole('button',{name:'Close activity search',exact:true}).click();
  await create.click();await page.getByRole('textbox').first().waitFor();
  assert(await page.getByRole('heading',{name:'New Activity',exact:true}).count()>0);
  assert.deepEqual(errors,[]);
  checks.push('Creation has a labeled filled squircle button at 320/390/430px; all splits and Edit occupy one independently scrolling row, without page overflow.');
  checks.push('Split selection, Edit/Cancel, search/clear/close, and Create New Activity entry work.');
  fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify({passed:true,checks,errors},null,2));console.log(JSON.stringify({passed:true,checks}));
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
