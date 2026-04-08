# MVP Scope and Prototype Plan

Status: Active
Scope: Planning
Phase: Pre-production
Owner: Design
Source of Truth: Yes

## Purpose

This document defines:

- the first implementation milestone
- what is inside that milestone
- what is explicitly out of scope
- which systems must be prototyped first
- the recommended implementation order

This is a planning document, not the full game design canon. It should stay tightly focused on how to turn the current design set into a realistic first playable build.

## Planning Principles

The first implementation milestone should:

- prove the core fantasy
- prove the tower-anchored camera and survey-map loop
- prove the settlement recovery loop
- prove that named villagers make losses matter
- prove that waves feel like moving pressure rather than static lanes
- stay small enough that it can actually be built

The first implementation milestone should not attempt to prove the entire long-term game at once.

## First Implementation Milestone

The first implementation milestone is the smallest playable build that demonstrates the game's identity.

Working definition:

- one map
- solo only
- one faction: Sabine Merrow
- one settlement
- one playable wave cycle loop with recovery and preparation
- one baseline economy
- one baseline social model
- one readable monster-wave model
- one functioning tower-view plus survey-map control loop

This milestone is not the whole intended V1 faction set.

## In Scope

### Core Player Experience

- tower-anchored live camera
- strategic surveyed map
- alert/report system
- broad site-based command model
- building placement on surveyed terrain
- rune placement on surveyed terrain
- live-view line-of-sight spellcasting
- report-based broad area actions where supported

### Economy

- stockpiled resources:
  - `Food`
  - `Wood`
  - `Stone`
  - `Mana`
- operational pressures:
  - labor availability
  - housing capacity
  - storage capacity
  - safety
- hauling and roads
- rebuilding and repair

### Settlement

- manually placed structures
- desire paths
- simple housing pressure
- food production
- mana intake and storage
- basic defense perimeter
- post-wave rebuilding choices

### Social Model

- named persistent villagers
- households
- basic age classes
- core personality traits
- core social states
- job market behavior
- drafting
- grief from death and major loss
- immigration and desertion hooks if practical

### Faction Content

- Sabine Merrow only
- Bell Post
- Sabine starting spells, runes, and policies that are essential to the baseline experience
- Sabine command cadence and command style

### Waves and Threats

- warning-stage omens and reports
- simple wave composition system
- early and mid-tier threats from the first-playable monster roster
- one initial boss family if bandwidth allows
- terrain-aware routing
- settlement diversion rules
- fire as a settlement hazard

Implementation-facing baseline:

- Prototype 3 minimum roster: `Vermin Surge`, `Gnawers`, `Ramhorns`
- later in milestone: `Hungry Predators`, `Panicked Herd`, `Blight Locusts`, `Scrap Runners`
- broader first-playable only: `Gate-Cutters`, `Cinderkin`, `Wellmaw`
- companion data source: `docs/data/wave-data-sheet.md`

## Explicitly Out Of Scope

These should not be required for the first implementation milestone.

### Factions

- Ash-Hart as a playable faction
- Aurelian as a playable faction
- Orren as a playable faction
- faction selection screen

### Multiplayer

- competitive multiplayer
- co-op multiplayer
- AI rival towers

### Advanced Camera/Control

- familiar camera as a full system
- multiple simultaneous remote camera bodies
- deep artillery calibration
- detailed formation control
- freeform combat-zone drawing

### Advanced Economy

- money or trade value
- iron
- luxuries
- rare reagents
- advanced supply chains
- deep livestock breeding
- per-household visible food accounting
- advanced granary forecasting UI

### Advanced Social Simulation

- romance simulation
- inheritance systems
- deep long-term class politics
- crime and punishment
- elaborate master-court intrigue

### Advanced Threats

- full flying/tunneling/swimming roster depth
- many boss families
- permanent map corruption systems
- highly complex siege ecosystems

## Quality Bar For The First Milestone

The milestone succeeds if a player can:

- build a small viable settlement
- understand what they can and cannot see
- prepare for a wave based on imperfect information
- survive at least one meaningful wave through planning and response
- suffer visible human consequences when things go badly
- rebuild and prepare for the next cycle
- understand why Sabine is the baseline teaching faction

## Prototype Priorities

Not all systems should be fully implemented before prototyping. Some should be proven early with rough versions.

### Prototype 1: Camera and Information Readability

Must answer:

- Is the tower-anchored view fun instead of frustrating?
- Does the survey-map loop feel natural?
- Are alerts and reports understandable under pressure?
- Can the player act on incomplete information without feeling cheated?

Minimum prototype ingredients:

- simple tower camera
- map toggle
- fog-of-war states
- alert card behavior
- one or two site commands

### Prototype 2: Settlement Recovery Loop

Implementation-facing companion:

- `docs/implementation/prototype-2-settlement-economy-and-rebuild-loop-checklist.md`

Must answer:

- Does rebuilding between waves feel meaningful?
- Do housing, food, logistics, and repairs create real pressure?
- Does the player understand why layout matters?

Minimum prototype ingredients:

- Tower Core
- House
- Field
- Woodcutter Camp
- Storehouse
- Builder's Yard
- simple roads
- one repair loop

### Prototype 3: Wave Routing Pressure

Implementation-facing companion:

- `docs/implementation/prototype-3-wave-routing-and-defensive-pressure-checklist.md`

Must answer:

- Do waves feel like moving landscape pressure rather than lanes?
- Does terrain-aware movement produce interesting routing?
- Can the player actually feel route manipulation?

Minimum prototype ingredients:

- simple map terrain
- off-map entry and exit
- `Vermin Surge` warning event
- `Gnawers` as the baseline swarm type
- `Ramhorns` as the baseline breach type
- simple diversion rule
- simple palisade/gate interaction

### Prototype 4: Human Consequence Layer

Implementation-facing companion:

- `docs/implementation/prototype-4-social-consequence-and-named-villagers-checklist.md`

Must answer:

- Do named NPCs change how damage feels?
- Is losing people meaningfully different from losing structures?
- Can a lightweight social model already support grief, loyalty, and drafting pressure?

Minimum prototype ingredients:

- named villagers
- households
- job selection
- simple morale/loyalty/grief values
- death and rehousing consequences

## Recommended Build Order

### Phase 1: Readability Core

1. camera shell
2. survey map
3. site naming
4. alert/report system
5. basic command grammar

### Phase 2: Settlement Baseline

6. resource storage and daily simulation shell
7. building placement and construction
8. roads and hauling
9. food and housing pressure
10. repair and rebuilding loop

### Phase 3: Threat Baseline

11. off-map wave spawning
12. simple terrain-aware routing
13. wall/gate interaction
14. warning stages
15. basic fire hazard

### Phase 4: Social Weight

16. named NPC data model
17. households
18. job market
19. grief / loyalty / morale shell
20. drafting and exposure consequences

### Phase 5: Sabine Layer

Implementation-facing companion:

- `docs/implementation/prototype-5-sabine-baseline-faction-layer-checklist.md`

21. Bell Post
22. Sabine command cadence
23. Sabine spell/rune/policy kit
24. Sabine-specific recovery and legitimacy tuning

## Shared Systems Versus Faction Overlays

To control scope, the first implementation milestone should treat most of the game as shared baseline systems.

### Shared Baseline

- camera model
- survey map
- alerts and reports
- building placement
- resource model
- social data model
- wave routing framework
- command grammar

### Sabine Overlay

- command tone
- Bell Post
- Survey Light
- Household Ward
- Rally Chime
- Measured Bolt
- Alarm Rune
- Waymark Rune
- Sentry Seal
- Open Granary
- Protected Households
- Repair First
- Ordered Levies

The first milestone should avoid building faction-specific subsystems unless Sabine truly requires them.

## Major Cross-System Questions Still To Lock

These should be resolved before or during prototype planning, because they affect multiple systems.

1. How should fire suppression work in the first implementation milestone?
2. How visible should projected wave-route information become before direct contact?
3. How often should `Food` and `Mana` target priority invert by wave template?
4. Which faction-specific UI cues are necessary in the first milestone, and which should wait?
5. How much of Sabine's special battlefield intervention belongs in the first milestone versus later tuning?

## Exit Criteria For Moving Beyond The First Milestone

The project should only move into broader V1 expansion when:

- the tower camera and survey map feel good
- players can read alerts and site names quickly
- one settlement can survive and recover through repeated pressure
- named villagers make losses emotionally and mechanically meaningful
- Sabine feels distinct without requiring bespoke systems everywhere
- the core loop is fun before adding more faction complexity

## Next Planning Documents

After this document, the most useful implementation-facing planning docs are likely:

1. `docs/prototype-backlog.md`
2. `docs/data/npc-schema-and-value-ranges.md`
3. `docs/data/building-data-sheet.md`
4. `docs/data/wave-data-sheet.md`
5. `docs/data/sabine-starting-package.md`
