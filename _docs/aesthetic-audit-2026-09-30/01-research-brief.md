# Fitness visual identity — research brief and declared rubric

Prepared 2026-09-30, before the rendered Fitness assessment. Scope: visual identity and visual legibility only. This is a one-time audit artifact, not a new monitoring system. No implementation is authorized by this report.

## How evidence will be used

**Requirement** means a measurable WCAG visual criterion. **Guidance** means a design system’s documented recommendation, transferable with context. **Taste** means a project decision or reasoned aesthetic proposal; it cannot masquerade as an accessibility rule. Fitness is a phone-first utility used between sets. Its existing warm dark palette, filled mauve squircles, and compact 168×56 Add Activity action are current direction, while the exact correctness of individual colors remains open to examination.

All web sources below were retrieved on 2026-09-30. Unless explicitly dated below, the retrieved page exposed no reliable publication/revision date. Search-engine crawl dates are not publication dates. These are living documents, not evidence that every recommendation was newly published this year.

## Primary research

### 1. Text contrast — measurable requirement

[WCAG 2.2 Recommendation, 12 December 2024](https://www.w3.org/TR/2024/REC-WCAG22-20241212/), criterion 1.4.3, and [W3C’s explanatory contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) specify 4.5:1 for normal text, 3:1 for large text (24 CSS px regular or approximately 18.67 CSS px bold). Inactive controls, incidental text and logotypes have exceptions. Informative Understanding pages explain the normative standard; they are not separate standards.

**Fitness application:** evaluate labels, values, helper copy and placeholders against the actual background. Composite alpha and ancestor opacity; an approved token alone proves nothing. Normal 11–16px labels need 4.5:1. Disabled actions are inventoried but not mislabeled as failures. Ratios will not be rounded upward to pass.

**Conflict handling:** muted warmth is taste; readable contrast is measurable. Preserve hue where possible and adjust luminance. WCAG supplies no universal 11px minimum; Fitness’s own documented 11px floor is a project preference, assessed separately.

### 2. Essential icons and state marks — measurable requirement

[W3C: Understanding 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) requires essential component/state graphics to contrast 3:1 against adjacent colors. A button need not have a contrasting perimeter if sufficiently visible text or an icon already identifies the control. Inactive controls and decorative graphics are exempt in the relevant circumstances.

**Fitness application:** inspect essential arrows, selected markers, input cues and small action glyphs. Do not demand 3:1 for every decorative card edge, shadow, squircle perimeter or layer boundary.

**Conflict handling:** borderless mauve controls can be legitimate. Adding outlines everywhere would conflict with the latest Fitness direction and is not required by this criterion.

### 3. Warm dark surfaces can retain depth — documented guidance

[Apple HIG: Dark Mode](https://developer.apple.com/design/human-interface-guidelines/dark-mode) describes dimmer base surfaces and brighter elevated surfaces, checks assets in dark appearance, and recommends adequate foreground contrast. It recommends at least 4.5:1, with 7:1 an aspirational target for custom foregrounds, particularly small text. Page revision date not exposed.

**Fitness application:** check that sheets and dialogs separate from the page and that small imagery survives the dark ground. Use warm tonal steps where needed.

**Conflict handling:** Apple’s system colors, native adaptation APIs and platform appearance behavior are not requirements for this web app. Its 7:1 advice is a stretch target, not the AA failure threshold. This audit will not prescribe light mode, Liquid Glass, SF Symbols or replacing the supplied artwork.

### 4. Color should have stable roles — documented guidance

[Apple HIG: Color](https://developer.apple.com/design/human-interface-guidelines/color) advises consistent color meanings, sufficient differentiation, restrained emphasis and checking colors under different lighting and devices. The retrieved page includes Liquid Glass advice; that platform-specific treatment is not generalized into a rule for all colored buttons. Revision date not exposed.

**Fitness application:** compare primary actions, selected filters, disabled states, destructive actions, metadata and decorative gold. A color can serve a repeated interactive family; it need not identify exactly one action.

**Conflict handling:** a field of filled mauve keys is legitimate for a keypad. “Use accent sparingly” does not automatically forbid it. Physical iPhone/True Tone/gym glare remain separate evidence limits; desktop emulation cannot certify them.

### 5. Pair foreground roles with background roles — documented guidance

[Google’s official Material Components: Color theming](https://github.com/material-components/material-components-android/blob/master/docs/theming/Color.md) describes brand-customizable Material 3 themes and paired roles such as primary/on-primary and container/on-container, plus surface roles. Living repository documentation; the fetched view did not expose a latest-commit date. [Material 3 color roles](https://m3.material.io/styles/color/roles) was checked directly, but its JavaScript-only content was not readable in the research fetch, so claims here rest on the official implementation documentation.

**Fitness application:** assess text-on-mauve separately from text-on-page. A single foreground color is not presumed safe across every fill.

**Conflict handling:** adopt the role relationship, not Material’s baseline purple, three accent families, dynamic wallpaper palette or component geometry. Token refactoring is a possible future implementation, never an audit deliverable by itself.

### 6. Reusable layers and tokens — documented guidance

[IBM Carbon: Color overview](https://carbondesignsystem.com/elements/color/overview/) defines semantic color roles and progressively lighter added layers in dark themes. [Carbon: Themes](https://carbondesignsystem.com/elements/themes/overview/) explains that themes map reusable roles to brand-specific values. Both living pages; revision dates not exposed.

**Fitness application:** distinguish page, cards, inputs, nested sheets and confirmation panels. Record one-off shades, but only call them defects when their rendered role is inconsistent.

**Conflict handling:** Carbon’s neutral gray values and “lighter every layer” model belong to Carbon. Fitness can use inset darker fields and warm plum layers when their hierarchy remains clear. Borderless dialogs are compatible with clear tonal separation; no shadow system is mandated.

### 7. Elevation should communicate visual hierarchy — documented guidance

[Microsoft Fluent 2: Elevation](https://fluent2.microsoft.design/elevation) uses light and shadow to suggest relative depth and prominence, with consistent shadow direction. Living undated page.

**Fitness application:** inspect the combined surface, dimming scrim, shadow and surrounding content. Look for accidental halos or stacked shells around a self-contained icon.

**Conflict handling:** shadows are one option, not a required ingredient. Apple/Carbon emphasize tonal separation; Fluent emphasizes depth cues. The common principle is clear layering, achievable without copying any system’s effects or increasing visual noise.

### 8. Typography must express a repeatable hierarchy — documented guidance plus taste

[Fluent 2: Typography](https://fluent2.microsoft.design/typography) documents a type ramp and deliberate alignment, casing and color hierarchy. It includes very small captions; those sizes are not a universal recommendation for workout data. Living undated page.

**Fitness application:** compare titles, activity names, entered values, section labels, dates and supporting text by role; inspect line height, truncation and wrapping at phone widths.

**Conflict handling:** use Fitness’s purpose-specific utility sans and project 11px floor. Do not force Carson Clean’s Fraunces headings or the playbook’s Inter preference onto an otherwise consistent system-font app. A serif substitution is an optional redesign, never a compliance fix.

### 9. Repeated spacing establishes relationships — documented guidance

[Fluent 2: Layout](https://fluent2.microsoft.design/layout) uses proximity to group related information and a flexible spacing ramp; it explicitly allows optical exceptions rather than rigidly repeating numbers. Living undated page.

**Fitness application:** compare horizontal rails, key gaps, card internals and title/action alignment. Short and long content should retain the same visual rhythm.

**Conflict handling:** Fitness’s compact between-set density outranks roomy marketing defaults. A four-pixel grid is useful vocabulary, not a standard. Target size and navigation behavior are outside this strictly aesthetic audit; only resulting visual proportions are assessed.

### 10. Shape families should be deliberate — documented guidance plus taste

[Fluent 2: Shapes](https://fluent2.microsoft.design/shapes) defines shape through form, corner radius and stroke, using different treatments for rectangular elements, flyouts and pills. Living undated page.

**Fitness application:** compare equivalent rectangular controls at narrow/wide sizes and during presses. Verify that fixed-pixel corners retain their profile and do not sprout extra rectangular backgrounds.

**Conflict handling:** no researched standard mandates squircles or one radius everywhere. Fitness’s September 30 choices (20px numeric corners, 26px wider controls, 30px larger rows) are the aesthetic authority; older playbook radii are not grounds for reverting them. Circular icons, genuine pills and dial controls can remain exceptions.

### 11. Icons need optical consistency, not identical construction — documented guidance

[Fluent 2: Iconography](https://fluent2.microsoft.design/iconography) distinguishes regular and filled icon weights and advises size-appropriate detail and careful color use. Living undated page.

**Fitness application:** compare apparent size, line density, baseline and color on supplied scale, gear, lock, dumbbell, hand, plus/person and question-mark art. Compare daily/history counterparts directly.

**Conflict handling:** Fluent’s single-color system-icon convention conflicts with Tim’s intentionally gold/mauve supplied artwork; retain the artwork. Mixed fill/stroke construction is not itself a defect. Only visibly mismatched weight, alignment or indistinct details warrants a finding.

### 12. Spectrum — researched, not an enforceable source in this pass

[Adobe Spectrum: Using color](https://spectrum.adobe.com/page/using-color/) returned a 404 on direct retrieval despite an older indexed excerpt; [Platform scale](https://spectrum.adobe.com/page/platform-scale/) returned only a JavaScript shell. The indexed excerpts mention layering and mobile-specific icon sizing, but their current status could not be verified. No audit finding will depend on these excerpts. The directly verified systems above already support the relevant questions; popularity is not evidence.

## Brand authority and conflict order

Use current Fitness decisions first for aesthetic choices; use measurable visual requirements for legibility. Then use actual reference artifacts, their explicit canon, and Tim’s playbook v2.1.1. Existing source is evidence, not automatic approval. Older Fitness audit evidence predates the new squircle direction.

Holden Flâneur’s [palette canon](</Users/cubicleaf/Documents/Holden Flaneur/HF-PALETTE.md>) locks burgundy `#4A1525`, dark mauve `#2D1020`, near-black `#0A0506`, muted rose `#4A2035`, gold `#D4A853` and cream `#F0E6D3`; gold is punctuation, never fill **within HF**. Carson Clean’s actual [site stylesheet](</Users/cubicleaf/Documents/Carson Clean/assets/site.css>) adds brown material tones, cream sections, Fraunces headings and gold-filled calls to action. Thus the shared principle is warm grounds, readable light text and intentional gold emphasis, not a universal ban on gold fill or one identical palette. The final reference comparison will include rendered artifacts.

## Declared audit rubric

| ID | Question | Authority / verdict basis |
|---|---|---|
| R1 Palette and roles | Are color roles stable, warm and justified, including composited states? | Apple Color; Material roles; brand evidence. Guidance/taste. |
| R2 Hierarchy | Do size, fill, contrast and space consistently prioritize the same roles? | Fluent typography/layout; Apple Color. Guidance. |
| R3 Surfaces | Are nested layers clear, with intentional scrims, edges and shadows? | Apple Dark Mode; Carbon; Fluent elevation. Guidance. |
| R4 Shape | Do sibling controls keep the chosen squircle profile across size/state, without duplicate shells? | Fitness current decisions; Fluent shape vocabulary. Taste/coherence. |
| R5 Type | Are families, sizes, weights, casing and wrapping consistent by role? | Fluent typography; Fitness 11px preference. Guidance/taste. |
| R6 Icons | Are optical weight, alignment and gold/mauve treatments coherent? | Fluent iconography adapted to supplied art. Guidance/taste. |
| R7 Rhythm | Do rails, gaps and proportions hold on short/long and empty/populated phone views? | Fluent layout; Fitness utility intent. Guidance/taste. |
| R8 Legibility | Does normal/large text meet 4.5:1/3:1 and essential non-text detail meet 3:1, with proper exceptions? | WCAG 1.4.3 / 1.4.11. Measured requirement. |
| R9 Polish | Are there visible clipped corners, halos, flashes or state color jumps? | Repeated-render evidence against R2–R7 and current Fitness decisions. Observed coherence, not an invented external rule. |

Each finding will identify **confirmed inconsistency**, **brand mismatch**, or **optional direction**; give confidence, a screenshot or reproducible source-backed location; and cite these rubric IDs. Unreached states will remain explicitly unverified. No whole-app WCAG conformance claim follows from this visual-only review.
