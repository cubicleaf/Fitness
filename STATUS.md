---
attention: Active
state: Live
form: Website
updated: 2026-07-22
live_url: https://fit-logs.vercel.app
---

**Last updated:** 2026-07-22

## Where I left off

Working product name is now **Tim's Logbook** until further notice. Treat this as a conservative working name, not a legal clearance result or permanent brand commitment. The old Fit Logs / Fitness Tracker labels may still appear in code, deployment URLs, docs, and repository metadata until a deliberate rename pass happens.

The app is feature-complete enough to use, but the next useful work is no longer "add features." It is: centralize the loose product ideas, fix obvious experience breaks, and evaluate which helpers actually reduce workout friction versus creating a little fitness command center nobody wants to operate between sets.

Immediate implementation priority: desktop should remain phone-constrained across the entire app flow. The main screen already behaves like a phone on desktop, which is intentional, but the "Add New Activity" flow appears to expand into widescreen desktop layout. That violates the app's sanity constraint: every screen, modal, and creation/edit flow should preserve the phone-sized app frame.

The real product test is still real usage — logging actual workouts over several sessions and seeing what breaks, what's missing, and what's just annoying. Nothing reveals friction like a set of dumbbells in your hands and a phone screen in front of you.

Color token *plumbing* is now done (2026-07-16): a `:root` token block exists and all core colors route through it. The larger color-showcase/palette-comparison project remains shelved — but future color changes are now one-line edits.

## Decisions

- 2026-07-20: Working name changed to "Tim's Logbook" until further notice. What: use Tim's Logbook as the conservative product name in discussion and future UI/doc rename work. Why: generic fitness names such as Fit Logs are accurate but crowded; "Tim's Logbook" is personal, low-claim, and less likely to overstep while the app is still a personal-first tool. How to apply: do not treat this as trademark clearance; before public/serious distribution, run at least a USPTO/app-store/domain/common-law search. For now, prefer "Tim's Logbook" in new copy, but avoid broad mechanical renames until the current undeployed local changes are committed/pushed.
- 2026-07-16: Audience settled — Tim is the guinea pig; sharing comes after validation. What: the app must prove itself through Tim's own workouts first; broader users are the eventual goal, not the current one. Why: INTENT said "personal tool" while TOUR-SPEC targeted brand-new users — an unresolved contradiction steering effort toward onboarding strangers before the core loop was validated by anyone. How to apply: tour phases 3–4 and onboarding polish stay behind "Tim actually logs workouts" in priority; INTENT.md now has a "Who it's for" section.
- 2026-07-16: React 18.3.1 vendored inline; unpkg removed entirely. What: react + react-dom production UMDs are pasted into index.html (~488KB total file); nothing loads from a CDN at runtime. Why: the June outage WAS this failure class (unpinned CDN dependency); INTENT explicitly promised "no external dependencies at runtime" and the code violated it. How to apply: never reintroduce runtime CDN script tags; upgrading React means re-vendoring deliberately.
- 2026-07-16: Added sw.js (service worker) — offline support; single-file constraint amended to "1 HTML + 1 sw". What: stale-while-revalidate caching of the app shell; loads with zero signal after first visit; background-refreshes so next visit gets new deploys. Why: a gym app that requires signal fails at its one job; the single-file rule's purpose (zero deploy complexity) survives one extra static file. How to apply: deploy sw.js alongside index.html; bump the CACHE version string ('fitlogs-v1') if cache behavior ever needs a hard reset.
- 2026-07-16: Design tokens added; cool grays warmed; set boxes moved to a mauve ramp; 11px text floor. What: `:root` block with ~20 tokens; all hardcoded core colors (hex + rgba washes, 380+ replacements) now route through var()/color-mix(); #e0e0e0→#e9dde3, #666→#7a6570, #999→#9a8290, #333→#3d2e35 (same lightness, warm hue); pure-black overlay→rgba(12,6,10,.5); set-box blue/yellow/teal→three intensities of accent-soft (16%/30%/46%); all 8/9/10px text bumped to 11px (34 spots). Why: 48 unsystematized colors + playbook violations (cool grays, decorative colors, pure black) flagged in _docs/token-showcase-roadmap.md; inline style objects CAN consume CSS variables, so tokenization didn't require the big un-inlining refactor. How to apply: new colors get a token first; derive washes with color-mix(in srgb, var(--x) N%, transparent), never hardcoded rgba; don't go below 11px text.
- 2026-07-16: Phone-frame fix — .modal capped at max-width 430px + margin auto. What: modals are position:fixed (viewport-relative), so they ignored #root's 430px cap and expanded to full desktop width; now they center inside the phone frame while the dim overlay stays full-bleed. Why: STATUS decision of 2026-07-16 (desktop stays phone-constrained everywhere); Add-Activity was the visible offender. How to apply: any new fixed-position surface needs the same max-width treatment; treat full-width escapes as bugs.

- 2026-07-16: Desktop should remain phone-constrained everywhere, not only on the first screen. What: the app may be viewed on desktop, but the product surface should behave like a phone app inside a constrained frame for every screen, modal, wizard, settings panel, activity creation flow, and helper UI. Why: Fit Logs is intentionally phone-first; allowing certain flows to expand into widescreen creates a second product and doubles design complexity. How to apply: treat any desktop full-width escape as a bug unless explicitly designing a separate admin/export surface.
- 2026-07-16: Cadence reminders must be opt-in per activity or activity class, not automatic nags. What: reminders should exist only when the user intentionally marks an activity as important and chooses a recurrence window such as 2 weeks or 1 month. Why: automatic guilt-generation would fight the app's low-friction logging intent; user-selected reminders are more like a memory aid than a coach yelling from a drawer. How to apply: design reminders as quiet in-app cues/toasts/badges first; avoid push notifications until there is evidence they are wanted.
- 2026-06-24: Rewrote the entire Marcus Chen seed dataset (Oct 13 2025 -> Jun 30 2026) to be lb-NATIVE. Root issue: the old `fix_seed_data.py` snapped weights to UK kg-plate math (20kg bar + 2.5kg) then labeled them lbs, producing illogical pound values (171, 182, 226 = 77.5/82.5/102.5kg in disguise). New rule: American plate math — 45lb bar + paired plates, so every barbell weight is a multiple of 5; bodyweight = 180 (so the bodyweight-bench PR is a clean 180). `fix_seed_data.py` is now SUPERSEDED — do not re-run it (it re-introduces kg artifacts). June 2-30 generated by `gen_june_2026.py` (milestone month: 5th unassisted pullup Jun 16, 185 bench PR Jun 26, faster 5K Jun 21, clean/no-setback). Two independent audit sub-agents (physiology + data-integrity) verified the full span; all flagged defects fixed except two characterful judgment calls left for Tim (sparse Dec/Jan leg days; Mar-14 PR jump size). Backup: seed-data.kg-version.20260624.bak.
- 2026-06-24: Root-caused the live "JS Error" crash. Cause: an OLD deployed build loaded `@babel/standalone` UNPINNED (`unpkg.com/@babel/standalone/babel.min.js`, no version). unpkg began serving Babel 8.0.2, which rejects the in-browser `import {}` syntax the JSX used -> `SyntaxError: Unexpected token '{'` -> global onerror paints the red box -> no UI. Current local index.html already fixes this (Babel removed; JSX pre-compiled to 668 React.createElement calls; React loaded as UMD). Fix = deploy the current local index.html. Verification plan: Vercel preview first, then promote to production.
- 2026-06-04: Shelved CSS token showcase / color system work. Reason: not blocking real usage; gets in the way of using the app.
- 2026-02-xx: IndexedDB chosen over localStorage. Reason: structured queries, storage limits, and the ability to model exercises/sets/sessions as separate object stores.
- 2026-02-xx: Single HTML file chosen deliberately. Reason: zero deploy complexity, no build step, works as a progressive web app.

## Activity log

- 2026-07-22 (gold CTA + long-press rep delete + barbell presets): Ran three live-source UX experiments in `index.html`. `+ Add Activity` now uses a pure-gold fill (`#D4A853`) with dark text (`#12070C`) as a visual test. Expanded rep pills now support press-and-hold delete via the existing confirmation flow, replacing the removed inline-corner delete pattern with an action directly on the pill itself. The weight picker now branches for bar-style exercises (`weightMeaning: barbell` / `bar-custom`): quick presets and common totals explicitly include the bar, and the plate quick-picks are labeled as per-side pairs instead of pretending generic totals mean the same thing for machines and barbells. Verified all 5 inline script blocks with a Node syntax pass.
- 2026-07-22 (date persistence + today jump): Changed day navigation so refreshing the app no longer snaps back to the current day. The active `currentDate` now restores from saved preferences and updates whenever the viewed day changes, including arrow/swipe/history navigation. Added a small `Today` button in the date header when viewing another day so returning to the present stays one tap away. Verified the 5 inline script blocks with a Node syntax pass.
- 2026-07-22 (aesthetic exploration spec): Tim asked to explore a less-dark gold/cream direction, with possible Holden Flâneur/Ambiance moving-atmosphere influence, but explicitly not as a high-priority source-app change. Created WDM handoff spec at `webdev/fit-logs-gold-cream-aesthetic-build-spec.md` with five directions: Candlelit Logbook, Cream Ledger, Antique Brass Utility, Ambient Ember, and Bone + Burgundy. No source app UI/code changes made.
- 2026-07-22 (red bubble hotfix): Removed the inline per-set delete buttons from expanded exercise set pills. Root cause: expanded cards rendered an absolutely positioned `.set-box-delete-inline` button for every set; its oversized padding made it appear as red circles over the pill text on iPhone. Fix: set pills still tap to edit when expanded, but no longer render the red delete overlay; removed the unused red-bubble CSS. Verified all 6 inline script blocks with `node --check`.
- 2026-07-22 (production correction): After Tim still saw `40lbs ×2 ×10` on `fit-logs.vercel.app`, confirmed the actual problem was deployment scope: the fix had only been pushed to `fix-babel-crash`, while production was still serving `main` at `bdcf910`. Fast-forwarded `main` to `d73b9ff` and verified Vercel production deployment `dpl_G44DUaRemFxemqTQ5tzKw9vGXhWQ` (`fitness-re2gvy6dr-tims-projects-5135e79e.vercel.app`) is Ready and aliased to `fit-logs.vercel.app`. Live HTML now contains `set.weightMeaning === 'per-side' ? ' ea' : ''`. If a phone still shows `×2`, treat it as local browser/cache/service-worker freshness and reload.
- 2026-07-22: Hot-fixed two gym-blocking logging UX bugs in `index.html`. Set pills for per-hand/dumbbell weights no longer render a second multiplication term (`40lbs ×2 ×10`); they now show per-hand weight as `40lbs ea ×10` so reps are the only `×#` value. Add Activity search now searches across all activities when text is entered instead of hiding exact matches behind the active split filter; root cause of the reported Decline Dumbbell Press mismatch was that the existing activity had "No split" while the picker was filtered to `push`. Duplicate detection also now shows only exact normalized matches when an exact name already exists, instead of cluttering the panel with weaker similar presses. Verified all 6 inline script blocks with `node --check`.
- 2026-07-20: Naming discussion settled on "Tim's Logbook" as the temporary working name. Rationale: safer/personal naming lane, deliberately not treated as a cleared trademark. No app UI/code rename performed yet.
- 2026-07-16 (later session): Confirmed via Vercel API that the Babel-crash fix DID reach production on 2026-06-24 (commit bdcf9107 "Remove unpinned Babel; ship precompiled build", state READY, preview-branch-then-main per plan) — the live site has been working since; it was just never recorded here. Same session: project audit against the UX playbook; root cleanup (superseded scripts/backups → _archive/ with DO-NOT-RUN note, duplicate token-showcase.html retired, root screenshots filed); React vendored inline; sw.js added; token layer + warm-gray + set-box + 11px floor changes; aria-labels on all 20 icon-only buttons; input/textarea text-selection re-enabled (global user-select:none was blocking it); fixed "your weights" chips ignoring kg sets (hardcoded 'lbs' filter → current unit); .modal phone-frame cap. All 6 script blocks pass node --check. Local file is now AHEAD of production — needs deploy (preview → promote). Deploy vehicle located: the git clone is `webdev/projects/Fitness-git/` (working folder has no .git). Found there: commit 5fd3d66 (tour phases 1–2 + lb seed data) was committed Jun 24 on branch `fix-babel-crash` but NEVER PUSHED — production has the babel fix only, no tour. New index.html + sw.js are staged (copied) into the clone; Tim to commit/push from his machine (sandbox has no git credentials). Caution: a `.git/index.lock` existed that the sandbox couldn't remove — if git refuses to commit, delete that lock file first (only with no other git process running).
- 2026-07-16: Centralized Tim's loose product ideas into STATUS.md as open backlog/evaluation items: desktop phone-frame consistency, paired/bundled activities, opt-in cadence reminders, exercise variations/movement families, IDFK workout helper, split recommender overhaul/removal, warm-up adjustment, tutorial/onboarding, and API research.
- 2026-06-24: Tour build phase 2 done — dark-themed spotlight engine (`window.WPTour`) injected before </body> (style#wp-tour-styles + script#wp-tour-engine). Vanilla DOM over React, box-shadow cutout, pixel tooltip, 0.70s glides, reduced-motion + keyboard. Welcome step config (Part A) included; missing targets fall back to centered. TEMP preview trigger: load app with #tour. First-run/Settings/demo-seed are phases 3-4. Syntax verified.
- 2026-06-24: Tour build phase 1 done — added 7 `data-tour` anchors (date-nav, splits, activity-card, add-activity, history-tab, notes-tab, log-row) to index.html. Attribute-only, no visual change, inline JS syntax verified. Backup: index.html.pre-tour.20260624.bak. Next: phase 2 (dark spotlight engine).
- 2026-06-24: Rewrote seed data to lb-native, extended through Jun 30, audited via 2 sub-agents, promoted to project. Next: onboarding tour (seeded Marcus demo + just-in-time coachmarks) using this data.
- 2026-06-24: Diagnosed live crash (unpinned Babel 8 breaking change). Confirmed local index.html is babel-free and passes a node syntax check. Planning onboarding tour (data-tour anchors required since UI renders dynamically into #root). Naming front-runner: "Benchmark".
- 2026-06-04: Resumed project. Created INTENT.md and STATUS.md. Shelved color work.

## Open

### Naming / brand cleanup

- Working name: **Tim's Logbook** until further notice.
- Not yet done:
  - Decide whether the live URL remains `fit-logs.vercel.app` for now.
  - Run a basic clearance screen before public/serious distribution: USPTO Trademark Search, app stores, domains, Google/common-law use, GitHub/social.
  - Rename visible app copy/title/meta tags only after the current local changes are committed/pushed.
  - Decide whether repository/folder/deploy metadata should remain Fitness/Fit Logs internally or move to Tim's Logbook later.
- Caution: "Tim's Logbook" is a safer-feeling working name, not a legal opinion or clearance result.

### Gold / cream aesthetic exploration

- Pending, not high priority: explore a broader aesthetic rebalance using gold, cream/bone, and possibly the Holden Flâneur/Ambiance moving-atmosphere language to offset the app's current very dark burgundy/mauve feel.
- Current artifact: `webdev/fit-logs-gold-cream-aesthetic-build-spec.md`.
- Proposed WDM directions:
  - Candlelit Logbook — HF-faithful gold punctuation, cream readability.
  - Cream Ledger — dark shell with cream raised cards.
  - Antique Brass Utility — gold/brass active controls; deliberately riskier.
  - Ambient Ember — subtle moving HF-style atmosphere behind glassy UI.
  - Bone + Burgundy — most usability-forward, lightened card surfaces.
- Constraint: source app should not be rethemed until a WDM mockup is built and Tim chooses a direction/hybrid.

### Desktop phone-frame consistency

- RESOLVED 2026-07-16 for all `.modal` surfaces (the Add New Activity offender included): fixed-position modals now carry `max-width: 430px; margin: 0 auto`. See Decisions.
- Still open: verify on a real desktop pass that no OTHER fixed-position surface escapes (three inline confirm-overlays dim full-bleed by design — their content cards are narrow, but eyeball them). Any new fixed-position element must get the same cap.

### Paired / bundled activities

- Idea: allow multiple activities to be grouped into one bundle, pairing, superset, circuit, or recovery block.
- Strong fit cases:
  - Supersets/circuits where the grouped items are simple and repeated together.
  - Timed or low-detail activities where logging every sub-detail would be silly.
  - Recovery/lifestyle blocks such as sauna plus another lightweight activity.
- Weak fit cases:
  - Heavy lift pairings where each movement needs its own weight, reps, warm-up, rest, and progression history.
  - Anything that obscures "last time" for the individual activity.
- Current recommendation: do not build a generic bundling system yet. First evaluate a narrower "timed bundle" or "routine block" concept where sub-items do not need complex set-level logging.
- Open questions:
  - Is the bundle itself logged as an activity, or is it only a shortcut that creates multiple activity entries?
  - Should bundled activities share notes/timing, or keep separate histories?
  - Does pairing help during a workout, or mainly help summarize what happened afterward?

### Opt-in cadence reminders

- Idea: let the user mark specific activities as important and choose a cadence such as "remind me if I have not done this in 2 weeks" or "1 month."
- Must be opt-in, not automatic.
- Possible surfaces:
  - During activity creation/editing as an "importance/reminder" setting.
  - In activity detail/history as "remind me if this goes stale."
  - In Settings only for reviewing all reminders, not as the only place to create them.
- First-version recommendation: activity-level setting plus a small in-app reminder surface. Avoid push notifications until usage proves they are worth the extra permission/annoyance.
- Open question: should reminders apply to exact activities only, or to movement families/variations once those exist?

### Variations, movement families, and muscle-group mapping

- Idea: connect related activities such as cable row, dumbbell row, machine row, and other row variants under a broader movement family.
- Product value:
  - Preserve exact activity history while still tracking continuity in a fundamental movement pattern.
  - Let "last time" remain precise, while offering broader context like "you trained rows recently."
  - Enable recommendations based on muscle group or movement category rather than exact exercise name.
- Risks:
  - Too much taxonomy can become homework.
  - Auto-classification mistakes could be worse than no classification if they corrupt suggestions.
- Current recommendation: start with manual tags/families before any LLM/API automation. Let the user link variations intentionally, then later explore suggested mappings.
- Possible model:
  - Activity = exact thing logged.
  - Variation = equipment/form variant.
  - Movement family = row, squat, press, pull-up, hinge, carry, etc.
  - Muscle-group hints = advisory metadata, not scoring gospel.

### IDFK workout helper

- Idea: a button for "I don't fucking know what to do" moments at the gym.
- Jobs it could do:
  - Suggest today's workout based on recent history.
  - Respect the current split, if one exists.
  - Ignore the split when the user explicitly wants freedom.
  - Offer "repeat something recent" without forcing the user to hunt through history.
  - Teach or explain split concepts when the user wants guidance.
- Advisor note: this is a promising direction because it uses the app's private history to remove decision friction. It should not become a chatbot-shaped fog machine.
- First-version recommendation: make it a simple chooser with 3 paths:
  - "Use my split"
  - "Ignore split, suggest something balanced"
  - "Repeat a recent good workout"
- Dependency: needs enough real workout history, or a seeded demo persona, to feel credible.

### Split recommender overhaul or removal

- Problem: current split recommender feels obnoxious and may pop up at the wrong times.
- 2026-07-22 note: duplicate detection/search had a related trust bug: exact existing activities with "No split" were hidden when the picker was filtered to a split. Search now ignores the split filter while text is entered, and exact duplicate matches suppress weaker similar-match clutter. Still need broader recommender review.
- Options:
  - Improve trigger conditions and copy.
  - Move it behind the IDFK/helper flow.
  - Remove it entirely until real usage proves the need.
- Advisor note: if the app interrupts at the wrong moment, it loses trust fast. A bad recommender is worse than no recommender because it makes the app feel presumptuous.
- Open question: is the split recommender trying to teach planning, choose today's workout, or correct the user's behavior? Those are different jobs.

### Warm-up adjuster

- Idea: offer warm-up adjustment or suggestions.
- Current status: interesting but high risk for scope creep.
- Advisor note: warm-up help is only useful if it appears exactly when needed and requires almost no mental overhead. Otherwise it becomes another thing to manage before lifting.
- Possible future shape:
  - "First working set heavier than usual?" prompt.
  - Optional warm-up set suggestions based on last logged working weight.
  - Hidden unless the user chooses a lift where warm-up is relevant.
- Recommendation: backlog only; do not build before phone-frame consistency, activity flow validation, and recommender cleanup.

### Tutorial / onboarding tour

- Idea: when the app is handed to more people, provide a tutorial using the existing spotlight tour approach.
- Existing foundation: `window.WPTour` and `data-tour` anchors already exist; `#tour` can preview the tour.
- Needed later:
  - First-run trigger.
  - Settings/manual replay.
  - Demo-seed-aware onboarding copy.
  - Possibly a "Benchmark" named demo mode.
- Advisor note: do not perfect onboarding before the core logging loop is validated, but keep using the existing tour foundation when making new screens so future onboarding has anchors.

### API / data enrichment research

- Idea: research APIs that could plug into Fit Logs.
- Possible areas:
  - Exercise databases.
  - Muscle group / movement taxonomy.
  - Equipment metadata.
  - Health platform export/import options.
  - AI-assisted activity classification or suggestion.
- Constraints:
  - No runtime external dependencies unless there is a very strong reason.
  - No accounts/server/subscriptions for the core app.
  - Any API must not compromise the local-first, fast logger identity.
- Advisor note: useful research, but likely not an immediate build dependency. The app's differentiator is frictionless personal history, not becoming a thin UI over somebody else's exercise database.
