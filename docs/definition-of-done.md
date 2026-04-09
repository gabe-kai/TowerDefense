# Definition Of Done

Status: Active
Scope: Whole Project
Phase: Pre-production
Owner: Design / Engineering
Source of Truth: Yes

## Purpose

This document defines what “done” means for work in this project.

It exists to prevent ambiguity during implementation, review, and merge decisions.

Different work types have different completion standards. This document sets the minimum expected bar for each.

## Core Rule

Work is not done when it merely exists.

Work is done when:

- it matches the intended scope of the branch or task
- it is understandable and reviewable
- it does not quietly contradict current project direction
- the related documentation is accurate enough to support the next person or next phase

## General Done Criteria

For any change to count as done:

- the intended task boundary is clear
- the result is coherent and focused
- obvious follow-up work is identified instead of hidden
- known risks or placeholders are stated plainly
- the repository is left in a better and more legible state than before

## Done For Documentation

Documentation work is done when:

- the document has a clear purpose
- status header fields are present and appropriate
- the content matches the correct document type
- important adjacent docs are referenced where needed
- terminology is consistent with current canon
- obvious contradictions with nearby docs have been resolved or called out
- navigation is good enough that the doc is not an island

Documentation work is not done if:

- it duplicates a canon doc without purpose
- it leaves major ambiguity about source of truth
- it quietly changes project direction without updating affected docs

## Done For Planning Docs

Planning work is done when:

- the milestone, prototype, or workflow boundary is clear
- in-scope and out-of-scope lines are visible
- handoff to the next planning or implementation step is clear
- dependencies and assumptions are stated

## Done For Data Sheets

Implementation-facing data docs are done enough when:

- the fields are consistent and explicit
- placeholders are recommended rather than left vague
- ids and vocabulary are stable enough for downstream use
- the related canon doc still supports the data structure
- unresolved tuning questions are captured separately from stable fields

These do not need final tuned values to count as done.

They do need clear structure.

## Done For Prototype Checklists

A prototype checklist is done when:

- the prototype purpose is clear
- success criteria are clear
- must-prove questions are clear
- in-scope and out-of-scope boundaries are clear
- test scenarios and validation criteria are present
- handoff to the next prototype or integration step is visible

## Done For Code

Code work is done when:

- the feature or fix works at its intended milestone scope
- the result matches the relevant design and planning docs, or the docs were updated deliberately
- the code is understandable enough for future iteration
- obvious debug visibility exists for the new behavior
- the change has been validated at an appropriate level for the current project phase
- known shortcuts are explicit rather than disguised as finished architecture

Code work does not need to be production-perfect in the first milestone.

It does need to be:

- buildable
- inspectable
- testable
- honest about its limits

## Done For Prototype-Phase Code

Prototype-phase code is done enough when:

- it answers the intended prototype question
- it is stable enough to demonstrate repeatedly
- it does not block the next planned prototype layer
- it includes enough debug support to understand failures
- it avoids unnecessary architecture debt where simple reuse is possible

Prototype code may still be:

- ugly
- limited
- partially hard-coded

But only if those limits are known and intentional.

## Done For Review

A change is ready to merge when:

- the branch goal has been met
- the human owner understands what changed
- review did not expose an unresolved contradiction or hidden risk that should block merge
- the next expected step is clearer after the merge than before it

## Definition Of Not Done

Work is not done if:

- the docs and output disagree in important ways
- the branch contains multiple unrelated goals
- critical assumptions are only present in chat history
- validation was skipped for a change that needed it
- follow-up cleanup is required just to make the result understandable

## Practical Merge Rule

If the work is good enough to support the next intentional step without confusing future-you, it is usually done enough to merge.

If merging it would make the next step murkier, it is probably not done yet.

## Update Rule

Update this document when:

- the project changes its review bar
- implementation maturity raises quality expectations
- prototype-phase “done enough” rules stop being sufficient
