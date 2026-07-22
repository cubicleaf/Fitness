# LBs vs KGs: Unit Switching Analysis

## The Current State

Right now, your app stores weight data in two separate fields on every logged set:

- **`weight`** — a raw number (e.g., `135`)
- **`weightType`** — a string like `'lbs'`, `'kg'`, `'bodyweight'`, or `'banded'`

The global unit toggle (in Settings) is stored separately as a preference (`__unit__` in dayNotes). When you pick the toggle, it does two things:

1. Changes which weight options appear in the WeightPickerModal (lbs list vs kg list)
2. Changes the unit label shown next to numbers in the daily view via `formatSetBox()`

The key issue: **the `weightType` is baked into each individual set at the time of logging.** So if you logged 135 lbs on Monday and switch to kg on Tuesday, those Monday sets still say `weightType: 'lbs'` in the database.

## What Actually Happens When You Toggle

Right now, `formatSetBox()` takes the global `unit` setting and uses it as a display override. So if you switch from lbs to kg:

- Monday's set (weight: 135, weightType: 'lbs') would **display as "135 kg"**
- This is wrong — 135 lbs is not 135 kg

The display function doesn't convert; it just swaps the label. This means toggling the unit creates a **silent lie** in the UI.

## The Core Tension

There are three possible architectures, each with tradeoffs:

### Option A: Display-Only Toggle (Cosmetic)

**How it works:** The toggle converts all displayed weights mathematically (lbs x 0.453592 = kg). Stored data never changes. Every weight is always stored as whatever unit was active when logged.

**Pros:**
- No data migration needed
- Zero risk of data corruption
- Existing sets keep their original precision

**Cons:**
- Converted numbers look ugly (135 lbs → 61.235 kg)
- Confusing if you log some sets in lbs and some in kg — mixed units in history
- The WeightPickerModal's quick-pick buttons would need to show converted values

**Work estimate:** Small — add a conversion function to `formatSetBox()` and the weight display areas. Maybe 15-20 lines of logic.

### Option B: Convert on Toggle (Destructive Migration)

**How it works:** When user flips the toggle, ALL existing weight values in every set get mathematically converted and the `weightType` field gets updated.

**Pros:**
- Clean, consistent data after conversion
- All historical data in one unit system

**Cons:**
- **Precision loss** — 135 lbs → 61.235 kg → if they switch back → 135.00017 lbs (floating point drift)
- **Irreversible data modification** — if something goes wrong, original values are gone
- Slow on large datasets (loop through every set in IndexedDB)
- Bodyweight and banded sets need special handling (don't convert those)
- **Barbell math breaks** — plates are standardized in each system (45 lb plates vs 20 kg plates). Converting plate totals creates nonsensical numbers.

**Work estimate:** Medium — need a migration function, confirmation dialog, progress indicator, and special handling for bodyweight/banded. Around 40-60 lines.

### Option C: Dual-Track Storage (Best of Both Worlds)

**How it works:** Store weight in BOTH units on every set. Each set gets `weightLbs` and `weightKg` fields. The toggle just switches which field is displayed. New sets calculate both at log time.

**Pros:**
- No precision loss on toggle
- Instant switching, zero conversion needed
- Historical data preserved in original precision
- Can always show "135 lbs (61.2 kg)" if desired

**Cons:**
- Requires a one-time data migration to backfill the missing field on existing sets
- Doubles the weight storage (negligible for IndexedDB)
- Slightly more complex set creation code
- Still has the barbell plate display issue (plate calculator needs to use native unit plates)

**Work estimate:** Medium-large — migration function, update set creation in 3+ handlers, update formatSetBox, update WeightPickerModal. Around 50-80 lines.

## My Recommendation

**Option A (Display-Only) with smart rounding** is the pragmatic choice.

Here's why: you're building a personal fitness tracker, not a competition platform. The number "61.2 kg" next to a set you logged as 135 lbs is good enough for tracking purposes. The key insight is that most users either use lbs OR kg consistently — they rarely switch back and forth. The toggle is more of a one-time preference than a daily action.

The implementation would:
- Keep all data exactly as-is
- Add a `convertWeight(value, fromUnit, toUnit)` function
- When displaying, check: if `set.weightType` differs from global `unit`, convert and round to 1 decimal
- In the WeightPickerModal, always log new sets in the current global unit
- Show a small indicator when a displayed value was converted (e.g., slightly different text color or a "~" prefix)

If you ever want to upgrade to Option C later, you can — it's non-breaking and additive.

## One More Thing

The barbell plate calculator in WeightPickerModal already handles units correctly — it shows 45 lb plates when in lbs mode and 20 kg plates in kg mode. This is actually the right behavior and doesn't need changing. Where plates matter (barbell exercises), the user should be logging in whichever unit their gym's plates use.

## Summary

| Approach | Data Risk | Work | Precision | UX |
|----------|-----------|------|-----------|-----|
| A: Display-Only | None | Small | Slight rounding | Good enough |
| B: Convert All | High | Medium | Floating point drift | Clean but risky |
| C: Dual-Track | Low | Medium-Large | Perfect | Best long-term |

My vote: Start with A. Graduate to C if the rounding bothers you.
