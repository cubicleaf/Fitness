# Activity Model Eval Spec

## Purpose

This spec defines an alternative modeling system for Tim's Logbook to evaluate before building more special-case UI around grip, variations, angles, handles, and similar details.

The goal is not to build a giant taxonomy engine immediately. The goal is to decide whether the app should keep treating activities as mostly flat names, or whether it should adopt a more explicit structure that separates:

- the thing being trained
- the specific tracked version of it
- the optional context that may matter sometimes
- the messy details that should stay as notes

## Problem

The app is already running into repeated classification pressure:

- `Incline` vs `flat` vs `decline`
- `Barbell` vs `dumbbell` vs `cable` vs `band`
- `Pronated` vs `supinated` vs `neutral`
- `Wide` vs `close` vs `V-grip`
- possible future details like stance, handle, unilateral/bilateral, seat setting, or tempo

If all of these become part of the activity name, history becomes fragmented and activity creation becomes homework.

If none of them are modeled, "last time" becomes muddy and meaningful differences get lost.

This spec evaluates a layered model that aims to preserve both:

- honest progression history
- low-friction logging

## Core Idea

Treat exercise identity as four layers:

1. `Movement family`
2. `Tracked activity`
3. `Qualifier`
4. `Note`

### 1. Movement Family

A broad bucket for related movements.

Examples:

- `Bench Press`
- `Row`
- `Pulldown`
- `Pull-up`
- `Curl`
- `Squat`
- `Hinge`
- `Sauna`
- `Run`

This layer is mainly for organization, continuity, and future recommendation logic. It is not the thing that gets logged set-to-set.

### 2. Tracked Activity

The specific version that deserves its own progression history and its own honest "last time."

Examples:

- `Flat Barbell Bench Press`
- `Incline Dumbbell Press`
- `Decline Dumbbell Press`
- `Cable Row`
- `Chest-Supported Row`
- `Pull-up`
- `Chin-up`

This is the main activity object the user creates and sees in the daily log.

### 3. Qualifier

Optional metadata that may matter for a specific session or set, but usually should not split the activity into a separate history line.

Examples:

- grip type: `pronated`, `supinated`, `neutral`
- grip width/style: `close`, `standard`, `wide`, `V-grip`
- stance: `narrow`, `standard`, `wide`
- handle style
- maybe later unilateral/bilateral, seat setting, foot position

Qualifiers are optional, activity-specific, and should be invisible unless the user chooses to track them.

### 4. Note

Irregular, subjective, annoying, or too context-heavy to formalize.

Examples:

- tempo
- pause reps
- straps
- partial ROM
- dead stop
- "felt weak"
- "machine felt off"

Notes remain the pressure-release valve when structure would cost more than it gives back.

## Decision Rule

The model should follow one simple boundary:

- If changing the detail makes "last time" misleading, it should usually become a separate `tracked activity`.
- If changing the detail is useful context but the main progression line should stay shared, it should usually become a `qualifier`.
- If the detail is messy, rare, subjective, or inconsistent, it should stay a `note`.

## Worked Examples

### Separate Tracked Activities

These usually deserve separate history:

- `Flat Barbell Bench Press`
- `Incline Barbell Bench Press`
- `Decline Barbell Bench Press`
- `Flat Dumbbell Press`
- `Incline Dumbbell Press`
- `Cable Chest Press`
- `Pull-up`
- `Chin-up`
- `Cable Row`
- `Dumbbell Row`
- `Chest-Supported Row`

Reason:
The load, muscle emphasis, and progression can differ enough that one shared "last time" is not honest.

### Qualifiers

These usually stay attached to the same tracked activity:

- `Lat Pulldown` with `pronated`
- `Lat Pulldown` with `neutral`
- `Lat Pulldown` with `wide`
- `Cable Row` with `V-grip`
- `Cable Row` with `close`

Reason:
The movement is still recognizably the same tracked activity, but the context may matter enough to preserve as optional metadata.

### Notes

These should usually stay informal:

- `3-second eccentric`
- `paused at bottom`
- `used straps`
- `slight cheat reps`
- `machine seat at 6`

Reason:
They matter sometimes, but forcing them into structured logging would create too much friction.

## Why This Model Is Worth Evaluating

### Benefits

- Preserves clean progression history without exploding every activity into dozens of names.
- Gives a clear home for grip without pretending grip always deserves a separate activity.
- Leaves room for a future variation system without forcing it now.
- Supports future recommendation and movement-family views if wanted later.
- Keeps notes useful by reserving them for things that should stay messy.

### Risks

- Too much structure too early can slow down logging and make activity creation feel academic.
- Any auto-detection of family, variation, or qualifier relevance will be imperfect.
- Users may disagree with the model in specific cases, especially where language already implies a different movement name, such as `chin-up`.
- If surfaced poorly, qualifiers can become annoying modal spam.

## Comparison With Simpler Current Model

### Current Implicit Model

- Activity name carries most meaning.
- Notes absorb everything else.
- Split/category is lightweight metadata.

### Proposed Layered Model

- `Tracked activity` remains the main log object.
- `Movement family` organizes related activities.
- `Qualifiers` hold optional structured context.
- `Notes` stay as a fallback for messy details.

### Tradeoff

The current model is simpler and faster to ship.

The layered model is more honest and scalable, but only if the UI stays restrained and most of the structure remains optional.

## Product Principles For This Model

If this model is adopted, these rules should hold:

- Logging speed stays primary.
- No universal qualifier prompt should appear for every activity.
- The user should never be forced to classify edge cases while logging a set.
- Qualifier tracking must be opt-in per activity.
- The app should prefer under-modeling to over-interrupting.

## First Evaluation Slice

Do not build the whole model at once.

Evaluate it through one narrow slice: `grip` as the first qualifier family.

### Grip Pilot Rules

- Grip tracking is optional per activity.
- It should only be offered for likely relevant activities.
- If enabled, it appears before weight only for that activity.
- It must always be skippable for that set.
- It must be easy to disable again.

### Likely Relevant Activities

Start conservative:

- pulldowns
- pull-ups / chin-ups
- rows
- curls
- possibly a narrow set of presses later

### Obvious Non-Cases

Do not ask for grip on:

- neutral / note-only activities
- runs
- sauna
- cardio
- stretching
- most timed activities

## What This Model Explicitly Does Not Solve Yet

- Full automatic variation detection
- A universal exercise ontology
- Perfect family assignments
- Tempo as structured data
- Whether qualifiers should be stored per set or per session for every future case

This is an evaluation model, not a promise to fully systematize all exercise nuance now.

## Recommended Data Shape

This is conceptual, not final code.

```json
{
  "movementFamily": "Bench Press",
  "trackedActivity": "Incline Dumbbell Press",
  "qualifiers": {
    "gripType": null,
    "gripWidth": null
  },
  "notes": []
}
```

For a grip-relevant case:

```json
{
  "movementFamily": "Pulldown",
  "trackedActivity": "Lat Pulldown",
  "qualifiers": {
    "gripType": "neutral",
    "gripWidth": "wide"
  },
  "notes": []
}
```

For a messy case:

```json
{
  "movementFamily": "Bench Press",
  "trackedActivity": "Flat Barbell Bench Press",
  "qualifiers": {},
  "notes": [
    "3-second eccentric",
    "paused first rep"
  ]
}
```

## Questions To Evaluate

Before building against this model, answer these:

1. Does the app need explicit `movement family` now, or can that wait while `tracked activity` and `qualifier` are introduced first?
2. Should qualifiers attach to each set, each session, or be selectable per log event with carry-forward behavior?
3. Is grip the only qualifier family worth piloting now, or is there a second equally important qualifier family?
4. Should a tracked activity be allowed to exist without any family linkage in v1 of the model?
5. Does the user benefit more from hidden structure or visible organizational surfaces?

## Recommendation

Adopt this as the evaluation model, but not as a full immediate implementation mandate.

Practical recommendation:

- Keep creating separate tracked activities for major variations now.
- Treat `incline/flat/decline` and `dumbbell/cable/barbell/band` as tracked-activity differences.
- Keep grip as the first candidate `qualifier`.
- Keep tempo in notes.
- Build only the grip pilot first if and when the UI flow feels worth the interruption cost.

## Success Criteria

This model is worth pursuing only if it improves at least one of these without noticeably harming logging speed:

- "Last time" becomes more trustworthy.
- Users can preserve important distinctions without inventing endless activity names.
- The app becomes more organized without feeling like data entry.
- The qualifier pilot can be enabled only where it feels genuinely useful.
