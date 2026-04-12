# Implementation Planning Documents

Status: Active
Scope: Implementation Planning
Phase: Pre-production
Owner: Design / Engineering
Source of Truth: No

## Purpose

This directory contains implementation-planning documents for the first implementation milestone.

These files do not replace the core design docs. They translate the current design direction into:

- implementation order
- prototype checklists
- architecture boundaries
- milestone integration guidance

Use this directory when the question is:

- how should we build the first milestone?
- what order should systems land in?
- what is shared baseline versus faction overlay?
- what technical direction is already locked?

## Read Order

For a fresh implementation pass, use this order:

1. `engine-and-architecture-decision.md`
2. `unity-project-scaffolding-plan.md`
3. `../mvp-scope-and-prototype-plan.md`
4. `../prototype-backlog.md`
5. `prototype-integration-order.md`
6. `vertical-slice-acceptance-criteria.md`
7. the relevant prototype checklist
8. the matching data sheet under `../data/`

## Current Files

- `unity-project-scaffolding-plan.md`: practical milestone-1 Unity project cleanup and folder-structure plan for turning the initialized URP template into a clean implementation baseline
- `engine-and-architecture-decision.md`: project-level implementation direction for engine choice, architecture boundaries, terrain strategy, and deferred complexity
- `prototype-integration-order.md`: how the five prototype tracks should be layered into one shared runtime
- `vertical-slice-acceptance-criteria.md`: project-level acceptance criteria for what the first playable vertical slice must prove, what may remain placeholder, and what still blocks broader expansion
- `prototype-1-camera-and-information-readability-checklist.md`: implementation checklist for the camera, survey-map, alert, and command-readability slice
- `prototype-2-settlement-economy-and-rebuild-loop-checklist.md`: implementation checklist for economy, logistics, damage, and rebuilding
- `prototype-3-wave-routing-and-defensive-pressure-checklist.md`: implementation checklist for wave traversal, diversion, gates, and pressure
- `prototype-4-social-consequence-and-named-villagers-checklist.md`: implementation checklist for named villagers, households, and social consequence
- `prototype-5-sabine-baseline-faction-layer-checklist.md`: implementation checklist for Sabine as the first faction overlay

## Relationship To Other Directories

- `../game-design-document.md` is the top-level design entry point
- `../camera-controls-and-visibility-spec.md`, `../economy-buildings-design.md`, `../monster-wave-design.md`, and `../social-systems-design.md` are the core system sources of truth
- `../data/README.md` points to the implementation-facing data sheets used by these checklists
- `../factions/README.md` points to the faction design docs that feed package and overlay work

## Update Rule

When implementation sequencing, architecture boundaries, or prototype proof criteria change:

- update the relevant file in `docs/implementation/`
- update any affected planning doc under `docs/`
- update matching data sheets if build-facing structure changed
- add an entry to `docs/decision-log.md` if the change locks or revises project direction
