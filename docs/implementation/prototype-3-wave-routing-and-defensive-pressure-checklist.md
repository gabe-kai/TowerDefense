# Prototype 3: Wave Routing and Defensive Pressure Checklist

Status: Draft
Scope: Prototype 3
Phase: Pre-production
Owner: Design / Engineering
Source of Truth: No

This document turns the current wave-routing, warning, diversion, and settlement-pressure design into a concrete Prototype 3 build checklist.

It is not a replacement for:

- `docs/monster-wave-design.md`
- `docs/camera-controls-and-visibility-spec.md`
- `docs/mvp-scope-and-prototype-plan.md`
- `docs/prototype-backlog.md`
- `docs/data/wave-data-sheet.md`
- `docs/implementation/prototype-1-camera-and-information-readability-checklist.md`
- `docs/implementation/prototype-2-settlement-economy-and-rebuild-loop-checklist.md`

Its job is to define the smallest implementation slice that can prove waves feel like moving landscape pressure, not fixed lanes, while staying readable from the tower and feeding naturally into the existing recovery loop.

## Prototype Goal

Prototype 3 should prove that a wave can enter off-map, traverse the landscape toward an off-map exit, notice and possibly divert toward the player's settlement, pressure defenses in readable ways, and leave damage that naturally creates Prototype 2 rebuild decisions.

This prototype should stay intentionally small:

- one prototype map
- one Sabine-aligned starting settlement
- one warning-stage event
- one simple traversing wave
- one simple swarm threat
- one more dangerous breach or pressure unit
- one basic diversion model
- one clear defense line using `Palisade` and `Gate`

Recommended placeholder framing:

- use Sabine's compact start and first-wave teaching context
- use one map with a clear path corridor or mana-following route passing near the settlement
- use `wave.warning.displaced_foragers` plus one early wave template
- use `monster.warning.vermin_surge`, `monster.scurry.gnawers`, and `monster.brute.ramhorns` as the non-negotiable baseline
- use authored warning and route markers first if needed for readability tests

## Prototype Purpose

- [ ] Prove that waves feel like moving landscape pressure rather than tower-defense lanes.
- [ ] Prove that warning-stage escalation gives enough time to prepare before direct contact.
- [ ] Prove that settlement proximity and attraction can cause readable diversion.
- [ ] Prove that `Palisade` and `Gate` meaningfully shape threat behavior.
- [ ] Prove that broad defensive responses are enough for the player to feel agency without unit micro.
- [ ] Prove that failed defense creates visible structural and economic consequences that hand back into Prototype 2.

## Prototype Success Criteria

- [ ] A tester can understand that the wave begins off-map and is trying to reach an off-map exit.
- [ ] A tester can identify the likely approach direction before first contact through warning-stage escalation.
- [ ] A tester can see the wave normally follow a path corridor or mana geography rather than charge the settlement blindly.
- [ ] A tester can see settlement proximity, food, or mana attraction cause a possible diversion.
- [ ] A tester can distinguish the behavior of a swarm pressure unit and a breach-capable brute.
- [ ] A tester can see `Gate` and `Palisade` shape wave behavior in a readable way.
- [ ] A tester can issue at least one broad defensive response and understand what it changed.
- [ ] When defenses fail, the damage looks like the result of route logic and structural weakness rather than randomness.
- [ ] Post-wave damage clearly creates recovery work for Prototype 2 systems.

## Must-Prove Questions

- [ ] Does off-map entry and off-map exit make the wave feel like a migration or incursion instead of a spawn-on-base event?
- [ ] Does terrain-aware movement create understandable route pressure?
- [ ] Can an early wave pass by unless the settlement is attractive enough?
- [ ] Do food and mana act as readable attraction sources?
- [ ] Does a basic `rage if blocked` response create credible pressure without feeling chaotic?
- [ ] Do `Palisade` and `Gate` interaction rules feel legible from the tower-centered perspective?
- [ ] Are warning stages and alert cards good enough to support reaction without omniscience?
- [ ] Does broad response feel sufficient, or does the player immediately wish for unit micro?
- [ ] Do failure consequences feed naturally into recovery rather than just ending the scenario?

## Explicitly In Scope

### Core Wave Slice

- [ ] one single traversing wave entering off-map and exiting off-map
- [ ] one route that normally follows mana geography or a clear path corridor
- [ ] one settlement near enough to be noticed
- [ ] possible diversion toward the settlement
- [ ] one warning-stage event before the main wave
- [ ] one simple early wave template

### Required Threats

- [ ] at least one simple unintelligent swarm threat
- [ ] at least one more dangerous pressure unit or brute
- [ ] at least one warning-stage displaced-fauna event

Recommended minimum roster:

- [ ] `monster.warning.vermin_surge`
- [ ] `monster.scurry.gnawers`
- [ ] `monster.brute.ramhorns`

### Required Behaviors

- [ ] mana attraction
- [ ] food attraction
- [ ] settlement proximity attraction
- [ ] basic `rage if blocked` response
- [ ] wall / gate interaction
- [ ] simple terrain interaction
- [ ] warning-stage escalation
- [ ] alert generation when threats are reported
- [ ] broad defensive response opportunities
- [ ] visible post-wave consequences

### Required Structures / Context

- [ ] reuse the Prototype 2 settlement baseline
- [ ] `Field` as a plausible target
- [ ] `Storehouse` or `Storehouse Foundation` as a plausible target
- [ ] `Palisade` and `Gate` as route-shaping tools
- [ ] roads as both defender-logistics aid and possible monster-speed aid

## Explicitly Out of Scope

- [ ] large monster roster depth
- [ ] many simultaneous waves
- [ ] many boss families
- [ ] permanent corruption systems
- [ ] deep fire support or fire spread as required baseline
- [ ] advanced siege ecosystems
- [ ] flying, tunneling, climbing, or swimming locomotion
- [ ] detailed formation control
- [ ] formation-by-formation battlefield tactics
- [ ] continuous unit-by-unit route recomputation
- [ ] full strategic AI across many settlements

Recommended placeholder scope rule:

- [ ] if a behavior does not help prove traversal, diversion, gate/wall pressure, warning readability, or damage-to-rebuild handoff, postpone it

## Required Wave Behaviors

- [ ] spawn off-map at one authored entry edge
- [ ] travel toward one authored off-map exit edge
- [ ] maintain a group-level route
- [ ] use one authored intelligence tier
- [ ] use one authored objective bias
- [ ] perform diversion checks at event triggers, not continuously
- [ ] pressure structures and civilians only when they become meaningfully attractive or block the route
- [ ] leave the map or resolve after successful traversal or settlement interaction

Recommended minimum wave templates:

- [ ] `wave.warning.displaced_foragers`
- [ ] `wave.early.scurry_passby`
- [ ] optional second test template: `wave.early.scurry_and_ramhorn`

Recommended placeholder implementation rules:

- [ ] use one group controller for the wave, not bespoke per-unit strategy
- [ ] reveal projected exit edge late or not at all in the minimum slice if that keeps the loop simpler
- [ ] use one simple attraction-score evaluation at trigger points

## Required Monster Behaviors

### `Vermin Surge`

- [ ] acts as a warning-stage nuisance event, not the main wave
- [ ] pressures `Food`, `Storehouse` edges, livestock hooks, or exposed civilians
- [ ] helps teach recall and shelter behavior before full contact

### `Gnawers`

- [ ] function as the baseline swarm attrition threat
- [ ] prefer `Food`, `Storehouse`, and other weak targets
- [ ] normally avoid intact walls if a cleaner route exists
- [ ] exploit gaps or already-open access

### `Ramhorns`

- [ ] function as the baseline breach-capable brute
- [ ] prefer `Gate`, `Wall`, or blocking defenders
- [ ] attack a gate or wall when blocked from the desired path
- [ ] create a memorable breach or impact moment

Recommended placeholder behavior split:

- [ ] treat `Gnawers` as the main route-pressure body
- [ ] treat `Ramhorns` as the path-forcing accent unit

## Required Route and Diversion Behaviors

- [ ] wave has a default route from entry edge to exit edge
- [ ] default route follows mana geography or a clear corridor
- [ ] settlement attraction can modify route pressure
- [ ] attraction score includes at minimum:
- [ ] path proximity
- [ ] visible or known `Mana`
- [ ] visible or known `Food`
- [ ] open or weak route access
- [ ] defender aggression if practical
- [ ] diversion checks happen:
- [ ] on settlement notice range
- [ ] after failed breach attempt
- [ ] after major path block if implemented

### Mana Attraction

- [ ] active or visible mana-linked structures create attraction
- [ ] mana attraction is strong enough to matter but not mandatory in every early test

Recommended placeholder:

- [ ] use `Tower Core` as a weak mana attraction source in Prototype 3 if `Mana Well Tap` is not implemented yet

### Food Attraction

- [ ] `Field` or exposed food infrastructure can attract early waves
- [ ] food attraction is strong enough to explain why pass-by waves sometimes turn toward the settlement

### Rage If Blocked

- [ ] wave or brute can switch from route-following to attack-blocker behavior when blocked
- [ ] `Ramhorns` should be the clearest carrier of this rule
- [ ] this rule should feel triggered by obstruction, not random target switching

Recommended placeholder:

- [ ] one simple rage trigger: if preferred route is blocked by closed `Gate` or intact `Palisade`, `Ramhorns` attack the nearest gate or blocking segment

## Required Settlement-Pressure Behaviors

- [ ] waves may pass close enough to threaten outer sites without fully sieging the tower
- [ ] exposed `Field` can be damaged
- [ ] `Storehouse` or `Storehouse Foundation` can be damaged if diverted pressure reaches it
- [ ] `Palisade` and `Gate` can be damaged
- [ ] civilians or worker exposure consequences can be signaled, even if Prototype 4 depth is not present yet
- [ ] wave damage should reduce economic capacity or create repair backlog

Recommended minimum visible consequences:

- [ ] damaged `Field` lowers food outlook
- [ ] damaged `Gate` weakens perimeter and creates repair demand
- [ ] damaged `Palisade` creates a breach point
- [ ] damaged `Storehouse` or foundation weakens logistics and storage plans

## Required Warning and Alert Behaviors

- [ ] one warning-stage escalation ladder before main body contact
- [ ] at least one omen or sign stage
- [ ] at least one refugee or survivor/scout stage
- [ ] at least one main-body-sighted stage
- [ ] alert cards surface important updates
- [ ] alerts use named sites where possible
- [ ] alerts support `Face From Tower`
- [ ] alerts support `Open On Map`
- [ ] reports do not grant false line of sight
- [ ] confidence and age remain readable if already implemented from Prototype 1

Recommended minimum warning profile:

- [ ] `warning.displaced_hunger` for the pre-wave event
- [ ] `warning.scurry_swarm` or `warning.brute_beast` for the main wave

Recommended placeholder alert examples:

- [ ] `Workers report movement near the Field`
- [ ] `Pressure at South Gate`
- [ ] `Ramhorns sighted near Miller's Bridge`

## Required Player Responses

- [ ] use warning time to reposition attention and prepare
- [ ] use `Face From Tower` to orient toward the approach
- [ ] use `Open On Map` to inspect route and sites
- [ ] issue at least one broad defensive response instead of unit micro
- [ ] choose whether to protect `Field`, `Gate`, `Storehouse`, or civilians first
- [ ] observe whether a pass-by wave is likely to divert
- [ ] react to breach or route change with a broad site-based order

Recommended minimum response set:

- [ ] `Hold`
- [ ] `Reinforce`
- [ ] `Shelter Civilians`
- [ ] optional `Fall Back To`

Recommended response philosophy:

- [ ] broad responses should change site outcomes, not individual formations

## Required Failure States

- [ ] warning arrives too late for a clean response
- [ ] outer food site is damaged because response was too slow or layout was poor
- [ ] gate or wall segment is breached
- [ ] settlement attraction causes a wave that might have passed by to divert into danger
- [ ] defenses fail and produce visible structural consequences
- [ ] post-wave recovery burden is heavier because of the route and diversion outcome

Recommended prototype-level failure framing:

- [ ] use damage, breach, and economic fallout as the main failure proof
- [ ] do not require a full game-over state to validate Prototype 3

## Core Feature Checklist

### Traversal Core

- [ ] implement off-map entry
- [ ] implement off-map exit
- [ ] implement one traversing route
- [ ] implement group-level route following
- [ ] implement simple terrain desirability or route-cost logic

### Diversion Core

- [ ] implement one settlement attraction score
- [ ] implement mana attraction
- [ ] implement food attraction
- [ ] implement diversion event triggers
- [ ] implement pass-by versus divert outcomes

### Monster Core

- [ ] implement `Vermin Surge`
- [ ] implement `Gnawers`
- [ ] implement `Ramhorns`
- [ ] implement one swarm-versus-brute behavior distinction
- [ ] implement `rage if blocked` on `Ramhorns`

### Defense Interaction Core

- [ ] implement `Palisade` interaction
- [ ] implement `Gate` interaction
- [ ] implement blocked-path attack behavior
- [ ] implement at least one damage result on structures

### Warning and Alert Core

- [ ] implement warning-stage escalation
- [ ] implement threat reports
- [ ] implement named-site alerts
- [ ] implement `Face From Tower`
- [ ] implement `Open On Map`
- [ ] implement crisis alert when a key site is under pressure or breached

### Pressure-and-Aftermath Core

- [ ] implement economic-site damage outcomes
- [ ] implement defense-site damage outcomes
- [ ] hand damage into Prototype 2 repair and rebuild systems

## Data / Content Dependencies

- [ ] use monster ids and template ids from `docs/data/wave-data-sheet.md`
- [ ] use structure behavior from `docs/data/building-data-sheet.md`
- [ ] reuse Prototype 1 alert and map interaction patterns
- [ ] reuse Prototype 2 damage, repair, and recovery outputs
- [ ] keep ids and template values data-driven where practical

Recommended authored baseline for Prototype 3:

- [ ] Sabine starting settlement from the existing package
- [ ] one prototype map with one approach corridor near the `Field`
- [ ] one named outer landmark such as `Miller's Bridge`
- [ ] one early `Palisade + Gate` line
- [ ] one warning-event setup using `wave.warning.displaced_foragers`
- [ ] one main-wave setup using `wave.early.scurry_passby`
- [ ] optional second scenario using `wave.early.scurry_and_ramhorn`

Recommended early placeholder values:

- [ ] `wave.warning.displaced_foragers` budget about `4`
- [ ] `wave.early.scurry_passby` budget about `10`
- [ ] `wave.early.scurry_and_ramhorn` budget about `14`
- [ ] `Gnawers` remain the cheap baseline swarm
- [ ] `Ramhorns` remain the expensive breach accent
- [ ] one diversion score threshold is enough for the minimum slice

## Recommended Implementation Order

### Step 1: Wave Traversal Shell

- [ ] off-map spawn
- [ ] off-map exit
- [ ] one group route
- [ ] one route corridor or mana-following path

### Step 2: Warning Presentation

- [ ] warning stages
- [ ] alert generation
- [ ] named-site wording
- [ ] `Face From Tower` and `Open On Map` support

### Step 3: Minimum Threat Roster

- [ ] `Vermin Surge`
- [ ] `Gnawers`
- [ ] `Ramhorns`
- [ ] one authored main-wave template

### Step 4: Diversion Logic

- [ ] settlement attraction score
- [ ] food attraction
- [ ] mana attraction
- [ ] pass-by versus divert decision

### Step 5: Defense Interaction

- [ ] `Palisade`
- [ ] `Gate`
- [ ] gate preference
- [ ] blocked-path response
- [ ] brute breach pressure

### Step 6: Damage and Consequence

- [ ] structural damage
- [ ] field or storage damage
- [ ] crisis alerts
- [ ] post-wave repair burden

### Step 7: Readability Pass

- [ ] route readability
- [ ] warning readability
- [ ] diversion readability
- [ ] breach readability
- [ ] aftermath readability

## Minimum Test Scenarios

### Scenario 1: Pass-By Baseline

- [ ] Spawn one `wave.early.scurry_passby`.
- [ ] Wave enters off-map and exits off-map.
- [ ] Settlement is nearby but not automatically attacked.
- [ ] Tester can explain why the wave mostly followed its route.

### Scenario 2: Food-Side Diversion

- [ ] Place the `Field` close enough to the route to matter.
- [ ] Run an early swarm wave.
- [ ] Wave diverts or partially diverts toward food pressure.
- [ ] Tester can explain why food attraction pulled pressure inward.

### Scenario 3: Gate Pressure

- [ ] Set a defended `Palisade + Gate` line on the likely diversion path.
- [ ] Run `wave.early.scurry_and_ramhorn`.
- [ ] `Ramhorns` pressure the `Gate` or blocking segment.
- [ ] Tester can explain why the gate became the pressure point.

### Scenario 4: Rage If Blocked

- [ ] Close or hard-block the easiest path.
- [ ] `Ramhorns` encounter the obstruction.
- [ ] They switch into a basic attack-blocker behavior.
- [ ] Outcome is readable as a response to blockage, not random aggression.

### Scenario 5: Warning Escalation

- [ ] Trigger `Vermin Surge` as a pre-wave event.
- [ ] Trigger at least two warning stages before main contact.
- [ ] Tester can identify direction, seriousness, and likely threatened site before direct contact.

### Scenario 6: Alert and Response Loop

- [ ] Generate report alert at a named site.
- [ ] Tester uses `Face From Tower`.
- [ ] Tester optionally uses `Open On Map`.
- [ ] Tester issues one broad response such as `Reinforce` or `Shelter Civilians`.

### Scenario 7: Failure With Consequence

- [ ] Allow the wave to damage the `Field`, `Gate`, or `Storehouse`.
- [ ] Structural and economic consequences become visible.
- [ ] Tester can identify what now needs rebuilding.

### Scenario 8: Post-Wave Handoff

- [ ] End the wave after traversal or settlement interaction.
- [ ] Damaged structures enter Prototype 2 repair states.
- [ ] Tester can make at least one meaningful recovery priority decision.

## Validation Criteria

- [ ] Waves feel like moving landscape pressure.
- [ ] Off-map entry and exit are readable.
- [ ] Warning stages arrive early enough to matter.
- [ ] Diversion feels understandable, not arbitrary.
- [ ] Food and mana attraction both influence pressure in legible ways.
- [ ] `Gnawers` and `Ramhorns` feel behaviorally distinct.
- [ ] `Palisade` and `Gate` matter tactically.
- [ ] Broad defensive responses feel sufficient for the slice.
- [ ] Damage outcomes feel caused by route logic and defense quality.
- [ ] Post-wave consequences naturally feed the rebuild loop.

Recommended validation method:

- [ ] run at least one guided internal test and one cold-read test
- [ ] ask testers where they believed the wave wanted to go before contact
- [ ] log every case where testers could not explain why the wave diverted or attacked a specific structure

## Failure Cases to Watch For

- [ ] waves feel like scripted lanes instead of traversing pressure
- [ ] waves always hard-divert into the settlement and never meaningfully pass by
- [ ] waves never divert, making settlement placement irrelevant
- [ ] route changes are too frequent to read
- [ ] route changes are too rare to feel responsive
- [ ] mana attraction is invisible or too weak to matter
- [ ] food attraction is invisible or too weak to matter
- [ ] `rage if blocked` looks random
- [ ] `Palisade` and `Gate` do not shape behavior enough
- [ ] `Palisade` and `Gate` shape behavior so strongly that the wave becomes trivial
- [ ] alerts arrive too late
- [ ] alerts are too noisy or vague to act on
- [ ] broad responses feel fake because site outcomes barely change
- [ ] post-wave damage is too light to matter
- [ ] post-wave damage is too severe to recover from with Prototype 2 systems

## Handoff To Prototype 4

Prototype 3 is ready to hand off when:

- [ ] off-map traversal works
- [ ] warning escalation is readable
- [ ] settlement diversion works
- [ ] `Gnawers` and `Ramhorns` provide distinct pressure roles
- [ ] `Palisade` and `Gate` interactions are stable
- [ ] damage outcomes hand cleanly into Prototype 2 recovery
- [ ] alerts and site names are good enough to support named-NPC consequence surfacing

Prototype 4 should build on this by adding:

- [ ] named villagers caught in warning, evacuation, or overrun states
- [ ] clearer household-level consequences when outer sites fail
- [ ] visible difference between losing a structure and losing a person
- [ ] grief, loyalty, and morale fallout from the wave outcomes
- [ ] stronger social consequences for failed sheltering or exposed workers

## Follow-Up Questions For Later Prototypes

- [ ] Should `Scrap Runners` be the first added post-minimum threat to prove deliberate mana targeting?
- [ ] At what warning stage should the projected exit path become visible in the UI for early versus later waves?
- [ ] How much defender aggression should increase settlement attraction in the minimum slice?
- [ ] Should `Road` speed bonus help monsters immediately in Prototype 3, or only once that tradeoff becomes more readable?
- [ ] When Prototype 4 adds civilian consequence, how explicit should `Overrun` state become in the player-facing UI?
- [ ] Should early fire pressure remain fully out of scope for Prototype 3 minimum, or should one optional burn scenario ship if wall and route readability are already solid?
