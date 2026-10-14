# Add Activity search suggestions — proposal, 2026-10-14

Tim requested thinking through useful suggestions beneath search, temporarily
covering the split row. This is a proposal; no search behavior is changed.

## Recommended first version

- Open a small anchored panel below the search field, over the split rail.
  Keep the field, clear/close button and existing search context in place.
- Before typing, show up to four distinct activities most recently logged.
  Derive dates from real set history, not solely the unreliable legacy
  exercise.lastUsed index. Label this group “Recent”; omit it when empty.
- While typing, show up to four strong saved-activity matches. Reuse the
  current name matcher: exact name, name prefix, token/abbreviation matches,
  then bounded typo matches. Exact/prefix results always outrank frequency.
  Frequency may break ties, not bury the activity the person typed.
- Each row names the actual activity and may show its last logged date.
  Tap opens the existing activity context/logging route. It never logs a set.
- Offer “View all matches” only if more exist. It dismisses the panel and
  exposes the existing complete result list with the query preserved. Avoid
  rendering an identical full list immediately beneath four duplicate rows.
- Typed search remains across all splits, as in today's implementation;
  covering the split row must not create a hidden split filter. Closing
  search restores the selected split and its horizontal scroll position.
- Keyboard arrows choose an option, Enter opens it, Escape closes the panel
  first; input/option focus remains visible through fill, without rings.
  Implement as a labeled combobox/listbox, position outside clipped ancestors,
  and keep the mobile keyboard from covering the options.

## Keep it trustworthy

Suggestions use only saved names and recorded workout history. No network/AI
call, invented activity, muscle inference, program recommendation or broad
synonym guess. Existing explicit aliases (db, bb, kb, rdl, ohp, etc.) are
supported by today's matcher. A family umbrella must not silently become a
specific member. Presence-only entries count as recent activity without
pretending to contain measured sets. An empty library or weak match yields
an honest empty state, not an automatically created activity.

## Next decision

Recommended start: recent items when blank, strongest saved-name matches when
typing, four-row maximum. First mock it up with populated, sparse, no-match,
long-name and keyboard-open states. Test whether the panel actually saves taps
before replacing any existing result presentation.
