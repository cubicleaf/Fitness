---
name: favorite-recipe-in-wdm
description: Use as a companion loader with mockup-in-wdm when the user approves, favorites, locks in, or asks to preserve a UI effect, animation, shape, layout, or visual direction. It records the complete source-faithful visual and code recipe in Web Master so a fresh model can recreate the decision exactly, while keeping generic mockup exploration unchanged.
---

# Favorite Recipe in WDM

This is a focused companion to `mockup-in-wdm`, not a replacement for it. Use it when a visual decision has been approved as a favorite or when the user explicitly asks to preserve it for future recreation.

## Workflow

1. Load and follow `mockup-in-wdm` first. Use its permanent WDM Projects-module structure, source-faithful tokens, isolated class prefix, technical card, controls, and validation rules.
2. Inspect the live source and the complete visual context before recording anything. A favorite is not an isolated button or effect if its meaning depends on a header, navigation, card, sibling content, CTA, viewport, or surrounding layout.
3. Separate candidate from favorite. Keep an exploration or comparison labeled as a candidate until the user approves it. Do not silently overwrite an existing favorite; add a dated revision or ask which record should become canonical.
4. Record every value that could affect recreation, using exact source values wherever possible:
   - component/DOM target, structure, class names, and state/visibility rules;
   - colors as tokens and resolved values, gradients, borders, opacity, transparency, shadows, and blend behavior;
   - typography: family, size, weight, line-height, letter-spacing, casing, and text color;
   - geometry: width, height, min/max constraints, padding, gaps, alignment, grid/flex rules, radii, stroke widths, and responsive breakpoints;
   - asset identity, inline SVG markup or path, `viewBox`, fill/stroke, sizing, placement, and rotation;
   - motion: trigger, duration, delay, easing, iteration count, direction, fill mode, transform origin, keyframes, filter, opacity, and compositing;
   - interaction and accessibility: pointer/keyboard/touch behavior, focus treatment, hit target, `prefers-reduced-motion`, and what remains static;
   - viewport assumptions and any browser/device constraints that materially change the result.
5. Add a permanent WDM module with a unique class prefix. Render the whole source-faithful screen or frame needed to understand the favorite, not a generic approximation. Buttons may remain inert except for the one interaction that the favorite demonstrates.
6. Give every deliberately tuneable property a live control when the mockup is an exploration. The signed-off recipe must still show the exact default value, units, easing, and fallback even if the control is later removed.
7. Include an exact spec table and a compact code recipe. The recipe must be sufficient for a fresh model with no conversation context to reproduce the result without guessing or substituting “close enough” values.
8. Update the relevant project `STATUS.md`, `wdm-STATUS.md`, and `webdev/_docs/concept-log.md` when the favorite changes a settled design direction or teaches a reusable technique. Do not regenerate generated triage output.
9. Validate the WDM template balance, inline-script syntax, source-token fidelity, full-screen visual coverage, and reduced-motion behavior before handoff.

## Guardrails

- The source app remains the authority for production behavior and tokens; WDM is the inspectable record and exploration surface.
- The favorite record preserves the user’s decisions, not the model’s taste. If a value is unknown, mark it unknown and inspect the source or ask rather than inventing it.
- Keep generic `mockup-in-wdm` behavior generic. This skill supplies the “capture and preserve every detail” layer only.
- Keep the demonstrated interaction narrow. A favorite pulse should not accidentally make unrelated navigation, controls, or modals functional.
- Preserve reduced-motion and offline-safe behavior. Never depend on an external image, CDN, or network request when the source app is offline-safe.
