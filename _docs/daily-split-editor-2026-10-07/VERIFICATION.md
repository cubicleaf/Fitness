# Daily split chooser — shared Edit entry

Added Edit with the Add Activity picker's existing class/colors, below the split choices. Opens the same `EditCategoriesModal`; save persists categories, refreshes the App data, and returns to the chooser. Cancel returns without adding unsaved categories. “Change Split” on this screen is now “Choose Split.” No broader layout redesign included.

Fresh isolated Chromium checks: Cancel returns correctly; add/save shows the new choice immediately; rename refreshes the routine/activity category references; remove/save removes a choice; date assignment remains intact; Add Activity's editor sees the same resulting library; Edit has a 44px target and fits 320/390px. No unexpected console errors. All inline scripts parse and whitespace check passes. No real browser data touched.

- [390px chooser](./chooser-390.png)
- [320px chooser](./chooser-320.png)
- [Results](./results.json)

Local, not pushed/deployed. Previous local creation repair and typed deletion changes retained.
