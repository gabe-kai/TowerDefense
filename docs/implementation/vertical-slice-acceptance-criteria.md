# Vertical Slice Acceptance Criteria

Status: Draft
Scope: First Playable Vertical Slice
Phase: Pre-production
Owner: Design / Engineering
Source of Truth: No

## Purpose

This document defines the acceptance criteria for the first playable vertical slice.

It is an implementation-planning document. Its job is to answer:

- what the slice must prove before broader V1 expansion is justified
- what content and systems must be present in the slice
- what quality bar must be met for the slice to count as successfully proven
- what can still be placeholder, simplified, scripted, or ugly
- what would still block moving forward even if large parts of the slice exist

This document is not:

- a full design spec
- a production QA checklist
- a promise that the first slice is content-complete or architecture-complete

Read this alongside:

- `docs/mvp-scope-and-prototype-plan.md`
- `docs/prototype-backlog.md`
- `docs/implementation/prototype-integration-order.md`
- `docs/implementation/prototype-1-camera-and-information-readability-checklist.md`
- `docs/implementation/prototype-2-settlement-economy-and-rebuild-loop-checklist.md`
- `docs/implementation/prototype-3-wave-routing-and-defensive-pressure-checklist.md`
- `docs/implementation/prototype-4-social-consequence-and-named-villagers-checklist.md`
- `docs/implementation/prototype-5-sabine-baseline-faction-layer-checklist.md`
- `docs/testing-and-debugging-strategy.md`

## Vertical Slice Scope

The first playable vertical slice is one small but honest end-to-end loop for the intended game.

It should include:

- one playable Sabine-based settlement start
- one readable tower-view plus survey-map loop
- one functioning build / repair / rebuild loop
- one traversing wave that can pressure the settlement
- one meaningful warning sequence before contact
- one socially meaningful consequence from damage, injury, or loss
- one usable broad-command response layer
- one small set of Sabine-specific support tools that clearly improve readability or survivability
- one end-to-end loop that feels like the intended game, even if still ugly and limited

The slice is not trying to prove full V1 breadth. It is trying to prove that the project's identity survives contact with implementation.

## Must-Prove Outcomes

The vertical slice must prove all of the following.

### 1. Purpose Of The Vertical Slice

The slice must prove that this project can become a tower-anchored settlement-defense game where:

- the player reads danger from a constrained tower perspective plus a surveyed planning map
- recovery and rebuilding are as important as moment-of-contact defense
- waves feel like moving landscape pressure rather than fixed lanes
- named villagers and households make damage matter socially, not only structurally
- Sabine teaches the baseline loop through warning, shelter, coordination, and orderly recovery

### 2. What The Vertical Slice Must Prove

- The tower camera and survey map are a viable core control loop.
- The settlement economy is playable enough to create recovery tradeoffs.
- One wave can approach, traverse, divert, and damage the settlement in readable ways.
- One warning chain gives enough lead time to act without granting omniscience.
- One broad-command response layer is sufficient for the slice without unit micro.
- One damage outcome can create both structural and social aftermath.
- Sabine improves readability and survivability through overlays rather than bespoke subsystem replacement.
- The combined loop already feels like this game and not like a generic RTS prototype with notes attached.

## Required Content Presence

The slice must contain at minimum:

- one authored prototype map
- one Sabine starting package
- one starting settlement with `Tower Core`, `House`, `Field`, `Woodcutter Camp`, partial `Storehouse`, short road spine, and at least light perimeter context
- one named founding household with `2 adults + 2 children`
- three tower-side retainers or servants
- one warning-stage fauna event
- one traversing early wave using the Prototype 3 minimum roster
- one usable Sabine readiness structure: `Bell Post`
- at least two named outer or edge sites beyond the tower itself

Recommended baseline content for acceptance:

- `Field`
- `Storehouse Foundation`
- `Main House`
- `Bell Post`
- `South Gate` or equivalent gate site
- one outer landmark such as `Miller's Bridge`
- `monster.warning.vermin_surge`
- `monster.scurry.gnawers`
- `monster.brute.ramhorns`
- `wave.warning.displaced_foragers`
- `wave.early.scurry_passby` or `wave.early.scurry_and_ramhorn`

## Required Demonstrably Functional Systems

The slice must demonstrate these systems working in the shared runtime:

- tower-anchored live camera
- strategic survey map
- visibility-state model using `Visible Now`, `Surveyed`, `Reported`, `Unknown`
- site naming and alert/report surfacing
- building placement on surveyed terrain
- construction, damage, repair, and rebuild states
- stockpiles for `Food`, `Wood`, `Stone`, `Mana`
- operational pressure surfacing for labor, housing, storage, and safety
- hauling and road-throughput effects
- off-map wave entry and exit
- event-driven route and diversion logic
- `Palisade` and `Gate` interaction
- broad site-based response commands
- named NPC and household records
- `wounded`, `missing`, and `dead` support
- at least one Sabine spell, one rune or one policy, and `Bell Post`
- debug visibility sufficient to explain failures in warnings, route choice, building state, and NPC consequence

## Acceptance Categories

## Camera Readability

Pass only if:

- the player can operate from the tower without expecting a free god-camera
- switching between live view and survey map is fast and reliable
- `Face From Tower` helps orientation without falsely revealing occluded truth
- closing the map returns the player to the previous useful live framing

Fail if:

- testers feel blind rather than constrained
- the map acts like a second unrestricted live camera
- visibility states blur together during play
- alerts orient poorly enough that response becomes guesswork

## Information Clarity

Pass only if:

- testers can explain the difference between `Visible`, `Surveyed`, `Reported`, and `Unknown`
- alerts consistently name meaningful sites instead of only compass sectors
- warning age, source, and confidence are legible enough to support decisions
- blocked actions clearly explain whether sight, reports, or surveyed terrain are required

Fail if:

- reported information reads like direct sight
- surveyed terrain implies current enemy truth
- site names are too sparse or too duplicated to be useful
- alert spam hides the true crisis

## Economy Functionality

Pass only if:

- `Food`, `Wood`, `Stone`, and `Mana` are surfaced and have real uses in the slice
- the `Storehouse` foundation is a meaningful opening objective
- hauling delays can stall progress even when stockpiles exist
- roads visibly improve at least one recovery or delivery outcome
- at least one real `repair first` versus `expand now` decision occurs

Fail if:

- stockpiles feel detached from what happens in the world
- logistics are invisible
- `Storehouse` completion feels optional
- recovery is automatic cleanup rather than a decision space

## Wave Readability

Pass only if:

- the wave clearly enters off-map and intends to leave off-map
- the player gets at least one meaningful warning sequence before contact
- the player can form a reasonable expectation about pressure direction before impact
- wave pressure can pass by, partially divert, or fully pressure the settlement for understandable reasons
- `Gnawers` and `Ramhorns` feel behaviorally distinct

Fail if:

- the wave feels like a scripted lane attack
- it always attacks the settlement regardless of route logic
- it never pressures the settlement enough to matter
- testers cannot explain why the wave chose its route or target

## Damage And Recovery

Pass only if:

- at least one structure can be damaged by wave pressure
- that damage creates immediate functional recovery pressure
- the settlement can recover from the damage, but not instantly
- damaged `Field`, `Gate`, `House`, or `Storehouse` outcomes lead to visibly different rebuild priorities

Fail if:

- damage is only cosmetic
- damage is so severe that recovery is not realistically demonstrable in the slice
- recovery never changes the player's priorities

## NPC Consequence

Pass only if:

- testers can remember at least two named villagers after a short run
- a household-level consequence is readable after damage, injury, or loss
- `wounded`, `missing`, and `dead` are distinct in UI and runtime state
- losing or harming a person feels different from losing a building

Fail if:

- villagers still feel interchangeable
- households are only labels
- social consequence is text flavor with no operational effect
- the player cannot identify who was affected and why it mattered

## Faction Identity

Pass only if:

- Sabine is clearly recognizable as the baseline teaching faction
- `Bell Post` improves readiness or response timing without granting sight
- Sabine tools improve readability, protection, or recovery more than raw killing power
- at least one Sabine support choice has an obvious benefit and an obvious tradeoff

Fail if:

- Sabine feels like a generic default faction
- Sabine overlays hide baseline problems instead of clarifying them
- `Measured Bolt` becomes the main answer to early pressure
- the line between shared systems and Sabine-only overlays is unclear

## Stability / Repeatability

Pass only if:

- the same end-to-end scenario can be demonstrated repeatedly without hand-repair between systems
- the slice boots and runs without frequent blocker bugs
- authored ids for sites, buildings, waves, NPCs, and households are stable
- key outcomes are reproducible enough to evaluate intentionally

Fail if:

- the slice only works once under ideal setup
- major transitions require manual developer intervention
- placeholder scripting is so brittle that repeated evaluation is not credible

## Debug Visibility

Pass only if:

- route choice and diversion reasons can be inspected
- warning stage, alert source, and information state can be inspected
- damaged-building state and repair backlog can be inspected
- NPC status and household consequence can be inspected
- major failures can be diagnosed without reading raw code

Fail if:

- a tester or developer cannot explain what happened after a bad outcome
- hidden state dominates player-facing results with no debug trace

## Implementation Honesty About Placeholders

Pass only if:

- hard-coded scenario flow is clearly identified as such
- placeholder art, UI, tuning, and authored events are not misrepresented as solved systems
- known cheats are documented and do not invalidate the proof claim

Fail if:

- the slice depends on disguised manual orchestration
- placeholder values or authored scripting create a false impression of systemic readiness

## User Experience Qualities Required

The slice does not need polish, but it must feel:

- readable under mild pressure
- coherent as one game loop rather than a stack of disconnected demos
- honest about incomplete information
- emotionally legible when people are endangered or harmed
- specific to Sabine's baseline identity
- playable without constant developer explanation

Ugly is acceptable.
Confusing is not.

## Placeholder-Allowance Rules

The slice may still be placeholder or simplified in these ways:

- placeholder 3D art, UI art, audio, and VFX
- one fixed prototype map
- one fixed Sabine opener
- one fixed first warning chain
- one fixed first wave chain
- authored site names
- authored starting cast
- authored first-cycle command cadence
- coarse formulas for diversion, building throughput, and social change
- simple group-level monster logic instead of rich per-unit intelligence
- limited automation and rough UI as long as decisions remain readable

These are allowed only if they do not fake the core proof:

- the camera/map loop
- build / repair / rebuild pressure
- readable traversing-wave pressure
- named-villager consequence
- Sabine's readiness / protection / recovery identity

## Explicitly Not Required Yet

The slice does not need:

- multiplayer
- other playable factions
- faction selection
- large monster variety
- boss content
- deep fire systems
- advanced supply chains
- trade economy
- romance, inheritance, or generational simulation
- advanced combat micro
- final art quality
- final pathfinding architecture
- full save/load productionization
- deep automation around commands or policies

## Demo Scenarios And Evidence

The slice should be evaluated with repeatable demo scenarios, not only free play.

### Scenario 1: Readability Loop

- start from tower view
- receive an early warning
- use `Face From Tower`
- open the survey map
- inspect named sites and information states
- issue one broad response

### Scenario 2: Sabine Opener

- start from Sabine baseline package
- identify `Bell Post`, `Storehouse Foundation`, `Field`, and `Main House`
- use at least one Sabine support tool before contact
- explain what Sabine improves compared with a neutral start

### Scenario 3: Build / Repair / Rebuild

- advance or finish the `Storehouse`
- hit a hauling or labor bottleneck
- improve throughput with roads, labor shifts, or prioritization
- make one real recovery-versus-expansion choice

### Scenario 4: Warning To Contact

- run the warning ladder
- confirm that the player understands likely pressure direction before impact
- show one traversing wave nearing the settlement
- demonstrate that warning improved response quality

### Scenario 5: Settlement Pressure

- let the wave pressure a `Field`, `Gate`, or `Storehouse`
- show route logic, diversion logic, or breach logic
- issue one broad site-based response
- show how the response changes the outcome

### Scenario 6: Social Consequence

- produce one socially meaningful outcome from injury, missing status, or death
- surface the affected villager and household
- show at least one operational consequence such as labor loss, burden increase, or worsened morale / grief

### Scenario 7: Recovery Aftermath

- end the wave
- show structural aftermath and social aftermath together
- make one Sabine-aligned recovery decision
- continue into a recognizable next-preparation state

Required evidence for acceptance:

- one guided internal run
- one cold-read run by someone who did not build the feature
- debug captures or logs for wave routing, building state, and NPC consequence

## Pass / Fail Thresholds

## Passing

The vertical slice passes when all of the following are true:

- one end-to-end early cycle can be played repeatedly
- the player can understand what they know, what they do not know, and what actions are available
- the settlement can be built, damaged, and partially recovered through real systemic handoff
- one traversing wave produces readable pressure and believable aftermath
- one social consequence visibly matters beyond structure HP loss
- Sabine's baseline support layer is noticeable, useful, and non-generic
- the slice feels like the intended game, not just like isolated prototype mechanics
- placeholder use is explicit and does not invalidate the proof claim

## Failing

The vertical slice fails if any of the following remain true:

- the tower-view plus survey-map loop is still fundamentally frustrating or unreadable
- the wave cannot create understandable settlement pressure
- damage does not hand cleanly into rebuild decisions
- named villagers still do not change how loss feels
- Sabine does not clearly improve readability, readiness, or recovery
- the slice cannot be demonstrated repeatedly without developer rescue
- placeholder scripting is carrying the experience so heavily that the claimed systems are not actually proven

## Residual Risks Even If The Slice Passes

Passing this slice does not prove:

- long-session pacing
- broader faction viability
- multiplayer viability
- later-wave readability
- full economy scaling
- performance at large population or wave counts
- full terrain-shaping depth
- final UI clarity under content-dense play
- final tuning of social collapse, fire, or deliberate raider behavior

The main residual risks after a pass are:

- later content may overload the readability gains established here
- Sabine may be easier to make legible than later factions
- route logic that works on one map may not generalize cleanly
- social consequence may remain legible only at very small population sizes
- hard-coded first-cycle structure may hide scaling problems in authored content pipelines

## Post-Slice Decisions Enabled

If this slice passes, the following decisions become safer:

- expanding from Sabine baseline into broader V1 faction work
- investing further in the tower-camera and survey-map model instead of revisiting free-camera assumptions
- building more content on the shared runtime rather than restructuring around isolated prototype branches
- promoting current building, wave, NPC, and package ids into more formal authored data pipelines
- adding second-wave and mid-tier threat content
- increasing social consequence depth from a proven readable core
- tightening save/load, automation, and test coverage around the proven loop
- deciding which Sabine overlay hooks should become reusable faction-authoring patterns

## Final Acceptance Rule

Call the first playable vertical slice accepted only when the team can truthfully say:

- one small Sabine settlement can be played through a warning, pressure, damage, and recovery sequence
- the player can read the world from the tower and the map without omniscience
- the wave feels like traversing landscape pressure
- losses hurt in both buildings and people
- Sabine's tools make the baseline loop clearer and more survivable
- the result is still rough, but it already feels like the intended game
