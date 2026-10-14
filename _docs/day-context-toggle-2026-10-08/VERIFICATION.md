**Document status: Archived — 2026-10-08.** The global toggle and retained weight control were rejected. Current implementation: [per-activity context](../activity-row-context-2026-10-08/VERIFICATION.md).

# Daily split context toggle — 2026-10-08

Restored the original screenshot layout: date heading, bodyweight control/value, split tabs, bodyweight help, numbered tiles and connecting rail, uppercase usage/last-used summaries, and full-width Find or assign an activity footer. Existing local split editing and unrelated picker/deletion fixes are preserved.

A single `(i)` button toggles the list between usage summaries and each activity's complete latest workout. It has a 44px touch target, accessible name, pressed state, and visible keyboard focus. Names and controls stay visible throughout. Secondary details fade out over 250ms, switch at zero opacity, then fade in over 250ms with `cubic-bezier(0.25, 0.1, 0.25, 1)`. Rapid toggles cancel pending swaps; reduced motion skips the fade and delay. The choice is temporary UI state, with no stored preference or record changes.

Last-workout badges use the main log's visible-set rules, formatter, set order, and color ramp. All sets wrap rather than truncate. Empty histories say No workout logged yet. No data migration or runtime dependencies.

Isolated Chromium checks pass at 320/390/1000px: restored default appearance, toggle touch target, intermediate outgoing and incoming opacity, full workout content, repeated values, long banded sets, reversal, rapid repeat taps, keyboard Space/Enter, immediate reduced-motion changes, shared split-editor navigation, and activity-history navigation. No console errors. Seven scripts parse; Git whitespace check passes. No real browser records touched. Physical Safari review remains open.

- [Summary / default phone preview](./summary-390.png)
- [Workout context phone preview](./workout-390.png)
- [Narrow summary](./summary-320.png)
- [Narrow workout context](./workout-320.png)
- [Results](./results.json)

Local, uncommitted, not pushed or deployed. Supersedes the rejected always-visible last-workout redesign from earlier today.
