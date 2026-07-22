# Exercise Tracker — Data Model
### Version 0.1 | February 2026
### Storage: IndexedDB (browser-native, no server required)

---

## How IndexedDB Works (Quick Primer)

IndexedDB is a database built into every modern browser. Think of it as a set of tables (called "object stores") that live on your device. Each store holds JavaScript objects and can be indexed for fast queries.

Key things to know:
- **Persistent**: Data survives browser restarts, phone reboots, etc. It's not temporary.
- **Device-bound**: Data lives on THIS browser on THIS device. Different browser or different device = different data. (That's why CSV export exists for backup.)
- **No SQL, no joins**: You query one store at a time. This means we sometimes store the same piece of info in two places for speed (called "denormalization"). That's normal and intentional.
- **Fast**: For the volume of data a personal workout tracker generates (a few thousand records over a year), queries are essentially instant.

---

## Object Stores (The "Tables")

We need four stores. That's it.

### 1. `exercises` — The Exercise Library

This is your master list of every exercise you've ever created. It grows organically as you use the app.

```
{
  id:          "ex_abc123"       // Auto-generated unique ID
  name:        "Bench Press"     // Display name
  category:    "push"            // "push" | "pull" | "legs" | "core" | "cardio"
  type:        "reps"            // "reps" | "timed"
  note:        "Pinky on ring"   // Persistent form cue (optional)
  lastUsed:    "2026-02-20"      // Date of most recent use (YYYY-MM-DD)
  createdAt:   1708787200000     // Timestamp of creation
}
```

**Why each field exists:**
- `id`: Links sets back to this exercise. Never shown to the user.
- `name`: What you see in the exercise picker and day view.
- `category`: Powers the category tabs in the exercise picker (Push / Pull / Legs / etc.).
- `type`: Determines the input flow — reps get the rep picker, timed get the timer/duration picker.
- `note`: The persistent form cue that appears every time you select this exercise. "Keep elbows at 45°" or "Pause at bottom." Optional.
- `lastUsed`: Powers the "Recent" sort in the exercise picker. Updated every time you log a set for this exercise.
- `createdAt`: Housekeeping. Not shown to user.

**Indexes:**
- `by-lastUsed` — For the exercise picker's "Recent" sort (most recently used first)
- `by-category` — For filtering by Push/Pull/Legs/etc.
- `by-name` — For search-as-you-type filtering

---

### 2. `sets` — Every Set You've Ever Logged

This is the core data. Every single set — every time you tap a weight and a rep count — creates one record here. This is where the history lives.

```
{
  id:              "set_xyz789"      // Auto-generated unique ID
  date:            "2026-02-24"      // YYYY-MM-DD
  exerciseId:      "ex_abc123"       // Links to exercises store
  exerciseName:    "Bench Press"     // Denormalized for fast display
  exerciseOrder:   1                 // This exercise's position in today's workout (1st, 2nd, 3rd...)
  setOrder:        2                 // This set's position within the exercise (1st set, 2nd set...)
  weight:          155               // Number (lbs/kg) or null
  weightType:      "lbs"            // "lbs" | "kg" | "bodyweight" | "banded"
  reps:            8                 // Integer, or null for timed exercises
  duration:        null              // Seconds, or null for reps exercises
  createdAt:       1708787200000     // Timestamp
}
```

**Why each field exists:**
- `date`: The day this set belongs to. Primary grouping key for the day view.
- `exerciseId`: The link back to the exercise library. Used for history queries ("show me all Bench Press sets ever").
- `exerciseName`: Yes, this duplicates data from the exercises store. That's intentional. When rendering a day view with 15 sets across 5 exercises, we don't want to do 5 separate lookups into the exercises store. The name is right here. If you ever rename an exercise, we update both places.
- `exerciseOrder`: When you add Bench Press first and Cable Flyes second, Bench Press = 1, Cable Flyes = 2. This preserves the order you actually did things.
- `setOrder`: Within Bench Press, your first set = 1, second = 2, etc. Together with exerciseOrder, this gives us the complete sequence for the day.
- `weight` + `weightType`: Separated so we can handle numbers (155), bodyweight, and banded as distinct concepts. The UI shows "155 lbs" or "BW" or "Banded" based on weightType.
- `reps`: For reps-type exercises. Null for timed exercises.
- `duration`: For timed exercises, in seconds. Null for reps exercises. (Stored as seconds because math is easy; displayed as MM:SS in the UI.)
- `createdAt`: The actual timestamp of when this set was logged. Useful for edge cases (midnight boundary) and export ordering.

**Indexes:**
- `by-date` — For loading a day view: "give me all sets for Feb 24"
- `by-exerciseId` — For exercise history: "give me all Bench Press sets ever"
- `by-exerciseId-date` (compound) — For "last time" reference: "give me the most recent date where Bench Press was logged, then all sets from that date"
- `by-date-exerciseOrder-setOrder` (compound) — For rendering a day in the correct sequence

---

### 3. `dayNotes` — Daily Session Notes

One note per day. Free text.

```
{
  date:     "2026-02-24"                                  // YYYY-MM-DD (primary key)
  note:     "Slept poorly. Shoulder felt tight on press."  // Free text
}
```

This is the simplest store. The date IS the key — one note per day, period. If no note exists for a date, nothing renders. No empty records floating around.

**Indexes:** None needed. The date is the primary key, and we only ever look up one date at a time.

---

### 4. `templates` — Weekly Day Labels

Seven records maximum. One per day of the week.

```
{
  dayOfWeek:  1              // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  label:      "Push Day"     // Free text, or empty string for no label
}
```

This is almost trivially simple. When you open the app on a Monday, we look up `dayOfWeek: 1` and display the label at the top of the day view. That's the entire template system for v1.

**Indexes:** None needed. dayOfWeek is the primary key, and there are only 7 records.

---

## How the Stores Work Together

Here's how each user flow maps to database operations:

### Open the app (see today's workout)

```
1. Get today's date → "2026-02-24"
2. Query templates: dayOfWeek = 1 (Monday) → "Push Day"
3. Query sets: date = "2026-02-24", sort by exerciseOrder, setOrder
4. Query dayNotes: date = "2026-02-24"
5. Render: day label + exercises with sets + note preview
```

Three queries, all by primary key or single index. Instant.

### Log a set (tap weight → tap reps)

```
1. Determine exerciseOrder:
   - Query sets WHERE date = today AND exerciseId = selected exercise
   - If exists: use same exerciseOrder, setOrder = max + 1
   - If new: exerciseOrder = max exerciseOrder for today + 1, setOrder = 1
2. Create set record, write to sets store
3. Update exercises store: lastUsed = today
4. UI updates immediately (optimistic — write happens in background)
```

Two writes (one set, one exercise update). The UI doesn't wait for the write to complete — it updates instantly and the database catches up in milliseconds.

### Exercise picker (recent sort)

```
1. Query exercises: ordered by lastUsed DESC
2. For each exercise, show name + lastUsed date + set count from most recent session
```

The set count for the "last session" preview could be:
- Queried live (get sets WHERE exerciseId = X, date = lastUsed, count them)
- Or cached on the exercise record as a `lastSetCount` field

For v1, live query is fine — the exercise picker loads once and the queries are fast.

### "Last time" reference (before logging)

```
1. Query sets: exerciseId = "ex_abc123", ordered by date DESC
2. Take all sets from the most recent date
3. Display: "Last Session — Feb 20: Set 1: 135 × 10, Set 2: 155 × 8, Set 3: 155 × 7"
```

Single index query. Fast.

### Exercise history (full history for one exercise)

```
1. Query sets: exerciseId = "ex_abc123", ordered by date DESC
2. Group by date in code
3. Render each date as a row
```

Same query as "last time" but without limiting to the most recent date.

### Weekly overview

```
1. Calculate week boundaries (Mon–Sun or Sun–Sat)
2. Query sets: date BETWEEN "2026-02-17" AND "2026-02-23"
3. Group by date in code
4. Count unique exercises and total sets per day
```

Range query on the date index. Fast even with a year of data.

### Export to CSV

```
1. Query ALL sets, ordered by date, exerciseOrder, setOrder
2. Query ALL exercises (for canonical names and categories)
3. Query ALL dayNotes
4. Query templates
5. Format as CSV, trigger download
```

Full table scans — fine for export, which happens rarely.

### Delete a set

```
1. Delete the set record from sets store
2. Recompute setOrder for remaining sets of that exercise on that date
   (so set 1, 2, 3 doesn't become set 1, 3)
```

### Delete an exercise from today

```
1. Delete all set records WHERE date = today AND exerciseId = X
2. Recompute exerciseOrder for remaining exercises on that date
```

### Rename an exercise

```
1. Update exercises store: name = new name
2. Update all set records WHERE exerciseId = X: exerciseName = new name
```

Batch update on sets. For an exercise you've done 100 times with 3 sets each = 300 updates. Takes milliseconds.

---

## What About the Weight Picker's "Your Weights" Feature?

The smart weight picker needs to know "what weights has this user used for this exercise before?" This can be derived from the sets store at query time:

```
1. Query sets: exerciseId = "ex_abc123"
2. Extract unique weight values
3. Sort by frequency or recency
4. Display top 3-5 as "Your Weights" buttons
```

Alternatively, we could cache this on the exercise record:

```
{
  id:          "ex_abc123"
  name:        "Bench Press"
  ...
  recentWeights: [155, 135, 115]   // Cached for fast picker display
}
```

Recommendation: derive it live for v1 (simpler, no cache staleness issues). Optimize with caching later if needed.

---

## Data Volume Estimates

To make sure IndexedDB can handle this comfortably:

- **Per workout**: ~5 exercises × ~4 sets = 20 set records
- **Per week**: ~3.5 workouts × 20 = 70 set records
- **Per month**: ~280 set records
- **Per year**: ~3,360 set records
- **Exercise library**: 30-60 exercises after a year

IndexedDB comfortably handles millions of records. We're nowhere close to any limit. No compression, pagination, or archiving needed.

Each set record is roughly 200 bytes. A full year = ~650 KB. Trivial.

---

## Migration Path

If the data model needs to change in the future (new fields, restructured stores), IndexedDB supports versioning. When you update the database version, a migration function runs that can:
- Add new stores
- Add new indexes
- Transform existing records

This means we're not locked into this exact schema forever. But getting the core right now avoids painful migrations later — which is why we're doing this before writing code.

---

## Summary

| Store | Records after 1 year | Primary use |
|---|---|---|
| `exercises` | 30-60 | Exercise picker, categories, notes |
| `sets` | ~3,400 | Day view, history, "last time" reference |
| `dayNotes` | ~180 (if noting ~half of workout days) | Session context |
| `templates` | 7 (always) | Day labels |

Four stores. Simple, flat, fast. Everything the flows need, nothing they don't.
