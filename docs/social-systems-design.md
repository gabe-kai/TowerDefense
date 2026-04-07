# Social Systems Design Document

Status: Active
Scope: System
Phase: Pre-production
Owner: Design
Source of Truth: Yes

This document defines the first-playable social simulation for the tower defense + settlement builder game. It expands on the main game design document and serves as the primary reference for NPC identity, households, labor behavior, morale, loyalty, grief, immigration, and desertion.

## Purpose

The social model should make villagers feel like people rather than labor tokens. Every villager is named and persistent. Households matter. Skilled losses hurt. Children are visible and vulnerable. Harsh commands can work, but they leave marks.

This first-playable document is intended to support:

- named NPCs with distinct capabilities and temperaments
- households, family ties, grief, and long-term memory of loss
- personality-driven job choice
- morale and loyalty as separate but related systems
- drafting civilians into defense as a viable but costly choice
- immigration and desertion driven by settlement conditions
- tension between loyalty to family, village, tower, and master

This version should avoid:

- excessive hidden simulation
- dozens of overlapping stats
- untrackable social webs
- systems that are too expensive to read or tune in real time

## Social Pillars

The V1 social simulation is built on five pillars:

- `Identity`: every NPC is a named person with a household, history, and role in the settlement
- `Household`: the household is the main unit of survival, grief, burden, and attachment
- `Temperament`: personality affects job choice, courage, obedience, social resilience, and care for others
- `Condition`: morale, loyalty, stress, fear, and grief shape what people actually do
- `Legitimacy`: the tower can command, but authority must be maintained through protection, fairness, and results

Cross-system note for later integration:

- naming important settlement sites, roads, and landmarks should eventually improve civic legibility, report clarity, and response effectiveness

## NPC Data Model

Every NPC in the first playable is named and persistent.

### Identity Fields

Each NPC has:

- `Name`
- `Age`
- `Age class`: child, youth, adult, elder
- `Origin`: tower-born, village-born, migrant, retainer, refugee, rescued outsider
- `Household ID`
- `Role tag`: villager, apprentice, servant, guard, artisan, laborer, dependent, retainer
- `Status`: active, wounded, bedridden, drafted, missing, dead

### Core Attributes

Each NPC has three broad attributes:

- `Body`: physical labor, carrying, endurance, injury resilience
- `Mind`: learning, planning, complex work, ritual tasks
- `Nerve`: panic resistance, tolerance for danger, ability to function under threat

Suggested range:

- `1-5`

### Skill Ratings

Use a small, readable skill list:

- `Farming`
- `Hauling`
- `Building`
- `Crafting`
- `Tending`
- `Guard`
- `Lore`
- `Leadership`

Suggested range:

- `0-5`

### Condition Fields

Each NPC tracks:

- `Health`
- `Injury`
- `Fatigue`
- `Hunger`
- `Morale`
- `Loyalty`
- `Fear`
- `Stress`
- `Grief`
- `Belonging`

### Social Importance

Each NPC also has an internal `Importance` score used by AI and event weighting. This is based on:

- rarity of skills
- household role
- dependents
- leadership function
- closeness to many others

This makes the death of a master mason, widow, militia sergeant, or beloved midwife more socially consequential than the loss of an isolated novice laborer.

## Personality Trait Model

V1 uses five stable personality traits plus lighter preference hooks.

### Stable Traits

Each trait ranges from `-2 to +2`.

- `Bravery`: avoids danger vs faces it
- `Diligence`: industrious vs idle or evasive
- `Sociability`: communal vs solitary
- `Obedience`: compliant vs defiant
- `Tenderness`: nurturing vs hard-hearted

These are permanent or slow-changing traits.

### Preferences

Each NPC has:

- `Work likes`: up to 2
- `Work dislikes`: up to 2
- `Value preference`: one primary orientation
  - safety
  - fairness
  - status
  - family
  - piety
  - freedom
  - service

These give distinct texture without requiring a large ideology model.

### Trait Effects

Traits affect:

- job market preferences
- willingness to accept dangerous work
- social recovery after losses
- reaction to command style
- likelihood of volunteering or refusing draft
- spread of panic or confidence through the village

## Household and Family Model

The household is the primary social unit in V1.

### Household Definition

A household contains:

- adult members
- children
- elders
- dependents
- dwelling assignment
- pooled domestic condition

Each household tracks:

- `Food security`
- `Bed adequacy`
- `Shelter quality`
- `Safety`
- `Burden`
- `Bereavement`
- `Reputation`
- `Absent members`

Food-security notes for V1:

- Households can share one visible settlement food pool at first.
- Individual households and NPCs should still support different appetite values under the hood for future expansion.
- Rationing can later interact with appetite, burden, morale, and vulnerability without requiring a separate food-type simulation in the first playable.

Households are more important than bloodline alone because they determine daily living conditions and survival pressure.

### Family Relationships

Track a limited bond graph with the following types:

- spouse or partner
- parent-child
- sibling
- kin
- close friend
- rival
- protector-dependent

Each bond has:

- `Closeness`
- `Trust`
- `Strain`

This is enough for grief, job choices, conflicts, migration clustering, and loyalty pressure.

### Children

Children are visible on-map NPCs with risk.

Children:

- belong to households
- occupy space and can be endangered
- may flee, hide, freeze, or follow caretakers in danger
- generate strong emotional responses if harmed or killed
- increase household burden and labor pressure
- matter heavily for drafting and desertion logic

Children are not full workers in V1, but older youth may later become apprentices or trainees.

### Family Line

Track:

- parent links
- current household
- birth household
- children list

This is enough for persistent family lines and future growth without requiring inheritance law or dynastic simulation in V1.

## Core Emotional and Social States

V1 uses six key social states.

### Morale

`Morale` is the NPC's willingness and energy to keep functioning.

High morale improves:

- work output
- learning speed
- resilience
- social warmth

Low morale increases:

- slowdown
- complaints
- hesitation
- emotional contagion
- refusal risk

### Loyalty

`Loyalty` is the NPC's acceptance of tower authority.

This is the most important political-social state in the first playable.

Important distinction:

- the player cares primarily about loyalty to the `Tower Institution`
- NPCs naturally prioritize `Household` and `Village`
- loyalty to the `Master Person` may emerge and can become politically unstable if it rivals institutional loyalty

V1 should track internal loyalty weights to:

- `Household`
- `Village`
- `Tower`
- `Master`

Only some of this needs to be exposed directly to the player.

### Fear

`Fear` is immediate danger response.

It spikes during:

- wave attacks
- nearby deaths
- breaches
- fire
- monsters near homes or children

Fear drives:

- panic
- hesitation
- fleeing
- freezing
- bunching near protectors

### Stress

`Stress` is accumulated pressure from:

- overwork
- poor living conditions
- command burden
- hunger
- repeated danger
- unresolved grief

Stress is the main long-burn breakdown meter.

### Grief

`Grief` is loss carried over time.

Grief comes from:

- death of kin
- death of household members
- child death
- horrific witnessed deaths
- disappearance of loved ones
- destruction of home

Grief reduces work focus and changes social behavior. It can heal somewhat through time, rites, safety, and care, but traumatic grief can linger.

### Belonging

`Belonging` measures how rooted the NPC feels in this place.

High belonging reduces desertion and improves recovery.
Low belonging makes migrants and isolated villagers more likely to leave or detach.

## Loyalty Structure

This is a key differentiator of the game's social model.

### Four Loyalty Targets

NPCs internally distribute attachment across:

- `Household`
- `Village`
- `Tower`
- `Master`

The normal expected order for most common villagers is:

1. household
2. village
3. tower
4. master

Retainers, apprentices, and officials may weight tower or master more heavily.

### Political Tension

This system creates useful tension:

- loyalty to household can conflict with draft orders
- loyalty to village can support sacrifice for common defense
- loyalty to tower supports obedience to the institution
- loyalty to master personally can bypass or distort institutional norms

For the player, high loyalty to the tower is stable.
High loyalty to the master alone is powerful but dangerous, because it can weaken institutional trust and create factional behavior.

### V1 Implementation

For first playable:

- track one visible `Loyalty` score for obedience to tower authority
- track hidden affinity weights for household, village, tower, master
- use those hidden weights in command response, desertion, and grievance logic

## Morale Model V1

### Positive Inputs

Morale rises through:

- enough food
- secure shelter
- recent rest
- safety of children
- successful defense
- visible preparation
- fair work assignment
- being thanked, honored, or rewarded
- burial rites and mourning rites
- trust that losses had meaning

### Negative Inputs

Morale falls through:

- hunger
- exposure
- overwork
- injury
- nearby death
- forced draft
- ignored grief
- destroyed homes
- repeated monster breaches
- unfair burden
- seeing civilians treated as expendable

### Thresholds

- `75-100`: hopeful
- `50-74`: stable
- `25-49`: strained
- `0-24`: breaking

### Effects

Morale affects:

- work speed
- training speed
- recovery rate
- social contagion
- tolerance for hard orders
- defense readiness

## Grief and Trauma Model V1

### Grief Events

When a death or major loss occurs, apply grief to:

- close kin
- household members
- close friends
- witnesses
- community if the victim was prominent

### Grief Severity

Severity depends on:

- relationship closeness
- whether death was witnessed
- whether body was recovered
- whether the victim was a child
- whether the death seemed preventable
- whether the death followed an explicit command

### Child Death

Child death should be socially severe.

Effects:

- intense grief for household
- morale hit to nearby families
- loyalty loss if the child died due to negligence, reckless defense, or failed evacuation
- stronger long-tail trauma in caregivers and witnesses

This is a major tone-setting system and should be treated with care.

### Resolution and Ritual

Grief decays slowly.
Trauma decays much more slowly.

Recovery is helped by:

- burial or memorial rites
- safe recovery periods
- time with household
- reduced workload
- meaningful communal recognition
- not repeating the same preventable tragedy

This is a strong folkloric fit.

## Labor Behavior and Job Market V1

NPCs choose work through a personality-influenced labor market.

### Job Scoring

Each NPC periodically scores available jobs:

`Job Score = Skill Fit + Preference Fit + Household Need + Safety Tolerance + Command Pressure + Social Influence`

### Inputs

- `Skill Fit`: am I good at this?
- `Preference Fit`: do I like this work?
- `Household Need`: do we need food, income, or immediate stability?
- `Safety Tolerance`: will I risk injury?
- `Command Pressure`: how strongly is the tower asking?
- `Social Influence`: are trusted peers or leaders doing this?

### Behavioral Rules

- NPCs choose among top acceptable jobs, not always the mathematically best one
- high-obedience NPCs respond more to command pressure
- high-bravery NPCs accept dangerous work more readily
- high-tenderness NPCs drift toward tending, rescue, caregiving, and food security
- low-morale or high-grief NPCs may avoid dangerous or cognitively demanding jobs
- desperate households accept lower-preference work

### V1 Job Categories

Suggested initial job groups:

- food work
- hauling
- building and repair
- crafting
- tending and caregiving
- tower service
- defense support
- direct defense

This is enough to make the village feel alive without too many assignment edge cases.

## Drafting Civilians Into Defense

Drafting is temporary coercive conversion from civilian labor into defense labor.

### Draft Eligibility

An NPC's willingness to draft depends on:

- bravery
- obedience
- tower loyalty
- current morale
- current grief
- injury
- whether they are sole caregiver
- dependents in household
- prior training
- whether recent draft losses were seen as fair

### Draft Responses

When drafted, an NPC can:

- volunteer
- comply
- comply resentfully
- evade
- refuse
- flee

### When Drafting Works

Drafting is viable in V1. It should not be a trap choice.

It works best when:

- danger is obvious and immediate
- village solidarity is high
- children and homes are being protected
- the tower has recently acted competently
- draft burden is shared fairly
- trained defenders are present to anchor civilians

### Social Cost of Drafting

Drafting should always create social risk:

- labor loss in other sectors
- fatigue and stress after battle
- morale damage for unwilling civilians
- loyalty loss if casualties feel wasteful
- increased household instability

The point is not to forbid coercion. The point is to make coercion historically legible and socially costly.

## Master Commands and Legitimacy

The player is the eye of the tower. The tower's commands are powerful, but authority must be maintained.

### Command Evaluation

Each command should be evaluated socially by:

- urgency
- danger
- fairness
- who bears the cost
- whether children and households are protected
- whether elites are exempt
- whether the tower itself is visibly sharing risk

NPCs forgive hardship more easily than contempt.

### Suggested Command Stances

Commands can lean toward one of four stances:

- `Protective`
- `Pragmatic`
- `Severe`
- `Sacrificial`

These are not moral labels. They are social signals.

### Consequence Pattern

- protective commands build stable legitimacy but may reduce short-term efficiency
- pragmatic commands are broadly sustainable
- severe commands increase compliance in crisis but build resentment
- sacrificial commands can save the tower in emergencies while corroding trust, belonging, and future willingness

### Master vs Tower

If people obey because they trust the office of the tower, the settlement is stable.
If people obey only because they love or fear the current master, the settlement is unstable and succession-fragile.

That distinction should matter later, even if V1 only lightly exposes it.

## Immigration Model V1

Immigration is primarily a function of perceived prosperity and safety, secondarily a function of regional collapse.

### Pull Factors

Immigration rises when the settlement is seen as:

- fed
- defended
- orderly
- fair
- economically active
- capable of sheltering newcomers
- respectful in its treatment of common people

### Push Factors

Immigration also rises when nearby places are:

- raided
- starving
- politically broken
- abandoned
- fallen to monsters
- stripped by harsh lords or failed towers

This creates a morally interesting dynamic where prosperity and neighboring catastrophe both feed population growth.

### Migrant Types

Suggested V1 migrant groups:

- lone laborers
- displaced households
- skilled refugees
- retainers from fallen towers
- orphans or rescued dependents

### Social Effects

Migrants start with lower belonging and uncertain loyalty.
They may cluster socially at first.
They become stable over time if:

- housed
- fed
- integrated into work
- protected from abuse
- allowed to form or join households

## Desertion Model V1

Desertion is not common at baseline, but becomes plausible under repeated strain.

### Desertion Pressure

Pressure rises through:

- low tower loyalty
- low belonging
- hunger
- household danger
- repeated forced drafts
- preventable deaths
- unpaid sacrifice
- perception that the tower protects itself before the village
- collapse of trust after child deaths or unrecovered dead

### Desertion Forms

- individual slips away
- household departs together
- migrant returns to old networks
- specialist leaves after one loss too many
- passive desertion: still present, but refuses dangerous work

Household-level desertion should be especially meaningful.

### Anti-Desertion Factors

People stay when:

- kin are rooted here
- they believe the tower can still protect them
- the village still feels like home
- dead are honored
- burdens are shared
- there is visible rebuilding after losses

## First-Playable NPC Update Logic

To keep this practical, V1 should run on simple periodic evaluations instead of continuous full-sim reasoning.

### Suggested Cadence

Update at different rhythms:

- `immediate`: fear, panic, hazard response
- `short interval`: job choice, work behavior, social movement
- `wave-end or daily`: morale, stress, grief, belonging, loyalty adjustments
- `event-driven`: deaths, births, marriage, migration, promotions, household split

### Mental Model

Most social state changes should come from:

- current living conditions
- recent commands
- recent battle outcomes
- household condition
- major losses

That keeps the model readable and tunable.

## Scope Control for First Playable

Keep these in V1:

- all villagers named and persistent
- visible children
- household-based needs
- one shared visible food pool with hidden appetite variation hooks
- 5 personality traits
- 8 skills
- 6 social states
- drafting, immigration, desertion
- grief from death and major loss
- split loyalty targets internally

Save these for later:

- food forecasting UI unlocked through a dedicated granary path
- visible per-household food accounting
- advanced livestock management and breeding systems
- romance simulation
- inheritance law
- complex religion or faction doctrine
- crime and punishment systems
- personality drift across decades
- social class politics beyond a few tags
- elaborate master-court intrigue

## Practical V1 Recommendations

For first implementation, recommend:

- 30-60 persistent villagers
- 6-10 households
- 6-8 visible children at once
- 8 job skills
- 5 traits
- 4 visible social summaries per NPC:
  - morale
  - loyalty
  - grief
  - current burden
- hidden household and loyalty detail used under the hood

That should feel rich without collapsing under data complexity.

## Follow-On Documents

The next implementation-facing documents should likely be:

1. `docs/data/npc-schema-and-value-ranges.md`
2. `Morale, loyalty, and grief formulas`
3. `Drafting, immigration, and desertion rules`
4. `Example households and sample villagers`

Status note:

- `docs/data/npc-schema-and-value-ranges.md` now exists as the current implementation-facing companion for milestone-1 NPC fields, defaults, and value ranges

## Queued Faction Overlay Work

The core social model now needs faction-specific overlay passes for the locked V1 trio and the next planned future faction.

Queued follow-up areas:

- Sabine Merrow: civic legitimacy, fairness visibility, and trust recovery through shelter and orderly rebuilding
- Ash-Hart of the Boundary: beastkin territorial belonging, taboo spaces, and social response to place offense or boundary neglect
- Aurelian Vale-Sun: Asteri ceremonial order, district dignity, and cohesion from visible composure and symbolic completion
- Orren Voss: social consequences of replacing live labor with constructs, specialist dependency, and village unease around mechanization
