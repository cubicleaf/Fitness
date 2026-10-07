# FITNESS picker and header refresh — 2026-10-07

Local implementation in `../../index.html`. Uncommitted and not deployed. Existing local changes were preserved.

## Review previews

- [Header, 390px](./header-390.png) · [320px](./header-320.png)
- [Activity picker, 390px](./picker-390.png) · [320px](./picker-320.png)
- [Rep entry with exact daily-style last session, 390px](./reps-390.png) · [320px](./reps-320.png)
- [Unsplit activity assignment](./unsplit.png)

## Changes

1. Latest measured session retains every set in original order, using the same formatter, `set-box` classes, padding, 13px type, and three-depth color ramp as the daily view. Prior suggestion logic and common/usual fallback numbers are removed. These badges are reference history; the existing rep grid logs sets. Custom reps use a compact 64×52px Clarity Ring field next to a content-sized Use button.
2. FITNESS replaces Fitness Tracker in the header. Type is 22.1px, up from 17px. Main icons are 28.6px, up from 22px; the gear is 31.2px with a normalized viewBox so its occupied height matches. All use `--accent`, the day-arrow color. The scale dial is opaque, and the gear’s transparent-looking ring is widened from roughly 2.8 to 5 SVG units using the header background color.
3. Settings → Weekly Splits has Activities without a split. Choose multiple splits, then Assign splits. The activity record updates without rewriting sets or history; completed rows leave the list. Placement is provisional.
4. A parent-held in-memory snapshot restores search, split, family selection, and list scroll after opening an activity. Search X clears the query in one tap while leaving search open; a second tap closes the empty search. No stored workout data is used for UI context.
5. All split tabs plus All/Edit wrap into visible rows. Targets remain at least 44px tall. Create uses a compact bare icon, search is on demand, and redundant deletion prose is removed; the shorter long-press hint remains.

## Verification

Used a temporary loopback server and fresh isolated Chromium contexts with service workers blocked, using synthetic activities and sets. No real workout data or production deployment was changed. This app stores these features entirely in IndexedDB; no API or credentials participate in these flows.

[Combined flow checks](./verify.cjs) · [Results](./results.json) · [Focused family-return check](./verify-family.cjs)

Verified header fit at 320/390/1000px, all split destinations without horizontal scrolling, activity-history Back preserving search and nonzero scroll, one-tap search clear, family and split restoration, all three prior set labels including repeated 10-rep sets, daily badge dimensions, custom 33-rep logging reaching IndexedDB, and multi-split assignment removing the completed row and surviving reopening. No browser page errors. All seven inline scripts pass syntax checks and the diff passes whitespace checks.

Physical iPhone interaction and live deployment remain unverified. The first extended check encountered a synthetic test fixture calling a nonexistent family-write helper; the fixture was corrected to use activity family metadata, and both focused and combined checks then passed.
