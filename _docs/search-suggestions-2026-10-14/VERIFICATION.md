# Approved search suggestions — 2026-10-14

Tim reviewed the WDM preview and explicitly authorized shipping it.
Actual Fitness now uses a body portal beneath the search toolbar, covering
splits while a maximum four-option shortlist is shown. Empty query uses the
latest actual set date per saved activity; never-logged entries are excluded.
Typed choices require the existing matcher's score >=650; View all exposes
all existing matches, including permissive lower-confidence results.

Choosing calls the existing onSelect route; it never logs a set. Query and
search state remain in the existing picker context. Back retains the query;
Escape dismisses suggestions first, then search; outside click dismisses the
panel; closing search restores split and scroll. Selected-family, pairing and
split editor overlays suppress suggestions. No new database schema, account,
API, AI, autosave behavior or external runtime dependency.

Headless checks run the actual app with fresh isolated data, including legacy
activities without lastUsed. They verify real-set recency, maximum four,
full five-result bench search, abbreviations, typo, keyboard choice into the
real activity context, Back, empty results/library, outside close, selected
split, stored-set count, portal cleanup, ring-free focus and 320/390/430px.
Screenshot visually inspected. Scripts parse and whitespace check passes.
See verify.cjs, results.json and captures. Real phone data is not read.
