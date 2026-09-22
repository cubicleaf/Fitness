# Activity split classifier — offline feasibility prototype

Built and expanded 2026-09-17; integrated and deployed with explicit user authorization on 2026-09-18. Evaluation limitations below remain in force.

## Findings

A conservative classifier is practical without network access or a runtime AI model. This prototype contains 47 exercise/family records, explicit aliases, source anatomy metadata, and provisional conventional split mappings. It recognizes names before mapping them to the user's available categories. The source's movement-force field is retained for inspection but never used directly as a split label.

| Evaluation | Result | Meaning |
|---|---:|---|
| Development checks | 122/122 pass | Intended behavior, including abstention and explicit overrides |
| Generated suggestions in development checks | 47/47 match expected sets | Development precision, not independently validated accuracy |
| Development coverage, excluding explicit overrides | 47/114 (41.2%) | Includes deliberately ambiguous and unsupported inputs |
| Answerable development cases | 47/47 | Coverage within this curated, supported set |
| Distinct real-log activity names | 46 | Exact name strings; capitalization variants counted separately |
| Real-log suggestions | 26/46 (56.5%) | Small catalog leaves substantial coverage gaps |
| Suggestions with nonempty historical labels | 19 | All agree with the stored labels; labels are not expert ground truth |

Two initial failures were ordinary hyphenated plural names (`push-ups`, `Chin-ups`). Normalization was corrected and the original expectations retained. This is an iterated development suite, not a blind benchmark. The real names were inspected before catalog authoring, so that exercise is not a holdout either.

Even if the 47 development suggestions were independent samples (they are not), their descriptive 95% Wilson lower bound is only about 92.4%. Do not advertise 95% reliability from these results. No numerical confidence is returned; `confidence: null` is deliberate.

## Behavior contract

- Only an exact normalized catalog name or explicit alias can produce a suggestion. Full input must match; no substring matching or stripping unknown qualifiers.
- Common abbreviations (`DB`, `BB`, `OHP`, `RDL`), plural forms, hyphens, and `benchpress` are normalized.
- Near matches can produce candidates requiring confirmation. They never assign splits. Not all shorthand is recognized yet.
- A recognized hinge such as deadlift or RDL still asks because program placement varies.
- Unsupported combinations, vague names, negation, unfamiliar qualifiers, and custom labels abstain.
- Return all compatible available split labels; these are suggested memberships, not a mandate to choose one day. Default PPL convention includes core and cardio. Supported label aliases include Upper Body and Lower Body.
- Full Body and arbitrary labels such as Workout A have no inferred mapping. They need user definitions or an explicit saved choice.
- An explicit saved assignment for this exact activity takes precedence, including an empty assignment. Deleted labels require review. Caller data is never mutated.
- Historical day labels or existing imports must not silently become explicit confirmed choices. Explicit per-user mappings keyed by catalog ID are supported as injected data; no persistence or implicit learning is implemented yet.

## Evidence and licensing

`source.json` pins the Free Exercise DB source commit and retrieval date. `catalog.json` retains per-record source links and selected factual metadata; it excludes descriptions and media. `SOURCE-LICENSE.txt` preserves the upstream Unlicense. No paid service, API dependency, or new external integration was adopted.

The catalog's split memberships and aliases are authored here, not asserted to be labels supplied by the dataset. Review status is **provisional-agent-reviewed**, not trainer-reviewed. One source is insufficient to establish independent anatomical verification. Before shipping, finish cross-checking the supported movement families against a second reference such as [ACE's exercise library](https://www.acefitness.org/resources/everyone/exercise-library/), record per-record review evidence, and resolve discrepancies. Selected expansion records now include corroboration links to ACE, NASM, and manufacturer references. This is source corroboration, not independent reviewer validation. Do not bulk-copy proprietary instructions or media.

The real-log fixture contains only activity names and observed categories from the local corrected March export, not dates, weights, notes, or other workout details. The export remains untouched. Bench Press without a label is unlabeled, not negative evidence. Personal conventions such as Back Extension under Push are not automatically corrected.

## Reproduce

Requires Node, no install and no network:

```sh
node _docs/split-classifier/evaluate.mjs
node _docs/split-classifier/evaluate-real.mjs
```

Run from the Fitness-git project root. The first command exits unsuccessfully on expectation failures or catalog alias collisions. Both refresh only their local result JSON. They do not modify the app or Triage.

Files: `classifier.mjs` is a pure classifier with injected data; `catalog.json` is its candidate catalog; `cases.json` is separately stored authored expectations. `results.json` contains every development result. `real-log-results.json` exposes every real name, recommendation, and abstention.

## Next validation gate

1. Resolve the remaining 20 abstentions according to [NAME-REVIEW.md](NAME-REVIEW.md). The original 27 have been reviewed; seven gained supported suggestions. Personal mappings require explicit user choices, while uncertain variants require more evidence.
2. Independently review source facts and program rules. Freeze catalog and rules, then collect a fresh test set from a reviewer who did not author the classifier, including realistic unfamiliar and ambiguous entries.
3. Measure exact-set precision and coverage separately, with per-group results and uncertainty. Decide a minimum useful coverage before testing, so high precision cannot be achieved by abstaining on nearly everything. A provisional product target is at least 95% precision and 80% coverage on representative common-activity inputs; those are targets, not current findings.
4. Superseded sequencing: Tim authorized live integration on 2026-09-18. Continue reviewing the quiet, editable suggestions in creation. Preserve explicit manual choices while typing; never change historical records, hide activities, or block saving an unassigned activity. Validate the creation flow on a phone.

No interface changes or API purchases are needed to complete this validation work.

## Expansion findings

Version 2 added seven useful real-name suggestions: Decline Pushups, Preacher Curl Machine, Seated Cable Chest Press, MTS Decline Press, Glute Drive, dips, and Outdoor Run. It recognizes Back Extension, Farmer’s Carry, KB Swings and KB Halos but abstains from a universal program assignment. Saved per-user catalog mappings can resolve these without changing general rules. Generic dips supports Push/Upper only; Chest versus Arms still requires a variant.

The suite grew from 66 to 122 checks, including 35 deliberate malformed, negated, combined, or unknown-qualifier names. These all abstain. Unicode letters and combination markers are preserved as meaningful input, preventing normalization from silently turning an incomplete name into an exact match. The lower aggregate fixture coverage reflects the increased adversarial share, not lost real-name coverage. `validation-snapshot.json` records hashes and group results; it is a reproducibility checkpoint, not evidence of an independently tested holdout.

Name matching now says “Split classification based on …; exact setup is not inferred.” A broad activity name must not be represented as proof of a particular grip, machine, posture, or variant merely because that source record supplied its split evidence. Catalog matching does not merge activity history.

## Live integration — 2026-09-18

Tim explicitly authorized shipping into the actual app and iterating live before independent accuracy validation. `index.html` now contains the classifier/catalog and working create-flow UI. Suggestions require acceptance, explicit choices are preserved, and unknown activities can save unassigned. Name-specific remembered choices are persisted under `activitySplitChoices` in the existing IndexedDB preference store after successful save. They do not alter exercise taxonomy or historic records. Create Activity now displays required-field errors instead of silently returning, and rapid duplicate saves are guarded.

The original generated mock was retired. `build-preview.mjs` now copies the actual app, service worker, and seed data into `/tmp/fitness-split-preview` for local checks. Serve that folder on port 8766. `test-preview.cjs` accepts `PREVIEW_URL` for testing either localhost or production in isolated browser profiles. It verifies optional suggestions, manual protection, No Split persistence after reload, unassigned saves, phone/desktop bounds, required-field feedback, a normal strength activity, set logging, day navigation, CSV export/import, and all 122 classifier fixtures against the inline engine. Playwright can be provided via `PLAYWRIGHT_MODULE`.

Deployment: https://fit-logs.vercel.app, `dpl_AXybxFks6C1hzDyAzhpmszuPtzTV`; service worker v5. Deployment includes only runtime files, not these development documents or real-log fixtures. Local research fixtures remain excluded from Git. Live HTML hash was verified against the tested file. Physical-phone review remains outstanding; 95% accuracy remains a target, not an established result.
