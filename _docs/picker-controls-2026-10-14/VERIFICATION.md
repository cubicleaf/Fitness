# Add Activity controls — 2026-10-14

Tim requested a visible creation button and a single scrolling row of splits.
The create action uses the existing supplied plus/stretching icons, a filled
mauve squircle, and “Create activity” text. The split rail scrolls horizontally
and keeps its active choice visible on entry/restoration. Search stays in the
top row. Split Edit remains at the end of the scroll rail.

Headless Chromium checks cover 320/390/430px: one row, actual horizontal
overflow, no page overflow, visible filled button/label, minimum touch size,
split selection, Edit/Cancel, search/clear/close, and creation-screen opening.
The 390px screenshot was visually inspected. Tests use a fresh isolated
profile with local routed files; real workout records are not accessed.
See `verify.cjs`, `results.json`, and the phone-width PNGs.
