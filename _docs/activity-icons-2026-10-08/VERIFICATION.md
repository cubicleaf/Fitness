# Scale, question, and info SVG correction — 2026-10-08

Restored the existing scale SVG as a bare button opening the bodyweight editor. No weight value, units, or No weight placeholder is shown. The latest toolbar pass reduces all four visible items by 15% while preserving 44px touch targets. Scale artwork is 37.4px, question artwork is 34.51px, swap artwork is 15.3px, and both text labels are 13.6px. Squircle surfaces scale to 85% within their unchanged touch targets. The prior left-hand rank enlargement is retained at 15.6px. Browser checks confirm exact sizes, matching label fonts, plate scaling, one-row toolbar fit, and chooser navigation at 320/390/430/1000px.

Replaced each textual `( i )` with Tim's supplied `info-svgrepo-com.svg`. Geometry, viewBox, stroke widths, and original 0.15 fill opacity are preserved; `currentColor` replaces the imported gray. The supplied art is stored in assets/activity-info.svg and inlined as IconActivityInfo for offline use. It is displayed at 32px inside a transparent 44px target without an extra frame. Per-activity behavior and fade timing are unchanged.

Isolated browser checks pass at 320/390/430/1000px: one-row toolbar, scale SVG without text and editor opening, exact toolbar artwork sizes and equal label fonts, bare hosts, supplied info path/circle structure, independent activity contexts, fade behavior, rapid taps, keyboard and reduced motion, long workouts, split editing, and history navigation. No browser errors. All seven scripts parse and whitespace check passes. No real browser records changed. Physical Safari review remains open.

- [Phone preview](./summary-390.png)
- [Expanded contexts](./context-390.png)
- [Narrow preview](./summary-320.png)
- [Results](./results.json)

Local, uncommitted, not pushed/deployed.
