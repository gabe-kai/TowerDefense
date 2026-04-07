# Git and Delivery Workflow

Status: Active
Scope: Whole Project
Phase: Pre-production
Owner: Project Workflow
Source of Truth: Yes

## Purpose

This document defines how the project should use:

- branches
- commits
- pull requests
- merges
- release tags
- CI expectations
- CD expectations

The goal is to make the repository usable in a normal professional workflow before gameplay development begins.

## Workflow Goals

- keep `main` stable and readable
- make branch purpose obvious from the name
- keep commits understandable in history
- keep pull requests reviewable
- avoid giant mixed-purpose changes
- make it easy to move from solo work to team collaboration later

## Default Branch Model

Use a simple trunk-based workflow with short-lived feature branches.

Primary branches:

- `main`
- short-lived work branches

Rules:

- `main` is the integration branch and should always represent the best known current state
- do not work directly on `main` except for tiny emergency fixes
- do normal work on short-lived branches
- merge back frequently

This project does not currently need long-lived `develop`, `release`, or environment branches.

## Branch Naming

Use clear, purpose-first branch names.

Recommended prefixes:

- `docs/`
- `feat/`
- `fix/`
- `refactor/`
- `proto/`
- `chore/`

Examples:

- `docs/mvp-prototype-plan`
- `docs/faction-cleanup-pass`
- `feat/tower-camera-shell`
- `feat/alert-card-ui`
- `fix/survey-map-visibility-state`
- `proto/wave-routing-sandbox`
- `chore/repo-setup`

Rules:

- use lowercase
- use hyphen-separated words
- keep names short but specific
- one branch should have one dominant purpose

## Branch Scope Rules

Each branch should answer one clear question.

Good examples:

- define one new subsystem doc
- implement one prototype slice
- clean up one documentation area
- fix one bug

Bad examples:

- mixed UI, AI, docs, and balance changes in one branch
- "everything for this week"
- unrelated cleanup bundled with feature implementation

If work becomes too broad, split it into more branches.

## Commit Policy

Commits should be:

- coherent
- reviewable
- meaningful in history

A good commit should represent one understandable change.

### Commit Size

Preferred:

- small to medium commits
- each commit should usually do one thing

Avoid:

- giant "checkpoint" commits covering many unrelated changes
- dozens of tiny noise commits if they do not help history

### Commit Message Format

Recommended format:

`type: short summary`

Examples:

- `docs: refine Sabine faction baseline`
- `docs: add MVP scope and prototype plan`
- `feat: add tower camera orbit shell`
- `feat: add survey map visibility states`
- `fix: correct wave alert site naming`
- `refactor: split NPC update cadence rules`
- `chore: add repo workflow docs`

### Commit Content Rules

Each commit should ideally:

- keep the project in a valid state
- avoid unrelated file changes
- include docs updates if the design or behavior changes

If implementation changes the intended design, update the relevant design doc in the same branch before merge.

## Pull Request Policy

Pull requests should be the normal path into `main`, even for solo work when practical.

PRs are useful for:

- summarizing intent
- reviewing scope
- leaving notes for future you
- keeping merge history legible

### PR Size

Preferred:

- small to medium PRs
- one feature, one cleanup pass, one prototype slice

Avoid:

- giant branches that change many systems at once

If a branch is getting hard to summarize in a short paragraph, it is probably too large.

### PR Title Format

Use the same style as commits:

- `docs: add git and delivery workflow`
- `feat: prototype tower camera and survey map`
- `fix: correct alert confidence labels`

### PR Description Template

Recommended structure:

- what changed
- why it changed
- affected docs/systems
- testing or validation notes
- follow-up work

## Merge Policy

Preferred merge options:

- squash merge for noisy or exploratory branches
- rebase merge for clean linear branches with good commit history

Avoid:

- merge commits that preserve messy intermediate history unless there is a strong reason

Default recommendation:

- use squash merge for docs-heavy and exploratory work
- use rebase merge for clean implementation branches when commit history is worth preserving

## Tagging and Milestones

Use lightweight milestone tags when the project reaches meaningful phases.

Examples:

- `preprod-docs-baseline`
- `prototype-camera-alpha`
- `prototype-wave-routing-alpha`
- `mvp-scope-locked`

Tags should mark:

- major design baselines
- prototype completions
- scope locks
- playable milestones

## CI Policy

CI should start simple and grow with the project.

### Pre-Code Phase

In the current design-first phase, CI can be minimal or absent.

Useful early checks later:

- markdown linting
- link checking for docs
- file naming and formatting checks

### Early Prototype Phase

When code begins, CI should at minimum run:

- build verification
- test suite for the active prototype area
- lint/format checks where applicable

### Branch Protection Goal

Once implementation begins in earnest, aim for:

- required CI pass before merge to `main`
- no red builds merged intentionally except in emergency prototype situations

## CD Policy

CD should also stay minimal until there is something worth distributing.

### Pre-Code Phase

- no deployment automation required

### Prototype Phase

Potential later additions:

- automated prototype build artifacts
- internal playtest builds
- tagged milestone builds

### Rule

Do not build complex CI/CD infrastructure before the project has a stable prototype loop worth packaging.

## Documentation and Git Relationship

Design docs are part of the product history and should participate in normal git workflow.

Rules:

- design changes belong in branches and commits like code changes
- major design changes should also be noted in `docs/decision-log.md`
- the current-truth docs should be updated before or with implementation when behavior changes

## Recommended Solo Workflow

For this project right now, the simplest good workflow is:

1. create a branch from `main`
2. do one coherent slice of work
3. commit in clean, meaningful steps
4. open a PR or at least write a PR-style summary for yourself
5. merge back into `main`
6. tag meaningful milestones when appropriate

## Recommended First Branches

The next normal-cycle branches will likely look like:

- `docs/prototype-backlog`
- `docs/building-data-sheet`
- `docs/wave-data-sheet`
- `feat/tower-camera-prototype`
- `feat/survey-map-prototype`
- `feat/wave-routing-prototype`

## Open Questions

These can stay lightweight for now and be revisited when the team or codebase grows:

- when to enforce branch protection rules on the remote
- whether to require PRs even for every solo change
- whether to adopt conventional-commit tooling formally
- when prototype builds should become automated artifacts
