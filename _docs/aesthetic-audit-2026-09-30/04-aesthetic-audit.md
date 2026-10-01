# Fitness visual identity audit

**Completed October 1, 2026.** Research and capture began September 30. Aesthetic review only; recommendations, not an implementation plan or functionality review.

**Verdict: the identity is coherent; its application is uneven.** Fitness already belongs beside Holden Flâneur and Carson Clean through warm dark grounds, deliberate mauve surfaces, restrained gold and tactile shapes. A palette overhaul is not supported. The strongest problems are faint foreground information, a few inappropriate foreground/background pairings, three dialogs escaping the phone frame, and prose editors falling back to monospace.

## Read this packet

- [Research brief and declared rubric](01-research-brief.md) — delivered before the rendered assessment; verified primary sources, conflicts and criteria.
- [Coverage matrix](03-coverage-matrix.md) — rendered states, partial coverage and exclusions.
- [Complete source surface/control inventory](02-source-inventory.md) — named screens, nested layers, controls, variants and source locations.
- [Screenshot gallery](evidence-gallery.html) — full-size linked captures.
- [Contrast measurements](contrast-evidence.md) — foreground/background values, compositing and remedies.

## What was inspected

The local `index.html` corresponding to commit `6532d0222f3d0e281b962b2d28262f6ee3cf73e7`, SHA-256 `38595c812101294ce38353cd031d1fcb8f364ceb34af29272ded7b3b17096de7`, was served unchanged to an isolated Chromium browser. Main captures use a **390×844 CSS-pixel** phone viewport. Targeted checks use **320×568** and **1000×844**. Sample Marcus Chen data and disposable audit-only entries supplied populated, empty, grouped and long-content states. Neither the real workout log nor the production site was modified.

Source census covered the named components, App modal branches, nested sheets, field-note registry, tour, transient messages and retired branches. Rendered inspection is broad but is **not every combination of data, state and device**. The matrix names what remains source-only. CSS/computed-color measurements are not physical-display or whole-app accessibility certification. No API key was used, feedback sent, merge committed, real reset executed or remote service called for coach output.

## The reference language

Actual local HF hub and Carson Clean artifacts were rendered, then compared with their source and design guidance. Their similarities do not make their brands identical.

| Dimension | Holden Flâneur | Carson Clean | Appropriate Fitness expression |
|---|---|---|---|
| Color temperature | Burgundy `#4A1525`, dark mauve `#2D1020`, near-black `#0A0506`, cream `#F0E6D3` | Related darks plus chocolate/brown and substantial cream sections | Current page `#1a0a12`, surface `#2a1520`, mauve `#8b3a62` are coherent relatives |
| Contrast | Restrained atmosphere with cream/gold focal points | Strong cream/dark section contrast and prominent commercial actions | Readable workout information first; atmospheric faintness should not obscure labels |
| Depth | Subtle warm raised layers and fine edges | Material dark surfaces, paper-like cream areas, light texture | Warm tonal layers and clear modal separation; no need to add texture or a light-card theme |
| Typography | Inter UI with DM Serif Display headings in source | Inter body/UI with Fraunces headings | Keep the utility system sans; carry over hierarchy, not a mandatory serif |
| Spacing | Compact tool modules inside calm larger containers | Roomier marketing composition | Preserve compact key grids and consistent phone rails |
| Shape | Rounded modules and pills | Current custom SVG corner plates alongside conventional fields | Fitness’s current fixed-pixel 20/26/30px plate family is a valid evolution |
| Icons | Sparse symbolic/gold accents | Custom artwork and selective gold controls | Keep the supplied scale, gear, lock, dumbbell, hand, question mark and plus/person artwork; judge optical legibility |
| Gold | Canon says punctuation/edge detail, not fill regions | Gold-filled actions are deliberate | Compact gold artwork on mauve is supported; neither project mandates a Fitness-wide gold rule |

References: [HF palette canon](</Users/cubicleaf/Documents/Holden Flaneur/HF-PALETTE.md>), [HF hub source](</Users/cubicleaf/Documents/Holden Flaneur/index.html:24>), [Carson stylesheet](</Users/cubicleaf/Documents/Carson Clean/assets/site.css:27>), [Carson current shape overrides](</Users/cubicleaf/Documents/Carson Clean/index.html:696>), [detailed source comparison](brand-reference-notes.md). Rendered examples: [HF hub](evidence/ref-holden-viewport.png), [Carson hero](evidence/ref-carson-hero.png), [Carson cream pricing section](evidence/ref-carson-pricing.png).

Tim’s September 30 filled-mauve and compact Add Activity choices outrank older radius and minimal-chrome defaults. The playbook v2.1.1 supplies context, not a replacement component system. No canon or ledger change is proposed.

## Evidenced findings

### F1. Supporting information is often faded below readable contrast

**Confirmed inconsistency — high confidence. Priority: high. R1, R2, R5, R8.**

The app’s strong activity names and numbers are followed by captions that almost disappear. These are enabled, informative labels, not disabled actions. The base soft-mauve color is often readable; transparency is what weakens it.

| Reproducible location / screenshot | Current treatment | Measured contrast |
|---|---|---:|
| Settings → Preferences: key-storage and model explanation ([25](evidence/25-settings-preferences.png)) | `#c77da0` at 55% over `#1a0a12`, 11–12px | **2.69:1** |
| Tap date → bodyweight “Last logged” ([37](evidence/37-day-detail.png)) | Soft mauve at 52%, 11px | **2.52:1** |
| Tap date → activity-list metadata ([37](evidence/37-day-detail.png)) | Soft mauve at 70%, 10px uppercase | **3.63:1** |
| Calendar weekday initials ([42](evidence/42-calendar.png)) | Soft mauve at 55%, 10px | **2.69:1** |
| Add Activity → All → “Long press to delete” ([47](evidence/47-picker-all.png)) | Soft mauve at 30%, 11px | **1.60:1** |
| Add Activity row → last-used caption ([47](evidence/47-picker-all.png)) | Soft mauve at 50% over the actual mauve row plate | **2.36:1** |
| Edit → Grip Tracking explanation ([18](evidence/18-grip-dialog.png)) | Soft mauve at 55%, 12px | **2.69:1** |

These small text samples need **4.5:1** under the brief’s W3C criterion. The full measurement table records computed styles and composited colors; covered background text is excluded.

**Desired appearance:** supporting information should be quieter than activity names through size and weight, while remaining plainly legible. On the measured page/row backgrounds, existing opaque `--text-faint: #9a8290` gives **5.45:1 / 4.70:1**. Opaque `--accent-soft: #c77da0` gives **6.27:1 / 5.41:1**. Use these as role-specific starting points and recheck brighter selected fills separately. Do not globally make every label the same color.

**Separate size issue:** calendar initials and day-list metadata are 10px; the reps LOAD caption is 9px. These fall below Tim’s recorded **Fitness-specific 11px floor**. Restore at least 11px and recheck wrapping. This is an internal preference inconsistency, not a WCAG minimum-font-size claim. Source: [weekday style](</Users/cubicleaf/Documents/Fitness-git/index.html:416>), [day metadata](</Users/cubicleaf/Documents/Fitness-git/index.html:1102>), [picker caption](</Users/cubicleaf/Documents/Fitness-git/index.html:1547>).

### F2. Essential header artwork is too dark against its own surface

**Confirmed inconsistency — high confidence. Priority: high. R2, R6, R8.**

[Resting header evidence](evidence/103-header-resting.png). Bodyweight, Today, coach and settings use `#8b3a62` with `opacity: .78` on an 8%-mauve/page blend. Their main foreground mark measures about **2.00:1**. Removing opacity alone only reaches **2.51:1**.

The supplied assets fit the brand, but the identifying parts recede too far. Essential non-text identifying detail needs 3:1; the small Today label needs 4.5:1. Decorative portions of duotone artwork need not all meet the same threshold. The app-name treatment is not separately asserted as a WCAG failure because logotype exceptions may apply.

**Desired appearance:** preserve mauve faces and the artwork, while using a brighter opaque foreground for the essential identifying details. Existing opaque `#c77da0` reaches **5.99:1** on the measured header; `#9a8290` reaches **5.20:1**. This does not justify replacing the icons or turning the whole header gold. Source: [header styling](</Users/cubicleaf/Documents/Fitness-git/index.html:905>).

### F3. White labels fail on several bright semantic fills

**Confirmed inconsistency — high confidence. Priority: high. R1, R2, R8.**

[Delete confirmation](evidence/23-delete-confirmation.png), [reset enabled](evidence/34-reset-enabled.png), [band colors](evidence/107-band-colors-measured.png).

The Delete button pairs 14px white text with coral `#ff6b6b`: **2.78:1**, below 4.5:1. The same bright-danger pairing is also visible in the reset controls. Band buttons use 12px white labels; six of eight measured fills fail: Red **3.82**, Green **2.87**, Blue **3.15**, Orange **2.85**, Yellow **2.19**, Gray **3.48**. Black **10.98** and Purple **4.67** pass.

These colors have legitimate semantic roles. The problem is the foreground pairing, not that blue/green/red exist in a warm app.

**Desired appearance:** keep the current danger fill and use `#1a0a12` text (**6.90:1**), or preserve white text and darken the fill to `color-mix(in srgb, var(--danger) 65%, var(--bg-page))` (**5.42:1**). For band choices, use page-dark text on the six brighter fills, retaining white on Black and Purple. Exact ratios are in the measurement appendix. Cream text on the present coral would reduce contrast further. Source: [danger pairing](</Users/cubicleaf/Documents/Fitness-git/index.html:2125>), [band styles](</Users/cubicleaf/Documents/Fitness-git/index.html:2168>).

### F4. Three edit dialogs break the app’s phone-frame composition

**Confirmed inconsistency — high confidence. Priority: medium. R3, R7.**

From an expanded daily activity → Edit, inspect [Grip Tracking](evidence/18-grip-dialog.png), [Change Type](evidence/21-change-type.png), and [Default Load](evidence/22-default-load.png). Their cards sit against the top edge. At **1000px desktop width**, the Grip card appears at x=20 outside the centered phone column: [desktop evidence](evidence/20-grip-desktop.png). The other two branches share the same unpositioned inline-card structure; their desktop placement is source-supported, while the desktop screenshot specifically verifies Grip.

Top alignment alone can be a valid design choice. The confirmed break is that these compact editing cards do not follow the app’s established containment and overlay family. They behave visually unlike the centered [bodyweight editor](evidence/40-bodyweight-provisional.png), [field note](evidence/19-grip-field-note.png), and [confirmation](evidence/23-delete-confirmation.png).

**Desired appearance:** use one deliberate card placement for these three: a centered card of at most **340px**, with at least **20px side clearance**, inside the phone composition. If top anchoring is preferred, anchor them within that same phone column with a consistent top inset. Preserve their warm fill and borderless outer edge. Sources: [Grip](</Users/cubicleaf/Documents/Fitness-git/index.html:17274>), [Type](</Users/cubicleaf/Documents/Fitness-git/index.html:17382>), [Load](</Users/cubicleaf/Documents/Fitness-git/index.html:17487>).

The ordinary shared confirmation was suspected from source but tested correctly centered: 280×136 at x55/y354 in a 390×844 view. **No confirmation-position defect is reported.**

### F5. Prose changes typographic voice when it becomes editable

**Confirmed inconsistency — high confidence. Priority: medium. R5.**

[Custom Note with long text](evidence/16-note-long.png), [feedback editor](evidence/29-feedback-editor-long.png), [coach draft](evidence/96-coach-draft.png), compared with the sans-serif [read-only note popup](evidence/79-history-note-popup.png).

Custom Note’s computed font is **monospace, 14px, 21px line height**. Feedback and coach textareas likewise visibly take on the browser’s monospace appearance. Surrounding labels and reading views use the app’s utility sans. The source specifies size/color without consistently assigning the prose field’s font family. It looks like a different text system has appeared inside the same task.

**Desired appearance:** ordinary prose editors inherit the existing utility sans; keep their current size/line-height initially. Review Custom Note, Form Cues, feedback and coach together. Monospace can remain a deliberate choice for a literal API key or technical content; do not impose a new font on the entire app. Sources: [Custom Note](</Users/cubicleaf/Documents/Fitness-git/index.html:13146>), [feedback textarea](</Users/cubicleaf/Documents/Fitness-git/index.html:10281>), [base form style](</Users/cubicleaf/Documents/Fitness-git/index.html:1826>).

### O1. Decide whether explanatory notes should retain their fine contour

**Optional direction — not a defect. R3, R4.**

The shared [field-note card](evidence/19-grip-field-note.png) retains a fine edge and gradient, while bodyweight and ordinary compact confirmations are borderless. This can legitimately distinguish explanatory content. It could also be residual styling outside the September 30 border-removal selectors.

Two defensible choices: **keep that contour consistently for all four field notes**, or **make their outer edges borderless to match the compact-card family**. Do not remove it solely because Carbon, Fluent or an older playbook example has a different border convention. Source: [FieldNoteModal](</Users/cubicleaf/Documents/Fitness-git/index.html:12796>).

## What did not become a finding

- **No confirmed brand mismatch requiring recoloring.** Fitness’s plum/mauve is a supported independent application of the references.
- The isolated `#7b93f5` note tag is inside an explicitly false-gated legacy Day Detail branch. It is **not a visible palette defect** in the current app.
- The small `#555` drag handle and `#d8aa55` versus `#D4A853` gold variation do not warrant their own repair work without stronger visual evidence.
- Mixed filled/outlined icons are supported by the supplied artwork. No universal stroke-width replacement is proposed.
- Pure white selected text and near-black shadows are not automatically brand violations. White is sometimes needed for contrast; dark shadows are appropriate here.
- A card edge need not reach 3:1 merely because it is visible. The contrast rule applies to required information and essential component/state detail, with its exceptions.
- Sampled numeric-key presses retained their corner silhouette. Held keys acquire their intended accent edge; no square-corner flash was established in those samples. This does not certify every animation frame or iPhone rendering.
- Merge wording, API behavior, navigation, screen-reader operation and touch-target engineering were not expanded into this aesthetic report.

## Decision guide

### Fix now

1. **Restore readable secondary information.** Calendar weekdays, day metadata, picker captions/last-used dates, settings explanations, grip explanations and similar enabled copy: use opaque role-specific warm text, retaining hierarchy through size/weight. Restore the documented 11px caption floor. The measured opaque palette tokens already supply passing alternatives.
2. **Brighten essential header details.** Keep the existing SVGs and mauve faces; make identifying foregrounds readable. Removing opacity from the current dark accent is insufficient.
3. **Correct bright-fill label pairings.** Delete/reset and six band buttons: use the foreground/background combinations in F3. Keep semantic colors.
4. **Contain Grip, Type and Default Load cards.** Keep them in the centered phone composition; use one deliberate compact-dialog placement.
5. **Make prose editors use the app’s sans-serif voice.** Apply consistently to notes, form cues, feedback and coach; preserve deliberately technical typography where justified.

### Choose a direction

- **Field-note edges:** retain the fine contour as a deliberate explanatory-card treatment, or bring all four notes into the borderless compact-card family.
- **Danger emphasis:** dark text on the current coral preserves today’s bright warning; white on a darker derived red is visually quieter. Both measured alternatives pass. This is the taste decision within a required contrast correction.

### Leave as is

- Warm plum page/surface palette and filled mauve controls.
- The centered **168×56 Add Activity** button with gold plus/person artwork.
- Fixed-pixel squircle geometry and the compact number-grid rhythm.
- Gold date/artwork punctuation, supplied icon assets and the question-mark field-note trigger.
- The utility sans-serif baseline, borderless primary modal shells and clear large number hierarchy.
- Current neutral empty-day composition; it does not need a decorative illustration or a large replacement CTA.

**Scope ends here.** No code, palette, canon, deployment or real workout-data changes were made by this audit. The report does not turn recommendations into accepted design decisions.
