# Prototype 4: Social Consequence and Named Villagers Checklist

Status: Draft
Scope: Prototype 4
Phase: Pre-production
Owner: Design / Engineering
Source of Truth: No

This document turns the current NPC, household, morale, loyalty, drafting, and loss-consequence design into a concrete Prototype 4 build checklist.

It is not a replacement for:

- `docs/social-systems-design.md`
- `docs/economy-buildings-design.md`
- `docs/monster-wave-design.md`
- `docs/mvp-scope-and-prototype-plan.md`
- `docs/prototype-backlog.md`
- `docs/data/npc-schema-and-value-ranges.md`
- `docs/data/sabine-starting-package.md`
- `docs/implementation/prototype-1-camera-and-information-readability-checklist.md`
- `docs/implementation/prototype-2-settlement-economy-and-rebuild-loop-checklist.md`
- `docs/implementation/prototype-3-wave-routing-and-defensive-pressure-checklist.md`

Its job is to define the smallest implementation slice that can prove villagers are remembered as people, households matter operationally, and wave damage creates visible social aftereffects instead of only structural repair work.

## Prototype Goal

Prototype 4 should prove that a small named cast can make warning, loss, drafting, injury, and rebuilding feel socially meaningful without requiring a full long-horizon life sim.

This prototype should stay intentionally small:

- one Sabine-aligned starting settlement
- one founding household plus tower retainers
- one small authored named cast
- one lightweight work-role layer
- one lightweight household consequence layer
- one wave aftermath case that produces injury, absence, or death
- one emergency-defense hook that creates a real social tradeoff

Recommended placeholder framing:

- reuse Sabine's `2 adults + 2 children` founding household plus `3` retainers and servants
- keep the cast authored, not procedural
- keep visible social readouts focused on `Morale`, `Loyalty`, and `Grief`
- keep `Fear`, `Stress`, `Belonging`, and `Importance` active in logic but surfaced only when they explain outcomes
- use one post-wave consequence sequence tied to `Field`, `House`, or `Gate` pressure from Prototype 3

## Prototype Purpose

- [ ] Prove that named villagers change how the player reads danger and loss.
- [ ] Prove that households make injury, absence, rehousing, and casualty events more legible.
- [ ] Prove that basic aptitude and preference differences are enough to make villagers feel distinct.
- [ ] Prove that loss of a key person disrupts labor in ways rebuilding alone cannot immediately solve.
- [ ] Prove that a simple emergency-defense or drafting hook is viable but socially costly.
- [ ] Prove that wave damage can create visible morale, loyalty, grief, and belonging fallout.

## Prototype Success Criteria

- [ ] A tester can remember at least two named villagers after a short session.
- [ ] A tester can identify at least one founding household and one tower-side retainer group.
- [ ] A tester can explain who matters most in the settlement and why.
- [ ] A tester can see visible work-role differences between at least three adults.
- [ ] A tester can see a key-person loss create labor disruption beyond simple building damage.
- [ ] A tester can distinguish `wounded`, `missing`, and `dead` as different social states.
- [ ] A tester can see at least one social state change after wave damage and connect it to a concrete cause.
- [ ] A tester can use one emergency-defense or draft action and understand its social cost.
- [ ] A tester can see that replacing a damaged building is easier than replacing a trusted or skilled person.

## Must-Prove Questions

- [ ] Do named villagers change player behavior during warning, shelter, and rebuild decisions?
- [ ] Does losing a person feel meaningfully different from losing a building?
- [ ] Do households make rehousing, caregiver loss, and casualty fallout easier to understand?
- [ ] Are age classes and household roles enough to explain why some people should not be risked?
- [ ] Do simple aptitude and preference differences create believable work assignment outcomes?
- [ ] Can a light social model already support morale, loyalty, grief, fear, stress, and belonging without becoming unreadable?
- [ ] Does importance weighting make some losses hit harder in ways the player can understand?
- [ ] Does one simple drafting or emergency-defense hook create interesting tradeoffs instead of a false choice?
- [ ] Does Prototype 3 wave damage naturally feed into Prototype 4 social consequence?

## Explicitly In Scope

### Settlement Cast

- [ ] one authored named cast for the Sabine opener
- [ ] one founding household
- [ ] tower retainers and servants as a second social cluster
- [ ] children visible if practical within the current prototype setup

### Social Core

- [ ] named villagers
- [ ] age class support
- [ ] household membership
- [ ] visible work roles
- [ ] basic aptitude differences
- [ ] simple preference differences
- [ ] core social-state changes from danger and loss

### Consequence Core

- [ ] wounded / missing / dead status support
- [ ] labor disruption from absence or casualty
- [ ] household burden changes after loss
- [ ] visible social aftereffects from wave damage
- [ ] one emergency-defense or drafting hook

### Readability Core

- [ ] clear UI surfacing for who matters and why
- [ ] clear UI surfacing for household membership
- [ ] clear UI surfacing for current role and current status
- [ ] clear explanation of major social fallout after a bad event

## Explicitly Out of Scope

- [ ] deep romance systems
- [ ] inheritance systems
- [ ] generational simulation
- [ ] broad immigration and desertion rollout as required baseline
- [ ] deep bond-web simulation beyond minimal household and parent-child support
- [ ] complex class politics
- [ ] court intrigue
- [ ] detailed ideology or religion systems
- [ ] large-population autonomous job market tuning
- [ ] advanced militia progression
- [ ] full medical simulation
- [ ] long recovery rites or ritual systems as required baseline

Recommended placeholder scope rule:

- [ ] if a system does not help prove named identity, household stakes, social fallout, or emergency-defense tradeoffs, postpone it

## Required NPC Identity Features

- [ ] stable NPC ids
- [ ] player-facing full display names
- [ ] age years in data
- [ ] visible age class
- [ ] origin type
- [ ] settlement role
- [ ] current assignment
- [ ] status
- [ ] `Body`
- [ ] `Mind`
- [ ] `Nerve`
- [ ] six core skills:
- [ ] `Farming`
- [ ] `Hauling`
- [ ] `Building`
- [ ] `Crafting`
- [ ] `Tending`
- [ ] `Guard`
- [ ] one work like
- [ ] one work dislike
- [ ] one value preference
- [ ] importance support

Recommended authored cast minimum:

- [ ] `2` founding adults
- [ ] `2` founding children
- [ ] `1` steward-clerk retainer
- [ ] `1` tower servant
- [ ] `1` lookout or guard-sergeant

Recommended placeholder identity rule:

- [ ] keep all starting villagers fully authored for Prototype 4 so losses are easy to track in UI, logs, and tests

## Required Household Features

- [ ] stable household ids
- [ ] household member list
- [ ] household dwelling site link
- [ ] household role per NPC:
- [ ] `head`
- [ ] `partner`
- [ ] `child`
- [ ] `servant` or `lodger` if needed
- [ ] one founding household plus retainers
- [ ] absent-member count
- [ ] household burden
- [ ] household safety
- [ ] household bereavement
- [ ] primary caregiver flag
- [ ] child-dependent support

Recommended prototype household setup:

- [ ] `household.sabine_founders` anchored to `Main House`
- [ ] `tower_household` or equivalent for the tower servant and lookout / sergeant
- [ ] keep the steward-clerk either in `tower_household` or `household.none` as a readable retainer exception

Recommended placeholder rule:

- [ ] do not require a full freeform relationship graph in Prototype 4; household membership plus parent-child or caregiver links are enough

## Required Work-Role Features

- [ ] visible settlement role label
- [ ] visible current assignment label
- [ ] basic job suitability from skill fit
- [ ] basic job suitability from preference fit
- [ ] basic job suitability from danger tolerance or obligation
- [ ] at least one clearly skilled builder or logistics-biased adult
- [ ] at least one food-focused household adult
- [ ] at least one readiness or defense-capable retainer
- [ ] simple labor disruption when a skilled person is wounded, missing, dead, or drafted

Recommended minimum distinct adult profiles:

- [ ] one food-biased adult who dislikes direct defense
- [ ] one general-labor or building-biased adult
- [ ] one hauling / storehouse-support retainer
- [ ] one tower-service adult
- [ ] one guard or lookout with the best `Guard` and `Nerve`

Recommended placeholder implementation rule:

- [ ] use coarse job tags from the schema sheet, not fine-grained job trees

## Required Social-State Features

### Visible Early

- [ ] `Morale`
- [ ] `Loyalty`
- [ ] `Grief`

### Active In Logic

- [ ] `Fear`
- [ ] `Stress`
- [ ] `Belonging`
- [ ] `Importance`

### Required Behaviors

- [ ] danger increases `Fear`
- [ ] repeated strain or overwork increases `Stress`
- [ ] death, missing status, or home loss increases `Grief`
- [ ] fair protection and recovery support stabilize `Morale`
- [ ] reckless sacrifice or child endangerment reduces `Loyalty`
- [ ] rooted household safety improves `Belonging`
- [ ] high-importance losses create stronger fallout than ordinary losses

Recommended placeholder thresholds:

- [ ] use simple bands such as `stable`, `strained`, and `breaking` for early UI summaries if raw values are too noisy
- [ ] keep exact `0-100` values available in debug or detail view

## Required Loss / Injury / Absence Consequences

- [ ] `wounded` status reduces usefulness but preserves the person
- [ ] `missing` status remains distinct from `dead`
- [ ] `dead` NPCs remain in records and logs
- [ ] caregiver loss raises household burden
- [ ] child exposure or harm creates sharper social fallout than routine adult strain
- [ ] loss of a key worker reduces output in the role they covered
- [ ] loss of a guard or lookout weakens readiness confidence
- [ ] loss of a builder-capable adult slows repair or completion work
- [ ] housing loss or displacement increases grief or belonging damage for the affected household
- [ ] post-wave aftermath can leave a household with absent members even after buildings are repaired

Recommended minimum consequence proof:

- [ ] one scenario where a key adult is `wounded`
- [ ] one scenario where a person is `missing`
- [ ] one scenario where a notable person is `dead`

## Required Player-Facing Readability Features

- [ ] NPC list or roster panel with name, role, status, and household
- [ ] household panel or compact household summary
- [ ] icon or tag for child, caregiver, retainer, and key specialist
- [ ] current assignment display
- [ ] visible social summary for at least `Morale`, `Loyalty`, and `Grief`
- [ ] explanation or tooltip for why a villager is marked important
- [ ] clear surfacing of who is wounded, missing, dead, or drafted
- [ ] event log or alert card for major social incidents
- [ ] visible connection between a wave event and the villagers affected

Recommended minimum readability examples:

- [ ] `Mara Fen, founding household, primary caregiver, wounded`
- [ ] `Tomas Alder missing after South Gate breach`
- [ ] `Sergeant Iven dead; readiness confidence reduced`

Recommended placeholder UI rule:

- [ ] prefer one compact roster plus one selected-NPC detail panel over many social windows

## Required Failure States

- [ ] a key adult is lost and the settlement cannot fully cover their role
- [ ] emergency drafting protects the settlement but causes morale or loyalty damage
- [ ] a household loses housing or a caregiver and becomes socially unstable
- [ ] the player cannot explain who was affected by a bad wave outcome
- [ ] the player treats villagers as interchangeable because the UI does not surface differences
- [ ] social-state changes happen but feel causeless or invisible
- [ ] the prototype only shows sadness flavor text without gameplay consequence

Recommended prototype-level failure framing:

- [ ] use visible destabilization, slower labor, and harder recovery as the main failure proof
- [ ] do not require full desertion or settlement collapse to validate Prototype 4

## Core Feature Checklist

### Identity Core

- [ ] implement stable authored NPC records
- [ ] implement full display names
- [ ] implement age-class display
- [ ] implement origin, role, and assignment display
- [ ] implement skill and aptitude differences
- [ ] implement one preference like and dislike per adult

### Household Core

- [ ] implement household records
- [ ] implement household membership links
- [ ] implement caregiver tagging
- [ ] implement dependent or child tagging
- [ ] implement household burden, safety, and bereavement summaries

### Social-State Core

- [ ] implement `Morale`
- [ ] implement `Loyalty`
- [ ] implement `Fear`
- [ ] implement `Stress`
- [ ] implement `Grief`
- [ ] implement `Belonging`
- [ ] implement `Importance`
- [ ] implement event-driven state changes from damage, absence, and death

### Status-and-Consequence Core

- [ ] implement `active`
- [ ] implement `wounded`
- [ ] implement `bedridden` if cheap
- [ ] implement `drafted`
- [ ] implement `missing`
- [ ] implement `dead`
- [ ] keep dead and missing NPCs visible in records
- [ ] recalculate labor availability after loss or drafting
- [ ] recalculate household burden after loss or absence

### Readability Core

- [ ] implement roster panel
- [ ] implement household summary panel
- [ ] implement selected-NPC detail panel
- [ ] implement major social event log or alert cards
- [ ] implement surfacing for why a person matters
- [ ] implement visible post-wave consequence summary

### Emergency-Defense Core

- [ ] implement one simple drafting or emergency-defense hook
- [ ] restrict or discourage drafting of key caregivers and children
- [ ] show social cost when civilians are drafted
- [ ] show labor cost when civilians leave normal work

Recommended minimum hook:

- [ ] reuse `Ordered Levies` as the first prototype-level emergency-defense action

## Data / Content Dependencies

- [ ] use NPC field cuts from `docs/data/npc-schema-and-value-ranges.md`
- [ ] use Sabine opener household and roster assumptions from `docs/data/sabine-starting-package.md`
- [ ] reuse Prototype 2 roles, housing, and damage context
- [ ] reuse Prototype 3 warning, breach, and aftermath context
- [ ] keep all authored NPC ids, household ids, and status changes data-driven where practical

Recommended authored starting package for Prototype 4:

- [ ] `1` founding household at `Main House`
- [ ] `2` adults and `2` children in that household
- [ ] `1` steward-clerk retainer
- [ ] `1` tower servant
- [ ] `1` lookout or guard-sergeant
- [ ] one adult with `restricted` draft eligibility due to caregiving
- [ ] one adult with above-baseline `Building` or `Hauling`
- [ ] one adult with above-baseline `Guard` and `Nerve`

Recommended early placeholder values:

- [ ] founding adults start near `Morale 68`, `Loyalty 58`, `Stress 18`, `Belonging 72`
- [ ] children start with higher `Fear` sensitivity and no worker logic
- [ ] steward-clerk starts more tower-aligned than household-aligned
- [ ] lookout or sergeant starts with the highest early loyalty and guard readiness
- [ ] importance should be manually authored at first for the founding adults and the guard / lookout

## Recommended Implementation Order

### Step 1: NPC Data Shell

- [ ] stable NPC ids
- [ ] names
- [ ] age classes
- [ ] household ids
- [ ] role and assignment labels
- [ ] base skill and aptitude fields

### Step 2: Household Shell

- [ ] founding household data
- [ ] tower retainer grouping
- [ ] caregiver and child flags
- [ ] household summary values

### Step 3: Readability Shell

- [ ] roster panel
- [ ] selected-NPC panel
- [ ] household summary panel
- [ ] key-person markers

### Step 4: Work Differentiation

- [ ] role-based assignments
- [ ] basic skill fit
- [ ] one preference like
- [ ] one preference dislike
- [ ] visible labor contribution differences

### Step 5: Social-State Layer

- [ ] `Morale`
- [ ] `Loyalty`
- [ ] `Fear`
- [ ] `Stress`
- [ ] `Grief`
- [ ] `Belonging`
- [ ] `Importance`

### Step 6: Loss and Absence States

- [ ] `wounded`
- [ ] `missing`
- [ ] `dead`
- [ ] household burden recalculation
- [ ] labor disruption recalculation

### Step 7: Emergency-Defense Hook

- [ ] one draft or emergency-defense action
- [ ] labor removal from normal work
- [ ] morale or loyalty penalty on harsh use

### Step 8: Wave-Aftermath Integration

- [ ] feed Prototype 3 damage results into named-NPC outcomes
- [ ] generate social event log entries
- [ ] surface post-wave social summary

### Step 9: Readability and Tuning Pass

- [ ] confirm players can name important villagers
- [ ] confirm players can explain why a loss mattered
- [ ] confirm UI is not hiding consequence logic

## Minimum Test Scenarios

### Scenario 1: Baseline Cast Readability

- [ ] Start from the authored Sabine cast.
- [ ] Tester can identify the founding household.
- [ ] Tester can identify the retainers.
- [ ] Tester can explain the role of at least three adults.

### Scenario 2: Work Difference Readability

- [ ] Show one adult on food work, one on hauling or building, and one on readiness.
- [ ] Tester can explain why these people are not interchangeable.
- [ ] Tester can identify at least one person as a poor draft target and one as a better draft target.

### Scenario 3: Household Stakes

- [ ] Highlight the founding household at `Main House`.
- [ ] Show caregiver and child markers.
- [ ] Tester can explain why this household is sensitive to warning and rehousing events.

### Scenario 4: Wounded Key Worker

- [ ] A skilled adult becomes `wounded`.
- [ ] Their job contribution drops.
- [ ] Repair, hauling, or food work slows in a visible way.
- [ ] Tester can explain why the slowdown happened.

### Scenario 5: Missing Villager

- [ ] A villager becomes `missing` after a wave or breach.
- [ ] Household absent-member count rises.
- [ ] Grief and uncertainty remain distinct from confirmed death.
- [ ] Tester can explain why `missing` is different from `dead`.

### Scenario 6: Death Consequence

- [ ] A notable villager dies.
- [ ] Household bereavement rises.
- [ ] One or more visible social states worsen.
- [ ] Tester can explain why this death mattered more than generic casualty text.

### Scenario 7: Emergency Defense Tradeoff

- [ ] Player uses `Ordered Levies` or equivalent.
- [ ] One civilian leaves normal work for emergency defense.
- [ ] Immediate danger response improves or at least changes.
- [ ] Morale, loyalty, stress, or labor continuity worsens visibly.

### Scenario 8: Child or Caregiver Risk Fallout

- [ ] Warning or breach exposes a child or primary caregiver.
- [ ] Household safety and social fallout worsen.
- [ ] Tester can explain why this outcome is treated as more serious than routine damage.

### Scenario 9: Building Loss Versus Person Loss

- [ ] Run one case where only a building is damaged.
- [ ] Run one case where a key person is harmed or lost.
- [ ] Tester can explain why the human loss feels harder to recover from.

### Scenario 10: Post-Wave Social Aftermath

- [ ] Resolve a Prototype 3-style wave.
- [ ] Show damaged sites plus affected villagers.
- [ ] Show at least one social summary change tied to the outcome.
- [ ] Tester can identify what must be rebuilt physically and what must be stabilized socially.

## Validation Criteria

- [ ] Named villagers are memorable enough to change player attention.
- [ ] Founding household and retainer cluster are legible.
- [ ] Age class, household role, and caregiving explain why some villagers are protected differently.
- [ ] Basic aptitude and preference differences make roles feel distinct.
- [ ] `Wounded`, `missing`, and `dead` produce meaningfully different outcomes.
- [ ] Labor disruption from key-person loss is readable.
- [ ] Emergency drafting feels viable but costly.
- [ ] Social fallout after wave damage is visible and causally understandable.
- [ ] The player can answer who matters, what happened to them, and why it changed the settlement.

Recommended validation method:

- [ ] run at least one guided internal test and one cold-read test
- [ ] ask testers to name the people they were trying to protect
- [ ] ask testers whether a casualty changed their next rebuild or defense decision
- [ ] log every case where players noticed building damage but could not identify the human consequence

## Failure Cases to Watch For

- [ ] names exist but do not affect player decisions
- [ ] households exist only as flavor labels
- [ ] all adults still feel interchangeable
- [ ] children are present but operationally irrelevant
- [ ] `Morale`, `Loyalty`, `Fear`, `Stress`, `Grief`, and `Belonging` move with no readable cause
- [ ] too many social values are visible at once, making the UI noisy
- [ ] too few social values are visible, making outcomes opaque
- [ ] `Importance` drives outcomes but the player cannot tell why one death mattered more
- [ ] `missing` collapses into `dead` emotionally and mechanically
- [ ] drafting civilians is either obviously correct or obviously forbidden
- [ ] caregiver protection rules are so strict that they remove real choice
- [ ] caregiver protection rules are so weak that household stakes feel fake
- [ ] post-wave social fallout feels like text flavor instead of gameplay consequence
- [ ] Prototype 4 depends on deeper migration, bond, or desertion systems before it can function

## Handoff To Next Phase

Prototype 4 is ready to hand off when:

- [ ] the authored Sabine cast is stable
- [ ] one founding household plus retainers is readable in UI
- [ ] work-role differences are visible
- [ ] social-state changes from danger and loss are stable enough to tune
- [ ] `wounded`, `missing`, and `dead` are distinct and legible
- [ ] a key-person loss creates visible operational disruption
- [ ] one emergency-defense hook works with understandable cost
- [ ] post-wave damage from Prototype 3 can generate named social fallout cleanly

The next prototype or integration phase should build on this by adding:

- [ ] faction-layer tuning for Sabine's legitimacy, fairness, and recovery advantages
- [ ] stronger command-style consequences for protective versus severe choices
- [ ] richer household recovery actions such as rehousing, care, or mourning support
- [ ] broader migration, belonging, and desertion follow-through once population pressure matters more
- [ ] more explicit links between warning response quality and long-tail social trust

## Follow-Up Questions For Later Prototypes

- [ ] Should `Belonging` remain mostly hidden until migration and desertion are more active, or become a normal summary stat sooner?
- [ ] When should parent-child and partner links move from simple authored hooks to a fuller bond model?
- [ ] How explicit should the UI become about why a person has high `Importance`?
- [ ] Should `Fear` become player-visible during active crisis, or stay mostly implied through behavior?
- [ ] When Sabine's faction layer is added, how much should `Protective` versus `Severe` command tone directly affect loyalty and belonging?
- [ ] What is the minimum rehousing action set needed before household displacement feels fully playable rather than only implied?
- [ ] When should migration and desertion enter as real follow-through from repeated household loss?
