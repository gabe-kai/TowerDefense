# Tower Defense Game Design Document

Status: Active
Scope: Whole Project
Phase: Pre-production
Owner: Design
Source of Truth: Yes

## Working Title

**Untitled Spirit Tower Defense**

This document is the living design foundation for the project. It starts by capturing the current concept clearly, then grows into a full game design document as systems, scope, tone, and production goals become more concrete.

Detailed subsystem specs should live in focused side documents under `docs/`, while this main GDD remains the concise source for pillars, overall direction, and cross-system relationships.

Documentation standards for this project are defined in `docs/documentation-policy.md`.
Major design changes and scope locks should be recorded in `docs/decision-log.md`.

## High Concept

A multiplayer or solo settlement-defense game where each player is a bound spirit inhabiting a wizard's tower. Players do not directly control the wizard or witch who owns the tower. Instead, they act as an overseeing supernatural steward responsible for growing the tower, managing the surrounding village, shaping defenses, and surviving monster waves that cut across a shared 3D landscape.

Each match takes place on a single shared map containing several player tower sites and limited natural resources. Monster waves enter from one side of the map and attempt to cross toward an exit point on the opposite side, destroying what lies in their path. Because wave routes can pass nearer to some settlements than others, players naturally experience uneven pressure, creating opportunities for cooperation, opportunism, sacrifice, and betrayal.

## Core Fantasy

The player fantasy is:

- Be the unseen spirit intelligence behind a magical stronghold.
- Grow a lonely tower into a thriving fortified village.
- Protect mortal workers and villagers while serving a demanding master.
- Shape terrain and defenses to redirect or survive devastating monster migrations.
- See farther and command more effectively by growing the tower upward instead of controlling a free-roaming god camera.
- Navigate political and emotional pressure from the wizard, workforce, and villagers while still trying to win.

## Pillars

These pillars should guide all future design choices.

### 1. Tower-Centered Perspective

The player's viewpoint is anchored to their tower rather than freely floating across the whole map. Height matters because taller towers increase visibility and strategic awareness.

### 2. Shared-Map Pressure

All players exist on the same map and compete or cooperate for land, resources, and survivability. A wave threatening one settlement can become another player's problem a minute later.

### 3. Living Settlement Defense

Defense is not just about towers and traps. The player is building a real settlement with labor, morale, production, social consequences, and damage to homes and livelihoods.

### 4. Personality-Driven Stewardship

The resident wizard or witch is a defined character with personal priorities, aesthetic identity, and social influence. The player's spirit must work around them rather than simply command everything without friction.

### 5. Physical World Simulation

Terrain, slope, obstacles, line of sight, and construction all matter in a believable 3D space. Movement and pathing should feel grounded in the landscape rather than abstracted onto a flat grid.

## Genre and Structure

- Primary genre: Tower defense + settlement builder
- Secondary genre: Light colony sim / social management
- Perspective: Tower-anchored 3D strategic view
- Planned release order:
- Solo-first
- Competitive multiplayer second
- Cooperative multiplayer later
- Match structure: Continuous real-time play built around recurring wave cycles and recovery periods rather than hard stage breaks

## Current Design Decisions

These are no longer just assumptions. They are the current working direction for the project.

- The first serious target is solo play.
- Competitive multiplayer should come after solo because it is structurally simpler than co-op.
- Cooperative multiplayer should arrive later because it needs additional rule systems to prevent one player from sacrificing themselves only to hand victory to another.
- A wave cycle should be planned around roughly one hour of play.
- The game should feel continuous between waves, with repair, mourning, rebuilding, staffing, and preparation blending directly into the next threat.
- The game remains fully real-time during play. Pausing is allowed for settings and photo mode, but not for construction or command menus.
- Every structure is player-placed.
- Informal footpaths should emerge automatically from repeated NPC travel.
- Formal roads should be player-built and provide stronger movement benefits.
- Tower height should be one of the player's highest long-term priorities.
- Vision should come from tower height plus supernatural extensions such as bound spirits, anchored spells, powered runes, and eventually familiars.
- Masters are authored personalities, not procedurally generated.
- NPCs should be named individuals with skills, desires, fears, relationships, family lines, and long-term development.
- The detailed first-playable social model is defined in `docs/social-systems-design.md`.
- Early economy should stay relatively simple.
- Food, housing, morale, and safety should function close to hard requirements.
- Tone should be folkloric.

## Player Role

The player is a bound spirit attached to a tower. They are effectively a supernatural estate steward and battlefield overseer.

Important implications:

- The player is powerful, but not omnipotent.
- The player's presence is location-bound to the tower.
- Perception and authority expand as the tower is upgraded.
- Interaction with the world is mediated through construction, commands, influence, spells, and systems rather than direct avatar movement.

## Narrative Premise

Each tower belongs to a wizard or witch whose ambitions brought them to this dangerous land. Rather than personally managing defense and logistics, they rely on a bound spirit to do the tedious work of organizing labor, growing the settlement, and preventing disaster.

The master is not absent. They have preferences, moods, demands, and vanity. They may pressure the player to prioritize magical research, tower ornamentation, rare reagents, prestige projects, or reckless experiments, even when the settlement desperately needs food, walls, or repairs.

This creates a constant tension:

- What keeps the settlement alive?
- What keeps the master satisfied?
- What keeps the workers and villagers loyal?

## Game Loop

### Macro Loop

1. Survey the surrounding land from the tower.
2. Gather resources and establish village infrastructure.
3. Expand the tower and settlement footprint.
4. Build defenses and alter terrain.
5. React to the master's demands and social pressures.
6. Prepare for incoming monster waves.
7. Survive destruction, rebuild, and adapt.
8. Outperform or outlast other settlements, or cooperate to survive together.

### Wave Loop

1. A wave origin and destination are determined off-map.
2. Players receive warning signs and partial intelligence that become clearer over time.
3. Players reposition labor, defenses, and magical effects.
4. The wave enters and follows a landscape-aware route toward its exit.
5. Nearby settlements draw aggro if they are close enough to be noticed.
6. The wave damages structures, kills units, consumes resources, and may break through defenses.
7. Survivors recover, repair, redistribute resources, and plan for the next threat.

### Continuous Cycle Structure

The game should not feel like it stops between rounds. Instead, each wave cycle flows through distinct but uninterrupted phases:

1. Recovery from the previous wave.
2. Burial, treatment, repair, rehousing, and labor reshuffling.
3. Resource gathering and construction.
4. Response to master commands and settlement tensions.
5. Escalating omens that reveal the next wave's likely route.
6. Final emergency preparation as the wave becomes imminent.
7. Impact, breakthrough, survival, and aftermath.

This supports a world that feels alive rather than level-based.

## Core Systems

## 1. Shared Map and Settlement Placement

Each player begins at a predefined starting site on a common map.

Design goals:

- Starting positions should be asymmetrical enough to create unique strengths and weaknesses.
- No player should have a guaranteed "safe" position across all wave paths.
- Resource clusters should create both cooperation and tension.
- Terrain should strongly influence development style.

Questions to resolve:

- Are starting sites fixed by map design or selected during match setup?
- Should maps support 2, 3, 4, or more players?
- Should solo mode use AI rivals, allied NPC towers, or only the player?

## 2. Tower Growth and Camera Design

The tower is both the symbolic heart of the settlement and the anchor point for the player's perspective.

The detailed first-playable specification for this area now lives in `docs/camera-controls-and-visibility-spec.md`. This section should stay high-level and summarize how camera, visibility, and command constraints connect to the rest of the game.

Current concept:

- Camera rotation and pitch are player-controlled.
- Camera location is anchored to the tower.
- Tower upgrades increase camera elevation and view distance.
- The player does not freely move a god camera across the world.
- The tower should be one of the main long-term progression investments.

Confirmed direction:

- Higher tower tiers should unlock more than view distance.
- Tower height should likely affect command reach, warning time, spell projection, prestige, and access to advanced spirit abilities.
- Height should be structurally limited by tower width and reinforcement.
- Past certain thresholds, players must widen or reinforce the tower before going taller.
- Taller upgrades should require rarer resources and more skilled labor.
- Weather, darkness, smoke, fog, forests, and hills could affect visibility.
- Remote awareness should come from spirit-bound locations, anchored spells, powered runes, or familiars rather than ordinary watchtowers alone.
- Strategic placement should use a top-down survey map rather than the live tower camera.

Vision layers:

- Tower sight: baseline vision from tower elevation.
- Spirit anchors: static spirit placements that extend the player's vision envelope.
- Spell anchors: temporary magical sight projected into remote areas.
- Rune anchors: likely expensive or permanent vision extensions tied to structures or terrain.
- Familiar vision: later-game free-form scouting through an animal or magical companion.
- Human watchtowers: NPC guards can observe threats and warn the player, but do not automatically grant full player vision.
- Strategic map: an abstracted top-down planning layer built from places that friendly characters have personally visited and survived to report.

Vision and information rules:

- Occlusion should matter even when the player has a high vantage point.
- If the player is viewing from the top of a two-story tower over a one-story wall, they may still be unable to see the ground immediately outside the wall while being able to see farther beyond it.
- Guards and lookouts posted on walls or towers should be able to detect nearby threats hidden from the player by angle and cover.
- The player should receive alerts and orientation prompts from those observers without automatically receiving full visual information.
- Example: the player may see archers or pikemen responding at the front gate while only receiving a report that an enraged aurochs is attacking there.
- Alerts should support quick camera pivot or focus toward the disturbance even if line of sight remains blocked.

Research-based vision unlocks:

- Vision tools should unlock through research plus tower and spirit progression.
- Spells should cost mana, last for a duration, and provide short-term tactical sight tools.
- One spell should allow directional sight through structures for as long as the spell lasts, with extra mana increasing duration or depth.
- One spell should create a temporary second camera anchor at a chosen location and allow camera switching.
- One spell should temporarily scaffold or elevate the tower viewpoint for emergency awareness.
- Runes should require a physical location and continuous mana upkeep.
- Vision-passthrough runes should allow on-demand sight through marked structures.
- Awareness runes should function like magical alarm systems and report nearby hostile presence.
- Bound spirits should unlock later and serve as permanent supernatural minions assigned to fixed duties or locations.
- Guard-duty bound spirits should support a smart free-floating local camera inside a limited area.
- Bound spirits are especially useful at places where structures are impractical, such as narrow canyons or bridges.
- Familiar spirits should unlock later and provide a single mobile controllable camera.
- Most masters should restrict the player to one familiar unless a specific faction breaks that rule.

Strategic map rules:

- Building placement, area spell targeting, and rune construction should default to a top-down strategic map view.
- The strategic map should be assembled by survey rather than granted omniscience.
- Any allied character who reaches an area and returns alive should contribute that terrain and layout to the map.
- The map should update whenever any friendly character sees into fog-of-war territory.
- This gives the player practical planning tools while preserving the tower-anchored live view for moment-to-moment presence.

Remaining detailed questions for this area should now live in `docs/camera-controls-and-visibility-spec.md` rather than being expanded further here.

## 3. Resource Economy

The settlement needs a straightforward but expressive economy.

The detailed first-playable specification for this area now lives in `docs/economy-buildings-design.md`. This section should stay high-level and summarize how the economy connects to the rest of the game.

Agreed V1 economy direction:

- Keep the stockpiled resource model intentionally small.
- Treat labor, housing, storage, and safety as operational pressures rather than item stacks.
- Let food become the first resource with meaningful forecasting depth.
- Treat mana as dependable settlement infrastructure rather than a highly volatile luxury bottleneck.

Economic goals:

- Basic needs support survival and construction.
- Advanced resources support magical upgrades and specialized defenses.
- Resource scarcity on a shared map should create diplomacy, conflict, and trade pressure.
- The economy should be deep enough to support planning, but not so complex that wave defense loses urgency.

Current direction:

- Start simple with basic resources.
- Keep the first version understandable before layering in deep supply chains.
- Workers should behave like participants in a job market rather than mindless assignables.
- NPCs should prefer jobs they want, even when those jobs are not the ones they are best at.
- A general labor role should exist as a fallback and pressure valve.
- Housing, food, morale, and safety should be severe constraints, close to hard requirements rather than soft bonuses.

V1 stockpiled resources:

- Food
- Wood
- Stone
- Mana

V1 operational pressures and capacities:

- Labor availability
- Housing capacity
- Storage capacity
- Safety

Food direction for V1:

- Use one shared food pool at first.
- Different NPCs and households should still be able to carry different appetite values under the hood for later expansion.
- The player should eventually be able to forecast food burn, harvest timing, and time-to-shortage through a dedicated food-storage path.
- This forecasting should be helpful but not the primary play activity in the first playable.

Mana direction for V1:

- Mana should feel reliable if the settlement is built near an appropriate source.
- The tower should provide a tiny baseline mana trickle.
- The main mana supply should come from mana wells or ley-line intake structures.
- Mana storage should buffer disruption rather than serve as the main source of scarcity.
- The early mana gameplay question should usually be whether the network stays protected, not whether any mana exists at all.

Likely later additions:

- Money or trade value
- Iron
- Luxuries
- Rare reagents
- Refined goods

Settlement failure cascade should include:

- Destroyed housing causing homelessness
- Homelessness increasing sickness and unrest
- Food shortages causing starvation and flight
- Fear and grief reducing stability, productivity, and loyalty
- Migration toward safer settlements when things become unsustainable
- Logistics drag preventing needed materials or food from reaching repair and defense sites in time
- Mana disruption knocking out spells, runes, or magical defenses at the worst possible moment

NPC job market model:

- Jobs should exist as opportunities in the settlement rather than as hard assignments to empty slots.
- NPCs should evaluate the best available role they can currently find.
- Job choice should be influenced by skill, preference, temperament, family circumstance, and current settlement needs.
- Early settlements may begin with only a few meaningful roles such as farmer and general laborer.
- As new structures such as lumber mills or blacksmiths are built, the village must grow or adapt enough to supply willing workers.
- If nobody wants a specialist role, someone may still take it, but with reduced effectiveness or mounting dissatisfaction.
- NPC goals and contentedness should be changeable over time in response to age, success, trauma, relationships, prestige, and training.
- Different NPCs should weight job factors differently according to personality.
- Some NPCs may prioritize family stability, some money, some prestige, some safety, and some personal calling.
- Negative traits such as laziness, alcoholism, cowardice, or resentment should be able to distort job choice and performance.

Morale and efficiency:

- Morale should affect performance across a broad scale rather than at a narrow breakpoint.
- Miserable people can still work, but with worse quality, slower growth, lower loyalty, and greater long-term risk.

Skill growth model:

- Any NPC should be able to take any available role.
- Long-term effectiveness should be shaped by experience plus innate traits and aptitudes.
- A naturally gifted worker should be able to outpace an average worker with equal time invested.
- A poorly suited worker should still improve, but with lower ceilings or slower gains.

## 4. Buildings and Settlement Development

The village should feel like a living extension of the tower, not just a ring of damage-absorbing structures.

Current direction:

- Every structure is manually placed by the player.
- Desire paths should form automatically where NPC traffic is frequent.
- Built roads should provide superior travel speed and clearer logistics planning.
- Decorative construction should matter enough that even non-creative players have incentives to use it.
- Highly creative players should be rewarded with enough placement flexibility to create memorable settlements.
- Building themes should be able to apply structure-by-structure at extra cost.

Early building categories:

- Housing
- Food production
- Storage
- Resource extraction
- Workshops
- Roads and logistics
- Military structures
- Magical support structures
- Civic or morale structures

Minimum viable first-playable building roster:

Critical infrastructure:

- Tower core
- House
- Field
- Pasture
- Woodcutter camp
- Quarry
- Storehouse
- Builder's yard
- Mana well tap or ley-line intake
- Palisade
- Gate
- Road

Early optional expansions:

- Watchtower
- Guard post
- Mana reservoir

Storage and food-management path:

- The storehouse should handle general storage in the first playable.
- Food storage should begin as part of the storehouse path rather than as a separate building line.
- When that path later splits into a dedicated granary, that is where the deeper food-consumption and forecasting tools should unlock.

Food production direction:

- Fields should be the staple, efficient, and vulnerable food source.
- Pastures should start with sheep and goats.
- Sheep and goats should be more resilient than fields but slower and more land-hungry.
- Later livestock candidates can include cows, pigs, horses, llamas, camels, and other field-linked domestics.
- Small livestock such as poultry and rabbits should be evaluated later instead of entering the first playable by default.

First settlement progression target:

1. Starting tower
2. Survival hamlet
3. Organized village
4. Stable settlement
5. Prepared frontier village

Starting tower:

- One tower housing the master and a few servant spaces
- One family home
- One field or one small pasture
- A founding family supplying the first civilian workforce
- Small starting stores of food and wood
- Starting jobs such as farmer and general laborer

Survival hamlet:

- Add wood production, storage, and a second dwelling
- Expand food supply
- Build the first short defensive perimeter around key households and the tower

Organized village:

- Add quarry, builder's yard, and roads
- Bring the first stable mana intake online
- Create dedicated hauling and repair capacity so recovery does not consume all food labor

Stable settlement:

- Maintain enough food and housing to survive moderate damage
- Keep spare labor for repairs and emergency defense
- Keep enough mana income or storage to sustain core spells and tower systems

Prepared frontier village:

- Support deliberate choke points and protected logistics routes
- Survive partial crop loss or structural damage without immediate collapse
- Recover between waves without halting all growth

Early military building candidates:

- Walls
- Gates
- Watchtowers
- Archer towers
- Ballistae or siege emplacements
- Trap networks
- Barracks or guard posts

Tower upgrade candidates:

- Height expansion
- Width expansion
- Reinforcement upgrades
- Magical chambers
- Observation enhancements
- Defensive enchantments
- Spellcasting nodes
- Storage and command capacity
- Living quarters and prestige spaces

## 5. Wave Routing and Monster Behavior

This is one of the most defining systems in the concept.

The detailed first-playable specification for this area now lives in `docs/monster-wave-design.md`. This section should stay high-level and summarize how waves pressure the settlement, economy, and social model.

Current wave behavior:

- Monsters spawn from a random off-map entry point.
- They attempt to reach a random or system-selected off-map exit point on the opposite side.
- They destroy obstacles in their path.
- They may divert toward a settlement if it lies near enough to their route to attract attention.

Current direction:

- The precise route should begin hidden and become more legible as the wave approaches.
- Early signs can include fleeing wildlife, refugees, routed soldiers, smoke, sound, and reports from survivors.
- Wave diversion and rerouting should be a core mechanic, not a side feature.
- Monsters should react intelligently to terrain and defenses according to their level of intelligence.
- Battle control should stay broad and preplanned rather than becoming a tactical micromanagement game.

Desired gameplay outcome:

- One player often absorbs the first impact.
- The same wave can continue through multiple settlements.
- Defensive preparation is partly local and partly strategic for the entire map.
- Players can potentially manipulate routes, intentionally or unintentionally.

Routing principles:

- Walls should encourage monsters to seek gates, weak points, climbable points, or breach opportunities rather than stopping them absolutely.
- Moats, pits, slopes, barriers, and terrain edits should meaningfully change movement speed and route desirability.
- Major engineering plays, such as blasting a route through a mountain and triggering a landslide, should be valid strategies.
- Monster path choice should be able to update dynamically after terrain changes or failed shortcut attempts.

Target attraction rules:

- Monster priorities should vary by species and by current wave intelligence.
- Mana sources should usually rank as the highest-value target class.
- Food should usually rank close behind mana.
- Structures or defenders blocking access to those resources should often become temporary rage targets.
- A horde should be able to divert long enough to remove resistance, then resume pursuit of its preferred objective.

Mana geography:

- Ley lines should function like rivers of mana running through the landscape.
- Waves should naturally tend to follow ley lines.
- Mana wells or mana pools along ley lines should be major strategic sites.
- Boss monsters may spawn from these wells or pools.
- Wizards are naturally incentivized to build near them.
- Clusters of nearby mana wells should create unusually valuable settlement sites.
- Hidden or underground mana crystal veins should exist separately from exposed ley-line features.
- Prospecting, scouting, or magic should be able to reveal mineable mana crystal deposits.
- Settlements should be able to establish mines to extract crystalized mana.
- Concealment mechanics should eventually allow players to hide or disguise valuable mana sources from monsters and rivals.

Wave intelligence progression:

- Early waves: animalistic swarms such as rats or locusts that mostly consume exposed resources and spread damage.
- Mid waves: semi-intelligent raiders that begin targeting defenders, weak points, and infrastructure.
- Late waves: highly intelligent leaders or monster lords that should feel closer to facing another strategic opponent.

Settlement avoidance behavior:

- Some of the earliest and least intelligent waves should be capable of passing by a settlement almost entirely if pathing and circumstance happen to keep them away from it.
- This should be uncommon luck rather than a reliable safety strategy.
- As wave intelligence rises, monsters should become less likely to ignore nearby opportunities or threats.

Warning escalation model:

- Warning signs should vary by wave type rather than using one generic sequence.
- At the broadest level, warning should escalate from small wildlife movement, to larger animal flight, to small monsters and first refugees, to organized survivors and military remnants, and finally to the main body of the wave.
- Late warning stages may include routed soldiers, disciplined retreaters, final defenders, or escaped mages from off-map towers.

Remaining detailed questions for this area should now live in `docs/monster-wave-design.md` rather than being expanded further here.

## 6. 3D Terrain, Movement, and Pathfinding

The landscape is intended to be physically meaningful.

Current desired behavior:

- Units move in a real 3D environment.
- Speed changes based on terrain type and slope.
- Obstacles influence route selection.
- Buildings, fences, walls, trees, pits, and earthworks affect movement.

Design implications:

- Chokepoints emerge from natural geography as well as player construction.
- Verticality and grade become part of defense planning.
- Terrain readability becomes critically important.
- Pathfinding performance could become a major technical challenge.

Questions to resolve:

- How granular should terrain deformation be?
- Which objects are traversable, destructible, or blocking?
- How much simulation realism is worth the complexity cost?

## 7. Terrain Modification

Players should be able to reshape the battlefield through magic and labor.

Candidate terrain actions:

- Dig trenches or pits
- Raise berms or embankments
- Flatten land for construction
- Clear trees or boulders
- Build roads
- Erect fences and barricades
- Cast temporary terrain-altering spells

Design goals:

- Terrain editing should feel powerful but not break waves completely.
- It should support both civilian development and military engineering.
- Different masters may flavor the available terrain tools differently.

Current direction:

- Terrain reshaping is one of the core strategic tools of the game.
- Both mundane engineering and magic should be valid approaches.
- Permanent edits should exist, especially for roads, excavations, embankments, and settlement shaping.
- Temporary magical edits should also exist for emergency defense and scouting.
- Terrain modification should influence speed, line of travel, visibility, and viability of chokepoints.
- Fire should be a realistic but simplified settlement hazard.

Examples of intended play:

- Digging a moat to slow a horde.
- Filling a moat with hazards or magical creatures to amplify the delay.
- Cutting a pass through terrain to tempt pathing into a killzone.
- Triggering a landslide to close or reshape a route mid-wave.

Fire behavior:

- Fire should threaten structures, supplies, and settlement continuity more than it serves as a fine tactical weapon.
- It should spread to nearby burnable targets within a proximity radius.
- Wind direction and speed should distort that spread radius into an oval rather than a perfect circle.
- Fire management should reward spacing, materials, and settlement planning.

## 8. Social Relationships

A major differentiator for the game is that the player is managing people and personalities, not just structures.

The detailed first-playable specification for this area now lives in `docs/social-systems-design.md`. This section should stay high-level and summarize how the social model connects to the rest of the game.

Current relationship axes:

- Relationship with your master
- Relationship with the workforce
- Relationship with the villagers

These should affect behavior, not just score.

Possible outcomes:

- A pleased master grants stronger magic, more leniency, or unique upgrades.
- An angry master issues disruptive demands, withholds power, or sabotages priorities.
- Loyal workers build faster and complain less.
- Unhappy workers strike, desert, steal, or ignore dangerous assignments.
- Happy villagers attract migrants, boost output, and endure hardship better.
- Unhappy villagers panic, flee, or generate social instability.

Current direction:

- These are not abstract faceless groups. They are built out of named individuals and their social reality.
- Villagers and workers should have skills, ambitions, fears, relationships, and family ties.
- Every villager should be named and persistent.
- They should pursue preferred jobs when possible rather than always following optimal assignment logic.
- They should gain skills over time and become more valuable through lived experience.
- They should marry, have children, age, and create generational continuity in the village.
- Children should exist visibly in the settlement and be at real risk during crisis.
- They should suffer emotionally from death, danger, displacement, and hardship.
- They should be draftable for defense in emergencies.

High-level first-playable social direction:

- The household is the primary social unit for needs, grief, burden, and belonging.
- Core NPC personality should be modeled through a small stable trait set plus job and value preferences.
- Core social state should include morale, loyalty, fear, stress, grief, and belonging.
- NPCs should naturally prioritize household and village attachments over abstract obedience.
- The player's core political challenge is to build loyalty to the tower institution, not just to a specific master.
- Loyalty to the master personally can be useful in the short term but socially destabilizing if it displaces loyalty to the tower.
- Forced drafting should be morally gray and historically legible: viable in crisis, but socially costly.
- Immigration should be driven primarily by perceived prosperity and safety, and secondarily by collapse in nearby settlements.

Design consequence:

- Losing infrastructure hurts.
- Losing a highly developed person hurts more.
- A blacksmith with years of acquired skill is more devastating to lose than the forge building itself.
- Refugees and migrants can join the settlement with preexisting traits, trauma, and uneven usefulness.
- Children raised in the village can grow into especially valuable long-term specialists shaped by the settlement's values and opportunities.
- Child deaths should have severe emotional and political consequences for households and the wider village.

Example starting settlement model:

- One tower housing the master and a few servant spaces
- One family home
- One field or one small sheep/goat pasture
- A founding family supplying the first civilian workforce
- Starting jobs such as farmer and general laborer
- Children aging into the village labor market over time
- New professions emerging as the settlement adds specialist structures
- A future optional origin can make the founding family kin to the wizard or witch, creating a socially privileged but not fully aristocratic household

## 9. Master Personality System

Each wizard or witch should meaningfully change the feel of a run or faction.

Possible variation dimensions:

- Architecture style
- Spell list
- Economic bonuses
- Temperament
- Favorite projects
- Tolerance for civilian suffering
- Preferred defenses
- Workforce culture
- Villager culture and aesthetics

Examples:

- An austere geomancer who values stoneworks, order, and fortification.
- A vain enchanter obsessed with tower grandeur and magical ornamentation.
- A swamp witch who favors herbalism, curses, and asymmetrical village layouts.
- A reclusive necromancer who tolerates misery but rewards ruthless efficiency.

This system could become the main faction identity layer.

Current direction:

- Masters should be handcrafted personalities, not procedural combinations.
- Each master should meaningfully alter difficulty, priorities, architecture, and settlement playstyle.
- The master should function as part of the game's difficulty tuning, not just its flavor.
- Some masters should be supportive or well-balanced and effectively easier to serve.
- Others should be selfish, erratic, harsh, or architecturally demanding.
- Masters should issue explicit commands and quests, with varying urgency, stakes, and consequences.

Examples implied by current direction:

- Lady Sabine Merrow, a human frontier magistrate who creates a comparatively forgiving baseline through civic order, social legitimacy, and strong recovery.
- Ash-Hart of the Boundary, a beastkin boundary-sage whose worldview and faction logic revolve around terrain management, sacred thresholds, and distributed anchor sites.
- Aurelian Vale-Sun, an Asteri high enchanter whose settlement becomes a recursive rune through ceremonial roads, district planning, and magical geometry.
- Magister Orren Voss, a later construct-industrial master who replaces vulnerable labor with golems, war-frames, and machine infrastructure.

First playable master recommendation:

- The first playable master is Lady Sabine Merrow.
- Sabine should serve as the easy-mode baseline through civic order, social stability, warning, shelter, and recovery.
- The locked V1 training trio is:
  - `Civic Order`: Sabine Merrow
  - `Terrain Management`: Ash-Hart of the Boundary
  - `Rune Construction`: Aurelian Vale-Sun
- These three factions should teach the first core ways a player can think about settlement survival before later factions broaden the roster further.

Command system implications:

- Some commands should be optional but rewarding.
- Some commands should be urgent and politically risky to ignore.
- Some commands may conflict directly with settlement survival.
- Success and failure states should vary by command rather than using a single pass-fail template.
- A starting cadence target is one major command and one minor request per wave cycle.
- The player should be allowed to fully ignore commands and accept the consequences.

Examples of command types:

- Protection command: do not let a key structure be destroyed
- Production command: increase mana output before the next wave
- Prestige command: complete a decorative or architectural milestone
- Social command: favor, protect, or employ a specific person or group
- Experimental command: gather ingredients, test a spell, or build a risky apparatus

Failure and fulfillment philosophy:

- Different orders should have different success criteria.
- Different orders should have different negotiation space.
- Failure consequences should scale with the severity and nature of the order.
- Some failures may weaken the master's help in the next cycle.
- Some failures may create political fallout or even game-ending consequences.

## 10. Cooperation and Competition

The shared-map design supports multiple social dynamics.

Current direction:

- The overall release path should be solo first, then competitive multiplayer, then cooperative multiplayer.
- Competitive mode is a better second step because it needs less asymmetric referee logic than co-op.
- Combat control should stay closer to tower defense than to a battlefield tactics simulator.

Cooperative possibilities:

- Shared defense pacts
- Resource trade
- Supporting outer settlements to protect the whole map
- Coordinated terrain shaping
- Temporary shelter for refugees

Competitive possibilities:

- Hoarding scarce resources
- Diverting waves toward rivals
- Refusing aid
- Outscoring others through efficiency and prestige
- Politically exploiting survivors, migrants, or trade leverage

Open questions:

- Is PvP direct, indirect, optional, or mode-specific?
- Can players attack each other outside of wave manipulation?
- What defines victory in co-op versus competitive modes?

## Win, Loss, and Scoring

Early possibilities:

### Loss Conditions

- Core tower destroyed
- Master killed or abandons the tower
- Settlement collapses beyond recovery
- In multiplayer elimination, one player's tower is destroyed

### Victory Conditions

- Survive a target number of waves
- Score highest by the end of a match
- Complete a major magical objective
- Be the last surviving tower
- Cooperative survival of all or at least one allied tower

### Score Dimensions

- Settlement prosperity
- Defensive success
- Tower growth
- Master satisfaction
- Workforce satisfaction
- Villager satisfaction
- Wave damage prevented
- Prestige or magical progress

## Tone and Presentation

Current tonal direction:

- Folkloric fantasy
- Masters can range from lovable and eccentric to dreadful and dangerous
- Villagers and workers should feel human, socially grounded, and worth mourning
- Tension should exist between beauty, superstition, ambition, and survival
- Decorative expression should matter both aesthetically and mechanically

Decorative direction:

- Heraldic and symbolic decoration should be an early focus.
- Statues, banners, crests, sigils, and related classical heraldic elements should have gameplay value.
- The decorative system should remain flexible so it can evolve into something more original than a standard beauty-score layer.
- Themed building variants should provide a small stacking contentedness benefit at additional construction cost.
- Statues should provide area-based bonuses that vary by statue type.
- Heraldic decoration should improve loyalty and military effectiveness by reinforcing faction identity and cohesion.

Visual goals suggested by the concept:

- Towers should be iconic silhouettes and progression markers.
- Each master's architecture should make their settlement instantly recognizable.
- Terrain should be readable enough for defense planning from a constrained perspective.
- Monster waves should feel like a devastating moving natural disaster.
- Villages should be expressive enough to reflect how the player builds and values them.
- Settlement layout should strongly affect crowd flow, evacuation, defense response, and panic behavior.
- Fire spread should be a real threat influenced by spacing, building materials, and wind.

## Combat and Orders

The game should not demand detailed unit micro in the style of a large-scale tactics game.

Current direction:

- Defenses should mostly be prepared before the wave arrives through layout, staffing, guard assignments, and machine crews.
- During a wave, the player should issue broad commands rather than fine movement orders.
- Example commands include defending a wall section, prioritizing a gate, or falling back to a secondary line.
- The feel should remain much closer to tower defense observation and intervention than to direct battlefield command.
- The player should be able to issue broad military orders into unseen spaces based on alerts and reports.

## Technical and Design Risks

These are likely the biggest early project risks.

### 1. Camera Readability

An anchored tower camera is fresh and thematic, but it may make city-building and threat readability harder than a standard god-view.

### 2. Pathfinding Complexity

True 3D movement, terrain slopes, destructible obstacles, and dynamic routing across a shared map may be expensive and difficult to keep understandable.

### 3. Uneven Wave Pressure

It is a strength of the concept, but if one player consistently takes disproportionate damage without enough counterplay, it may feel unfair.

### 4. System Overload

Settlement sim, tower defense, faction personality, social management, and terrain manipulation can combine into a project that is too broad too early.

### 5. Multiplayer Scope

Balancing solo, co-op, and competitive play from the beginning may slow development significantly.

## Proposed Design Direction for Pre-Production

The project has now answered much of the early concept-stage work. Before implementation begins in earnest, the main remaining pre-production tasks are:

1. Lock the MVP scope and first implementation milestone.
2. Convert the current support docs into prototype-facing data and rules specs.
3. Decide the first prototype order across camera/readability, wave pressure, economy loop, and social consequence.
4. Confirm which faction-specific overlays ship in the first playable baseline versus later V1 expansion.
5. Resolve the remaining cross-doc rule questions that still affect multiple systems.

## Initial MVP Recommendation

This is a suggested first playable target for the first implementation milestone, not the full intended V1 faction roster.

- One playable map
- Solo play first
- One initial master personality: Lady Sabine Merrow
- One settlement
- Tower-anchored camera with upgrade-based height increases
- Basic economy: `Food`, `Wood`, `Stone`, `Mana`
- Critical economy and defense baseline: `Tower Core`, `House`, `Field`, `Pasture`, `Woodcutter Camp`, `Quarry`, `Storehouse`, `Builder's Yard`, `Mana Well Tap`, `Palisade`, `Gate`, `Road`
- Optional early support structures: `Watchtower`, `Guard Post`, `Mana Reservoir`
- Limited terrain interaction: tree clearing, road placement, simple trench or barricade construction
- Limited first-playable monster roster from `docs/monster-wave-design.md`, including early swarms, mid-tier raiders and brutes, and one initial boss family
- Implementation-facing companion for that roster: `docs/data/wave-data-sheet.md`
- Implementation-facing companion for first-playable NPCs and social-state tuning: `docs/data/npc-schema-and-value-ranges.md`
- Wave routing from off-map entry to off-map exit with settlement aggro, warning escalation, and limited rerouting rules
- Relationship system backed by named NPCs, but with an intentionally limited v1 behavioral model

Planned V1 faction expansion after the first playable baseline:

- Ash-Hart of the Boundary as the `Terrain Management` training faction
- Aurelian Vale-Sun as the `Rune Construction` training faction

Later faction currently in active concept development but not part of the locked first V1 training trio:

- Magister Orren Voss as a construct-industrial faction focused on golem labor, machine defense, and factory districts

This would test the strongest original ideas before taking on full multiplayer complexity.

## Remaining Cross-System Questions

Most detailed design questions now belong in the support docs. The highest-value unresolved questions that still cut across multiple systems are:

1. How should fire suppression work in the first playable: passive villager response, explicit commands, dedicated infrastructure, or some mix?
2. How visible should projected wave exit paths and later warning-stage routing become before direct contact?
3. How often should wave target priorities invert or vary by template, especially around `Food` versus `Mana` pressure?
4. How much faction-specific UI surfacing should exist in the first playable versus keeping the player experience almost entirely shared?
5. Which faction overlays are required in the first implementation milestone, and which can wait for post-baseline V1 expansion?

## Near-Term Documentation Steps

The next most useful documentation work is:

1. `MVP scope and prototype plan`
2. Prototype-facing data specs for buildings, monsters, NPC values, and faction starting packages
   - `docs/data/building-data-sheet.md`
   - `docs/data/wave-data-sheet.md`
   - `docs/data/npc-schema-and-value-ranges.md`
3. A cleanup pass across support docs once the MVP cut is locked

## Document Roadmap

As we continue, this document can split into supporting docs such as:

- Core loop and player fantasy
- Economy and resource design
- Building catalog
- Social systems design
- Faction and master roster
- Monster faction and wave design
- Camera and control spec
- Terrain and pathfinding spec
- Multiplayer mode rules
- Art direction
- Narrative and tone guide
- MVP scope and milestone plan

## Current Assumptions

These assumptions were made from the current concept and can be revised freely.

- The tower is the central gameplay anchor, not just a main base structure.
- Shared-map pressure is a defining feature and should be preserved.
- Uneven wave exposure is intentional and should create strategy rather than pure fairness.
- The player's identity as a bound spirit is a core differentiator and should shape controls, UI, and story.
- The social relationship system should materially affect gameplay, not exist only as flavor text.
- The settlement should be made of remembered people, not disposable units.
- Terrain manipulation and wave rerouting are central mechanics, not optional extras.
- Decorative expression should have enough systemic weight to influence ordinary play.
- The locked V1 training trio is `Civic Order`, `Terrain Management`, and `Rune Construction`, represented by Sabine Merrow, Ash-Hart of the Boundary, and Aurelian Vale-Sun.
