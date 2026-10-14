# Focus, edge accents and history fade — 2026-10-14

App-wide source review found the retired deletion stripe already removed.
The only runtime border-left declaration was a timer-option divider; removed.
All authored focus outlines were replaced, including daily activity context,
routine choices, weight adjustment, rep history and custom confirmation.
The shared `:focus` rule suppresses native outline and focus shadow, preserving
actual focus. Text entry changes fill; keyboard-focused controls brighten.
Ordinary input borders, supplied icon/Clarity artwork and unrelated shadows
remain. There is no focus-blur workaround or disabled keyboard navigation.

Shared HistorySessionRow measures scrollWidth against clientWidth. It now
uses `calc(100% - 10px)` for the right-only overflow fade instead of 85%.
Short rows, including notes, are unmasked. Overflow rows with/without notes
retain View all and all sets. Notes keep their separate preview treatment.
The set strip's boundary is before any adjacent note/View all controls.

Headless browser checks use isolated synthetic data and local routed files.
Actual controls are focused on daily, Add Activity, search, creation, weight,
reps and Settings surfaces. Search stays focused, changes fill, and Tab works.
History checks use 2/12-set rows with/without notes at 320/390/430px, plus the
complete 12-set peek. Source scripts parse, there are no runtime left-border
properties, and runtime CSS contains no non-none outline declaration.
See `results.json`, screenshots and `verify.cjs`. Real phone data was not read.
