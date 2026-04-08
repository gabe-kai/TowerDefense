# Data Sheets

Status: Active
Scope: Prototype Data
Phase: Pre-production
Owner: Design
Source of Truth: No

This directory contains implementation-facing data sheets derived from the core design docs.

These files are intended to help with:

- prototype implementation planning
- balance placeholder setup
- data authoring
- AI-assisted implementation work

They are not the primary design source of truth.

For implementation planning, read these alongside:

- `docs/implementation/README.md`
- `docs/implementation/engine-and-architecture-decision.md`
- `docs/implementation/prototype-integration-order.md`

When a conflict appears:

1. check the matching core design doc
2. decide whether the design changed or the data sheet drifted
3. update both deliberately if needed

## Current Files

- `building-data-sheet.md`: first-playable building roster, schema, and milestone sequencing for the shared baseline
- `wave-data-sheet.md`: first-playable monster roster, wave-template schema, warning-stage data, and milestone sequencing for the shared baseline
- `npc-schema-and-value-ranges.md`: first-playable NPC schema, value ranges, defaults, visibility guidance, and milestone field cuts
- `sabine-starting-package.md`: first-playable Sabine opener, starting settlement package, tutorial goals, and milestone-1 placeholder setup guidance

## How To Navigate From Here

- if you need current design intent, go back to the matching core design doc
- if you need build order, go to `docs/prototype-backlog.md` and `docs/implementation/prototype-integration-order.md`
- if you need project-level technical direction, go to `docs/implementation/engine-and-architecture-decision.md`
- if you need faction-specific setup context, go to `docs/factions/sabine-merrow-faction-design.md`

## Authoring Rules

- prefer stable ids and explicit field names
- favor compact schema-like wording over long prose
- keep enum vocabulary consistent across files
- use recommended placeholders instead of vague TODOs where possible
- include unresolved tuning questions at the end when values are intentionally provisional

## Naming Convention

Use descriptive filenames that clearly match their implementation role.

Current patterns include:

- `*-data-sheet.md` for broad schema or roster sheets
- `*-package.md` for authored starting-package references

## Update Rule

When implementation-facing structure changes:

- update the relevant file in `docs/data/`
- update the related core design doc if current-truth design changed
- update planning docs only if prototype order or milestone scope changed
