# Create Activity repair and icon concepts

The form called `categoryKey`, which was private to the `ActivitySplitHelper` closure. It now exports that helper, and the form uses `ActivitySplitHelper.categoryKey` for current-day and carry suggestions. The toolbar action still opens the existing form; icon alternatives remain separate previews.

Fresh isolated Chromium checks: actual toolbar click opens the form; Cancel returns to the picker; rep, timed, and neutral activities save through the form and survive reload; loaded-carry recommendation works. No browser console errors. Form screenshots at 320/390px, all seven inline scripts parse, and whitespace check passes. Personal browser records were not touched.

- [Visual comparison](./concepts.png)
- [Interactive HTML comparison](./concepts.html)
- [Creation form, 390px](./fixed-390.png)
- [Check results](./results.json)

Concept A: card and pencil (recommended: writing a new library entry). B: notebook and plus (collection cue). C: rubber stamp (physical creation cue, less immediately clear). All are transparent inline SVG artwork. App icon unchanged pending Tim's choice. Fix is local, not pushed or deployed.
