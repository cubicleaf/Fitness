# LLM Coach and Groq Model Exploration

**Document status: Exploratory — 2026-08-03.**

This is a preserved design conversation, not an implementation specification.
It records promising directions and constraints before any of them become
product commitments.

## The central product position

The app's code and stored data should remain the authority. An LLM is most
valuable when it helps the user understand an existing choice, retrieve useful
possibilities from their own history, or choose among clearly presented paths.
It should not silently rewrite the user's workout history, invent facts about
their body, or become a mandatory conversational layer over the fast logging
loop.

The useful division is:

- **Deterministic app logic:** storage, dates, set calculations, personal-record
  detection, duplicate identity rules, merge mechanics, permissions, limits,
  and anything that must be reproducible.
- **LLM assistance:** explaining the app, interpreting ambiguity, ranking or
  narrating already-computed options, answering “what does this mean?”,
  interpreting screenshots, and helping a user decide what to do next.
- **User control:** whether AI is used, whether a suggested action is accepted,
  and whether a background or expensive request is allowed.

The phrase “coach” should therefore mean a helpful interpretation layer, not a
replacement for the logbook's underlying rules.

## Model landscape: GPT-OSS 120B and Qwen 3.6 27B

The current BYO integration uses Groq as the hosted provider. Both models can
be called through the same Groq API key; the request chooses the model by its
model identifier. This makes switching a routing decision in the app, not a
credential-management problem. Groq documents an OpenAI-compatible endpoint at
`https://api.groq.com/openai/v1` and model-specific requests.

### GPT-OSS 120B

**Best conceptual role:** the default text/reasoning model for structured
decisions, nuanced explanations, and tool-shaped workflows.

The hosted Groq listing describes `openai/gpt-oss-120b` as a reasoning and tool
use model with structured JSON support, a 131,072-token context window, and a
65,536-token maximum output. The provider listing reports lower token pricing
than Qwen 3.6 27B. These are provider facts and can change, so the app should
not hardwire pricing or assume availability forever.

Likely strengths for this app:

- turning a computed set of candidates into a useful explanation;
- weighing several user priorities without reducing them to one simplistic
  rule;
- producing predictable structured output when asked for a small schema;
- explaining tradeoffs in activity families, variants, and duplicate warnings;
- handling the “why did the app suggest this?” and “what are my options?” layer;
- drafting concise help content from the app's own rules and field-note registry.

Likely cautions:

- it is not the best reason to send a screenshot if a vision-capable model is
  more direct;
- long reasoning is not automatically better for a two-tap gym interaction;
- it must be given the app's actual computed facts rather than asked to infer
  history from vague prose.

### Qwen 3.6 27B

**Best conceptual role:** a specialized multimodal model for screenshots,
visual state, and possibly lighter conversational assistance.

The hosted Groq listing describes `qwen/qwen3.6-27b` as a 27B multimodal model
with text and image inputs, vision, reasoning, tool use, a 131,072-token context
window, and a 16,384-token maximum output. It is listed at higher input and
output token prices than GPT-OSS 120B. It supports a non-thinking mode for
cases where extended reasoning is unnecessary.

Likely strengths for this app:

- reading a screenshot of a settings panel, activity history, or exercise card;
- recognizing that a user is pointing at a specific UI element;
- interpreting a chart, table, or imported-data preview;
- answering “what am I looking at?” when the app has not yet exposed a formal
  structured representation;
- serving as a lower-complexity assistant for short, visual questions.

Likely cautions:

- visual understanding should not be used where the app can supply exact data
  directly;
- image requests cost more and should be explicit or clearly opt-in;
- the app should keep the original screenshot local unless the user knowingly
  sends it to Groq.

### Tentative routing, not a final decision

The most sensible first architecture is:

| Job | First choice | Why |
|---|---|---|
| Exact duplicate identity and merge safety | Deterministic code | History integrity cannot depend on model judgment |
| Duplicate explanation or ambiguous-match narration | GPT-OSS 120B | Nuanced text explanation after code finds candidates |
| “WTF do I do?” ranking and conversational follow-up | GPT-OSS 120B | It can explain a ranked set of known options |
| Screenshot or visual UI question | Qwen 3.6 27B | Vision is the actual reason to invoke it |
| App/system explanation | GPT-OSS 120B, with app-supplied rules | The model explains the product's decisions |
| Field-note copy | Deterministic registry first; GPT-OSS for drafting only | Stable help should not drift between calls |
| Personal-record calculation | Deterministic code | A PR is a data result, not an opinion |
| New-activity brainstorming | GPT-OSS 120B, clearly labeled as exploratory | Suggestions can be useful but are not history facts |

This does not require exposing two model names to ordinary users. A future
settings surface could offer “AI assistance: Off / Manual / Automatic” and an
advanced model preference, while the app internally routes visual requests to
Qwen and structured text requests to GPT-OSS. The user should always be able to
see that AI was used and stop it from making network calls.

## Duplicate recognition and user-led merging

The user should normally initiate a merge. The system may notice a likely
collision and bring it to the user's attention, but it should not merge two
activities merely because their names look alike.

### Where a warning can originate

- During import, when deterministic normalization finds repeated activity
  identities in the incoming data.
- During activity creation, when a new name is an exact or very high-confidence
  match for an existing activity.
- In the activity-management / creative-activity area, where the user can
  review “possible duplicates” without being interrupted during a set.
- After a user has created a second version, as a quiet review item rather than
  a blocking alert.

The existing duplicate-warning setting and activity picker are natural places
to surface this. The old recommender should not return as a noisy taxonomy
gatekeeper.

### Recommended merge shape

1. The app identifies candidate A and candidate B with a plain-language reason
   such as “same normalized name” or “only punctuation differs.”
2. The user opens a review screen showing counts and dates, not a scary data
   dump: sets, notes, families, split assignments, and settings that differ.
3. The app offers a safe default: preserve all sets and notes under the chosen
   surviving activity, retain the other record as a reversible tombstone, and
   record what happened.
4. Conflicts are presented as choices or “keep both,” never silently selected
   by an LLM.
5. The user can cancel. An undo path should remain available if the data model
   supports it.

The likely storage model is to repoint dependent records from B to A while
keeping B as a hidden record with `mergedInto: A` and a merge event. This keeps
the action reversible and avoids pretending that two activity histories were
identical in every field. A future implementation still needs to inspect all
`exerciseId`-keyed stores before shipping this.

### What the LLM may do

The model may explain why a deterministic matcher surfaced two candidates,
translate field differences into ordinary language, and help the user decide
whether the records are truly the same. It must not be the authority that
repoints IDs, deletes records, resolves date collisions, or invents missing
sets.

## The “WTF do I do?” helper

This is not necessarily a chatbot. It is a decision aid for the moment when a
user arrives at the gym with no clear plan, especially after enough recovery
that the previous split should not dictate the session.

The helper could begin with a few low-friction choices:

- **Surprise me:** choose something the user has done before, but not the most
  repetitive obvious choice.
- **Use something I have neglected:** surface an activity with sparse history
  or a long gap since last use.
- **Build around a priority:** use a declared priority such as chest, bench
  press, conditioning, or a personal skill.
- **Do something I know:** suggest a familiar activity with the last-time data
  immediately available.
- **Try something new:** propose a new activity, with the uncertainty clearly
  labeled and guidance kept conservative.
- **Ask me a question:** let the coach narrow the choice through one or two
  questions about time, equipment, energy, pain, or desired challenge.

The user should be able to choose a mode with buttons, answer a short question,
or ask in the chat. The app should not force a split if the user says they want
freedom. Conversely, if the user has an active split, the helper can offer it as
one path rather than treating it as a command.

### Inputs the deterministic system should compute first

The app can produce a compact candidate set before any model call:

- activities used recently;
- activities not used recently;
- activities with only one to three historical appearances;
- declared priorities;
- current split and whether the user asked to ignore it;
- available equipment, if the user has supplied it;
- recent intensity or fatigue signals, if the data supports them;
- activities with useful “last time” records;
- activities with a personal record opportunity;
- activities the user has marked as maintenance rather than progression.

The LLM then ranks or narrates these candidates. It should not claim to know
recovery, injury status, or readiness unless the user supplied that information.

### Priority and preference memory

The future app could let users rank priorities, for example:

- chest development;
- maintain current strength;
- practice a skill;
- explore neglected movements;
- conditioning;
- avoid a movement or equipment type;
- personal records, or deliberately no PR pressure.

These should be editable preferences, not permanent labels. A user who wants to
push bench press this month should not be trapped in a chest-only identity.

## Personal records as an opt-in layer

Personal records are a strong fit for deterministic tracking, but not every user
wants every activity turned into a progression contest.

Possible record types include:

- heaviest successful load for a defined rep or set type;
- most reps at a defined load;
- longest timed hold or interval;
- fastest time for a distance or route, if the app eventually supports it;
- longest sauna duration;
- a user-defined milestone for activities that do not fit a conventional PR.

The system should calculate candidate records from logged sets and display them
quietly where useful: beside the activity, in history, or in a dedicated PR
view. A preference could control whether PRs are hidden, shown, or celebrated.
The default should avoid turning a maintenance-oriented activity such as a
30-second plank into a constant escalation prompt.

The stopwatch could write a completed duration into the same underlying set
shape used by timed activities. If that is done, the PR engine can treat a sauna
duration or plank hold as a normal typed result without special AI logic.

The LLM can explain “why this counts as a PR” or suggest a reasonable next
challenge, but the code should calculate and store the record.

## Screenshots: what physically happens

If a user attaches or selects a screenshot in the app, the browser receives it
as an image file or blob. The app can then either:

1. keep it local and ask the user to describe the problem;
2. send the image as an image input in a Groq request, alongside a short text
   instruction and relevant app context;
3. optionally resize or crop it locally first to reduce payload and exposure.

For the second path, the browser sends an HTTPS request to Groq containing the
image data and prompt. Qwen 3.6 27B is the natural candidate because the Groq
model listing supports image inputs. The user should see a clear indication such
as “Send screenshot to AI,” because the screenshot may contain browser chrome,
personal information, or other unrelated content.

The app can recognize that the user is trying to use a screenshot when a file is
attached through an image picker, when a paste event contains an image, or when
the user uses a future “explain this screen” action. It should not try to infer
that intent from ordinary text alone. If the screenshot is already inside the
chat composer, the affordance can make the model choice and network action
visible.

## Background and hidden AI work

Technically, the browser can make automatic requests with the user's Groq key
while the app is open. But silent background requests have a real product cost:
they consume the user's shared Groq rate and spend limits, can surprise the user,
and may run after the user has forgotten that AI is enabled. Safari also does not
make a closed-tab background worker a dependable place for ongoing model work.

The safer progression is:

- default to deterministic local checks;
- ask before the first category of automatic AI assistance is enabled;
- show a small AI activity / usage history;
- keep automatic calls bounded and cacheable;
- provide an immediate global “AI off” control;
- never send screenshots or private history in the background without a clearly
  enabled setting.

Possible automatic tasks, if the user opts in, include drafting an explanation
for a high-confidence duplicate warning, preparing a “you may want to review
these candidates” card, or precomputing a short WTF shortlist. They should be
low-frequency and disposable. The app should remain fully usable if the key is
missing, expired, rate-limited, or deliberately disabled.

## Product strengths the coach can explain

The coach can help users understand that the app is intentionally:

- local-first and fast rather than account-heavy;
- centered on exact personal history and “last time” retrieval;
- flexible about splits rather than prescriptive;
- careful about separating families, activities, qualifiers, and notes;
- designed to support maintenance as well as progression;
- willing to preserve ambiguity instead of forcing a taxonomy too early;
- built around suggestions, not mandates.

## Product limits the coach should admit

The coach should say plainly when the app cannot know something:

- it cannot diagnose injury or determine physiological readiness;
- it cannot infer a complete recovery state from sparse logs;
- it cannot safely merge activities from names alone;
- it cannot reconstruct details the user never logged;
- it cannot guarantee that a new exercise is appropriate without user judgment;
- local-only data may not be available on another device;
- AI answers are suggestions and explanations, not a new source of truth.

## Open questions

These remain intentionally unsettled:

- Should the normal user see model names, or only an AI assistance level?
- Is “automatic” allowed to make background calls, or only prepare work after a
  user opens a relevant surface?
- How much history should a WTF request send, and how much can be summarized
  locally first?
- Which personal-record definitions are useful enough to ship first?
- Should priorities be a ranked list, a few toggles, or temporary session goals?
- Should neglected-activity scoring be visible and explainable?
- How should new-activity suggestions distinguish “new to the user” from “new
  to the app”?
- What exact merge event log and undo window are sufficient for trust?
- Should screenshot analysis be available only in Coach, or anywhere a field
  note / WTF surface appears?

## Suggested sequence when this becomes implementation work

1. Make the duplicate review and merge flow user-initiated, deterministic, and
   reversible.
2. Add a local candidate generator for the WTF helper without AI, using recent,
   neglected, priority, and familiar activity buckets.
3. Add GPT-OSS narration/ranking over that candidate set with explicit user
   initiation.
4. Add opt-in priorities and maintenance/progression preference.
5. Add deterministic PR storage and display for one or two useful result types.
6. Add screenshot attachment and explicit Qwen analysis in Coach.
7. Only then consider bounded automatic/background assistance.

This sequence preserves the app's core identity: the workout logger remains
fast and reliable even when the coach is unavailable.

## Reference material

- [Groq OpenAI compatibility](https://console.groq.com/docs/openai)
- [Groq GPT-OSS 120B model details](https://console.groq.com/docs/model/openai/gpt-oss-120b)
- [Groq Qwen 3.6 27B model details](https://console.groq.com/docs/model/qwen/qwen3.6-27b)
- [Groq API reference](https://console.groq.com/docs/api-reference)
- [Groq rate limits](https://console.groq.com/docs/rate-limits)
- [Groq spend limits](https://console.groq.com/docs/spend-limits)
- [OpenAI introduction to open-weight GPT-OSS](https://openai.com/index/introducing-gpt-oss/)
