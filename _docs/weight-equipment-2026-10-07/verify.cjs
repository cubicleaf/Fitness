const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const out = process.env.EVIDENCE_DIR || '/private/tmp/fitness-equipment-2026-10-07/evidence';
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  const page = await context.newPage(), errors = [], checks = [];
  page.on('pageerror', e => errors.push(e.message)); page.setDefaultTimeout(10000);
  const button = name => page.getByRole('button', { name, exact: true });
  const trigger = () => button('Equipment for this set');
  const input = () => page.locator('#set-weight-input');
  const option = name => page.getByRole('menuitemradio', { name, exact: true });
  const pass = text => { checks.push(text); console.log('PASS:', text); };
  const sets = () => page.evaluate(() => dbOps.sets.getAll());
  const todaySets = async () => (await sets()).filter(s => s.date === '2026-10-07');
  async function open(name = 'EZ Skullcrusher') {
    await button('Add New Activity').click();
    await page.locator('.exercise-picker-name').filter({ hasText: new RegExp('^' + name + '$') }).click();
    await button('Log a Set').click();
    await input().waitFor(); await page.waitForFunction(() => !document.querySelector('#set-weight-input').disabled);
  }
  async function chooseMode(name) { await trigger().click(); await option(name).click(); }
  async function shot(name) {
    await page.locator('.weight-picker-modal .modal-header h2').click();
    await page.waitForTimeout(250);
    const bounds = await page.locator('.weight-picker-modal').boundingBox();
    assert.ok(bounds.width <= 430 && bounds.x >= 0 && bounds.x + bounds.width <= page.viewportSize().width + 1);
    const bad = await page.locator('.weight-picker-modal button, .weight-entry-stepper input').evaluateAll(nodes => nodes.filter(n => n.getBoundingClientRect().width).flatMap(n => { const b = n.getBoundingClientRect(); return b.width < 44 || b.height < 44 || b.x < 0 || b.right > innerWidth ? [{ text: n.textContent, width: b.width, height: b.height }] : []; }));
    assert.deepEqual(bad, []);
    const row = await page.locator('.weight-equipment-row').evaluate(n => { const icon=n.querySelector('.picker-chip').getBoundingClientRect(), menu=n.querySelector('.weight-equipment-trigger').getBoundingClientRect(); return Math.abs(icon.y-menu.y) < 3; });
    assert.equal(row, true, 'equipment and load SVG share a row');
    const use = await page.locator('.weight-use-button').boundingBox(); assert.ok(use.width < bounds.width - 32);
    await page.screenshot({ path: path.join(out, name + '.png') });
  }
  async function log(reps = 10) { await button(String(reps)).click(); await page.locator('.weight-picker-modal').waitFor({ state: 'hidden' }); await page.waitForFunction(() => !document.querySelector('.rep-grid')); }
  try {
    await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:8771'); await button("I'll start my own").click();
    await page.evaluate(async () => {
      const base = { type: 'reps', categories: ['push'], weightDefault: 'weight', gripTrackingEnabled: false, lastUsed: null, createdAt: Date.now() };
      await dbOps.exercises.add({ ...base, id: 'skull', name: 'EZ Skullcrusher', weightMeaning: 'bar-custom', customBarWeight: 15, barName: 'Custom bar' });
      await dbOps.exercises.add({ ...base, id: 'bench', name: 'Benchpress', weightMeaning: 'barbell', barName: 'Barbell' });
      await dbOps.exercises.add({ ...base, id: 'dumb', name: 'Dumbbell Press', weightMeaning: 'per-side' });
      await dbOps.exercises.add({ ...base, id: 'timed', name: 'Weighted Hold', type: 'timed', weightMeaning: 'total' });
      await dbOps.sets.add({ id: 'legacy', date: '2026-08-03', exerciseId: 'skull', exerciseName: 'EZ Skullcrusher', weight: 20, weightType: 'lbs', weightMeaning: 'bar-custom', reps: 10, duration: null, setOrder: 1, exerciseOrder: 1, createdAt: 1 });
    });
    const legacy = (await sets()).find(s => s.id === 'legacy');
    await open(); await input().fill('20');
    await page.getByText('= 55 lbs total', { exact: true }).waitFor();
    assert.match(await page.locator('.weight-equation').innerText(), /15 lbs custom bar \+ 20 lbs × 2/);
    assert.equal(await page.getByText('Bar math', { exact: false }).count(), 0);
    for (const width of [390, 320, 1000]) { await page.setViewportSize({ width, height: 844 }); await shot('bar-plates-' + width); }
    pass('Compact equipment menu sits beside the SVG; 15 + 20 × 2 = 55 is always visible; buttons fit at 320/390/1000px.');
    await page.setViewportSize({ width: 390, height: 844 });
    await chooseMode('Fixed weight'); await input().fill('40'); await shot('fixed-390');
    assert.equal(await page.locator('.weight-equation').count(), 0);
    await chooseMode('Bar + plates'); await button('Done').click();
    assert.equal(await input().inputValue(), '20'); await button('Use 55 lbs total').click();
    await page.getByText('Weight: 55 lbs total', { exact: true }).waitFor(); await log(10);
    const bar = (await todaySets())[0]; assert.equal(bar.weight, 55); assert.equal(bar.barWeightAtLog, 15); assert.equal(bar.weightMeaning, 'bar-custom');
    pass('Switching fixed/bar preserves separate drafts; plate logging saves total 55 and bar snapshot 15.');
    await open(); await chooseMode('Fixed weight'); await input().fill('50'); await button('Use 50 lbs').click(); await log(12);
    const fixed = (await todaySets()).find(s => s.weight === 50); assert.equal(fixed.weightMeaning, 'total'); assert.equal(fixed.barWeightAtLog, undefined);
    await open(); assert.match(await trigger().innerText(), /Fixed weight/); assert.equal(await input().inputValue(), '50');
    await trigger().click(); await page.locator('#weight-equipment-menu').waitFor(); await page.keyboard.press('Escape');
    await page.locator('#weight-equipment-menu').waitFor({ state: 'hidden' });
    assert.equal(await trigger().evaluate(n => n === document.activeElement), true);
    await trigger().press('ArrowDown'); await page.locator('#weight-equipment-menu').waitFor();
    await page.waitForFunction(() => document.activeElement.getAttribute('aria-checked') === 'true');
    await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
    await button('Done').click(); assert.equal(await input().inputValue(), '20');
    await page.getByRole('button', { name: 'Use 20 lbs per side, 55 lbs total', exact: true }).click(); await log(8);
    assert.deepEqual((await sets()).find(s => s.id === 'legacy'), legacy);
    const ex = await page.evaluate(() => dbOps.exercises.get('skull')); assert.equal(ex.customBarWeight, 15); assert.equal(ex.weightMeaning, 'bar-custom');
    pass('One activity logs fixed 50 and loadable 55; latest mode restores, keyboard switching works, and history/activity setup stay unchanged.');
    await open(); await trigger().click(); await button('Custom bar').click(); await page.getByLabel('Bar weight (lbs)', { exact: true }).fill('0'); await button('Done').click();
    assert.equal(await page.locator('.weight-use-button').isDisabled(), true);
    await trigger().click(); await page.getByLabel('Bar weight (lbs)', { exact: true }).fill('25'); await button('Done').click();
    await page.getByText('= 65 lbs total', { exact: true }).waitFor();
    await trigger().click(); await page.waitForTimeout(250); await page.screenshot({ path: path.join(out, 'equipment-menu-390.png') }); await page.locator('.weight-picker-modal .modal-header h2').click(); assert.equal(await page.locator('#weight-equipment-menu').count(), 0);
    await button('Use 65 lbs total').click(); await log(10);
    const changed = (await todaySets()).find(s => s.weight === 65); assert.equal(changed.barWeightAtLog, 25);
    assert.equal((await todaySets()).find(s => s.weight === 55).barWeightAtLog, 15);
    pass('Custom bar changes preserve per-side plates, invalid zero bars cannot log, outside-click closes, and older snapshots retain their bar weight.');
    await open('Benchpress'); assert.match(await trigger().innerText(), /Bar \+ plates/); await input().fill('45');
    await page.getByText('= 135 lbs total', { exact: true }).waitFor(); await button('Use 135 lbs total').click(); await log(10);
    await open('Dumbbell Press'); assert.match(await trigger().innerText(), /Per hand/); await input().fill('35'); await button('Use 35 lbs each').click(); await log(12);
    assert.equal((await todaySets()).find(s => s.exerciseId === 'dumb').weightMeaning, 'per-side');
    pass('Standard 45 lb bar arithmetic and per-hand dumbbell logging still work.');
    await open('Weighted Hold'); await chooseMode('Bar + plates'); await button('EZ bar · 20 lbs').click(); await button('Done').click(); await input().fill('10'); await button('Use 40 lbs total').click(); await button('Log 0:30').click();
    await page.locator('.timed-duration-content').waitFor({ state: 'hidden' });
    const timed = (await todaySets()).find(s => s.exerciseId === 'timed'); assert.equal(timed.duration, 30); assert.equal(timed.weightMeaning, 'bar-custom'); assert.equal(timed.barWeightAtLog, 20);
    pass('Timed weighted entries also save the chosen equipment and full total.');
    await page.reload(); await open(); assert.equal(await input().inputValue(), '20'); await page.getByText('= 65 lbs total', { exact: true }).waitFor();
    await page.emulateMedia({ reducedMotion: 'reduce' }); assert.equal(await page.locator('.weight-entry-mode').evaluate(n => getComputedStyle(n).animationName), 'none');
    assert.deepEqual(errors, []);
    pass('Mixed equipment, custom bar, and plates survive reload; reduced motion and page-error checks pass.');
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ checks, errors, sets: await sets() }, null, 2));
  } catch (error) { console.error(error); await page.screenshot({ path: path.join(out, 'failure.png') }).catch(() => {}); process.exitCode = 1; }
  finally { await browser.close(); }
})();
