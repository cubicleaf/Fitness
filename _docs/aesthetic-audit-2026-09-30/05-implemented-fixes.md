# Confirmed aesthetic fixes — implementation and verification

**Document status: Archived — 2026-10-01.** Completed implementation record, not a new audit or current task list.

Implemented F1–F5 from [the audit](04-aesthetic-audit.md) in `index.html`. Consulted the [coverage matrix](03-coverage-matrix.md), [contrast evidence](contrast-evidence.md), and [original screenshot gallery](evidence-gallery.html). Changes are local and have not been deployed.

## Changes

- **F1:** Calendar weekdays, date-sheet metadata/bodyweight context, activity-picker headings/help/last-used dates, settings explanations, and compact edit-dialog explanations now use opaque `--text-faint`. Shared form/last-time labels and weight/reps context follow the same role. The affected 9–10px captions are now at least 11px. Custom Note's date caption also uses opaque secondary text. Selected and primary labels retain their existing brighter treatment.
- **F2:** The four header utilities use opaque `--accent-soft`; Today uses that foreground at 11px. Supplied SVG geometry, duotone artwork, scale face, title treatment, and header surface remain intact.
- **F3:** Delete/reset labels use page-dark text on the existing coral. Red, Green, Blue, Orange, Yellow, and Gray band buttons use the same dark text; Black/Purple retain white. Semantic fills remain unchanged.
- **F4:** Grip Tracking, Change Type, and Default Load share a centered, borderless compact card, capped at 340px, with 20px minimum outer clearance and internal overflow scrolling.
- **F5:** Textareas inherit the app's sans-serif family. Custom Note, Form Cues, feedback, and coach retain their existing sizes/line heights. The API-key editor's explicit monospace override is preserved.

Optional field-note contour, palette, gold artwork, 168×56 Add Activity action, squircle geometry, and empty-day composition remain unchanged. Retaining the coral fill minimizes the visual change required for the mandatory contrast correction.

## Focused verification

Used a fresh isolated Chromium session at `http://127.0.0.1:8765`, with the built-in Marcus Chen demo. No production browser or real workout database was opened. This was a check of affected screens, not a repeat of the full audit.

| Check | Result / evidence |
|---|---|
| Resting header and Today variant | All four controls computed as opaque RGB(199,125,160); Today 11px. [Header](fixes-evidence/header.png), [Today](fixes-evidence/today-label.png) |
| Calendar and date sheet | Weekdays and activity metadata computed at 11px with opaque RGB(154,130,144); bodyweight caption readable. [Calendar](fixes-evidence/calendar.png), [Date sheet](fixes-evidence/day.png) |
| Activity picker and preferences | Opaque secondary copy; picker metadata measured against actual 22% mauve SVG plate. All tab inspected in addition to the pictured Pull state. [Picker](fixes-evidence/picker.png), [Preferences](fixes-evidence/preferences.png) |
| Weight/reps captions | Supporting captions use the corrected role; Load and Last · Today are 11px. Reps layout has no horizontal overflow at 320px. [Weight](fixes-evidence/weight.png), [Reps](fixes-evidence/reps.png), [Small reps](fixes-evidence/reps-320.png) |
| Bright-fill labels | Computed Delete/reset foreground RGB(26,10,18), plate RGB(255,107,107). Reset was enabled for inspection, then cancelled. All eight actual band fills/foregrounds checked. [Delete](fixes-evidence/delete.png), [Reset](fixes-evidence/reset-enabled.png), [Bands](fixes-evidence/bands.png) |
| Compact dialogs | All three visually inspected at 390×844, 1000×844, and 320×568. At 1000px all cards are 340px wide at x330; at 320px cards are 280px at x20. Default Load has no horizontal overflow. [Grip desktop](fixes-evidence/grip-1000.png), [Type desktop](fixes-evidence/type-1000.png), [Load desktop](fixes-evidence/load-1000.png), [Small load](fixes-evidence/load-320.png) |
| Prose fonts | All four editors computed the app's system sans family. Custom Note remains 14px/21px; Form Cues 13px/18.85px; feedback 16px/23.2px; coach 16px with its existing normal line height. API key remains ui-monospace. Long note/feedback/coach drafts inspected without saving/sending. [Custom Note](fixes-evidence/custom-note.png), [Form Cues](fixes-evidence/form-cues.png), [Feedback](fixes-evidence/feedback-editor.png), [Coach](fixes-evidence/coach-editor.png) |
| Runtime/source | App loads and navigation works; no browser JavaScript errors reported. All seven inline scripts parse. `git diff --check` passes. Storage logic, schema/migrations, CSV code, seed data, service worker, and dependencies are unchanged. |

Color calculations use the browser-observed foreground/fill values and the audit's sRGB method. Secondary copy is **5.45:1** on page, **4.70:1** on picker rows, and **5.07:1** on the selected Default Load wash. Header identifying details are **5.99:1**, danger labels **6.90:1**, and band labels **4.67–10.98:1**. See [calculated results](fixes-evidence/contrast-results.json). These are color calculations, not whole-app accessibility certification.

Read-only before/after IndexedDB snapshots confirm every pre-existing record stayed identical: all 3,793 demo sets, 34 activities, 252 day notes, 479 session notes, and seven templates. Opening the existing notes surface added one empty session-note row in the disposable demo database; no prior record changed. The isolated non-demo database also stayed identical. Only aggregate verification is retained in [storage results](fixes-evidence/storage-verification.json); full snapshots remain outside the project.

Physical iPhone rendering/keyboard behavior and production deployment remain unverified by this local pass.
