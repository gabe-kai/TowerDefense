# Decision Log

Status: Active
Scope: Whole Project
Phase: Pre-production
Owner: Design
Source of Truth: Yes

## Purpose

This file records major design decisions, reversals, and scope locks.

It is not a replacement for the design docs. It exists to explain why important changes happened and to preserve decision history without cluttering the current-truth system documents.

## Entry Format

Use entries in reverse chronological order.

Recommended structure:

```text
## YYYY-MM-DD - Short Decision Title

Status:
- Proposed / Accepted / Revised / Superseded

Decision:
- brief statement of what changed

Why:
- brief explanation of the reason

Affected Docs:
- path/to/doc.md
```

## 2026-04-06 - Documentation Policy Established

Status:
- Accepted

Decision:
- The project will treat major design docs as current-truth documents and preserve design history through version control plus this decision log.

Why:
- The design set is now large enough that historical notes inside every doc would reduce clarity and make later implementation harder.

Affected Docs:
- `docs/documentation-policy.md`
- `docs/game-design-document.md`

## 2026-04-07 - Implementation Navigation Spine Added

Status:
- Accepted

Decision:
- The documentation set now explicitly includes directory-level navigation for implementation work, and the project-level planning docs now point more clearly toward the engine/architecture decision, integration order, and implementation indexes.

Why:
- The document set has reached the point where important implementation-facing files could become hard to discover without a clearer navigation spine between design, planning, implementation, data, and faction docs.

Affected Docs:
- `docs/README.md`
- `docs/documentation-policy.md`
- `docs/game-design-document.md`
- `docs/mvp-scope-and-prototype-plan.md`
- `docs/prototype-backlog.md`
- `docs/data/README.md`
- `docs/factions/README.md`
- `docs/implementation/README.md`
- `docs/implementation/prototype-integration-order.md`

## 2026-04-06 - Camera And Visibility Moved To Dedicated Spec

Status:
- Accepted

Decision:
- The first-playable camera, alert, survey-map, and visibility rules are now primarily defined in the dedicated camera spec rather than expanded inside the GDD.

Why:
- Camera and visibility had become detailed enough to deserve a standalone source of truth.

Affected Docs:
- `docs/camera-controls-and-visibility-spec.md`
- `docs/game-design-document.md`

## 2026-04-06 - Locked First V1 Training Trio

Status:
- Accepted

Decision:
- The locked first V1 training trio is Sabine Merrow, Ash-Hart of the Boundary, and Aurelian Vale-Sun.

Why:
- These three factions teach the baseline doctrines of civic order, terrain management, and rune construction without overloading the first expansion set.

Affected Docs:
- `docs/game-design-document.md`
- `docs/factions/v1-contrast-master-faction-designs.md`
- `docs/factions/sabine-merrow-faction-design.md`
- `docs/factions/ash-hart-of-the-boundary-faction-design.md`
- `docs/factions/aurelian-vale-sun-faction-design.md`

## 2026-04-06 - Orren Moved Out Of Locked V1 Trio

Status:
- Accepted

Decision:
- Orren Voss remains an important planned faction, but is no longer part of the locked first V1 training trio.

Why:
- Construct industry introduces additional implementation complexity and is better treated as a later faction after the baseline trio is established.

Affected Docs:
- `docs/game-design-document.md`
- `docs/factions/v1-contrast-master-faction-designs.md`
- `docs/factions/orren-voss-faction-design.md`

## 2026-04-06 - V1 Economy Locked To Four Stockpiled Resources

Status:
- Accepted

Decision:
- The first-playable economy uses `Food`, `Wood`, `Stone`, and `Mana` as the stockpiled resources, with labor, housing, storage, and safety treated as operational pressures.

Why:
- This keeps the economy legible while preserving room for later expansion into trade goods, luxuries, reagents, and industry.

Affected Docs:
- `docs/game-design-document.md`
- `docs/economy-buildings-design.md`

## 2026-04-06 - Shared Visible Food Pool Chosen For First Playable

Status:
- Accepted

Decision:
- The first playable uses one visible settlement food pool while preserving hidden appetite and household variation hooks for later expansion.

Why:
- This keeps food management readable in the first implementation without discarding richer social modeling later.

Affected Docs:
- `docs/social-systems-design.md`
- `docs/economy-buildings-design.md`

## 2026-04-06 - Broad Command Model Chosen Over Unit Micro

Status:
- Accepted

Decision:
- The player issues broad site-based military orders and emergency commands rather than direct unit-by-unit tactical control.

Why:
- This better supports the tower-defense identity, the tower-anchored perspective, and the role of the player as a bound spirit rather than a battlefield general.

Affected Docs:
- `docs/game-design-document.md`
- `docs/camera-controls-and-visibility-spec.md`
- `docs/monster-wave-design.md`

## 2026-04-06 - Surveyed Strategic Map Chosen

Status:
- Accepted

Decision:
- Building placement, rune placement, and strategic orders use a top-down surveyed map built from allied exploration and current friendly vision instead of an omniscient god-view.

Why:
- This preserves the tower-anchored fantasy while keeping planning playable under real-time conditions.

Affected Docs:
- `docs/game-design-document.md`
- `docs/camera-controls-and-visibility-spec.md`
