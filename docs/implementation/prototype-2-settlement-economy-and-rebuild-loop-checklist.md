# Prototype 2: Settlement Economy and Rebuild Loop Checklist

Status: Draft
Scope: Prototype 2
Phase: Pre-production
Owner: Design / Engineering
Source of Truth: No

This document turns the current economy, building, logistics, and rebuild design into a concrete Prototype 2 build checklist.

It is not a replacement for:

- `docs/economy-buildings-design.md`
- `docs/mvp-scope-and-prototype-plan.md`
- `docs/prototype-backlog.md`
- `docs/data/building-data-sheet.md`
- `docs/data/sabine-starting-package.md`

Its job is to define the smallest implementation slice that can prove the settlement economy and recovery loop is readable, playable, and worth building on before Prototype 3 adds real route pressure.

## Prototype Goal

Prototype 2 should prove that a small settlement can gather, move, store, spend, lose, and rebuild resources in a way that creates meaningful between-wave decisions.

This prototype should stay intentionally small:

- one settlement
- one compact Sabine-aligned start state
- one shared baseline economy
- one guided `Storehouse` completion objective
- one limited damage-and-repair loop
- enough layout and labor friction to prove that roads, storage, and builder capacity matter

Recommended placeholder framing:

- use Sabine's baseline opening as the authored start state
- start with `Tower Core`, `House`, `Field`, `Woodcutter Camp`, and a `Storehouse` foundation already placed
- include a short road spine between core sites
- gate and palisade can exist as light construction or light damage targets even if full wave simulation is still mocked
- use authored damage events if needed instead of waiting for full Prototype 3 combat pressure

## Prototype Purpose

- [ ] Prove that stockpiled resources and operational pressures combine into a readable settlement loop.
- [ ] Prove that building placement, construction, repair, and hauling create meaningful layout decisions.
- [ ] Prove that `Storehouse` completion is a real survival objective rather than optional optimization.
- [ ] Prove that housing loss, food pressure, and storage limits create visible urgency.
- [ ] Prove that dedicated builder capacity matters and general labor is only a weak substitute.
- [ ] Prove that post-damage rebuilding produces real tradeoffs between restoring function and expanding capacity.

## Prototype Success Criteria

- [ ] A tester can identify current `Food`, `Wood`, `Stone`, and `Mana` stockpiles and explain what they are for.
- [ ] A tester can identify current `labor availability`, `housing capacity`, `storage capacity`, and `safety` pressure.
- [ ] A tester can complete or meaningfully advance the guided `Storehouse` objective and explain why it matters.
- [ ] A tester can see construction progress and repair progress moving over time through labor input.
- [ ] A tester can observe hauling or delivery delays slowing construction or repair even when stockpiles exist.
- [ ] A tester can observe roads improving delivery or movement throughput on connected routes.
- [ ] A tester can see housing loss create immediate pressure rather than only cosmetic damage.
- [ ] A tester can see food pressure build when production or storage is disrupted.
- [ ] A tester can make at least one real rebuild decision where `repair first` and `expand now` compete.
- [ ] A damaged settlement can recover, but not trivially or instantly.

## Must-Prove Questions

- [ ] Does rebuilding between threats feel like gameplay instead of downtime?
- [ ] Does the player understand why a compact layout with roads recovers better than a scattered one?
- [ ] Does `Storehouse` completion feel like a meaningful logistics unlock?
- [ ] Does builder scarcity create understandable bottlenecks?
- [ ] Does housing loss matter immediately enough to change priorities?
- [ ] Does food production and food storage create visible pressure without needing deep forecasting UI yet?
- [ ] Do hauling and delivery make distance matter without becoming a full transport simulator?
- [ ] Can the player understand why `Palisade` and `Gate` belong in the economy/rebuild prototype even before full wave routing is implemented?
- [ ] Is Sabine's guided opener helping the player learn good recovery habits instead of masking core economy problems?

## Explicitly In Scope

### Buildings

- [ ] `Tower Core`
- [ ] `House`
- [ ] `Field`
- [ ] `Woodcutter Camp`
- [ ] `Storehouse`
- [ ] `Builder's Yard`
- [ ] `Road`
- [ ] `Palisade`
- [ ] `Gate`

### Resource Model

- [ ] stockpiled `Food`
- [ ] stockpiled `Wood`
- [ ] stockpiled `Stone`
- [ ] stockpiled `Mana`
- [ ] spending resources on construction
- [ ] spending resources on repair
- [ ] basic ongoing production from `Field` and `Woodcutter Camp`
- [ ] baseline mana from `Tower Core`

### Operational Pressures

- [ ] labor availability
- [ ] housing capacity
- [ ] storage capacity
- [ ] safety

### Core Behaviors

- [ ] construction progress
- [ ] repair progress
- [ ] hauling / delivery behavior
- [ ] road throughput improvement
- [ ] housing loss pressure
- [ ] food pressure
- [ ] `Storehouse` completion and usefulness
- [ ] builder scarcity
- [ ] post-damage rebuilding choices

### Sabine Alignment

- [ ] start from Sabine's compact opener where relevant
- [ ] include the guided `Storehouse` objective
- [ ] preserve the lesson that logistics and recovery are part of survival
- [ ] keep `Bell Post` and full faction-specific overlays out unless needed as context only

## Explicitly Out of Scope

- [ ] deep trade economy
- [ ] money, wages, or tax simulation
- [ ] iron, luxuries, rare reagents, or advanced supply chains
- [ ] deep livestock simulation
- [ ] full `Pasture` implementation unless used as a later optional extension
- [ ] `Quarry` as required baseline content
- [ ] `Mana Well Tap` as required baseline content
- [ ] advanced mana industry chains
- [ ] decorative-value systems
- [ ] advanced social simulation beyond the minimum needed for housing and labor pressure
- [ ] full wave routing or combat fidelity
- [ ] fire as a deep system
- [ ] faction-specific economy subsystems

Recommended placeholder scope rule:

- [ ] if a system does not help prove recovery, logistics, housing pressure, food pressure, or builder scarcity, leave it for later

## Required Systems

- [ ] stockpile model for `Food`, `Wood`, `Stone`, `Mana`
- [ ] capacity model for `housing`, `storage`, and `mana capacity`
- [ ] labor-availability model
- [ ] safety-state model
- [ ] building placement on surveyed terrain
- [ ] building state model:
- [ ] planned
- [ ] foundation
- [ ] under_construction
- [ ] built
- [ ] damaged
- [ ] destroyed or rubble
- [ ] construction-progress system
- [ ] repair-progress system
- [ ] resource reservation or consumption rule for construction start
- [ ] hauling / delivery system for moving materials to work sites
- [ ] road throughput modifier
- [ ] building output and capacity effects
- [ ] basic build / repair prioritization
- [ ] simple damage application or authored damage-event system
- [ ] simple UI surfacing for stockpiles, pressures, build queues, and damaged structures

Recommended placeholder implementation rules:

- [ ] consume or reserve building cost at construction start, not at completion
- [ ] let general labor progress builds slowly if no builder exists
- [ ] use one simple hauling model first: pickup from source storage, deliver to destination site
- [ ] use one simple road bonus first: `+50%` movement and hauling throughput on connected route segments
- [ ] use authored damage events first if Prototype 3 systems are not ready

## Required Buildings

### `Tower Core`

- [ ] starts built
- [ ] provides small baseline mana income
- [ ] provides small protected storage
- [ ] acts as anchor for the settlement start state

### `House`

- [ ] provides housing capacity
- [ ] can be damaged and repaired
- [ ] housing loss creates immediate settlement pressure

### `Field`

- [ ] produces food on a simple readable schedule
- [ ] can be damaged and repaired
- [ ] food disruption is visible in stockpile outlook

### `Woodcutter Camp`

- [ ] produces wood
- [ ] requires practical access to timber
- [ ] can be damaged and repaired

### `Storehouse`

- [ ] exists as Sabine-guided foundation or foundation-started building
- [ ] can be completed through build progress
- [ ] increases storage capacity when completed
- [ ] meaningfully improves delivery or reserve usefulness
- [ ] becomes a priority repair target if damaged

### `Builder's Yard`

- [ ] unlocks or strongly improves dedicated builder throughput
- [ ] increases rebuild capacity
- [ ] clarifies why a settlement without builders falls behind

### `Road`

- [ ] can be placed between major sites
- [ ] improves movement and hauling throughput on connected routes
- [ ] creates visible difference between connected and unconnected layouts

### `Palisade`

- [ ] can be constructed as cheap perimeter or route-shaping infrastructure
- [ ] can be damaged and repaired
- [ ] consumes wood and builder time that could otherwise go to economy or housing

### `Gate`

- [ ] can be placed into a palisade line
- [ ] can be damaged and repaired
- [ ] acts as a clear economic and recovery priority site

## Required Resource Behaviors

### `Food`

- [ ] exists as one shared visible stockpile
- [ ] is increased by `Field`
- [ ] is consumed over time by the settlement
- [ ] shortage or low-stock state is surfaced clearly
- [ ] damaged or lost `Field` output creates visible future pressure

Recommended placeholder:

- [ ] use a simple daily or periodic food burn readout rather than deep forecast UI

### `Wood`

- [ ] exists as a construction and repair resource
- [ ] is increased by `Woodcutter Camp`
- [ ] is consumed by `House`, `Storehouse`, `Builder's Yard`, `Road`, `Palisade`, and `Gate`
- [ ] shortage meaningfully slows rebuilding and expansion

### `Stone`

- [ ] exists as a structural construction and repair resource
- [ ] can start as limited stockpile in Sabine opener
- [ ] is needed to finish `Storehouse`, `House`, `Builder's Yard`, and `Gate`
- [ ] can remain mostly finite in Prototype 2 if `Quarry` is out of scope

Recommended placeholder:

- [ ] do not require `Quarry` implementation for Prototype 2; authored starting stone is enough to prove repair-vs-expansion choices

### `Mana`

- [ ] exists as a stockpile and capacity-limited resource
- [ ] receives baseline trickle from `Tower Core`
- [ ] has clear capacity from `Tower Core`
- [ ] remains economically present without becoming the main Prototype 2 challenge

Recommended placeholder:

- [ ] treat `Mana` mostly as background infrastructure pressure in Prototype 2, not a major bottleneck

## Required Operational Pressures

### Labor Availability

- [ ] visible enough for the player to understand how many workers are effectively free for new jobs
- [ ] affected by workers already committed to food, wood, hauling, tower service, or readiness
- [ ] low labor availability should slow construction, hauling, and repair

### Housing Capacity

- [ ] visible enough for the player to see current capacity versus need
- [ ] damaged or destroyed `House` should reduce effective capacity
- [ ] low housing should create immediate penalty or warning pressure

### Storage Capacity

- [ ] visible enough for the player to see current capacity versus stored goods
- [ ] `Tower Core` should provide a small starting buffer
- [ ] `Storehouse` completion should create an obvious capacity improvement
- [ ] low storage should create clear economic waste or bottleneck risk

### Safety

- [ ] visible enough to act as a settlement pressure rather than hidden flavor
- [ ] should worsen after building damage or exposed layout problems
- [ ] should matter in recovery prioritization even if full social consequences come later

Recommended placeholder:

- [ ] use one settlement-level safety band or score for Prototype 2 rather than deep household safety simulation

## Required Player Actions

- [ ] inspect stockpiled resources
- [ ] inspect operational pressures
- [ ] place at least one new building on surveyed terrain
- [ ] complete the guided `Storehouse`
- [ ] place or extend road segments
- [ ] place at least one `Palisade` section
- [ ] place one `Gate`
- [ ] prioritize one construction task
- [ ] prioritize one repair task
- [ ] respond to a damaged `House`, `Field`, `Storehouse`, `Palisade`, or `Gate`
- [ ] choose between spending scarce `Wood` or `Stone` on recovery versus expansion
- [ ] observe one hauling bottleneck and improve it

## Required Failure States

- [ ] food pressure state from low production or low reserves
- [ ] housing pressure state from damaged or destroyed `House`
- [ ] storage pressure state from unfinished or damaged `Storehouse`
- [ ] repair backlog state from too little builder throughput
- [ ] logistics failure state where resources exist but arrive too slowly
- [ ] overcommit state where too many projects outstrip labor or materials

Recommended prototype-level failure framing:

- [ ] use warning and degradation states, not full game-over conditions
- [ ] the prototype should prove pressure and bad recovery outcomes before full loss-state tuning

## Required Rebuild Decisions

- [ ] repair `House` first versus finish `Storehouse`
- [ ] repair `Field` first versus expand defenses
- [ ] spend `Wood` on `Road` throughput versus `Palisade` growth
- [ ] spend `Stone` on `Builder's Yard` or `Storehouse` completion versus hold for emergency repair
- [ ] assign scarce labor to food, wood, hauling, or building
- [ ] choose whether to accept slow general-labor build speed or invest in dedicated builders

Recommended minimum decision set to prove:

- [ ] one `repair first` choice
- [ ] one `expand now` choice
- [ ] one `improve logistics now` choice

## Core Feature Checklist

### Economy Core

- [ ] implement four stockpiles: `Food`, `Wood`, `Stone`, `Mana`
- [ ] implement settlement consumption of `Food`
- [ ] implement baseline mana trickle from `Tower Core`
- [ ] implement stockpile display
- [ ] implement shortage or low-stock warnings

### Building Core

- [ ] implement building placement rules for required buildings
- [ ] implement building states and transitions
- [ ] implement construction cost payment or reservation
- [ ] implement construction progress
- [ ] implement repair progress
- [ ] implement damage state for required buildings

### Logistics Core

- [ ] implement hauling jobs or hauling behavior
- [ ] implement delivery of materials to unfinished or damaged sites
- [ ] implement `Storehouse` as a real logistics destination
- [ ] implement road-connected throughput improvement
- [ ] surface when hauling is the bottleneck

### Pressure Core

- [ ] implement labor-availability pressure
- [ ] implement housing-capacity pressure
- [ ] implement storage-capacity pressure
- [ ] implement safety pressure
- [ ] surface pressure clearly in UI

### Recovery Core

- [ ] implement one guided `Storehouse` objective
- [ ] implement one damaged-building recovery loop
- [ ] implement builder scarcity
- [ ] implement repair prioritization or queue order
- [ ] implement visible competition between repair and expansion

## Data / Content Dependencies

- [ ] use stable building ids from `docs/data/building-data-sheet.md`
- [ ] use Sabine opener assumptions from `docs/data/sabine-starting-package.md`
- [ ] use Prototype 1 surveyed-terrain placement assumptions
- [ ] keep all authored costs and progress values data-driven where practical

Recommended authored starting package for Prototype 2:

- [ ] `Tower Core` built
- [ ] `House` built
- [ ] `Field` built
- [ ] `Woodcutter Camp` built
- [ ] `Storehouse` foundation started at about `40%` completion
- [ ] small starting road spine
- [ ] `Food:34`
- [ ] `Wood:36`
- [ ] `Stone:7`
- [ ] `Mana:24`
- [ ] no dedicated builder at start

Recommended early placeholder values:

- [ ] `Tower Core`: `+2 Mana/day`, `20 protected storage`, `40 mana cap`
- [ ] `House`: `+6 housing capacity`
- [ ] `Field`: `24 Food / 6 days if intact`
- [ ] `Woodcutter Camp`: `8 Wood/day`
- [ ] `Storehouse`: `+120 storage`, `+40 protected food storage`
- [ ] `Builder's Yard`: enables dedicated builders
- [ ] `Road`: `+50%` move / haul throughput on connected segments
- [ ] active builder: `10 Build Progress/day`, `14 Repair Progress/day`
- [ ] general labor substitute: `4 Build Progress/day`

## Recommended Implementation Order

### Step 1: Economy Shell

- [ ] stockpiles
- [ ] capacity values
- [ ] basic consumption / production ticks
- [ ] UI readout for resources and pressures

### Step 2: Building State and Placement

- [ ] placement rules
- [ ] building states
- [ ] construction start and progress
- [ ] completion effects

### Step 3: Sabine Opening Package

- [ ] authored start layout
- [ ] guided `Storehouse` foundation
- [ ] starting stockpiles
- [ ] starting labor commitments

### Step 4: Hauling and Delivery

- [ ] move resources to unfinished and damaged sites
- [ ] connect source, route, and destination
- [ ] expose hauling bottlenecks

### Step 5: Roads

- [ ] place road segments
- [ ] apply route throughput bonus
- [ ] demonstrate better recovery on connected layouts

### Step 6: Damage and Repair

- [ ] damage selected buildings
- [ ] repair progress
- [ ] damaged-building penalties
- [ ] repair prioritization

### Step 7: Builder Scarcity

- [ ] general labor fallback
- [ ] `Builder's Yard`
- [ ] dedicated builder throughput
- [ ] compare with non-builder recovery

### Step 8: Recovery Tradeoff Pass

- [ ] repair vs expand decisions
- [ ] housing-loss response
- [ ] food disruption response
- [ ] storage bottleneck response

## Minimum Test Scenarios

### Scenario 1: Sabine Opener Baseline

- [ ] Start from the authored Sabine package.
- [ ] Tester can identify the `Storehouse` foundation as the immediate logistics objective.
- [ ] Tester can explain current resource stockpiles and labor commitments.

### Scenario 2: Storehouse Completion

- [ ] `Storehouse` starts at partial completion.
- [ ] Tester allocates labor and materials to finish it.
- [ ] Storage capacity visibly increases on completion.
- [ ] Tester can explain why completion improved the settlement.

### Scenario 3: Hauling Bottleneck

- [ ] Trigger a case where resources exist but are not yet delivered to a work site.
- [ ] Tester sees progress stall or slow.
- [ ] Tester improves route or labor assignment.
- [ ] Delivery speed improves visibly.

### Scenario 4: Road Throughput Value

- [ ] Compare one connected route and one unconnected route.
- [ ] Same material movement or repair request is issued.
- [ ] Connected route resolves faster.
- [ ] Tester can explain why roads matter.

### Scenario 5: Housing Loss Pressure

- [ ] Damage or destroy the starting `House`.
- [ ] Housing capacity drops.
- [ ] Settlement pressure rises immediately.
- [ ] Tester chooses whether to repair housing first or continue another project.

### Scenario 6: Food Pressure

- [ ] Damage the `Field` or reduce its output temporarily.
- [ ] Food outlook worsens.
- [ ] Tester must choose between repairing food production and pursuing another project.

### Scenario 7: Builder Scarcity

- [ ] Run one recovery pass without `Builder's Yard`.
- [ ] Run one recovery pass with `Builder's Yard` and dedicated builder throughput.
- [ ] Recovery outcome is visibly better with builders.

### Scenario 8: Repair vs Expand

- [ ] Present scarce `Wood` and `Stone`.
- [ ] Present at least one damaged building and one attractive new construction option.
- [ ] Tester must choose between rebuilding current function and expanding future capacity.

### Scenario 9: Defense Infrastructure as Economic Burden

- [ ] Place or repair `Palisade` and `Gate`.
- [ ] Show that they consume materials and builder time.
- [ ] Tester can explain why perimeter choices affect recovery capacity.

## Validation Criteria

- [ ] The player understands the core role of each required building.
- [ ] The guided `Storehouse` objective feels necessary, not arbitrary.
- [ ] Resource scarcity creates choices without immediate paralysis.
- [ ] Labor scarcity is readable.
- [ ] Builder scarcity is readable.
- [ ] Roads improve settlement performance enough to matter.
- [ ] Damage creates downtime pressure, not just HP loss.
- [ ] Rebuilding feels like a loop with prioritization, not auto-cleanup.
- [ ] Housing and food pressure are both legible and actionable.
- [ ] The prototype teaches why compact Sabine-style planning is strong.

Recommended validation method:

- [ ] run at least one guided internal test and one cold-read test
- [ ] ask testers to explain why they prioritized a building, not just which one they chose
- [ ] record every case where testers had the resources but still could not explain why progress stalled

## Failure Cases to Watch For

- [ ] stockpiles feel disconnected from what is happening in the settlement
- [ ] `Storehouse` completion feels optional or underpowered
- [ ] hauling is invisible, so logistics never feels real
- [ ] hauling is too detailed, so the loop becomes tedious
- [ ] roads are too weak to matter
- [ ] roads are so strong that layout tradeoffs disappear
- [ ] builder scarcity is not visible until too late
- [ ] general labor is strong enough to make `Builder's Yard` unnecessary
- [ ] housing loss feels cosmetic
- [ ] food pressure feels delayed or arbitrary
- [ ] storage pressure never matters because starting capacity is too forgiving
- [ ] `Palisade` and `Gate` feel disconnected from economy and recovery
- [ ] damage penalties are so harsh that recovery is impossible
- [ ] damage penalties are so light that repair choices do not matter
- [ ] Sabine's strong opening hides real economy weaknesses instead of teaching them

## Handoff To Prototype 3

Prototype 2 is ready to hand off when:

- [ ] required buildings exist in a stable shared-baseline form
- [ ] stockpiles and operational pressures are readable
- [ ] the guided `Storehouse` opener works
- [ ] hauling and roads create meaningful layout differences
- [ ] housing loss and food disruption create immediate pressure
- [ ] repair and rebuild priorities are understandable
- [ ] `Palisade` and `Gate` already function as meaningful build-and-repair costs

Prototype 3 should build on this by adding:

- [ ] off-map threat pressure against the settlement
- [ ] real interaction with `Palisade` and `Gate`
- [ ] route pressure that makes layout and perimeter choices matter under attack
- [ ] clearer reasons for when to protect `Field`, `Storehouse`, `Gate`, or housing first
- [ ] recovery pacing that is shaped by actual wave damage instead of only authored damage events

## Follow-Up Questions For Later Prototypes

- [ ] Should `Quarry` become part of late Prototype 2 or wait cleanly for broader first-playable integration?
- [ ] Should `Mana Well Tap` enter as a Prototype 2 extension once baseline recovery is proven, or stay for later milestone work?
- [ ] How visible should daily food-burn forecasting become before the dedicated `Granary` path exists?
- [ ] Should `House` be a single generic housing building in Prototype 2, or should notable households already be called out more strongly?
- [ ] How much repair prioritization should be automatic under Sabine's `Repair First` policy versus explicitly chosen by the player?
- [ ] When Prototype 3 introduces real route pressure, should `Road` throughput also influence evacuation and defender response immediately, or only hauling at first?
