# Documentation Policy

Status: Active
Scope: Whole Project
Phase: Pre-production
Owner: Design
Source of Truth: Yes

## Purpose

This document defines how project documentation should be structured, updated, and preserved as the game moves from concept work into prototyping, production, and later expansion.

The goal is to keep documentation professional, trustworthy, and scalable without turning the main docs into a historical scrapbook.

## Core Rule

Each core design document should describe the design as it is understood now.

Historical thinking should be preserved through:

- version control history
- `docs/decision-log.md`
- milestone planning documents

Repository workflow expectations are defined separately in:

- `docs/git-and-delivery-workflow.md`

The main body of a design doc should not become a diary of every old idea unless that older phase still matters to current implementation.

## Document Types

The project should use five document types.

### 1. Core Design Docs

These are the current-truth design references for major systems.

Examples:

- `docs/game-design-document.md`
- `docs/social-systems-design.md`
- `docs/economy-buildings-design.md`
- `docs/monster-wave-design.md`
- `docs/camera-controls-and-visibility-spec.md`
- `docs/factions/*.md`

Rules:

- update these when the design changes
- keep them readable and current
- preserve phased scope using sections like `First Playable`, `V1 Expansion`, and `Later`
- do not preserve obsolete design inline unless it still matters

### 2. Decision Logs

These explain why important changes were made.

Primary file:

- `docs/decision-log.md`

Rules:

- log major design decisions and reversals
- explain the reason for the change briefly
- link the decision to affected docs when useful
- do not re-explain the whole system there

### 3. Planning Docs

These describe delivery order, scope cuts, prototypes, and milestones.

Examples:

- `docs/mvp-scope-and-prototype-plan.md`
- later milestone plans
- workflow and delivery process documents such as `docs/git-and-delivery-workflow.md`

Rules:

- these may become outdated as plans change
- they are still valuable historical planning artifacts
- they should clearly state their planning phase and intended use

Directory index files such as `docs/README.md`, `docs/data/README.md`, `docs/factions/README.md`, and `docs/implementation/README.md` should be maintained as navigation aids whenever a folder gains enough documents that a new reader could miss an important path.

### 4. Working Drafts

These are temporary exploration docs used to think through a question before it is absorbed into a core doc.

Rules:

- clearly mark them as `Working Draft`
- move durable conclusions into a core design doc or planning doc
- retire or delete them once superseded

### 5. Implementation-Facing Data Sheets

These translate approved design direction into structured, prototype-usable reference sheets for implementation, balancing, content setup, and AI-assisted build work.

Examples:

- `docs/data/building-data-sheet.md`
- future monster, NPC, and faction-package sheets under `docs/data/`

Rules:

- treat these as derived implementation references, not the primary design source of truth
- keep ids, field names, and enum vocabulary stable once downstream implementation starts depending on them
- favor consistent schema, compact wording, and explicit placeholders over broad explanatory prose
- update these when implementation-facing structure changes, even if the higher-level design intent does not
- when these diverge from a core design doc, reconcile the mismatch deliberately rather than letting both drift

## Navigation Policy

As the doc set grows, every major directory should make it obvious how to move between:

- top-level design intent
- milestone scope and planning
- implementation-planning checklists
- implementation-facing data sheets
- faction overlays

Practical navigation rules:

- top-level entry docs should point to the most important adjacent source-of-truth or planning docs
- implementation directories with several files should have a `README.md` index
- data and faction directories should keep their README indexes current
- when a new project-level doc materially changes where implementation readers should start, update the nearest index or entry-point doc in the same change

## Status Header Standard

Major docs should keep a short header near the top using this format:

```text
Status: Active
Scope: Whole Project / System / Faction / Planning
Phase: Pre-production / Prototype / Production
Owner: Design
Source of Truth: Yes / No
```

Optional fields:

- `Depends On`
- `Superseded By`
- `Last Major Review`

## Update Rules

When a design changes:

1. Update the relevant current-truth doc.
2. Update any affected implementation-facing data sheet if build-facing structure or values changed.
3. Add a brief entry to `docs/decision-log.md` if the change is meaningful.
4. Update planning docs only if the change affects delivery order or scope.

Do not keep both the old and new rule in the main design section unless the distinction is an intentional phased rollout.

## Phased Scope Formatting

When future expansion matters, use forward-looking scope labels rather than historical notes.

Preferred labels:

- `First Playable`
- `V1 Expansion`
- `Later`
- `Future Hooks`

Avoid writing main sections like:

- "Originally we planned..."
- "Previously this was..."

That history belongs in the decision log and version control.

## Version Control Policy

Project documentation should be version controlled from the pre-production phase onward, not delayed until gameplay code begins.

Reasons:

- documentation is already a project asset
- design history matters
- rollback and comparison matter
- milestone tagging will matter later

Recommended rule:

- commit documentation changes in coherent batches by topic

Examples:

- `docs: add camera visibility spec`
- `docs: lock V1 economy baseline`
- `docs: revise faction trio and contrast notes`

## Review Cadence

Recommended lightweight review rhythm:

- after every major design thread, update the relevant core doc
- after every major milestone, review the GDD for cleanup
- before implementation of a system, review its core doc for current-truth accuracy
- before implementation of a data-driven system, review both its core doc and any matching data sheet under `docs/data/`
- after prototype results, record major changes in the decision log

## GDD Policy

The main GDD should remain:

- concise compared to subsystem docs
- cross-system in focus
- useful as the top-level entry point for the project

The GDD should summarize systems and point to subsystem docs rather than duplicating all detail.

## Faction Policy

Faction docs should define:

- faction identity
- gameplay doctrine
- starting package
- unique rules and pressures
- tutorial role
- first-playable implementation priorities

Faction comparison notes should summarize differences, not become the only place where mechanics are defined.

## Practical Rule Of Thumb

Use this decision rule when editing docs:

- If the question is "What is true now?" update the core doc.
- If the question is "Why did this change?" update the decision log.
- If the question is "What are we building first?" update a planning doc.
- If the question is "What used to be true?" rely on version control and the decision log.
