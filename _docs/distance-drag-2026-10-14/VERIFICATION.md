# Approved distance ruler — live Fitness port

Tim authorized implementation, testing and shipping on 2026-10-14.

The approved WDM fixture remains a reference; the live control is in `index.html`, integrated into `TimedDurationModal` using the existing duration-save path. No duplicate app or storage schema was created.

## Contract

- Optional empty value; no automatic distance logged just by opening.
- Right adds 0.1 mi/km per 16px; left subtracts; 8px of horizontal intent before capture. Clamp at zero, no inertia or fixed maximum.
- A centered marker with moving tenths ticks; major labels every 0.5.
- Exact typing, comma decimal, clearing, Enter returns focus to ruler.
- mi/km converts the distance to hundredths rather than relabeling it.
- Use last reads this activity's actual positive distance, valid unit, latest date/set order on or before the selected date. Future sessions excluded. Hidden when no usable history exists.
- Keyboard: arrows 0.1; Shift+arrows 0.01; Home zero; ring-free focus fill.
- Draft survives weight-picker unmount and timer screen switches, resets when activity/day changes. Existing duration, distance and unit persistence/CSV/history stay authoritative.

## Verified

`node _docs/distance-drag-2026-10-14/verify.cjs` launches an isolated headless Chromium context and serves the actual app source. It never opens or modifies Tim's browser workout database.

`results.json`: all checks pass, zero page errors. Screenshots: `distance-320.png`, `distance-390.png`, `distance-430.png`.

Checked mouse and genuine emulated touch input; vertical touch scrolling changes modal scroll position without altering distance; horizontal movement has correct sensitivity/direction; threshold, cancellation, zero clamp, keyboard and reduced motion; typing, conversion, latest-history lookup; weight-picker round trip; actual preset and stopwatch writes with distance/unit; optional blank distance; reload persistence; non-distance timed activity without a ruler. All controls meet 44px minimums at the three widths. Seven inline scripts parse and the diff passes whitespace checks.

Physical iPhone feel remains for Tim to assess; emulated touch is not a physical-device test.

## Release

Pending verification of the GitHub-triggered production deployment.
