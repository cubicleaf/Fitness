# Onboarding Tour — Spec

Status: DRAFT for Tim's review · 2026-06-24
App: single-file workout logger (`index.html`), phone-first, renders into one `#root` div, IndexedDB storage.
Companion data: `seed-data.csv` (the Marcus Chen demo dataset — lb-native, Oct 2025–Jun 2026).

---

## 1. The core idea

A brand-new user opens the app and immediately lands inside **Marcus Chen's populated log** — eight months of real-looking history, splits, PRs, and the banded→unassisted pullup journey. They get to *touch* a fully-used app instead of staring at an empty screen. A short guided **welcome tour** plays over that populated demo, pointing at real, data-filled elements. When they're ready, one obvious button **clears the demo and starts their own empty log** — and from then on, small **just-in-time coachmarks** teach the deeper mechanics the first time each one actually happens.

This is the "both" architecture you asked for: seeded exploration up front, contextual teaching afterward.

Two terms used throughout:
- **Spotlight tour** = the screen dims, one element stays lit, and a small tooltip card explains it. Steps glide from one element to the next.
- **Coachmark** = a single one-time tooltip that fires in context (not a multi-step tour), the first time a user reaches a feature.

---

## 2. Why seed the *full* Marcus dataset (not a fake stub)

This is the reason we spent the effort making the seed data logical. The demo isn't two fake sets — it's the whole coherent 8-month story. That means every feature the tour highlights has genuine data behind it: History has hundreds of sessions, "last time" shows real numbers, splits are populated, the progress is believable. A new user sees the app at its best, working as intended, before they've logged a thing.

---

## 3. First-run logic & re-access

On app load, check a device-local flag (browser `localStorage`, intentionally separate from the IndexedDB workout data so it never ends up in a CSV backup):

- `wp_tour_seen` — has the welcome tour been completed or skipped?
- `wp_demo_active` — is the Marcus demo currently loaded?
- `wp_coach_<feature>` — per-coachmark "already shown" flags.

Flow:

1. **First ever load:** import the Marcus seed data into IndexedDB, set `wp_demo_active=true`, then auto-play the welcome tour (Part A). "Skip" is always visible.
2. **Tour ends or is skipped:** set `wp_tour_seen=true`. The demo stays loaded so they can keep exploring.
3. **Clear the demo:** a *low-key, dismissible* affordance while demo is active — a small chip (e.g. "Sample data · tap to clear"), **not** a loud banner. Tapping it wipes all demo data, sets `wp_demo_active=false`. App is now empty and theirs. Just-in-time coachmarks (Part B) arm themselves.
4. **Settings → "Replay tour"** re-runs Part A at any time. **Settings → "Load sample data"** quietly reloads Marcus's log for inspiration/reference — framed as an optional thing you can pull up, not pushed at you.

---

## 4. Part A — the welcome tour (auto-plays over the demo)

Short by design — long auto-tours get skipped. 6 steps, terse copy (matches the app's no-nonsense voice). Each step lights one element.

| # | Anchor (element) | Copy (terse) |
|---|---|---|
| 1 | *centered, no spotlight* | **This is a sample log** — someone's first eight months. Have a poke around to see how things work, then clear it and make it your own. *(Chill, understated — no hype, no exclamation marks.)* |
| 2 | `data-tour="date-nav"` (the `day-display` date navigator) | **Every workout lives on a day.** Swipe left/right to move between days. |
| 3 | `data-tour="splits"` (`category-tabs`) | **Splits group your days** — Push, Pull, Legs. Suggestions, not rules. |
| 4 | `data-tour="activity-card"` (first activity in the list) | **Tap any activity** to open its full history and your last numbers. |
| 5 | `data-tour="history-tab"` (the History tab *inside* an activity — tour drives navigation in) | **Last time is king.** Every past session is here, so you never guess your weight again. |
| 6 | `data-tour="add-activity"` (the + Add-Activity button) → then *centered* close | **Add your own exercise here.** Ready? Hit "Start my own log" to clear the demo. Replay this anytime in Settings. |

Note on step 5: the tour must programmatically open an activity (so the History tab exists to point at), then return to the main screen for step 6. Flagged as the trickiest build step.

---

## 5. Part B — just-in-time coachmarks (on the user's real, empty app)

After the demo is cleared, these fire once each, in context. Each is a single tooltip, dismissed on tap, with its own `wp_coach_*` flag.

| Trigger | Anchor | Copy |
|---|---|---|
| First tap of **+ Add Activity** | the exercise picker | **Pick an exercise, or type a new one.** Your list builds as you go. |
| First **set logged** | `data-tour="log-row"` (the weight/reps row) | **Two taps: weight, reps.** It saves itself — no save button. |
| First time opening an activity that has **≥1 past session** | top of the history list | **Your last time sits up top.** Beat it, or match it. |
| First time the **Notes area** is on screen (in an activity) | `data-tour="notes-tab"` | **Add a note** — a form cue or how it felt. It resurfaces next time you're here. *(Only fires when you're already in the area — not pushed.)* |

These land exactly when the lesson is relevant, which is where onboarding retention actually comes from.

---

## 6. Visual & interaction spec (dark re-skin)

The spotlight-tour recipe ships in light parchment + sage — **wrong for this app.** Re-skin to the app's dark burgundy/mauve palette:

- **Scrim (dimmer):** `rgba(12, 6, 10, 0.72)` — deep ink, matches the app background `#1a0a12`.
- **Spotlight:** rounded cutout around the lit element (big-`box-shadow` technique), ~8px padding, 12px corner radius.
- **Tooltip card:** background `#2a1520`, 1px border `rgba(139, 58, 98, 0.45)` (plum), heading text `#f4d8e2`, body text `#e8c1d0`.
- **Primary button** ("Next"): fill `#8b3a62`, text `#ffe9f1`. **"Skip"/"Back":** ghost text in `#c77da0`.
- **Progress dots:** active `#c77da0`, inactive `rgba(232,193,208,0.3)`.

Timing & motion (from your UX playbook — slow, deliberate, **no bounce**):
- Step-to-step spotlight glide: **0.7s**, `cubic-bezier(0.25, 0.1, 0.25, 1)`.
- Tooltip entrance: opacity 0→1 + `translateY(8px→0)` + `scale(0.96→1)`, **0.25s**.
- Button press: `scale(0.95)`, instant (tactile).
- **`prefers-reduced-motion`:** disable the glide; steps cut instantly. (Accessibility.)
- Touch targets: **44×44px** minimum on every Next/Back/Skip. (Non-negotiable per your playbook.)

---

## 7. Anchor inventory — `data-tour` hooks to add at build

These attributes get added to existing elements (the elements exist; they just lack stable selectors today):

- `data-tour="date-nav"` → the date navigator (`day-display` region)
- `data-tour="splits"` → `category-tabs`
- `data-tour="activity-card"` → the first rendered activity card
- `data-tour="add-activity"` → the + Add-Activity trigger button
- `data-tour="history-tab"` → the History tab button inside activity detail
- `data-tour="log-row"` → the weight/reps logging row (Part B)
- `data-tour="notes-tab"` → the Notes tab inside activity detail (Part B)
- `data-tour="settings-replay"` → the "Replay tour" row in Settings

---

## 8. Edge cases & risks

- **Demo pollution:** the demo must be all-or-nothing. While `wp_demo_active`, show only a small low-key chip ("Sample data · tap to clear") — not a loud banner. Clearing wipes *everything* and flips the flag. Don't let users half-mix demo + real data. Marcus stays reloadable from Settings.
- **Dynamic render timing:** elements are built by JS into `#root`. The tour must wait for render, measure element positions, and **re-measure on scroll/resize** or the spotlight drifts. (This was the #1 bug source in the spotlight-tour skill's notes.)
- **Navigation-driven step (A5):** opening an activity then returning is stateful — build and test this step in isolation first.
- **Transitions only on active state:** define spotlight/tooltip transitions on the base class, not just the "showing" state, or they snap on exit (a known anti-pattern in your playbook).
- **Re-skin, don't reuse:** do not paste the skill's parchment colors. Use Section 6 tokens.

---

## 9. Build phases (proposed)

1. Add the seven `data-tour` anchors to the components.
2. Build the tour engine: scrim + spotlight cutout + tooltip card + step controller, dark-themed, reduced-motion aware.
3. Demo seed/clear logic: import `seed-data.csv` → IndexedDB on first run; "Start my own log" wipe.
4. First-run trigger + Settings "Replay tour" entry.
5. Just-in-time coachmark system (Part B) with per-feature flags.
6. Test on iPhone 13 Mini viewport (your 480px target): seeded path, cleared/empty path, reduced-motion, re-measure on scroll.

---

## 10. Resolved decisions (2026-06-24)

- **Demo persistence:** keep it — reloadable from Settings, but low-key/opt-in ("for inspiration"), never in-your-face. While active, only a small dismissible chip marks it.
- **Step 1 framing:** Marcus story is fine, kept understated and chill — no hype, no cringe.
- **Part B count:** four coachmarks. Added Notes, but it only fires contextually when the user is already in that area.
