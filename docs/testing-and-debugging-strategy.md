# Testing and Debugging Strategy

Status: Active
Scope: Whole Project
Phase: Pre-production
Owner: Engineering / Design
Source of Truth: Yes

## Purpose

This document defines how testing, logging, debugging, and validation should be approached as the project moves into implementation.

The goal is not to impose heavyweight process before code exists.

The goal is to make sure prototypes are:

- testable
- observable
- debuggable
- reviewable

## Strategy Summary

This project should begin with a practical prototype-first quality strategy:

- test the highest-risk systems first
- favor observability and debug visibility early
- use lightweight automated tests where they provide real value
- use scenario-based manual validation for gameplay feel and system interaction
- avoid building a large test harness before the first milestone proves itself

## Quality Priorities By Phase

### Pre-implementation

Before code starts:

- define what each prototype must prove
- define what “readable” and “working enough” means for each prototype
- define core debug expectations

### Early implementation

When code begins:

- prioritize logging and debug overlays
- add small automated tests for stable pure-logic systems
- validate prototypes with repeatable manual test scenarios

### Later implementation

Once the shared runtime exists:

- expand automated coverage for stable simulation logic
- add stronger regression checks around save/load, data-driven content, and cross-system behaviors

## Testing Philosophy

Testing for this project should use three layers.

### 1. Manual Prototype Validation

Used for:

- camera feel
- readability
- warning clarity
- player reaction flow
- settlement pressure and rebuild decisions
- social consequence feel

These should be driven by checklist scenarios from the implementation docs.

### 2. Lightweight Automated Logic Tests

Used for:

- pure C# utility logic
- data validation rules
- simulation calculations that do not need full scene boot
- stable rule systems once they stop changing rapidly

Good early candidates:

- resource calculations
- job scoring helpers
- visibility state rules
- simple wave-template validation
- data-id integrity checks

### 3. Integration and Smoke Testing

Used for:

- scene boot
- prototype shell startup
- major loop handoffs
- save/load sanity later

These should stay small at first.

## Logging Strategy

Early code should be built with useful logs and debug surfaces from the start.

Recommended logging priorities:

- scene and system startup
- data loading and id mismatches
- alert generation
- command issuance
- building placement failures
- path recomputation triggers
- wave spawn and diversion decisions
- villager death, injury, or missing-state changes

Recommended rule:

- log important state transitions, not every frame detail

## Debugging Strategy

The first milestone should rely heavily on explicit debug tooling.

Recommended early debug surfaces:

- debug HUD or inspector panel
- visible state labels for sites, buildings, waves, and NPCs
- terrain/buildability overlays
- visibility-state overlays
- path or route preview overlays where practical
- household and villager state inspection
- alert/event history panel if practical

Recommended practical rule:

- if a system can fail in a confusing way, add a debug surface before tuning polish

## Prototype Validation Rules

Each prototype should have:

- a checklist of required behaviors
- a small set of repeatable scenarios
- clear success criteria
- a short list of known acceptable cheats or placeholders

A prototype is not complete just because the code runs.

It is complete when the prototype can answer its intended design question.

## What To Test Early

Priority early test targets:

1. data loading and schema alignment
2. visibility and information-state rules
3. building placement constraints
4. resource transfer and rebuild logic
5. route/diversion decisions
6. villager state transitions caused by loss or damage

## What Not To Overbuild Early

- do not build exhaustive automated coverage for rapidly changing prototype behavior
- do not build a heavyweight telemetry stack before the first milestone works
- do not spend large effort on micro-optimized logging systems
- do not block prototype progress on perfect test architecture

## Definition Of Good Early Logging

Good early logging should be:

- readable
- categorized
- sparse enough to scan
- rich enough to explain major state changes
- easy to disable or filter later

## Failure Investigation Rule

When a prototype behaves incorrectly:

1. confirm expected behavior from the relevant design and checklist docs
2. inspect logs and debug surfaces first
3. verify input data and ids
4. narrow whether the failure is design drift, bad data, or implementation bug
5. update docs if the code exposed a genuine design gap

## Recommended Early Quality Gates

Before merging implementation work:

- the feature boots without obvious scene-breaking errors
- its intended prototype checklist items are meaningfully addressed
- at least one repeatable validation scenario has been exercised
- obvious debug visibility exists for the system
- related docs are updated if implementation revealed a design or data change

## Deferred Until Later

These can wait until after the first shared milestone is running:

- extensive CI-driven automated gameplay testing
- performance benchmarking suites
- telemetry dashboards
- broader save/load regression suites
- complex replay tools

## Update Rule

Update this document when:

- the project adopts a stronger automated test strategy
- the logging/debugging stack becomes standardized in code
- prototype validation evolves into production regression expectations
