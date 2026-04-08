# Project Documentation Index

Status: Active
Scope: Whole Project
Phase: Pre-production
Owner: Design
Source of Truth: No

## Purpose

This file is the top-level navigation index for the project's documentation set.

Use it when you need to answer:

- where should I start reading?
- which document is the current source of truth for a system?
- which file should I use for milestone planning or implementation work?
- where do faction docs, data sheets, and implementation checklists live?

## Recommended Read Paths

### New To The Project

1. `game-design-document.md`
2. `mvp-scope-and-prototype-plan.md`
3. `prototype-backlog.md`
4. `implementation/README.md`

### Designing A System

1. `game-design-document.md`
2. the matching core system doc
3. `decision-log.md`
4. the matching data sheet if implementation-facing structure already exists

### Implementing The First Milestone

1. `implementation/engine-and-architecture-decision.md`
2. `mvp-scope-and-prototype-plan.md`
3. `prototype-backlog.md`
4. `implementation/prototype-integration-order.md`
5. the relevant prototype checklist
6. the matching data sheet under `data/`

## Core Design Docs

- `game-design-document.md`: top-level design foundation and cross-system summary
- `camera-controls-and-visibility-spec.md`: camera, survey map, alerts, visibility, and command model
- `economy-buildings-design.md`: economy, buildings, logistics, and rebuild loop
- `monster-wave-design.md`: wave model, monster roles, diversion, and warning structure
- `social-systems-design.md`: villagers, households, loyalty, grief, labor behavior, and social consequence

## Planning And Process Docs

- `mvp-scope-and-prototype-plan.md`: milestone scope, prototype stack, and recommended build order
- `prototype-backlog.md`: prototype sequencing and success criteria
- `decision-log.md`: major project decisions and reversals
- `documentation-policy.md`: documentation maintenance rules
- `git-and-delivery-workflow.md`: git, branch, PR, and delivery workflow

## Directory Indexes

- `implementation/README.md`: implementation-planning documents and prototype checklists
- `data/README.md`: implementation-facing data sheets
- `factions/README.md`: faction and master design docs

## Faction Docs

Start with:

- `factions/v1-contrast-master-faction-designs.md`

Then read the specific faction doc you need:

- `factions/sabine-merrow-faction-design.md`
- `factions/ash-hart-of-the-boundary-faction-design.md`
- `factions/aurelian-vale-sun-faction-design.md`
- `factions/orren-voss-faction-design.md`

## First-Milestone Implementation Spine

For milestone-1 work, these are the main navigation anchors:

- `implementation/engine-and-architecture-decision.md`
- `mvp-scope-and-prototype-plan.md`
- `prototype-backlog.md`
- `implementation/prototype-integration-order.md`
- `data/building-data-sheet.md`
- `data/wave-data-sheet.md`
- `data/npc-schema-and-value-ranges.md`
- `data/sabine-starting-package.md`

## Update Rule

When a new major doc is added or when the best reading path changes:

- update this index
- update the nearest directory README if relevant
- update `decision-log.md` if the change materially alters how implementation work should be navigated
