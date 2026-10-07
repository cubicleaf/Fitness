# Related Activities and Picker Spec

**Last updated:** 2026-10-07

## Model

- A **family** is an optional, explicitly named organizational group. It owns no sets, history, notes, presets, or logging behavior.
- An **activity** is the exact thing logged. Its ID owns sets, session notes, presets, weight and grip behavior, categories, and “last time.” An activity is either standalone or linked to one family.
- **Variation** describes an activity relative to another activity during creation, comparison, and relationship management. It is not a second loggable entity or a parent/child hierarchy.
- **Qualifiers** are optional structured set context, such as grip. **Notes** are free text. Neither creates a family or changes activity identity.
- Duplicate **Merge Activities** is a separate operation that combines histories. Related Activities never moves or merges history.

The existing `movementFamilies` store and activity fields remain the data model. No setup entity, extra store, or inferred taxonomy is needed. `movementFamilyId` is the structural link. `movementFamilyName` is display copy. `variationOf` is a convenience pointer only and may be saved only when the activity and its anchor share a valid family record. Sets and session notes still point to exact activity IDs.

## One management workflow

**Related Activities** is the discoverable action in Activity Context → Edit. It opens `RelatedActivitiesModal` and uses `writeRelatedActivities` for all relationship writes. The Add Activity picker is selection-only; family selection does not open the management modal. The old Family Link, Family View, Create Variation, and Family Linking routes have been removed.

- **Standalone:** Explain that the activity is tracked on its own. Offer **Relate to another activity** and **Create a variation**. If the chosen other activity is standalone, the person must explicitly name the family; the same transaction links both activities. If the other activity already has a valid family, link the current activity to it.
- **Manual choice:** The relate step searches all saved activity names, including personal names the classifier does not know. Search only finds a candidate; linking still requires a deliberate selection and the existing confirmation rules.
- **Create a variation from standalone:** Require an explicit group name and new activity name. Confirm both the original and new activity in that group. The new activity gets its own ID and empty history. Never seed a group name from keywords or the source activity name.
- **Linked:** Show the group, every related activity, and which one is current. Each row opens that activity's own history. Offer **Create variation**, **Move to another group**, and **Make standalone**. A variation created here joins the existing family with a new ID and empty history. Moving may target an existing group or an explicitly named new one.
- **Detaching:** Clear the family ID, name, variation label, and variation pointer from the activity. When the last member leaves, delete the empty family record. Clear convenience pointers that would otherwise refer across groups.
- **Legacy cleanup:** Settings → Data may preview families with exactly one linked activity and, after an explicit confirmation, make those activities standalone and remove those family records in one relationship transaction. This never touches sets, notes, presets, categories, or history. Multi-activity groups require individual review because a name alone cannot establish which links are mistaken.

Every relationship command changes only activity relationship fields and the family store. It must preserve existing sets, session notes, presets, categories, weight settings, and exact-activity last-time data. Ordinary new activity creation starts standalone. App boot and migration must preserve existing links without inferring or manufacturing new ones.

## Picker contract

The Add Activity picker remains a selection surface, separate from relationship management:

- Standalone activities appear as normal cards in a two-column grid without a family SVG. A family gets one full-width button only when at least two of its activities are eligible under the current filter. Its label ends in “Family”; a flow-chart SVG is a family-only cue, and the variation count is display text, not a nested button. Tapping anywhere on the family row opens the gated selection sheet. A single eligible member appears as an ordinary activity card, never as “1 variation.” Manage family relationships from Activity Context → Edit.
- The picker toolbar puts the compact daily-view Add Activity button on the left and the Master Reader search icon on the right. Search opens as an input over the toolbar only, leaving the activity list uncovered; closing it clears the query.
- A non-All split is a hard boundary for browsing, search, pairing, and the family selection modal. All allows every activity.
- Search matches activity names only. Family names, variation labels, categories, and split metadata cannot make an unrelated activity appear.
- Eligible activities order by real qualifying logged-set count for that exact activity, then alphabetically. Neutral anchors and presence-only sets do not count. The family row follows its eligible members' highest count, then family name.
- The picker says **variation/variations**, never **variant/variants**. The activity remains the selectable and history-bearing item.

## Verification boundary

Use isolated demo browser data for relationship checks and a phone-sized viewport. Confirm standalone open/close is read-only; both sides link when relating standalone activities; creation from standalone and inside a family; moves; detachment and empty-family cleanup; separate histories and presets; history navigation; full-row family selection and counts; two-column standalone cards; absence of family SVGs on standalone rows; toolbar search opening over only the controls and clearing on close; split-gated selection; name-only search and usage ordering; and no inferred family on creation or boot. Run all inline-script syntax checks and the relevant split-classifier fixtures. A physical phone pass remains useful before release.
