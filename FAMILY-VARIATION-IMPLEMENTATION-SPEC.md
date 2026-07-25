# Family and Variation Implementation Spec

## Purpose

This spec defines how Tim's Logbook should evolve from a mostly flat activity model into a structured system that supports:

- separate tracked activities with their own presets and history
- links between related activities
- family-level views across those related activities
- future qualifier support without activity-name chaos

This is the larger architectural spec that sits above the narrower grip pilot.

## Problem

The current app treats activities mostly as isolated named objects.

That works until the user wants both of these at the same time:

- separate history and presets for materially different versions of a movement
- a holistic view across related versions of the same movement

Examples:

- `Cable Row`
- `Chest-Supported Row`
- `1-Arm Dumbbell Row`
- `Machine Row`

These should not share:

- last time
- weight mode
- weight style
- presets
- per-activity edits

But they should still be viewable as related, so the user can understand total row exposure and movement continuity.

The same problem appears with:

- `Flat Barbell Bench Press`
- `Incline Dumbbell Press`
- `Decline Dumbbell Press`

And with bodyweight/weighted evolution:

- `Pull-up`
- `Weighted Pull-up`
- `Assisted Pull-up`

The model needs to preserve each as its own tracked thing without losing their relationship.

## Core Model

This spec assumes four conceptual layers:

1. `movementFamily`
2. `trackedActivity`
3. `qualifier`
4. `note`

This implementation spec mainly focuses on the first two.

### Movement Family

A broad grouping layer for related tracked activities.

Examples:

- `Row`
- `Pulldown`
- `Pull-up`
- `Bench Press`
- `Run`
- `Sauna`

Movement families are primarily for:

- organization
- family-level viewing
- future recommendation or summary logic

They are not the thing being logged directly.

### Tracked Activity

The actual loggable object with its own:

- name
- type
- weight mode
- weight style
- presets
- notes
- history
- last time

Examples:

- `Cable Row`
- `1-Arm Dumbbell Row`
- `Incline Dumbbell Press`
- `Weighted Pull-up`

Every tracked activity can optionally belong to one movement family.

### Qualifier

Optional structured context that usually should not split a tracked activity into its own history line.

Example:

- `Neutral`
- `Wide`

Grip belongs here, not at the family or variation layer.

### Note

Anything irregular or too annoying to formalize.

Examples:

- tempo
- straps
- machine felt weird
- partial ROM

## Main Product Rule

The app should answer two different questions cleanly:

- `What exactly did I do last time on this specific variation?`
- `How much have I been doing this broader movement family overall?`

If the model cannot answer both without muddying one of them, it is wrong.

## Product Rules

### 1. Variations Are Real Tracked Activities

Variations should not be implemented as lightweight notes stuck onto one base activity.

If something deserves its own:

- presets
- last time
- weight behavior
- history line

then it should be its own tracked activity.

Examples:

- `Cable Row`
- `Machine Row`
- `1-Arm Dumbbell Row`

### 2. Families Link Activities, They Do Not Merge Them

A family relationship should never merge:

- set history
- last time
- presets
- weight style
- weight mode
- edit state

Family is for grouping and viewing, not for collapsing.

### 3. Editing Weight Behavior Must Stay Activity-Local

The user must be able to change weight mode or weight style for a tracked activity without affecting sibling variations.

Example:

- `Run` may be bodyweight
- `Weighted Vest Run` may be weighted

Both can belong to a broader family, but their weight behavior remains separate.

### 4. The App Must Support Late Structuring

Users should be able to start flat and organize later.

That means:

- they can create `Cable Row` without first declaring a family
- later they can link it to `Row`
- later still they can link `1-Arm Dumbbell Row` to the same family

The system must tolerate under-structured beginnings.

## Data Model

## Existing Activity Record

The tracked activity remains the core stored object.

### Additions

Add these optional fields to the activity record:

```json
{
  "movementFamilyId": "fam_row",
  "variationLabel": "Cable",
  "variationMeta": {
    "implements": ["cable"],
    "angle": null,
    "posture": null
  }
}
```

### Minimum First-Version Fields

- `movementFamilyId` nullable string
- `variationLabel` nullable string

The extra `variationMeta` object is optional for later growth. It should not block v1.

## New Movement Family Record

Add a new store or equivalent model for families.

Example:

```json
{
  "id": "fam_row",
  "name": "Row",
  "createdAt": 1784970000000
}
```

### Minimum Family Fields

- `id`
- `name`
- `createdAt`

That is enough for v1.

## Set Records

Set records should continue to point only to the tracked activity.

They do not need direct family linkage because family can be resolved through the activity.

This is important because:

- family should not rewrite history storage
- activity remains the true unit of progression

## User-Facing Flows

## 1. Create Activity

### Current State

The user creates a single activity and chooses:

- name
- split
- type
- weight style
- weight mode

### First Structured Version

Do not force family creation during ordinary new-activity flow.

That would be too much up-front friction.

Instead:

- allow activity creation exactly as now
- optionally offer `Link to movement family` if the user wants
- optionally offer `Create as a variation of...` later in the same screen or in edit

### Recommendation

In v1, keep creation simple and add structure mainly through edit and family-link actions later.

## 2. Edit Activity

This is the main place where the user should be able to organize the system after the fact.

### Required Edit Actions

- `Rename`
- `Change Weight Mode`
- `Change Weight Style`
- `Link to Family`
- `Move to Different Family`
- `Remove from Family`
- `Create Variation`

### Why Edit Matters More Than Creation

Because many users do not know the full taxonomy at the moment they create the activity.

The app should support:

- creating quickly
- organizing intelligently later

## 3. Create Variation

This is the most important new behavior.

### Goal

From an existing activity, the user should be able to create a sibling tracked activity that:

- inherits the family link
- starts as its own separate tracked activity
- can have its own presets and weight behavior

### Example

Starting from:

- `Cable Row`

User chooses:

- `Create Variation`

Then makes:

- `1-Arm Dumbbell Row`

The new activity should:

- keep separate presets
- keep separate history
- automatically join the same family if the source already has one

### What It Should Not Do

It should not:

- share last time
- share weight mode
- auto-copy future changes
- merge histories

## 4. Family Linking

### User Need

Sometimes the user has already created multiple activities separately and only later realizes they belong together.

Example:

- `Cable Row`
- `Dumbbell Row`
- `Chest-Supported Row`

### Required Action

The user needs a way to:

- pick an activity
- choose `Link to Family`
- either select an existing family or create a new one

### Practical UI

In `Edit`, add:

- `Movement Family`
  - `None`
  - existing family picker
  - `Create New Family`

## 5. Family View

This is the payoff surface.

### Goal

From any tracked activity, the user should be able to see all sibling activities in the same family.

Example:

User opens:

- `Cable Row`

Taps:

- `View Family`

Sees:

- `Cable Row`
- `1-Arm Dumbbell Row`
- `Chest-Supported Row`
- `Machine Row`

### What Family View Should Show

At minimum:

- activity names
- recent usage date
- last set snapshot or summary
- maybe set count / session count in recent window

### What Family View Must Not Do

It must not imply:

- shared presets
- merged histories
- interchangeable last-time data

It is a relationship view, not a single activity detail view.

## 6. Weight Mode and Weight Style Changes

This should be activity-local and easy.

### Problem Being Solved

A user may start with:

- `Run` as bodyweight
- `Pull-up` as bodyweight

And later want:

- weighted vest running
- weighted pull-ups
- machine-assisted pull-ups

### Rule

If the user wants the same tracked activity to change weight behavior, allow that through edit.

If the user wants separate honest progression histories, they should create a variation instead.

### Recommended Edit Options

- `Weight Mode`
  - `Weight`
  - `Bodyweight`
  - `No Weight`

- `Weight Style`
  - `Total`
  - `Per Side`
  - `Bar`

Shown only where relevant.

### Product Boundary

Changing weight behavior should be easy.
Choosing between `edit activity` and `create variation` is the real conceptual fork.

## Decision Rule for Users

The app should eventually teach this cleanly:

- If you want one shared progression line, edit the activity.
- If you want separate presets/history, create a variation.
- If they are related but separate, link them by family.

That is the core mental model.

## Migration From Flat Activities

## Principle

Old activity data must remain valid exactly as it is.

### Existing Activities

Default migration:

- `movementFamilyId = null`
- `variationLabel = null`

### Existing Sets

No migration needed beyond continuing to resolve through activity id.

### User Experience

Nothing should break for users who never use families or variations.

The system should feel additive, not compulsory.

## Suggested Rollout

## Phase 1: Model and Edit Foundations

Build:

- family data store
- optional `movementFamilyId` on activities
- activity edit controls for:
  - weight mode
  - weight style
  - family link/unlink

Do not build fancy family browsing yet.

### Why

This solves the immediate pain:

- changing weight behavior later
- linking activities without merging them

## Phase 2: Variation Creation

Build:

- `Create Variation` flow
- inherit family link from parent when present
- keep presets/history separate

### Why

This is the first truly useful structured authoring behavior.

## Phase 3: Family View

Build:

- `View Family`
- family sibling list
- recent usage / summary

### Why

This is the actual holistic lens the user wants.

## Phase 4: Qualifier Integration

Build:

- grip qualifier pilot on top of this structure

### Why

Qualifiers make more sense once the app already distinguishes:

- sibling variations
- shared families

## Important Non-Goals

This spec does not recommend building:

- auto-generated family trees
- universal exercise ontology
- forced prompts for every relationship
- automatic merging of duplicate-looking activities
- AI as the core organizing layer

Those would overcomplicate the system too early.

## Risks

### Risk 1: Too Much Structure

Users may feel they need to perfectly classify every activity.

Mitigation:

- keep all family linking optional
- keep creation fast
- support late organization

### Risk 2: Family View Becomes Confusing

Users may think family view implies shared progression.

Mitigation:

- clear copy
- always keep sibling activities visually separate

### Risk 3: Edit vs Variation Confusion

Users may not know whether to mutate an activity or create a sibling.

Mitigation:

- teach the rule:
  - one history line -> edit
  - separate history line -> variation

### Risk 4: Over-Indexing on Naming

If naming conventions are weak, family structures may become inconsistent.

Mitigation:

- allow user control
- do not require perfect naming to benefit

## Example Scenarios

## Scenario A: Rows

User has:

- `Cable Row`
- `Chest-Supported Row`
- `1-Arm Dumbbell Row`

They link all three to:

- `Row`

Result:

- each keeps its own presets/history
- family view shows row variety and frequency

## Scenario B: Pull-Ups

User starts with:

- `Pull-up`

Later wants:

- `Weighted Pull-up`

Recommendation:

- create variation, not edit the original
- both can belong to `Pull-up` family

## Scenario C: Running

User starts with:

- `Run`

Later uses a weighted vest rarely.

Two valid options:

- edit if they truly want one shared progression line
- create `Weighted Vest Run` variation if they want separate history

The app should support both, but nudge toward variation when presets/history should diverge.

## Success Criteria

This system is successful if:

- users can change weight behavior without friction
- users can create distinct variations without losing relationships
- users can see family-level movement continuity
- last-time data remains specific and honest
- the app does not become a taxonomy management tool

## Recommendation

Build this as the real backbone for future movement intelligence.

Recommended order:

1. family model and edit controls
2. weight-mode/style editing
3. variation creation
4. family view
5. grip qualifiers on top

That order solves the immediate product pain first while keeping the long-term structure coherent.
