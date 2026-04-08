# Prototype Integration Order

Status: Draft
Scope: Implementation Planning
Phase: Pre-production
Owner: Design / Engineering
Source of Truth: No

This document turns the current prototype stack into a practical integration sequence for the first implementation milestone.

It is not a replacement for:

- `docs/mvp-scope-and-prototype-plan.md`
- `docs/prototype-backlog.md`
- `docs/implementation/prototype-1-camera-and-information-readability-checklist.md`
- `docs/implementation/prototype-2-settlement-economy-and-rebuild-loop-checklist.md`
- `docs/implementation/prototype-3-wave-routing-and-defensive-pressure-checklist.md`
- `docs/implementation/prototype-4-social-consequence-and-named-villagers-checklist.md`
- `docs/implementation/prototype-5-sabine-baseline-faction-layer-checklist.md`
- `docs/data/building-data-sheet.md`
- `docs/data/wave-data-sheet.md`
- `docs/data/npc-schema-and-value-ranges.md`
- `docs/data/sabine-starting-package.md`

Its job is to describe how the five prototypes should actually be layered, stubbed, replaced, and integrated into one working first implementation milestone.

## Purpose

- [ ] Define the practical build order across Prototypes 1 through 5.
- [ ] Separate what should be stubbed first from what should be built for real first.
- [ ] Identify which shared systems should be created once and reused.
- [ ] Show when authored data sheets should start driving runtime behavior instead of remaining planning references.
- [ ] Keep the team from overbuilding later-phase systems before the shared baseline is stable.

## Integration Principles

- [ ] Build one shared playable shell first, not five disconnected prototype scenes.
- [ ] Keep one prototype map and one Sabine-aligned settlement as the main integration surface.
- [ ] Prefer replacing stubs in place over rebuilding the same feature in a new architecture later.
- [ ] Keep ids, site names, building ids, wave ids, NPC ids, and package ids stable early even when behavior is still fake.
- [ ] Treat Sabine as an overlay on a shared baseline, not as the first architecture.
- [ ] Do not deep-tune content before the basic cross-prototype handoffs work.

Recommended practical rule:

- [ ] if a system will be used by more than one prototype, build a reusable shared version first even if its first behavior is simple

## Integration Purpose

The integration target is one small playable milestone slice where:

- [ ] the tower view and survey map work
- [ ] the settlement can build and recover
- [ ] one wave can approach, pressure, and cause damage
- [ ] named villagers can be harmed or lost
- [ ] Sabine can alter readability, response, and recovery through a thin faction layer

This is not a five-scene prototype museum.

It should become one shared runtime with progressively fewer authored cheats.

## Recommended Implementation Order

### Phase 0: Shared Scene and State Scaffolding

- [ ] create one shared prototype map scene
- [ ] create one shared settlement state container
- [ ] create one shared site registry
- [ ] create one shared alert/event bus
- [ ] create one shared save-safe id policy for sites, buildings, NPCs, households, waves, and packages
- [ ] create one shared debug HUD or inspector for state verification

### Phase 1: Prototype 1 Foundations

- [ ] implement live tower camera shell
- [ ] implement strategic survey map shell
- [ ] implement site naming and site selection
- [ ] implement visibility-state model: `Visible`, `Surveyed`, `Reported`, `Unknown`
- [ ] implement alert cards with `Face From Tower` and `Open On Map`
- [ ] implement minimal action-permission rules

### Phase 2: Prototype 2 Shared Settlement Runtime

- [ ] implement stockpiles and capacities
- [ ] implement building placement on surveyed terrain
- [ ] implement building states and progress
- [ ] implement hauling and delivery
- [ ] implement roads
- [ ] implement repair and damage states
- [ ] load one Sabine-aligned authored start package

### Phase 3: Prototype 3 Threat Runtime

- [ ] implement off-map entry and off-map exit
- [ ] implement one route corridor or mana-following path
- [ ] implement one warning ladder
- [ ] implement `Vermin Surge`, `Gnawers`, and `Ramhorns`
- [ ] implement diversion checks
- [ ] implement `Palisade` and `Gate` interaction
- [ ] hand damage into the shared settlement repair loop

### Phase 4: Prototype 4 Social Runtime

- [ ] make NPC records real in runtime
- [ ] make household records real in runtime
- [ ] implement visible roster and household summaries
- [ ] implement `wounded`, `missing`, and `dead`
- [ ] implement labor disruption and burden recalculation
- [ ] implement post-wave social aftermath

### Phase 5: Prototype 5 Sabine Overlay

- [ ] load Sabine overlays on top of the shared baseline
- [ ] implement `Bell Post`
- [ ] implement Sabine spell kit
- [ ] implement Sabine rune kit
- [ ] implement Sabine policy kit
- [ ] implement Sabine command cadence and lightweight tuning modifiers

Recommended sequence rule:

- [ ] do not start deep Sabine tuning until the shared baseline can already run one warning -> wave -> rebuild -> social aftermath loop

## Which Systems Should Be Stubbed First

### Stub Immediately

- [ ] authored alert generation
- [ ] authored named sites
- [ ] placeholder territory-state rendering
- [ ] placeholder building placement validation
- [ ] placeholder construction and repair progress values
- [ ] authored damage events before real wave damage exists
- [ ] authored warning-stage messages before dynamic warning generation exists
- [ ] authored NPC cast before runtime social simulation is complete
- [ ] authored Sabine command text before deeper command logic exists

### Stub Shape Requirements

- [ ] stubs should use final-style ids
- [ ] stubs should write into shared runtime state
- [ ] stubs should be removable feature by feature, not scene by scene

Recommended early stub examples:

- [ ] fake one `Field under pressure` alert instead of waiting for full wave spotting
- [ ] fake one `House damaged` event instead of waiting for real breach logic
- [ ] fake one `Mara Fen wounded` event instead of waiting for full casualty resolution

## Which Systems Should Be Built "For Real" First

### Build For Real Early

- [ ] site registry
- [ ] alert/event bus
- [ ] visibility-state model
- [ ] building state machine
- [ ] stockpile and capacity model
- [ ] hauling destination/source model
- [ ] damage and repair state model
- [ ] NPC and household id persistence
- [ ] wave group controller shell

### Build For Real Before Tuning

- [ ] map open/close state preservation
- [ ] building placement on surveyed terrain
- [ ] route-following and diversion triggers
- [ ] `wounded` / `missing` / `dead` persistence
- [ ] Sabine package loading and overlay hook points

Recommended rule:

- [ ] anything that multiple later systems will read from should not remain a throwaway stub for long

## Hard Dependencies Between Prototypes

### Prototype 1 -> Prototype 2

- [ ] Prototype 2 needs surveyed-terrain placement from Prototype 1.
- [ ] Prototype 2 needs site naming and alert language from Prototype 1.
- [ ] Prototype 2 needs action-permission rules so building placement does not happen in `Unknown`.
- [ ] Prototype 2 needs map open/close and site focus patterns for worksite inspection.

### Prototype 2 -> Prototype 3

- [ ] Prototype 3 needs stable buildings, especially `Field`, `Storehouse`, `Palisade`, and `Gate`.
- [ ] Prototype 3 needs damageable structures and repair states from Prototype 2.
- [ ] Prototype 3 needs roads, layout, and settlement footprint to make route pressure meaningful.
- [ ] Prototype 3 needs a settlement start package to attack.

### Prototype 3 -> Prototype 4

- [ ] Prototype 4 needs wave outcomes to produce real exposure, injury, missing, and death states.
- [ ] Prototype 4 needs named-site alerts and breach context from Prototype 3.
- [ ] Prototype 4 needs structural damage context from Prototype 2 and 3 so building loss and human loss can be compared.

### Prototype 4 -> Prototype 5

- [ ] Prototype 5 needs households, caregivers, and named villagers to make `Protected Households`, `Open Granary`, and `Ordered Levies` meaningful.
- [ ] Prototype 5 needs social-state readouts from Prototype 4 for Sabine's fairness and duty-of-care pressures.
- [ ] Prototype 5 needs shared warning and rebuild loops already working so Sabine can modify them rather than replace them.

## Soft Dependencies Between Prototypes

- [ ] Prototype 1 can use authored alerts instead of real wave reports at first.
- [ ] Prototype 2 can use authored damage events before Prototype 3 is integrated.
- [ ] Prototype 3 can signal civilian exposure before full Prototype 4 consequences are live.
- [ ] Prototype 4 can begin with authored NPC incidents before full wave-to-casualty propagation is complete.
- [ ] Prototype 5 can begin with scripted command cadence before command generation becomes more data-driven.

Recommended soft-dependency rule:

- [ ] if the downstream system can be proven with authored events without changing the upstream architecture later, fake it early

## Shared Infrastructure That Should Be Created Once and Reused

### Shared Scene / Map Scaffolding

- [ ] one prototype map scene
- [ ] one surveyed-terrain representation
- [ ] one site graph or site registry
- [ ] one named landmark set
- [ ] one settlement footprint model

### Shared Runtime State

- [ ] game clock
- [ ] global warning state
- [ ] resource stockpiles and capacities
- [ ] building instances and states
- [ ] NPC instances and household instances
- [ ] wave instance and warning instance state
- [ ] active alerts
- [ ] faction overlay state

### Shared Service Layer

- [ ] id generation and validation
- [ ] event logging
- [ ] alert creation and prioritization
- [ ] site lookup by id
- [ ] map focus and camera focus helpers
- [ ] data loading for buildings, waves, NPCs, and package setup

### Shared UI Scaffolding

- [ ] alert card stack
- [ ] selected-site panel
- [ ] roster and household panels
- [ ] resource and pressure HUD
- [ ] debug/tuning panel

Recommended architecture rule:

- [ ] build these as shared milestone systems, not per-prototype implementations

## What Can Be Safely Faked Early

- [ ] first warning timing window
- [ ] warning-stage text
- [ ] first wave entry lane
- [ ] first projected route corridor
- [ ] first damage event in Prototype 2
- [ ] first casualty event in Prototype 4
- [ ] first Sabine command cadence script
- [ ] first `Bell Post` response-speed bonus
- [ ] first `Storehouse` tutorial objective chain

Recommended fake-data uses:

- [ ] authored `warning.displaced_hunger -> wave.early.scurry_passby`
- [ ] authored `Storehouse Foundation` at `40%`
- [ ] authored Sabine cast of `7`
- [ ] authored route-side landmark such as `Miller's Bridge`

## What Should Not Be Overbuilt Early

- [ ] full fog-of-war simulation beyond the four readability states
- [ ] deep transport simulation beyond pickup and delivery
- [ ] full procedural wave generation
- [ ] full bond graph and social relationship web
- [ ] per-household visible food accounting
- [ ] fire ecosystem depth
- [ ] complex faction-specific subsystems for Sabine
- [ ] dynamic command generation for many masters
- [ ] multi-map package portability before one map works well

Recommended anti-overbuild rule:

- [ ] if a later system only needs one enum, one scalar, or one authored list to prove itself, do not design a full general platform first

## Where Data-Driven Structures Should Begin

### Start Data-Driven Early

- [ ] site ids and common names
- [ ] building ids and core building stats
- [ ] wave ids and minimum wave templates
- [ ] NPC ids and household ids
- [ ] Sabine starting package ids and unlock lists
- [ ] warning profile ids

### Building Data Sheet Adoption

- [ ] start using `docs/data/building-data-sheet.md` as the source for stable building ids as soon as Prototype 2 begins
- [ ] use the `P2 minimum` roster immediately for shared building definitions
- [ ] delay `later_in_milestone` buildings until the rebuild loop is stable
- [ ] keep `Bell Post` out of the shared building roster until Prototype 5 overlay work begins

### Wave Data Sheet Adoption

- [ ] start using `docs/data/wave-data-sheet.md` for monster ids and template ids as soon as Prototype 3 begins
- [ ] implement the `P3 minimum` monsters and wave templates first
- [ ] keep the five-stage warning ladder fixed in code early, but use data-driven `warning_profile_id` links
- [ ] postpone dynamic family mixing and broader roster expansion until pass-by, diversion, and breach logic are readable

### NPC Schema Adoption

- [ ] use partial placeholder NPC records before Prototype 4 only if they already follow the real schema shape
- [ ] make the `M1 required` NPC fields real runtime data at the start of Prototype 4 integration
- [ ] keep `First-playable later` and `Future hook only` fields reserved but mostly unsimulated until the core social loop works

### Sabine Package Adoption

- [ ] start using `docs/data/sabine-starting-package.md` as the authored start-state source as soon as Prototype 2 has a package loader
- [ ] keep the same package object through Prototypes 2 through 5 instead of rebuilding the opening each time

## Where Hard-Coded Placeholders Are Acceptable

### Acceptable Early

- [ ] one fixed prototype map
- [ ] one fixed first warning chain
- [ ] one fixed first wave chain
- [ ] one fixed initial site-name set
- [ ] one fixed first-cycle Sabine command script
- [ ] one fixed `Bell Post` readiness modifier
- [ ] one fixed first-household composition

### Dangerous To Hard-Code

- [ ] building ids
- [ ] wave ids
- [ ] NPC ids
- [ ] household ids
- [ ] core building costs and progress numbers
- [ ] active spell/rune/policy unlock lists
- [ ] status enums such as `wounded`, `missing`, `dead`
- [ ] action-permission rules

Recommended boundary rule:

- [ ] hard-code scenario flow when needed, but not the data keys that other systems will depend on

## Prototype-To-Prototype Feed Summary

### How Prototype 1 Feeds Prototype 2

- [ ] surveyed-terrain placement becomes the basis for building placement
- [ ] site naming becomes the basis for worksite alerts and recovery targets
- [ ] alert focus flows become the basis for damaged-site and logistics inspection
- [ ] permission rules prevent building or rune placement in `Unknown`

### How Prototype 2 Feeds Prototype 3

- [ ] settlement footprint gives waves something meaningful to pass by or divert toward
- [ ] `Field`, `Storehouse`, `Palisade`, and `Gate` become real targetable pressure points
- [ ] roads, chokepoints, and repair backlog make wave outcomes matter
- [ ] authored Sabine opening package becomes the baseline settlement under attack

### How Prototype 3 Feeds Prototype 4

- [ ] warning and breach events provide the context for exposure and panic
- [ ] wave damage provides the trigger for injury, missing, and death
- [ ] post-wave aftermath provides the moment for grief, loyalty, and labor disruption
- [ ] named-site alerts provide the language for social consequence surfacing

### How Prototype 4 Feeds Prototype 5

- [ ] households make `Protected Households` meaningful
- [ ] morale, loyalty, grief, and belonging make `Open Granary` and fairness effects meaningful
- [ ] draft eligibility and labor disruption make `Ordered Levies` meaningful
- [ ] named villagers make Sabine's tone and duty-of-care legible

## Likely Integration Pain Points

- [ ] rebuilding throwaway prototype scenes instead of sharing one runtime
- [ ] camera/map UI assumptions breaking once placement overlays are added
- [ ] settlement data living partly in code and partly in authored package rows
- [ ] building states and repair states diverging between economy and wave systems
- [ ] alert spam once wave, economy, and social incidents all emit events
- [ ] social consequence becoming unreadable if damage events do not identify affected sites and households clearly
- [ ] Sabine logic being added too early and hiding shared-baseline problems
- [ ] fake early wave behavior leaving no clean path to data-driven templates
- [ ] NPC placeholder records not matching the final minimum schema
- [ ] allowing prototype-specific ids to drift across docs and runtime

## Tech Debt: Acceptable Versus Dangerous

### Acceptable Early Debt

- [ ] one fixed map
- [ ] one fixed start package
- [ ] one fixed first warning and wave chain
- [ ] one scripted Sabine command cadence pass
- [ ] one coarse attraction-score formula
- [ ] one coarse builder throughput formula

### Dangerous Debt

- [ ] duplicate implementations of site naming
- [ ] duplicate implementations of building damage states
- [ ] duplicate implementations of alert prioritization
- [ ] NPC records without stable ids
- [ ] wave templates that live only in code with no authored ids
- [ ] Sabine-only special cases embedded into shared baseline systems without clear hook points
- [ ] runtime state that cannot represent `missing` distinctly from `dead`

## Recommended Checkpoints

### Checkpoint A: Readability Shell Stable

- [ ] tower view works
- [ ] survey map works
- [ ] site naming works
- [ ] alerts and `Face From Tower` / `Open On Map` work
- [ ] one shared state container already exists

### Checkpoint B: Settlement Runtime Stable

- [ ] building placement works on surveyed terrain
- [ ] stockpiles and capacities work
- [ ] `Storehouse Foundation` package start works
- [ ] hauling and roads are visible
- [ ] authored damage can feed repair

### Checkpoint C: Threat Runtime Stable

- [ ] one wave can enter, pass, divert, and exit
- [ ] `Field`, `Gate`, and `Storehouse` can be pressured
- [ ] `Palisade` and `Gate` interaction is readable
- [ ] wave damage flows into the settlement repair loop

### Checkpoint D: Social Runtime Stable

- [ ] Sabine cast loads from authored data
- [ ] roster and household summaries work
- [ ] `wounded`, `missing`, and `dead` persist
- [ ] one key-person loss changes labor and social state

### Checkpoint E: Sabine Overlay Stable

- [ ] `Bell Post` works
- [ ] Sabine starter spells, runes, and policies work
- [ ] Sabine command cadence works
- [ ] one full early cycle feels like Sabine and not just the neutral baseline

## Recommended Demo / Validation Moments

### Demo 1: Prototype 1 -> 2 Bridge

- [ ] show building placement from the survey map
- [ ] show named-site alerts focusing damaged or unfinished structures
- [ ] show `Storehouse Foundation` as a map-readable objective

### Demo 2: Prototype 2 -> 3 Bridge

- [ ] show a wave passing near the settlement
- [ ] show diversion toward `Field` or `Gate`
- [ ] show damage feeding directly into repair priorities

### Demo 3: Prototype 3 -> 4 Bridge

- [ ] show named villagers tied to breached or damaged sites
- [ ] show one villager becoming `wounded` or `missing`
- [ ] show labor slowdown and social-summary change

### Demo 4: Prototype 4 -> 5 Bridge

- [ ] show `Protected Households` or `Ordered Levies` changing a real social outcome
- [ ] show `Bell Post` and `Rally Chime` improving readiness without granting sight
- [ ] show Sabine's first-cycle support changing how the player responds

### Demo 5: First Milestone Vertical Slice

- [ ] one early warning
- [ ] one wave
- [ ] one structural-damage outcome
- [ ] one social-damage outcome
- [ ] one Sabine recovery decision

## What Needs To Be True Before Moving Between Integration Phases

### Before Moving From Phase 0 To Phase 1

- [ ] one shared scene exists
- [ ] one shared state container exists
- [ ] site ids can be created and looked up consistently

### Before Moving From Phase 1 To Phase 2

- [ ] information states are readable enough to support placement
- [ ] map focus and alert focus are stable
- [ ] site naming is stable enough to reuse in economy UI

### Before Moving From Phase 2 To Phase 3

- [ ] required building states are stable
- [ ] stockpiles and repair states are stable
- [ ] `Field`, `Storehouse`, `Palisade`, and `Gate` exist as real runtime targets
- [ ] start package loading is working

### Before Moving From Phase 3 To Phase 4

- [ ] wave outcomes can identify affected sites
- [ ] alerts can identify when and where pressure occurred
- [ ] damage results are stable enough to attach NPC consequence to them

### Before Moving From Phase 4 To Phase 5

- [ ] NPC schema `M1 required` fields are real in runtime
- [ ] households are real in runtime
- [ ] one post-wave social consequence loop works
- [ ] emergency-defense hook works at minimum depth

### Before Calling The Integrated Milestone “Playable”

- [ ] one end-to-end early cycle works without authored hand-repair between systems
- [ ] building data drives the shared building roster used at runtime
- [ ] wave data drives the minimum wave roster and minimum templates used at runtime
- [ ] NPC schema drives the minimum social records used at runtime
- [ ] Sabine starting package drives the settlement start state used at runtime
- [ ] Sabine overlay sits on top of the shared baseline rather than replacing it

## Suggested Milestone Reviews

### Review 1: Shared Scaffolding Review

- [ ] Are we building one shared runtime or drifting into per-prototype branches?
- [ ] Are ids and site naming already stable?

### Review 2: Data Boundary Review

- [ ] Which runtime values are still hard-coded that should now come from building, wave, NPC, or package data?
- [ ] Are temporary placeholders still using final ids and enums?

### Review 3: Handoff Review

- [ ] Does each prototype actually hand state to the next, or are we still faking transitions manually?
- [ ] Which fake events can now be replaced by real upstream outputs?

### Review 4: Sabine Timing Review

- [ ] Are we adding Sabine features because the shared baseline is ready, or because shared systems are still confusing?
- [ ] Is Sabine masking baseline problems that should be fixed first?

### Review 5: Vertical Slice Review

- [ ] Can a tester explain what they saw, what they lost, and what Sabine changed?
- [ ] Is the first milestone already proving the intended identity before more content is added?
