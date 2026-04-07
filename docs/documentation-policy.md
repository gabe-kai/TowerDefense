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

The main body of a design doc should not become a diary of every old idea unless that older phase still matters to current implementation.

## Document Types

The project should use four document types.

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

Rules:

- these may become outdated as plans change
- they are still valuable historical planning artifacts
- they should clearly state their planning phase and intended use

### 4. Working Drafts

These are temporary exploration docs used to think through a question before it is absorbed into a core doc.

Rules:

- clearly mark them as `Working Draft`
- move durable conclusions into a core design doc or planning doc
- retire or delete them once superseded

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
2. Add a brief entry to `docs/decision-log.md` if the change is meaningful.
3. Update planning docs only if the change affects delivery order or scope.

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
