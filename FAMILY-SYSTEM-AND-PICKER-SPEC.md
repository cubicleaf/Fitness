## Family System And Picker Spec

**Last updated:** 2026-07-29

## Purpose

This spec replaces the old fuzzy `parent / variant` framing with a cleaner, safer model:

- `Family` is organizational only
- `Activity` is the real history-bearing object
- linking and unlinking must be reversible and non-destructive
- the Add Activity picker must surface relevant activities without fail

This is both a product spec and a complexity warning for future models. The family system is not hard because of storage. It is hard because picker behavior, mental model, and reversibility all have to stay coherent at the same time.

## Core Model

### 1. Family

A family is an umbrella label such as:

- `Row`
- `Run`
- `Pulldown`
- `Bench Press`

A family:

- does not own sets
- does not own history
- does not own presets by default
- does not log directly
- exists to organize related activities

### 2. Activity

An activity is the exact loggable thing with:

- sets
- notes
- weight behavior
- grip behavior
- presets
- last-time data
- real history

Examples:

- `Cable Row`
- `Incline Dumbbell Row`
- `Outdoor Run`
- `Weighted Run`

### 3. Family Membership

Every activity can be in exactly one of these states:

- `standalone`
- `linked to one family`

Hard rule:

- one activity can belong to **zero or one** family
- one family can contain **many** activities

### 4. Default Family Activity

This is optional but useful.

A default family activity is not the “true” owner of the family. It is just the representative activity used when the UI needs one:

- collapsed family row
- default reveal order
- convenient anchor when creating siblings

This should never imply:

- set ownership
- merged progression
- shared presets

If the default changes, no history changes.

## Non-Negotiable Product Rules

### Reversibility

The user must be able to:

- link an activity into a family
- move it to another family
- detach it back to standalone
- dissolve a family without losing sets

All of those actions must preserve history.

### No History Mutation

Family actions must never:

- move sets between activities
- merge activity histories
- delete notes
- overwrite weight/grip defaults

If a user senses that taxonomy can corrupt history, they will stop trusting the feature.

### Activity-Local Behavior

Keep these local to the activity unless a later explicit family-default system is designed:

- weight prompt
- weight style
- grip tracking
- presets
- edit behavior

`Cable Row` and `Incline Dumbbell Row` can share a family and still behave differently.

### Families Can Be Light

A family is allowed to have:

- one activity
- many activities

Do not force users to create multiple variants just to justify the structure. They may know more are coming later.

### Families Can Dissolve

If the user detaches the last linked activity, the family should either:

- auto-delete if now empty
- or remain as an unused shell only if explicitly preserved later

V1 recommendation: auto-delete empty families.

## User Language

Use:

- `Family`
- `Activity`
- `Variant`
- `Standalone`

Avoid:

- `Parent`
- `Child`
- anything that implies the family itself has workout history

## Required Flows

### 1. Create Activity

Ordinary activity creation should stay light.

The user should be able to create:

- name
- split
- type
- weight behavior

without being forced to define a family.

Structured linking should be optional, not a gate.

### 2. Link To Existing Family

User selects an activity and chooses:

- `Link to existing family`

Then the app lets them:

- pick an existing family anchor/default activity or family record
- optionally set a variation label
- save without touching history

### 3. Create New Family

User selects an activity and chooses:

- `Create new family`

Then the app asks for:

- family name
- optional variation label for this activity

Result:

- family is created
- activity becomes linked to that family
- history remains untouched

### 4. Make Standalone

User selects an activity and chooses:

- `Make standalone`

Result:

- clear family link
- clear family-specific variation label if appropriate
- keep all sets, notes, and behavior

This needs to feel safe and boring, not dramatic.

### 5. Create Related Variant

From an activity already linked to a family, the user can:

- create a sibling activity
- inherit the family link
- start with separate history immediately

This should be framed as:

- new activity
- same family
- separate progression line

## Picker And Search Rules

This is the critical section.

### Goal

The Add Activity picker must surface relevant activities without fail.

If the family system makes obvious activities harder to find, the feature fails no matter how elegant the data model is.

### Family Display Model

In the Add Activity picker:

- standalone activities appear as normal rows
- families appear as family rows
- tapping a family row reveals its activities
- revealed activities remain individually tappable

### Recommended Ordering

Inside a family:

- default family activity first if one exists
- otherwise most recently used first
- then remaining variants by recency
- alphabetical as tie-breaker

Across the whole picker:

- split relevance first
- then recent usage
- then alphabetical cleanup

### Search Behavior

When the user types a query:

- search family names
- search activity names
- search split/category metadata
- search variation labels if present

If the query is `row`, the system should surface:

- family `Row`
- `Cable Row`
- `Incline Dumbbell Row`
- any other row variants

If the query is `incline`, the system should surface:

- `Incline Dumbbell Row`
- any family containing a matching activity

### Family Search Rendering

If a family matches only because one child matched:

- still surface the family row
- make the matching activity visible within it

Do not hide the family shell when the real match lives inside it.

### Failure Modes To Avoid

- exact activity hidden because only family row was shown
- family hidden because only child matched
- split filter suppressing obvious exact search matches
- collapsed family swallowing search results
- detached activities disappearing because stale family metadata lingers

## Data Rules

Minimum activity fields:

```json
{
  "movementFamilyId": "optional",
  "movementFamilyName": "optional",
  "variationLabel": "optional",
  "variationOf": "optional representative activity id"
}
```

Notes:

- `variationOf` is a convenience link, not the source of truth for history ownership
- `movementFamilyId` is the real structural link
- sets still point only to activity ids

## AI Coach Responsibilities

The in-app AI coach should help users understand:

- what a family is
- when to keep something standalone
- when to create a new activity vs edit an existing one
- reassurance that linking does not rewrite history

The coach should not invent taxonomy with false confidence. It should explain the model and guide the user, not silently restructure the app.

## Complexity Warning For Future Models

This system looks deceptively simple because the storage layer is simple.

The real complexity lives in:

- picker ordering
- search recall
- visible family vs activity distinction
- unlink safety
- not implying that a family owns history

Any future implementation pass must pressure-test:

- family row rendering
- search hit rendering
- split-filter interaction
- detaching and re-linking
- variant creation from linked vs standalone activities

If a future model only reasons about the database and not about picker recall, it will break the feature.
