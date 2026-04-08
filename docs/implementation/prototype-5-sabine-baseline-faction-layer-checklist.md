# Prototype 5: Sabine Baseline Faction Layer Checklist

Status: Draft
Scope: Prototype 5
Phase: Pre-production
Owner: Design / Engineering
Source of Truth: No

This document turns Sabine Merrow's faction identity, starting kit, tutorial role, and faction-specific overlays into a concrete Prototype 5 build checklist.

It is not a replacement for:

- `docs/factions/sabine-merrow-faction-design.md`
- `docs/mvp-scope-and-prototype-plan.md`
- `docs/prototype-backlog.md`
- `docs/data/sabine-starting-package.md`
- `docs/implementation/prototype-1-camera-and-information-readability-checklist.md`
- `docs/implementation/prototype-2-settlement-economy-and-rebuild-loop-checklist.md`
- `docs/implementation/prototype-3-wave-routing-and-defensive-pressure-checklist.md`
- `docs/implementation/prototype-4-social-consequence-and-named-villagers-checklist.md`

Its job is to define the smallest implementation slice that can prove Sabine works as the baseline teaching faction layered on top of the shared systems already established by Prototypes 1 through 4.

## Prototype Goal

Prototype 5 should prove that Sabine makes the shared baseline easier to read, easier to learn, and more forgiving in the intended ways without collapsing into a generic tutorial wrapper or requiring many bespoke subsystems.

This prototype should stay intentionally small:

- one shared baseline settlement using the Sabine opening package
- one Sabine-only support structure
- one small starting spell kit
- one small starting rune kit
- one small starting policy kit
- one light command-cadence layer
- one or two early pressure sequences that show Sabine's strengths and weaknesses

Recommended placeholder framing:

- reuse the Prototype 1 through 4 baseline with Sabine as the only active master
- treat Sabine as an overlay on top of shared camera, economy, wave, and social systems
- keep her first-cycle learning loop centered on warning, shelter, readiness, protected logistics, and orderly recovery
- hard-code only the smallest behavior loops needed to prove faction feel
- keep ids, unlocks, package setup, and most tuning values data-authored from the start

## Prototype Purpose

- [ ] Prove that Sabine functions as the easy-mode baseline master without feeling bland or hand-holdy.
- [ ] Prove that Sabine's command tone and command cadence reinforce the intended baseline loop.
- [ ] Prove that Sabine's spells, runes, policies, and `Bell Post` clarify the game instead of adding faction noise.
- [ ] Prove that Sabine supports warning, shelter, logistics, and recovery more than direct offense.
- [ ] Prove that Sabine's fairness, duty-of-care, and over-caution pressures create real tradeoffs.
- [ ] Prove the implementation boundary between shared baseline systems and Sabine-specific overlays.

## Prototype Success Criteria

- [ ] A tester can explain why Sabine is the baseline teaching faction after one short session.
- [ ] A tester can identify at least three ways Sabine supports early pressure better than a neutral baseline would.
- [ ] A tester can identify at least one way Sabine is intentionally weaker or riskier, such as over-caution or low tolerance for ugly success.
- [ ] A tester can use `Bell Post`, at least one Sabine spell, at least one rune, and at least one policy in a coherent early run.
- [ ] A tester can explain the difference between shared systems and Sabine-only overlays.
- [ ] A tester can complete the first warning and first recovery cycle while understanding what Sabine taught them.
- [ ] Sabine feels distinct from a generic neutral faction even when using mostly shared baseline systems.

## Must-Prove Questions

- [ ] Does Sabine make the game easier to learn without flattening player choice?
- [ ] Does Sabine's command style reinforce warning, shelter, fair burden, and recovery?
- [ ] Do her support tools improve readability and response timing in ways the player can notice?
- [ ] Does `Bell Post` feel like readiness support rather than false omniscience?
- [ ] Does `Survey Light` preserve exploration while still feeling useful?
- [ ] Do `Household Ward` and `Rally Chime` teach protective play better than extra damage would?
- [ ] Does `Measured Bolt` keep offense present without redefining Sabine around damage?
- [ ] Do `Open Granary`, `Protected Households`, `Repair First`, and `Ordered Levies` create understandable political and operational tradeoffs?
- [ ] Is the line between shared baseline mechanics and Sabine overlays clear enough to support later faction work?

## Explicitly In Scope

### Faction Framing

- [ ] Sabine as the easy-mode baseline master
- [ ] Sabine's opening settlement assumptions
- [ ] Sabine-style command cadence
- [ ] Sabine-style readability expectations
- [ ] Sabine-style support during early pressure

### Sabine Overlay Elements

- [ ] `Bell Post`
- [ ] `Survey Light`
- [ ] `Household Ward`
- [ ] `Rally Chime`
- [ ] `Measured Bolt`
- [ ] `Alarm Rune`
- [ ] `Waymark Rune`
- [ ] `Sentry Seal`
- [ ] `Open Granary`
- [ ] `Protected Households`
- [ ] `Repair First`
- [ ] `Ordered Levies`

### Integration Scope

- [ ] integration with Prototype 1 readability and alert logic
- [ ] integration with Prototype 2 settlement and rebuild logic
- [ ] integration with Prototype 3 warning and wave pressure
- [ ] integration with Prototype 4 households, social consequence, and drafting

## Explicitly Out of Scope

- [ ] Ash-Hart playable implementation
- [ ] Aurelian playable implementation
- [ ] Orren playable implementation
- [ ] faction selection flow
- [ ] deep Sabine-specific court, law, or tax simulation
- [ ] Sabine's full long-form command arc
- [ ] large bespoke faction UI layer
- [ ] full `Magistrate's Sortie` implementation as required baseline
- [ ] many Sabine-exclusive systems beyond the starter overlay kit
- [ ] replacing shared baseline systems with Sabine-specific rewrites

Recommended placeholder scope rule:

- [ ] if a behavior can be expressed as a tuning layer, package setup, command wrapper, or support effect on shared systems, prefer that over a new Sabine-only subsystem

## Required Sabine-Specific Faction Behaviors

- [ ] Sabine is framed as the baseline teaching faction in setup, tone, and early outcomes
- [ ] Sabine favors protective and pragmatic behavior over severe or sacrificial behavior
- [ ] Sabine provides slightly clearer early warning and readiness support than shared baseline alone
- [ ] Sabine improves early household protection and social stabilization
- [ ] Sabine improves early rebuild and recovery follow-through
- [ ] Sabine is weaker at reckless aggression than a hypothetical harsher or more offensive master
- [ ] Sabine punishes visible neglect of dependents more sharply than a neutral baseline
- [ ] Sabine reacts more negatively to unfair burden-sharing and ugly success than a neutral baseline

Recommended minimum faction rules to prove:

- [ ] `Civic Legitimacy`
- [ ] `Matriarchal Stewardship`
- [ ] `Ordered Recovery`
- [ ] `Administrative Warding`
- [ ] `Duty of Care`
- [ ] `Public Fairness Standard`
- [ ] `Over-Caution`
- [ ] `Lower Tolerance for Ugly Success`

Recommended placeholder implementation rule:

- [ ] express these mostly as small modifiers on existing shared systems before considering bespoke faction logic

## Required Sabine-Specific Command and Policy Behaviors

### Command Cadence

- [ ] one major command and one minor request per wave cycle pattern is visible
- [ ] commands use clear civic and logistical reasoning
- [ ] commands emphasize protection, readiness, shelter, and recovery
- [ ] commands can be slightly over-cautious without feeling incompetent
- [ ] at least one moment exists where player disobedience could plausibly outperform Sabine's caution

### Command Tone

- [ ] command language reads as formal, responsible, and cooperative
- [ ] Sabine explains why a command matters when practical
- [ ] command tone stays calm under pressure
- [ ] command tone becomes colder or more official under repeated disregard rather than erratic

### Policies

#### `Open Granary`

- [ ] can spend food for social stabilization after stress or damage
- [ ] visibly improves morale or belonging recovery
- [ ] teaches that stockpiles can be spent politically, not only materially

#### `Protected Households`

- [ ] children and key caregivers shelter earlier on warning-stage escalation
- [ ] this lowers catastrophe risk at a visible labor cost
- [ ] this reinforces Sabine's duty-of-care identity

#### `Repair First`

- [ ] recovery priorities bias toward housing, gates, storehouse, and mana infrastructure
- [ ] this visibly improves orderly recovery after damage
- [ ] this teaches healthy rebuild sequencing

#### `Ordered Levies`

- [ ] emergency draft compliance improves when obvious danger exists
- [ ] social resentment still accumulates on repeated or unfair use
- [ ] this remains viable but not free

## Required Starting-Package Behaviors

- [ ] use Sabine's compact starting outpost assumptions
- [ ] start with `Tower Core`, `House`, `Field`, `Woodcutter Camp`, and `Bell Post`
- [ ] start with a partial `Storehouse Foundation`
- [ ] start with one small road spine
- [ ] start with one founding household plus three retainers and servants
- [ ] start with named sites that support alert and command readability
- [ ] start with the Sabine stockpile bias:
- [ ] `Food:34`
- [ ] `Wood:36`
- [ ] `Stone:7`
- [ ] `Mana:24`
- [ ] start with warning-first, not wall-first, assumptions
- [ ] start with one local report source and one local responder

Recommended package assumptions to preserve:

- [ ] `2 adults + 2 children` in the founding household
- [ ] one guard-sergeant if defense systems are ready, otherwise one lookout
- [ ] no dedicated builder at minute one
- [ ] `Storehouse Foundation` around `40%` complete
- [ ] one first-warning window about `3-5` minutes after start
- [ ] first-wave teaching context aimed at protecting `Field`, household safety, and recovery capacity

## Required Spell Behaviors

### `Survey Light`

- [ ] reveals resource signatures on the strategic map
- [ ] does not reveal terrain, passability, or full hidden map layout
- [ ] does not grant false route knowledge
- [ ] feels like surveying rather than clairvoyance
- [ ] is useful in the first few minutes of play

### `Household Ward`

- [ ] can target a key civic structure such as `House`, `Storehouse`, or `Gate`
- [ ] temporarily improves survivability of that structure
- [ ] visibly supports triage and protection decisions
- [ ] is easier to understand than a more abstract buff

### `Rally Chime`

- [ ] improves at least one of:
- [ ] evacuation response
- [ ] sheltering speed
- [ ] local alert transmission
- [ ] guard rally efficiency
- [ ] creates a visible coordination benefit near the target area
- [ ] reinforces the tower as a command and readiness center

### `Measured Bolt`

- [ ] provides a simple direct attack action
- [ ] is reliable enough to feel useful
- [ ] is weak enough that it does not replace readiness, shelter, or layout play
- [ ] helps the player feel magical agency without redefining the faction

Recommended placeholder power anchors:

- [ ] `Survey Light`: low mana cost, no damage, resource-signature reveal only
- [ ] `Household Ward`: one structure, short duration, meaningful but not absolute protection
- [ ] `Rally Chime`: short-radius response bonus with obvious local effect
- [ ] `Measured Bolt`: low-complexity single-target or short-line damage

## Required Rune Behaviors

### `Alarm Rune`

- [ ] can be placed on an approach, road, or gate
- [ ] improves warning lead time or report clarity
- [ ] helps teach route-reading and readiness

### `Waymark Rune`

- [ ] can be placed on a route segment
- [ ] improves hauling, travel, evacuation, or route reliability in a visible way
- [ ] helps teach that movement planning is part of defense

### `Sentry Seal`

- [ ] upgrades one report point such as `Bell Post` or a lookout site
- [ ] improves confidence, clarity, or lead time of reports
- [ ] reinforces the difference between reports and direct vision

Recommended placeholder rune rule:

- [ ] each rune should have one obvious job in the first 10-15 minutes, not a broad utility cloud

## Required `Bell Post` Behavior

- [ ] exists as a Sabine-specific support structure or overlay object
- [ ] improves readiness-task assignment speed when warning advances
- [ ] accelerates nearby transitions into sheltering, evacuation, or guard muster
- [ ] improves reliability of local "drop task and respond" behavior
- [ ] acts as a settlement-level readiness signal
- [ ] supports warnings without granting full sight
- [ ] is readable as different from a generic lookout

Recommended placeholder `Bell Post` rule:

- [ ] use one Sabine-only local response-speed modifier first

## Required Tutorial and Onboarding Beats

### First-Wave Teaching Beats

- [ ] warning arrives before impact
- [ ] `Field` and civilians are valid priorities, not just the tower
- [ ] one protective spell is obviously useful
- [ ] one first rune placement has an immediate readable benefit
- [ ] the `Storehouse Foundation` is understood as survival infrastructure

### First-Cycle Teaching Beats

- [ ] player learns that reports are not omniscience
- [ ] player learns that readiness and response are different from sight
- [ ] player learns that compact roads and storage improve survival
- [ ] player learns that children and households change response timing
- [ ] player learns that recovery priorities matter immediately after damage
- [ ] player learns that emergency drafting exists but carries social cost

### Expected Early Player Decisions

- [ ] first spell choice between `Survey Light` and a protective response tool
- [ ] first rune placement on an approach or route
- [ ] first labor reassignment toward logistics, warning response, or `Storehouse` completion
- [ ] first policy use in response to strain or warning escalation
- [ ] first recovery priority after light or moderate damage

## Required Readability and Feel Tests

- [ ] Sabine's tools should make the baseline easier to parse, not busier
- [ ] Sabine's command voice should make priorities clearer under pressure
- [ ] Sabine's first cycle should feel orderly and legible rather than passive
- [ ] Sabine's support tools should feel stronger in prevention and recovery than in killing power
- [ ] Sabine's fairness and household logic should be noticeable without flooding the player with social math
- [ ] Sabine's over-caution should create tension without making her seem foolish
- [ ] Sabine's early pressure support should feel like help, not like the game playing itself

Recommended cold-read feel questions:

- [ ] Did Sabine make you want to protect households, food, and storage first?
- [ ] Did Sabine make warning and readiness feel more important than brute force?
- [ ] Did Sabine feel distinct from a generic neutral ruler?
- [ ] Did any Sabine tool feel confusing, redundant, or too weak to justify its slot?

## Required Failure States

- [ ] Sabine feels like a generic neutral faction with renamed tools
- [ ] Sabine is so forgiving that core baseline mistakes stop mattering
- [ ] Sabine is so weak or fussy that she fails as the easy-mode baseline
- [ ] `Bell Post` is mistaken for extra vision instead of readiness support
- [ ] `Survey Light` grants too much map truth and breaks exploration
- [ ] `Measured Bolt` becomes the dominant answer to early pressure
- [ ] `Protected Households` is so strong that labor tradeoffs disappear
- [ ] `Ordered Levies` is either a trap or an always-correct answer
- [ ] `Repair First` feels like invisible automation rather than readable faction doctrine
- [ ] Sabine's command tone explains too much and feels over-scripted
- [ ] Sabine's command tone explains too little and fails to teach the intended loop
- [ ] the line between shared baseline and Sabine overlay becomes blurry enough to block later faction work

## Core Feature Checklist

### Faction Framing Core

- [ ] implement Sabine as the only active master for Prototype 5
- [ ] implement easy-mode baseline framing in setup or onboarding text
- [ ] implement protective-pragmatic command stance
- [ ] implement over-caution as a real but bounded pressure

### Starting Package Core

- [ ] load Sabine starting buildings
- [ ] load Sabine starting roads
- [ ] load Sabine starting NPC roster
- [ ] load Sabine starting stockpiles
- [ ] load Sabine starting known-map state
- [ ] load Sabine starting unlock kit

### `Bell Post` Core

- [ ] implement `Bell Post`
- [ ] connect it to warning-state transitions
- [ ] connect it to readiness response behavior
- [ ] surface its effect clearly in UI or feedback

### Spell Core

- [ ] implement `Survey Light`
- [ ] implement `Household Ward`
- [ ] implement `Rally Chime`
- [ ] implement `Measured Bolt`

### Rune Core

- [ ] implement `Alarm Rune`
- [ ] implement `Waymark Rune`
- [ ] implement `Sentry Seal`

### Policy Core

- [ ] implement `Open Granary`
- [ ] implement `Protected Households`
- [ ] implement `Repair First`
- [ ] implement `Ordered Levies`

### Command Cadence Core

- [ ] implement one major-command pattern per wave cycle
- [ ] implement one minor-request pattern per wave cycle
- [ ] implement at least one recovery-phase command
- [ ] implement at least one preparation-phase command
- [ ] implement at least one imminent-threat command

## Shared Baseline Versus Sabine Overlay Checklist

### Shared Baseline

- [ ] camera model remains shared
- [ ] survey map remains shared
- [ ] alert and report system remains shared
- [ ] building placement remains shared
- [ ] resource model remains shared
- [ ] social data model remains shared
- [ ] wave routing framework remains shared
- [ ] command grammar remains shared

### Sabine Overlay

- [ ] command tone and cadence
- [ ] `Bell Post`
- [ ] `Survey Light`
- [ ] `Household Ward`
- [ ] `Rally Chime`
- [ ] `Measured Bolt`
- [ ] `Alarm Rune`
- [ ] `Waymark Rune`
- [ ] `Sentry Seal`
- [ ] `Open Granary`
- [ ] `Protected Households`
- [ ] `Repair First`
- [ ] `Ordered Levies`
- [ ] small tuning modifiers for legitimacy, readiness, and recovery

Recommended implementation rule:

- [ ] if a feature could plausibly belong to any future faction, keep its system generic and author Sabine as data plus tuning on top

## Hard-Coded Early Versus Data-Driven Later

### Acceptable To Hard-Code Early

- [ ] one Sabine-only `Bell Post` readiness bonus
- [ ] one milestone-specific guided `Storehouse` tutorial chain
- [ ] one first-warning timing window
- [ ] one first-wave chain such as `warning.displaced_hunger -> wave.early.scurry_passby`
- [ ] one fixed first-cycle command cadence script

### Should Be Data-Driven Early

- [ ] package id and faction id
- [ ] building ids and starting states
- [ ] starting stockpiles
- [ ] starting roster and household links
- [ ] spell, rune, and policy unlock lists
- [ ] named sites and map-knowledge setup
- [ ] warning profile and wave recommendation ids
- [ ] tuning values and placeholder bonuses where practical

Recommended boundary rule:

- [ ] hard-code behavior loops only when they unblock the first playable quickly, but keep ids, values, and unlock content data-authored from the start

## Recommended Implementation Order

### Step 1: Package and Overlay Boundary

- [ ] confirm shared baseline features already exist
- [ ] load Sabine-specific starting package
- [ ] define Sabine overlay ids and tuning hooks

### Step 2: `Bell Post`

- [ ] implement `Bell Post`
- [ ] tie into warning escalation
- [ ] tie into readiness-task response
- [ ] validate it does not grant false vision

### Step 3: Sabine Spell Kit

- [ ] `Survey Light`
- [ ] `Household Ward`
- [ ] `Rally Chime`
- [ ] `Measured Bolt`

### Step 4: Sabine Rune Kit

- [ ] `Alarm Rune`
- [ ] `Waymark Rune`
- [ ] `Sentry Seal`

### Step 5: Sabine Policy Kit

- [ ] `Open Granary`
- [ ] `Protected Households`
- [ ] `Repair First`
- [ ] `Ordered Levies`

### Step 6: Command Cadence Layer

- [ ] one recovery-phase command
- [ ] one preparation-phase command
- [ ] one imminent-threat command
- [ ] one minor-request example

### Step 7: Readability and Feel Pass

- [ ] command tone pass
- [ ] onboarding pass
- [ ] first 10-15 minute readability pass
- [ ] shared-versus-overlay sanity pass

## Minimum Test Scenarios

### Scenario 1: Sabine Opener Baseline

- [ ] Start from Sabine's authored opening package.
- [ ] Tester can identify why this start feels orderly and protective.
- [ ] Tester can identify `Bell Post`, `Storehouse Foundation`, and the founding household as important.

### Scenario 2: `Bell Post` Readiness

- [ ] Trigger an early warning-stage escalation.
- [ ] Nearby workers or retainers respond faster because of `Bell Post`.
- [ ] Tester can explain that the gain was in readiness and coordination, not extra line of sight.

### Scenario 3: `Survey Light` Without Omniscience

- [ ] Cast `Survey Light` early.
- [ ] Resource signatures appear on the strategic map.
- [ ] Terrain and path details remain unknown.
- [ ] Tester can explain what they learned and what they still do not know.

### Scenario 4: Protective Spell Choice

- [ ] Present pressure on `House`, `Field`, or `Storehouse Foundation`.
- [ ] Tester uses `Household Ward` or `Rally Chime`.
- [ ] Tester can explain why the spell supported a civic or readiness goal.

### Scenario 5: `Measured Bolt` In Context

- [ ] Present a small pressure event where `Measured Bolt` is helpful.
- [ ] Tester uses it.
- [ ] Defensive success still depends on warning, shelter, or layout choices rather than bolt spam.

### Scenario 6: Rune Teaching Loop

- [ ] Tester places `Alarm Rune` on an approach or `Waymark Rune` on the road spine.
- [ ] Tester places `Sentry Seal` on a valid report point if available.
- [ ] The benefit is visible enough to explain in one sentence.

### Scenario 7: Policy Tradeoff Loop

- [ ] Trigger strain, warning escalation, or post-wave instability.
- [ ] Tester uses one of `Open Granary`, `Protected Households`, `Repair First`, or `Ordered Levies`.
- [ ] Tester can explain both the benefit and the tradeoff.

### Scenario 8: Fairness and Duty-of-Care Pressure

- [ ] Run one case where households are protected fairly.
- [ ] Run one case where children, caregivers, or laborers are exposed while tower assets are prioritized.
- [ ] Tester can see the difference in Sabine-style fallout.

### Scenario 9: Over-Caution Tension

- [ ] Present one moment where Sabine's cautious bias would preserve order but sacrifice tempo.
- [ ] Allow a slightly bolder player action to outperform it cleanly.
- [ ] Outcome should feel like Sabine was cautious, not foolish.

### Scenario 10: End-to-End First Cycle

- [ ] Play through one early warning, one pressure event, and one recovery phase.
- [ ] Tester uses at least one Sabine spell, one rune or policy, and one command-linked response.
- [ ] Tester can explain what Sabine contributed beyond the shared baseline.

## Validation Criteria

- [ ] Sabine feels like the baseline teaching faction.
- [ ] Sabine's support tools improve readability, response, and recovery more than raw offense.
- [ ] Sabine's compact opening package reinforces healthy first-playable habits.
- [ ] `Bell Post` reads as readiness support.
- [ ] `Survey Light` reads as surveying rather than scouting omniscience.
- [ ] `Household Ward` and `Rally Chime` teach protection and coordination clearly.
- [ ] `Measured Bolt` is useful but secondary.
- [ ] Sabine's policies create understandable social and logistical tradeoffs.
- [ ] Sabine's command cadence clarifies the intended loop.
- [ ] Shared baseline versus Sabine overlay boundaries remain clean.

Recommended validation method:

- [ ] run at least one guided internal test and one cold-read test
- [ ] ask testers what Sabine helped them notice or prioritize
- [ ] ask testers which Sabine tool they found least useful and why
- [ ] log every case where a Sabine-only feature was mistaken for a shared rule

## Failure Cases to Watch For

- [ ] Sabine feels like generic easy mode with renamed buttons
- [ ] Sabine feels so safe that the player never learns the real baseline pressures
- [ ] Sabine's tools are individually clear but collectively redundant
- [ ] `Bell Post` duplicates lookout behavior without a distinct readiness identity
- [ ] `Survey Light` breaks fog-of-war expectations
- [ ] `Household Ward` is too weak to teach triage
- [ ] `Household Ward` is so strong that structure triage becomes trivial
- [ ] `Rally Chime` lacks visible effect
- [ ] `Measured Bolt` becomes the most efficient answer to early danger
- [ ] `Alarm Rune`, `Waymark Rune`, and `Sentry Seal` overlap too heavily in purpose
- [ ] `Open Granary` is too cheap to be a decision
- [ ] `Protected Households` removes meaningful labor-risk tradeoffs
- [ ] `Repair First` feels automatic rather than like a faction doctrine
- [ ] `Ordered Levies` teaches coercion better than stewardship
- [ ] Sabine's command tone feels preachy or over-scripted
- [ ] Sabine's over-caution never creates interesting tension
- [ ] Sabine's over-caution creates frustration instead of teachable disagreement

## Handoff To Integration

Prototype 5 is ready to hand off when:

- [ ] Sabine's starting package is stable
- [ ] Sabine's starter spells, runes, and policies are all implemented at minimum viable depth
- [ ] `Bell Post` behavior is readable and distinct
- [ ] Sabine's command cadence is stable enough to script and tune
- [ ] Sabine's fairness, household-protection, and recovery biases create visible differences in play
- [ ] shared baseline versus Sabine overlay boundaries are documented and stable
- [ ] one end-to-end first cycle proves Sabine's teaching role clearly

Integration or vertical-slice planning should build on this by:

- [ ] tightening Sabine-specific tuning after the shared baseline is playable end to end
- [ ] deciding how much of `Magistrate's Sortie` belongs in the first milestone versus later content
- [ ] defining the minimum faction-specific UI cues that should ship in the baseline milestone
- [ ] preparing a reusable faction-overlay pattern for later masters
- [ ] identifying which Sabine-specific scripts can become generic faction-authoring hooks later

## Follow-Up Questions For Later Work

- [ ] How often should Sabine's caution be wrong enough to invite strong player correction?
- [ ] Should `Bell Post` remain unique, or later become a family of warning-bell variants across factions?
- [ ] Which Sabine command examples should stay hard-scripted and which should become data-authored templates first?
- [ ] How much explicit UI surfacing should fairness and legitimacy get outside debug views?
- [ ] At what point should Sabine's minor requests and personal administrative voice expand beyond the first-cycle teaching layer?
