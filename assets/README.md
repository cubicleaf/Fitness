# Fitness SVG assets

## Clarity Ring

**Shared name: Clarity Ring.** The organic circle around the note count in Master Reader → Progress & Clarity → feedback notes modal.

- Artwork: [`clarity-ring.svg`](clarity-ring.svg).
- Offline app component: `IconClarityRing` in [`index.html`](../index.html), with `size` (default 28px), `stretch` (default false), and `style` props.
- Source: [`pc-count-circle` in Master Reader's viewer](../../Master-Reader/viewer/index.html). Copied on 2026-10-07 without changing the path or its `0 0 78 78` viewBox.
- `currentColor` supplies the ring color. The original notes footer applies 0.68 opacity to the ring; opacity belongs to the host, rather than being baked into the artwork.
- Center and outer edges are transparent. The original shape stays square by default; `stretch: true` deliberately elongates it for wider content. Place a number or small glyph over its center when needed. It supplies its own outline, so a ring control should not add another visible border or backing. Interactive hosts still need a labeled 44px minimum touch target.
- First Fitness placement: the weight stepper has four circular adjustment rings and the **Clarity Squircle** around its editable value, with equal 10–14px gaps. The value includes the unit; below 351px the unit sits beneath the number inside the frame. Existing question-mark field notes continue to use `IconFieldNote`.

Say **“use the Clarity Ring around …”** to identify this exact artwork in future changes.

[Preview at 28, 38, and 44px](../_docs/clarity-ring-2026-10-07/preview.png). Verified the actual inline component at all three sizes: inherited color, transparent center, and no browser errors. The SVG asset and inline component both match the original source path exactly; all seven app scripts pass syntax checks.

## Clarity Squircle

**Shared name: Clarity Squircle.** The organic squircle in option A, selected by Tim on 2026-10-07 for the middle weight control. Its flatter top and bottom bridge the original Clarity Ring and Fitness’s rectangular squircles.

- Artwork: [`clarity-squircle.svg`](clarity-squircle.svg), inlined as `IconClaritySquircle` for offline use.
- The exact approved path uses a `0 0 116 56` viewBox with a transparent center and `currentColor` outline. A non-scaling stroke keeps the outline at 4px as the control width changes, avoiding the heavy ends of the stretched circle.
- The host supplies dimensions and opacity. Current weight-field height is 56px; four side circles and spacing are unchanged.

[Current weight-control preview at 390px](../_docs/clarity-ring-2026-10-07/organic-fixed-controls-390.png) · [320px preview](../_docs/clarity-ring-2026-10-07/organic-fixed-controls-320.png). Checked equal spacing, full touch targets, 4px non-scaling stroke, no added backing or overflow at 320/390/430/1000px, button and keyboard adjustment, decimal input, whole-frame input focus, logging, and reload persistence. Local and not deployed. Earlier elongated-circle trial captures are retained in the same folder.

## Field-note question mark

[`question-field-note.svg`](question-field-note.svg) is the supplied field-note artwork, inlined as `IconFieldNote`. See the project guidance in [`CLAUDE.md`](../CLAUDE.md).
