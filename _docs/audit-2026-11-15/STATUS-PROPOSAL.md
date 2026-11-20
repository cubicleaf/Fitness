# STATUS.md — proposed correction

**This is a proposal, not the live file.** `STATUS.md` has not been touched. Written 2026-11-15 by the reconciliation audit; evidence for every line is in [REPORT.md](./REPORT.md).

It has two parts:

1. **The proposed top of STATUS.md** — what the file should say today.
2. **What to do with the rest** — which existing entries are superseded, and a suggestion for the 220 KB of history.

Nothing here adds work to Front Burner on its own. Audit findings sit in their own section for Tim to accept or drop, as the 2026-10-06 decision requires.

---

## Part 1 — Proposed top of STATUS.md

```markdown
---
attention: Active
state: Live
form: Website
updated: 2026-11-15
live_url: https://fit-logs.vercel.app
---

**Last updated:** 2026-11-15

## Where it stands

- **Live = `main` = this Mac.** Production serves commit `e05ac98` (2026-10-30), byte for byte.
  There is no local-only work and nothing waiting to deploy.
- **Pushing to `main` deploys.** Vercel publishes every push within a minute or two. A note that
  says "not deployed" is only true until the push.
- **Everything through round 5 (2026-10-27) and the demo families (2026-10-30) is shipped:**
  routines and Split assignments, per-set equipment, timers with the minutes dial and
  Stopwatch/Countdown tiles, distance ruler, search suggestions, typed deletion, gold logged rows,
  half-height family cards.
- **Tim's phone may still hold routines and weekday assignments he never chose**, made between
  2026-10-02 and 2026-10-27. The 10-27 fix stopped new ones; it did not remove old ones.
- **The demo data ran out on 2026-11-09.** The sample log still loads but shows nothing newer.

## Front Burner

- **"IDFK" button**: suggests a workout from your history. Background: "IDFK workout helper".
- **Opt-in cadence reminders.** Background: "Opt-in cadence reminders".
- **Bundled activities** (supersets/circuits). Settle the design with Tim before building.
  Background: "Paired / bundled activities".
- **Smart per-set weight buttons** (iterative design). The 10-preset row shipped 10-27; the
  "smart" part is not designed.
- **Smarter activity search** (synonyms). Background: "Retrieval follow-ups from the 09-07 pass".
- **Auto-sort new activities into splits.** The helper and name guess are live; independent
  accuracy check never done. Background: "Activity-to-split classification".
- **Code tune-up and leftover fixes.** One item for Tim; Claude owns the list in Background.

## Back Burner

- Settle the name. · Onboarding tips, Part B. · Warm-up helper. · Exercise-database / API
  research. · Color overhaul (parked).

## Proposed by the 2026-11-15 audit — Tim to accept or drop

Not open work until Tim says so. Details: `_docs/audit-2026-11-15/REPORT.md`.

1. Bodyweight is copied into each new day when the app opens (report D-2).
2. Old auto-made routines and weekday assignments are still on the phone (D-6).
3. Backups contain stray `confirmed_` bodyweight rows, and importing them clears confirmations (D-3).
4. The CSV backup leaves out grip, pair links, family records and several preferences (§3.3).
5. Log Coach sends the day's workout to Groq; INTENT says no workout data leaves the device (V-1).
6. The Groq key and coach chat live in localStorage, outside INTENT's storage rule (V-2).
7. History / Notes / Edit on an open activity card are 29px tall, under the 44px rule (§3.6).
8. Importing a backup stamps today with the backup's old bodyweight and can reset the unit (S-5, S-6).
9. The demo seed needs extending past 2026-11-09.
10. Three specs disagree with the app: ROUTINE-SYSTEM-SPEC §5.4/§5.5, FAMILY spec picker contract,
    TOUR-SPEC §4 (§2 of the report).
11. Leftovers: `#tour` test trigger, unused merge-search modal, eight dead functions, the legacy
    `templates` store and `__split_` notes still being written (§5).
12. The app shows four names: Fitness Tracker, FITNESS, Fit Logs, Tim's Logbook.
```

**Two Front Burner lines are deliberately gone** from the draft above:

- "Review the 2026-10-07 FITNESS picker/header refresh on a physical iPhone before deployment."
- "Review the complete local routine first version on a physical phone … deployment still requires Tim's decision."

Both shipped on 2026-10-07 (`f471b97`). The "before deployment" gate no longer exists. If Tim still wants a phone review of either, it should be reworded as a review of something live.

---

## Part 2 — What to do with the existing entries

### Entries whose status line is wrong today

Each of these says some form of "local / uncommitted / not deployed". All are live.

| Entry (date and title in STATUS.md) | Actually shipped in |
|---|---|
| 10-30 decision: demo seeds three families — "Not yet committed or pushed" | `e05ac98`, 10-30 |
| 10-27: no more automatic weekday splits or routines — "Not deployed" | `c0b75a4`, 10-27 |
| 10-27: minutes dial back, darker (i), one-line meta — "Not committed or deployed" | `fc5e45a`, 10-27 |
| 10-12: demo seed extended — "Not deployed" | `382bebf`, 10-14 |
| 10-08: scale and supplied info correction | `382bebf`, 10-14 |
| 10-08: per-activity context correction | `382bebf`, 10-14 |
| 10-08: daily context pivot (already marked superseded) | superseded before shipping |
| 10-08: daily split last-workout cleanup (already marked rejected) | rejected before shipping |
| 10-07: daily icon controls; daily split view cleanup; compact rep picker; daily split editor link; typed deletion safeguard; new-activity blank-screen fix | `382bebf`, 10-14 |
| 10-07: routine first version; Clarity Squircle; Clarity Ring trial; picker and header refresh; Clarity Ring asset; per-set equipment; timer refinement; morning timer implementation | `f471b97`, 10-07 |
| 10-02: routine Phase 1 and Phase 2 (partial) — no deploy mentioned | `5800a96`, in production 10-02 15:29 UTC |
| 07-31: grip relevance + duplicate matcher — "Not yet committed or deployed" | `7a78d4d` |
| 07-16: "Local file is now AHEAD of production — needs deploy" | long since shipped |

### Background sections that no longer describe the app

| Section | Problem |
|---|---|
| IndexedDB migration path | Says a version 4 and a real migration are still needed. Both exist since 10-02. |
| Related Activities and retrieval reliability | Says a selected split is a hard boundary for search. The app searches the whole library, as the 09-25 decision says. |
| Demo follow-ups | "Refresh horizon: 2026-11-09" is in the past. |
| Deliberately not changed on 08-14 | "12,900-line app" is now 18,961 lines. The dead-code list is still accurate. |
| Set-screen follow-ups | The timer screen has been rebuilt twice since this was written; only the inline `GripField` note still holds. |
| Naming / brand cleanup | Does not mention that the header became "FITNESS" on 10-07. |
| "Where I left off", paragraph beginning "The 2026-09-03 pass…" | Calls a real device session "several passes overdue and the blocking item". The Background intro says Tim tests on his phone constantly. |

### Decisions that should carry a "superseded" note and do not

| Decision | Superseded by |
|---|---|
| 10-07 "Keep quick duration logging separate from live timing" — names a secondary **Time this activity** action | 10-27 round 5: Stopwatch and Countdown tiles replace that door |
| 10-07 "Copy the last session…" — "All split filters are directly visible" | 10-14 "one scrolling split row" (the 10-14 entry says so; the 10-07 entry does not) |
| 10-07 "Keep family selection full-row…" — full-row family button, variation-count text | 10-27 round 5: half-height family cards reading "N variants" |
| 10-02 routine decisions — migration maps template labels to weekday routines | 10-27 "The app never assigns splits or makes routines on its own" |
| 09-21 / 09-22 picker entries — split is a hard boundary for search | 09-25 decision |

### A new decision worth recording (wording for Tim to approve)

```markdown
### 2026-11-15 — "Not deployed" is never left standing in STATUS

**What:** `main` auto-deploys. An entry may say "not deployed" only while the work is uncommitted.
The chat that pushes it rewrites that line to the commit hash in the same change.

**Why:** The 2026-11-15 audit found more than twenty entries still saying "local" or "not deployed"
for work that had been live for weeks, including two Front Burner items gated on a deploy that had
already happened.

**How to apply:** Before any push, search STATUS for "not deployed", "uncommitted" and "not
committed" and correct each line the push makes untrue.
```

### Suggestion for the history (Tim's call)

`STATUS.md` is 221 KB. About 200 lines of "Where I left off" are a build diary going back to July, and the Activity log repeats much of it. The workspace rule is that STATUS holds current state, decisions and open work.

One option: keep the Part 1 block, `## Decisions`, `## Front Burner`, `## Back Burner` and `## Background`; move the dated "Where I left off" paragraphs and `## Activity log` to `_docs/STATUS-HISTORY-through-2026-10.md` with an Archived banner. Nothing is deleted, and the file a new chat reads first drops to a size it can actually read.

I have not done this. It changes how every future session finds the history, so it needs Tim's yes.
