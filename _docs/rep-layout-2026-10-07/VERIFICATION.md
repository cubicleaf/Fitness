# Compact rep picker — 2026-10-07

Shared RepPickerModal now places last-session badges after Load and optional Grip in one toolbar. Icons reserve their width; history takes the remaining space with a horizontal touch/keyboard-scrollable rail. Every badge retains its existing daily-view formatter, colors, and original order. Fades appear only at edges with hidden content, responding to scroll and resize. Date remains a small label above the badges.

Custom reps uses the existing Clarity Ring input, a small “reps” label, and a bare 44px checkmark. Empty, zero, negative, or fractional counts cannot submit; positive integers can log by checkmark or Enter. Preset grid and normal logging callbacks remain shared.

Fresh isolated Chromium checks pass: repeated history badges, real weighted flow saving 33 reps and surviving reload, invalid count rejection, no-history mode, Grip sheet, and 14 long banded records with both controls fixed. Layout at 320/390/1000px has no toolbar overflow; fades switch correctly at either end and resize. All seven inline scripts parse; whitespace check passes. No real browser data touched. Physical Safari review remains open.

- [Phone preview](./reps-390.png)
- [Narrow preview](./reps-320.png)
- [Long history with Grip, narrow](./overflow-grip-320.png)
- [Long history with Grip, phone](./overflow-grip-390.png)
- [Results](./results.json)

Local only, not pushed/deployed. Prior local creation fix, typed deletion, and split-editor link are retained.
