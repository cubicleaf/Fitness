# Fitness handoff — open decisions for the morning

**Date:** 2026-10-07  
**Purpose:** Resume the larger UX questions with a fresh perspective. This lists decisions or ambiguities raised in this chat that still need a direction; it is not a new implementation spec.

## Current working state

The current local source already includes the UI changes discussed in this chat: family rows and two-column activity cards, split guidance, routine-day editing, pairing-flow clarification, countdown editing, timer “Did some,” chat layout and purge, and expandable set history. The latest source changes were reviewed for whitespace only. No tests or visual phone review were run, and the work has not been committed or deployed.

Before this handoff was added, the working tree already had changes in `index.html`, `STATUS.md`, and `FAMILY-SYSTEM-AND-PICKER-SPEC.md`. Keep those edits intact when resuming.

## Decisions that still need Tim’s direction

### 1. Smart weight buttons

This was explicitly described as iterative. No recommendation logic or smart-button UI has been chosen or built. The existing “Last” value should remain understandable and every suggestion should stay optional.

Questions for the design conversation:

- Should the suggestions use the last few sessions for this exact activity, or also account for the set number within today’s activity?
- Should the controls show a short ranked list of likely weights, a recent range, or both?
- What should happen when there is little history, or the recent weights vary widely?
- Should selecting a suggestion just fill the existing weight field, leaving the rest of set entry unchanged?

**Working recommendation:** start with exact-activity history and show a few recent, distinct weights as optional choices. Discuss whether set position should influence those choices before implementing it.

### 2. New Activity split-choice colors

The current color treatment remains in the source. `STATUS.md` records that four directions were proposed earlier, but none was selected. Revisit those proposals or present them again as comparable phone-sized mockups; the older, broader palette-retheme ideas are parked and should not be treated as approval to recolor the app.

### 3. Timer screen and duration/countdown choice

The current timer presents two separate choices, **Log a duration** and **Start countdown**, with copy explaining that preset taps behave differently in each mode. This is a clearer interim state, not a confirmed final interaction. Tim said the top choice may be confusing and asked for an overhaul, but did not settle on a preferred model.

Possible directions to compare:

1. Keep the two explicit actions, then show the relevant presets and controls.
2. Select a duration first, then show separate **Log duration** and **Start countdown** actions.
3. Make presets log completed durations directly, with a clearly secondary **Time this activity** path for countdowns.

Compare the number of taps and the chance of logging a target as a completed duration. The user also asked that a running countdown allow adjustment to the actual time; that behavior is already present and should be preserved.

### 4. What “pairing” should mean

The picker now explains that pairing two timed activities creates linked entries using one duration, and its empty-result state can reveal activities outside the current split filter. The original feedback was that the feature was confusing and not working, so the core meaning still needs confirmation before expanding it.

Decide whether the intended feature is strictly a shortcut for recording the same duration against two activities, or whether the activities are meant to be performed together while retaining separate durations, notes, or other details. The current implementation supports the first interpretation only. Do not generalize it into a bundle/superset system without settling that distinction.

### 5. Activity-history layout

The current compact session row fades clipped set pills and offers **All** to open every set. The assistant proposed these next-step directions, and Tim has not picked one:

1. Keep compact rows and refine the **All** detail view.
2. Expand a session inline and let all set pills wrap across lines.
3. Open a fuller session view from the date, grouping all sets and session notes together.

The current implementation is closest to option 1. The **Log a Set** label intentionally remains text; replacing it with an SVG was explicitly deferred until later.

### 6. Split recommendation fallback

For a recognized activity without a fixed split mapping, the current helper recommends the active day’s split. For a loaded carry such as Farmer’s Walk with no active-day split, it suggests Core. The user asked for a recommendation while preserving multi-split assignments, but did not specify this fallback rule.

Confirm whether the active day is the right general fallback for any recognized-but-unmapped activity, and whether Core is a useful fallback for loaded carries or should instead be presented as a tentative example. Manual multi-split selection remains available either way.

## Separate operational issue

The Log Coach screenshot showed a rejected Groq key. Error messaging was previously changed to distinguish HTTP 401/403 and identify the last four characters of the key the browser sent, but the phone’s saved key has not been inspected or retested. If the coach still fails, check or replace the key in Settings. The new **Purge** action only removes the saved conversation; it does not change the Groq key.

## Implemented in the current local source

These were requested and have a source implementation; revisit only if phone review finds a regression:

- Family picker rows use a full-row family button with a plain variation count; ordinary activities have no family SVG and can appear two per row. The toolbar uses the daily Add Activity control and Master Reader search icon.
- Routine day editing opens a full-screen choice view; routine deletion uses the trash SVG. Logged activities show a check instead of a rank, and the daily view controls are separate, matched-height buttons.
- Field-note/modal borders, unwanted daily separators, rank hover color, and the date sheet’s clipped assignment action were addressed in the earlier changes.
- Pairing selection/cancel cleanup, actual-time editing after a countdown, and hiding hand placement on closed daily activities are in place.
- The timer has the shrug-style **Did some** action and a consistent 12px section gap. Log Coach has aligned message bubbles, a bottom composer, and confirmed local-history purge.
- Long set strips fade and open every set. The weight control relies on its SVG; **Log a Set** remains text for now.

## Suggested morning order

1. Settle what pairing means and choose the timer’s basic interaction model.
2. Sketch the smart-weight choice behavior before coding any recommendation logic.
3. Pick the activity-history direction and the New Activity split-button color direction.
4. Retest the Groq key only if Log Coach is still failing on the phone.
