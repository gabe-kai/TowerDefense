# Monster and Wave Design

Status: Active
Scope: System
Phase: Pre-production
Owner: Design
Source of Truth: Yes

This document defines the first-playable monster and wave model for the tower defense + settlement builder game. It is written to fit the current project assumptions: solo-first, real-time, tower-anchored play, one-hour-ish wave cycles, landscape-aware routing, named NPC settlement losses, and mana geography as a central strategic force.

The goal of V1 is not to simulate every fantasy monster behavior. The goal is to make waves readable, reroutable, thematically distinct, and dangerous to the specific structures and resources the player is trying to protect.

## V1 Design Goals

- Make the first playable easy to read from a tower-centered perspective.
- Give each wave a small number of clear threat roles instead of a huge bestiary.
- Make mana wells and food infrastructure feel like obvious monster objectives.
- Let walls, gates, roads, slopes, and fire matter without requiring overly complex simulation.
- Support early waves that sometimes pass by unless provoked, with later waves becoming more deliberate and hostile.
- Leave clear hooks for later monster lords, rival territories, specialized movement, and smarter strategic enemies.

## Threat Model Summary

V1 uses three escalation bands:

- `Early waves`: animalistic mana-following swarms that mostly damage exposed resources and panic weak settlements.
- `Mid waves`: raiding packs with simple target selection, basic wall interaction, and deliberate attacks on mana, food, and gates.
- `Late waves`: organized warbands plus a boss-scale threat that can force a breach or threaten the mana network directly.

V1 should feel like the player is moving from "surviving a destructive migration" to "surviving a hostile incursion."

The warning ladder can also generate `pre-wave mini-hordes`: mundane animals and lesser displaced creatures fleeing the main threat. These are not the main wave, but they are playable threats that can hit outer food production, livestock, travelers, and isolated villagers before the true horde arrives.

## V1 Monster Families

Before the main monster roster, V1 should include one lightweight warning-threat category that sits between omen and full wave contact.

### 0. Fleeing Animal Mini-Hordes

Folkloric image: deer crashing fences, wolves driven hungry from the woods, boars tearing through fields, crows and vermin descending ahead of the real horror.

Role:

- turn warnings into playable pressure
- make food infrastructure feel exposed before true siege threats appear
- create "the world is already reacting" atmosphere

Core behavior:

- not loyal to the main horde
- motivated by panic, hunger, and displacement rather than mana-seeking
- strongly prioritizes `Food`, livestock, isolated civilians, and undefended edge structures
- usually retreats, disperses, or gets displaced again once the real wave nears

V1 recommendation:

- do not build these as fully separate AI families
- implement them as small event-spawn groups using simplified target logic

Suggested mini-horde variants:

- `Panicked Herd`: tramples fields, fences, and villagers in its path
- `Hungry Predators`: targets livestock, isolated workers, and children caught outside
- `Vermin Surge`: strips grain, roots through store edges, and worsens pre-wave panic

### Mini-Horde Danger Phases

V1 warning-stage fauna should not all use the same lethality model. Split them into three simple danger bands.

`Phase A: Small scavengers and nuisance foragers`

Examples:

- rats
- possums
- crows
- ferrets, stoats, or similar raiders
- other fleeing vermin and opportunistic foragers

Threat profile:

- dangerous to infants, unattended children, chickens, rabbits, and exposed stores
- usually not lethal to healthy adults
- can still create panic, spoil food, spread minor chaos, and force workers off the edge

Primary targets:

- grain and food stores
- coops and hutches
- infants or unattended dependents at the settlement edge

`Phase B: Predators and pack hunters`

Examples:

- wolves
- feral dogs
- large wildcats where appropriate
- scavenger packs driven desperate by the greater horde
- other pack hunters driven inward by the horde

Threat profile:

- dangerous to everyone outside secure defenses
- can kill isolated adults, children, haulers, and herders
- especially punishing to workers on roads, fields, and outer extraction sites

Primary targets:

- livestock
- isolated villagers
- small groups without guard support

`Phase C: Panic beasts and heavy displaced wildlife`

Examples:

- bears
- moose
- aurochs
- boars in a heavy stampede state
- elk, stags, or similar large antlered animals
- any large beast whose panic turns it into a moving collision hazard

Threat profile:

- function more like blunt-force natural disasters than tactical attackers
- may barely notice fences, hedges, or light palisades
- can injure or kill anyone in their path while breaking small structures and trampling crops

Primary targets:

- whatever lies directly along their panic path
- fields
- fences
- gates
- villagers unable to get clear

V1 should ship with four main families plus one boss family. This is enough variety to create recognizable wave patterns without exploding implementation scope.

### 1. Scurry Swarm

Folkloric image: rats, larder-vermin, mana-sick scavengers, locust-like carpet waves.

Role:

- early attrition
- food destruction
- panic and distraction
- settlement-overrun pressure through numbers rather than toughness

Core behavior:

- prefers exposed `Food`, then lightly defended stores, then weak wooden structures
- low courage against concentrated defenders
- may skim a settlement edge and keep moving if nothing attractive is near its route
- spreads through gaps rather than deliberately breaching walls

V1 subtypes:

- `Gnawers`: fast ground swarm that prioritizes fields, storehouses, animals, and corpses
- `Blight Locusts`: slower to damage buildings, faster to ruin fields and pastures

Why they are in V1:

- teach players that food is not safe just because the tower is intact
- support the "early waves may pass by" rule
- create readable warning signs through animal panic and crop blight

### 2. Brute Beasts

Folkloric image: enraged boars, warped aurochs, mana-bloated hounds, horned things driven along the line.

Role:

- wall pressure
- gate smashing
- defender disruption
- force the player to care about chokepoints and line integrity

Core behavior:

- follows the herd path until blocked or baited by defenders
- attacks gates, palisade weak points, and tightly packed defenders
- low strategic intelligence, high momentum
- cares more about access and rage than precise target valuation

V1 subtype:

- `Ramhorns`: heavy ground beast with bonus damage to gates and palisades

Why they are in V1:

- they make walls matter without requiring siege engines
- they create memorable breach moments early
- they pair cleanly with swarms that exploit opened gaps

### 3. Sly Raiders

Folkloric image: scavenger clans, mine-haunters, ash-foot raiders, feral diggers, and other cunning smallfolk or lesser horrors trailing the mana flow.

Role:

- midgame tactical pressure
- infrastructure targeting
- weak-point exploitation
- route reevaluation around defenses

Core behavior:

- prefers `Mana`, then `Food`, then isolated defenders and logistics structures
- seeks gates, unguarded approaches, damaged wall segments, and routes with lower resistance
- will attack blocking defenders if they are the easiest path to a preferred target
- much less likely than beasts or swarms to ignore a nearby settlement

V1 subtypes:

- `Scrap Runners`: fast light raiders that test routes and pull attention
- `Gate-Cutters`: slower raiders with bonus damage against gates and mana infrastructure

Why they are in V1:

- they introduce target priority gameplay
- they make roads, outer buildings, and mana taps tactically meaningful
- they are the bridge from "migration" to "enemy intent"

### 4. Ember Wretches

Folkloric image: ash-skinned raiders, torch-carriers, cinder imps, creatures half drawn to mana and half to ruin.

Role:

- controlled fire pressure
- anti-density punishment
- settlement continuity threat

Core behavior:

- prefers wooden structures near active fighting, storage, or mana hardware
- can ignite buildings, fields, or palisades on hit
- not especially tough, but dangerous if ignored
- tends to appear as support units mixed into mid and late waves rather than alone

V1 subtype:

- `Cinderkin`: light raider that can apply ignition to flammable targets

Why they are in V1:

- the broader project already wants fire to matter
- they create very legible "secondary disaster" pressure
- they punish dense all-wood openings without requiring a full fire simulation overhaul

### 5. Boss Family: Mana-Taken Lords

Folkloric image: a thing that ruled a pool, was displaced, and now drives a migration downline.

Role:

- wave identity anchor
- final target pressure
- mana-well interaction
- late-wave climax

Core behavior:

- strongly attracted to `Mana Wells`, `Ley-Line Intakes`, reservoirs, and tower-linked magical systems
- less interested in random houses unless obstructed or enraged
- acts as a route magnet for nearby lesser monsters
- can temporarily intensify or corrupt mana near itself

V1 boss variants:

- `Wellmaw`: heavy ground boss that drains or disrupts mana structures during melee attacks
- `Horned Exile`: brute-lord that leads beast-heavy waves and specializes in breaches

V1 recommendation:

- ship with only `Wellmaw` for the first playable
- keep `Horned Exile` as a later content extension or optional second boss if production goes unusually smoothly

## Threat Roles

The first playable roster should cover these roles:

- `Scouts and skirmishers`: Scrap Runners
- `Swarm attrition`: Gnawers, Blight Locusts
- `Line breakers`: Ramhorns
- `Objective raiders`: Gate-Cutters
- `Fire spreaders`: Cinderkin
- `Boss pressure`: Wellmaw

This gives V1 six concrete monster types if both swarm variants are included:

- Gnawers
- Blight Locusts
- Ramhorns
- Scrap Runners
- Gate-Cutters
- Cinderkin
- Wellmaw

If production needs a leaner cut, combine `Gnawers` and `Blight Locusts` into one generic `Scurry Swarm` and delay `Gate-Cutters` until a first post-playable update.

## Escalation Pattern

### Early Waves

Primary feel:

- destructive migration
- low intelligence
- partial settlement avoidance still possible

Typical makeup:

- mostly Scurry Swarm
- occasional Ramhorn
- no fire units
- no deliberate mana sabotage yet

Player lesson:

- protect food and exposed production
- build a first perimeter
- understand that not every wave is trying to siege the tower itself

### Mid Waves

Primary feel:

- opportunistic raiding
- pressure on weak points and infrastructure

Typical makeup:

- mixed swarms plus raiders
- 1-3 breach-capable units
- first Cinderkin appearances in small numbers

Player lesson:

- walls need gates, guard coverage, and repair capacity
- outer mana and food infrastructure are high-risk targets
- route-shaping matters because enemies are choosing among options now

### Late Waves

Primary feel:

- hostile incursion
- multi-role assault
- boss-led objective pressure

Typical makeup:

- raider core
- swarm support
- brute breach units
- optional fire support
- one boss or boss-equivalent anchor

Player lesson:

- the player is no longer only surviving contact
- they are managing layered threats and preserving infrastructure continuity under pressure

## Wave Composition Model

V1 should use a simple point-budget system with a wave template and one intelligence tier. Avoid a fully procedural ecology sim in the first playable.

Each wave is defined by:

- `Entry edge`
- `Projected exit edge`
- `Primary family`
- `Support family`
- `Wave intelligence tier`
- `Budget`
- `Objective bias`
- `Boss flag`

### Intelligence Tiers

Use only three in V1:

- `Tier 1 Animalistic`
- `Tier 2 Cunning`
- `Tier 3 Directed`

Tier effects:

- how likely the wave is to divert into a settlement
- how strongly it values mana and food targets
- how often it reevaluates route choice
- whether it prefers gates over random wall sections

### Objective Biases

Use only four in V1:

- `Passing Hunger`: mostly continue along route, attack exposed food if convenient
- `Breach`: prioritize easiest way through blocking defenses
- `Plunder`: divert toward food and storage
- `Mana Hunger`: divert toward mana structures and magical systems

Add one warning-stage-only bias:

- `Displaced Hunger`: mini-hordes prioritize food, livestock, and vulnerable people rather than mana

### Example Composition Rules

Early wave:

- `Animalistic`
- `Passing Hunger`
- 70-90% Scurry Swarm
- 10-30% Ramhorn

Mid wave:

- `Cunning`
- `Plunder` or `Mana Hunger`
- 40-60% Raiders
- 20-40% Swarm
- 10-20% Brutes
- 0-10% Fire support

Late wave:

- `Directed`
- `Mana Hunger` or `Breach`
- 35-50% Raiders
- 20-30% Brutes
- 10-20% Swarm
- 5-10% Fire support
- 1 boss if flagged

## Target Priorities by Monster Type

V1 should use a small target-tag system rather than bespoke logic for every unit.

Suggested target tags:

- `Mana`
- `Food`
- `Gate`
- `Wall`
- `Defender`
- `Housing`
- `Storehouse`
- `Fire-Prone`
- `Path Blocker`

### Priority Tables

`Gnawers`

- Food
- Storehouse
- Fire-Prone
- Housing
- ignore walls unless already inside or blocked in tight space

`Blight Locusts`

- Food
- Fields
- Pastures
- Fire-Prone

`Ramhorns`

- Gate
- Wall
- Defender
- Path Blocker

`Scrap Runners`

- Mana
- Food
- Gate
- isolated Defender

`Gate-Cutters`

- Gate
- Mana
- Storehouse
- Defender

`Cinderkin`

- Fire-Prone
- Storehouse
- Mana
- Housing

`Wellmaw`

- Mana
- Gate
- Tower-linked magical systems
- Defender if blocking mana access

`Warning Mini-Hordes`

- Food
- livestock and pastures
- isolated villager
- field-edge housing or fences

Additional lethality rule:

- nuisance foragers should rarely threaten healthy adults directly
- predators and pack hunters can target isolated adults
- panic beasts damage by pathing through obstacles rather than making deliberate kill choices

## Environment Interaction Rules

These rules should stay explicit and limited in V1.

### Walls

- Walls are delay and shaping tools, not absolute denial.
- Animalistic swarms avoid intact walls when alternate routes exist.
- Brutes attack the nearest gate or weakest blocking segment.
- Raiders prefer gates, damaged sections, or unguarded edges before random wall attacks.
- Bosses can force a breach if the preferred mana target is inside.

### Gates

- Gates have high attraction for all intelligent land units.
- Open gates count as strong route invitations.
- Closed gates are still preferred breach points because they are legible structural weaknesses.

### Terrain

- Slopes, trenches, roads, forests, and choke width modify route desirability.
- Roads increase monster speed as well as defender logistics if monsters gain access to them.
- Forest and rough ground slow most land monsters.
- Simple trenches hinder ground units but do not fully stop them.

### Fire

- Fire should be a status and spread risk, not a fully granular fluid simulation in V1.
- Only Cinderkin and burning structures intentionally create new fires.
- Wooden walls, houses, fields, and storehouses are vulnerable.
- Stone structures resist spread strongly.
- Monsters do not avoid fire intelligently in V1 unless later design demands it.

### Mana

- Mana structures emit a strong attraction score.
- Active mana use during a wave can slightly increase attraction for `Cunning` and `Directed` waves.
- Damaging a mana intake should reduce throughput first and only later destroy it fully.
- Boss monsters can apply `mana disruption` as a temporary status, reducing output or disabling attached magical systems for a short time.

## Settlement Notice and Diversion

V1 needs a clear model for when a wave notices and diverts toward a settlement.

Use a single `Attraction Score` per nearby settlement.

Settlement attraction sources:

- visible `Mana` infrastructure
- visible `Food` infrastructure
- proximity to current path
- active defenders attacking the wave
- open or obvious route access such as roads and gates
- recent magical activity

Settlement attraction reducers:

- route detour cost
- intact walls with no obvious gate access
- low intelligence tier
- no visible high-value targets near the route

### V1 Diversion Rule

A wave checks diversion:

- when it first comes within notice range of a settlement
- after failing a breach attempt
- after a major terrain change blocks its path
- after a boss enters notice range of a mana structure

Recommendation:

- do not recompute every few seconds for every unit
- recompute at group-level event triggers only

This keeps pathing legible and cheaper to implement.

### Early-Wave Pass-By Rule

Only `Animalistic` waves with `Passing Hunger` should frequently pass by.

They still divert if:

- a field, pasture, or storehouse sits close to their current route
- defenders attack them heavily
- a mana well is effectively on their path

## Warning Sign Model

V1 warning should communicate both `wave family` and `wave seriousness`.

Use five warning stages:

1. `Omen`
2. `Sign`
3. `Refugees`
4. `Survivors or scouts`
5. `Main body sighted`

### By Wave Type

`Fleeing Animal Mini-Horde`

- Omen: ordinary wildlife grows restless and starts moving against usual patterns
- Sign: damaged fences, hoofprints, droppings, half-eaten carcasses, livestock panic
- Refugees: herders, foragers, field hands, and children sprinting back from the edge
- Survivors or scouts: mauled workers or shaken hunters report what is being driven ahead of the main wave
- Main body sighted: this stage usually transitions into signs of the actual monster horde behind them rather than a formal military-style sighting

`Scurry Swarm`

- Omen: birds lift suddenly, dogs bark, livestock become agitated
- Sign: gnawed carcasses, trampled undergrowth, first vermin clusters
- Refugees: isolated farmers or charcoal burners fleeing crop loss
- Survivors or scouts: wagon with spoiled grain, ranger reports moving ground
- Main body sighted: dark carpet or churning bands crossing field lines

`Brute Beast`

- Omen: distant tremors, herd panic, broken tree lines
- Sign: gouged bark, crushed brush, abandoned carts on roads
- Refugees: herders and road crews fleeing impacts
- Survivors or scouts: wounded militia or outriders reporting heavy beasts
- Main body sighted: horned mass pushing through terrain in a broad wedge

`Sly Raider`

- Omen: missing tools, disturbed camps, fires seen at distance
- Sign: traps found sprung, skirmish dead, cut messenger lines
- Refugees: traders, migrants, or stripped survivors arriving in groups
- Survivors or scouts: disciplined retreaters, tower runners, local guard remnants
- Main body sighted: raiding bands with visible route discipline

`Ember Wretch`

- Omen: soot in the air, orange glow at night, ash-fall on roofs
- Sign: isolated brush fires and burned livestock
- Refugees: smoke-choked villagers, burned teamsters, collapsing field camps
- Survivors or scouts: blackened fighters warning of torch-bearing raiders
- Main body sighted: scattered flame points moving with the horde

`Boss-led Mana Hunger`

- Omen: mana flicker, rune instability, cold or pressure around the tower
- Sign: ley-line shimmer, strange glow at the well, familiars or animals refusing approach
- Refugees: escaped apprentices, retainers from a failed tower, drained survivors
- Survivors or scouts: wounded mage or guard captain describing the lord
- Main body sighted: lesser monsters clustering around a visible focal monster or corrupted mana wake

## Civilian Exposure Model

V1 needs a small, legible model for who is at risk during warning-stage threats and early wave contact. This should be simple enough to support named NPC consequences without requiring full individual stealth or combat simulation.

### Civilian States

Use six practical exposure states in V1:

- `Sheltered`
- `Outdoor Work`
- `Traveling`
- `Evacuating`
- `Guarded Edge`
- `Overrun`

These are not personality states. They are short-term physical-risk states that determine how warning threats interact with civilians.

### 1. Sheltered

Meaning:

- inside a house, tower, storehouse, or other secure structure
- not currently exposed on a path or open worksite

Risk profile:

- low risk from small scavengers and predators
- moderate risk from fire, structural collapse, or a full breach
- very low direct casualty chance during warning-stage mini-hordes

Typical occupants:

- infants
- small children
- non-working dependents
- adults ordered indoors

Gameplay use:

- the default safe state the player wants for vulnerable villagers during strong warnings

### 2. Outdoor Work

Meaning:

- actively working fields, pastures, woodcutting sites, quarries, roads, or mana infrastructure
- has a job focus and delayed reaction time compared with already-alert units

Risk profile:

- moderate risk from small scavengers if vulnerable dependents or small livestock are nearby
- high risk from predators if isolated
- high risk from panic beasts due to trampling and route collision

Typical occupants:

- farmers
- herders
- woodcutters
- quarry workers
- mana tenders

Gameplay use:

- the player should often be choosing when to pull workers off valuable production before warning signs become contact

### 3. Traveling

Meaning:

- moving between home, work, storehouse, gate, tower, or another structure
- exposed on roads or open ground

Risk profile:

- higher risk than Outdoor Work because the civilian may be away from both shelter and coworkers
- especially vulnerable to wolves and route-crossing panic beasts
- children or haulers in this state are major danger cases

Typical occupants:

- haulers
- messengers
- workers changing jobs
- family members relocating during alarm

Gameplay use:

- roads improve logistics but also create predictable interception routes if civilians are still outside

### 4. Evacuating

Meaning:

- actively responding to alarm by moving toward shelter or an inner line
- no longer trying to complete normal work

Risk profile:

- safer than Traveling if the route is short and clear
- dangerous if evacuation paths cross fields, gates, or likely breach zones
- children and dependents should prefer this state early when possible

Typical occupants:

- recalled workers
- household members moving indoors
- dependents being led inside

Gameplay use:

- this is the main warning-response state and should be strongly influenced by route design and settlement layout

### 5. Guarded Edge

Meaning:

- near defenders, guard posts, walls, or a watched approach
- still outside full shelter, but under meaningful protection

Risk profile:

- low to moderate risk from predators and small scavengers
- still vulnerable to panic beasts and full monster contact
- much safer than unguarded Outdoor Work

Typical occupants:

- workers close to a guard post
- herders near a defended pasture
- civilians clustered near a watched gate during partial alarm

Gameplay use:

- lets the settlement feel protected by good layout, not just by hiding everyone indoors instantly

### 6. Overrun

Meaning:

- path to safety is cut off, enemies are already in the area, or the local defense line has collapsed

Risk profile:

- severe for everyone
- small scavengers can now threaten adults through swarming and panic
- predators and raiders can kill freely
- infants, children, and injured villagers are at extreme risk

Typical occupants:

- trapped workers
- civilians in breached outer housing
- people caught beyond a broken gate or burning line

Gameplay use:

- this state marks the real social cost of failed preparation and should drive casualties, disappearances, panic, and grief events

### Vulnerability Rules by Threat Band

`Phase A: Small scavengers`

- strongly prefer exposed food, coops, hutches, and unprotected infants
- almost never attack healthy adults in `Sheltered` or `Guarded Edge`
- can injure or kill infants, unattended children, and tiny livestock in `Outdoor Work`, `Traveling`, or `Overrun`
- mostly cause spoilage, panic, and loss of small animals rather than adult fatalities

`Phase B: Predators and pack hunters`

- target livestock and isolated civilians first
- dangerous to adults in `Outdoor Work`, `Traveling`, and `Evacuating`
- less willing to enter dense defended space unless already committed
- can cause direct named-NPC deaths in warning stages

`Phase C: Panic beasts and heavy displaced wildlife`

- do not need strong target selection
- collide with anyone in `Outdoor Work`, `Traveling`, `Evacuating`, or `Guarded Edge` if they share the path
- can break light barriers and injure sheltered people only if they physically smash into the structure or trigger a breach

### Household and Age Rules

V1 does not need many special-case civilian classes. Use a few broad modifiers:

- `Infants and toddlers`: cannot self-evacuate and depend on shelter or adult handling
- `Children`: can move but are slower, more panic-prone, and more vulnerable if outside
- `Healthy adults`: baseline survivability
- `Injured adults`: reduced escape and high casualty risk when exposed

Recommendation:

- infants should default to `Sheltered` unless a catastrophe displaces them
- children should move to `Evacuating` quickly under warning
- most adult warning-stage deaths should come from predators, panic beasts, or being caught `Overrun`, not from rats

### Livestock and Small Animal Rules

Animals are an important part of warning readability and pre-wave loss.

- `Small penned animals`: highly vulnerable to nuisance foragers and predators
- `Herd animals`: vulnerable to predators, panic, and stampede disruption
- `Draft animals`: mostly threatened by predators or panic-beast collisions

This helps warning waves matter economically before major structural combat begins.

### V1 Alarm Behavior Recommendation

When warning level rises, civilian behavior should simplify into broad defaults:

- vulnerable dependents move toward `Sheltered`
- outer workers shift from `Outdoor Work` to `Evacuating`
- workers near defenses can remain in `Guarded Edge` if warning severity is still low
- any civilian cut off by enemies becomes `Overrun`

This gives the player meaningful outcomes from settlement layout, warning time, and guard coverage without requiring micromanagement.

## Boss and Mana-Well Rules

V1 boss design should reinforce the mana-geography premise.

### Boss Origin Model

- A mana well or pool off-map becomes unstable or changes hands.
- A dominant creature is displaced.
- The displaced lord drives lesser monsters downline along the ley route.
- The incoming wave is therefore partly migration and partly conquest.

This aligns with the user's current worldbuilding idea and gives waves a believable source.

### Wellmaw V1 Behavior

- Moves as a heavy ground unit
- prefers the shortest viable route to the nearest significant mana structure in the defended area
- emits a mana-hunger aura that raises attraction to mana targets for nearby allies
- melee attacks on mana structures apply temporary disruption before destruction
- if unable to reach mana quickly, it switches to gate and wall destruction

### Mana-Well Interaction Effects

When Wellmaw reaches a mana structure, it can:

- reduce mana income for a short duration
- disable attached runes or magical defenses briefly
- create a local corruption patch that encourages lesser monsters to linger

Keep these effects temporary and readable in V1. Do not add permanent map corruption yet.

## Movement Types

V1 should support only the movement types that materially improve the first playable.

### Essential in V1

- `Ground`: yes
- `Siege-like breach` as a unit behavior on ground monsters: yes
- `Simple civilian-targeting panic behavior` for warning mini-hordes: yes

### Postpone for Later

- `Climbing`: later
- `Flying`: later
- `Tunneling`: later
- `Swimming`: later unless water routing is already a strong map feature
- `True artillery siege engines`: later

Reason:

- ground-only with breach variants is enough to validate walling, gates, terrain shaping, mana targeting, and settlement diversion
- extra locomotion types multiply pathfinding, readability, and defense requirements too early

## Essential Behaviors for V1

These behaviors are worth building now:

- route from entry to exit across real terrain
- event-based settlement diversion
- target preference by monster type
- gate preference for intelligent units
- wall-breaking by specific units
- simple fire application and spread risk
- mana-targeting and temporary mana disruption
- warning stages that vary by wave family
- boss-led wave identity

## Behaviors to Postpone

These are exciting, but should not be required for the first playable:

- monster-on-monster territorial simulation on the live map
- full ecology of independent roaming hordes between waves
- stealth or concealment of mana sources
- advanced swimming, climbing, flying, or tunneling path classes
- complex commander auras or squad formations
- morale systems for monsters
- permanent corrupted terrain from bosses
- waves coordinating multi-pronged attacks on one settlement
- monsters stealing and carrying resources away as physical loot objects

## Scope Risks

These are the main ways the monster system can sprawl too early:

- too many locomotion types before ground routing is solid
- too many unique monster exceptions instead of a reusable target-tag system
- continuous path recomputation that becomes unreadable and expensive
- overly deep fire simulation before basic breach-and-burn pressure is fun
- trying to build the full monster-lord territorial metagame before the core wave loop works

## Recommended First-Playable Implementation Order

1. Ground pathing with entry-to-exit waves
2. Settlement attraction and diversion checks
3. Warning mini-hordes plus Scurry Swarm and Ramhorn waves
4. Basic warning-stage presentation
5. Raider family with gate and mana targeting
6. Fire support units
7. Wellmaw boss and temporary mana disruption

## Open Questions for Next Pass

These are the highest-value decisions still worth locking down:

1. Should `Food` and `Mana` always be the top two attraction tags globally, or should each wave template be allowed to invert them sometimes?
2. How visible should the wave's `projected exit edge` be to the player before later warning stages?
3. Should `fire` in V1 be extinguished automatically by villagers over time, or only by explicit defensive infrastructure and commands?

## Queued Faction Overlay Work

The shared wave model now needs faction-specific readability and interaction passes for the locked V1 trio and the next planned future faction.

Queued follow-up areas:

- Sabine Merrow: warning-stage readability, `Bell Post` readiness effects, and protective fallback cadence
- Ash-Hart of the Boundary: redirected routes, sacred edges, and terrain-sensitive warning anchors
- Aurelian Vale-Sun: pattern-breakage readability, district-center threat value, and attacks that disrupt aligned infrastructure without requiring bespoke monster AI
- Orren Voss: pressure against factory districts, depots, construct uptime, and specialist machine crews
