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
| Daily activity open/close | 700ms | `cubic-bezier(.4,0,.2,1)`, 100ms content lead, `translateY(-6px → 0)` |
| Modal/panel entrance | 250ms | backdrop fade + `scale(0.96 → 1)` + `translateY(8px → 0)` |
| Ambient atmosphere | 1–1.5s | only when it does not compete with the task |

## Current approved recipes

### Activity-card expansion

Approved source: Tim's exact pasted **Space, then contents** recipe in the
Codex chat **[ FITNESS ] 10/7 DONE**, recovered and implemented 2026-10-14.
This supersedes the old 280ms reference and 520ms September experiment.

- Opening and closing: **700ms `cubic-bezier(.4,0,.2,1)`**.
- Opening: height, padding (0 → 8px), and accent wash (transparent → 7%)
  start immediately. Contents fade 0 → 1 and move -6px → 0 after **100ms**;
  everything finishes at 700ms.
- Closing: contents start immediately; space, padding, and wash follow after
  100ms and finish at the same 700ms endpoint. Content remains mounted until
  closing finishes and is inert as soon as closing is requested.
- Each card owns its animations and completion version. Capture computed
  values before cancellation. Reverse from that visible frame, skip the
  content delay on interruption, and scale duration to remaining distance
  (20–100% of 700ms). Only the current completion can restore auto height or
  release retained content. Never use an uncancelled opening timeout.
- Use a stable accent wash rather than the trembling outline.
- Reduced motion commits immediately, with no delay or transform.
- Keep logging, autosave, history, colors, icons, and SVG geometry intact.

Implementation: `ACTIVITY_MOTION` and `ActivityMotionCard` in `index.html`.
Verification: [2026-10-14 checks](./activity-motion-2026-10-14/VERIFICATION.md).

The recovered recipe also describes dialog lifecycle changes (zero travel,
retained exits, nested focus/stack handling). This implementation addresses
Tim's reported **main daily activity open/close** interaction; modal/picker
lifecycle changes remain a separate scope and must not be claimed as shipped.

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

