# Development Process

Status: Active
Scope: Whole Project
Phase: Pre-production
Owner: Design / Engineering
Source of Truth: Yes

## Purpose

This document defines the day-to-day development process for this project as it moves from documentation into implementation.

It should answer:

- how work starts
- how work is reviewed
- how branches and PRs fit into the loop
- how Codex, Cursor, local git tools, and GitHub are used together
- when documentation must be updated alongside code or planning changes

This document complements, but does not replace:

- `docs/git-and-delivery-workflow.md`
- `docs/documentation-policy.md`
- `docs/definition-of-done.md`
- `docs/testing-and-debugging-strategy.md`

## Operating Model

The current project uses a human-directed, AI-assisted workflow.

In practical terms:

- Codex is used for high-level planning, design drafting, repo review, implementation planning, and code generation support
- Cursor is used as a secondary review and sanity-check pass
- the human project owner approves direction changes, branch intent, commits, PRs, merges, and final project decisions
- local git tools and GitHub are used for actual repository history and merge control

This is not an autonomous pipeline.

The human remains the final decision-maker for:

- project direction
- merge approval
- scope changes
- tool choice
- release decisions

## Normal Work Cycle

The standard work loop is:

1. Choose the next slice of work from the current planning docs.
2. Start a focused branch for that slice.
3. Draft or update the relevant docs and implementation-facing references.
4. Review the result locally.
5. Use Cursor as a second-pass review when useful.
6. Stage, commit, push, and open a PR.
7. Review the merged result at the high-level planning layer.
8. Decide the next slice before opening more threads.

Recommended practical rule:

- keep each branch focused on one dominant deliverable

Examples:

- one design doc
- one data sheet
- one prototype checklist
- one implementation slice

## Thread Usage

Use the high-level planning thread for:

- project direction
- workflow choices
- engine and architecture decisions
- deciding what comes next
- repo-wide review and synthesis

Use separate focused threads for:

- one document creation task
- one system deep dive
- one implementation-facing checklist or data sheet
- one bounded code task once implementation begins

Recommended practical rule:

- if the work has one main output file or one narrow objective, prefer a separate focused thread

## Branch and PR Expectations

Repository branch and PR rules are defined in:

- `docs/git-and-delivery-workflow.md`

Working expectations:

- create focused branches manually
- avoid bundling unrelated work into one branch
- prefer small and reviewable PRs
- merge only after the resulting doc or code slice still fits the current plan

## Documentation Expectations

Documentation is part of the implementation process, not an afterthought.

When work changes current truth:

- update the relevant source-of-truth doc
- update any affected planning doc if delivery order or scope changed
- update any affected data sheet if implementation-facing structure changed
- add to `docs/decision-log.md` when a project-level decision is locked or revised

When implementation begins, code changes should still be checked against the design and planning docs they depend on.

## Review Expectations

Recommended review flow:

1. authoring pass
2. local sanity pass
3. Cursor or equivalent second-pass review when useful
4. human approval
5. PR merge

The purpose of review is not only correctness.

It should also catch:

- scope drift
- accidental contradictions with canon docs
- premature complexity
- hidden architecture commitments
- implementation choices that violate the current milestone plan

## Change Types

The project currently has four common change types:

1. design canon changes
2. planning and process changes
3. implementation-facing data and checklist changes
4. code changes

Each type should be kept coherent within a branch whenever possible.

## Implementation Start Rule

Before a new code subsystem starts:

- confirm the matching design doc is still current
- confirm the matching planning doc still reflects intended milestone scope
- confirm any needed data sheet exists or is intentionally deferred
- confirm the work has a clear completion boundary

## Recommended Human Tool Loop

The current working model for this project is:

- use Codex for planning, drafting, synthesis, and implementation support
- use Cursor to inspect changes and provide a second review lens
- use terminal or editor git tools for staging, committing, and pushing
- use GitHub for PR review, merge, and branch cleanup
- return to the high-level planning thread for repo-wide reassessment and next-step selection

This workflow is valid project process and should be treated as the normal operating model unless replaced later.

## Process Anti-Goals

- do not batch large unrelated changes into a single PR
- do not start coding systems whose implementation boundary is still unclear
- do not leave important design changes only in code comments or PR discussion
- do not let implementation-facing data sheets drift away from source-of-truth docs
- do not rely on memory for why major decisions changed

## Update Rule

Update this document when:

- the project's actual working rhythm changes
- review and merge flow changes
- the division of responsibility between tools changes
- implementation introduces a meaningfully different cadence than the current pre-production loop
