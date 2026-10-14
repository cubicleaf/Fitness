**Document status: Archived — 2026-10-08.** Current icon correction restores the scale SVG and replaces textual info controls: [current previews](../activity-icons-2026-10-08/VERIFICATION.md).

# Per-activity context — 2026-10-08

Each activity owns a bare `( i )` button at the far right of its summary/date row. Pressing it replaces only that activity's summary with its full latest workout. Other activities keep their own states. Press again to return to the summary. The 250ms fade-out / 250ms fade-in, playbook easing, rapid-toggle cancellation, and immediate reduced-motion behavior are retained. Names stay visible. The button remains at the top of long expanded workouts.

The bodyweight control, icon, value, placeholder, props, and help copy are removed from Day Detail. The existing scale/editor elsewhere in the app remains separate. The top toolbar is now split activities, Change Split, and the supplied question-mark SVG, all on one row. The help trigger is transparent with no border or rounded shell and explains split ranking and per-activity context. All interactive targets remain at least 44px. No nested buttons: the history action and each context button are independent siblings in the row's structure.

Isolated Chromium verification passes at 320/390/430/1000px: independent multiple-row opening and reversal, placement beyond and vertically aligned with the date summary, no bodyweight UI or text, single-row toolbar, transparent bare help, intermediate fade opacity, rapid repeat taps, keyboard Space/Enter, immediate reduced motion, no-history state, all 14 long sets, anchored collapse control, shared split editor, and separate history navigation. No browser errors. Seven scripts parse and Git whitespace check passes. No real browser records touched. Physical Safari review remains open.

- [Default phone preview](./summary-390.png)
- [Two independent activity contexts](./context-390.png)
- [Narrow phone preview](./summary-320.png)
- [Results](./results.json)

Local, uncommitted, not pushed/deployed. Supersedes the previous list-wide context toggle.
