# Duplicate Activity Problem Handoff

**Document status: Deprecated — 2026-07-31.** Do not use this as a prompt or as a
source of truth. It describes the activity model as "forming" and asks for a
duplicate-prevention design that has since been built; handing it to a model will
produce a design for a system that already exists.

Superseded by the 2026-07-31 entries under `## Decisions` in
[STATUS.md](../STATUS.md), which record the shipped duplicate rule, the grip
relevance model, and the modifier-vs-variant test. Remaining merge work is tracked
under `## Open → Duplicate merge flow` in the same file.

Retained for the reasoning in its "UX principles," "Unacceptable outcomes," and
"Important product nuance" sections, which still hold.

---

Original prompt below, for reference only.

Use this as the handoff prompt when a stronger model needs to solve duplicate prevention and duplicate merge in Tim's Logbook / Fit Logs.

## Prompt

You are working inside a single-file, local-first workout logger at `/Users/cubicleaf/Documents/Fitness-git/index.html`.

This app is phone-first, serverless, and IndexedDB-backed. It must stay extremely fast while logging in the gym. The app already has a layered activity direction forming:

- exact logged activity owns the real history
- families are organizational only
- one activity can belong to zero or one family
- linking/unlinking must be reversible and non-destructive

The problem you need to solve is duplicate activities.

### Why this matters

If the app creates or tolerates accidental duplicates, user trust collapses immediately. In this product, trust is not a nice-to-have. If the app misses obvious duplicates or offers unsafe merge behavior, users will stop using it.

### Current context

- Activities are created in `CreateExerciseModal`.
- There is already duplicate-check code in that modal, but it was previously disabled because it was noisy and not trustworthy enough.
- A settings toggle already exists for duplicate warnings (`skipDupWarning` preference).
- Similar-name detection currently uses simple normalization plus a heuristic score.
- There is currently no real merge flow for duplicate activities.
- Activity data is not just the activity name. It can include:
  - split/category assignments
  - type (`reps`, `timed`, `neutral`)
  - weight behavior / defaults
  - notes / form cues / quick notes
  - set history
  - family linkage / variation labels
  - grip tracking

### Core product requirement

Prevent accidental duplicates early, but never trap the user in a rigid taxonomy or a destructive merge.

### Desired outcome

Design and implement a duplicate system with two layers:

1. **Duplicate prevention during activity creation**
   - When the user types a new activity name, the app should surface obvious likely matches.
   - This must be high-confidence and calm, not spammy.
   - If a true match exists, the user should be able to use the existing activity instead of making a new one.
   - If the new name is legitimately a separate activity, the user must be able to continue without friction.

2. **Duplicate resolution after the fact**
   - If two duplicate activities already exist, the user needs a painless merge path.
   - This should likely live somewhere the user naturally sees the collision, probably in activity search / creation or in an activity-management surface.
   - The merge flow must be non-destructive in spirit, or at minimum feel extremely safe and explicit.

### Hard constraints

- Single HTML file app. No server. No account. No cloud reconciliation.
- IndexedDB is the source of truth.
- Phone-first interaction. No admin-dashboard assumptions.
- The app must remain fast enough to use between sets.
- The user must never feel that organization features are mutating history unpredictably.

### Duplicate prevention requirements

- Exact normalized matches must always be caught.
  - Example: `Bench Press` vs `bench press`
  - Example: punctuation and spacing variants
- Near-obvious human duplicates should also be caught when confidence is high.
  - Example: pluralization or tiny wording differences
  - Example: `Pullup`, `Pull-up`, `Pull Up`
- The system must avoid false positives that block legitimate distinct activities.
  - Example: `Incline Dumbbell Row` should not be collapsed into `Dumbbell Row`
  - Example: variants that genuinely need separate history should remain separate
- If exact matches exist, weaker fuzzy suggestions should not clutter the UI.

### Merge requirements

Design a safe merge model for two activities that are actually the same thing.

Questions you must resolve:

- Where does the merge action live?
- What exactly gets merged?
- What happens if settings differ between the two activities?
- What happens to:
  - sets
  - notes
  - quick notes
  - form cues
  - split/category data
  - family linkage
  - grip tracking settings
  - weight defaults / weight meaning
- What should the app do if records conflict?

### Suggested merge philosophy

Do not assume merge is always safe just because names are similar.

Likely needed:

- a **high-confidence fast path** when two activities are functionally identical
- a **review path** when fields conflict
- a **cancel / back out path**
- a clear statement that history will be preserved, not erased

### UX principles

- The safest behavior is the default.
- The fastest path should exist only when confidence is high.
- The app should feel helpful, not paternalistic.
- If uncertainty is high, surface it clearly instead of pretending confidence.
- Avoid modal mazes.

### Unacceptable outcomes

- Missing obvious duplicates
- Overzealous fuzzy matching that pressures the user away from legitimate new activities
- Merge behavior that silently rewrites or discards history
- Taxonomy logic that treats variants as duplicates by default
- A scary or bureaucratic merge flow that no one will use

### What I want from you

Produce:

1. A concrete duplicate-prevention strategy
2. A concrete duplicate-merge strategy
3. A data-migration / data-safety plan
4. UI placement recommendations
5. Confidence rules for when to suggest:
   - use existing
   - create variant
   - create truly new
   - merge duplicates
6. Edge cases and failure modes
7. An implementation plan grounded in this actual app structure

### Important product nuance

This app is not a generic exercise catalog. It is a personal logging tool where exact history matters. That means:

- `duplicate` and `variant` are not the same thing
- `family` and `duplicate` are not the same thing
- preserving the user's confidence in history integrity matters more than aggressive cleanup

If you have to choose, bias toward preserving trust over maximizing cleverness.
