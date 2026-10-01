# Fitness — contrast evidence

Calculated from saved browser-computed JSON and actual source. WCAG relative luminance calculation on sRGB; alpha blended in sRGB before linearization. Ratios rounded to two decimals, no pass rounding. Every row below is foreground dialog text within the recorded 390×844 viewport, not dimmed page content behind a modal. The criterion for these small text samples is 4.5:1. These are color calculations, not anti-aliased screenshot-pixel measurements.

The older captures do not contain `plateFill`. Ordinary modal text has a measured opaque #1a0a12 ancestor. The picker row uses source final override: accent #8b3a62 at 22% mixed with page #1a0a12 = RGB(50.86,20.56,35.60); later 53-picker-family/54-variation-sheet JSON corroborates `plateFill: color(srgb 0.199451 0.0806275 0.139608)`.

| Capture / zero-based JSON item / location | Visible text | Size | Foreground treatment | Background RGB | Composited foreground RGB | Current ratio | Opaque text-faint ratio | Opaque accent-soft ratio |
|---|---|---|---|---|---|---:|---:|---:|
| 25-settings-preferences, [48], x16 y583 | Your key stays on this device and is used directly from this browser. | 12px | #c77da0 / 55% | 26.00, 10.00, 18.00 | 121.15, 73.25, 96.10 | **2.69:1** | 5.45:1 | 6.27:1 |
| 25-settings-preferences, [53], x16 y724 | Better default for app-aware help, long answers, and spec-heavy questions. | 11px | #c77da0 / 55% | 26.00, 10.00, 18.00 | 121.15, 73.25, 96.10 | **2.69:1** | 5.45:1 | 6.27:1 |
| 37-day-detail, [32], x46 y130 | Last logged 184 lbs · Sep 28 | 11px | #c77da0 / 52% | 26.00, 10.00, 18.00 | 115.96, 69.80, 91.84 | **2.52:1** | 5.45:1 | 6.27:1 |
| 37-day-detail, [37], x72 y250 | 108 sets logged · Last used Sep 29 | 10px | #c77da0 / 70% | 26.00, 10.00, 18.00 | 147.10, 90.50, 117.40 | **3.63:1** | 5.45:1 | 6.27:1 |
| 42-calendar, [8], x14 y153 | S | 10px | #c77da0 / 55% | 26.00, 10.00, 18.00 | 121.15, 73.25, 96.10 | **2.69:1** | 5.45:1 | 6.27:1 |
| 47-picker-all, [9], x18 y201 | Touch and hold an activity to permanently delete it, even when it has no sets. | 10px | #c77da0 / 48% | 26.00, 10.00, 18.00 | 109.04, 65.20, 86.16 | **2.32:1** | 5.45:1 | 6.27:1 |
| 47-picker-all, [21], x16 y358 | All Activities | 12px | #c77da0 / 50% | 26.00, 10.00, 18.00 | 112.50, 67.50, 89.00 | **2.42:1** | 5.45:1 | 6.27:1 |
| 47-picker-all, [22], x16 y381 | Long press to delete | 11px | #c77da0 / 30% | 26.00, 10.00, 18.00 | 77.90, 44.50, 60.60 | **1.60:1** | 5.45:1 | 6.27:1 |
| 47-picker-all, [24], x28 y439 | · Last: Sep 28 | 12px | #c77da0 / 50% | 50.86, 20.56, 35.60 | 124.93, 72.78, 97.80 | **2.36:1** | 4.70:1 | 5.41:1 |
| 18-grip-dialog, [31], x44 y62 | When enabled, the first set screen shows optional grip choices until you pick one for that activity that day. | 12px | #c77da0 / 55% | 26.00, 10.00, 18.00 | 121.15, 73.25, 96.10 | **2.69:1** | 5.45:1 | 6.27:1 |
| 18-grip-dialog, [32], x44 y124 | Grip is not asked automatically for this activity. | 11px | #c77da0 / 62% | 26.00, 10.00, 18.00 | 133.26, 81.30, 106.04 | **3.10:1** | 5.45:1 | 6.27:1 |

## Header, sampled without relying on obscured content

Source Fitness index.html:33,905–924,935–966,975–980 supplies opaque top-nav background (8% accent + page), accent foreground and .78 control opacity. The same browser-computed nav background appears in JSON. Ratios below concern the resting unobscured header; do not count the visible DOM header beneath a modal as another failure.

| Element | Effective foreground RGB | Background RGB | Ratio | Proposed same-palette alternative |
|---|---|---|---:|---|
| Header utility icon / Today label | 116.13, 48.28, 81.81 | 35.04, 13.84, 24.40 | **2.00:1** | Opaque accent-soft #c77da0 = 5.99:1; opaque text-faint #9a8290 = 5.20:1 |
| Header title | 128.60, 53.58, 90.64 | 35.04, 13.84, 24.40 | **2.26:1** | Opaque accent-soft #c77da0 = 5.99:1; opaque text-faint #9a8290 = 5.20:1 |
| Accent without opacity | 139.00, 58.00, 98.00 | 35.04, 13.84, 24.40 | **2.51:1** | Opaque accent-soft #c77da0 = 5.99:1; opaque text-faint #9a8290 = 5.20:1 |

Meaning-bearing icon shapes should meet 3:1 against adjacent background; title/Today label should meet 4.5:1 at their small sizes. Simply removing .78 opacity from #8b3a62 does not reach 3:1 here. Icons containing their own low-opacity segments can be weaker still; above is the strongest main currentColor mark, not a claim that every SVG pixel shares that opacity.

## Delete button

23-delete-confirmation item [32] records white 14px/600 text at x199 y426, width112 height40. Source 2125–2127 sets danger #ff6b6b; later 62-merge-confirmation directly records the same `btn-confirm` plateFill rgb(255,107,107), confirming the fill.

| Treatment | Ratio | Decision |
|---|---:|---|
| Current white on #ff6b6b | **2.78:1** | Foreground RGB 255.00, 255.00, 255.00; background RGB 255.00, 107.00, 107.00 |
| Existing page-colored #1a0a12 text on #ff6b6b | **6.90:1** | Foreground RGB 26.00, 10.00, 18.00; background RGB 255.00, 107.00, 107.00 |
| Existing surface-colored #2a1520 text on #ff6b6b | **6.17:1** | Foreground RGB 42.00, 21.00, 32.00; background RGB 255.00, 107.00, 107.00 |
| White on derived darker danger: color-mix(in srgb, var(--danger) 65%, var(--bg-page)) | **5.42:1** | Foreground RGB 255.00, 255.00, 255.00; background RGB 174.85, 73.05, 75.85 |

Keep semantic red: both remedies preserve the hue family. Dark text preserves current bright danger plate; a derived darker red preserves white labels. Which visual direction is preferable is a taste choice; correcting the 4.5:1 shortfall is not. Do not recommend merely changing white to cream on the current light red, because it reduces contrast.

## Interpretation limits

- Sampled normal foreground text fails even though its base accent-soft token is readable; opacity is the specific recurring cause.
- Opaque #9a8290 and #c77da0 both pass on the measured page and row backgrounds, as tabulated. Recheck any future brighter selected fill separately.
- No count of all app failures is implied; hidden, offscreen and covered elements were not counted. Selected settings controls were excluded from this calculation because their older capture omitted actual plateFill and no failure was established.
- Font floor and font family concerns are separate aesthetic findings; 11px is a Tim/Fitness decision, not a WCAG minimum-font-size requirement.

## Additional rendered band-color check

Capture 107 confirms opaque white 12px labels and the following actual SVG fills. Keep the semantic band colors; pair each with a readable foreground.

| Band | Fill | White text | Page-dark text #1a0a12 |
|---|---|---:|---:|
| Red | #e74c3c | 3.82:1 | 5.02:1 |
| Black | #2c3e50 | 10.98:1 | 1.74:1 |
| Purple | #9b59b6 | 4.67:1 | 4.10:1 |
| Green | #27ae60 | 2.87:1 | 6.67:1 |
| Blue | #3498db | 3.15:1 | 6.08:1 |
| Orange | #e67e22 | 2.85:1 | 6.73:1 |
| Yellow | #f39c12 | 2.19:1 | 8.74:1 |
| Gray | #7f8c8d | 3.48:1 | 5.51:1 |
