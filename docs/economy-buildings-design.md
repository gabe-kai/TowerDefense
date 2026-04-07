# Economy and Buildings Design

Status: Active
Scope: System
Phase: Pre-production
Owner: Design
Source of Truth: Yes

This document defines the first-playable economy and building roster for the tower defense + settlement builder game.

It is intentionally V1-focused. The goal is to make the first settlement loop legible, playable, and balanceable before layering in deeper supply chains, trade systems, or specialized industries.

## Design Goals

- Keep the economy small enough that wave defense remains the primary pressure.
- Make food, housing, safety, and labor feel close to hard requirements.
- Make mana feel like reliable infrastructure, not a rare luxury.
- Make rebuilding and recovery between waves a core part of play.
- Make loss of skilled people hurt more than loss of replaceable buildings.
- Preserve clear hooks for later expansion without forcing those systems into V1.

## V1 Resource Model

### Stockpiled Resources

V1 uses four stockpiled resources:

- `Food`
- `Wood`
- `Stone`
- `Mana`

### Operational Pressures

These matter as much as resources, but should not be treated as item stacks:

- `Labor availability`
- `Housing capacity`
- `Storage capacity`
- `Safety`

### Resource Roles

`Food`

- Keeps households alive and functional.
- Supports morale, labor stability, and settlement growth.
- Is the first resource that should eventually gain forecasting tools.

`Wood`

- Primary fast construction resource.
- Used for housing, roads, palisades, repairs, and early expansion.

`Stone`

- Slower structural resource.
- Used for tower upgrades, reinforcement, durable defenses, and advanced infrastructure.

`Mana`

- Powers spells, vision systems, magical defenses, and tower-linked magical infrastructure.
- Should usually be reliable if the player settles near an appropriate source.

## Food Model V1

### Core Direction

- Use one shared visible food pool in V1.
- Support hidden appetite variation per NPC or household for future expansion.
- Do not require the player to manage individual food types in the first playable.

### Appetite and Consumption Hooks

- Different people can eventually consume different amounts of food when not rationing.
- Rationing can later interact with appetite, burden, morale, and vulnerability.
- These hooks should exist in the simulation model even if the UI exposes only simple values at first.

### Food Sources

`Field`

- Primary staple food source.
- Efficient in output per worker.
- Vulnerable to fire, trampling, and wave damage.

`Pasture`

- Secondary resilient food source.
- Starts with `Sheep` and `Goats` in V1.
- Slower and more land-hungry than fields.
- More resilient than fields and a natural bridge to later husbandry systems.
- Should use individual animal entities from the start, not a purely abstract herd value.
- Animals should be nameable in V1 even if deeper trait gameplay is postponed.
- The data model should preserve clear hooks for later traits, breeding lines, wool production, dairy production, and allied-creature husbandry.

### Food Storage Path

- Food storage begins as part of the `Storehouse` path in V1.
- A later dedicated `Granary` path should unlock deeper food-consumption and forecasting tools.
- Those tools can eventually show:
  - current stores
  - harvest timing
  - expected harvest yield
  - recent food burn
  - projected survival time after crop loss

### Livestock Model V1

- Sheep and goats should exist as individual animals, not just as a pasture output number.
- Each animal should have at minimum:
  - species
  - name
  - home pasture
  - alive or dead state
- V1 does not need breeding controls, trait selection, or detailed care routines.
- V1 animals can remain mechanically simple while still being socially legible and expandable later.

Recommended V1 rule:

- A pasture has a livestock capacity.
- Its food output scales from the number of living animals currently assigned to it.
- Animal loss from raids, starvation, or neglect should reduce output directly and visibly.

Future hooks to preserve now:

- animal sex
- age
- fertility
- temperament
- coat, milk, or meat-related traits
- bond value with handlers or households

### Livestock Under Wave Pressure V1

This should be designed now at a rules level, but kept intentionally light in implementation.

Animal state in V1:

- `Alive`
- `Injured`
- `Missing`
- `Dead`

Core wave interaction rules:

- If monsters breach a pasture, animals are at risk.
- Livestock should not always die immediately on contact.
- Some animals should become `Missing` through panic, scattering, or forced flight.
- `Missing` animals should create a recoverable post-wave loss state.
- `Dead` animals are permanent losses.

Recommended first-pass behavior:

- light breaches: a few animals may panic and go missing
- sustained breaches: animals may be injured, killed, or scattered in larger numbers
- defended or enclosed pastures should usually suffer partial loss rather than total herd wipe

Recovery rules:

- Herders or general laborers can search for and recover `Missing` animals after the wave.
- Recovered animals return to pasture and restore output.
- Injured animals survive but contribute no output until recovery time passes.
- Dead animals must be replaced through future husbandry, trade, events, or scripted restocking methods.

Economic effect:

- Pasture output should scale off `Alive and present` animals.
- `Injured` and `Missing` animals temporarily reduce food output.
- `Dead` animals reduce both current output and future resilience until replaced.

Design goal:

- Fields should fail mainly through destruction and delayed regrowth.
- Pastures should fail mainly through animal loss, panic, and recovery friction.

Scope guard:

- Do not require complex animal micromanagement during waves.
- Do not require deep species-specific behavior in V1.
- Do not require theft, breeding control, veterinary simulation, or household-level ownership at this stage.

### Husbandry Industry Hooks

The first playable does not need full secondary industries, but the building and resource model should leave room for:

- `Wool` as a later textile input from sheep
- `Milk` as a later food-processing or nutrition input from goats and other livestock
- later specialized buildings such as pens, sheds, dairies, shearing spaces, or breeding yards

## Mana Model V1

### Core Direction

- Mana should feel dependable, not scarce by default.
- Settlement siting near reliable mana should be one of the strongest strategic choices.

### Mana Production

`Tower Core`

- Provides a tiny baseline mana trickle.
- Prevents total magical shutdown in minor disruptions.

`Mana Well Tap` or `Ley-Line Intake`

- Main source of mana production in V1.
- Should be a critical infrastructure building.

### Mana Storage

`Tower Core`

- Provides a small base mana capacity.

`Mana Reservoir`

- Optional early expansion building.
- Buffers temporary disruptions.
- Supports emergency spellcasting and uptime for magical systems.

### Mana Use

Mana is consumed by:

- player-cast spells
- vision extensions
- rune upkeep
- magical defenses
- tower-linked magical systems

### Mana Failure Pattern

- Mana disruption should be dangerous but not constantly common.
- The main risk should be losing throughput or uptime when mana infrastructure is damaged.
- A good settlement should usually survive a brief disruption through stored mana.

## V1 Buildings

### Critical Infrastructure

`Tower Core`

- Anchor of the spirit player
- Command and spellcasting center
- Small mana trickle
- Small mana storage
- Initial protected storage

Creates jobs:

- tower service
- mage-servant or magical maintenance

`House`

- Provides housing capacity
- Stabilizes households
- Prevents homelessness spirals

Creates jobs:

- no dedicated permanent job by default
- creates future repair and tending demand when damaged

`Field`

- Produces food
- Main staple crop building

Creates jobs:

- farmer

`Pasture`

- Produces food through sheep and goats
- More resilient than fields

Creates jobs:

- herder

`Woodcutter Camp`

- Produces wood

Creates jobs:

- woodcutter

`Quarry`

- Produces stone

Creates jobs:

- quarry worker

`Storehouse`

- Increases storage capacity
- Acts as a logistics destination
- Serves as the early food storage path

Creates jobs:

- hauler
- storekeeper later if needed, but not required in early V1

`Builder's Yard`

- Organizes construction and repair labor
- Speeds rebuilding between waves

Creates jobs:

- builder
- repair worker

`Mana Well Tap` or `Ley-Line Intake`

- Produces mana
- Serves as the main settlement mana intake

Creates jobs:

- mana tender
- magical maintenance

`Palisade`

- Cheapest perimeter defense
- Shapes wave routing
- Protects key economic assets

Creates jobs:

- no permanent job
- creates repair demand after attacks

`Gate`

- Controlled opening in defenses
- Maintains traffic flow
- Creates pathing and choke-point structure

Creates jobs:

- no permanent job in minimal V1

`Road`

- Improves movement efficiency
- Improves logistics, repairs, and emergency response

Creates jobs:

- no permanent job

### Optional Early Buildings

`Watchtower`

- Improves warning and sight
- Supports early wave-readability and defensive readiness

Creates jobs:

- lookout

`Guard Post`

- Supports standing defense labor without full military depth

Creates jobs:

- guard

`Mana Reservoir`

- Increases mana storage
- Buffers disruption

Creates jobs:

- magical maintenance

## First-Pass Balance Assumptions

These numbers are placeholders for the first playable.

They are meant to create a stable opening loop with visible pressure, not to represent final balance.

### Time Unit

- Use the `in-game day` as the main economy balancing unit.
- A wave cycle can later map to several in-game days.
- Exact time compression between real-time play and in-game time can be finalized later without rewriting the resource model.

### Population Assumptions

- Typical adult baseline appetite: `1 Food per day`
- Typical child appetite: `0.6 Food per day`
- Heavy labor can later add small appetite pressure, but this does not need to be visible in the first playable

For first-pass balancing, a 6-person starting settlement can be estimated as:

- 4 adults
- 2 children
- total daily food demand of about `5 Food per day`

### Starting Stockpile Assumptions

Recommended opening stockpile:

- `30 Food`
- `40 Wood`
- `10 Stone`
- `20 Mana`

This should give the player a short recovery buffer without letting them ignore early expansion.

### Starting Population Assumptions

Recommended first-playable opener:

- 1 founding household of 4 people
- 2 tower retainers or servants
- 6 total starting settlers

### Construction Rules

- Buildings consume stockpiled materials when construction begins.
- Builders convert labor into `Build Progress`.
- If no builder is available, construction can still creep forward through general labor, but at strongly reduced speed.
- Repairs use the same system, but should generally complete faster than fresh construction.

### Builder Throughput

- 1 active builder provides `10 Build Progress per day`
- 1 active builder provides `14 Repair Progress per day`
- 1 general laborer standing in for a builder provides `4 Build Progress per day`

### Hauling Assumptions

- 1 hauler can move about `20 resource units per day` across a compact early village
- Roads should increase hauling throughput by about `50%` on connected routes
- Hauling should visibly become a bottleneck once the settlement spreads beyond the first defensive ring

### Durability Assumptions

- Light wooden buildings should be cheap and quick to replace
- Economic damage should matter more through disruption time than through extreme replacement cost
- Stone should buy durability, not just bigger numbers

## Starting Building Numbers: First Pass

The table below gives a practical first-pass specification for the opening economy.

All values are provisional.

| Building | Cost | Workers | Build Progress Required | Output / Capacity | Notes |
| --- | --- | --- | --- | --- | --- |
| `Tower Core` | starts built | 1 tower servant | starts built | `+2 Mana/day`, `40 Mana cap`, `20 general storage` | Emergency baseline mana and protected core storage |
| `House` | `20 Wood`, `5 Stone` | none | `24` | `6 bed capacity` | Cheap enough that rehousing after a bad wave is achievable |
| `Field` | `12 Wood` | 1 farmer | `14` | `24 Food` every `6 days` if intact | Efficient but bursty and vulnerable |
| `Pasture` | `16 Wood` | 1 herder | `16` | supports `6` sheep/goats, each animal contributes `0.5 Food/day` up to `3 Food/day` total | Lower peak efficiency than a healthy field, but steadier, more resilient, and already based on individual animals |
| `Woodcutter Camp` | `14 Wood` | 1 woodcutter | `16` | `8 Wood/day` | Main early expansion material source |
| `Quarry` | `16 Wood`, `6 Stone` | 1 quarry worker | `20` | `5 Stone/day` | Slower strategic material source |
| `Storehouse` | `18 Wood`, `6 Stone` | 1 hauler | `18` | `+120 storage`, plus `+40 protected food storage` | First logistics anchor and food-storage path |
| `Builder's Yard` | `18 Wood`, `8 Stone` | 1-2 builders | `20` | unlocks dedicated builders, repair priority, and construction queueing | Core recovery building |
| `Mana Well Tap` | `12 Wood`, `10 Stone` | 1 mana tender | `22` | `+10 Mana/day`, `+20 Mana cap` | Main mana infrastructure building |
| `Palisade Segment` | `2 Wood` | none | `3` | light barrier segment | Cheap route-shaping defense |
| `Gate` | `8 Wood`, `2 Stone` | none | `10` | controlled opening in palisade | Traffic and chokepoint tool |
| `Road Segment` | `1 Wood` | none | `1` | `+50%` movement and hauling on connected route | Multiplies the rest of the economy |
| `Watchtower` | `12 Wood`, `4 Stone` | 1 lookout | `14` | extended warning and local sight coverage | Optional but strong readability upgrade |
| `Guard Post` | `14 Wood`, `4 Stone` | 1-2 guards | `16` | local defense readiness and rally point | Optional early security building |
| `Mana Reservoir` | `10 Wood`, `12 Stone` | 1 magical maintainer | `18` | `+60 Mana cap` | Buffers mana disruption rather than increasing income |

## Starting Economy Targets

These are the intended early-settlement breakpoints the numbers above should support.

### Basic Food Stability

- A 6-person opening settlement needs about `5 Food/day`
- 1 healthy `Field` averages about `4 Food/day`
- 1 `Pasture` averages about `3 Food/day`

Implication:

- The player should want either `2 Fields`, or `1 Field + 1 Pasture`, before feeling secure
- A single damaged food site should create pressure, but not instant collapse if stores exist

### Material Stability

- 1 `Woodcutter Camp` should be enough to support early roads, housing, and palisade growth
- 1 `Quarry` should be enough for early tower reinforcement and basic stone needs, but not for rapid stone-heavy expansion

### Mana Stability

- `Tower Core` plus `Mana Well Tap` gives about `12 Mana/day`
- This should support normal utility spell use and one or two maintained magical systems in early V1
- Losing the well should be painful, but the player should still have a small emergency reserve through the tower and stored mana

### Rebuild Stability

- 2 active builders should be able to rebuild a destroyed `House` in a little over one in-game day
- 2 active builders should be able to restore several damaged palisade sections in less than a day
- A settlement without dedicated builders should visibly fall behind after one bad wave

## Starting Build Order Targets

A healthy early settlement should plausibly move through this sequence:

1. Add `Woodcutter Camp`
2. Add `Storehouse`
3. Add second food site
4. Add `House`
5. Add first `Palisade` line and `Gate`
6. Add `Builder's Yard`
7. Add `Quarry`
8. Add `Mana Well Tap`
9. Add `Roads` to connect tower, storage, food, and extraction

This is not a mandatory scripted order.
It is the intended shape of the first-playable economy if the player is making broadly healthy choices.

## Production and Consumption by Resource

### Food

Produced by:

- Field
- Pasture

Consumed by:

- all households
- livestock upkeep if simulated directly later
- emergency rationing systems later

### Wood

Produced by:

- Woodcutter Camp

Consumed by:

- House
- Storehouse
- Builder's Yard
- Palisade
- Gate
- Road
- repairs
- some tower and mana infrastructure components

### Stone

Produced by:

- Quarry

Consumed by:

- tower upgrades
- reinforcement work
- advanced storage or magical structures
- future stronger defenses

### Mana

Produced by:

- Tower Core, in a very small amount
- Mana Well Tap or Ley-Line Intake

Consumed by:

- spells
- runes
- magical defenses
- vision tools
- tower-linked magical systems

## Jobs and Labor Categories

V1 job categories should stay simple:

- food work
- hauling
- building and repair
- tower service
- magical maintenance
- defense support
- direct defense
- general labor

Expected early jobs:

- farmer
- herder
- woodcutter
- quarry worker
- hauler
- builder
- repair worker
- lookout
- guard
- mana tender
- general laborer

Design rule:

- Jobs exist as opportunities created by buildings and settlement needs.
- NPCs choose among acceptable jobs through the personality-driven labor market.
- General labor should remain the pressure valve when no specialist role is attractive or available.
- Herding jobs should already be associated with care for individual named animals, even if the care simulation stays light in V1.

## Critical vs Optional Buildings

### Critical in First Playable

- Tower Core
- House
- Field
- Pasture
- Woodcutter Camp
- Quarry
- Storehouse
- Builder's Yard
- Mana Well Tap or Ley-Line Intake
- Palisade
- Gate
- Road

### Optional Early Upgrades

- Watchtower
- Guard Post
- Mana Reservoir

Design rule:

- Critical buildings are required to create a functioning recovery-and-defense loop.
- Optional buildings improve visibility, stability, or resilience, but the village should be able to survive without them for a short time.

## Logistics V1

### Core Direction

- Logistics should matter, but not become a full transport simulation.
- Roads and storehouses should be enough to make settlement layout strategically meaningful.

### V1 Logistics Rules

- Resources should move through a simple hauling model.
- Haulers should prioritize food delivery, construction inputs, and repair inputs.
- Distance should matter enough that layout quality affects recovery speed.
- Roads should reduce travel time and improve throughput.
- A settlement can have resources in stock and still fail if they do not arrive where needed in time.

## Housing and Rebuilding Under Pressure

### Housing

- Housing should be near-mandatory infrastructure.
- Destroyed homes should create immediate displacement pressure.
- Homelessness should harm morale, recovery, and labor stability.

### Rebuilding

- Rebuilding is a core between-wave activity.
- The player should frequently choose between restoring basic function and expanding for the future.
- Builder capacity should be a real bottleneck.
- Replacing a building should be easier than replacing an experienced worker.

### Rehousing Priorities

When housing is lost, the economy should feel pressure through:

- lower morale
- reduced labor effectiveness
- stronger household instability
- increased desertion or refusal of dangerous work later

## Wave Damage and Economic Disruption

Wave damage should disrupt the economy through:

- destroyed homes causing homelessness
- burned or trampled fields reducing food outlook
- damaged pastures reducing resilient food output
- missing, injured, or dead livestock reducing pasture output and forcing recovery effort
- broken roads and gates slowing logistics
- destroyed storage reducing effective reserves
- damaged mana intake reducing magical uptime
- injuries and deaths reducing available skilled labor

The economy should not fail only because resources were deleted.
It should also fail because time, distance, fear, and labor disruption make recovery too slow.

## Early Settlement Progression

### 1. Starting Tower

- Tower Core
- one house
- one field or one small pasture
- one founding household
- a few servants or retainers
- small starting stores of food and wood

Starting jobs:

- farmer or herder
- general laborer
- tower servant

Future hook:

- a possible origin can make the founding household kin to the wizard or witch, creating a privileged but not fully aristocratic family line

### 2. Survival Hamlet

- add wood production
- add storage
- add another dwelling
- expand food production
- place the first short defensive perimeter

### 3. Organized Village

- add quarry
- add builder's yard
- add roads between core sites
- bring stable mana intake online
- establish dedicated hauling and repair labor

### 4. Stable Settlement

- enough food to survive moderate disruption
- enough housing to avoid immediate displacement collapse
- enough labor to repair and still harvest
- enough mana to maintain core magical functions

### 5. Prepared Frontier Village

- intentional choke points
- protected logistics lines
- spare capacity for post-wave recovery
- ability to survive partial crop loss or structural damage

## Key Economic Failure States

`Food shock`

- fields burn or workers die
- visible countdown toward shortage begins
- livestock losses can deepen the shortage even when pasture infrastructure survives

`Housing shock`

- homes are destroyed
- homelessness destabilizes labor and morale

`Repair backlog`

- too few builders or too much damage
- recovery consumes the whole interval between waves

`Logistics failure`

- resources exist but do not reach the right places fast enough

`Mana disruption`

- magical systems lose uptime because intake or storage is damaged

`Skilled-worker loss`

- buildings can be rebuilt, but key economic roles recover too slowly because experienced people died

`Overexpansion`

- too many specialist buildings are built before the settlement can staff and protect them

## Scope Control

Keep these in V1:

- four stockpiled resources
- labor as a pressure, not a stockpile
- one shared visible food pool
- fields and sheep/goat pastures
- simple hauling
- simple mana production and storage
- simple rebuild loop
- building-created jobs through the labor market

Save these for later:

- money and wage systems
- iron, tools, and refined production chains
- per-household visible food accounting
- dedicated granary forecasting UI
- advanced husbandry specialization
- breeding systems and allied monster husbandry
- small livestock systems such as poultry or rabbits
- wool and dairy as fully realized secondary industries
- trade simulation
- decorative mechanical bonuses as a major economy layer

## Open Questions for Next Pass

- exact output and upkeep numbers for each building
- whether livestock deaths in V1 come mostly from direct attack, neglect, flight, or abstract attrition
- whether pasture output should be reduced smoothly per lost animal or by threshold bands for readability
- exact builder and hauler throughput expectations between waves
- exact mana upkeep costs for runes and magical defenses
- exact damage thresholds for economic disruption and rebuilding urgency

## Queued Faction Overlay Work

The shared economy and building baseline now needs faction-specific overlay passes for the locked V1 trio.

Queued follow-up areas:

- Sabine Merrow: `Storehouse`-guided opener, `Bell Post`, and recovery-first civic priorities
- Ash-Hart of the Boundary: `Boundary Shrine`, terrain-sensitive placement bonuses, and distributed edge-site viability
- Aurelian Vale-Sun: `Rune Court`, `Sigil Road` logic, and pattern-supporting district nodes

These should remain overlays on the shared baseline rather than separate economy simulations per faction.
