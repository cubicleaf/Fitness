# Daily activity motion — 2026-10-14

Recovered the exact recipe Tim pasted in “[ FITNESS ] 10/7 DONE”
(thread `01a11821-fdc0-7910-a206-f0d1d934d1fa`). That prior chat stopped
without implementing it after treating a copied study disclaimer as an
approval requirement. This pass applies the main daily activity portion.

700ms in both directions, cubic-bezier(.4,0,.2,1), 100ms staging, -6px content
travel, coordinated 0–8px padding and 7% accent wash. Each card owns its
cancellable animations. Content stays mounted through closing and becomes
inert immediately. Completion versions prevent stale restoration. Rapid
reversals use the visible frame and remaining distance. Reduced motion is
immediate. No workout data schema or logging behavior changed.

Verification uses an isolated browser profile, routed local files, headless
Chromium, and three synthetic activities. It checks actual browser animation
objects for timing/delay/easing; samples intermediate padding/opacity/height;
checks close retention, repeated reversal, A → B → C, reduced motion,
320/390/430px geometry, the actual Add Set pickers, a new 105 lbs × 11 entry, original-set preservation,
and persistence after reload.
The 390px open card screenshot was visually inspected. See `results.json`
and `verify.cjs` for exact results. No real browser records were accessed.

Dialog and nested-sheet lifecycle changes from the broader WDM recipe are
not included in this daily-card fix. Physical iPhone critique remains for Tim.
