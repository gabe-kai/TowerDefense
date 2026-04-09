# TowerDefense

Pre-production repository for a tower defense + settlement builder game about a bound spirit managing a wizard's tower and village through recurring monster waves.

## Current Phase

This project has moved beyond early concept capture and is now in pre-production / implementation-planning.

The current repository focus is to:

- preserve the game's design canon
- define first-playable scope
- translate design into prototype-ready implementation planning
- prepare for a Unity + C# first implementation milestone

There is still no gameplay code in the repository yet. The current goal is to enter implementation with a disciplined design, planning, and documentation stack instead of improvising the foundation later.

## Game Direction

The project is centered on:

- a tower-anchored player perspective instead of a free god-camera
- a living settlement with named NPCs, households, labor, grief, and loyalty
- monster waves that move across a shared landscape and can be redirected or endured
- faction masters that meaningfully change how settlement defense works
- true 3D terrain and believable landscape shaping as long-term pillars

## Chosen Tech Direction

Current implementation direction:

- engine: `Unity`
- language: `C#`
- first target: `Windows desktop`
- project priority: fast iteration and solo-friendly development
- architecture direction: hybrid Unity scene/component architecture with plain C# simulation systems

See `docs/implementation/engine-and-architecture-decision.md` for the current technical direction.

## Where To Start Reading

If you are new to the repository, this is the best reading order:

1. `docs/game-design-document.md`
2. `docs/mvp-scope-and-prototype-plan.md`
3. `docs/prototype-backlog.md`
4. `docs/implementation/engine-and-architecture-decision.md`
5. `docs/implementation/README.md`

Then branch based on what you need:

- systems: `docs/social-systems-design.md`, `docs/economy-buildings-design.md`, `docs/monster-wave-design.md`, `docs/camera-controls-and-visibility-spec.md`
- factions: `docs/factions/README.md`
- data sheets: `docs/data/README.md`
- implementation planning: `docs/implementation/README.md`

## Repository Structure

- `docs/`
  - core design canon
  - planning and workflow docs
  - faction docs
  - implementation-facing data sheets
  - implementation-planning checklists

Important subdirectories:

- `docs/data/`: draft implementation-facing data sheets derived from design canon
- `docs/implementation/`: prototype checklists, integration planning, and technical direction
- `docs/factions/`: master and faction design docs, including V1 comparison material

## Documentation Map

Core design canon:

- `docs/game-design-document.md`
- `docs/social-systems-design.md`
- `docs/economy-buildings-design.md`
- `docs/monster-wave-design.md`
- `docs/camera-controls-and-visibility-spec.md`

Project planning and process:

- `docs/mvp-scope-and-prototype-plan.md`
- `docs/prototype-backlog.md`
- `docs/documentation-policy.md`
- `docs/decision-log.md`
- `docs/git-and-delivery-workflow.md`
- `docs/development-process.md`
- `docs/testing-and-debugging-strategy.md`
- `docs/definition-of-done.md`

Implementation planning:

- `docs/implementation/README.md`
- `docs/implementation/engine-and-architecture-decision.md`
- `docs/implementation/prototype-integration-order.md`

Prototype data:

- `docs/data/README.md`

Faction layer:

- `docs/factions/README.md`

## Documentation Approach

This repository uses a current-truth documentation model:

- core design docs describe the design as it is understood now
- planning docs describe current milestone and prototype intent
- data sheets and implementation checklists are implementation-facing drafts, not design canon
- major locked changes should be recorded in `docs/decision-log.md`
- documentation standards are defined in `docs/documentation-policy.md`
- git workflow expectations are defined in `docs/git-and-delivery-workflow.md`
- day-to-day development expectations are defined in `docs/development-process.md`
- testing and debug expectations are defined in `docs/testing-and-debugging-strategy.md`
- merge-complete standards are defined in `docs/definition-of-done.md`

## Immediate Next Step

The next major phase is moving from implementation planning into initial Unity project setup and first vertical-slice execution, beginning from the prototype integration order and engine/architecture decisions.

## License

This repository is released under `CC0 1.0 Universal`.

That means anyone who finds this project should be able to use it, adapt it, build on it, or commercialize it without asking permission.

See `LICENSE.md` for the full dedication.
