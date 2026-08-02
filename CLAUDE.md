# Fitness-git project guidance

- Field-note triggers always use the supplied question-mark SVG at `assets/question-field-note.svg`, represented in the single-file app by `IconFieldNote` with tokenized `currentColor` styling. Do not introduce a replacement question mark, circle, or alternate field-note icon for new field notes.
- Keep the app offline-safe: new UI assets should be inlined into `index.html` when used at runtime rather than loaded from a CDN or an external URL.
