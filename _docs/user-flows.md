# Exercise Tracker — User Flow Map
### Version 0.1 | February 2026
### Design philosophy: Smartphone-first. Minimum taps. Maximum context.

---

## Design Principles

**One thing at a time.** Every input moment occupies the full screen. When you're picking a weight, the only thing on screen is weights. When you're picking reps, the only thing on screen is reps. No split attention, no accidental taps on the wrong element.

**Auto-save always.** Every action writes to the browser's local database instantly. There is no save button. You can close the app mid-workout, reopen it, and everything is exactly where you left it. CSV export exists for backups, not for daily operations.

**"Last time" is king.** The single most useful piece of information when deciding what weight to use is what you did last time. This reference appears every time you select an exercise, before you make any input decisions.

**Suggestions, not mandates.** Templates are loose labels ("Push Day"), not rigid exercise lists. The app proposes, you decide. Nothing is required, nothing nags you.

**Two taps per set.** The core logging action — recording one set — should require exactly two taps after selecting the exercise: one for weight, one for reps. Everything else is optional.

---

## Flow 1: The Daily Session (95% of all usage)

This is the core loop. Everything else in the app is secondary to this flow working flawlessly.

### Step 1: Open the app

You open the app on your phone. The screen shows:

```
┌─────────────────────────────┐
│  ◀  Tue, Feb 24  ▶          │
│  Push Day                    │
│                              │
│  ┌─────────────────────────┐ │
│  │                         │ │
│  │   No exercises logged   │ │
│  │        yet today.       │ │
│  │                         │ │
│  └─────────────────────────┘ │
│                              │
│                              │
│                              │
│                              │
│                              │
│                              │
│                              │
│  ┌─────────────────────────┐ │
│  │      + Add Exercise     │ │
│  └─────────────────────────┘ │
└─────────────────────────────┘
```

- The date arrows let you swipe or tap to adjacent days (for reviewing past sessions — see Flow 3).
- "Push Day" is the optional day label from your weekly template. If no label is set, this line simply doesn't appear.
- The main area is empty until you start logging.
- The "+ Add Exercise" button is large, prominent, and always at the bottom.

**If you already logged exercises earlier today**, the screen shows those exercises with their sets instead of the empty state. You can keep adding.

### Step 2: Tap "+ Add Exercise"

A full-screen exercise picker slides up:

```
┌─────────────────────────────┐
│  ╳                          │
│  ┌─────────────────────────┐ │
│  │  🔍 Search exercises... │ │
│  └─────────────────────────┘ │
│                              │
│  RECENT                      │
│  ┌─────────────────────────┐ │
│  │  Bench Press             │ │
│  │  Last: Feb 20 · 3 sets  │ │
│  ├─────────────────────────┤ │
│  │  Incline DB Press        │ │
│  │  Last: Feb 20 · 3 sets  │ │
│  ├─────────────────────────┤ │
│  │  Cable Flyes             │ │
│  │  Last: Feb 20 · 4 sets  │ │
│  ├─────────────────────────┤ │
│  │  Tricep Pushdown         │ │
│  │  Last: Feb 17 · 3 sets  │ │
│  └─────────────────────────┘ │
│                              │
│  ALL  │ Push │ Pull │ Legs   │
│  ──────────────────────────  │
│  ┌─────────────────────────┐ │
│  │  + Create New Exercise   │ │
│  └─────────────────────────┘ │
└─────────────────────────────┘
```

- **Recent exercises** appear at the top, sorted by most recently used. Each shows a compact "last performed" date and set count. This is the fastest path — most workouts reuse recent exercises.
- **Search** filters the full library as you type.
- **Category tabs** (Push / Pull / Legs / Core / Cardio / custom) filter the library. Categories are assigned when creating an exercise.
- **"+ Create New Exercise"** at the bottom for anything not in the library yet.

**Design note:** If you have a day label set (e.g., "Push Day"), the exercise picker could pre-filter to the matching category. But this should be a soft filter (easy to clear) since the loose-framework approach means you might do a pull exercise on push day.

### Step 3: Tap an exercise — see "Last Time" reference

After tapping an exercise (e.g., "Bench Press"), a brief reference panel appears before input begins:

```
┌─────────────────────────────┐
│  Bench Press                 │
│                              │
│  LAST SESSION — Feb 20       │
│  ┌─────────────────────────┐ │
│  │  Set 1:  135 lbs × 10   │ │
│  │  Set 2:  155 lbs × 8    │ │
│  │  Set 3:  155 lbs × 7    │ │
│  └─────────────────────────┘ │
│                              │
│                              │
│                              │
│                              │
│                              │
│                              │
│  ┌─────────────────────────┐ │
│  │      Log a Set →        │ │
│  └─────────────────────────┘ │
│                              │
│  ┌─────────────────────────┐ │
│  │   Skip (no sets today)  │ │
│  └─────────────────────────┘ │
└─────────────────────────────┘
```

- This screen is the **decision point**. You glance at your last session, decide what you're doing today, and tap "Log a Set" to begin.
- "Skip" is for when you added an exercise by accident or changed your mind. It dismisses without logging.
- If there's no history for this exercise (first time ever), the reference area says "First time — no previous data" and goes straight to input.

**Why this screen exists:** This is the moment where 渐进超负荷 (jiànjìn chāo fùhè, "progressive overload") happens — not through a feature or algorithm, but by simply showing you what you did last time and letting your own judgment drive the next decision. The app's job is to surface context, not to prescribe.

### Step 4: Weight Picker (full screen)

After tapping "Log a Set," the weight picker takes over the entire screen:

```
┌─────────────────────────────┐
│  Bench Press — Set 1         │
│  Last: 135, 155, 155         │
│  ─────────────────────────── │
│                              │
│  YOUR WEIGHTS                │
│  ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ 135 │ │ 155 │ │ 115 │   │
│  └─────┘ └─────┘ └─────┘   │
│                              │
│  COMMON                      │
│  ┌────┐┌────┐┌────┐┌────┐  │
│  │ 45 ││ 65 ││ 85 ││ 95 │  │
│  └────┘└────┘└────┘└────┘  │
│  ┌────┐┌────┐┌────┐┌────┐  │
│  │105 ││115 ││125 ││135 │  │
│  └────┘└────┘└────┘└────┘  │
│  ┌────┐┌────┐┌────┐┌────┐  │
│  │145 ││155 ││165 ││175 │  │
│  └────┘└────┘└────┘└────┘  │
│  ┌────┐┌────┐┌────┐┌────┐  │
│  │185 ││195 ││205 ││225 │  │
│  └────┘└────┘└────┘└────┘  │
│                              │
│  ┌──────┐  ┌──────┐         │
│  │  BW  │  │Banded│         │
│  └──────┘  └──────┘         │
│                              │
│  ┌──┐  ┌────────────┐ ┌──┐ │
│  │-5│  │  [manual]   │ │+5│ │
│  └──┘  └────────────┘ └──┘ │
└─────────────────────────────┘
```

- **"Your Weights" row:** The 2-3 weights you've actually used for this specific exercise, pulled from history. These are the fastest path — one tap. This row only appears after you have history.
- **"Common" grid:** A broader grid of standard weight increments. The range and increments adapt to the exercise category (barbell exercises show plate-math-friendly numbers like 135/185/225; dumbbell exercises show 10/15/20/25/30/35...; cable exercises show their own range).
- **BW (Bodyweight) and Banded:** Special options for exercises like pull-ups, dips, push-ups, banded work.
- **-5 / +5 stepper with manual input:** For fine-tuning or entering any weight not on the grid.
- **The "Last" line at the top** keeps your reference visible without needing to go back.

**One tap selects the weight and immediately advances to the rep picker.** No confirm button needed — the selection IS the confirmation.

### Step 5: Rep Picker (full screen)

Immediately after weight selection, the rep picker takes over:

```
┌─────────────────────────────┐
│  Bench Press — Set 1         │
│  Weight: 155 lbs             │
│  ─────────────────────────── │
│                              │
│                              │
│  ┌────┐┌────┐┌────┐┌────┐  │
│  │  1 ││  2 ││  3 ││  4 │  │
│  └────┘└────┘└────┘└────┘  │
│  ┌────┐┌────┐┌────┐┌────┐  │
│  │  5 ││  6 ││  7 ││  8 │  │
│  └────┘└────┘└────┘└────┘  │
│  ┌────┐┌────┐┌────┐┌────┐  │
│  │  9 ││ 10 ││ 11 ││ 12 │  │
│  └────┘└────┘└────┘└────┘  │
│  ┌────┐┌────┐┌────┐┌────┐  │
│  │ 13 ││ 14 ││ 15 ││ 16 │  │
│  └────┘└────┘└────┘└────┘  │
│  ┌────┐┌────┐┌────┐┌────┐  │
│  │ 17 ││ 18 ││ 19 ││ 20 │  │
│  └────┘└────┘└────┘└────┘  │
│                              │
│                              │
│                              │
│                              │
└─────────────────────────────┘
```

- Simple grid, 1-20. Large tap targets.
- The selected weight is confirmed at the top so you know what you chose.
- **Tapping a rep count logs the set immediately and returns you to the exercise view.** No confirm step. The set is saved to the database the instant you tap.

### Step 6: Back to the exercise view — set logged

You're returned to the day view with your set now visible:

```
┌─────────────────────────────┐
│  ◀  Tue, Feb 24  ▶          │
│  Push Day                    │
│                              │
│  BENCH PRESS                 │
│  ┌─────────────────────────┐ │
│  │  Set 1: 155 lbs × 10    │ │
│  └─────────────────────────┘ │
│                              │
│  ┌─────────────────────────┐ │
│  │      + Add Set          │ │
│  └─────────────────────────┘ │
│                              │
│                              │
│                              │
│                              │
│                              │
│                              │
│                              │
│  ┌─────────────────────────┐ │
│  │      + Add Exercise     │ │
│  └─────────────────────────┘ │
└─────────────────────────────┘
```

- Your logged set appears under the exercise name.
- **"+ Add Set"** appears directly below the exercise's sets. Tapping it goes straight to the weight picker again (Step 4), pre-highlighting the weight you just used since consecutive sets often use the same weight.
- **"+ Add Exercise"** remains at the bottom for when you're done with this exercise and ready to move on.
- Each logged set is swipeable left to reveal a delete option (for mistakes).

### The Full Loop

After multiple exercises and sets, the day view looks like:

```
┌─────────────────────────────┐
│  ◀  Tue, Feb 24  ▶          │
│  Push Day                    │
│                              │
│  BENCH PRESS            ···  │
│    Set 1: 135 lbs × 10      │
│    Set 2: 155 lbs × 8       │
│    Set 3: 155 lbs × 7       │
│  + Add Set                   │
│                              │
│  INCLINE DB PRESS       ···  │
│    Set 1: 40 lbs × 12       │
│    Set 2: 45 lbs × 10       │
│    Set 3: 45 lbs × 9        │
│  + Add Set                   │
│                              │
│  CABLE FLYES            ···  │
│    Set 1: 25 lbs × 12       │
│    Set 2: 25 lbs × 12       │
│  + Add Set                   │
│                              │
│  ┌─────────────────────────┐ │
│  │      + Add Exercise     │ │
│  └─────────────────────────┘ │
└─────────────────────────────┘
```

- The "···" menu on each exercise gives access to: reorder, delete exercise, add note, view history.
- The day view scrolls naturally as exercises accumulate.
- **There is no "Finish Workout" button.** You simply stop adding sets and close the app. Everything is already saved. You can come back anytime and add more if needed.

---

## Flow 2: During-Workout Actions

### Adding an unplanned exercise

Identical to the normal flow — tap "+ Add Exercise" at any point. There is no distinction between "planned" and "unplanned" exercises. The app doesn't know or care whether you intended to do cable flyes today. You did them, they're logged.

### Deleting a set

Swipe left on any set row to reveal a red "Delete" button. One tap deletes it. No confirmation popup — it's easy enough to re-add if you delete by accident, and confirmation popups during a workout are friction.

### Deleting an exercise

Tap the "···" menu on the exercise header → "Delete Exercise." This one DOES get a confirmation ("Delete Bench Press and all 3 sets?") because it's a larger action.

### Timed exercises (planks, holds, stretches)

When creating an exercise, you choose its type: **Reps** or **Timed**. This is set once and remembered in the library.

For a timed exercise, the flow changes at Step 4-5. Instead of Weight → Reps, you get:

**Weight picker** (same as before — optional, for weighted planks etc., with a prominent "No Weight / Bodyweight" option at the top)

Then instead of the rep picker:

```
┌─────────────────────────────┐
│  Plank — Set 1               │
│  Weight: Bodyweight          │
│  ─────────────────────────── │
│                              │
│  ┌─────────────────────────┐ │
│  │                         │ │
│  │        0:00             │ │
│  │                         │ │
│  └─────────────────────────┘ │
│                              │
│  ┌─────────────────────────┐ │
│  │        START            │ │
│  └─────────────────────────┘ │
│                              │
│  ── OR ENTER MANUALLY ──     │
│                              │
│  ┌────┐┌────┐┌────┐┌────┐  │
│  │0:30││1:00││1:30││2:00│   │
│  └────┘└────┘└────┘└────┘  │
│  ┌────┐┌────┐┌────┐┌────┐  │
│  │2:30││3:00││4:00││5:00│   │
│  └────┘└────┘└────┘└────┘  │
│                              │
└─────────────────────────────┘
```

- **START** runs a live timer you stop when done.
- **Quick-tap duration buttons** for when you already know the time (e.g., you did a 1-minute plank without timing it in the app).
- Either method logs the set and returns to the day view.

### Adding a note

**Exercise-level note** (persistent form cue): Tap "···" on exercise → "Edit Note" → text input. This note is saved in the exercise library and appears every time you select this exercise. Use for things like "grip width: pinky on ring" or "pause at bottom."

**Session-level note** (daily context): A small note icon or area at the top of the day view. Tap to add free text like "slept poorly" or "shoulder felt tight." Saved with the day's data.

---

## Flow 3: Review Exercise History

### Per-exercise history (primary use case)

Access from two places:
1. **During logging**: The "Last Session" reference in Step 3 has a "View Full History →" link.
2. **From the exercise picker**: Long-press any exercise to see its history without starting to log it.

The history view:

```
┌─────────────────────────────┐
│  ◀  Bench Press History      │
│                              │
│  Feb 20                      │
│    135 × 10 · 155 × 8 ·     │
│    155 × 7                   │
│                              │
│  Feb 17                      │
│    135 × 10 · 150 × 8 ·     │
│    150 × 8                   │
│                              │
│  Feb 13                      │
│    135 × 10 · 145 × 8 ·     │
│    145 × 8                   │
│                              │
│  Feb 10                      │
│    135 × 8 · 135 × 8 ·      │
│    135 × 7                   │
│                              │
│  ───────────────────────     │
│  Est. 1RM trend: 185 → 197  │
│  ───────────────────────     │
│                              │
└─────────────────────────────┘
```

- Compact, scannable. Each session is one line.
- Scrolls back through all history for this exercise.
- Optional: a simple trend indicator at the bottom (estimated 1RM or total volume trend). This is a nice-to-have, not critical for v1.

### Weekly overview (secondary use case)

Accessible via a calendar or week icon in the top nav:

```
┌─────────────────────────────┐
│  Week of Feb 17–23           │
│                              │
│  Mon 17 — Push               │
│  4 exercises · 14 sets       │
│                              │
│  Tue 18 — Rest               │
│  (no exercises logged)       │
│                              │
│  Wed 19 — Pull               │
│  5 exercises · 16 sets       │
│                              │
│  Thu 20 — Rest               │
│  (no exercises logged)       │
│                              │
│  Fri 21 — Legs               │
│  4 exercises · 12 sets       │
│                              │
│  Sat 22 — Rest               │
│  Sun 23 — Rest               │
│                              │
│  TOTAL: 3 sessions · 42 sets │
│  ◀ Previous Week              │
└─────────────────────────────┘
```

- Tapping any day navigates to that day's full view.
- Simple summary: exercise count, set count. No complex analytics for v1.

---

## Flow 4: Weekly Template (Lightweight)

The template system is intentionally minimal. It exists to give your days labels and optionally suggest exercises, not to enforce a program.

### Setting up a template

Accessible via a settings/gear icon → "Weekly Template":

```
┌─────────────────────────────┐
│  Weekly Template             │
│                              │
│  Monday      [ Push Day    ] │
│  Tuesday     [ Rest        ] │
│  Wednesday   [ Pull Day    ] │
│  Thursday    [ Rest        ] │
│  Friday      [ Legs        ] │
│  Saturday    [             ] │
│  Sunday      [             ] │
│                              │
│  ┌─────────────────────────┐ │
│  │         Save            │ │
│  └─────────────────────────┘ │
└─────────────────────────────┘
```

- Each day gets a free-text label. That's it.
- The label appears at the top of the day view (as seen in Flow 1, Step 1).
- Blank means no label — the day just shows the date.

**What about suggested exercises per day?** For v1, I'd argue against this. Your training style is "loose framework" — you know it's Push Day and you'll pick exercises in the moment. The exercise picker already sorts by recent, which naturally surfaces your push exercises when it's push day. Adding suggested exercise lists to the template reintroduces the rigidity your original spec had and that doesn't match how you train.

If you later want this, it's easy to add: each day label could optionally have a list of "suggested" exercises that appear in a special section of the exercise picker. But start without it.

---

## Flow 5: Data Management

### Auto-save (invisible, always-on)

Every action that changes data (log a set, delete a set, add an exercise, edit a note) immediately writes to IndexedDB. There is no save button anywhere in the app. If your phone dies mid-workout, you lose nothing — everything up to your last tap is persisted.

### Export to CSV (manual backup)

Settings → "Export Data" → browser downloads a CSV file. This file contains your full history in a portable format. Do this occasionally (weekly, monthly) as insurance against browser data loss.

The export format should be simple and flat:

```
Date,Exercise,Set,Weight,Reps,Duration,Note
2026-02-24,Bench Press,1,155,10,,
2026-02-24,Bench Press,2,155,8,,
2026-02-24,Bench Press,3,155,7,,
2026-02-24,Plank,1,BW,,60s,
```

### Import from CSV (restore)

Settings → "Import Data" → file picker → select CSV → app parses and loads. This is for restoring from backup or migrating to a new device/browser. The import should warn if it will overwrite existing data and offer to merge or replace.

### Future consideration: cross-device sync

Not for v1, but worth noting the path. If you ever want your data on multiple devices, the simplest approach would be adding a small backend (a free-tier database like Supabase or Firebase) that syncs with IndexedDB. The app would work offline-first and sync when connected. This is a well-established pattern and doesn't require rethinking the architecture — it layers on top of what we're building.

---

## Flow 6: First Launch / Empty State

### Very first open

The app has no data, no exercise library, no templates. The screen shows:

```
┌─────────────────────────────┐
│  ◀  Tue, Feb 24  ▶          │
│                              │
│                              │
│  ┌─────────────────────────┐ │
│  │                         │ │
│  │   Welcome. Tap below    │ │
│  │   to log your first     │ │
│  │   exercise.             │ │
│  │                         │ │
│  └─────────────────────────┘ │
│                              │
│                              │
│                              │
│                              │
│                              │
│                              │
│                              │
│  ┌─────────────────────────┐ │
│  │      + Add Exercise     │ │
│  └─────────────────────────┘ │
└─────────────────────────────┘
```

- No onboarding wizard, no tutorial, no setup required.
- The exercise library starts empty. When you tap "+ Add Exercise," the picker shows only "+ Create New Exercise."
- Creating your first exercise is: type a name → pick a category (Push/Pull/Legs/Core/Cardio) → pick a type (Reps or Timed) → done. Three fields, no more.

### How the library bootstraps

Every exercise you create and use gets added to your library automatically. By the end of your first week, your "Recent" list will have 15-20 exercises and the app will feel fully populated. No pre-loaded database of 500 exercises you'll never use.

**Optional for v1:** A "starter pack" import — a small CSV of common exercises (bench press, squat, deadlift, etc.) with categories pre-assigned. Not required, but could reduce first-week friction. This should be offered as an optional one-tap action on first launch, not forced.

---

## Edge Cases and Open Questions

### What if I want to change a weight or rep count after logging?

Tap on any logged set to re-enter the weight/rep pickers with the current values pre-selected. One-tap correction.

### What about warm-up sets?

Two options to consider:
1. **No distinction** — a set is a set. You logged 95×5 as a warm-up? It's in the data. Simple, no extra UI.
2. **Optional warm-up tag** — a small toggle on the set that marks it as a warm-up, which excludes it from "working set" history/trends. Adds a small amount of complexity but keeps the data cleaner.

Recommendation for v1: option 1 (no distinction). You can always identify warm-ups by context (lighter weight, higher reps at the start). Adds zero friction.

### What about exercise order?

Within a day, exercises appear in the order they were logged. This naturally reflects your actual workout order. If you want to reorder after the fact (rare), the "···" menu could offer "Move Up / Move Down." Low priority for v1.

### What if I open the app and it's past midnight but I'm still working out?

The app shows "today" based on the calendar date. If you started at 11 PM and it's now 12:30 AM, the day view has flipped to the new date. Your 11 PM sets are on yesterday, your 12:30 AM sets are on today. This is technically correct but potentially annoying. A simple solution: the app considers a "day" to end at 4 AM (configurable), so late-night sessions stay grouped together. Nice-to-have for v1, not critical.

### Running / cardio tracking?

You mentioned possibly adding outdoor runs. For v1, these can be logged as timed exercises (e.g., "Outdoor Run," Timed type, no weight, duration = 35:00). If you later want distance, pace, heart rate — that's a different feature set that might warrant a dedicated cardio section. Keep it simple for now.

---

## Summary: Tap Counts for Core Actions

| Action | Taps from day view |
|---|---|
| Log a set (existing exercise, familiar weight) | 4: Add Exercise → tap exercise → tap weight → tap reps |
| Log another set (same exercise) | 3: Add Set → tap weight → tap reps |
| Log another set (same weight) | 2: Add Set → tap pre-highlighted weight → tap reps |
| Delete a set | 2: swipe left → tap Delete |
| View exercise history | 2: ··· menu → View History |
| Add a new exercise to library | 4: Add Exercise → Create New → fill 3 fields → Save |

---

## What This Document Does NOT Cover (Yet)

- Visual design (colors, typography, spacing) — that's a later phase
- Data schema / technical architecture — flows first, then schema to support them
- Specific weight ranges per exercise category — needs your input on what equipment you use
- Analytics or progress charts — v2 feature, not v1
- Any server-side functionality — v1 is fully client-side
