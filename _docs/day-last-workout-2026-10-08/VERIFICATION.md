**Document status: Archived — 2026-10-08.** Tim rejected this appearance. Current implementation: [daily context toggle](../day-context-toggle-2026-10-08/VERIFICATION.md).

# Daily split screen — last workout, 2026-10-08

Removed this screen's scale/bodyweight control and Find activity footer. The existing question SVG sits immediately to the right of Choose Split, retains a transparent 44px touch target, and opens a field note explaining this screen. Bodyweight entry elsewhere is unchanged.

Each activity now shows only its latest workout's set badges beneath its name: shared `formatSetBox`, `getSetBoxColor`, `getVisibleSets`, and `set-box` styling preserve the main log's content, sequence, repeated-value abbreviation, and three-depth color ramp. Neutral placeholders stay hidden. Presence-only sessions show Did some; measured sessions hide redundant presence markers, matching the main log. Activities with no visible sets have no badges. No usage-count or last-used-date summary remains. Usage ranking and the selected-day completion checks are preserved.

Layout uses 8px between toolbar controls, 12px below the toolbar, 12px vertical row padding, and 4px between activity names and their badge containers. All badges wrap and the activity list scrolls vertically; even unusually long labels wrap inside the available width.

Isolated Chromium verification passes at 320/390/430/1000px: bodyweight, repeated weights/reps, shuffled insertion order, latest-date selection, timed distance, presence-only and mixed sessions, empty history, neutral placeholders, selected-day checkmarks, all 14 long banded sets, help opening/closing, split editor opening/canceling, and activity-history navigation. The history screen's latest measured badges match the list. Seven inline scripts parse and Git's whitespace check passes. Tests use a fresh browser context; no real browser data was touched. Physical Safari review remains open.

- [Phone preview](./activities-390.png)
- [Narrow phone preview](./activities-320.png)
- [All long sets](./all-sets-390.png)
- [Results](./results.json)
- [Verification script](./verify.cjs)

Initial GitHub check: fetched origin; local main and origin/main both point to f471b97. No unpushed commits. Pre-existing uncommitted changes in index.html, STATUS.md, and six dated verification folders were preserved. This update remains uncommitted and has not been pushed or deployed.
