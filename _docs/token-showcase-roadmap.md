# Token Showcase Roadmap
### Fitness Tracker — Color System Decision Tool
*Created: April 13, 2026*

---

## What This Is

A spec for building a single-file interactive HTML page. The page presents 6-8 complete color token systems for the Fitness Tracker app. Each system is a full palette — not just a swatch, but every color the app needs — shown in the context of a realistic mini-app mockup. The user (Tim) switches between palettes to compare how each one feels in situ, then picks one (or frankensteins pieces from several) to implement in the real app.

**Prior art:** Two showcases already exist in `learning htmls/`:
- `color-palette.html` — Vertical palette cards with mini-app mockups per palette
- `color-showcase.html` — Tab-based layout with scheme selector pills, swatch grids, and phone-frame mockups

This new showcase should combine the best of both: the interactivity and tab structure of `color-showcase.html` with the side-by-side comparison power of `color-palette.html`, plus a new **token inspector** section that teaches the `:root` / `var()` system by showing the actual CSS you'd paste into the app.

---

## Design Constraints

- Single HTML file, no build system, no external dependencies except system fonts
- 420px max-width, mobile-first, same dark "frame" as the existing showcases
- Frame background: `#0a0a0a` or `#111` (neutral dark, NOT the app's burgundy — the frame must be neutral so palette comparisons aren't biased by their own background)
- Tim's playbook rules apply to the showcase UI itself: 44px touch targets, no bounce animations, warm shadows, `scale(0.95)` press feedback, transitions 0.2-0.3s
- No emojis anywhere

---

## The Current Color System (Baseline)

Everything below is what the app uses today. All hardcoded, zero CSS variables. This is "Palette 0" — the comparison baseline.

### Core Colors

| Role | Current Value | Occurrences | Notes |
|------|---------------|-------------|-------|
| Background (page) | `#1a0a12` | ~5 | Radial gradient center/edges |
| Background (surface) | `#2a1520` | ~3 | Confirmation dialogs, cards |
| Accent (primary) | `#8b3a62` | 69 | Buttons, borders, highlights, active states |
| Accent (dark) | `#6e2d4e` | ~3 | Button `:active` press state |
| Accent (gradient end) | `#a04574` | ~2 | Timer button gradient |
| Text (primary) | `#e0e0e0` | 18 | Headings, body text, form inputs — COOL GRAY, playbook violation |
| Text (secondary) | `#c77da0` | ~10 | Timer display, secondary labels |
| Text (muted) | `rgba(199, 125, 160, 0.5)` | 15 | Section titles, meta text, chevrons |
| Text (placeholder) | `#666` | 18 | Input placeholders, empty state — COOL GRAY |
| Surface wash | `rgba(139, 58, 98, 0.08)` | 69 | Background for inputs, cards, nav bars |
| Border | `rgba(139, 58, 98, 0.2)` | ~40 | Borders on inputs, cards, dividers |
| Border (stronger) | `rgba(139, 58, 98, 0.3)` | ~20 | Stronger borders, secondary buttons |
| Overlay (modal) | `rgba(0, 0, 0, 0.4)` | ~2 | Modal backdrop — PURE BLACK, playbook violation |
| Danger | `#ff6b6b` | ~3 | Delete buttons, danger confirm |
| Danger (active) | `#ff5252` | ~1 | Delete button press |

### Set Box Cycle Colors (Decorative — No Semantic Meaning)

| Index | Current Value |
|-------|---------------|
| 0 | `rgba(67, 97, 238, 0.3)` — blue |
| 1 | `rgba(255, 209, 102, 0.3)` — yellow |
| 2 | `rgba(76, 201, 240, 0.3)` — teal |

### Mood Gradient Stops

| Position | Color | Feel |
|----------|-------|------|
| 0% | `#F4A5AE` | Rough / red-pink |
| 25% | `#F4C2A1` | Low / peach |
| 50% | `#F5E1A4` | Neutral / yellow |
| 75% | `#A3D4E8` | Good / blue |
| 100% | `#A8E0C2` | Great / green |

### Banded Resistance Colors (Functional — Map to Physical Bands)

These are fixed by real-world band colors and should NOT change across palettes:
`#e74c3c` red, `#2c3e50` black, `#9b59b6` purple, `#27ae60` green, `#3498db` blue, `#e67e22` orange, `#f39c12` yellow, `#7f8c8d` gray

---

## Token Architecture

Every palette must define all of these tokens. This is the contract — if a palette is missing a token, the showcase is incomplete.

```css
:root {
  /* === BACKGROUNDS === */
  --bg:              /* page background */
  --bg-surface:      /* elevated cards, dialogs */
  --bg-nav:          /* nav bar, modal headers */

  /* === ACCENT === */
  --accent:          /* primary interactive color: buttons, active states */
  --accent-dark:     /* button :active press */
  --accent-soft:     /* faint accent wash: input backgrounds, card fills */
  --accent-border:   /* accent-tinted borders */
  --accent-border-strong: /* stronger borders for secondary buttons */
  --accent-gradient-end:  /* second stop in button gradients */

  /* === TEXT === */
  --text:            /* primary text */
  --text-secondary:  /* secondary labels, timer display */
  --text-muted:      /* dim meta text, section titles */
  --text-placeholder:/* input placeholder, empty state */

  /* === OVERLAY === */
  --overlay:         /* modal backdrop */
  --shadow:          /* box-shadow color base */

  /* === SEMANTIC === */
  --danger:          /* delete, destructive actions */
  --danger-active:   /* danger button press */

  /* === SET BOX CYCLE === */
  --set-1:           /* first set color */
  --set-2:           /* second set color */
  --set-3:           /* third set color */
}
```

**Total: 20 tokens.** That's the full system. Every color in the app maps to one of these.

---

## Palette Definitions

Each palette below is a complete set of 20 token values. Build all of them into the showcase.

### Palette 0: Current (Baseline)

The app as it exists today. Include this as-is for comparison, even with the cool gray text. Label it "Current" with a small tag: "cool grays, no tokens."

```
--bg:              #1a0a12
--bg-surface:      #2a1520
--bg-nav:          rgba(139, 58, 98, 0.08)
--accent:          #8b3a62
--accent-dark:     #6e2d4e
--accent-soft:     rgba(139, 58, 98, 0.08)
--accent-border:   rgba(139, 58, 98, 0.2)
--accent-border-strong: rgba(139, 58, 98, 0.3)
--accent-gradient-end: #a04574
--text:            #e0e0e0
--text-secondary:  #c77da0
--text-muted:      rgba(199, 125, 160, 0.5)
--text-placeholder:#666666
--overlay:         rgba(0, 0, 0, 0.4)
--shadow:          rgba(0, 0, 0, 0.3)
--danger:          #ff6b6b
--danger-active:   #ff5252
--set-1:           rgba(67, 97, 238, 0.3)
--set-2:           rgba(255, 209, 102, 0.3)
--set-3:           rgba(76, 201, 240, 0.3)
```

---

### Palette 1: Warm Correction

Minimal change — same hues, but text shifted from cool gray to warm mauve/cream. The "what if we just fixed the playbook violations" palette. Everything else stays.

```
--bg:              #1a0a12
--bg-surface:      #2a1520
--bg-nav:          rgba(139, 58, 98, 0.08)
--accent:          #8b3a62
--accent-dark:     #6e2d4e
--accent-soft:     rgba(139, 58, 98, 0.08)
--accent-border:   rgba(139, 58, 98, 0.2)
--accent-border-strong: rgba(139, 58, 98, 0.3)
--accent-gradient-end: #a04574
--text:            #e8d0d8
--text-secondary:  #c77da0
--text-muted:      rgba(199, 125, 160, 0.45)
--text-placeholder:#7a5e68
--overlay:         rgba(26, 10, 18, 0.55)
--shadow:          rgba(26, 10, 18, 0.4)
--danger:          #e05555
--danger-active:   #cc4444
--set-1:           rgba(139, 88, 120, 0.35)
--set-2:           rgba(180, 140, 100, 0.3)
--set-3:           rgba(120, 160, 160, 0.25)
```

Label: "Warm Correction" — tag: "minimal change, fixes cool grays"

---

### Palette 2: Deeper Rose

Shifts the accent from dusty burgundy toward a richer, slightly warmer rose. Background deepens. More contrast between surface and page. Feels more "premium."

```
--bg:              #160810
--bg-surface:      #2c1424
--bg-nav:          rgba(160, 60, 100, 0.08)
--accent:          #a0446e
--accent-dark:     #7e3458
--accent-soft:     rgba(160, 68, 110, 0.08)
--accent-border:   rgba(160, 68, 110, 0.2)
--accent-border-strong: rgba(160, 68, 110, 0.35)
--accent-gradient-end: #b85580
--text:            #f0dce4
--text-secondary:  #d48aaa
--text-muted:      rgba(212, 138, 170, 0.45)
--text-placeholder:#6e4e5a
--overlay:         rgba(22, 8, 16, 0.6)
--shadow:          rgba(22, 8, 16, 0.5)
--danger:          #e05050
--danger-active:   #cc3e3e
--set-1:           rgba(160, 80, 120, 0.3)
--set-2:           rgba(200, 150, 100, 0.25)
--set-3:           rgba(130, 170, 180, 0.2)
```

Label: "Deeper Rose" — tag: "richer accent, more depth"

---

### Palette 3: Iron Ember

The "gym" palette. Warmer, earthier. Background shifts from purple-black toward a deep charcoal-brown. Accent moves from pink-burgundy toward a burnt copper. Feels grittier, more industrial.

```
--bg:              #141010
--bg-surface:      #241c1a
--bg-nav:          rgba(140, 70, 50, 0.08)
--accent:          #8c5a42
--accent-dark:     #6e4434
--accent-soft:     rgba(140, 90, 66, 0.08)
--accent-border:   rgba(140, 90, 66, 0.2)
--accent-border-strong: rgba(140, 90, 66, 0.3)
--accent-gradient-end: #a46a50
--text:            #e8dcd4
--text-secondary:  #b89080
--text-muted:      rgba(184, 144, 128, 0.5)
--text-placeholder:#6a5850
--overlay:         rgba(20, 16, 16, 0.55)
--shadow:          rgba(20, 16, 16, 0.4)
--danger:          #c45040
--danger-active:   #a84035
--set-1:           rgba(180, 120, 80, 0.3)
--set-2:           rgba(140, 160, 120, 0.25)
--set-3:           rgba(100, 140, 160, 0.2)
```

Label: "Iron Ember" — tag: "copper accent, earthy"

---

### Palette 4: Midnight Orchid

Cooler shift — the background goes bluer-black, the accent shifts toward a violet-plum. A moodier, more modern feel. Still dark, but the temperature is different.

```
--bg:              #0e0a14
--bg-surface:      #1e162a
--bg-nav:          rgba(100, 60, 140, 0.08)
--accent:          #7a4a98
--accent-dark:     #5e3876
--accent-soft:     rgba(122, 74, 152, 0.08)
--accent-border:   rgba(122, 74, 152, 0.2)
--accent-border-strong: rgba(122, 74, 152, 0.35)
--accent-gradient-end: #9060b0
--text:            #dcd0e8
--text-secondary:  #a888c0
--text-muted:      rgba(168, 136, 192, 0.45)
--text-placeholder:#5a4e66
--overlay:         rgba(14, 10, 20, 0.6)
--shadow:          rgba(14, 10, 20, 0.5)
--danger:          #d04858
--danger-active:   #b83c4a
--set-1:           rgba(120, 90, 180, 0.3)
--set-2:           rgba(180, 140, 200, 0.2)
--set-3:           rgba(100, 160, 180, 0.2)
```

Label: "Midnight Orchid" — tag: "violet accent, moody"

---

### Palette 5: Blood Iron

Maximum contrast, maximum intensity. The darkest background, the most saturated accent. Almost black with a deep crimson accent. Aggressive, high-contrast.

```
--bg:              #0c0606
--bg-surface:      #1a0e0e
--bg-nav:          rgba(160, 40, 50, 0.06)
--accent:          #a03040
--accent-dark:     #802530
--accent-soft:     rgba(160, 48, 64, 0.07)
--accent-border:   rgba(160, 48, 64, 0.18)
--accent-border-strong: rgba(160, 48, 64, 0.3)
--accent-gradient-end: #b84050
--text:            #e8dada
--text-secondary:  #c08888
--text-muted:      rgba(192, 136, 136, 0.45)
--text-placeholder:#604848
--overlay:         rgba(12, 6, 6, 0.65)
--shadow:          rgba(12, 6, 6, 0.5)
--danger:          #e04040
--danger-active:   #c83535
--set-1:           rgba(160, 60, 60, 0.3)
--set-2:           rgba(200, 140, 80, 0.25)
--set-3:           rgba(80, 140, 140, 0.2)
```

Label: "Blood Iron" — tag: "high contrast, crimson"

---

### Palette 6: Sandstone After Dark

The warmest option. Background is a deep warm brown, not black. Accent is a terracotta-gold. The closest to Tim's other projects (Zifang's warm palette) adapted for a dark theme. Feels like amber light in a dim room.

```
--bg:              #141008
--bg-surface:      #221c12
--bg-nav:          rgba(160, 120, 60, 0.06)
--accent:          #a08040
--accent-dark:     #806630
--accent-soft:     rgba(160, 128, 64, 0.07)
--accent-border:   rgba(160, 128, 64, 0.18)
--accent-border-strong: rgba(160, 128, 64, 0.3)
--accent-gradient-end: #b89050
--text:            #e8dcc8
--text-secondary:  #c0a880
--text-muted:      rgba(192, 168, 128, 0.45)
--text-placeholder:#6a5e48
--overlay:         rgba(20, 16, 8, 0.55)
--shadow:          rgba(20, 16, 8, 0.4)
--danger:          #c85040
--danger-active:   #b04035
--set-1:           rgba(180, 140, 60, 0.3)
--set-2:           rgba(120, 160, 100, 0.25)
--set-3:           rgba(100, 130, 160, 0.2)
```

Label: "Sandstone After Dark" — tag: "amber-gold, warmest"

---

### Palette 7: Smoke + Mauve

A more muted, desaturated version of the current palette. Same hue family but pulled back — less saturated accent, softer contrast. For when the burgundy feels too intense. Quieter, more "app-like."

```
--bg:              #14101214
--bg-surface:      #221c20
--bg-nav:          rgba(120, 70, 90, 0.07)
--accent:          #7a5568
--accent-dark:     #604452
--accent-soft:     rgba(122, 85, 104, 0.07)
--accent-border:   rgba(122, 85, 104, 0.18)
--accent-border-strong: rgba(122, 85, 104, 0.28)
--accent-gradient-end: #8e6578
--text:            #dcd4d8
--text-secondary:  #a89098
--text-muted:      rgba(168, 144, 152, 0.45)
--text-placeholder:#605458
--overlay:         rgba(20, 16, 18, 0.55)
--shadow:          rgba(20, 16, 18, 0.4)
--danger:          #c85555
--danger-active:   #b04545
--set-1:           rgba(120, 90, 110, 0.3)
--set-2:           rgba(160, 140, 120, 0.25)
--set-3:           rgba(100, 130, 140, 0.2)
```

Label: "Smoke + Mauve" — tag: "desaturated, quiet"

---

## Showcase UI Structure

### Layout

```
[Header: "Fitness Tracker — Token System"]
[Subtitle: "Compare palettes in context. Pick one, remix, or frankenstein."]

[Palette selector strip — horizontal scroll pills, one per palette]

[Tab bar: Mockup | Swatches | Tokens | Compare]

--- MOCKUP TAB (default) ---
  Mini phone frame showing the day view:
    - Nav bar with date + settings icon
    - Split tag pill ("Push Day")
    - 2 exercise groups with 3 set boxes each
    - "+ Add Set" and "+ Add Exercise" buttons
    - A mood slider at the bottom

  ALL colors in the mockup pull from the selected palette's tokens.

--- SWATCHES TAB ---
  Grid of all 20 tokens as labeled color squares.
  Each swatch shows:
    - Token name (e.g., --accent)
    - Hex/rgba value
    - Role label (e.g., "buttons, active states")

  Group them visually:
    - Row 1: Backgrounds (3 swatches)
    - Row 2: Accents (6 swatches)
    - Row 3: Text (4 swatches)
    - Row 4: Overlay + Shadow + Danger (4 swatches)
    - Row 5: Set colors (3 swatches)

--- TOKENS TAB ---
  Shows the actual CSS `:root` block you'd paste into the app.
  Syntax-highlighted (or at minimum, monospace with color highlights).
  A "Copy" button at the top that copies the block to clipboard.

  Below the code block: a plain-language explanation of what each
  token controls, written for someone who hasn't used CSS variables
  before. Group by category (backgrounds, accents, text, etc.).
  Keep explanations to 1 sentence each.

--- COMPARE TAB ---
  Side-by-side comparison of 2 palettes.
  Two dropdown selectors at the top: "Left palette" / "Right palette."
  Below: the same mini phone mockup rendered twice, side by side,
  each using its selected palette.
  At the bottom: a diff table showing which tokens changed between
  the two palettes, with colored "before → after" values.
```

### Interactions

- **Palette pills**: Tap to switch. Active pill fills with that palette's `--accent` color. Pill text shows palette name. Horizontal scroll if more than 4 pills visible.
- **Tab switching**: Content area crossfades (opacity 0→1, 0.2s) on tab change. No scroll reset.
- **Copy button** (Tokens tab): Copies the full `:root {}` block. Brief "Copied" confirmation that fades after 1.5s.
- **Compare dropdowns**: Standard `<select>` elements styled to match the showcase frame. Changing either dropdown re-renders its mockup.
- **Swatch hover/tap**: Shows a tooltip or inline expansion with the full rgba value and usage count from the current app.

### Animations (Showcase Frame)

Apply Tim's playbook to the showcase itself:
- Tab content: `opacity 0.2s ease-out` crossfade
- Pill selection: `background 0.2s, color 0.2s`
- Button press: `transform: scale(0.95)` instant on `:active`
- Copy confirmation: `opacity` fade in 0.15s, hold 1.5s, fade out 0.3s
- No bounce, no spring, no overshoot

---

## Mini-App Mockup Spec

The mockup must look like the real Fitness Tracker day view. It doesn't need to function — it's a static visual replica. But it must use all 20 tokens so every color is visible in context.

### Required Elements

```
┌──────────────────────────────┐
│ [settings icon]   Mon, Apr 14│  ← --bg-nav, --text, --accent (icon)
│              PUSH DAY        │  ← --accent (pill bg), --text (pill text)
├──────────────────────────────┤
│                              │  ← --bg
│  BENCH PRESS           ...   │  ← --text (name), --text-muted (menu)
│  ┌─────┐ ┌─────┐ ┌─────┐   │  ← --set-1, --set-2, --set-3
│  │135×10│ │155×8│ │155×7│   │
│  └─────┘ └─────┘ └─────┘   │
│  [ + Add Set ]               │  ← --accent-soft bg, --accent text,
│                              │     --accent-border border
│  INCLINE DB PRESS      ...   │
│  ┌─────┐ ┌─────┐            │
│  │40×12│ │45×10│             │
│  └─────┘ └─────┘            │
│  [ + Add Set ]               │
│                              │
│  ┌──────────────────────────┐│
│  │      + Add Exercise      ││  ← --accent bg, white text
│  └──────────────────────────┘│
│                              │
│  Mood: [====●───────────]    │  ← mood gradient (don't tokenize,
│                              │     keep as-is across all palettes)
│                              │
│  ┌──────────────────────────┐│
│  │ "Shoulder felt tight      ││ ← --bg-surface, --accent-border,
│  │  on incline"              ││    --text-secondary
│  └──────────────────────────┘│
│                              │
│  ── delete zone ──           │
│  [Delete] button visible     │  ← --danger, white text
└──────────────────────────────┘
```

### Token-to-Element Mapping

| Token | Where It Appears in Mockup |
|-------|---------------------------|
| `--bg` | Page background |
| `--bg-surface` | Note card, confirmation dialog |
| `--bg-nav` | Top nav bar background |
| `--accent` | Settings icon, split pill bg, "+ Add Exercise" button, active states |
| `--accent-dark` | Button press indicator (show a small "pressed" state) |
| `--accent-soft` | "+ Add Set" button background, input field backgrounds |
| `--accent-border` | Set box borders, input borders, dividers |
| `--accent-border-strong` | Secondary button borders |
| `--accent-gradient-end` | (Optional: gradient on main button) |
| `--text` | Exercise names, date, primary labels |
| `--text-secondary` | Set values inside boxes, note text |
| `--text-muted` | "..." menu icon, section labels |
| `--text-placeholder` | (Optional: show a search bar with placeholder) |
| `--overlay` | (Optional: small overlay preview strip) |
| `--shadow` | Box shadows on cards/buttons |
| `--danger` | Delete button |
| `--danger-active` | (Optional: show pressed state) |
| `--set-1` | First set box background |
| `--set-2` | Second set box background |
| `--set-3` | Third set box background |

---

## Build Notes for the Agent

### What to Prioritize

1. Get the Mockup tab working first — that's the primary decision tool
2. Swatches tab second — it's the reference view
3. Tokens tab third — it's the "take action" view
4. Compare tab last — it's a nice-to-have

### What NOT to Build

- Don't make the mockup interactive (no tapping exercises, no opening pickers)
- Don't add palette editing/customization sliders — this is a curated showcase, not a generator
- Don't import fonts — system font stack is fine for the showcase
- Don't use React or any framework — vanilla HTML/CSS/JS only
- Don't tokenize the mood gradient or banded resistance colors — those stay fixed

### CSS Variable Technique

Each palette should be defined as a JS object. When the user selects a palette, apply it by setting CSS variables on the document root:

```javascript
document.documentElement.style.setProperty('--bg', palette.bg);
document.documentElement.style.setProperty('--accent', palette.accent);
// etc.
```

The mockup and swatches reference `var(--bg)`, `var(--accent)`, etc. — so switching palettes instantly re-themes everything. This is the exact mechanism the real app would use.

### File Location

Save the built showcase to: `projects/Fitness/learning htmls/token-showcase.html`

### Quality Check

After building, verify:
- All 8 palettes render without broken colors (no missing tokens)
- The mockup uses all 20 tokens (no hardcoded colors in the mockup)
- The Tokens tab shows correct values for each palette
- Copy button works
- Compare tab shows both mockups simultaneously
- All touch targets in the showcase UI are 44px minimum
- No emojis anywhere

---

## How Tim Will Use This

1. Open the showcase on his phone
2. Swipe through palettes, looking at the mockup tab
3. Narrow to 2-3 favorites
4. Use the Compare tab to see them side-by-side
5. Open the Tokens tab on the winner
6. Copy the `:root` block
7. Paste it into `index.html` at the top of the `<style>` section
8. Begin replacing hardcoded values with `var(--token-name)` references

The showcase is both a decision tool and a learning tool. By the time Tim picks a palette, he'll understand what CSS tokens are, how they work, and how to use them — because the showcase demonstrates the exact mechanism the app will use.

---

*This roadmap is self-contained. An agent with access to only this file and the Fitness app's `index.html` has everything needed to build the showcase.*
