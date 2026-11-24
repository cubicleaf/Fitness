# Fitness logging with the origin offline

The fixture starts with the checked-in sample log at Fitness commit `8fe84e53bdf5c3e5b37cdc88893b6183534182bd`. It fixes the test clock at November 24, 2026 in New York. Each run gets a fresh browser profile and a loopback port. The HTTP allowlist serves only app files and the demo seed. The browser test aborts other intercepted requests.

## Reproduce on this Mac

```bash
cd /Users/cubicleaf/Documents/Fitness-git
export PLAYWRIGHT_MODULE="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright"
node _docs/offline-logging-2026-11-24/check.cjs chromium
node _docs/offline-logging-2026-11-24/check.cjs webkit
```

Each command first expects the deliberate missing-row case to fail at `OFFLINE_PERSISTED_SET_UI`, then runs the same journey with the row intact. Append `--missing-row` after the engine name to see the assertion as a nonzero exit.

## What the journey exercises

- Open the sample log through the app. Wait for `sw.js` to control the page, then navigate to today.
- Search for **Bench Press**. The result dates the last use to November 9. Before logging, the weight picker shows **Last 205 lbs · Nov 9** and the reps picker shows **205 × 6, 205 × 5, 205 × 5** with the repeated weights elided in the app.
- Log **212 lbs × 11** through the weight and reps controls. Wait for its visible set badge and corroborate the committed IndexedDB row.
- Shut down the origin and reload the same tab. The service worker still controls the loaded UI. Today’s badge appears exactly once and the persisted row still has the same ID. The demo database owns the row. The real database in the same isolated profile has zero sets.
- Reopen Bench Press. The prior November 9 history row still has the original three sets. The search result now shows November 24 and the weight and reps pickers use today's latest set, as the app’s current comparison rules specify.
- For the negative control, delete only the new set from the isolated demo database after its successful UI save. The same reload reaches the persisted-set assertion and fails there. The application files are identical in both runs.

## Browser evidence

Chromium 151.0.7922.34 and WebKit 26.5, both at 390 × 844 with touch emulation. The real HTTP listener stopped and received zero requests after the reload. The host’s general `navigator.onLine` indicator can still say true with the Fitness origin down. A separate WebKit run using Playwright’s own offline switch hit a navigation-level internal error before the application could load, so the reproducible check uses origin shutdown in both engines. The origin-down journey reproduced no Fitness defect.

A real iPhone check is needed for Safari and the installed Home Screen app. In a sample-log profile, log one distinct set, enable Airplane Mode with Wi-Fi disabled, fully close and reopen Fitness, and verify the set plus the prior history. This check does not establish iOS storage retention after OS eviction or under extended use.

## Cache use

No media caches or installations used. The test closes its isolated browser profiles and its loopback listener.
