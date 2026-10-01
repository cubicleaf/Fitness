**Supporting notes — September 30, 2026.** Source candidates are superseded by the rendered verdicts in [the final audit](04-aesthetic-audit.md). Not new implementation guidance.

# Fitness aesthetic audit — reference/conformance lens

Scope: source-grounded comparison, read-only; no rendered inspection performed by this agent. All line citations refer to actual files under `/Users/cubicleaf/Documents`. Root agent must corroborate visible findings in its browser pass. No functionality findings. Canon v2.1.1; generated skill and live PLAYBOOK agree. Fitness previously triangulated July 16, before current project-intent framing and recent squircle decisions (corpus/LEDGER.md:38–40).

## Classification and governing decisions

Fitness is a phone-first workout utility / daily-tool surface, under the playbook's exploratory/reference family, with very short in-task reading. It is not HF's literary brand experience or Carson Clean's conversion site. Fitness INTENT.md:11–21 supports that task context. Current direction is authoritative: Fitness STATUS.md:61–65 says borderless modal edges; compact centered 168×56 mauve Add Activity with gold artwork; filled fixed-pixel squircles 20/26/30px; no palette overhaul. Shape recommendations should preserve these choices.

## Supported reference traits

| Axis | Holden Flaneur actual/canon | Carson Clean actual | Appropriate Fitness inheritance |
|---|---|---|---|
| Temperature | Burgundy #4A1525, Dark Mauve #2D1020, Near-Black #0A0506, Muted Rose #4A2035; HF-PALETTE.md:12–17; index.html:24–29 | Same core family plus chocolate #241512/#2E1B15, pale gold #E9C97E, cream #F0E6D3 and brown ink #2C1A12; assets/site.css:27–40 | A related warm dark family, not obligatory matching hexes. Fitness's #1a0a12 page and #2a1520 surface are already coherent relatives. |
| Accent | Gold #D4A853 explicitly sparse punctuation, never a fill; HF-PALETTE.md:16,36. Atmosphere tones do not carry categories, lines 19–27 | Gold fills are explicit: site.css:87,126; current index.html:979,1014,1180. Burgundy ink on cream; index.html:1495 process number plate is burgundy/gold | Preserve mauve as action/surface family with gold selectively marking key artwork/date. Do not import either an HF-wide ban on fills or Carson's gold-filled booking CTA. |
| Surface | Dark ground with three subtle warm raised levels #170d14/#1e1219/#251722; index.html:38–41. Quiet radial atmosphere 64–67; warm/gold fine edges 44–46 | Dark hero + cream sections; site.css:156–160,209–216. Current panel #F2E9D2 (index.html:485), phone cards #F8EDDA (2275), 2.2% fine noise (site.css:55–58). Dark modal #160e07 (index.html:709) | Disciplined surface ladder with restrained depth; no need for paper sections, noise, or photographic/metallic hero effects between sets. Borderless sheets match explicit Fitness choice. |
| Type | Inter UI; DM Serif Display headings; index.html:70,85,102–106,199–200 | Inter UI/body, Fraunces display; site.css:3–22,50,60,77,116 | Role-based, consistent hierarchy. Fitness system sans is appropriate; shared taste is not a mandatory serif or Inter font. |
| Spacing | Compact tool pills, module headers, and fine metadata within calm larger containers; index.html:111–117,182–205 | Roomy marketing rhythm, current 1.35rem horizontal rail (index.html:476,500), large headline and cream sections | Compact related controls inside a consistent phone rail. Do not transfer marketing-page air wholesale. |
| Shape | Conventional radii 12/8/20, index.html:54–56 | Base 12/8/20 in site.css:42 is superseded in many components by fixed-corner SVG plates: index.html:696–710,901–921,1174–1182,3709 onward | Fitness's 20/26/30 fixed-corner plates are a deliberate, current relative of Carson geometry, not an arbitrary violation of the older playbook radius examples. |
| Icons | Restrained gold glyphs (index.html:198); canon establishes no specific icon family | Custom SVG/brand artwork + gold control treatment; current source explicitly makes modal close transparent with gold artwork (index.html:946) | Preserve supplied SVGs. Assess optical weight and color by role rather than enforce one upstream icon vendor. |

Important reference conflict: HF actual hub uses small gold fills for active dock dots and tinted pills (index.html:168,269), even though canon says never fill regions. These tiny signifiers are not grounds to relax the canon for large HF fields, nor to impose it on independent Fitness. Use canon for HF identity and actual artifact for observed expression, labeling discrepancy rather than silently flattening them.

## Findings/candidates for rendered confirmation

### 1. Metadata has drifted below Tim's documented Fitness text floor [CONFIRMED SOURCE; rendered corroboration needed]

Class: confirmed internal inconsistency, likely highest-priority reference finding. July 16 Fitness audit records Tim selecting an 11px floor (SKILLs/ux-playbook/corpus/LEDGER.md:38,56). Current active CSS has:
- Calendar weekday labels: `10px`, accent-soft at 55% opacity; Fitness index.html:416–424.
- Split/day activity metadata: `10px`, accent-soft at 70%, 0.065em uppercase tracking; index.html:1102.
- Load/Grip picker captions: `9px`, accent-soft at 62%, uppercase; index.html:1547–1555; PickerChip renders that class at 7416 when not compact.

The reason is not that all labels in all interfaces require 11px. This is a documented project floor plus diminished luminance on an already dark field. Verify actual used selectors and contrast in the browser. Recommendation: restore captions to at least 11px; use a solid appropriate text token that meets declared contrast rather than compounding opacity. Do not mechanically enlarge all metadata without checking line breaks.

### 2. Cool blue tags remain in Day Detail history [CONFIRMED SOURCE; reachability unverified]

Class: brand mismatch/internal palette drift if reachable. DayDetailModal (starts 12087) renders history note tags with mauve-tinted background but `#7b93f5` text, 11px at 12529. History branch begins 12490. This isolated periwinkle lacks a declared semantic role, unlike danger red. It contradicts the warm palette established by both references and July 16 removal of decorative blue/yellow/teal set colors. Reproduce: Day Detail → activities/history state containing a session note with tags. If no current path renders that branch, mark source-only, not a user-visible defect. Desired appearance: same warm tag treatment as comparable note labels, e.g. `--accent-soft` or `--text-body` depending on contrast.

### 3. Day Detail drag handle is a remaining cool neutral [CONFIRMED SOURCE; minor]

DayDetailModal handle at index.html:12277–12284 is 40×4, #555. Elsewhere warm neutral-dark #3d2e35 exists. This is a small decorative remnant, not a severe readability failure. Warm it to a consciously chosen handle token only if visibly detached; don't create a palette overhaul for it.

### 4. Inconsistent gold sources are a consolidation option, not automatically a defect

Daily date `.day-date` #D4A853 at 1046; Add Activity artwork #d8aa55 at 2283; warning fallback #d4a853 at 13949–13951. Tiny gold variation is not demonstrated perceptually harmful. Optional direction: define an explicit gold role token to prevent future drift, retaining current appearance unless Tim chooses a specific canonical shade. Do NOT cite source duplication alone as aesthetic defect.

### 5. Icon-family mix is not by itself a defect

Base Feather icon strokes are 2px on 24 viewBox (2611–2619), while supplied settings/scale/calendar and bodyweight are filled/duotone/custom assets (2830–2965). Add Activity stretching artwork intentionally has partial opacity and reinforced strokes (2880–2899). Recent STATUS explicitly requested supplied artwork, solid scale face and heavier gear/person details. Therefore recommendations may normalize optical size or weight only where the rendered pair is visibly unbalanced; replacing all icons with Feather or uniform strokes would contradict current direction. Field-note supplied question SVG is specifically required by Fitness CLAUDE.md.

## Source interpretation traps

- Final filled-control overrides at Fitness index.html:2229–2260 supersede many earlier outline/button declarations. Judge computed appearance, not earlier CSS alone.
- Auto-plating at 17967–18042 transforms filled buttons/rows to fixed-corner SVGs, skips circles, transparent fills, backgrounds with images and explicit existing plate controls. Old border-radius literals do not prove rendered inconsistency.
- Forms still intentionally have CSS radius 20 at 2258–2260; no direct evidence these must be the same primitive as every plate. If visually oval at differing widths, judge geometry from render.
- Pure white selected labels occur throughout. Since small pale text on colored fill may be a deliberate luminance choice, don't call each #fff a brand failure absent visual evidence. Creamifying can lower contrast.
- Black shadows (136,1582,2059,12669,12830) are mechanical candidates only. On warm dark backgrounds they can be visually neutral depth; don't prioritize them over visibly weak content.
- The app's current palette includes purpose-labeled danger red. HF's only-gold accent law is project-specific and must not ban semantic error/destructive colors in Fitness.

## Verdict for parent synthesis

The supported direction is evolutionary: keep warm plum fields, filled mauve plates, restrained gold artwork, borderless modal silhouettes, and system sans. The strongest likely aesthetic fixes are faint/small metadata and any visibly surviving cool note-tag styling. Source doesn't support a palette overhaul, serif restyle, generic minimal-chrome reversal, or global icon replacement. No new canon promotion proposed; this is a narrow audit applying established context, not evidence sufficient to change the playbook.
