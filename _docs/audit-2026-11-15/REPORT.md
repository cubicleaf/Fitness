# Fitness — Reconciliation + Drift Audit

**Run date:** 2026-11-15 · **Repo:** `~/Documents/Fitness-git` · **Audited commit:** `e05ac98` (main)
**Report only.** Nothing in the project was edited, committed, pushed or deployed. The only new files are this report and `STATUS-PROPOSAL.md`, both uncommitted.

## How to read this

- Every claim cites a file and line (`index.html:4651`), a commit hash, or a hash comparison.
- Line numbers are for `index.html` at `e05ac98`.
- **Unverified** means I could not prove it from the repo, GitHub or the live site.
- What I covered and what I did not is in the last section.

---

## 0. Starting state

| Item | Finding | Evidence |
|---|---|---|
| Copies of the repo | One clone: `~/Documents/Fitness-git`. No second clone found. | `find` for `.git` under `~/Documents` |
| Branch | `main`, level with `origin/main` | both at `e05ac98` after `git fetch` |
| Uncommitted changes | None | `git status --short` empty |
| Unpushed commits on main | None | `main...origin/main` shows no ahead/behind |
| Stale local branches | Six. Two hold one unmerged commit each (`agent/search-merge-flow` `d4711fe`, `fix-babel-crash` `b699f7f`); both only add 3 lines to `.gitignore` | `git log origin/main..<branch>` |
| Stash | One, from 2026-09-27: "Preserve pre-cleanup Fitness-git worktree edits". Touches `index.html` (195+/373−) and `STATUS.md`. Never applied or dropped. | `git stash list`, `git stash show --stat` |
| History | `main` was rewritten around 2026-09-21; older deployment hashes are gone (§4c, B-13) | GitHub deployment list vs `git cat-file` |
| Other seed copies | `webdev/_docs/sample-data/seed-data.csv` and `_archive/seed-data.csv.bak` exist outside the tracked file. Not compared. | `mdfind` |
| Ignored local folders | `my real data/` (3 real exports), `old images/`, `old screenshots/`, `past versions of html/`, `_archive/`, `learning htmls/` | `.gitignore` |

The tree is clean, which is itself useful: there is no hidden local work. What is on GitHub is what is on the Mac.

---

## 1. Production parity

**Verdict: production is exactly commit `e05ac98` (2026-10-30). All three layers match byte for byte.**

| File | Live SHA-256 (first 12) | Local working tree | `HEAD` blob |
|---|---|---|---|
| `index.html` (938,608 bytes) | `193ddde66772` | same | same |
| `sw.js` (2,500 bytes) | `6276e0b3b38e` | same | same |
| `seed-data.csv` (249,685 bytes) | `1960e76cee44` | same | same |
| `site.webmanifest` | `b12fb338122d` | same | n/a |

- Fetched from `https://fit-logs.vercel.app` on 2026-11-15. The second address STATUS mentions, `timslogbook.vercel.app`, serves the same `index.html` hash.
- GitHub's deployment record agrees: the newest Production deployment is `e05ac98` at 2026-10-30 14:10 UTC.
- `/api/feedback.js` answers `405` to a GET, which is what the code does for anything but POST (`api/feedback.js:9-12`). Whether its environment variables are set is **unverified** (I did not send a test message).

**What STATUS gets wrong about this:** the 10-30 decision entry ends "Not yet committed or pushed" (`STATUS.md:220`). It was committed, pushed and deployed that day.

---

## 2. Feature matrix

Columns: **Spec** = written in a spec or INTENT · **Code** = present in `index.html` · **Live** = same as Code, because production equals HEAD · **STATUS says** = what the log claims.

### 2a. Core logging

| Feature | Spec | Code | Live | STATUS says | Mismatch |
|---|---|---|---|---|---|
| Two-tap set logging (weight, reps) | INTENT | Yes | Yes | Yes | None |
| "Last time" in pickers | INTENT | Yes (`LAST` strip, rep session strip) | Yes | Yes | None |
| Auto-save, resume mid-workout | INTENT | Yes | Yes | Yes | None |
| Timed activities: quick-log presets, 60-min dial, Stopwatch and Countdown tiles | STATUS only | Yes (`renderDial`, tiles) | Yes | 10-27 dial entry says "Not committed or deployed" | **Stale.** `fc5e45a` deployed 2026-10-27 21:53 UTC |
| Distance drag ruler | STATUS + `_docs` | Yes (`DistanceDrag`) | Yes | Shipped `46b609c` | None |
| Per-set equipment (fixed / bar + plates / per hand) | STATUS decision 10-07 | Yes (`WeightEquipmentMenu`) | Yes | "Uncommitted and not deployed" | **Stale.** Live since `f471b97`, 10-07 |
| Pair time (one duration, two activities) | STATUS decision 10-07 | Yes (`pairedWith`) | Yes | Yes | Not in the CSV backup (see §3.3) |
| Grip tracking per set | `_docs/activity-model-history` | Yes | Yes | Yes | Not in the CSV backup (see §3.3) |
| Presence-only "Did some" | STATUS only | Yes | Yes | Yes | No spec |
| Neutral (note-only) activities | STATUS only | Yes | Yes | Yes | No spec. Uses a hidden placeholder set record (`index.html:16230`) |
| Mood dial, session notes, form cues | STATUS only | Yes | Yes | Yes | No spec |
| Bodyweight per date | STATUS only | Yes | Yes | Yes | Writes a record every day unasked (§4, D-2) |

### 2b. Organising: splits, families, routines

| Feature | Spec | Code | Live | STATUS says | Mismatch |
|---|---|---|---|---|---|
| Related Activities (families) | FAMILY spec | Yes (`RelatedActivitiesModal`, `writeRelatedActivities`) | Yes | Yes | None |
| Picker wording "variation", never "variant" | FAMILY spec, picker contract | **No.** Cards and sheet say "variant(s)" (`index.html:6460`, `6715`) | Live | 10-27 round 5: "N variants" | **Spec contradicted** by `9946700`; spec not updated |
| Non-All split is a hard boundary for search | FAMILY spec; STATUS Background | **No.** Search covers the whole library (`index.html:6191-6196`) | Live | 09-25 decision says search is independent of the split | **Spec and STATUS Background are stale.** The code's own comment two lines above (`6186-6187`) also says "hard boundary" |
| Search opens over the toolbar; standalone cards in a two-column grid | FAMILY spec | Partly; 10-14 added a suggestions panel and a scrolling split row | Live | Yes (10-14 entries) | Spec last edited 10-07; predates the 10-14 changes |
| Search suggestions (recent four, matched four) | `_docs` proposal | Yes (`ActivitySearchSuggestions`) | Yes | Shipped `db1b56a` | None |
| Split helper: "Recommend split", name-based guess | `_docs/split-classifier` | Yes (`ActivitySplitHelper`, `guessByName`) | Yes | Yes | Accuracy never independently measured (STATUS says so) |
| Routines: library, rename, detailed mode, drag order, rest mode | ROUTINE spec Phase 2 | Yes | Yes | Front Burner: "Review … before deployment"; "deployment still requires Tim's decision" | **Stale.** Live since 10-07 (`f471b97`). Data layer live since 10-02 (`5800a96`) |
| Routine session screen, derived check-off | ROUTINE spec Phase 3 | Yes | Yes | Same as above | Spec gate "Nothing ships before Tim uses it on a phone" was not met |
| Opt-in unfinished emphasis | ROUTINE spec Phase 4 | Yes (`routineEmphasis` pref) | Yes | Yes | None |
| Routine CSV backup and old-CSV import | ROUTINE spec Phase 5 | Yes | Yes | Yes | Spec §5.5 still tells import to map `__SPLITS__` to weekday routines. Code stopped doing that on 10-27 |
| Tour step 3 anchor repair | ROUTINE spec Phase 5 | **Unverified** | — | Not mentioned | Unverified |
| Migration turns old weekday labels into routines and assignments | ROUTINE spec §5.4 step 2 | **Removed** 10-27 (`c0b75a4`) | — | Decision 10-27 forbids it | **Spec still instructs the forbidden behaviour** |
| "Split Day / simple", "Routine / detailed" wording | ROUTINE spec D2 | Yes (`index.html:11680`, `11870`) | Yes | Yes | None |
| Split assignments tab; Routines tab empty until Tim makes one | STATUS decision 10-27 | Yes | Yes | "Not deployed; Tim's phone test remains" | **Stale.** `c0b75a4` deployed 2026-10-27 20:06 UTC |

### 2c. Demo, tour, helpers, server

| Feature | Spec | Code | Live | STATUS says | Mismatch |
|---|---|---|---|---|---|
| Demo mode in a separate database | TOUR spec §3 box | Yes (`FitnessTrackerDemo`) | Yes, confirmed in the browser | Yes | None |
| Demo data through 2026-11-09 | STATUS | Yes; last seed date is 2026-11-09 | Yes | "Refresh horizon: 2026-11-09" | **Expired six days ago.** The demo now opens on a week-old last session and adds nothing new |
| Demo seeds three families | STATUS decision 10-30 | Yes (`seedDemoFamilies`, `index.html:11535`) | Yes | "Not yet committed or pushed" | **Stale** |
| Welcome tour, Part A (7 steps) | TOUR spec | Yes | Yes | Yes | TOUR spec §4 still lists 6 steps and "auto-plays"; only §3 carries a superseded box |
| Coachmarks, Part B | TOUR spec §5 | **No** (`wp_coach_` appears nowhere) | No | Back Burner | Spec'd, never built. Correctly recorded |
| `#tour` URL preview trigger | Marked TEMPORARY in code, June | **Still there** (`index.html:18868-18870`) | Live | Not mentioned | **Remnant** (§5) |
| Log Coach (Groq chat, bring your own key) | `_docs/LLM-COACH-AND-GROQ-EXPLORATION.md` | Yes (`AIChatModal`, `index.html:13869`) | Yes | Yes | **Conflicts with INTENT** (§3.3) |
| Feedback form + `api/feedback.js` | INTENT amendment | Yes | Yes | Yes | None today. Shipped before INTENT allowed it (§4, B-2) |
| Month calendar | STATUS | Yes (`CalendarMonthModal`) | Yes | Yes | None |
| IDFK button, cadence reminders, bundled activities, warm-up helper | STATUS Front/Back Burner | **No** (no matching code) | No | Open | Correctly open |
| Smart per-set weight buttons | STATUS Front Burner | Partly: 10 presets before "More" | Yes | Open | Correctly open |

### 2d. Mismatch summary

- **Spec'd but never built:** Part B coachmarks. Tour step 3 repair is unverified.
- **Built but never spec'd** (STATUS entries only): timers and sounds, per-set equipment, distance ruler, presence-only logging, neutral activities, mood dial, bodyweight per date, month calendar, search suggestions, typed deletion safeguard, Clarity Ring and Squircle controls.
- **Built but not live:** nothing. Production equals HEAD.
- **STATUS claims that are stale or contradicted:** see §6.

---

## 3. Rules compliance (INTENT.md)

### 3.1 Single file, plus the sanctioned exceptions — mostly holds

- Runtime files: `index.html`, `sw.js`, `api/feedback.js`, `site.webmanifest`, six icon files, and **`seed-data.csv`**, which the demo fetches at run time (`index.html:3970`, `11491`).
- `seed-data.csv` is a runtime file that INTENT's constraint list does not name. INTENT mentions "demo seed data" only in passing (`INTENT.md:9`). Low stakes, but it is an unlisted exception.
- `assets/*.svg` are reference copies. Nothing loads them at run time (the only mention is a comment at `index.html:3828`).
- No build step. One consequence worth knowing: since `b3ba2f4` (2026-06-24) `index.html` is Babel **output** (`React.createElement` calls) edited by hand. No JSX source exists anywhere in the repo.

### 3.2 No external runtime dependencies — holds for loading, with one outbound call

- No `<script src>`, `<link href>`, `@import` or `url()` points off-site. React 18.3.1 is inline (`index.html:3061-3331`).
- External URLs in the file are inert text: 42 `github.com` links are source citations inside the inline split catalog; the rest are SVG namespaces and reference links.
- The three network calls: `/api/feedback` (`10972`), `./seed-data.csv` (`11491`), and **`https://api.groq.com/...`** (`13869`). The Groq call is a runtime dependency on an outside service for the Log Coach feature.

### 3.3 IndexedDB only; no workout data leaves the device — **two violations**

**V-1. Log Coach sends workout data to Groq.** Each message posts the viewed date, the day's split label, the list of splits, and every activity on that day with its latest set, weight and reps (`index.html:13826-13839`, sent at `13883`). INTENT says "no user workout data ever leaves the device" (`INTENT.md:45`). It only happens when Tim has saved a key and sends a message, and STATUS records the feature, but INTENT was never amended for it the way it was for feedback.

**V-2. localStorage holds real data.** INTENT says "IndexedDB for all persistence" (`INTENT.md:41`).

| Key (by constant name) | Holds | Where |
|---|---|---|
| `GROQ_API_KEY_STORAGE` | the Groq API key, in plain text | `index.html:5126-5133` |
| `FITLOGS_CHAT_STORAGE` | the last 24 coach messages, which contain workout details | `5158-5172` |
| `GROQ_MODEL_STORAGE` | model choice | `5145-5153` |
| `wp_demo_active`, `wp_demo_offered`, `wp_tour_seen` | demo and tour flags | `3981-3993`, `18066` |

The demo flags are justified in TOUR-SPEC §3. The Groq key and chat history are not covered anywhere in INTENT. None of these are in the CSV backup.

**Related: the CSV backup is not complete.** INTENT says "CSV export is the backup strategy". The export (`index.html:12011-12110`) does not write:

- per-set **grip** (`gripType`, `gripWidth` — no column in the row at `12093`)
- **pair links** between sets (`pairedWith`)
- the **`movementFamilies` store** (activities carry their family id and name, but the family records are not exported)
- duration presets, quick-note frequency, the saved split choices and other preferences
- the Groq key and chat (arguably correct)

Whether a restore rebuilds any of these another way is **unverified**; I did not run a round trip.

### 3.4 Exactly one server endpoint — holds

- `api/` contains only `feedback.js`. No `vercel.json`, no other functions.
- It forwards only what the person typed, the page, the app date and an optional screenshot (`api/feedback.js:39-58`). No workout data.
- Known and already in STATUS: no rate limit, public, up to ~5.6 MB per request.

### 3.5 Auto-save always — holds for logging

- Set logging has no save step. Notes debounce-save and force a save on close.
- "Save" buttons exist in six edit dialogs (`EditCategoriesModal` `5871`, `SessionNoteModal` `10622`, `ChangeCategoryModal` `12910`, `NoteEntryModal` `14090`, `ChangeWeightMeaningModal` `15244`, and one at `17142`). These are edit confirmations, not the logging path. Noted, not a violation of the principle as written.

### 3.6 44px touch targets — one miss found in the main flow

Checked on the live site at 375×812 in an isolated browser with the demo data only.

| Screen | Result |
|---|---|
| Main day screen (collapsed) | No control under 44px |
| Expanded activity card | **History, Notes and Edit are 105×29px** (`index.html:17811-17847`) |
| Weight picker | No control under 44px |
| Rep picker | 33 buttons, smallest height 44px |

The mood slider's track measures 3px high; I did not measure its thumb, so that one is **unverified**. Other screens (Settings, routines, timers, calendar) were not measured.

---

## 4. Drift register

Severity: `cosmetic` / `behavioral` / `data-affecting`.

### 4a. Data-affecting

| ID | Commit | Date | What it said | What it actually did | Severity | Evidence |
|---|---|---|---|---|---|---|
| D-1 | `d3fc647` | 07-25 | "Add movement families and grip tracking" | Added a boot-time migration that **created family records and linked every existing activity to a family guessed from words in its name**, on every app open. Also moved the database from version 2 to 3. Removed 09-21 in `ad825ca`. Links made in those two months stayed in the data. | data-affecting | `git show d3fc647:index.html`, `migrateActivityModel` calls `inferMovementFamilyName` then `dbOps.families.add`; removal in `ad825ca` (GONE: `inferMovementFamilyName`); STATUS 09-21 and 09-23 confirm leftover links |
| D-2 | `161a038` | 07-25 | "Rebuild bodyweight reminder and entry flow" | Added `migrateLegacyBodyweightIfNeeded`, which runs on **every app open**: if today has no bodyweight, it copies the last weight Tim entered into today's dated record. **Still live.** Saving a weight today rewrites the legacy key, so the loop never ends. The copy is hidden only while it is "today"; from the next day on it counts as real history and is exported. | data-affecting | `index.html:4651-4658` (copy), `16127` (called at boot), `4618-4620` (legacy key rewritten), `4630` (past dates accepted without confirmation), `12049-12051` (exported). Tim's 10-02 export has 56 dated bodyweight rows, 28 on dates with no workout rows (counts only; cause of each row unverified) |
| D-3 | `a87ac9b` | 08-09 | "Keep weight reminder tied to explicit daily entry" | Added `__bodyweight_confirmed_<date>` keys. The export loop treats them as bodyweight days, so backups contain rows like `__BODYWEIGHT_DAY__,confirmed_<date>,true`. On import each such row **deletes** that date's confirmation key. | data-affecting (small) | `index.html:12049-12051` (prefix match catches both key families), `4607-4614` (delete branch when the value is not a number). Tim's 10-02 export has 34 such rows |
| D-4 | `5800a96` | 10-02 | "Add the routine system: data layer, migration, and library screen" | Moved the database from version 3 to 4 and ran a boot migration that **created a routine for every split label and assigned weekdays from the old weekly template**. Went to Production the same day (2026-10-02 15:29 UTC). The spec asked for this behaviour (§5.4 step 2), but the spec's gates said nothing ships before a phone check-in, and STATUS never recorded a deploy. | data-affecting | `git show 5800a96:index.html` lines 3849-3858 (`routineId: resolveLabel(labelByDow.get(dow))`); GitHub deployment record; `ROUTINE-SYSTEM-SPEC.md` Phase 3 and Phase 5 check-ins |
| D-5 | `f471b97` | 10-07 | "Complete routines and refresh FITNESS logging interfaces" | Two more unasked writers: (1) CSV import wrote **weekday assignments from any file's `__SPLITS__` row**, including the demo seed; (2) choosing a split for one day silently **created a routine**. Also a 1,866+/1,867− rewrite with 99 other files in one commit, and it removed the old weekly-template editor. | data-affecting | `git show f471b97:index.html` line 11213 (`dbOps.week.set(i, await ensureSplitRoutine(...))`), 15687 (`setDaySplit`), 11466 (`ensureSplitRoutine`) |
| D-6 | `c0b75a4` | 10-27 | "Stop automatic weekday splits and routines; …" | Did what it said. **But it cleans nothing up.** The migration skips any database that already has seven week records (`index.html:4510-4513`), so routines and assignments made between 10-02 and 10-27 are still on Tim's phone. The app also still creates hidden `auto` routines when a day's split is picked or a CSV is imported (`11707-11716`, `11430`, `16047`); they are hidden from the list (`11779`) but exist in the database and in exports (`12031`). | data-affecting (residue) | lines cited; STATUS 10-27 itself says "His phone's database may still hold routines or assignments made before this fix" |
| D-7 | `3b60c1b` | 03-22 | "Update index.html" (no description) | 3,923 lines added in one commit. Among much else it **moved preferences from localStorage into IndexedDB and deleted the localStorage copies**. No stated purpose, so intent cannot be judged. | data-affecting (preferences, not workouts) | commit scan: `_prefCache._migrated`, `localStorage.removeItem`; today at `index.html:4867-4888` |
| D-8 | `adb2e7a` | 02-24 | "Update index.html" (no description) | Moved the database from version 1 to 2 (new `sessionNotes` store) and added the "nuclear reset" that clears every store. No stated purpose. | data-affecting (schema) | commit scan: `indexedDB.open('FitnessTracker', 2)`, `handleNuclearReset` |

### 4b. Sibling patterns in today's code (asked for specifically)

Code paths that create or change data without Tim choosing it, as of `e05ac98`:

| # | Path | What it writes | Evidence | Declared in STATUS? |
|---|---|---|---|---|
| S-1 | Boot: `migrateLegacyBodyweightIfNeeded` | A bodyweight record for today, copied from the last entry | `index.html:4651`, `16127` | No (this is D-2) |
| S-2 | Boot: `migrateActivityModel` | Rewrites any activity whose `measurementModes` is missing; adds "distance" when the **name** contains run, walk, bike, row, etc. | `5328-5338`, `4931-4937` | Partly (08-04 "dual cardio measurements") |
| S-3 | Boot effect runs **on every date change**, not once | Repeats S-1 and S-2 each time the day changes | comment at `16119-16120`; effect at `16122-16150` with dependencies `[currentDate, loadDayData]` | No |
| S-4 | Boot: `migrateRoutineSystem` | Seven empty week records, plus a hidden routine and a day record for every old per-day split | `4509-4541` | Yes (10-27) |
| S-5 | Import: `__BODYWEIGHT__` row | Stamps **today** with the backup's old bodyweight and marks it confirmed | `11403-11405`, `4616-4617` | No |
| S-6 | Import: unit | Sets the unit to the file's unit, or to `lbs` if the file has none, overriding the current preference | `11118`, `11400-11402` | No |
| S-7 | Import: `__DAYSPLIT__` rows | A hidden routine per split label and a day record per date | `11428-11431` | Yes (10-27) |
| S-8 | Picking a split for one day | A hidden routine; for past dates also a legacy `__split_` note | `16047` | Yes (10-27) |
| S-9 | Selecting a neutral activity | A hidden placeholder set so the activity can sit on a date | `16230-16250` | Yes (07-22) |
| S-10 | Viewing a day | Saves `lastViewedDate` | `16158` | Yes (07-22) |

S-1, S-3, S-5 and S-6 are the undeclared ones.

### 4c. Behavioral

| ID | Commit | Date | What it said | What it actually did | Severity | Evidence |
|---|---|---|---|---|---|---|
| B-1 | `fee377c` | 07-29 | "Add activity lineage flow and log coach" | Added a chat that sends the day's workout to `api.groq.com` and stores an API key and chat history in localStorage. Named in the message, but INTENT was never amended. | behavioral (rule conflict) | §3.3 V-1, V-2 |
| B-2 | `23c9429` | 08-09 | "Add feedback email intake" | Added the first server code and environment variables. The commit is dated 08-09 and GitHub shows seven Production deploys that day (under hashes that no longer exist, see B-13). INTENT's exception is dated 08-13 and was committed 09-07 (`484f26b`). The rule was broken first and amended after. | behavioral (rule conflict, since repaired) | `git log -- INTENT.md`; GitHub deployment list |
| B-3 | `45fe033` | 09-07 | "Fix activity retrieval, add the welcome tour, and repair the calendar" | 2,375+/1,095−. Also added the whole **demo mode** (second database, `deleteDatabase`, a rewritten CSV importer), bar-aware weight entry and three-state grip, and removed the week calendar. STATUS records these; the commit message does not. | behavioral | commit scan (NEW: `enterDemoMode`, `importWorkoutCSV`, `deleteDatabaseByName`; GONE: `CalendarWeekModal`) |
| B-4 | `fd7ded7` | 09-21 | "Validate the stored Groq model id, alongside in-flight set-picker work" | 389+/174−. The named fix is a few lines; the rest is squircle plates and set-picker work. | behavioral | commit scan (NEW: `fixedCornerSquirclePath`, `IconBagCheck`, `renderCoachContent`) |
| B-5 | `ad825ca` → `921f078` → `5254b2c` | 09-21 to 09-25 | "Tighten split activity selection", "Keep activity search inside the selected split", then "Improve activity search…" | Search was locked inside the selected split, then four days later opened to the whole library. The spec was then rewritten on 10-07 saying "hard boundary" again. Code today searches everything. Three sources, two answers. | behavioral | `index.html:6186-6196`; FAMILY spec picker contract; STATUS 09-25 decision vs STATUS Background "Related Activities and retrieval reliability" |
| B-6 | `706b9e2` → `5254b2c` | 09-25 | "Make set deletion discoverable", then "Improve activity search and refresh fitness controls" | Long-press delete was replaced by Delete buttons, then restored hours later under an unrelated title, which also removed "Copy last set". Recorded in the 09-25 decision. | behavioral | commit scan (GONE then NEW: `startSetDeleteLongPress`; GONE: `handleCopyLastSet`) |
| B-7 | `8f65903` | 06-24 | "Onboarding tour: phase 1 anchors + phase 2 spotlight engine; lb-native seed data" | Left a "TEMPORARY" trigger: opening the site with `#tour` in the address starts the tour and marks it seen. Still live five months later. | behavioral (minor) | `index.html:18868-18870` |
| B-8 | `9946700` | 10-27 | "Half-height family cards with variants, …" | Put the word "variants" on screen. The spec says the picker must never say variant. | behavioral (wording) | `index.html:6460`, `6715`; FAMILY spec |
| B-9 | `382bebf` | 10-14 | "Publish pending activity fixes and daily logging refinements" | One commit carrying about eight separate features (typed deletion, split editor, rep rail, info icons, demo extension, cache bump), 88 other files. STATUS lists them. | behavioral (bundling) | commit stat; STATUS 10-14 "publish local fixes" |
| B-10 | `ce11319` | 09-18 | "Ship offline split suggestions…" | STATUS says production was deployed that day from a staging folder. GitHub shows only a **Preview** on 09-18 and the next main Production deploy on 09-21. If the STATUS claim is right, production ran code that matched no `main` commit for three days. | behavioral | GitHub deployment list; STATUS 09-18. The 09-18 deploy itself is **unverified** |
| B-11 | `b3ba2f4` | 06-24 | "Remove unpinned Babel; ship precompiled build" | Replaced the whole file with compiler output (8,651+/5,940−). From here on there is no readable source to compare against, and this one diff cannot be reviewed line by line. | behavioral (structural) | commit stat |
| B-13 | history before 09-21 | — | — | **`main` was rewritten around 2026-09-21.** Ten of eleven deployment hashes I sampled from 08-09 to 09-18 (for example `765e703`, `2b490a2`, `bda385a`, `9666147`) do not exist in the repo, and eight deployments landed within 30 seconds at 13:59 UTC on 09-21. So for anything before 09-21, the commit hashes and dates in this register are the rewritten ones and cannot be tied to what production actually ran on a given day. No recorded decision explains the rewrite. | behavioral (history) | `git cat-file -t <hash>` fails for the sampled hashes; GitHub deployment list |
| B-12 | 17 commits | 02-24 to 03-22 | "Update index.html" / "Add files via upload" | No stated purpose on any of them, so "said vs did" cannot be judged. Two are listed above (D-7, D-8). | unverifiable | `git log` |

### 4d. Cosmetic / as stated

| Commit | Date | Note | Evidence |
|---|---|---|---|
| `ce11319` | 09-18 | Service-worker cache went v4 → v5 with no change to any cached supporting file. Harmless. | `git show ce11319 -- sw.js`; `seed-data.csv` untouched |
| `1e1a834` | 09-29 | "chore: push hygiene snapshot" touched `index.html`: two comment lines only. | diff |
| `2875585` | 09-07 | `seed-data.csv` was **rewritten**, not appended (4,034+/2,931−). Declared: STATUS 09-04 records the move to the 12-column format. | numstat |
| `382bebf` | 10-14 | `seed-data.csv` extension is a **pure append**: the first 224,225 bytes equal the previous version. Cache bump v6 matches it. | `cmp` of the prefix |
| `e05ac98` | 10-30 | Did exactly what it said. Demo database only. | `index.html:11535-11557` |
| `a3c08c8`, `38f7e25` | 08-06, 08-09 | Service-worker strategy changes with matching cache bumps. As stated. | diffs |

---

## 5. Dead-code sweep

Things STATUS calls rejected, superseded or removed, checked against `index.html`.

### Gone, as claimed

`CalendarWeekModal` · `inferMovementFamilyName` · Family Link / Family View / Create Variation / Activity Lineage modals · `gripPicker` · rep suggestions (`loadRepSuggestions`) · Copy last set (`handleCopyLastSet`, `IconCopy`) · "Find activities to merge" button · Bar math accordion · `DeleteScopeVisual` · per-set red delete overlay (`set-box-delete-inline`) · preset jiggle · `animateExercisePanel` · left-border accents (`border-left`: 0) · `IconGrip` · old weekly-template editor (`handleSaveTemplate`) · `ConfirmModal` / `modal-close` · "Same Wt" text · `bootstrapDefaultExercises`

### Still present

| Remnant | State | Evidence |
|---|---|---|
| `#tour` preview trigger | **Live and reachable** | `index.html:18868-18870` |
| `MergeActivitySearchModal` | Its picker button was removed 10-07, but the modal and one opener remain | `15342`, `17905`, `17967` |
| `GripPromptModal`, `IconChevronDown`, `isLikelyGripRelevant`, `MOOD_GRADIENT`, `handlePairWith`, `longPressRef`, `formatSetDisplay` | Defined, apparently unused. STATUS listed these as dead on 08-14 and chose to leave them. Still there three months on. | one definition each; `handlePairWith` at `16840` |
| `IconBagCheck` | Its use was superseded 09-23; definition remains | 1 occurrence |
| `activityRecommenderEnabled` | A constant that is now always `true`; the "disabled recommender" it guarded is back on | `7869`, `8063` |
| Legacy `templates` store | Nothing displays it any more, but import still writes it, rename and remove still edit it, and the migration still reads it | `11423`, `5709-5713`, `5741-5745`, `4514` |
| Legacy `__split_<date>` notes | Still written for past dates and on import, alongside the new `dayRoutines` records. Two sources of truth for the same fact. | `16047`, `11429`, `16038` |
| Legacy `__bodyweight__` key | Still written; it is what feeds D-2 | `4620` |
| `ReactDOM.render` (legacy mode) | Deliberately kept, per STATUS 08-14 | 2 occurrences |
| "Time this activity" | STATUS says the door was replaced by tiles. The phrase survives as the heading of the timing screen, which matches "nothing else was removed". Not a defect. | `10194` |
| Four product names in one app | Page title "Fitness Tracker" (`index.html:10`), header "FITNESS", feedback copy "Fit Logs" (`10988`, `11016`), manifest and coach prompt "Tim's Logbook" (`site.webmanifest`, `5195`) | as cited |

---

## 6. STATUS claims that are stale, superseded or wrong

| STATUS location | Claim | Reality | Evidence |
|---|---|---|---|
| Front matter, line 5 and 9 | "updated: 2026-10-27" | File was last changed 2026-10-30 (`e05ac98`) | `git log -1 -- STATUS.md` |
| Line 220 (10-30 decision) | Demo families "Not yet committed or pushed" | Deployed 10-30 | deployment record |
| Line 19 (10-27 routines fix) | "Not deployed; Tim's phone test remains" | `c0b75a4` deployed 10-27 20:06 UTC | deployment record |
| Line 17 (10-27 dial) | "Not committed or deployed" | `fc5e45a` deployed 10-27 21:53 UTC | deployment record |
| Line 33 (10-12 seed) | "**Not deployed**" | Shipped in `382bebf` 10-14 (line 31 says so) | — |
| Lines 35-53 (ten 10-07/10-08 entries) | "Local, uncommitted, not pushed/deployed" | All shipped in `382bebf` 10-14. Line 31 has one sentence superseding them, but each entry still reads as local | — |
| Lines 57-69 (10-07 routine, Clarity, equipment, timer) | "Uncommitted and not deployed" | Shipped in `f471b97` 10-07 | deployment record |
| Front Burner 1 and 2 (lines 655-656) | "Review … before deployment"; "deployment still requires Tim's decision" | Both have been live since 10-07 | deployment record |
| Lines 115-136 (10-02 Phase 1) | Describes a data-layer build, no mention of shipping | In production 10-02 15:29 UTC | deployment record |
| Background, "IndexedDB migration path" | "Still a hard prerequisite … need a version 4 and a real migration" | Version 4 exists since 10-02; a real migration has run | `index.html:4031` |
| Background, "Deliberately not changed on 08-14" | "12,900-line app" | 18,961 lines | `wc -l` |
| Background, "Related Activities and retrieval reliability" | "non-All splits remain hard boundaries" for search | Code searches all; 09-25 decision agrees with the code | `index.html:6191-6196` |
| Background, "Demo follow-ups" | "Refresh horizon: 2026-11-09" as a future date | Passed | seed last date |
| Background, "Set-screen follow-ups" | "`TimedDurationModal` still renders the inline `GripField`" | Still true (`index.html:9932`), but the timer screen has been rebuilt twice since; the note predates both | — |
| Line 200 | Working name "Tim's Logbook" | Header was changed to "FITNESS" on 10-07; title is still "Fitness Tracker" | §5 |
| Line 204 | "A real device session is now several passes overdue and is the blocking item" | Contradicted by line 692: "Tim tests on his phone constantly (2026-10-06)" | — |

**Pattern:** STATUS is written before the push and never corrected after it. "Not deployed" in this file means "was not deployed at the moment of writing", and because `main` auto-deploys, it was usually untrue within minutes.

---

## 7. What I covered and what I did not

**Covered**

- All four layers hashed and compared.
- `INTENT.md`, `CLAUDE.md`, `README.md`, the family and tour specs in full; the routine spec's decisions, data model, open questions, non-goals and phases; `STATUS.md` lines 1-450 and 598-700 in full, the rest skimmed.
- An automated scan of all **118 commits** that touch `index.html`, `sw.js`, `seed-data.csv` or `api/`: functions added and removed, database version and store changes, localStorage, network calls, migrations, cache versions, deletes.
- Hand-read diffs or file snapshots for the commits behind D-1 to D-6 and the seed, service-worker and INTENT histories.
- Today's data layer read directly: database open, all three migrations, boot sequence, import, export, bodyweight, routine helpers, Groq call, feedback call.
- A 44px spot check on the live site in an isolated browser with demo data. No real data was opened or written. The only reads of `my real data/` were row-type counts.

**Not covered (treat as unverified)**

- A line-by-line read of every one of the 118 diffs. The scan catches new functions and storage or network changes; it does not catch a changed default or a quietly altered condition inside an existing function.
- The 17 early commits with no message, beyond the scan.
- Which code was live on which day before 2026-09-21 (history was rewritten; see B-13).
- The state of the database on Tim's phone.
- Whether a CSV export restores cleanly; no round trip was run.
- Vercel settings and environment variables; whether feedback email actually sends.
- Touch targets outside the main logging flow.
- The stash contents and the two extra seed copies.
- `_docs/` evidence folders were listed, not read.
