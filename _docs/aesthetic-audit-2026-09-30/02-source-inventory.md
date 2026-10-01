# Fitness visual surface inventory — source census, 2026-09-30

Scope: `/Users/cubicleaf/Documents/Fitness-git/index.html`, current 18,000-line single-file source. Read workspace CLAUDE, project INTENT/STATUS/CLAUDE, and maintained `_docs/UI-SURFACE-GLOSSARY-AND-LLM-PLAN.md`. No UX playbook read. No application/source changes. This is a source-derived coverage map, not evidence of rendered inspection or a functionality audit. Line references below are to index.html. Count separate variants as visual inspection cases, not separate product features.

The glossary is useful for names but no longer exhausts the UI. Current source is authoritative for this inventory. Full-height phone-framed `.modal` is the default surface (711); centered cards, bottom picker sheets, inline notices, native confirmations, transient toasts, and the separate tour each need independent visual assessment.

## 1. Daily log and app shell

| Surface / entry | Source | Visual states / controls to inspect |
|---|---:|---|
| Main daily log | 16236–16969 | Header title, utility icon cluster, day navigation, scrollable content, activity cards, bottom Add Activity. Max-width 430px app frame. |
| Header utilities | 16242–16297 | Bodyweight SVG, Calendar icon when on today; Today pictogram/text when another date; Log Coach chat bubble; settings gauge. Every utility has a different visual footprint. |
| Day strip | 16312–16339 | Previous/next arrows, date text, split label, no-split day. Tap date opens Day Detail. |
| Sample-log banner | 16298–16311 | Dot, Marcus Chen label, Start my own action; clearing state. Non-demo omits it entirely. |
| Bodyweight reminder | 16345–16419 | Today's missing weight, glowing dot/banner copy, Swipe up to dismiss; sliding-out and dismissed states. |
| Empty daily log | 16419–16421 | “No activities logged yet today.” versus “No activities on this day.” |
| Collapsed activity | 16422–16571 | Short/long activity name; paired name (including newline); set pills with ordinal-color ramp; hand-placement peek icon when grip exists; lock pill when uniform mode on. |
| Expanded activity | 16572–16949 | Add Set and carry-over actions, provenance/last-set context, mood slider, History/Notes/Edit actions; opening/closing animation and reduced-motion presentation. |
| Reps activity controls | 16794–16830 | Unlocked four-button mode: Add Set / lock+dumbbell / lock+Reps / Both. Uniform weight swaps action to New Reps; uniform reps swaps to New Wt. |
| Timed activity controls | 16628–16830 | Add Set, carry duration, New Dur, paired activities. Distinct content lengths from reps case. |
| Neutral activity card | daily rendering conditions | Note-only card retains mood and context tabs; omits normal logging controls. Presence-only measured set produces “Did some” style history. |
| Set pills | 16543–16571 | Weight/reps, added bar weight, timed seconds/minutes, distance, bodyweight, no load, bands, presence. Long sequence wrapping and repeated set notation. Tap/hold pathways should be visually checked without mutating records. |
| Lock/unlock hint | 16499–16541 | Small locked pill, glowing state, transient “unlock” hint. |
| Mood area | 16831–16888 | Unrated versus rated; first-log pulsing hint and “How did that feel?”; later quiet mood cue. |
| Add Activity control | 16950–16969 | Centered 168×56 filled mauve squircle with gold plus/person artwork, no visible text label. |
| Daily grip detail | 16969–16972 | `QuickDetailOverlay`; activity name and set-by-set hand placement. |

## 2. Navigation, calendar, day and bodyweight

| Surface / entry | Source | Visual states / controls |
|---|---:|---|
| Calendar | `CalendarMonthModal` 14708–14835 | Header close; previous/next month; month/year; weekday row; blank grid cells; date cells. Today and selected-date states must be inspected separately and together. Training dots and no-training cells. Counting state; gym-day summary / zero-gym-day summary; Back to current month only away from anchor. |
| Day Detail | `DayDetailModal` 12087–12589 | Date header; bodyweight row with SVG and field-note trigger; split-assigned versus no-split day. |
| Split Day Activities tab | 12361–12411 | Tab pair “Split Day Activities” / “Change Split”; ranked Route Spine list; most-used row variant; ordinal nodes; name and meta; empty list; Find or assign an activity action. |
| Change Split tab | 12556–12589 | Prompt when unassigned; category button grid; selected state; Remove Split; conditional Restore to Weekly Template action. Long custom category names are a variant. |
| Bodyweight focused editor | `BodyweightEntryModal` 12592–12764 | Centered blurred card, close, number/input/unit, scrubbable value, save check. Empty record, current recorded number, provisional previous number with source date, lbs/kg; dragging state. Entry via top header, reminder, or Day Detail. |
| Bodyweight field note | registry 4072; trigger 12353 | “Why log bodyweight here?” shared FieldNoteModal. |

Do not count the old day-detail activity carousel as a live surface: it is explicitly gated by `false && activeTab === 'activities'` at 12411. Its source remains through 12550.

## 3. Add Activity and creation

| Surface / entry | Source | Visual states / controls |
|---|---:|---|
| Add Activity picker | `ExercisePickerModal` 4988–5596 | Create New Activity, search, long-press hint, Find activities to merge, category tabs and Edit, list heading, activity rows. |
| Activity rows | 5160–5325 | Name, variation label, split, last-used meta; timed pair button; related icon; unassigned search result includes Add to [split]. Long names and multiple trailing actions need separate visual review. |
| Picker browse | 5328–5405 | Loose rows; compact Related family doors; family title truncation, review icon, variations-count button. One eligible member uses normal row. |
| Picker search | 5418–5574 | All-split results; no match; selected split with no assigned activities; no activities at all. Loading and load-error messages. Exact-name duplicate candidates produce optional merge notice. |
| Inline permanent-delete notice | 5454–5515 | Long-press row reveals red-accent notice with quoted name and history scope; Delete/Cancel. It is inline in the picker, not shared modal confirmation. |
| Inline pairing mode | 5516–5556 | Pairing: [name], instructions, Cancel Pairing, timed activity list. |
| Variation selection sheet | 5574–5596 | Nested full-height modal, family name header, Close variations, count/ordering caption, eligible variation rows. |
| Categories editor | `EditCategoriesModal` 4658–4860 | New category input + Add; list of names, edit and delete glyphs; inline rename input + check/X; Save/Cancel footer. Reached from picker Edit or Settings day editor. Empty list and long names are variants. |
| New Activity | `CreateExerciseModal` 6728–7376 | Name; neutral shortcut with field note; No Split / Recommend split; multi-select splits; type; weight style; bar type; default load; grip options; Create Activity / Cancel. |
| Duplicate suggestion panel | 6922–6997 | Similar activities rows and Use This; Neither—Create Brand New. Long names and multiple matches. |
| Neutral creation state | 7000–7034 | Neutral selection label and explanatory sentence; hides measured setup controls. |
| Split helper expanded panel | 7068–7079 | Recognized suggestion/confirmed personal choice with accept action; uncertain/ambiguous explanation; unknown/no guess; blank-name disabled Recommend split. This is inline, not a modal. |
| Type choices | 7086–7131 | Required/unselected prompt; reps/timed selection; timer icon. |
| Weight-style section | 7132–7234 | Total / per-hand / bar options; bar presets and custom bar numeric input. |
| Default-load section | 7236–7281 | Weighted, bodyweight, no-weight selection; required/unselected caption. |
| Grip section | 7282–7364 | Collapsed More options; suggested on/off explanation; explicit No/Yes; field-note trigger. |
| Creation validation and busy | 7364–7376 | Inline form alert, Creating… action, disabled appearance. |

## 4. Set logging and history gateway

| Surface / entry | Source | Visual states / controls |
|---|---:|---|
| Activity History / Set Logger | `HistoryModal` 9952–10137 | Reached by selecting picker activity (also related-history route). Header named activity; log-capable versus history-only variants; neutral Open Notes. Log a Set plus Uniform Weight/Reps/Both; compact Did some / No sets or reps action; optional activity note; history rows; first-time/no-history text. |
| Shared history row | `HistorySessionRow` 9910–9950 | Separate date navigation, set strip, note preview, optional hand icon. With note, sets fade; without note, full set strip. Neutral note-only entry versus measured entries. |
| Note detail popup | `QuickDetailOverlay` 9878–9898, invocation 9943 | Date title; Note, Form cue, Quick notes, Feeling sections as present. Scroll, lengthy notes, close. |
| Grip detail popup | 9948 | Date title; set-by-set grip labels. Same centered popup frame but different density. |
| Weight picker | `WeightPickerModal` 7418–8027 | Activity — Set N header, Load/Grip chips, central direct-edit number and +/- increments, main confirm action containing previous context, presets. lbs/kg; first-use vs recent weights. |
| Bar-weight variant | 7770–7806 | Persistent Bar math [bar + weight] trigger; collapsed/expanded breakdown; per-side/bar/total explanation; Change bar setup; legacy previous-total notice; Added weight label. |
| Weight presets | 7930–8012 | Non-bar plate math shortcuts, recent/common weights heading, five quick options, More weights / Show fewer expanded grid. Repeated and large numeric values, decimal values. |
| Weight Load bottom sheet | `PickerSheet` 7380; load body 7557–7727 | Body Weight / No Load / Band Assisted. Band Assisted expands eight named color controls: Red, Black, Purple, Green, Blue, Orange, Yellow, Gray. Selected color opens Just color / Thin / Medium / Thick. Custom band name and conditional Use [name]. |
| Weight Grip bottom sheet | 8015–8025 | Shared `GripInlineSelector`; optional label, reason, Don't ask, grip-type and width/handle options; selected/unselected. |
| Reps picker | `RepPickerModal` 8029–8267 | Header with selected weight; Load/Grip chips; previous suggestion source/date/counts; editable custom count and Use # reps; grid. 8–12 ember enabled/disabled; zero/custom/selected suggestion. |
| Reps Load bottom sheet | 8242–8256 | Bodyweight, No load, Add weight actions; differs from weight picker's richer load sheet. |
| Reps Grip bottom sheet | 8256–8267 | Same grip selector. |
| Grip selector in its forms | `GripField` 14073–14116; `GripInlineSelector` 14118–14227 | Compact current-grip pill/change then expanded selector; grip locked for day versus editable; explanation; Don't ask; grip-type and width/handle option grids. |
| Timed Duration | `TimedDurationModal` 8607–9732 | Header activity/set and weight; inline grip (unlike reps sheets), inline load controls; optional distance input and mi/km toggle; presets, countdown toggle, optional sounds action, Edit Presets, stopwatch, circular minute dial. |
| Timer preset edit | 9028–9223 | Existing preset tiles with remove X, jiggle state; Add New Preset; MM:SS digit display; Add action; 1–9, CLR, 0, backspace grid; Done. |
| Countdown variants | 9307–9430 | Normal preset grid; Starting in 5 seconds with large pre-start count and Cancel; active large countdown and original-duration caption; Timer complete with Use duration / Cancel. |
| Stopwatch variants | 9473–9629 | Start Stopwatch; running Pause / Save; paused Resume / Save; Adjust actual time expands minutes:seconds fields and Apply; Reset. |
| Circular duration dial | 9630–9732 | SVG tick ring, large current minute value, drag indicator, Use N min / Start N min depending countdown. |
| Timer Sounds | `SoundSettingsModal` 8269–8605 | Entry from Settings or timer. Tick Style Click/Beep/Ping; Completion Sound Victory Fanfare / Singing Bowl / Gentle Chime / SOS Morse; Preview. Fanfare variant chips; bowl Sustain/Richness/Depth sliders; chime variant chips and Speed/Pitch; SOS Freq/Speed; countdown duration segments and Play Full Preview. |

`GripPromptModal` 13998–14069 is defined but has no render call; do not claim it is reachable. A source-only legacy surface with Grip Type, Width/Handle, Skip/Continue remains there.

## 5. Activity Context, notes, edit flows

| Surface / entry | Source | Visual states / controls |
|---|---:|---|
| Activity Context frame | `ActivityContextModal` 13174–13996 | Daily expanded card History/Notes/Edit opens named activity, close and three top tabs. Full-height phone frame, independent scroll. |
| History tab | 13505–13527 | Shared history rows, empty “No history yet”; note/grip detail popups as above. |
| Notes / Custom Notes | 13528–13622 | Secondary three-tab strip; Add custom note + icon; dated note cards; empty No notes yet. Existing note opens editor prefilled; new note opens empty. |
| Custom Note editor | `NoteEntryModal` 13113–13172; call 13984 | Named title/date, textarea, Cancel/Save. New/edit, today/past, short/long paragraphs. |
| Notes / Quick Notes | 13622–13719 | Collapse/Expand controls; conditional used-note section; five collapsible groups (Physical Sensations, Energy & Performance, Form & Technique, Recovery & Context, Mental & Motivation); selection chips. Collapsed/expanded/selected/unselected and many chips. |
| Notes / Form Cues | 13720–13768 | Auto-saving textarea, dated prior cues; bullet text; no-form-cues state. |
| Edit tab | 13768–13984 | Two-column action tiles: Change Split, Related Activities, Change Type with current mode, Default Load with current mode, Weight Style, Grip Tracking status including auto, Merge Into Another Activity, Rename, Delete all sets for today; separate permanent-delete action. Neutral omits measured-specific controls. |
| Assign Splits | `ChangeCategoryModal` 11955–12030 | Today's split/current labels, multi-select instruction, category grid selected/unselected, Save. |
| Weight Style | `ChangeWeightMeaningModal` 14229–14326 | Total/per-hand/bar grid; bar preset choices/custom input; explanatory paragraph; Cancel/Save. Entry from Edit or Weight picker Change bar setup. |
| Track Grip inline card | App branch 17274–17382 | Title + field note, explanatory paragraph, Off/On selection. Plain overlay with unpositioned 340px child rather than `.modal`. |
| Change Type inline confirmation card | 17382–17486 | Current→new type sentence, preservation paragraph, Cancel/Switch. Plain overlay with unpositioned 340px child. |
| Default Load inline card | 17487–17600 | Activity caption, stacked Weight/Bodyweight/No Weight options with explanatory text, selected state, Cancel. Plain overlay with unpositioned 340px child. |
| Rename Activity form | local `RenameModal` 16178–16229 | Name input; Cancel/Save. |
| Rename scope confirmation | 17625–17696 | Separate centered inline overlay; “This will rename the activity for all days, not just today.” Cancel/Confirm. |
| Session Note modal | `SessionNoteModal` 9734–9876; mounted 17208 | Mood/unrated prompt, Form Cue input, General Notes textarea, Cancel/Save. Modal branch and `handleExerciseAction('sessionNote')` handling exist (16076–16084), but no current visible trigger was found in this census; treat entry reachability as uncertain, not a visually verified surface. |

## 6. Related Activities and merging

| Surface / entry | Source | Visual states / controls |
|---|---:|---|
| Related overview, standalone | 14328–14423 | Named source paragraph; Relate to another activity; Create a variation; header field-note icon. Enter through picker related icon or Edit. |
| Related overview, grouped | same | Family/name/member-count; each member is name + History link with Current activity caption on one row; Create variation / Move to another group / Make standalone. One member and many members vary density. |
| Relate step | 14383–14396 | Search input and scrollable results; standalone/linked metadata; selected target; existing-group summary or required new Group name; disabled/enabled Relate activities; Back; no-name-match state. |
| Create variation step | 14397–14406 | Existing-family versus standalone explanation; conditional Group name; New activity name; optional Variation label; disabled/enabled Create variation; Back. |
| Move step | 14407–14413 | Group list, selected target, Or name a new group input; Move activity / Back. |
| Related errors/busy | 14337–14366, 14422 | Load/save error paragraph; working dims/disables buttons. |
| Merge Activities finder | `MergeActivitySearchModal` 14424–14559 | Intro paragraph; Selected chips/removal; name search; Suggested matches or Name matches; scroll list; blank query prompt, no-match, all-matches-selected. With >=2 selected: Keep history under options, explanatory paragraph, Cancel/Review merge footer. |
| Merge one Activity | `MergeActivityModal` 14561–14637 | Source→target explanation, search, result rows/selected target; conditional footer Cancel/Merge into [name]. Empty filtered result area also needs review. |
| Merge confirmation | 17070–17076, 17086–17092 | Uses shared ConfirmationDialog; multi-source and single-source title/message variants. Shared positive button reads “Delete” because confirmation component hard-codes that label; relevant as visual language/meaning mismatch, not a functional audit. |

## 7. Settings, feedback, coach

| Surface / entry | Source | Visual states / controls |
|---|---:|---|
| Settings frame | `SettingsModal` 10808–11953 | Settings header, compact Feedback utility, close; Weekly Splits / Data / Preferences top tabs. |
| Weekly Splits | 11190–11281 | lbs/kg selection; seven day rows, assigned name versus None vs explicit Rest; Save Weekly Splits. |
| Weekly day assignment | 11289–11391 | Nested day-name modal; New Split / Rename utility actions; category grid, None, Rest, selected value. |
| Apply template to today | 10932 | Browser-native `window.confirm`: Apply [split] to today as well? Native dialog is a separate presentation family. |
| Data tab | 11392–11533 | Export CSV; Import CSV / Importing…; enter/leave demo and demo status; one-activity cleanup; Replay tour and caption; import result text; Reset All Data block. |
| Single-activity group cleanup | 11431–11441 | Conditional count, explanation, scroll preview rows, Clean up these groups; confirmation shows Confirm make N standalone + Cancel; Cleaning up… and status. |
| Data reset expanded | 11480–11533 | Red warning section, Reset Everything; expanded “Type DELETE” input; Cancel and Confirm Reset disabled/enabled. No mutation needed to visually inspect. |
| Preferences | 11533–11849 | Potential Duplicate Warning plus info icon; Weight Reminder Banner; Rep Ember Effect; Timer Sounds. Independent On/Off segmented controls. Timer sound configuration button appears when enabled. Log Coach key button with Required/Saved; model options GPT OSS 120B / Qwen3.6 27B and descriptions. |
| Duplicate Warning information card | 11900–11953 | Separate inline fixed centered overlay, title/body/Got it. Does not use shared FieldNoteModal. |
| API key editor | 11851–11898 | Blurred centered feedback-style modal, explanatory text, visible wrapping textarea, conditional Remove saved key with trash, Done. Inspect empty only to avoid exposing real secrets. |
| Feedback | `FeedbackModal` 10139–10298 | Blurred centered modal; intro; category-grid options; message/expected-result field triggers, placeholder versus filled summaries and character counts; screenshot selector / attached state; optional email; status; Send Feedback / Sending… and disabled. |
| Feedback message editor | 10267–10298 | Nested focused modal “What would you like to tell me?” textarea, count, Done. |
| Feedback expected-result editor | same | Alternate title/placeholder and smaller length budget; same focused editor family. |
| Native screenshot chooser | 10249–10254 | Native file control is outside authored UI; list as external boundary rather than app screenshot coverage. |
| Log Coach | `AIChatModal` 12885–13093 | Header, coach settings icon, close; assistant starter, user/assistant messages with bold/line rendering; Thinking…; composer placeholder; Send disabled/enabled. Missing API key and service-error responses appear as chat text. No request needed for visual inspection. |

## 8. Field notes, confirmations, transient and launch states

| Surface / entry | Source | Visual states / controls |
|---|---:|---|
| Shared field-note system | `FieldNoteTrigger` 12766; `FieldNoteModal` 12796–12878 | Supplied question SVG trigger; centered blurred card, eyebrow, 24px title, two paragraphs, X. Four content variants below, different title wrapping. |
| Neutral activity field note | 4077–4081 / 7024 | New Activity neutral option. |
| Related activities field note | 4082–4086 / 14420 | Related Activities header. |
| Grip tracking field note | 4087–4091 / 7312,17306 | New Activity grip section and Track Grip card. |
| Bodyweight field note | 4072–4076 / 12353 | Day Detail bodyweight row. |
| Shared destructive confirmation | `ConfirmationDialog` 12032–12058 | Centered 280px card, title, optional message, Cancel/Delete. Set deletion 15860; all sets today 15954; whole activity/history 16057; merge confirmations above. Short/long names wrap differently. |
| Undo action toast | 4398–4421 | Fixed-bottom horizontal label + Undo action, shadow; five-second lifetime. Review long activity-name width on phone. |
| Error toast | 3776–3795 | Fixed-bottom red error text, three-second lifetime. No deliberate storage fault required. |
| Demo offer | `DemoOfferModal` 14660–14705 | First empty log centered card; title, intro, three bullets, Show me demo / I'll start my own; Loading…/progress/error; data-storage caption. |
| Tour offer | `TourOfferModal` 14641–14658 | Centered title/body Show me / I'll look around. |
| Tour spotlight | 17785–17965 | Separate maximal-z-index scrim, spotlight cutout, floating tip, heading/body, progress dots, Skip, Back, Next/Done, final Start my own log when demo. Seven configured cases: centered welcome; date nav; split label; activity row; activity history; Add Activity; centered finish. Missing-target fallback centered, no-activity skip, reduced-motion variant. |
| Render error fallback | `ErrorBoundary` 17734–17767 | Red App Error title and preformatted error/stack. Diagnostic fallback, source-only; don't intentionally crash real log. |
| Global script-error fallback | early script after 2289 | Additional global error instrumentation exists; count transient diagnostic presentation only when reproduced safely. |

## 9. Shaped controls and container treatments

The source now contains several distinct geometry systems. Visual review should not assume every round rectangle belongs to the same family.

1. **Global automatic SVG squircle:** 17967–18038 selects every `button` plus `.set-box`, `.day-activity-node`, `.set-item-expanded`, `.exercise-picker-item`, `.last-time-section`, `.your-weights-container`, `.quick-detail-card`, `.confirmation-dialog`. Excludes transparent backgrounds, gradient/image backgrounds, circles and already dedicated SVG controls. Radius is 30px for listed larger row/cards; otherwise 26px at width >=120px, 20px under that. Effective radius clamps at half the short dimension. This means table/list buttons, selected tabs, note chips, presets, confirmation cards and many utility buttons can all receive different silhouettes as their computed fills/states change.
2. **Dedicated weight/reps SVG plates:** 10757–10807 targets weight keys, rep keys and rep suggestions; two paths for fill/stroke, geometry from same `fixedCornerSquirclePath`. CSS radius token is 20px at 1659 and explicitly 20px for suggestions at 8186; inspect normal, pressed, ember and selected suggestions.
3. **Ordinary CSS-rounded fields:** override at 2258 applies 20px border-radius and mauve fill to `.search-input`, `.stepper-input`, `.form-input`, `.form-select`. The auto system does not select inputs/textareas. Feedback email and custom inline fields can use other radii.
4. **Pills and icon-owned surfaces:** Load chip uses bubble artwork; Grip icon owns its own visible surface (`PickerChip` 7399); field-note question glyph; header SVGs; lock controls; circular controls skipped by auto plate. Their active/pressed states need separate review.
5. **CSS-rounded/gradient cards:** standard full-height modal; centered feedback 22px; demo 16px; bodyweight 28px; shared field note 24px; tour tip 12px. Gradient backgrounds bypass the auto plate system. Nested family cards, notices, row containers use independent CSS radii.
6. **Border suppression:** 2279–2282 force `border:0!important` on `.modal`, `.modal.feedback-modal`, `.modal-overlay > div`, `.quick-detail-card`, `.confirmation-dialog`, `.field-note-card`. This broad selector also affects inline overlay children, while shared FieldNoteModal does not use any of those selectors.
7. **Density ramps:** set pills use three mauve alpha depths (53–55); secondary filled controls use accent 34% over page (2232); large picker/last-time rows use 22% (2250). Selected options often use solid accent. Tiny low-alpha inline captions are not automatically brightened by this pass.
8. **State geometry:** off/on and selected/unselected tabs, formerly transparent controls, pressed controls, long labels and disabled options can change plate eligibility/fill. Capture both states, not only default/resting screenshots.

## Source-derived visual risk candidates for rendered verification

These are candidates, not claims of browser-verified defects.

- **Inline editing cards at top-left:** Track Grip 17274, Change Type 17382 and Default Load 17487 put normal-flow children inside `.modal-overlay`, which is display:block and has no centering. Unlike `.modal`/`.confirmation-dialog`, the cards do not position themselves. On wide desktop they likely escape the centered phone column to left/top; on phone they likely start flush top. Verify each.
- **Field-note border inconsistency:** shared FieldNoteModal has a direct 1px border but neither `.modal-overlay` nor `.field-note-card`; global border removal at 2279 won't reach it. Bodyweight's field-note-card does get borderless treatment. Verify whether this visible edge conflicts with actual intended polish.
- **Low-contrast tiny guidance:** picker long-press hint 10px/48% accent-soft at 5431; second long-press line 11px/30% at 5563; settings helper captions; weight-style and split recommendation labels; confirmation secondary message accent-soft 50%. These need computed contrast/rendered checks, not guesswork.
- **Long-title/card width pressure:** exercise + Set N modal headers; family names with review/count actions; related member row + History; two-column Edit tiles; long merge target labels; 280px confirmation titles; bodyweight/title wrapping.
- **Nested modal contrast:** family variations over picker; Load/Grip sheet over weight/reps; Notes detail portal over Activity Context; field note over grip editor; sound settings over timer; feedback editor over feedback; API editor over Settings. Need inspect backdrop separation and content clipping for each family.
- **Mixed vocabulary visible at once:** Settings/field notes/new creation use activity/split/category/family, while app title remains Fitness Tracker. Treat as typography/copy consistency findings only where visually confusing; do not turn this into feature or naming work.
- **Confirmation label reuse:** merge review ends in shared button labelled Delete; exact visible relationship between title/body/button warrants review.
- **Auto-squircle override positioning:** `.auto-squircle-plate` sets `position:relative!important`. ConfirmationDialog originally uses `position:fixed`; global plate can therefore override its position. This is a high-priority rendered check for confirmation placement; same selector applies quick-detail card but that card is normally flex-centered by its overlay.

## Coverage and exclusions

This source census includes all named app UI components, all App modal discriminator branches, nested picker/settings/feedback sheets, the field-note registry, shared detail/confirmation families, timer intermediate states, launch/demo/tour, and authored empty/error/busy messages. It does not claim every permutation was rendered. The app source was not changed; live/local data were not manipulated. The old Day Detail carousel is intentionally unreachable; GripPromptModal has no mount; Session Note mount/action handler exist but a current visible entry was not found. Browser-native dialogs/file pickers, keyboard, install/browser chrome, and OS-level permissions remain external UI boundaries.
