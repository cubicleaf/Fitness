// Pass PLAYWRIGHT_MODULE when Playwright is not installed in the normal lookup path.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  const page=await browser.newPage({viewport:{width:390,height:844}}), errors=[];
  page.setDefaultTimeout(7000);
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:8766');
  await page.getByText("I'll start my own",{exact:true}).click();
  async function open(){if(!await page.getByText('+ Create New Activity',{exact:true}).isVisible()) await page.getByText('+ Add New Activity',{exact:true}).click();await page.getByText('+ Create New Activity',{exact:true}).click();}
  await open();
  const input=page.getByPlaceholder('E.g., Bench Press');
  const modal=page.locator('.modal').filter({has:input});
  const helper=page.getByTestId('split-helper');
  await input.fill('bench press');await page.getByTestId('accept-split').waitFor();
  assert.doesNotMatch(await modal.getByRole('button',{name:'Push',exact:true}).getAttribute('class'),/active/);
  await page.getByTestId('accept-split').click();
  assert.match(await modal.getByRole('button',{name:'Push',exact:true}).getAttribute('class'),/active/);
  await input.fill('barbell curl');await page.waitForTimeout(450);
  assert.match(await modal.getByRole('button',{name:'Push',exact:true}).getAttribute('class'),/active/);
  assert.equal(await page.getByTestId('accept-split').count(),0);
  await modal.getByRole('button',{name:'No Split',exact:true}).click();
  await input.fill('mystery activity');await page.waitForTimeout(450);
  assert.equal(await modal.locator('.button-grid .active').count(),0);
  await modal.getByText('Neutral / Note-Only Activity',{exact:true}).click();
  await modal.getByRole('button',{name:'Create Activity',exact:true}).click();
  await input.waitFor({state:'hidden'});
  await page.reload();await open();
  await page.getByPlaceholder('E.g., Bench Press').fill('mystery activity');
  await page.getByRole('button',{name:'Use No Split',exact:true}).waitFor();
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  await open();await page.getByPlaceholder('E.g., Bench Press').fill('plank plus press');
  await page.waitForTimeout(450);assert.match(await helper.innerText(),/Not sure/);
  assert.equal(await page.getByTestId('accept-split').count(),0);
  // Unknown can save unassigned without the old split-warning interruption.
  await page.getByText('Neutral / Note-Only Activity',{exact:true}).click();
  await page.getByRole('button',{name:'Create Activity',exact:true}).click();
  await page.getByPlaceholder('E.g., Bench Press').waitFor({state:'hidden'});
  await page.reload();
  await open();await page.getByPlaceholder('E.g., Bench Press').fill('DB bench');
  await page.getByTestId('accept-split').waitFor();
  for(const width of [390,1280]) {
   await page.setViewportSize({width,height:844});await page.waitForTimeout(350);
   const bounds=await page.locator('.modal').filter({has:page.getByPlaceholder('E.g., Bench Press')}).boundingBox();
   assert.ok(bounds.width<=430 && bounds.x>=0 && bounds.x+bounds.width<=width,JSON.stringify(bounds));
  }
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'/tmp/fitness-split-preview/preview.png',fullPage:true});
  await page.getByRole('button',{name:'Create Activity',exact:true}).click();
  assert.match(await page.getByRole('alert').innerText(),/Choose.*type/);
  await page.getByTestId('accept-split').click();
  await page.getByRole('button',{name:'Reps',exact:true}).click();
  await page.getByRole('button',{name:'Total',exact:true}).click();
  await page.getByRole('button',{name:'Weight',exact:true}).click();
  await page.getByRole('button',{name:'Create Activity',exact:true}).click();
  await page.getByPlaceholder('E.g., Bench Press').waitFor({state:'hidden'});
  const created=await page.evaluate(async()=> (await dbOps.exercises.getAll()).filter(e=>e.name==='DB bench'));
  assert.equal(created.length,1); assert.deepEqual(created[0].categories,['push']); assert.equal(created[0].type,'reps');
  await page.getByRole('button',{name:'Use 45 lbs',exact:true}).click();
  await page.getByRole('button',{name:'10',exact:true}).click();
  await page.getByRole('button',{name:'Previous day',exact:true}).click();
  await page.getByRole('button',{name:'Next day',exact:true}).click();
  const sets=await page.evaluate(async()=>dbOps.sets.getAll());
  assert.ok(sets.some(s=>s.exerciseId===created[0].id && s.reps===10));
  await page.getByRole('button',{name:'Settings',exact:true}).click();
  await page.getByRole('button',{name:'Data',exact:true}).click();
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Export Data to CSV'}).click();
  const download=await downloadPromise;const csv=require('node:fs').readFileSync(await download.path(),'utf8');
  assert.match(csv,/DB bench/);
  const other=await browser.newContext();const imported=await other.newPage();
  await imported.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:8766');
  await imported.getByText("I'll start my own",{exact:true}).click();
  const roundtrip=await imported.evaluate(async text=>{await importWorkoutCSV(text); return {exercises:await dbOps.exercises.getAll(),sets:await dbOps.sets.getAll(),rows:text.trim().split('\n').map(parseCSVLine)};},csv);
  const restored=roundtrip.exercises.find(e=>e.name==='DB bench');assert.ok(restored);
  assert.deepEqual(restored.categories,['push']);
  assert.ok(roundtrip.sets.some(s=>s.exerciseId===restored.id && s.reps===10 && s.weight===45));
  assert.ok(roundtrip.rows.filter(r=>r[1]==='DB bench').every(r=>r.length===roundtrip.rows[0].length));
  await other.close();
  const fixtures=require('./cases.json');
  const results=await page.evaluate(cases=>cases.map(c=>ActivitySplitHelper.classify(c)),fixtures);
  for(let i=0;i<fixtures.length;i++) {
    if(fixtures[i].expected===null) assert.equal(results[i].status,'ask',fixtures[i].name);
    else assert.deepEqual([...results[i].splits].sort(),[...fixtures[i].expected].sort(),fixtures[i].name);
  }
  assert.deepEqual(errors,[]);console.log('PASS: optional suggestion, acceptance, manual protection, No Split persistence, unknown save, mobile/desktop bounds, no page errors.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
