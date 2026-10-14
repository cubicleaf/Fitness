# Daily split view cleanup

- Split name is the header; date is secondary. Bodyweight/help are quiet header controls.
- Activities / Choose Split are a simple two-column navigation row.
- List retains use-based ranking and logged checkmarks but replaces oversized rank tiles/spine with small ranks. History becomes `10 sets · Oct 6` rather than uppercase prose.
- Find activity uses a compact plus/text footer, with a 44px touch target; list retains independent scrolling.
- Existing logging, bodyweight editing, help, split choice, and the shared split editor callbacks remain wired.

Isolated Chromium checks pass at 320/390/1000px for header fit, a ten-activity list with long names, list/footer geometry and scrolling, help opening/closing, and split add/rename/remove/cancel/shared picker consistency. No unexpected console errors; seven inline scripts parse and whitespace check passes. No real browser records touched. Physical-phone review remains open.

- [Phone](./activities-390.png)
- [Narrow](./activities-320.png)
- [Desktop frame](./activities-1000.png)
- [Results](./results.json)

Local only; not pushed/deployed. Earlier local changes preserved. The separate 700ms motion recipe was not applied as part of this visual cleanup.
