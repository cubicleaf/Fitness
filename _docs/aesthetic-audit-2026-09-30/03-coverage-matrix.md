# Fitness aesthetic audit — coverage matrix

Capture period: September 30–October 1, 2026. Read with the [complete source inventory](02-source-inventory.md), which maps each screen, modal branch, field note, confirmation, empty state and shaped-control family to its source. This matrix records what was actually rendered. It deliberately does not imply every data permutation was reached.

**R** = rendered and inspected in the stated cases; **P** = some variants rendered, other listed variants unverified; **S** = source census only; **L** = legacy/unreachable in the current mounting path. Evidence numbers refer to filenames in the [gallery](evidence-gallery.html). A screenshot captures the visible viewport of internally scrolling modals, not necessarily all scroll positions.

## Environment and state coverage

| Dimension | Observed | Limit |
|---|---|---|
| Source | Unchanged local Fitness HTML at `6532d0222f3d0e281b962b2d28262f6ee3cf73e7` | Production deployment not separately compared in this run |
| Main phone | 390×844 CSS px, Chromium, mobile/touch context | Not physical Safari/PWA, keyboard, safe-area or True Tone verification |
| Small phone | 320×568 feedback view, including wrapped categories and long message | Not a full small-phone sweep of every surface |
| Desktop | 1000×844 Grip dialog vs centered phone app | Other dialog desktop extrapolations identified as source-supported |
| Data | Fresh empty origin, built-in Marcus sample, audit-only neutral activity with long name, bar activity, related group | No real personal records accessed |
| Rest/open/dismissed | Repeated actual navigation, sheets, overlays, tour steps | No exhaustive frame-by-frame animation recording |
| Pressed/released | Held reps key and held/released weight key (10, 104–106) | No every-control press matrix; intermittent physical-device flashes unverified |
| Selected/unselected | Settings, tabs, categories, bar type, grip, sound choices, merge keeper, feedback category | Every combination not enumerated |
| Disabled/enabled | Blank/filled related form, merge keeper, reset confirmation, feedback, coach draft, preset Add | Disabled controls excluded from normal contrast-failure claims |
| Loading/error | Actual demo Loading state and error after delayed 503 seed response (108–109) | Synthetic local network condition; no service or storage fault injected into real data |
| Long/short | Note text, feedback draft, long neutral activity heading, rename confirmation, grouped rows | Not every possible user-entered string |
| Empty/populated | Fresh empty day, sample populated day/history, empty month, Rest/no-activity list, no split, no search matches, new neutral history | Every historical combination not sampled |

## Daily log, navigation and bodyweight

| Surface / controls | Coverage | Rendered evidence | Remaining limits |
|---|---|---|---|
| App header: title, scale, Today/calendar, coach, gear | R | 03, 41, 103; computed header foreground/opacity logged | Icon construction retained; not every SVG subpath separately measured |
| Day strip: arrows, gold date, split caption | R | 03, 41, 44, 103 | Swipe motion not frame-recorded |
| Demo banner / Start my own | P | 03, 103 | Clearing busy state not captured |
| Bodyweight reminder | P | 01, 110 fresh empty | Gesture dismissal animation not captured |
| Empty daily view | R | 41 today; 44 future day; 110 fresh | Different empty copy recorded |
| Collapsed and expanded measured activity | R | 03–04, 103 | Entire possible load/paired-name set not sampled |
| Set strips, repeated notation and carry-over actions | P | 03–04, 11, 78 | Distance, all band labels, uniform-lock combinations and daily grip peek not all reached |
| Neutral / long-name activity | P | 67 creation, 69 empty neutral history | Note-only populated neutral daily card not captured |
| Mood slider and first-set hint | S | Source inventory §1 | No saved set used to inspect that particular transient sequence |
| Calendar: date cells, selected/today, weekday labels, dots and arrows | R | 42 populated September, 43 empty October | Rapid counting placeholder not frozen; only two months inspected |
| Day Detail activity list and bodyweight row | R | 37 populated, 45 Rest empty, 112 no split | Long custom split title unverified |
| Change Split tab, remove/restore controls | R | 38 | Every saved template mismatch not sampled |
| Bodyweight editor | P | 40 provisional prior weight, 111 empty | Scrubbing, kg and saved-current-value variants not fully sampled |
| Bodyweight field note | R | 39 | Closed after viewing |

## Picker, creation and entry

| Surface / controls | Coverage | Rendered evidence | Remaining limits |
|---|---|---|---|
| Add Activity list, tabs, search, Create and merge actions | R | 46 empty split, 47 All, 48 no match, 49 search | Full list scrolled via interaction; screenshot shows viewport |
| Related family row and variation-count action | R | 53 family row, 54 nested variations | Group was explicitly created in disposable demo |
| Picker unassigned result “Add to split” | S | Source inventory §3 | No matching unassigned search under an active split captured |
| Picker inline long-press deletion | S | Source inventory §3 | Not invoked; generic delete confirmation inspected separately |
| Timed pairing banner / paired rows | S | Source inventory §3 | No pairing fixture created |
| Category editor: input, Add, row edit/delete, Save/Cancel | P | 36 | Inline rename/delete/empty list not individually captured |
| New Activity base form | R | 63 blank; 70 validation; 71 bar setup | Scroll positions differ across captures |
| Duplicate suggestion | R | 64 | Existing Bench Press match; acceptance not executed |
| Split recommendation and unknown result | R | 65 recognized, 66 long unknown | Ambiguous and remembered-result wording not independently rendered |
| Neutral option and field note | R | 67, 68 | Long name saved only to isolated sample |
| Reps / Timed / load / weight style / grip form choices | P | 63, 67, 71 | Per-side and custom-bar number permutations not all rendered |
| Busy creation and duplicate-save guard | S | Source inventory §3 | Fast local write not slowed; no behavior testing |
| Weight picker: direct number, +/- keys, confirm with history, plate math | R | 05, 80, 104 | kg variant unverified |
| Weight preset compact/expanded grids | R | 05, 74 | Different quantities of learned presets not exhaustive |
| Added bar weight / Bar math / Change bar setup | R | 72, 73, 77 | Legacy snapshot warning not separately captured |
| Weight Load sheet | R | 06; Bodyweight selected on route to timer | Custom-band save path not completed |
| Band color and thickness grids | R | 07–08, 107 | One selected color/thickness family sampled; all eight resting label/fill pairs measured |
| Grip sheet | R | 75 unselected, 76 Pronated/Standard selected | Every grip/handle combination and locked-for-day variant unverified |
| Reps grid and previous suggestions | P | 09–10 | Custom typed count, reps Load/Grip nested sheets not independently captured; shared sheet structure inventoried |
| Number-key pressed and released geometry | P | 10, 104–106 | Stable held samples only, not a video claim about every transition |

## History, notes and edit overlays

| Surface / controls | Coverage | Rendered evidence | Remaining limits |
|---|---|---|---|
| Picker Activity History / logging gateway | R | 78 timed populated; 69 neutral empty | Measured empty-history gateway not independently frozen |
| Context History tab | R | 11, 97-tour-5 | Readable viewport includes dated rows and set pills |
| Shared history rows with/without note | R | 11, 78 | Some notes intentionally fade inline previews; no blanket contrast verdict on decorative fade mask |
| Note detail popup | R | 79 | One populated note; very long detail-scroll case not captured |
| Grip detail popup | S | Source inventory §4 | No historical grip fixture opened |
| Notes → Custom Notes | P | 12 empty, 15 editor, 16 long draft | Existing saved custom-note card not captured |
| Quick Notes | P | 13 populated groups/chips | All collapsed/selected combinations not sampled |
| Form Cues | P | 14 empty textarea | Prior dated cues and selected cue variants not separately captured |
| Session Note modal | S | Source inventory §5 | Mount exists, direct current entry not found; not claimed visible |
| Edit tile grid | R | 17 | Neutral-specific reduced edit grid not captured |
| Assign Splits | R | 99 | One activity's choices |
| Weight Style | R | 77 | Total/per-side/custom-bar selections not all captured |
| Grip Tracking compact dialog | R | 18 phone; 20 desktop | Both state appearances visible; no real setting changed |
| Change Type compact dialog | R | 21 | Cancelled; desktop placement source-supported only |
| Default Load compact dialog | R | 22 | Selected Weight plus remaining choices; cancelled |
| Grip field note | R | 19 | Shared question artwork preserved |
| Rename editor and scope confirmation | R | 100–101 | Long draft cancelled before final commit |
| Delete-all-sets confirmation | R | 23 | Cancelled; no deletion performed |
| Single-set/permanent-activity confirmation messages | S | Same shared component in source inventory | Exact message variants not each opened |
| Undo and error toasts | S | Source inventory §8 | No deletion/storage fault used to trigger them |

## Relationships, settings and support

| Surface / controls | Coverage | Rendered evidence | Remaining limits |
|---|---|---|---|
| Related Activities standalone and grouped overview | R | 50, 55 | Two-member group created in isolated demo only |
| Relate search/selection/group-name form | R | 51–52 | Name-required disabled state and completed link observed |
| Create variation form | P | 57 | Empty disabled form; no variation saved |
| Move group form | P | 58 | Current group only, new-group field; no move executed |
| Make standalone / relationship busy/error | S | Source inventory §6 | No detach/error fixture used |
| Related Activities field note | R | 56 | Closed after viewing |
| Merge finder and multi-selection/keeper controls | R | 59 empty, 60 results, 61 disabled, 61b enabled | Name search; no actual merge |
| Merge confirmation | R | 62 | Cancelled; source behavior not audited |
| Single-source Merge Into Another Activity modal | S | Source inventory §6 | Separate entry form not individually captured |
| Settings tabs and weekly rows | R | 24, 25, 32 | lbs active; kg unverified |
| Weekly day assignment and category editor | R/P | 35, 36 | None/Rest/assigned choices visible; native apply-to-today confirm not invoked |
| Data actions and reset panel | R | 32–34 | Reset type-to-enable inspected, never confirmed |
| CSV import, progress/result and singleton cleanup | S | Source inventory §7 | No import/legacy one-member family fixture; these conditional variants remain unverified |
| Preferences choice states and model options | R | 25, 90 | Sound toggle changed only in sample browser |
| Duplicate Warning info card | R | 102 | Separate card family, distinct from shared field notes |
| API key editor | P | 26 empty | No saved-key/remove state, no secrets accessed |
| Feedback form | P | 27 blank, 30 selected+filled, 31 small phone | Screenshot attachment, sending, success/error not invoked; no message sent |
| Feedback message editor | R | 28 blank, 29 long | Expected-result editor uses same family; exact alternative not separately captured |
| Log Coach | P | 95 empty, 96 filled composer | No API request, response, Thinking or service-error state |

## Timers, launch and shared systems

| Surface / controls | Coverage | Rendered evidence | Remaining limits |
|---|---|---|---|
| Timed-duration base, presets, load strip and circular dial | R | 81 | Distance/mi/km and timed inline grip variants not separately captured |
| Preset edit/removal glyphs/numpad/Add disabled-enabled | R | 82–83 | One-second preset added only to sample browser for countdown capture |
| Stopwatch running/paused/adjustment | R | 84–86 | No duration saved; running and paused samples at 0:00 are visual states, not elapsed-time correctness tests |
| Countdown mode, pre-start and completion | R/P | 87–89 | Actual one-second countdown after five-second pre-start; longer in-progress countdown display not frozen separately |
| Timer Sounds tick/completion selectors | R | 91 | Preview audio was not required for aesthetic inspection |
| Chime, Fanfare, Bowl, Morse parameter variants | R | 91–94 | Variant families visible; not every slider position |
| Demo offer | R | 01 settled fresh origin | September 30 earlier capture replaced by settled fresh capture October 1 |
| Demo loading/error | R | 108–109 | Local seed request intentionally delayed and returned 503; actual component rendering, no source changes |
| Tour offer | P | 02 | Early transition capture only; not used as settled-surface evidence |
| Seven tour spotlight/centered steps | R | 97-tour-1 through 97-tour-7; dismissed 98 | Uses sample populated day; missing-anchor fallback not separately captured |
| Shared field-note family | R | All four content types: 19, 39, 56, 68 | Font/title wrapping and border treatment inspected; no physical-device blur comparison |
| Render/global error fallback | S | Source inventory §8 | No app crash deliberately injected as a UI fixture |
| Native dialogs/file chooser/browser keyboard/install UI | S / external | Inventory boundary only | Outside authored aesthetic surface and unavailable in this headless phone emulation |
| Old Day Detail history carousel/blue tags | L | `false &&` branch starting near 12411 | Excluded from visible findings |
| Old GripPromptModal | L | Defined without mounted render call | Excluded from visible findings |

## Interpretation

The visual inventory is complete at the source-family level described above. Rendered coverage is intentionally reported by state, not padded into an unsupported “100% tested” claim. Remaining S/P variants could reveal additional polish issues. The report’s confirmed findings depend on observed states and verified source/computed values; none depends on an unreached error branch, retired view or hypothetical device behavior.
