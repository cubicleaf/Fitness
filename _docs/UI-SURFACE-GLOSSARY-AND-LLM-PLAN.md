# Tim's Logbook UI Surface Glossary and LLM Plan

## Why this exists

The app has several screens that are visually similar but do different jobs. This vocabulary is intended to make future implementation, documentation, field notes, and native-LLM explanations use the same names.

## Current surface glossary

| User-facing name | Code name | Job |
|---|---|---|
| Add Activity | `ExercisePickerModal` | Search, filter, create, select, family-first discovery, and duplicate review. |
| Activity History / Set Logger | `HistoryModal` | Inspect an activity's past sessions and choose how to log the next set. |
| Activity Context | `ActivityContextModal` | The main-screen activity surface with History, Notes, and Edit tabs. |
| Set Entry: Weight | `WeightPickerModal` | Choose load and, when enabled, set the modifier for this specific set. |
| Set Entry: Reps | `RepPickerModal` | Choose repetitions after load selection. |
| Set Entry: Timer | `TimedDurationModal` | Record duration and optional distance, plus timer controls. |
| Family Linking | `ActivityLineageModal` | Link an existing activity, create a family, create a related variant, or return to standalone. |
| Family View | `FamilyViewModal` | Browse the variants in one movement family. |
| Merge Activity | `MergeActivityModal` | Choose the canonical activity and move duplicate history and notes into it. |
| Log Coach | `AIChatModal` | Conversational explanation and assistance; not the source of truth for stored data. |
| Settings | `SettingsModal` | Preferences, data tools, weekly splits, and coach configuration. |

## Settled interaction principles

- Selecting an activity from Add Activity opens an inspection/history layer before logging. It does not silently jump straight into the last set.
- Leaving the Set Logger returns to the same Add Activity search state: query, category, and selected family are preserved.
- Families are navigation umbrellas, not merged histories. Search can show a family first, then its exact variants.
- A duplicate merge is user-directed. The user chooses the activity to keep and confirms before source sets, notes, and the source activity are changed.
- Modifiers belong to individual sets when they can change between sets. The main screen should show only a compact modifier tag when it adds useful distinction; detailed labels remain available in history/edit surfaces.

## LLM coach boundaries

The coach should be able to explain these surfaces in plain language, for example:

- “Add Activity is where you find or create an activity.”
- “Activity History is the screen between choosing an activity and logging a set.”
- “Family Linking groups related activities without combining their histories.”
- “Merge Activity is for accidental duplicates; it moves records into the activity you choose to keep.”
- “A grip or other modifier can be different on each set even when the activity name stays the same.”

The coach must not silently merge activities, rewrite set qualifiers, invent capabilities, or treat a family label as proof that two exercises are interchangeable. Deterministic code owns identity, stored history, merge operations, modifier storage, and calculations. The LLM may explain, rank, suggest, and help the user decide.

## Open vocabulary questions

- Whether “Activity History” or “Set Logger” should be the primary visible label for `HistoryModal`.
- Whether modifier tags should eventually use one-letter shorthand (`W`, `V`, `D`) or short words. Current implementation uses compact tags for the main screen and full labels in the set-entry controls.
- Whether a future “activity search” surface should combine activity names and notes, or remain a separate Settings search tool.
