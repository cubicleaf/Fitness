const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '../..');
const viewport = { width: 390, height: 844 };
const today = '2026-11-24';
const priorDate = '2026-11-09';
const exerciseName = 'Bench Press';
const testWeight = 212;
const testReps = 11;
const files = new Map([
  ['/', ['index.html', 'text/html']],
  ['/index.html', ['index.html', 'text/html']],
  ['/sw.js', ['sw.js', 'text/javascript']],
  ['/seed-data.csv', ['seed-data.csv', 'text/csv']],
  ['/site.webmanifest', ['site.webmanifest', 'application/manifest+json']],
  ...['favicon-16x16.png', 'favicon-32x32.png', 'favicon-192x192.png',
    'favicon-512x512.png', 'apple-touch-icon.png'].map(file => ['/' + file, [file, 'image/png']]),
  ['/favicon.ico', ['favicon.ico', 'image/x-icon']]
]);

async function serve() {
  const requests = [];
  const server = http.createServer(async (request, response) => {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    requests.push(request.method + ' ' + pathname);
    if (request.method !== 'GET' || !files.has(pathname)) {
      response.writeHead(404).end();
      return;
    }
    const [file, type] = files.get(pathname);
    try {
      response.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
      response.end(await fs.readFile(path.join(root, file)));
    } catch (error) {
      response.destroy(error);
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  return { server, requests, origin: 'http://127.0.0.1:' + server.address().port };
}

// Use the app's current connection only to corroborate what the UI shows.
async function snapshot(page) {
  return page.evaluate(async name => {
    const read = (database, store) => new Promise((resolve, reject) => {
      const request = database.transaction(store, 'readonly').objectStore(store).getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const exercise = (await read(db, 'exercises')).filter(row => row.name === name);
    const sets = (await read(db, 'sets')).filter(row => row.exerciseId === exercise[0]?.id);
    const real = await new Promise((resolve, reject) => {
      const request = indexedDB.open('FitnessTracker');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const realDb = request.result;
        read(realDb, 'sets').then(result => resolve(result.length), reject).finally(() => realDb.close());
      };
    });
    return { name: db.name, exercise, sets, real, demo: localStorage.getItem('wp_demo_active') };
  }, exerciseName);
}

async function removeFixtureRow(page, id) {
  await page.evaluate(id => new Promise((resolve, reject) => {
    if (db.name !== 'FitnessTrackerDemo') return reject(new Error('Expected an isolated demo database'));
    const transaction = db.transaction('sets', 'readwrite');
    transaction.oncomplete = resolve;
    transaction.onabort = () => reject(transaction.error);
    transaction.objectStore('sets').delete(id);
  }), id);
}

async function run(browser, omitPersistedSet) {
  const { server, requests, origin } = await serve();
  const denied = [];
  const stopOrigin = async () => {
    if (!server.listening) return;
    await new Promise(resolve => {
      server.close(resolve);
      server.closeAllConnections();
    });
  };
  const context = await browser.newContext({
    viewport, isMobile: true, hasTouch: true, timezoneId: 'America/New_York'
  });
  try {
    await context.route('**/*', route => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.origin === origin && files.has(url.pathname) && request.method() === 'GET') {
        return route.continue();
      }
      denied.push(request.method() + ' ' + url.origin + url.pathname);
      return route.abort();
    });
    const page = await context.newPage();
    page.setDefaultTimeout(7000);
    await page.clock.setFixedTime(new Date(today + 'T16:00:00Z'));
    await page.goto(origin + '/');
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    assert.equal(await page.evaluate(() => navigator.serviceWorker.controller.scriptURL), origin + '/sw.js');
    const button = name => page.getByRole('button', { name, exact: true });
    await button('Show me the demo').tap();
    await button('I’ll look around').tap();
    await button('Jump to today').tap();
    await button('Open calendar').waitFor({ state: 'visible' });
    const pre = await snapshot(page);
    assert.equal(pre.name, 'FitnessTrackerDemo');
    assert.equal(pre.demo, 'true');
    assert.equal(pre.real, 0);
    assert.equal(pre.exercise.length, 1);
    const prior = pre.sets.filter(set => set.date === priorDate).sort((a, b) => a.setOrder - b.setOrder);
    assert.deepEqual(prior.map(set => [set.weight, set.reps]), [[205, 6], [205, 5], [205, 5]]);
    assert.equal(pre.sets.filter(set => set.date === today).length, 0);
    assert.ok(requests.includes('GET /seed-data.csv'));

    const openBench = async () => {
      await button('Add New Activity').tap();
      await button('Search activities').tap();
      await page.getByRole('combobox', { name: 'Search your activities' }).fill(exerciseName);
      const match = page.getByRole('option').filter({ has: page.getByText(exerciseName, { exact: true }) });
      await match.waitFor({ state: 'visible' });
      const label = await match.innerText();
      await match.tap();
      return label;
    };
    const searchLast = await openBench();
    assert.match(searchLast, /Last · Nov 9\b/);
    const historic = page.getByRole('button', { name: /Open .*Nov 9.*day log/ });
    await historic.waitFor({ state: 'visible' });
    await button('Log a Set').tap();
    const weightLast = page.locator('.weight-entry-hint').filter({ hasText: /^Last / });
    await weightLast.waitFor({ state: 'visible' });
    const weightReference = await weightLast.innerText();
    assert.match(weightReference, /^Last 205 lbs · Nov 9\b/);
    await page.locator('#set-weight-input').fill(String(testWeight));
    await button('Use 212 lbs').tap();
    const priorRail = page.getByRole('region', { name: /^Last workout, 2026-11-09\./ });
    await priorRail.waitFor({ state: 'visible' });
    const priorBadges = await priorRail.locator('.set-box-content').allTextContents();
    assert.deepEqual(priorBadges, ['205 lbs × 6', '× 5', '× 5']);
    await page.getByRole('spinbutton', { name: 'Custom reps' }).fill(String(testReps));
    await button('Log 11 reps').tap();
    const setBadge = page.locator('.exercise-group .set-box-content').getByText('212 lbs × 11', { exact: true });
    await setBadge.waitFor({ state: 'visible' });
    assert.equal(await setBadge.count(), 1);

    const online = await snapshot(page);
    const todaySets = online.sets.filter(set => set.date === today);
    assert.equal(todaySets.length, 1);
    const [logged] = todaySets;
    assert.deepEqual([logged.exerciseId, logged.weight, logged.reps, online.real],
      [pre.exercise[0].id, testWeight, testReps, 0]);
    if (omitPersistedSet) await removeFixtureRow(page, logged.id);

    const requestCount = requests.length;
    await stopOrigin();
    // Keep the service worker free to attempt its network-first request against
    // the stopped origin. This exercises rejection in the browser's own stack.
    await page.reload({ waitUntil: 'domcontentloaded' });
    await button('Open calendar').waitFor({ state: 'visible' });
    await page.waitForFunction(() => db?.name === 'FitnessTrackerDemo');
    const browserOnlineFlag = await page.evaluate(() => navigator.onLine);
    assert.equal(await page.evaluate(() => navigator.serviceWorker.controller.scriptURL), origin + '/sw.js');
    assert.equal(requests.length, requestCount, 'Loopback server received a request after offline reload');

    // The negative control must finish the same reload before failing this assertion.
    const persisted = await snapshot(page);
    assert.equal(persisted.demo, 'true');
    assert.equal(persisted.real, 0);
    try {
      await setBadge.waitFor({ state: 'visible', timeout: 2500 });
    } catch (error) {
      if (error.name !== 'TimeoutError') throw error;
      assert.fail('OFFLINE_PERSISTED_SET_UI: the new set is absent after reload');
    }
    assert.equal(await setBadge.count(), 1, 'OFFLINE_PERSISTED_SET_UI: duplicate set after reload');
    assert.deepEqual(persisted.sets.filter(set => set.date === today), [logged]);
    assert.deepEqual(persisted.sets.filter(set => set.date === priorDate), pre.sets.filter(set => set.date === priorDate));

    const searchAfter = await openBench();
    assert.match(searchAfter, /Last · Nov 24\b/);
    await historic.waitFor({ state: 'visible' });
    const oldBadges = await page.locator('.history-session-row').filter({ has: historic })
      .locator('.history-session-sets .set-box').allTextContents();
    assert.deepEqual(oldBadges, priorBadges);
    await button('Log a Set').tap();
    await weightLast.waitFor({ state: 'visible' });
    const currentWeightReference = await weightLast.innerText();
    assert.equal(currentWeightReference, 'Last 212 lbs · Today');
    await button('Use 212 lbs').tap();
    const currentRail = page.getByRole('region', { name: /^Last workout, 2026-11-24\./ });
    await currentRail.waitFor({ state: 'visible' });
    assert.deepEqual(await currentRail.locator('.set-box-content').allTextContents(), ['212 lbs × 11']);
    assert.equal(requests.length, requestCount);
    assert.deepEqual(denied, []);
    return {
      database: persisted.name, exercise: exerciseName, exerciseId: logged.exerciseId,
      priorDate, weightReference, priorBadges, today, newSet: '212 lbs × 11',
      offlineRows: 1, sameRowId: true, priorHistoryUnchanged: true,
      currentWeightReference, offlineOriginRequests: requests.length - requestCount,
      originListening: server.listening, browserOnlineFlag,
      realDatabaseSetCount: persisted.real
    };
  } finally {
    await context.close();
    await stopOrigin();
  }
}

async function main() {
  const engine = process.argv[2] || 'chromium';
  assert.ok(['chromium', 'webkit'].includes(engine), 'Use chromium or webkit');
  const browser = await playwright[engine].launch({ headless: true });
  try {
    const environment = { engine, version: browser.version(), viewport, touch: true };
    if (process.argv[3] === '--missing-row') {
      await run(browser, true);
      assert.fail('Missing-row fixture unexpectedly passed');
    }
    await assert.rejects(run(browser, true), {
      code: 'ERR_ASSERTION', message: 'OFFLINE_PERSISTED_SET_UI: the new set is absent after reload'
    });
    console.log(JSON.stringify({ ...environment, negative: 'OFFLINE_PERSISTED_SET_UI' }));
    console.log(JSON.stringify({ ...environment, baseline: await run(browser, false) }));
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
