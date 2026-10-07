const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const out = process.env.EVIDENCE_DIR || '/private/tmp/fitness-equipment-2026-10-07/copy-backup';
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block', acceptDownloads: true });
  const page = await context.newPage(); page.setDefaultTimeout(10000);
  const errors = [], checks = []; page.on('pageerror', e => errors.push(e.message));
  const button = name => page.getByRole('button', { name, exact: true });
  const all = () => page.evaluate(() => dbOps.sets.getAll());
  const pass = text => { checks.push(text); console.log('PASS:', text); };
  const count = async n => { await page.waitForFunction(n => dbOps.sets.getAll().then(s => s.length === n), n); await page.waitForFunction(() => !document.querySelector('.rep-grid') && !document.querySelector('.weight-picker-modal')); await page.waitForFunction(n => document.querySelectorAll('.set-boxes-container .set-box').length === n, n); await page.waitForTimeout(600); };
  async function expand() { await page.waitForFunction(() => !document.querySelector('.exercise-expanded-content.is-closing')); if (!await page.locator('.exercise-expanded-content.is-open').count()) await page.locator('.exercise-name').filter({ hasText: /^EZ Skullcrusher$/ }).click(); await button('Both').waitFor(); }
  try {
    await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:8771'); await button("I'll start my own").click();
    await page.evaluate(async () => {
      await dbOps.exercises.add({ id: 'skull', name: 'EZ Skullcrusher', type: 'reps', categories: [], weightDefault: 'weight', weightMeaning: 'bar-custom', customBarWeight: 15, barName: 'Custom bar', gripTrackingEnabled: false, createdAt: 1 });
      await dbOps.sets.add({ id: 'original', date: getTodayString(), exerciseId: 'skull', exerciseName: 'EZ Skullcrusher', exerciseOrder: 1, setOrder: 1, weight: 65, weightType: 'lbs', weightMeaning: 'bar-custom', barWeightAtLog: 25, barNameAtLog: 'Custom bar', reps: 10, duration: null, createdAt: 1 });
    });
    await page.reload(); await expand(); await button('Same weight as last set').click(); await page.getByText('Weight: 65 lbs total', { exact: true }).waitFor(); await button('12').click(); await count(2);
    let entries = await all(); let copied = entries.find(s => s.setOrder === 2); assert.equal(copied.weight, 65); assert.equal(copied.barWeightAtLog, 25); assert.equal(copied.weightMeaning, 'bar-custom');
    await expand(); await button('Both').click(); await count(3); copied = (await all()).find(s => s.setOrder === 3); assert.equal(copied.weight, 65); assert.equal(copied.barWeightAtLog, 25); assert.equal(copied.weightMeaning, 'bar-custom');
    pass('Same weight and Both preserve the recorded 25 lb bar and 65 lb total despite a different activity default.');
    await expand(); await button('Same reps as last set').click(); await page.locator('#set-weight-input').waitFor(); await page.waitForFunction(() => !document.querySelector('#set-weight-input').disabled);
    await button('Equipment for this set').click(); await page.getByRole('menuitemradio', { name: 'Fixed weight', exact: true }).click(); await page.locator('#set-weight-input').fill('40'); await button('Use 40 lbs').click(); await count(4);
    const fixed = (await all()).find(s => s.setOrder === 4); assert.equal(fixed.weight, 40); assert.equal(fixed.weightMeaning, 'total'); assert.equal(fixed.barWeightAtLog, undefined); assert.equal(fixed.reps, 12);
    await expand(); await button('Both').click(); await count(5); copied = (await all()).find(s => s.setOrder === 5); assert.equal(copied.weight, 40); assert.equal(copied.weightMeaning, 'total'); assert.equal(copied.barWeightAtLog, undefined);
    pass('Same reps can switch to a fixed 40 lb bar, and Both repeats it without inheriting the activity’s loadable-bar setup.');
    await page.screenshot({ path: path.join(out, 'mixed-history-390.png') });
    const repeatedLabel = await page.evaluate(() => formatSetBox({ weight: 55, weightType: 'lbs', weightMeaning: 'total', reps: 12, duration: null }, { weight: 55, weightType: 'lbs', weightMeaning: 'bar-custom', barWeightAtLog: 15, reps: 10, duration: null })); assert.match(repeatedLabel, /55 lbs/);
    await button('Settings').click(); await button('Data').click();
    const pending = page.waitForEvent('download'); await page.getByRole('button', { name: /Export Data to CSV/ }).click(); const download = await pending;
    const backup = path.join(out, 'mixed-equipment.csv'); await download.saveAs(backup); const csv = fs.readFileSync(backup, 'utf8');
    const importedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
    const importedPage = await importedContext.newPage(); importedPage.on('pageerror', e => errors.push(e.message));
    await importedPage.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:8771'); await importedPage.getByRole('button', { name: "I'll start my own", exact: true }).click();
    await importedPage.evaluate(text => importWorkoutCSV(text), csv);
    const restored = await importedPage.evaluate(() => dbOps.sets.getAll());
    const signature = sets => sets.map(s => [s.setOrder, s.weight, s.weightType, s.weightMeaning, s.barWeightAtLog ?? null, s.barNameAtLog ?? null, s.reps]).sort((a, b) => a[0] - b[0]);
    assert.deepEqual(signature(restored), signature(await all())); assert.deepEqual(errors, []);
    pass('Actual CSV export/import into a fresh browser context retains all five sets, equipment modes, totals, snapshots, and reps.');
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ checks, errors, restored }, null, 2));
  } catch (error) { console.error(error); await page.screenshot({ path: path.join(out, 'failure.png') }).catch(() => {}); process.exitCode = 1; }
  finally { await browser.close(); }
})();
