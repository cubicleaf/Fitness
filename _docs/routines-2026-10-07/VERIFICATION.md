# Routines — local first version, 2026-10-07

Entry: **Settings → Weekly Splits → Open Routines**. Library builds and assigns plans; Session logs the selected date. A detailed routine's daily heading also opens Session. Placement can move later; no app-wide overhaul is included.

## Built

- Rename shared routines, search/filter exact activities, add/remove, drag or arrow order; reset to usage ranking.
- Simple Split Day, detailed activity checklist, and explicit Rest; shared weekdays and per-date None/routine overrides.
- Direct rep, weighted, timed, and neutral logging through existing flows; return to Session after save/cancel. Completion derives from records, survives reload, and needs no second checkbox state.
- Current/last recorded set badges use daily-view styling. Optional unfinished emphasis defaults off. Past dates display only recorded activities.
- CSV round-trip preserves routines, weekday/date assignments, order, preferences, and zero-set activities. Older formats remain supported.

## Verification

`verify.cjs` and `edges.cjs` use fresh isolated Chromium profiles with synthetic data. Tests cover create/rename/membership, real pointer drag and keyboard order, shared weekday rename, four logging paths, cancellation, reload, emphasis, actual export/download/import, ID remapping, malformed metadata rejection before writes, deletion clearing all assignments without deleting sets, simple/rest/None modes, restore weekday default, extra activity independence, and past-date reads with before/after store equality. Both March and October real CSV formats also import into isolated profiles; October preserves all 39 dated splits. No personal browser data was read or changed.

Layout screenshots: 320px, 390px, 1000px; no routine workspace horizontal overflow. Seven inline scripts pass syntax parsing. Automated Chromium does not establish iPhone Safari or thumb-use approval; Tim's physical-phone review and deploy decision remain pending.

- [Builder, 320px](./editor-320.png)
- [Builder, 390px](./editor-390.png)
- [Builder, desktop](./editor-1000.png)
- [Library and week](./library-390.png)
- [Session](./session-390.png)
- [Logged session with emphasis enabled](./session-logged-390.png)
- [Main check results](./results.json)
- [Edge check results](./edge-results.json)

The included `routine-backup.csv` contains synthetic test records only. Changes are local, uncommitted, and not deployed.
