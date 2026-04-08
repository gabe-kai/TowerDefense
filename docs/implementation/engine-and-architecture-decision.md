# Engine and Architecture Decision

Status: Active
Scope: Whole Project
Phase: Pre-production
Owner: Engineering / Design
Source of Truth: Yes

## Purpose

This document locks the high-level implementation direction for the first implementation milestone.

It is not:

- a full system design document
- a Unity tutorial
- a promise that every future subsystem is already solved

Its job is to set practical boundaries for how this project should be built in Unity so the prototype sequence can turn into one real, reusable project instead of a pile of disconnected experiments.

This document should be read alongside:

- `docs/game-design-document.md`
- `docs/mvp-scope-and-prototype-plan.md`
- `docs/prototype-backlog.md`
- `docs/implementation/prototype-integration-order.md`
- the milestone data sheets and prototype checklists under `docs/data/` and `docs/implementation/`

## Decision Summary

The current implementation direction is:

- engine: `Unity`
- programming language: `C#`
- first playable target: `Windows desktop`
- production priority: fast iteration, solo-friendly workflow, and low-friction tooling over cutting-edge rendering
- game priority: simulation sandbox, readability, and systemic iteration over presentation-heavy spectacle
- rendering assumption: low-detail and placeholder-friendly 3D is acceptable for milestone 1
- architecture direction: hybrid Unity scene/component architecture with plain C# simulation systems, not ECS/DOTS-first
- terrain direction for milestone 1: a simplified gameplay terrain representation with visually believable terrain layered on top
- optimization direction: postpone data-oriented rewrites until profiling shows a real bottleneck

## Why Unity

Unity is the chosen engine because it best matches the actual risks and priorities of this project.

The project needs:

- fast iteration on gameplay rules
- practical editor tooling for a solo developer
- straightforward scene authoring for one prototype map and one settlement
- easy creation of debug views, gizmos, overlays, and data-driven authoring workflows
- acceptable 3D support without needing high-end rendering as the main value proposition

Unity is a good fit for milestone 1 because the first implementation milestone is mostly about proving:

- the tower-anchored camera and survey-map loop
- settlement placement and rebuild flow
- wave routing pressure
- named villager consequence
- Sabine as an overlay on shared systems

Those are gameplay, tooling, and iteration problems first. They are not graphics-pipeline problems first.

Unity also fits the project's likely early workflow better than a web-first stack. A web-first approach is not recommended because:

- the project depends on a real 3D spatial world, not a primarily UI-first simulation
- camera readability, terrain shaping, line of sight, route pressure, and settlement layout all benefit from mature native-engine scene workflows
- browser deployment would add rendering, input, memory, packaging, and performance constraints before they are needed
- the first playable target is Windows desktop, so shipping through a browser would optimize for the wrong platform
- a web-first stack would likely increase custom engine work exactly where this project should currently be buying time from the engine

## Why Not Unreal or Godot Right Now

This is not a claim that Unreal or Godot are bad fits in general. It is a statement about current project priorities.

### Why not Unreal as the current direction

Unreal is not the current direction because this project does not primarily need Unreal's strengths for milestone 1.

Current priorities are:

- fast gameplay iteration
- solo-friendly scripting velocity
- light-to-moderate rendering ambition
- rapid content placeholdering
- practical editor-driven prototyping with minimal overhead

For this milestone, Unreal would likely add more complexity than value in areas like:

- project setup weight
- C++-oriented engineering overhead if Blueprints stop being enough
- a heavier content and pipeline footprint than this milestone needs

That trade is harder to justify for a prototype-first simulation-heavy game whose first milestone is intentionally modest visually.

### Why not Godot as the current direction

Godot is not the current direction because the project is choosing lower implementation risk over engine-lightweight appeal.

The project needs confidence in:

- 3D tooling maturity
- long-lived project structure
- editor ecosystem and workflow familiarity
- stable support for the kind of hybrid runtime this game will likely need

Godot could be viable for a smaller or more narrowly scoped version of the game, but for this project Unity is the more conservative implementation choice with a clearer path from rough prototype to sustained production.

## Why C#

C# is the chosen language because it matches both the engine choice and the project's intended architecture.

It supports:

- fast iteration compared with heavier low-level alternatives
- a clean path between Unity-facing behaviours and plain simulation code
- good readability for authored systems and tools
- practical data-model authoring for villagers, buildings, waves, and faction packages
- testable plain-code systems outside of scene logic

The key point is that C# lets the project use one language across:

- Unity scene integration
- runtime orchestration
- simulation services
- data loading and validation
- save/load support
- editor tooling and debug utilities

That is especially important for a solo-friendly workflow.

## Architecture Recommendation

The recommended high-level architecture style is:

- Unity scene objects and MonoBehaviours for world presence, interaction wiring, and presentation
- plain C# data models for authoritative game state
- plain C# services and systems for simulation rules
- a thin orchestration layer that synchronizes simulation state to scene objects and UI

This is a hybrid architecture.

It is intentionally not:

- pure MonoBehaviour-everywhere architecture
- pure ECS/DOTS architecture
- a heavy enterprise-style service framework

The project should begin with one shared playable runtime and one prototype map scene, then grow by replacing stubs in place.

## What Hybrid Architecture Means Here

For this project, "hybrid architecture" means:

- Unity scenes own authored world layout, references, prefabs, camera rig, terrain presentation, and visible objects
- plain C# owns the durable simulation state and most rule evaluation
- MonoBehaviours are adapters and controllers, not the main home of simulation truth
- runtime state should be serializable without requiring scene object identity to be the source of truth
- later optimization can move selected subsystems toward data-oriented execution without rewriting the whole project structure

In practical terms:

- a `BuildingView` or `SiteView` MonoBehaviour may exist in the scene
- the authoritative building instance should still be a plain C# record or class with a stable id
- a villager's household, status, morale, grief, and assignment should live in simulation data, not only on the GameObject representing the villager
- wave templates, building definitions, and faction starting packages should load from authored data assets, then instantiate runtime state objects

## Unity Scene Structure

The first implementation milestone should use one main playable scene as the integration surface, not separate prototype-only runtime architectures.

Recommended high-level scene structure:

- `Bootstrap`
- `World`
- `Terrain`
- `Sites`
- `Buildings`
- `Agents`
- `Camera`
- `UI`
- `Debug`

Recommended responsibilities:

- `Bootstrap`: scene startup, package loading, service wiring, debug startup hooks
- `World`: shared references such as map metadata, named landmarks, route markers, and authoring anchors
- `Terrain`: visual terrain, terrain masks, placement helpers, and terrain query helpers
- `Sites`: named site markers, site volumes, site labels, command targets
- `Buildings`: building prefabs, construction visuals, damage visuals, faction overlays
- `Agents`: villager presentation objects, monster presentation objects, simple pooling roots
- `Camera`: tower camera rig, map camera or map view root, focus helpers
- `UI`: HUD, alert stack, site panels, roster panels, debug state summaries
- `Debug`: gizmos, simulation inspectors, test spawners, profiling aids

This should remain one shared runtime scene architecture even when prototypes are being proven one by one.

## MonoBehaviour vs Service/System Classes

Use MonoBehaviours for:

- scene references and lifecycle hookup
- camera rigs and input adapters
- view presentation
- prefab spawning and pooling glue
- hit selection, hover, highlighting, and scene interaction
- authoring markers and serialized scene configuration
- animation, audio, VFX, and other presentation-side concerns

Use plain C# services and systems for:

- simulation tick logic
- stockpiles and capacities
- building state transitions
- hauling, repair, and construction rules
- wave spawning, route selection, diversion checks, and target selection
- villager state, household state, social-state updates, and drafting logic
- data loading, validation, package setup, and save/load translation

Practical rule:

- if the logic must survive save/load, be testable outside the scene, or be read by multiple unrelated systems, prefer plain C#
- if the logic primarily exists to make something appear, move, highlight, or respond in the scene, prefer MonoBehaviour

## What Should Use Regular Unity Scene/Component Patterns

The following should use ordinary Unity scene/component patterns at the start:

- tower camera rig and map view controller
- alert-to-camera focus helpers
- site markers and clickable scene selection targets
- building placement preview visuals
- terrain authoring helpers and terrain query components
- path debug gizmos and route overlays
- villager and monster presentation objects
- simple animation and VFX state hookup
- UI panels, HUD, alert list, and debug inspection tools
- prefab composition for buildings, gates, roads, palisades, and landmarks

This part of the project benefits from Unity being Unity. It should not be abstracted away too early.

## What Should Use Plain C# Data Models and Systems

The following should be plain C# first-class runtime data:

- building definitions and building runtime instances
- site definitions and stable site ids
- villager records
- household records
- wave definitions and wave runtime state
- faction starting packages
- stockpiles, capacities, and resource deltas
- command requests and alert payloads
- save records and load reconstruction data

Recommended model categories for milestone 1:

- `BuildingDefinition` and `BuildingInstance`
- `WaveDefinition` and `WaveInstance`
- `NpcRecord`
- `HouseholdRecord`
- `FactionStartPackage`
- `SiteRecord`
- `SettlementState`
- `GameClockState`

These should map closely to the existing data sheets and prototype docs.

## Data Models By Major Domain

### Villagers

Villagers should use stable plain C# records or classes keyed by npc id.

The authoritative villager model should include:

- stable identity
- household link
- role and current assignment
- status such as `active`, `wounded`, `missing`, `dead`
- attributes, skills, traits, and social states

Their scene objects should be views of that state, not the primary source of it.

### Buildings

Buildings should have:

- a definition layer loaded from authored data
- a runtime instance layer with stable ids, site links, progress, damage, and state

Scene building objects should reflect the current instance state.

### Waves

Waves should have:

- data-driven template definitions
- runtime group state for warning stage, route, diversion checks, objective bias, and current group status

Do not make each monster's scene object the only source of truth for wave intent.

### Faction Package Data

Sabine and future factions should begin from authored package data:

- starting buildings and states
- starting stockpiles
- starting roster
- starting unlocks
- starting known-map state
- suggested first warning and wave pairing

That package data should configure the shared baseline. It should not create a separate Sabine-only architecture.

## Hard-Coded Prototype Logic vs Data-Driven Structures

Hard-coded prototype logic is acceptable when it proves one narrow scenario quickly and does not create unstable identifiers or duplicate architecture.

Acceptable early hard-coding:

- one fixed prototype map
- one fixed early warning chain
- one fixed first wave chain
- one fixed first-cycle Sabine command cadence
- one fixed Bell Post readiness modifier

Hard-coded prototype logic is not acceptable for:

- stable ids
- core enums and statuses
- building ids and wave ids
- NPC ids and household ids
- save-relevant state shape
- cross-system data keys

Data-driven structures should begin as soon as a system becomes shared infrastructure.

Recommended milestone boundary:

- start data-driving building definitions when Prototype 2 begins
- start data-driving wave templates when Prototype 3 begins
- start data-driving NPC schema-backed records when Prototype 4 begins
- start data-driving Sabine opening package as soon as package loading exists

## What Should Explicitly Not Use ECS/DOTS At The Start

Do not start milestone 1 with ECS/DOTS for:

- camera and control flow
- UI and alert systems
- building placement and construction workflow
- site naming and command targeting
- villager household and social simulation
- save/load state orchestration
- faction overlays and command cadence
- prototype map setup and tutorial flow

These are the most iteration-heavy, design-volatile parts of the game. They benefit more from clarity and flexibility than from early data-oriented complexity.

The project also does not yet have proof that these systems are bottlenecks.

## What Might Justify Data-Oriented Optimization Later

Data-oriented optimization may become justified later if profiling shows sustained cost in areas like:

- large numbers of simultaneous monsters
- large numbers of villagers with frequent state evaluation
- frequent path queries across many agents
- large-scale hauling and route updates
- expensive terrain query sampling
- mass visibility or perception checks
- pooled projectile or effect simulation

If a bottleneck appears, optimize the hot subsystem, not the whole codebase by ideology.

Possible later candidates for more data-oriented treatment:

- monster movement and wave-group evaluation
- large agent job scoring batches
- route-cost field generation
- repeated spatial queries

## Large Numbers of Agents Without Over-Engineering

The project should plan for many agents, but not assume "thousands at full fidelity" on day one.

Recommended milestone-1 approach:

- keep full social fidelity for villagers because they are high-value entities
- keep monster decision-making mostly at group level
- use coarse periodic updates instead of constant per-agent reasoning where possible
- use pooling for repeated spawned entities
- simplify off-screen or low-importance presentation
- prefer event-driven route reevaluation over constant route recomputation

That matches the current docs: villagers are persistent and socially meaningful, while waves are primarily group pressure with readable role differences.

## Recommended Simulation Update Model

Use a layered simulation update model rather than one uniform per-frame everything loop.

Recommended cadence:

- frame or fixed-step updates for presentation, movement, and immediate interactions
- short interval simulation ticks for logistics, assignments, and wave-group decisions
- slower ticks for economy production, construction progress, and repair progress
- daily or wave-end passes for morale, loyalty, grief, belonging, and other slower social updates
- event-driven updates for damage, deaths, warnings, missing status, package setup, and command consequences

This matches the existing design docs and helps keep the simulation understandable, cheaper, and more debuggable.

Practical rule:

- do not put every gameplay rule into `Update()`

## Terrain Strategy

### First Milestone Terrain Representation

For the first implementation milestone, use a simplified gameplay terrain representation with a separate visual presentation layer.

Recommended direction:

- visually authored 3D terrain in Unity for believable landscape read and camera feel
- a simplified queryable gameplay terrain model underneath for placement, routing, slope checks, and visibility helpers

The milestone does not need physically exact deformable terrain simulation.

It does need:

- readable hills, open ground, chokepoints, tree lines, and worksite edges
- terrain queries for placement validation
- simple slope and traversability rules
- support for roads, palisades, gates, and simple route shaping
- room for later terrain editing hooks

Good first-milestone representation options include:

- coarse terrain cells plus metadata
- splat or tile-like terrain zones over a Unity Terrain or mesh
- a low-resolution simulation grid layered under a more detailed visual mesh

The exact representation can remain open, but the boundary is locked:

- visual terrain and gameplay terrain should be related, but not identical at full fidelity in milestone 1

### Long-Term Terrain Shaping Goal

Long term, the project wants believable and expressive terrain shaping as a core strategic tool.

That means the player should eventually be able to:

- flatten ground for construction
- create berms, trenches, passes, and chokepoints
- shape settlement layout and wave approach in ways that feel physically grounded

The long-term goal is not a perfectly realistic geology simulator.
The goal is a terrain system that feels materially consequential, readable from the tower, and expressive enough to support the game's identity.

### Relationship Between Visual Terrain and Gameplay Terrain

For milestone 1:

- gameplay terrain is authoritative for buildability, movement cost, path viability, and major line-of-sight helpers
- visual terrain should present that gameplay terrain believably, even if the underlying simulation is simpler

This means:

- a visually smooth slope can still map to a coarse gameplay slope band
- small decorative variation should not constantly invalidate placement or routing
- terrain edits can initially update gameplay representation first and visuals second, as long as the player-facing result stays coherent

In short:

- believable visuals
- simplified underlying rules
- no promise of one-to-one physical simulation yet

## Pathfinding and Navigation

Pathfinding is important, but the project should not prematurely lock the final implementation.

Locked direction for milestone 1:

- use a practical ground-based navigation approach
- support event-driven rerouting at group level for waves
- support simple agent movement for villagers and haulers
- keep the route representation debuggable and visible

Intentionally deferred:

- final choice of navmesh-only vs grid-assisted vs custom hybrid pathfinding
- advanced multi-layer locomotion
- full terrain deformation-aware path rebuild strategy

Decision boundary:

- milestone 1 only needs readable, practical routing for one prototype map and the current movement classes
- do not choose a high-complexity navigation architecture until the prototype proves what actually breaks

## Save/Load Direction

Save/load should be planned from the start at the data-model level even if a full production save system lands later.

High-level implications:

- runtime authority should live in plain C# state, not in scene object existence
- stable ids must be established early for sites, buildings, NPCs, households, waves, and packages
- dead and missing NPCs must persist in records
- building state must persist independently from prefab instances
- faction opening package data should be loadable as authored setup, then converted into runtime state

Recommended milestone-1 save model:

- save serializable runtime state snapshots
- reconstruct scene presentation from those records on load

Do not make save/load depend on serializing arbitrary MonoBehaviour state graphs.

## Recommended Data Authoring Approach

Use a layered data authoring approach:

- authored definitions for reusable content
- authored start packages for scenario setup
- runtime state objects for mutable play state

Recommended practical form in Unity:

- ScriptableObjects or equivalent asset-backed definition data for stable content definitions
- plain serialized data structures for runtime save records
- optional import pipeline later if the markdown data sheets are converted into structured assets

For milestone 1, the important part is the boundary, not the exact asset pipeline.

The project should author data for:

- buildings
- waves
- NPC schema-shaped starting records
- Sabine starting package
- named sites and landmarks

This should start early because the docs already define stable ids and prototype boundaries.

## Deferred Complexity

The following complexity should be postponed until profiling or concrete design need justifies it:

- ECS/DOTS-first rewrites
- advanced terrain deformation simulation
- multi-locomotion monster routing
- deep fire simulation
- many bespoke faction-specific subsystems
- fully procedural wave ecology
- highly granular villager AI reasoning every frame
- complex save-diff systems
- multiplayer architecture
- high-end rendering optimization
- generalized tool frameworks before one map and one faction are working well

The project should bias toward:

- one shared runtime
- clear debug visibility
- stable ids
- small reusable systems
- replaceable stubs

## Key Technical Risks

The current major technical risks are:

- camera and information readability may still be harder than expected
- pathing and diversion may become expensive or unreadable if overcomplicated too early
- terrain shaping can sprawl into a custom simulation problem if visual and gameplay layers are not separated
- social simulation can become too opaque if too much state is surfaced or updated too often
- alert spam can bury the actual game state
- scene state and simulation state can drift apart if authority is not kept in plain data
- Sabine-specific logic can accidentally leak into shared systems if overlay hooks are not kept clean
- premature optimization can slow the project before the true bottlenecks are known

## Key Anti-Goals

The project should explicitly avoid:

- building a generic engine framework before the game loop is proven
- going ECS/DOTS-first for ideological reasons
- making every system fully data-driven before the baseline loop exists
- tying core simulation truth to MonoBehaviour state
- overcommitting to exact final pathfinding architecture before the prototype reveals real needs
- promising fully realistic terrain deformation in milestone 1
- optimizing for browser delivery when the target is Windows desktop
- overbuilding visual fidelity ahead of readability and systemic proof
- fragmenting the project into separate per-prototype architectures or scenes

## Locked Decisions vs Intentionally Deferred Decisions

### Locked Now

The following decisions are locked for the first implementation milestone:

- engine is `Unity`
- language is `C#`
- first playable target is `Windows desktop`
- the project prioritizes fast iteration and solo-friendly development
- the game prioritizes simulation sandbox over presentation-heavy spectacle
- the architecture starts as hybrid, not ECS/DOTS-first
- one shared runtime should support the prototype sequence
- core simulation authority should live in plain C# data and systems
- Unity scene objects should handle presence, wiring, and presentation
- building, wave, villager, household, site, and package ids should be stable early
- visual terrain and gameplay terrain will be related but decoupled enough to allow simplified milestone-1 simulation
- pathfinding remains practical and debuggable, but not over-specified yet
- Sabine is an overlay on shared baseline systems, not a separate architecture

### Intentionally Deferred

The following decisions are intentionally not locked yet:

- exact rendering pipeline and art-tech details beyond practical placeholder-friendly 3D
- exact terrain simulation representation among the acceptable simplified options
- exact navigation stack implementation
- exact save file format
- exact data import pipeline from planning docs into Unity assets
- exact optimization strategy for large-scale agents
- whether any specific hot subsystem later moves toward DOTS or Burst-backed processing
- the final implementation details of terrain editing and long-term deformation
- multiplayer technical architecture

Decision boundary:

- if a choice does not materially improve milestone-1 iteration, readability, or system handoff, it should remain deferred

## Final Guidance

The first implementation milestone should be built like a real project with prototype-friendly discipline:

- use Unity for scene authoring and visible interaction
- keep simulation truth in plain C#
- start data-driven content where cross-system reuse begins
- hard-code narrow scenario flow only when it helps prove a prototype quickly
- keep terrain believable visually while using simpler gameplay rules underneath
- postpone ECS/DOTS, deep pathfinding specialization, and heavy optimization until profiling proves they are needed

The goal is not to find the most theoretically perfect architecture.
The goal is to create the simplest architecture that can carry the current design through the first milestone without painting the project into a corner.
