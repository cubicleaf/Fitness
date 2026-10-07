const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const out = process.env.EVIDENCE_DIR || '/private/tmp/fitness-timer-2026-10-07/aesthetic';
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  const page = await context.newPage(), errors = [], checks = [];
  page.setDefaultTimeout(10000); page.on('pageerror', error => errors.push(error.message));
  const button = name => page.getByRole('button', { name, exact: true });
  const trigger = () => page.locator('.timer-load-trigger');
  const allSets = () => page.evaluate(() => dbOps.sets.getAll());
  const pass = message => { checks.push(message); console.log('PASS:', message); };
  async function open() {
    await button('Add New Activity').click();
    await page.locator('.exercise-picker-name').filter({ hasText: /^Plank$/ }).click();
    await button('Log a Set').click();
    await page.getByText('Log a completed duration', { exact: true }).waitFor();
  }
  async function capture(label) {
    await page.waitForTimeout(350);
    const result = await page.locator('.timed-duration-modal').evaluate(modal => {
      const m = modal.getBoundingClientRect();
      return { modal: { x: m.x, width: m.width, right: m.right }, bad: [...modal.querySelectorAll('button')].filter(n => n.getBoundingClientRect().width && getComputedStyle(n).visibility !== 'hidden').flatMap(n => {
        const r = n.getBoundingClientRect();
        return r.width < 44 || r.height < 44 || r.width >= m.width - 34 || r.x < m.x - 1 || r.right > m.right + 1 ? [{ text: n.textContent.trim(), width: r.width, height: r.height, x: r.x, right: r.right }] : [];
      }) };
    });
    assert.ok(result.modal.width <= 430 && result.modal.x >= 0 && result.modal.right <= page.viewportSize().width + 1);
    assert.deepEqual(result.bad, [], label + ': no stretched buttons, undersized targets, or horizontal overflow');
    await page.screenshot({ path: path.join(out, label + '.png') });
  }
  try {
    await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:8769');
    await button("I'll start my own").click();
    await page.evaluate(async () => {
      for (const [id, name] of [['plank', 'Plank'], ['sauna', 'Sauna'], ['stretch', 'Stretching']]) {
        await dbOps.exercises.add({ id, name, type: 'timed', categories: [], weightDefault: 'none', weightMeaning: 'total', gripTrackingEnabled: false, lastUsed: null, createdAt: Date.now() });
      }
      setPref('timerSoundsEnabled', 'false');
    });
    await open();
    assert.doesNotMatch(await page.locator('.timed-duration-modal').innerText(), /Weight:|Bodyweight|No load|Add Weight/);
    const svg = await trigger().evaluate(n => ({ background: getComputedStyle(n).backgroundColor, border: getComputedStyle(n).borderWidth, shadow: getComputedStyle(n).boxShadow, width: n.offsetWidth, height: n.offsetHeight, paths: n.querySelectorAll('svg path').length, extraPlate: n.querySelectorAll('.auto-squircle-svg').length }));
    assert.equal(svg.background, 'rgba(0, 0, 0, 0)'); assert.equal(svg.border, '0px'); assert.equal(svg.shadow, 'none');
    assert.equal(svg.width, 44); assert.equal(svg.height, 44); assert.equal(svg.paths, 2); assert.equal(svg.extraPlate, 0);
    for (const width of [390, 320, 1000]) {
      await page.setViewportSize({ width, height: 844 }); await capture('quick-log-' + width);
    }
    pass('Quick logging uses compact buttons at 320/390/1000px; the 44px weight SVG has no visible wrapper, extra plate, or weight text.');

    await page.setViewportSize({ width: 320, height: 844 });
    await trigger().click();
    await page.getByText('Current load: No load', { exact: true }).waitFor();
    await capture('load-sheet-320');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.picker-sheet').count(), 0);
    assert.equal(await trigger().evaluate(n => n === document.activeElement), true);
    await trigger().click(); await button('Bodyweight').click();
    assert.match(await trigger().getAttribute('aria-label'), /Bodyweight/);
    assert.equal(await page.locator('.picker-sheet').count(), 0);
    await trigger().click(); await button('No load').click();
    assert.match(await trigger().getAttribute('aria-label'), /No load/);
    await trigger().click(); await button('Add weight').click();
    await button('Use 45 lbs').click();
    await page.getByText('Log a completed duration', { exact: true }).waitFor();
    assert.match(await trigger().getAttribute('aria-label'), /45 lbs/);
    assert.doesNotMatch(await page.locator('.timed-duration-modal').innerText(), /Weight:|45 lbs/);
    await button('Log 0:30').click();
    await page.locator('.timed-duration-content').waitFor({ state: 'hidden' });
    const weighted = await allSets(); assert.equal(weighted.length, 1); assert.equal(weighted[0].weight, 45); assert.equal(weighted[0].weightType, 'lbs'); assert.equal(weighted[0].duration, 30);
    pass('SVG opens the load sheet; Escape restores focus, Bodyweight/No load work, and Add weight logs the selected 45 lbs.');

    await open(); await page.getByRole('button', { name: /^Time this activity/ }).click();
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 }); await capture('stopwatch-' + width);
    }
    await button('Start Stopwatch').click(); await page.waitForTimeout(1100); await button('Pause').click();
    await capture('stopwatch-paused-320');
    await trigger().click(); await capture('load-sheet-active-320');
    assert.equal(await button('Add weight').isDisabled(), true); await page.keyboard.press('Escape');
    await page.locator('.picker-sheet').waitFor({ state: 'hidden' });
    await button('Adjust actual time').click(); await capture('actual-time-320');
    await button('Back to timer').click(); await button('Reset').click();
    await button('Countdown').click();
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 }); await capture('countdown-' + width);
    }
    await page.evaluate(() => dbOps.dayNotes.set('__duration_presets__', JSON.stringify([2, 30, 60])));
    await page.reload();
    await open(); await page.getByRole('button', { name: /^Time this activity/ }).click(); await button('Countdown').click();
    await button('Start countdown for 0:02').click(); await page.getByText('Timer complete', { exact: true }).waitFor();
    await capture('countdown-complete-320');
    await button('Edit actual time').click(); await capture('countdown-editor-320');
    await page.getByLabel('Actual seconds', { exact: true }).fill('4'); await button('Log actual time').click();
    await page.locator('.timed-duration-content').waitFor({ state: 'hidden' });
    assert.ok((await allSets()).some(s => s.duration === 4));
    pass('Stopwatch, paused controls, countdown, completed actions, and actual-time editor all keep compact targets at 320px; timing and edited logging still work.');

    await button('Add New Activity').click();
    await page.locator('.exercise-picker-item').filter({ has: page.getByText('Sauna', { exact: true }) }).getByRole('button', { name: 'Pair time', exact: true }).click();
    await button('Pair Sauna with Stretching').click();
    assert.equal(await trigger().count(), 0);
    await capture('paired-320');
    assert.deepEqual(errors, []);
    pass('Shared-duration pairs keep their explanation and omit the irrelevant load trigger; no page errors.');
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ checks, errors }, null, 2));
  } catch (error) {
    console.error(error); await page.screenshot({ path: path.join(out, 'failure.png') }).catch(() => {}); process.exitCode = 1;
  } finally { await browser.close(); }
})();
