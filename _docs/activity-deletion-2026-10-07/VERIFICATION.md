# Typed activity deletion — 2026-10-07

Requested behavior: retain long press, require an exact phrase such as **Delete Leg Press**, remove the repeated split heading and deletion hint from Add Activity browsing.

`ActivityDeleteDialog` disables deletion until exact equality, and guards submission independently. Every attempt starts blank. Cancel/Escape preserves records. A single IndexedDB transaction removes the activity, its sets, and its session notes; failure leaves all records intact and shows retry. Daily activity menu permanent deletion uses the same dialog. Routine membership references retain the existing unavailable-activity handling.

Fresh isolated Chromium checks cover real picker touch-event long press, invalid names/case/trailing space, Enter submission, exact match, Cancel, reset, focus trapping, Escape, simulated transaction failure/retry, reload, preservation of unrelated activities/sets/notes, and the daily menu entry. No real browser records touched. No unexpected errors. All seven inline scripts parse and whitespace check passes. Layout reviewed at 320/390px; physical Safari keyboard review remains open.

- [Confirmation, 390px](./confirmation-390.png)
- [Confirmation, 320px](./confirmation-320.png)
- [Picker without the repeated heading/hint](./picker-390.png)
- [Results](./results.json)

Local only, not committed, pushed, or deployed. Includes the previous local creation crash fix without changing the creation icon.
