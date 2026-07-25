# Grip Qualifier Implementation Spec

## Purpose

This spec defines the first real implementation slice of the broader activity model:

- `movementFamily`
- `trackedActivity`
- `qualifiers`
- `notes`

The first qualifier family to build is `grip`.

This is not a full taxonomy system. It is a narrow, practical rollout intended to prove that:

- related movement context can be captured without bloating activity names
- logging can stay fast
- activity history can become more honest without becoming more annoying

## Why Grip First

Grip is a good pilot because it sits in the exact middle of the current modeling problem:

- it matters more than a casual note
- it usually does not deserve a separate activity
- it is easy to imagine in the UI
- it exposes whether qualifiers can exist without harming the core logging loop

Example:

- `Lat Pulldown` remains the tracked activity
- `Neutral` and `Wide` become qualifiers on the logged set/session

The app should be able to show:

- this was a `Lat Pulldown`
- on this date it was `Neutral` + `Wide`
- without renaming the activity to `Wide Neutral Grip Lat Pulldown`

## Scope

This spec covers:

- user-facing flow
- activity-level configuration
- logging-time qualifier selection
- set/history display
- data model additions
- rollout strategy

This spec does not yet build:

- automatic movement-family inference
- a full variation/family browser
- tempo or stance qualifiers
- AI suggestions
- a universal exercise ontology

## Core Model

### Existing Reality

Today the app mostly treats each activity as a flat named object with:

- type
- weight style
- weight mode
- categories
- history

That is simple, but it is starting to fail when the user wants to preserve more nuance.

### New Layer

Each tracked activity remains the main logged object.

We add optional qualifier support to the activity and to the logged set/session.

Conceptually:

```json
{
  "trackedActivity": "Lat Pulldown",
  "movementFamily": "Pulldown",
  "qualifierConfig": {
    "grip": {
      "enabled": true
    }
  }
}
```

And at log time:

```json
{
  "activity": "Lat Pulldown",
  "qualifiers": {
    "gripType": "neutral",
    "gripWidth": "wide"
  }
}
```

## UX Principles

These rules should govern the whole implementation:

- The app must never feel like a taxonomy homework assignment.
- Grip tracking is always optional.
- Grip tracking is enabled per activity, not globally by default.
- The app should under-prompt rather than over-prompt.
- Logging speed is more important than modeling completeness.
- The user should be able to skip grip for a given set without disabling the feature entirely.

## User-Facing Flow

## 1. Activity Creation

### Current Problem

If grip exists, the app should not ask about it for everything.

Asking about grip on `Run`, `Sauna`, `Stretching`, or neutral note-only activities would feel absurd.

### First-Version Rule

Show a quiet grip-tracking section during activity creation only for likely grip-relevant activities.

### Creation UI

In `New Activity`, after the core activity setup:

- `Track grip for this activity?`
- description text:
  - `Optional. Useful for pulldowns, rows, pull-ups, curls, and similar movements.`

Control:

- `Off`
- `On`

This should not be required.

If the user ignores it, the activity works exactly as it does now.

### Creation Behavior

- If `Off`, no grip prompt appears during logging.
- If `On`, grip prompt appears before weight for that activity.

## 2. Activity Edit

Grip tracking must also be editable after creation.

### Edit Surface

In the activity `Edit` view, add:

- `Track Grip`

Possible UI:

- `Off`
- `On`

Why this matters:

- a user may start with plain pull-ups and later care about grip
- a user may enable it, try it, and decide it is not worth the friction

This cannot be creation-only.

## 3. Logging Flow

### Trigger

If an activity has grip tracking enabled, the logging flow becomes:

1. qualifier step: grip
2. weight step
3. reps or duration

If grip tracking is disabled, the flow stays unchanged.

### Grip Modal

The first version should be a lightweight full-screen modal or screen, but simpler than weight selection.

It should contain two rows.

#### Row 1: Grip Type

- `Pronated`
- `Supinated`
- `Neutral`
- `Skip`

#### Row 2: Width / Style

- `Close`
- `Standard`
- `Wide`
- `V-grip`
- `Skip`

### Important Interpretation of Skip

`Skip` means:

- do not record that qualifier for this set
- continue logging normally

It does not mean:

- disable grip tracking for the whole activity
- fake a value like `none`

### Optional Nice Behavior

If the user logged grip values last set for the same activity on the same day, the app may:

- pre-highlight the previous choices

But it should not auto-lock them in without a visible path to change.

## 4. Display in the Daily Log

Grip should not rename the activity.

`Lat Pulldown` stays `Lat Pulldown`.

The qualifier should appear as compact chips or labels attached to the set display.

Example:

- `110lbs × 10`
- chips below or beside it:
  - `Neutral`
  - `Wide`

Alternative compact display:

- `110lbs × 10`
- `Neutral · Wide`

The key rule is:

- visible enough to matter
- not dominant enough to hijack the activity title

## 5. History View

Grip should be visible in history at the set/session level when present.

Example history row:

- `110lbs × 10`
- `Neutral · Wide`

If absent, the history should simply omit qualifier text instead of showing placeholder noise.

## 6. Notes Relationship

Grip should not replace notes.

Notes remain for:

- straps
- tempo
- pause reps
- ROM notes
- machine quirks
- anything else too messy to formalize

The qualifier system should reduce note clutter, not abolish notes.

## Relevance Filter

## Why a Filter Exists

Grip should not be offered for obviously irrelevant activities.

But it also should not depend on a giant perfect classification engine.

## First-Version Strategy

Use a conservative allowlist for showing the `Track grip` option in activity creation/edit.

### Likely Relevant Terms

- `pulldown`
- `pullup`
- `chinup`
- `row`
- `curl`
- `grip`
- maybe later `press` in select cases

### Obvious No-Cases

- note-only / neutral activities
- `run`
- `sauna`
- most timed cardio
- `walk`
- `stretch`
- `mobility`

## Philosophy

It is better to miss some relevant activities than to annoy users with silly prompts.

## Data Model

## Activity-Level Additions

Add optional qualifier config to the activity record.

Conceptual shape:

```json
{
  "id": "ex_123",
  "name": "Lat Pulldown",
  "movementFamily": "Pulldown",
  "qualifierConfig": {
    "grip": {
      "enabled": true
    }
  }
}
```

### Minimum First-Version Fields

- `movementFamily` nullable string
- `qualifierConfig` object
- `qualifierConfig.grip.enabled` boolean

Family can remain unset for many activities in v1.

## Set-Level Additions

Grip matters at log time, so it should live on the logged set/session object.

Conceptual shape:

```json
{
  "id": "set_123",
  "exerciseId": "ex_123",
  "weight": 110,
  "reps": 10,
  "qualifiers": {
    "gripType": "neutral",
    "gripWidth": "wide"
  }
}
```

### Minimum First-Version Fields

- `qualifiers` object optional
- `qualifiers.gripType`
- `qualifiers.gripWidth`

Accepted values:

- `pronated`
- `supinated`
- `neutral`
- `close`
- `standard`
- `wide`
- `v-grip`

### Why Store on Sets Instead of Only Activity

Because grip can change between sessions and sometimes between sets.

It is logging context, not a permanent property of the activity.

## Migration

This can be added safely without breaking old data.

### Existing Activities

- default `movementFamily = null`
- default `qualifierConfig = {}`

### Existing Sets

- default `qualifiers = undefined`

Old entries remain valid and simply show no qualifier data.

## UI Surfaces To Touch

## Required

- `CreateExerciseModal`
- activity edit modal / activity context edit section
- logging flow controller between activity select and weight picker
- daily set rendering
- history rendering

## Probably Needed

- settings explanation copy
- export format updates later

## Not Needed Yet

- global grip dashboard
- AI inference
- family browser

## Suggested Interaction Details

## Copy

Creation/edit copy should be plain:

- `Track grip for this activity?`
- `Useful when hand placement changes the lift, but you don't want separate activity names.`

Logging copy should stay short:

- `Grip Type`
- `Grip Width`

## Buttons

Do not use `None`.

Use:

- `Skip`

Reason:

`None` sounds like a real grip value.
`Skip` clearly means "move on without recording this."

## Carry-Forward Behavior

Recommended first version:

- remember the last selected grip values while the modal is open
- optionally prefill last-used values for the same activity
- but do not auto-save unseen defaults

## Risks

### Risk 1: Too Much Friction

If grip is enabled on too many activities, the app becomes slower to use.

Mitigation:

- conservative relevance filter
- per-activity opt-in
- per-set skip button

### Risk 2: Users Expect Every Qualifier Next

Once grip exists, users may expect stance, tempo, handle, and others immediately.

Mitigation:

- explicitly frame grip as the pilot
- do not generalize the UI too early

### Risk 3: Display Clutter

Qualifier chips could make set pills visually noisy.

Mitigation:

- keep chips small
- do not modify activity titles
- only show when values exist

## Success Criteria

This feature is successful if:

- users can log `wide neutral grip pulldown` without renaming the activity
- the daily log stays readable
- the weight flow does not feel meaningfully slower for non-grip activities
- history becomes more informative without multiplying activity names

## What Comes After Grip If This Works

Only after grip proves its value should the model expand.

Possible next steps:

- movement family linking UI
- family view
- variation creation flow
- second qualifier family such as stance or handle

But those should wait until grip proves that qualifiers actually improve the app without poisoning the core loop.

## Recommendation

Build this in two phases.

### Phase 1

- add underlying model fields
- add activity-level `Track grip`
- add pre-weight grip modal
- display grip in history and daily set view

### Phase 2

- add movement-family linkage
- add family browsing / family summary view
- keep separate tracked activities intact

This preserves the right order:

1. model
2. one qualifier family
3. broader relationship system later
