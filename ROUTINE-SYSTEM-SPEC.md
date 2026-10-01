# Routine System — Implementation Spec & Handoff

**Authored:** 2026-09-30 · **Status:** Active spec, not yet built · **Authority:** Tim-directed

This document is a handoff for a fresh session. It carries the settled decisions from the
2026-09-30 design conversation, the existing-code findings that constrain the build, the data
model, a phased plan with mandatory check-ins, and the verification method for a codebase that
has no test runner.

**Read this entire document before writing a single line of code.** Several decisions here
reverse things the existing code does on purpose.

---

## 0. The one-paragraph version

Tim's Logbook gains a **Routine** section: a separate interface where the user assigns a routine
to each day of the week. A routine is either **Split Day (simple)** — one split category, and the
screen ranks that split's activities by use — or **Routine (detailed)** — a bespoke checklist of
specific activities. Routines live in a shared library, so two days can point at the same one.
Check-off is *derived from the log*, never stored. Activities are the same activities as
everywhere else in the app; only the interface differs. The existing free-text
"split label per weekday" feature is absorbed into this as the simple mode and retired.

---

## 1. Purview change (read first — this reverses stated project intent)

`INTENT.md` currently says:

> Not a program builder. It logs what you did — it doesn't tell you what to do.

Tim has **explicitly and deliberately** changed this (2026-09-30: *"I am intentionally changing
the purview of this project"*). This is not a principle to route around — it is being amended.

**Proposed amended principle, to replace the line above:**

> A light program layer: the app may tell you **what**, never **how much**. It can hold a
> checklist of activities for a day. It does not prescribe sets, reps, loads, or progression —
> "last time" remains the only number the app offers.

That wording is a proposal, not yet approved. **Phase 0 requires Tim to sign off on the exact
sentence before `INTENT.md` is edited.** Do not edit `INTENT.md` without that sign-off.

The narrowed principle is load-bearing for the rest of this spec: it is what makes decision
**D7** (no targets) a rule rather than a preference.

---

## 2. Required reading before building

| File | Why |
|---|---|
| `INTENT.md` | Core principles. Auto-save always; last time is king; suggestions not mandates; phone-first. All still apply except the program-builder line. |
| `STATUS.md` | 116KB. Read the `## Decisions` entries from 2026-08-14 forward in full. Critical ones named in §4 below. |
| `data-model.md` | The four original stores. Now partly stale — `sessionNotes` and `movementFamilies` exist too, and `templates` is about to be retired. |
| `FAMILY-SYSTEM-AND-PICKER-SPEC.md` | Families are organizational and history-free. A routine references **activities**, never families. |
| `TOUR-SPEC.md` | Tour step 3 anchors to `split-label`. This build changes that element. |
| `~/Documents/SKILLs/ux-playbook/PLAYBOOK.md` | See §9 — the `tims-ux-playbook` skill is mandatory for any UI work in this repo. |

### Codebase facts that will bite you

- **One file.** `index.html` is ~805KB and contains everything: markup, CSS, and the whole React app.
- **No JSX.** The app is written as `/*#__PURE__*/React.createElement(...)` calls directly. New
  components must match that style. Do not introduce a build step or JSX.
- **All IndexedDB goes through `idbRun`.** Per the 2026-08-14 decision, every store operation
  uses the single `idbRun` helper, which resolves on `tx.oncomplete` and rejects on
  `onabort`/`onerror`. Never open a raw `db.transaction` for a single record. Bulk writes
  (migration, import, reset) may use raw transactions but must handle `oncomplete`, `onerror`
  **and** `onabort`.
- **Activities have multiple categories.** Use the existing `getExCategories(ex)` helper
  (`index.html:3912`), which reads the `categories` array and falls back to the legacy `category`
  string. Never read
  `ex.category` directly.
- **Error surfacing.** Wrap risky writes with the existing `safeDb()` and surface failures via
  `showDbError()`. A silent failure is a bug, not a degradation.
- **Reduced motion.** Every animation in this codebase is guarded under
  `prefers-reduced-motion`. Match that.

---

## 3. Existing-code findings (what's actually there now)

Verified by reading `index.html` at commit `6532d02` on 2026-09-30. **Line numbers drift fast —
this file changed twice on the day this spec was written.** Re-grep before trusting any of them.

### 3.1 The current "split per day" is a free-text string

`templates` store (`index.html:3523`), seven records:

```
{ dayOfWeek: 1, label: "Push Day" }
```

That is the entire feature. The label is not a reference — it is text, compared
case-insensitively against `getExCategories(ex)` to sort the Add Activity picker. Renaming a
category (`index.html:4689`, "Update weekly template references") has to sweep three places to keep them agreeing: `templates`, the
per-day split records, and every activity's categories.

**Consequence for this build:** the new model must use stable IDs, not strings, for activity
references. Split *names* remain strings (they are user-authored category names), but a
routine's activity list must be IDs.

### 3.2 Per-day splits are stored as fake day notes

Per-day overrides live in the `dayNotes` store under magic keys:

```
dayNotes: { date: "__split_2026-09-26", note: "Pull" }
```

`"__none__"` is a sentinel for "deliberately no split." Real written notes share the store with
these. Written in four places: CSV import (`index.html:10606`), "apply to today" on template save
(`10933`), the bake-on-read below (`15108`), and `setDaySplit` (`15118`). Read at `15092`, with the
`__none__` sentinel handled at `15094`.

**Consequence:** `dayNotes` has become a junk drawer. Do **not** extend it. §5 migrates these
records out.

### 3.3 Opening a past day writes to it

At `index.html:15106`, when a day has no stored split, the app derives one from *today's*
weekly template and **bakes it into storage** for that date:

```
if (templateLabel && currentDate <= getTodayString()) {
  await dbOps.dayNotes.set(`__split_${currentDate}`, templateLabel);
}
```

So scrolling back through last month retroactively stamps those days with the current Monday's
label. This is a silent history mutation and it is the exact trap the routine builder would
otherwise repeat.

**Consequence:** decision **D5** forbids it. Remove this write during Phase 1.

### 3.4 "Rest" is a pseudo-split, and it does not fit the simple/detailed split

Found while re-verifying on 2026-09-30 — this landed in today's work (`6532d02`) and is **not**
covered by the original two-mode design.

`index.html:10849`:

```
const templateOptions = ['', ...(settingsCategories || ['Push','Pull','Legs','Core','Cardio']), 'Rest'];
```

So a weekday's label can be `''` (rendered as "None"), a real user category, or the literal
string `'Rest'`. **`'Rest'` is not a category** — no activity carries it, and it matches nothing
in `getExCategories`. Today's commit made the None/Rest distinction visible: an unassigned day
displays "None", an explicitly saved rest day displays "Rest".

**Consequence:** a rest day cannot be modelled as `mode: "split"` with `splitName: "rest"` —
that is exactly the string-matching-against-a-nonexistent-category fragility this rebuild exists
to remove. The model needs a third mode. See §5.1.

This also means the existing feature has **three** meaningful states, not two, and the migration
must preserve all three: unassigned, a real split, and an explicit rest day.

### 3.5 Adjacent urgent finding (not part of this build)

`STATUS.md` (2026-09-04) states: *"The horizon is 2026-10-01: after that the demo starts ageing
again and the dataset needs extending."* Today is 2026-09-30. **The demo's rolling simulation
runs out tomorrow.** Extend `_archive/gen_summer_2026.py` and update `_docs/character-bio.md`.
Flag this to Tim; do not fold it into this build.

---

## 4. Settled decisions — do not relitigate

Each of these was decided with Tim on 2026-09-30. A new session that disagrees should raise it
with Tim, not quietly build something else.

**D1 — One concept, two fidelities.** The old "assign a split to the day" feature does not
survive as a separate thing. It becomes the *simple* mode of a single Routine concept. Same
axis, two resolutions: simple says what kind of day, detailed says exactly what.

**D2 — Naming: "Split Day" / "Routine" primary, "(simple)" / "(detailed)" secondary.** The
gym-culture words carry the meaning for people who know them; the plain words teach everyone
else. Both appear together. Tim's phrasing: *"Split Day / Routine is the framing but underneath
it shows (simple / detailed). Best of both worlds."*

Render as a primary label with a quieter secondary, e.g.

```
Split Day          Routine
simple             detailed
```

Exact typography is a Phase 2 design decision under the UX playbook. Do not invent a third
vocabulary anywhere in the UI, copy, or code comments. In code, the mode values are
`'split'`, `'lineup'`, and `'rest'` (see §3.4 — `'rest'` is not a user-facing fidelity choice,
it is a third kind of day).

**D3 — Shared library.** Routines are named entities with IDs. Each weekday points at one by
`routineId`. Editing a routine updates every day pointing at it. Two days sharing a routine is
expected, not an edge case.

**D4 — Check-off is derived, never stored.** An item is done when at least one set exists for
that activity on that date. There is no `checked` field anywhere. This means: no second source of
truth, nothing that can disagree with the log, no new writes on the execution path, and nothing
extra to lose — which keeps faith with "auto-save always."

**D5 — Routines never rewrite history.** A routine applies to today and forward. Past days
render from the log alone. Opening a past day must not write anything. This reverses the current
behavior in §3.3.

**D6 — Order: most-used-first by default, drag to override.** Default order is derived from real
logged-set count, descending — the same ranking the split screen already uses. If the user drags
an item, a manual order is stored *for that routine* and wins from then on. Store order only once
the user has actually set one; a routine that has never been dragged holds no order data.

**D7 — Activities only, no targets.** A routine item is an activity reference and nothing else.
No target sets, reps, loads, RPE, or progression. Numbers come from "last time," as they already
do. This follows directly from the amended INTENT principle in §1.

**D8 — Nagging is opt-in, default off.** Unchecked items render as unchecked and nothing more.
A setting the user must deliberately turn on may add emphasis. See §7 for the open question about
what "nag" concretely means — it is deliberately unspecified here.

**D9 — New stores; retire `templates`; evacuate the `dayNotes` junk drawer.** See §5.

**D10 — Placement is provisional and the screens must be route-agnostic.** Tim's answer on
navigation was *"I feel like the entire layout needs to be reimagined."* That concern is real and
is **out of scope here** (see §8). Build the routine screens so that *where* they are reached
from is a single wiring decision — no routine component may depend on its parent screen, read
navigation state, or assume a particular back destination. Provisional entry point: a top-level
tab, because it is purely additive and the most reversible option. Confirm at Check-in #3.

---

## 5. Data model

### 5.1 New store: `routines`

```
{
  id:           "rt_a1b2c3"      // generated, stable, never shown to user
  name:         "Pull"           // user-authored, required, unique-ish (warn on dupe, don't block)
  mode:         "split"          // "split" | "lineup" | "rest"
  splitName:    "pull"           // mode "split" only: the category name, lowercased
  activityIds:  ["ex_x","ex_y"]  // mode "lineup" only: activity IDs, membership not order
  manualOrder:  null             // null = derive by use (D6); else array of activityIds
  createdAt:    1759190400000
}
```

Notes:
- `mode` decides which of `splitName` / `activityIds` is meaningful. Keep the unused one absent
  rather than empty, so a mode switch is visible in the data.
- `mode: "rest"` carries neither. It is a real, deliberate assignment and must stay distinct from
  a day with no routine at all — the current code already draws that line ("Rest" vs "None") and
  losing it would be a regression. A rest day's execution screen shows that it is a rest day and
  offers no list; logging is still permitted, because the app never prevents logging (§6.3).
- `manualOrder` is `null` until the user drags. When present it may legitimately disagree with
  `activityIds` membership (an activity added after a drag); treat `activityIds` as the truth for
  membership and append unknown IDs to the end of the derived order.
- A `splitName` must be validated against live categories on read, not assumed. Categories can be
  renamed and deleted (`index.html:4689` onward, `renameCategory` / `removeCategory`). A routine pointing at a dead split
  renders as unassigned, it does not crash.

**Indexes:** `by-name` for the library list and duplicate warnings.

### 5.2 New store: `week`

```
{ dayOfWeek: 0, routineId: "rt_a1b2c3" }   // 0 = Sunday … 6 = Saturday
```

Seven records maximum, `dayOfWeek` as primary key. `routineId: null` means the day has no
routine. This replaces `templates` entirely.

### 5.3 Per-day overrides

The existing feature lets a single date deviate from its weekday's split. Preserve that
capability, but move it out of `dayNotes`. Recommended: a `dayRoutines` store keyed by date.

```
{ date: "2026-09-30", routineId: "rt_a1b2c3" }   // or routineId: null for "explicitly none"
```

Phase 1 must decide and document whether "explicitly none" needs distinguishing from "no record"
— the old code needed a `__none__` sentinel for exactly this reason. Prefer an explicit
`routineId: null` record over a magic string.

### 5.4 Migration (Phase 1, highest-risk work in this build)

Bump the IndexedDB version. In the upgrade path:

1. Create `routines`, `week`, `dayRoutines`.
2. For each `templates` record, preserving all three existing states (§3.4):
   - empty `label` → `week: { dayOfWeek, routineId: null }` (the "None" day)
   - `label === 'Rest'` → find or create a routine `{ name: "Rest", mode: "rest" }`
   - any other `label` → find or create `{ name: label, mode: "split",
     splitName: label.toLowerCase() }`

   Labels that collide map to one shared routine — which is correct and is D3 working as intended.
   Match `'Rest'` case-insensitively, but do not treat a *user-created category* literally named
   "Rest" as the pseudo-split; if `settingsCategories` contains one, flag it to Tim rather than
   guessing, because the existing code cannot distinguish them either.
3. For each `dayNotes` record whose key starts with `__split_`: extract the date, resolve the
   label to a routine the same way, write a `dayRoutines` record, then **delete the `__split_`
   record**. `"__none__"` becomes `routineId: null`.
4. Leave `templates` in place but stop reading it. Delete it in a later version once the
   migration has been proven on real data.

**Hard requirements:**
- **Idempotent.** Running twice must not duplicate routines or lose overrides.
- **Non-destructive to sets and real notes.** Nothing in this migration may touch the `sets`
  store or any `dayNotes` record that is not `__split_`-prefixed.
- **Counted.** Log before/after counts for every store and assert they match expectations.

### 5.5 CSV export / import

Export currently writes a `__SPLITS__` metadata row plus per-day split lines; import writes them
back at `index.html:10606`. This model change breaks that format.

- Export: emit the new structure. Routines need name, mode, and membership to survive a round trip.
- Import: **must still accept old CSVs.** Tim's backups predate this change and CSV export is the
  only backup strategy the app has. An old file's `__SPLITS__` row maps through the same
  label-to-routine resolution as the migration.
- Round-tripping is a Phase 5 verification gate, not an afterthought.

---

## 6. Behavior spec

### 6.1 Split Day (simple) execution screen

Shows the day's split name, then that split's activities ranked by real logged-set count,
descending — reusing the existing ranking, not a new one. No checkboxes: there is no defined
list to complete. Tapping an activity opens the normal logging flow.

This is the "walked into the gym knowing it's leg day" path.

### 6.2 Routine (detailed) execution screen

Shows the day's routine name and its activities as a checklist.

- **Checked** = at least one set logged for that activity on the displayed date (D4).
- A progress readout ("2 of 4") is fine as information. It is not a score.
- Each item has a control that opens **directly into the logging flow for that activity**, so the
  user can complete the whole session without leaving the routine screen. Sets logged here are
  ordinary sets — indistinguishable in the data from sets logged on the main screen, and visible
  there immediately (Tim: *"they could also later view it in the daily screen as well, but they
  don't need to"*).
- **Deviation is free.** Extra activities logged outside the routine appear normally in the day
  view and simply are not part of the checklist. Nothing is flagged, nothing is "off-plan."
- Order per D6.

**Known UX risk:** logging from the routine screen means routine screen → activity card → weight
sheet → reps sheet. The app already stacks `PickerSheet` at z-index 200 over pickers. Adding
another layer beneath that stack is the single most likely place this feature feels wrong on a
phone. Prototype this interaction *early* in Phase 3 and put it in front of Tim before polishing
anything else.

### 6.3 What the routine screen must never do

- Write anything on load.
- Show a past day as incomplete, red, missed, or broken.
- Compute streaks, adherence percentages, or compliance scores.
- Prevent, discourage, or warn about logging something not in the routine.

---

## 7. Open questions — resolve with Tim, do not guess

1. **Navigation and layout (§4 D10).** Provisional top-level tab. Tim has flagged that the whole
   app's information architecture may need reimagining. Confirm the provisional placement at
   Check-in #3 and keep the screens route-agnostic so a later overhaul is cheap.
2. **What does "nag" actually do?** D8 settles that it is opt-in and off by default; it does not
   settle the mechanic. Candidates, roughly in order of restraint: a count badge on the tab; the
   routine name carrying an unfinished marker; unchecked rows gaining emphasis; an end-of-day
   summary. Propose one at Check-in #4 with Tim on a phone, rather than building a menu of them.
3. **Simple mode's ranking source.** Most-used-first within a split — is that lifetime logged-set
   count, or recency-weighted? Lifetime is what the picker does today; matching it is the
   conservative choice.
4. **Duplicate routine names.** Warn or block? Spec assumes warn.
5. **Does the routine library need archiving**, or is delete sufficient? Spec assumes delete,
   with a confirmation, and days pointing at a deleted routine falling back to no routine.
6. **Is `mode: "rest"` right?** §3.4 infers a third mode from today's commit rather than from a
   decision Tim made. The alternative is a routine named "Rest" with an empty activity list, which
   is simpler but loses the Rest/None distinction the current UI just gained. Confirm at
   Check-in #1.
7. **Tour.** Step 3 anchors to `split-label`. Does the tour gain a routine step, or just get
   repaired? Cheapest correct answer is repair now, new step later.

---

## 8. Explicit non-goals

Building any of these is scope creep and should be refused:

- Target sets, reps, weights, RPE, or any progression logic (D7, and §1's amended principle).
- Streaks, adherence percentages, compliance scoring, or any "you missed it" mechanic.
- Push notifications or reminders of any kind.
- **An app-wide navigation or layout overhaul.** Tim's concern about the piecemeal IA is
  legitimate and deserves its own scoped piece of work — the right home for it is a UX playbook
  triangulation via `~/Documents/SKILLs/ux-playbook/TRIANGULATE.md`, not this build. Gating a
  small routine feature behind an app-wide redesign is how a weekend of work becomes three months
  and ships never.
- Rebuilding, reformatting, or splitting up `index.html`.
- Cloud sync, accounts, or sharing.

---

## 9. Verification method (there is no test suite)

This repo has no test runner. "Internal verification" therefore means these five things, and a
phase is not complete until its named gates pass.

1. **Syntax check.** Extract the script content and run it through `node --check`. A parse error
   in an 805KB single-file app is a white screen with no console, so this gate is not optional.
2. **Headless browser runtime check.** Drive the app with the Browser pane tools. **Headless
   only — never launch a visible browser window.** Read the page as text (`read_page`) and check
   `read_console_messages` for errors on every flow touched.
3. **Fixture data.** `seed-data.csv` (the demo dataset) and the `my real data/` folder. Migration
   must be exercised against a *copy* of real data, never the live database.
4. **Before/after counts.** Any migration reports row counts per store, before and after, with
   expected deltas stated in advance. A count that does not match is a stop-the-line event.
5. **CSV round trip.** Export, wipe a scratch profile, import, and diff. Plus: import at least one
   pre-change CSV to prove backward compatibility.

Viewport for all visual checks: 390px wide (the existing convention in `STATUS.md`). Physical
phone verification is Tim's, not the agent's, and is required before anything is called done.

---

## 10. Phased plan with mandatory check-ins

**Rules for the session executing this:**
- Phases are sequential. Do not start a phase before its predecessor's gates pass.
- At every **CHECK-IN**, stop, report what was built and what was verified, and wait for Tim.
  Do not proceed on an assumed yes.
- Report failures with the actual output. A skipped gate must be named as skipped.
- Do not deploy to production, push to `main`, or create any scheduled task without Tim's
  explicit go-ahead in that moment.

### Phase 0 — Groundwork, no code
- Read everything in §2.
- Confirm the exact `INTENT.md` amendment sentence with Tim (§1).
- Write the dated decision entry into `STATUS.md` per the workspace What/Why/How-to-apply format.
- Restate the §7 open questions and get answers to any that block Phase 1.
- **Gate:** none (no code).
- **→ CHECK-IN #1: INTENT wording approved, open questions answered.**

### Phase 1 — Data layer only, no UI
- DB version bump; create `routines`, `week`, `dayRoutines` via `idbRun`.
- Write the migration (§5.4).
- Remove the bake-on-read write (§3.3) so past days stop being mutated.
- **Gates:** `node --check` passes. Migration run twice against a copy of real data with matching
  before/after counts both times. Zero `sets` records and zero real `dayNotes` records altered.
  Every `__split_` record either migrated or explicitly accounted for. All three weekday states
  survive the round trip — assert that a None day, a split day, and a Rest day each land correctly.
- **→ CHECK-IN #2 (mandatory — this phase touches Tim's real training history). Report the
  count tables. Do not build UI before Tim sees them.**

### Phase 2 — Routine builder (the edit side)
- Library screen: list, create, rename, delete routines.
- Mode selection with the D2 vocabulary; split picker for simple, activity picker for detailed.
- Assign routines to weekdays; two days may share one.
- Drag to reorder, writing `manualOrder` only on first drag.
- **Load the `tims-ux-playbook` skill before any visual decision in this phase.**
- **Gates:** `node --check`. Headless create/edit/delete/assign, each surviving a reload. Console
  clean. Deleted-routine and dead-split fallbacks render without crashing. 390px layout check.
- **→ CHECK-IN #3: design review, plus confirm the provisional navigation placement (D10).**

### Phase 3 — Routine execution (the day side)
- Simple-mode screen (§6.1) and detailed-mode checklist (§6.2).
- Derived check-off (D4). Log-a-set from the routine screen.
- **Build the log-from-routine interaction first and show Tim before polishing** (§6.2 risk).
- **Gates:** `node --check`. A set logged from the routine screen appears identically in the
  normal day view. Deviation case renders correctly. Opening a past day performs zero writes —
  verify by instrumenting or by comparing a full store dump before and after. Console clean.
- **→ CHECK-IN #4: Tim uses it on a physical phone. Nothing ships before this.**

### Phase 4 — Opt-in emphasis
- The D8 setting, defaulting off, using whatever mechanic Check-in #4 settled.
- **Gates:** off by default on a fresh profile; on-state visible; no effect on past days.
- **→ CHECK-IN #5 (light).**

### Phase 5 — Peripheral repair
- CSV export format plus backward-compatible import (§5.5).
- Repair tour step 3's anchor (`TOUR-SPEC.md`).
- Confirm demo mode still behaves (note §3.4 separately — the seed horizon is a different job).
- **Gates:** full CSV round trip. At least one pre-change CSV imports cleanly. Tour replays on
  both an empty and a populated log without pointing at nothing.
- **→ CHECK-IN #6: deploy decision is Tim's, explicitly, in the moment.**

### Closing obligations
- `STATUS.md` decision entries for every settled tradeoff, written as part of the work rather
  than when asked.
- Update `data-model.md`, which is already partly stale and will be more so.
- If this work adopts or wires any new tool, update `Shadowboard/BOARD.md` in the same change.

---

## 11. Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| Migration damages real training history | **Highest** | Phase 1 gates; run on a copy; counted before/after; Check-in #2 before any UI |
| Modal depth makes log-from-routine feel wrong on a phone | High | Prototype that interaction first in Phase 3; Tim on hardware at Check-in #4 |
| Old CSV backups stop importing | High | Backward-compatible import is a Phase 5 gate, not optional |
| Scope creeps into targets, streaks, or an IA overhaul | High | §8 non-goals; the amended INTENT principle makes D7 a rule |
| Silent parse error white-screens the app | Medium | `node --check` gate on every phase |
| Dead split or deleted routine crashes a render | Medium | Validate `splitName` and `routineId` on read; fall back to unassigned |
| A second source of truth for completion | Medium | D4 forbids a stored `checked` field anywhere |
| Migration flattens "Rest" into "None" or into a fake split | High | §5.4 step 2 handles three states explicitly; Phase 1 gate asserts all three |
| `dayNotes` junk drawer grows instead of shrinking | Low | §5.4 evacuates it; nothing new goes in |

---

## 12. Provenance

Every decision in §4 comes from the 2026-09-30 conversation with Tim, in which he: chose the
shared-library model, chose most-used-first-with-drag ordering, chose the "Split Day / Routine
with (simple / detailed) underneath" naming, authorized the purview change, specified that
logging should be possible from inside the routine screen, asked that nagging be opt-in and off
by default, and declined to settle navigation on the grounds that the app's whole layout may need
reimagining.

Findings in §3 come from reading `index.html` at `6532d02` and `data-model.md` on 2026-09-30. §3.4
was found on a re-verification pass after the file changed mid-conversation, and is the one item
here that Tim has not yet weighed in on — the third mode is this spec's inference from today's
commit, not a decision he made. Raise it at Check-in #1.
