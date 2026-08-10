# Tim's Logbook — Motion & Interaction Reference

This is the practical motion reference for the app. `STATUS.md` records when a
motion decision was made and why; this document records the reusable recipe so
future work does not have to reconstruct it from history.

## North star

Motion should make the interface feel settled, tactile, and considerate while
keeping workout logging immediate. Use movement to explain a state change, not
to decorate or delay a critical action.

## Core rules

- No bounce, spring, overshoot, or elastic easing by default.
- Use opacity plus a small transform for surfaces entering or leaving.
- Keep input and press feedback immediate; do not delay a button action for an
  animation.
- Use at least 44px by 44px touch targets, even when the visible artwork is
  smaller.
- Honor `prefers-reduced-motion: reduce`: remove non-essential movement and
  delays while keeping the state change and content available.
- Prefer `cubic-bezier(0.25, 0.1, 0.25, 1)` for the app's standard gentle
  ease-out.

## Timing scale

| Interaction | Duration | Recipe |
| --- | ---: | --- |
| Press feedback | immediate | `scale(0.95)` or a color/border state; no intentional delay |
| Small control transition | 200–300ms | color, border, opacity |
| Inline content reveal | 280ms | opacity + `translateY(-6px → 0)` with the standard ease-out |
| Modal/panel entrance | 250ms | backdrop fade + `scale(0.96 → 1)` + `translateY(8px → 0)` |
| Ambient atmosphere | 1–1.5s | only when it does not compete with the task |

## Current approved recipes

### Activity-card expansion

The expanded activity region uses a restrained `280ms` standard ease-out:

- Opening: `opacity: 0 → 1`, `translateY(-6px) → translateY(0)`.
- Closing: keep the content mounted for `280ms`, play the same transition in
  reverse, then unmount it.
- The expanded surface may remain visually anchored while its controls settle.
- Do not add bounce or a large scale effect to this core logging interaction.
- Reduced motion removes the transform and transition but preserves immediate
  expansion/collapse.

Implementation currently lives in `.exercise-expanded-content` in
`index.html`.

### Modals and focused editors

Use the shared modal entrance pattern unless a surface has a documented reason
to differ: warm scrim fade, then a card that scales from `0.96` to `1` and
translates from `8px` to `0` over `250ms`. Close should be at least as quick as
open when the user is returning to an active task.

## Before adding a new motion

Ask:

1. What state change does this explain?
2. Is the action still available immediately?
3. Does the motion fit the timing scale above?
4. What does the reduced-motion version do?
5. Does it make the workout flow calmer, or merely busier?

