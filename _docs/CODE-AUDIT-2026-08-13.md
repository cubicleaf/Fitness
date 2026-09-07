# Code audit — 2026-08-13

> **Status: findings 1–6 fixed 2026-08-14, unshipped and untested on hardware.**
> See STATUS.md decisions dated 2026-08-14 and the Fix log at the bottom of this
> document. The findings below are preserved as written, in the pre-fix present
> tense, because the reasoning is what makes the fixes legible. Do not read the
> body of this document as a description of current code.

Scope: `index.html` (15,001 lines; ~12,900 lines of app JS), `sw.js`, `api/feedback.js`.
Method: syntax check, ESLint 9 (correctness + react-hooks rules), Acorn AST analysis of
error-handling coverage, and a reproduced round-trip test of the CSV exporter/importer.

Headline: the app is structurally sound. Zero undefined references, zero duplicate keys,
zero unreachable code, no XSS surface, correct local-timezone date handling, and a real
error boundary. The defects below are almost all **one systemic pattern plus its
downstream consequences** — not scattered unrelated bugs.

---

## 1. Half the database layer has no error handling — the "random bugs" engine

**[Certain — verified by AST analysis]**

| Measure | Count |
|---|---|
| `await dbOps.*` calls guarded by `try/catch` or `safeDb()` | 57 |
| `await dbOps.*` calls with **no** error handling | **111** |
| `async` functions touching `dbOps` with neither guard | 39 |

`safeDb()` exists (line ~2960) and is good — it catches, logs, and shows a toast. It is
applied to roughly a third of the database surface.

Everywhere else, a rejected database read does not throw an error the user sees. It
**silently aborts the rest of the function.** Every `setState` call after that point never
runs. The screen keeps whatever it was showing.

`loadDayData` — the function that runs on every date-arrow tap — is the clearest example.
No `try`, no `catch`, seven-plus sequential `await dbOps.*` calls. One failure and the day
renders stale or empty with no indication anything went wrong.

**This is already a known-confirmed pattern in this codebase.** The 2026-08-11 STATUS entry
reads: *"a failed read or a malformed legacy activity could otherwise present as an empty
search and make the behavior appear random."* That fix hardened one call site. There are
110 others with the identical shape.

**Predicted symptom profile:** intermittent, non-reproducible, "it was fine yesterday,"
blank or stale sections, no console error the user notices. Which is what a bug-hunt that
never converges looks like.

---

## 2. Writes report success before they are actually committed

**[Certain — code shape; Likely — as a live data-loss path]**

All 31 methods in `dbOps` follow one shape:

```js
const tx = db.transaction('sets', 'readwrite');
const req = tx.objectStore('sets').put(set);
req.onerror   = () => reject(req.error);
req.onsuccess = () => resolve(req.result);   // ← resolves here
```

Counts across `dbOps`: `db.transaction(` = 31, `req.onerror` = 31,
**`tx.oncomplete` = 0, `tx.onerror` = 0, `tx.onabort` = 0.**

In IndexedDB, `req.onsuccess` means *"the request completed inside the transaction."* It
does **not** mean the data is on disk. Durability happens at `tx.oncomplete`. A transaction
can still abort after every request in it succeeded — storage quota exceeded, disk full,
the browser reclaiming space, the connection closing.

Because `tx.onabort` and `tx.onerror` are unhandled, that abort produces no rejection, no
`safeDb` toast, and no console path the app watches. The promise already resolved. The UI
already said saved.

Against a stated core principle of **"Auto-save always. No save button. No lost data,"**
this is the highest-consequence gap in the file.

---

## 3. The CSV backup corrupts on activity names containing a comma

**[Certain — reproduced]**

The importer (`parseCSVLine`, line ~7877) is a correct quote-aware CSV parser. The exporter
is not symmetrical with it. Line 7852 quotes exactly one field — `noteField` — and
string-concatenates everything else raw:

```js
csv += `${set.date},${set.exerciseName},${categories},${ex.type},…`;
```

`set.exerciseName` is free-text the user types. Nothing validates or strips commas.

Round-trip test run against the actual exporter template and the actual parser:

| Activity name | Reimported as | Category | Type | WeightType | Reps |
|---|---|---|---|---|---|
| `Bench Press` | `Bench Press` | `pull` | `reps` | `lbs` | `10` |
| `Row (Wide, Neutral)` | **`Row (Wide`** | `Neutral)` | `pull` | `135` | **`NaN`** |
| `Curl, Incline` | **`Curl`** | `Incline` | `pull` | `135` | **`NaN`** |
| `Squat "Pause" Rep` | `Squat Pause Rep` | `pull` | `reps` | `lbs` | `10` |

Every field after the comma shifts one column left. The import creates a **new phantom
activity** under the truncated name, assigns it a garbage category and weight unit, and
writes `NaN` reps. Silently — the row does not error, it just lands wrong.

CSV export is the *entire* stated backup strategy. The safety net has a hole in it that
only opens once an activity name contains a comma, which is exactly the kind of name a
modifier/qualifier system tends to produce (`Row (Wide, Neutral)`).

Unescaped alongside `exerciseName`: `ex.type`, `set.weightType`, and `dn.note` in the
`__DAYSPLIT__` / `__BODYWEIGHT__` metadata lines. Quotes in a name are dropped silently
(row 4 above) — less destructive, still lossy.

---

## 4. Persistent storage is never requested

**[Certain]**

`grep navigator.storage` → no matches. `persist()` is never called; `estimate()` is never
called; `QuotaExceededError` is never handled anywhere.

By default a browser treats IndexedDB as **best-effort** and may evict it under storage
pressure without warning. `navigator.storage.persist()` asks for durable status; for an
installed home-screen PWA it is usually granted without a prompt.

For an app whose whole data model is "local IndexedDB, CSV export is the backup," this is
one line of code standing between real workout history and an eviction event. It also
compounds #2: quota pressure is precisely the condition that aborts transactions.

---

## 5. No schema migration path — and two schema changes are already queued

**[Certain — structural; Likely — bites on the next version bump]**

`indexedDB.open('FitnessTracker', 3)` and `onupgradeneeded` only does
`if (!database.objectStoreNames.contains(x)) createObjectStore(x)`. There is no version
branching, so there is nowhere to transform existing records.

Also missing: `request.onblocked` and `db.onversionchange`. With a static version 3 this is
currently harmless. It stops being harmless at version 4 — a second open tab will block the
upgrade, and with no `onblocked` handler the promise **never resolves and never rejects**.
The app hangs on a blank screen with no error.

STATUS `## Open` already contains two items that require a version 4:

- **Bodyweight unit-aware storage** — needs a per-record unit field plus a migration rule
- **Modifier storage shape** — needs grip fields nested under `set.qualifiers`

Both are correctly identified there as needing migration. The point here is that the
*mechanism* to run one does not exist yet, and the upgrade path has no failure handling.
Worth building before either item, not during.

---

## 6. INTENT.md now states two things that are false

**[Certain]**

INTENT.md line 38: *"Deployed on Vercel. No environment variables, no server-side code."*

`api/feedback.js` is server-side code and requires `RESEND_API_KEY`, `FEEDBACK_TO_EMAIL`,
and optionally `FEEDBACK_FROM_EMAIL`.

The `sw.js` constraint on line 35 was amended honestly — *"(Amended 2026-07-16.)"* — with
the reasoning preserved. The feedback endpoint got the same kind of deliberate exception
but never got the same amendment. STATUS records the decision; INTENT still reads as though
it did not happen.

**Consequence:** a future session that reads INTENT as binding could reasonably delete
`api/` for violating the single-file rule.

---

## 7. Lower severity

- **Unauthenticated public endpoint.** `POST /api/feedback` is open to anyone, with a
  honeypot field but no rate limit, and forwards up to ~5.6 MB of base64 image straight to
  Resend as an attachment. A trivial script could burn the Resend quota or flood the inbox.
  Low likelihood at this obscurity; near-zero cost to add a rate limit or a shared secret.
- **Five stale-closure `useEffect` hooks** (`react-hooks/exhaustive-deps`). The real one is
  index.html ~5182: the "your weights" loader reads `unit` but only depends on `[exercise]`,
  so toggling lbs/kg with the modal open leaves the suggestion chips filtered by the old
  unit. Others at ~6163, ~10301, ~10415, ~12130.
- **Dead code**, ~14 items. Notably `GripPromptModal` (~11085) — a whole modal component
  that is defined and never rendered. Also `IconChevronDown`, `formatSetDisplay`,
  `exerciseInSplit`, `isLikelyGripRelevant`, `MOOD_GRADIENT`, `handlePairWith`,
  `setShowFormCueInput`/`setShowNoteInput`/`setShowQuickNotes`, `longPressRef`.
- **`ReactDOM.render`** (line 14872) is the React 17 API. React 18.3.1 still honors it but
  logs a deprecation warning and runs the app in **legacy mode** — no automatic batching
  outside event handlers, meaning more re-renders than necessary. `ReactDOM.createRoot` is
  a two-line change.
- **N+1 queries in `loadDayData`.** One separate IndexedDB transaction per unique exercise
  on the day, executed serially, on every date change. Correct, just slower than one
  `getAll()` and a client-side filter.
- **Rename has no rollback.** Renaming an activity loops over every historical set updating
  the denormalized `exerciseName`, and `break`s on first failure — leaving history split
  across two names with only a transient toast. (The denormalization itself is a reasonable
  read-performance tradeoff and rename *does* correctly propagate; it is only the partial
  failure that is unhandled.)

---

## What is genuinely good

Worth stating, because it constrains where bugs can actually be:

- **Dates are handled correctly.** `parseLocalDate` splits the string and builds a local
  `Date`; only 5 `new Date(` calls in the whole file. The classic UTC off-by-one-day bug
  that plagues date-keyed loggers is absent.
- **No XSS surface.** Zero `dangerouslySetInnerHTML` and zero `innerHTML` in application
  code, including the vanilla-DOM tour engine.
- **Clean static analysis.** 12,886 lines, `node --check` passes, and ESLint's correctness
  rules find nothing: no `no-undef`, no `no-dupe-keys`, no `no-unreachable`, no
  `no-constant-condition`. That is unusual at this size.
- **The service worker is well-reasoned.** Network-first for the shell, the `/sw.js`
  self-update bypass is a real trap correctly avoided, and the comment explaining why is
  accurate.
- **`parseCSVLine` is a correct RFC-style parser.** The import side was done properly; only
  the export side is out of step with it.
- **An error boundary exists** and `initPrefs()` failure still renders the app.

---

## Recommended order

Fixes 1 and 2 are the same edit. All 31 `dbOps` methods share one shape, so a single helper
replaces the lot and makes correct behavior the default:

```js
const idbRequest = (storeNames, mode, run) => new Promise((resolve, reject) => {
  if (!db) return reject(new Error('Database not open'));
  let result;
  const tx = db.transaction(storeNames, mode);
  const req = run(tx);
  req.onsuccess  = () => { result = req.result; };
  req.onerror    = () => reject(req.error);
  tx.onabort     = () => reject(tx.error || new Error('Transaction aborted'));
  tx.onerror     = () => reject(tx.error);
  tx.oncomplete  = () => resolve(result);      // resolve only once committed
});
```

1. **Rewrite `dbOps` onto that helper** — closes the false-success gap for every write at
   once. Behavior change to expect: writes resolve a few milliseconds later, and failures
   that were previously invisible now surface. Some may turn out to have been happening all
   along.
2. **Wrap the unguarded read paths**, starting with `loadDayData`. A failure should show
   the `safeDb` toast, not silently stop.
3. **Quote every CSV field on export**, not just `noteField` — then re-export and reimport
   into a throwaway browser profile to prove the round trip.
4. **Call `navigator.storage.persist()`** on startup.
5. **Build the version-4 upgrade path with `onblocked` + `onversionchange`** before
   touching bodyweight units or modifier storage.
6. **Amend INTENT.md line 38** in the same style as the line-35 sw.js amendment.

Steps 1–4 are small, independent, and mostly mechanical. They address the categories that
produce silent, non-reproducible failures — which is the category actually costing time.

---

# Fix log — 2026-08-14

All changes are in `index.html` unless noted. `git diff` against `5ce345e` shows the full set.

| # | Finding | Status |
|---|---|---|
| 1 | Unguarded database calls | **Partially fixed** — global safety net + key paths wrapped |
| 2 | Writes report success before commit | **Fixed** |
| 3 | CSV export escaping | **Fixed** |
| 4 | Persistent storage never requested | **Fixed** |
| 5 | No migration path / no `onblocked` | **Half fixed** — handlers added, migration still absent |
| 6 | INTENT.md states two false things | **Fixed** (INTENT.md) |
| 7 | Lower severity | Partially — see below |

### What changed

- **`idbRun` helper replaces all 31 `dbOps` method bodies.** Resolves on `tx.oncomplete`,
  rejects on `tx.onabort`/`tx.onerror`, rejects rather than throwing when `db` is null, and
  catches exceptions thrown inside `req.onsuccess` so a transform failure surfaces its real
  cause instead of a generic `AbortError`. Public API unchanged: 6 groups, 31 methods, same
  names, same order, same return shapes. 309 lines became 120.
- **`showDbError(label)` extracted from `safeDb`**, with 3-second repeat-collapsing so one
  failing screen does not stack toasts. `safeDb` now delegates to it; behavior unchanged.
- **Global `unhandledrejection` listener** surfaces any `DOMException` or database-shaped
  rejection. A safety net for the ~100 call sites still unguarded — it makes failures
  visible but cannot repair the aborted function.
- **`loadDayData` wrapped in `try/catch`**, and its N+1 loop replaced with one
  `exercises.getAll()` plus a filter. Previously one transaction per exercise, serially, on
  every date tap.
- **`handleExport` wrapped**, and its three raw transactions replaced with `dbOps` calls.
  Those three had **no `onerror` at all**, so a failed read never called `resolve()` and the
  export hung forever with no error and no file — in the backup path.
- **`handleNuclearReset`**: added `onerror`/`onabort` (a failed clear previously hung and
  never reloaded) and added the missing `movementFamilies` store, which had been left behind
  by "reset everything," orphaning family records against deleted exercise ids.
- **Three bulk-import transactions** gained `tx.onabort` alongside their existing
  `oncomplete`/`onerror`.
- **`csvField` / `csvRow`** added next to the date helpers as the counterpart to
  `parseCSVLine`; every exported field now routes through them.
- **`requestPersistentStorage()`** calls `navigator.storage.persist()` at startup,
  fire-and-forget, guarded so it never blocks first render.
- **`initDB`** gained `request.onblocked` and `db.onversionchange`.
- **Recent-weights effect** gained `unit` in its dependency array and a `try/catch`.

### Verification performed

- `node --check` on the extracted app script — passes.
- **ESLint parity**: identical to the pre-change baseline
  (`no-return-assign` 2, `no-unused-vars` 33, `require-atomic-updates` 2, `no-undef` 0),
  with `react-hooks/exhaustive-deps` down 5 → 4. No new diagnostics of any kind.
- **Headless boot** — `index.html` loaded in jsdom over `fake-indexeddb`: the React tree
  rendered ("Fitness Tracker / Friday, Aug 14 / No activities logged yet today / + Add New
  Activity"), 7 buttons present, error boundary **not** tripped, zero console errors.
- **All 31 `dbOps` methods exercised live** against real IndexedDB semantics — add/get
  round-trip with a comma-bearing name, sorted `getByDate`, `getLastSession` with and
  without data, `dayNotes` set/get, `getByLastUsed`, `findByName` miss returning null,
  templates, sessionNotes, delete returning undefined. All pass with their original shapes.
- **Failure settles rather than hangs**: a duplicate-key write rejects with
  `ConstraintError` within 2 seconds.
- **Differential test of the durability fix** — transaction aborted after the request
  succeeds, which is what quota exhaustion and eviction look like:

  | Pattern | App reported | Actually on disk | |
  |---|---|---|---|
  | old `dbOps` | `SAVED` | `false` | silent data loss |
  | new `dbOps` | `ERROR` | `false` | consistent |

- **CSV round-trip** through the real `csvField`/`csvRow`/`parseCSVLine` extracted from the
  edited file: 5/5 pass, including `Row (Wide, Neutral)`, `Curl, Incline`,
  `Squat "Pause" Rep` and a value containing both a comma and quotes. Metadata rows still
  parse at their original indices with their original field counts.

### Not verified

No browser, no phone, no service worker, no real data. jsdom is not Safari and
`fake-indexeddb` is not WebKit's implementation. Everything above should be treated as
"the logic is sound and nothing regressed statically," not "it works."

### Expected behavior changes

1. **Previously invisible failures now raise a toast.** A new toast is not automatically a
   new bug — it may be a pre-existing failure becoming visible for the first time. Check the
   console before treating one as a regression.
2. **Writes settle marginally later**, because they now wait for the actual commit. Not
   perceptible in a debounced auto-save path, but it is a real change.
3. **A failed nuclear reset now stops and reports** instead of silently stalling part-way.
4. **Nuclear reset now also clears `movementFamilies`.** This is a scope change to a
   destructive action — flagged deliberately in case the omission was intentional.
5. **Date changes issue fewer database round-trips**, so day navigation should feel slightly
   faster on a day with several activities.
