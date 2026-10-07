const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const out = process.env.EVIDENCE_DIR || '/private/tmp/fitness-timer-2026-10-07';
const executablePath = process.env.CHROMIUM_PATH;
const checks = [];
function passed(message) { checks.push(message); console.log('PASS:', message); }
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  const page = await context.newPage(), errors = [];
  page.setDefaultTimeout(8000);
  page.on('pageerror', error => errors.push(error.message));
  const button = name => page.getByRole('button', { name, exact: true });
  const allSets = () => page.evaluate(() => dbOps.sets.getAll());
  const row = name => page.locator('.exercise-picker-item').filter({ has: page.getByText(name, { exact: true }) });
  async function openTimed(name) {
    await button('Add New Activity').click();
    await row(name).click();
    await button('Log a Set').click();
    await page.getByText('Log a completed duration', { exact: true }).waitFor();
  }
  async function openPair() {
    await button('Add New Activity').click();
    await row('Sauna').getByRole('button', { name: 'Pair time', exact: true }).click();
    await button('Pair Sauna with Stretching').click();
    await page.getByText('One duration will be logged for Sauna and Stretching.', { exact: true }).waitFor();
  }
  async function loggedCount(count) {
    await page.waitForFunction(expected => dbOps.sets.getAll().then(sets => sets.length === expected), count);
    await page.locator('.timed-duration-content').waitFor({ state: 'hidden' });
  }
  async function chooseTiming(kind) {
    await page.getByRole('button', { name: /^Time this activity/ }).click();
    if (kind === 'countdown') await button('Countdown').click();
  }
  async function checkLayout(label, selector) {
    await page.waitForTimeout(350);
    const bounds = await page.locator('.modal').last().boundingBox();
    const width = page.viewportSize().width;
    assert.ok(bounds.width <= 430 && bounds.x >= 0 && bounds.x + bounds.width <= width + 1, JSON.stringify(bounds));
    const problems = await page.locator(selector).evaluateAll(nodes => nodes.filter(n => n.getBoundingClientRect().width && getComputedStyle(n).visibility !== 'hidden').flatMap(n => {
      const r = n.getBoundingClientRect();
      return r.width < 44 || r.height < 44 || r.x < -1 || r.right > innerWidth + 1 ? [{ text: n.textContent.trim(), width: r.width, height: r.height, x: r.x, right: r.right }] : [];
    }));
    assert.deepEqual(problems, [], `${label}: targets and horizontal bounds`);
    await page.screenshot({ path: path.join(out, label + '.png') });
  }
  try {
    await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:8769');
    await button("I'll start my own").click();
    await page.evaluate(async () => {
      for (const [id, name] of [['sauna', 'Sauna'], ['stretch', 'Stretching'], ['plank', 'Plank'], ['run', 'Run']]) {
        await dbOps.exercises.add({ id, name, type: 'timed', categories: [], weightDefault: 'none', weightMeaning: 'total', gripTrackingEnabled: false, lastUsed: null, createdAt: Date.now() });
      }
      await dbOps.dayNotes.set('__duration_presets__', JSON.stringify([2, 30, 60, 300, 600, 900, 1200, 1800, 2700, 3600]));
      setPref('timerSoundsEnabled', 'false');
    });
    await openTimed('Sauna');
    assert.equal(await button('Start Stopwatch').count(), 0);
    assert.equal(await button('Countdown').count(), 0);
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      await checkLayout('quick-log-' + width, '.timer-quick-log-view button');
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await chooseTiming('countdown');
    assert.equal(await button('Log 1:00').count(), 0);
    assert.equal((await allSets()).length, 0);
    await checkLayout('countdown-390', '.timer-general-view button');
    await page.setViewportSize({ width: 320, height: 844 });
    await checkLayout('countdown-320', '.timer-general-view button');
    await page.setViewportSize({ width: 390, height: 844 });
    await button('Back to logging').click();
    await button('Log 1:00').click();
    await loggedCount(1);
    assert.equal((await allSets())[0].duration, 60);
    passed('Opening and switching timing screens saves nothing; a preset still logs immediately after returning from Countdown.');

    await openTimed('Run');
    await page.getByLabel('Distance', { exact: true }).fill('2.5');
    await button('mi').click();
    await button('Log 5:00').click();
    await loggedCount(2);
    const run = (await allSets()).find(s => s.exerciseId === 'run');
    assert.equal(run.duration, 300); assert.equal(run.distance, 2.5); assert.equal(run.distanceUnit, 'km');
    passed('Quick logging preserves optional distance and its unit.');

    await openTimed('Plank');
    await button('Edit presets').click();
    await button('1').click(); await button('2').click(); await button('5').click();
    await button('Add 1:25').click();
    await button('Done').click();
    await button('Log 1:25').click();
    await loggedCount(3);
    assert.ok((await allSets()).some(s => s.exerciseId === 'plank' && s.duration === 85));
    passed('Editing presets retains exact seconds and returns to quick logging.');

    await openTimed('Plank');
    await chooseTiming('stopwatch');
    await checkLayout('stopwatch-390', '.timer-general-view button');
    await button('Start Stopwatch').click();
    await page.waitForTimeout(2100);
    await button('Pause').click();
    await button('Resume').click();
    await button('Pause').click();
    await button('Adjust actual time').click();
    await page.getByLabel('Actual seconds', { exact: true }).fill('12');
    await button('Back to timer').click();
    await button('Adjust actual time').click();
    await page.getByLabel('Actual minutes', { exact: true }).fill('0');
    await page.getByLabel('Actual seconds', { exact: true }).fill('45');
    await button('Apply time').click();
    assert.equal((await allSets()).length, 3);
    await button('Log 0:45').click();
    await loggedCount(4);
    assert.ok((await allSets()).some(s => s.exerciseId === 'plank' && s.duration === 45));
    passed('Stopwatch start, pause, resume, adjustment cancel and adjustment apply save only on Log.');

    await openTimed('Plank');
    await chooseTiming('countdown');
    await button('Start countdown for 0:30').click();
    assert.equal((await allSets()).length, 4);
    await page.getByText('Target 0:30', { exact: true }).waitFor();
    await button('Edit actual time').click();
    await page.getByLabel('Actual seconds', { exact: true }).fill('18');
    await button('Back to timer').click();
    await page.getByText('Target 0:30', { exact: true }).waitFor();
    await button('Edit actual time').click();
    await page.getByLabel('Actual seconds', { exact: true }).fill('18');
    await button('Log actual time').click();
    await loggedCount(5);
    assert.ok((await allSets()).some(s => s.exerciseId === 'plank' && s.duration === 18));
    passed('A running countdown can resume after canceling an edit and log a shorter actual duration.');

    await openTimed('Plank');
    await chooseTiming('countdown');
    await button('Start countdown for 0:02').click();
    await page.getByText('Timer complete', { exact: true }).waitFor();
    assert.equal((await allSets()).length, 5);
    await page.screenshot({ path: path.join(out, 'countdown-complete.png') });
    await button('Edit actual time').click();
    await page.getByLabel('Actual seconds', { exact: true }).fill('3');
    await button('Log actual time').click();
    await loggedCount(6);
    assert.ok((await allSets()).some(s => s.exerciseId === 'plank' && s.duration === 3));
    passed('Countdown completion saves nothing automatically; its actual duration can be adjusted upward before logging.');

    await openTimed('Plank');
    await chooseTiming('countdown');
    await button('Start countdown for 0:30').click();
    await button('Cancel').click();
    await button('Back to logging').click();
    assert.equal((await allSets()).length, 6);
    await button('Log 0:30').click();
    await loggedCount(7);
    passed('Canceling the countdown cue saves nothing and quick logging remains available.');

    await openPair();
    assert.equal(await page.getByRole('button', { name: /Did some/ }).count(), 0);
    await button('Log 15:00').click();
    await loggedCount(9);
    let paired = (await allSets()).filter(s => s.pairedWith);
    assert.equal(paired.length, 2); assert.ok(paired.every(s => s.duration === 900));
    assert.ok(paired.some(s => s.exerciseId === 'sauna' && s.pairedWith === 'stretch'));
    assert.ok(paired.some(s => s.exerciseId === 'stretch' && s.pairedWith === 'sauna'));
    await openPair();
    await button('Close').click();
    await row('Plank').click();
    await button('Log a Set').click();
    await button('Log 0:30').click();
    await loggedCount(10);
    assert.equal((await allSets()).filter(s => s.pairedWith).length, 2);
    passed('Pairing quick-logs the same time into both histories; canceling a pair cannot leak into a later single log.');

    await openPair();
    await chooseTiming('countdown');
    await button('Start countdown for 0:02').click();
    await page.getByText('Timer complete', { exact: true }).waitFor();
    await button('Edit actual time').click();
    await page.getByLabel('Actual seconds', { exact: true }).fill('4');
    await button('Log actual time').click();
    await loggedCount(12);
    paired = (await allSets()).filter(s => s.pairedWith && s.duration === 4);
    assert.equal(paired.length, 2);
    passed('The separate timing screen preserves pairing and logs the edited actual time for both activities.');

    await openTimed('Plank');
    await chooseTiming('countdown');
    await button('Start countdown for 0:02').click();
    await page.getByText('Timer complete', { exact: true }).waitFor();
    await button('Log 0:02').click();
    await loggedCount(13);
    assert.ok((await allSets()).some(s => s.exerciseId === 'plank' && s.duration === 2));
    passed('A completed countdown logs its exact duration when explicitly requested.');

    await openTimed('Sauna');
    await page.getByRole('button', { name: /Did some/ }).click();
    await loggedCount(14);
    assert.ok((await allSets()).some(s => s.exerciseId === 'sauna' && s.isPresenceOnly && s.duration === null));
    passed('Did some remains a presence-only entry without an invented duration.');

    await page.reload();
    assert.equal((await allSets()).length, 14);
    await openTimed('Sauna');
    assert.equal(await button('Log 1:25').count(), 1);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const animation = await page.locator('.timer-quick-log-view').evaluate(n => getComputedStyle(n).animationName);
    assert.equal(animation, 'none');
    assert.deepEqual(errors, []);
    passed('Logs and edited presets survive reload; reduced motion is honored and no page errors occur.');
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ checks, errors, sets: await allSets() }, null, 2));
  } catch (error) {
    console.error(error);
    await page.screenshot({ path: path.join(out, 'failure.png') }).catch(() => {});
    fs.writeFileSync(path.join(out, 'failure.txt'), (await page.locator('body').innerText()).slice(-8000));
    process.exitCode = 1;
  } finally { await browser.close(); }
})();
