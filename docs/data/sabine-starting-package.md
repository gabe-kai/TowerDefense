# Sabine Starting Package

Status: Draft
Scope: Prototype Data
Phase: Pre-production
Owner: Design
Source of Truth: No

This document translates Sabine Merrow's current faction design into an implementation-facing starting package reference for the first implementation milestone and first playable baseline.

It does not replace [the Sabine faction design doc](../factions/sabine-merrow-faction-design.md). It is a practical setup sheet for prototype data authoring, balancing, tutorial planning, and milestone implementation.

All values are provisional unless a matching core design doc later locks them.

Primary companion docs:

- [docs/factions/sabine-merrow-faction-design.md](../factions/sabine-merrow-faction-design.md)
- [docs/mvp-scope-and-prototype-plan.md](../mvp-scope-and-prototype-plan.md)
- [docs/economy-buildings-design.md](../economy-buildings-design.md)
- [docs/monster-wave-design.md](../monster-wave-design.md)
- [docs/data/building-data-sheet.md](building-data-sheet.md)
- [docs/data/wave-data-sheet.md](wave-data-sheet.md)
- [docs/data/npc-schema-and-value-ranges.md](npc-schema-and-value-ranges.md)

## Scope

- Target milestone: first implementation milestone
- Target playable baseline: first playable Sabine opener
- Target use: authored start-state setup, tutorial scripting, balance placeholders, and future data conversion
- Out of scope: full long-term Sabine progression, later Sabine command arcs, advanced militia, advanced housing classes, and post-baseline faction expansion

## Package Overview

| Field | Recommended Value |
| --- | --- |
| `package_id` | `startpkg.sabine.baseline_m1` |
| `display_name` | `Sabine Baseline Start` |
| `faction_id` | `faction.sabine_merrow` |
| `faction_master_name` | `Lady Sabine Merrow` |
| `package_purpose` | Teach the baseline loop: warning, sheltering, compact logistics, guided recovery, and first-wave preparation without skipping core build-out play. |
| `first_implementation_milestone_scope` | `true` |
| `first_playable_baseline_scope` | `true` |
| `difficulty_role` | `baseline_easy_mode` |
| `teaching_role` | `Civic Order` |
| `recommended_map_use` | one authored start site on the prototype map with nearby timber, one field-ready patch, one reachable stone source, and one mana source not yet connected |
| `recommended_start_state` | partially established civic outpost with one family, tower retainers, one warning structure, and one guided logistics objective |

## Starting Settlement Data

### Settlement Composition

| Field | Recommended Value |
| --- | --- |
| `settlement_stage` | `starting_tower_outpost` |
| `household_count` | `1 founding household` |
| `retainer_count` | `3 retainers and servants` |
| `total_starting_population` | `7` |
| `initial_named_sites_expected` | `Tower Core`, `Bell Post`, `Field`, `Woodcutter Camp`, `Storehouse Foundation`, `Main House`, `South Gate Road` placeholder route name |
| `opening_layout_bias` | compact footprint, short walking distances, one visible road spine, no outer perimeter yet |
| `mana_state` | tower-only baseline mana at start; no mana well tap yet |
| `defense_state` | warning-first, not wall-first; one local command site and one local responder present |

### Starting Buildings

| Setup Field | Stable Id / Type | Start State | Count | Notes |
| --- | --- | --- | --- | --- |
| `core_building` | `building.tower_core` | `built` | `1` | Starts as command anchor, spell origin, and tiny protected storage. |
| `housing_building` | `building.house` | `built` | `1` | Houses the founding household. |
| `food_building` | `building.field` | `built` | `1` | Main starting staple source and first exposed economic site. |
| `extraction_building` | `building.woodcutter_camp` | `built` | `1` | Provides early wood for roads, repairs, and guided construction. |
| `faction_support_building` | `building.sabine_bell_post` | `built` | `1` | Sabine-specific warning and readiness structure. Keep as faction-overlay data, not shared baseline building duplication. |

### Starting Incomplete or Guided-Objective Buildings

| Setup Field | Stable Id / Type | Start State | Completion Placeholder | Objective Purpose |
| --- | --- | --- | --- | --- |
| `guided_civic_building` | `building.storehouse` | `foundation_started` | `40% complete` | Teaches storage, hauling, repair priority, and why Sabine begins with a recovery-first civic objective. |

Recommended implementation rule:

- The `Storehouse` foundation should already reserve footprint and consume about `50%` of its build cost up front.
- Remaining completion cost placeholder: `Wood:9, Stone:3`.
- Remaining build progress placeholder: `11`.
- The guided objective should be completable with general labor first, but obviously faster once dedicated builder logic exists.

### Starting Roads / Connected Routes

| Field | Recommended Value |
| --- | --- |
| `road_state` | `small_road_spine` |
| `road_segments_placeholder` | `6` |
| `connected_sites` | `Tower Core <-> House <-> Storehouse Foundation <-> Field`; one short spur to `Woodcutter Camp` |
| `route_purpose` | teach that movement, hauling, and evacuation are part of defense |
| `route_quality` | enough to make travel legible, not enough to trivialize later road building |
| `named_route_placeholder` | `South Gate Road` or authored equivalent |

### Starting Command Sites

| Site | Command Role | Starts Named | Notes |
| --- | --- | --- | --- |
| `Tower Core` | root command anchor | `yes` | live-view origin and main emergency context |
| `Bell Post` | readiness / alarm anchor | `yes` | should support warning-stage response orders |
| `Storehouse Foundation` | guided civic objective site | `yes` | should produce build-completion and recovery alerts |
| `Field` | exposed food site | `yes` | supports first warning and first-wave food-protection lesson |
| `Main House` | household shelter site | `conditional yes` | should become a named site because the founding household is socially important |

## Starting NPC Data

### Starting NPC Roster Assumptions

| Slot | Count | Recommended Role Tag | Household Link | Purpose |
| --- | --- | --- | --- | --- |
| `founding_household` | `4` | `villager` / `dependent` mix | `household.sabine_founders` | supplies first civilian labor, caregiver logic, and household stakes |
| `steward_clerk_retainer` | `1` | `retainer` | `household.none` or `tower_household` | civic administration, hauling or storehouse bias, tutorial voice hook |
| `tower_servant` | `1` | `servant` | `tower_household` | tower service and backup hauling / tending |
| `lookout_or_guard_sergeant` | `1` | `lookout` or `guard` | `tower_household` | early report source, warning clarity, and limited defense anchor |

### Recommended Starting Household Structure

| Field | Recommended Value |
| --- | --- |
| `household_id` | `household.sabine_founders` |
| `dwelling_site` | `Main House` |
| `member_count` | `4` |
| `adult_count_placeholder` | `2` |
| `child_count_placeholder` | `2` |
| `primary_caregiver_count` | `1` |
| `secondary_caregiver_count` | `1` |
| `household_burden_start` | `35` |
| `household_safety_start` | `70` |
| `household_bereavement_start` | `0` |
| `household_design_purpose` | gives Sabine a meaningful child-protection and caregiver-protection opening without requiring large-population simulation on minute one |

Recommended opener assumption:

- Use `2 adults + 2 children` for the first baseline unless a later tuning pass decides a `3 adults + 1 child` opener reads better.
- This document assumes `2 adults + 2 children` because it better exercises `Protected Households`, warning response, and visible stakes in the first 10-15 minutes.

### Recommended Starting Individual Roles

| NPC Slot | Age Class | Settlement Role | Likely Starting Assignment | Placeholder Notes |
| --- | --- | --- | --- | --- |
| `founder_adult_a` | `adult` | `villager` | `food_work` | primary farmer or household head |
| `founder_adult_b` | `adult` | `villager` | `general_labor` | flexes between hauling, building, and wood support |
| `founder_child_a` | `child` | `dependent` | `sheltering` or `idle_household` | visible risk and belonging anchor |
| `founder_child_b` | `child` | `dependent` | `sheltering` or `idle_household` | same purpose; can be younger for stronger protection logic |
| `steward_clerk_retainer` | `adult` | `retainer` | `hauling` or `storehouse_support` | bridges civic identity and logistics |
| `tower_servant` | `adult` | `servant` | `tower_service` | can flex to `hauling` or `tending` in emergencies |
| `lookout_or_guard_sergeant` | `adult` | `lookout` or `guard` | `readiness_watch` | report source first, fighter second |

### Starting Labor Distribution Assumptions

| Labor Bucket | Recommended Starting Workers | Notes |
| --- | --- | --- |
| `food_work` | `1.0` | one founding adult anchored to the `Field` |
| `wood_work` | `1.0` | the second founding adult or the retainer can cover the `Woodcutter Camp` early |
| `tower_service` | `1.0` | the tower servant |
| `readiness_watch` | `1.0` | the lookout or guard-sergeant |
| `hauling / civic support` | `0.5-1.0` | steward-clerk handles early logistics bias |
| `general_labor reserve` | `0.5` effective | only available if one worker is not locked into full-time harvesting or woodcutting |

Recommended implementation note:

- Do not start Sabine with a dedicated builder.
- The absence of a true builder at minute one is intentional so the incomplete `Storehouse` teaches why construction labor matters.

### Starting NPC Value Assumptions

| Group | Morale | Loyalty | Fear | Stress | Belonging | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| founding adults | `68` | `58` | `8` | `18` | `72` | stable but not euphoric frontier settlers |
| children | `72` | `50` | `18` | `8` | `78` | visible dependents, high vulnerability |
| steward-clerk | `66` | `68` | `6` | `20` | `55` | more tower-aligned than household-aligned |
| tower servant | `64` | `65` | `8` | `18` | `60` | dependable but not elite |
| lookout / sergeant | `65` | `70` | `10` | `22` | `58` | highest obedience and warning reliability |

## Starting Stockpiles

These values intentionally differ from the generic economy recommendation to support Sabine's guided `Storehouse` opener and low-chaos first-wave learning loop.

| Resource | Recommended Start | Notes |
| --- | --- | --- |
| `Food` | `34` | slightly above generic baseline to support `Open Granary` and early household safety margin |
| `Wood` | `36` | enough for short roads, one emergency repair, and partial remaining `Storehouse` work, but not enough to spam expansion |
| `Stone` | `7` | enough to finish `Storehouse` and preserve one small follow-up choice |
| `Mana` | `24` | enough to cast several low-cost tutorial spells before mana income becomes a broader issue |

Additional capacity assumptions:

| Capacity Field | Recommended Start |
| --- | --- |
| `protected_storage_from_tower_core` | `20 general storage` |
| `current_unfinished_storehouse_capacity` | `0 until complete` |
| `mana_capacity` | `40` |
| `housing_capacity` | `6` |

## Starting Known Map / Survey State

| Field | Recommended Value |
| --- | --- |
| `visible_now_start` | tower site, house, bell post, field, storehouse foundation, immediate timber edge |
| `surveyed_start_radius` | compact inner district plus one short route toward nearby timber and one short route toward probable mana-source direction |
| `unknown_start_area` | most of the wider map, including precise stone and mana routes |
| `resource_knowledge_start` | one visible timber source, one suspected stone source, one `Survey Light`-discoverable mana signature off the immediate start footprint |
| `site_names_pre-authored` | starting core sites only |
| `recommended_sabine_map_advantage` | cleaner initial naming and one better-than-baseline warning/readiness anchor, not extra terrain omniscience |

Recommended `Survey Light` opener behavior:

- First cast should reveal one or more resource signatures on the strategic map.
- It should not reveal pathing, terrain passability, or exact buildable footprint beyond what has already been surveyed.

## Starting Alert / Warning Assumptions

| Field | Recommended Value |
| --- | --- |
| `global_warning_state_at_spawn` | `calm` |
| `bell_post_ready` | `true` |
| `first_warning_window_target` | `3-5` in-game minutes after start |
| `default_warning_clarity_bias` | slightly above shared baseline because of `Bell Post` plus one trained observer |
| `alert_sources_available` | `Tower Core`, `Bell Post`, `lookout_or_sergeant`, direct line of sight |
| `false_omniscience_rule` | reports improve timing and confidence, but do not grant full remote player vision |

## Starting Player Kit

### Starting Spells

| Spell | Start Enabled | Opening Role |
| --- | --- | --- |
| `Survey Light` | `yes` | reveal resource signatures, teach survey-vs-visibility distinction |
| `Household Ward` | `yes` | protect one key civic structure during the opening |
| `Rally Chime` | `yes` | teach readiness, shelter timing, and local response speed |
| `Measured Bolt` | `yes` | provide one simple direct magical intervention without redefining Sabine around damage |

### Starting Runes

| Rune | Start Enabled | Opening Role |
| --- | --- | --- |
| `Alarm Rune` | `yes` | first remote warning placement |
| `Waymark Rune` | `yes` | first route-quality and evacuation-support placement |
| `Sentry Seal` | `yes` | first report-quality upgrade for a warning point |

### Starting Policies

| Policy | Start Enabled | Opening Role |
| --- | --- | --- |
| `Open Granary` | `yes` | post-shock morale and belonging stabilizer |
| `Protected Households` | `yes` | early-shelter teaching switch for children and caregivers |
| `Repair First` | `yes` | default recovery doctrine for housing, gate, storehouse, and mana infrastructure |
| `Ordered Levies` | `yes` | tutorialized emergency draft option with social cost |

## Immediate Sabine Bonuses and Pressures

### Starting Faction Bonuses That Matter Immediately

| Bonus | Immediate Gameplay Effect |
| --- | --- |
| `Civic Legitimacy` | protective and pragmatic orders carry lower early loyalty penalty |
| `Matriarchal Stewardship` | rehousing, household protection, and food reopening recover morale faster |
| `Ordered Recovery` | housing, storehouse, and gate repair priorities are easier to keep aligned |
| `Administrative Warding` | warning, shelter, and low-complexity support magic are slightly more dependable than baseline |
| `Bell Post Readiness` | nearby workers drop tasks and respond to warning-state escalation faster |

### Starting Faction Pressures That Matter Immediately

| Pressure | Immediate Gameplay Risk |
| --- | --- |
| `Duty of Care` | child or caregiver loss causes sharper early fallout than under harsher factions |
| `Public Fairness Standard` | exposing civilians while protecting only tower assets damages legitimacy quickly |
| `Over-Caution` | the player can lose tempo by over-sheltering or delaying decisive action |
| `Lower Tolerance for Ugly Success` | repeated emergency drafting or reckless sacrifice works, but politically costs more |

## Recommended Opening Threat Profile

### Recommended First Warning Profile

| Field | Recommended Value |
| --- | --- |
| `warning_profile_id` | `warning.displaced_hunger` |
| `wave_template_followup` | `wave.early.scurry_passby` |
| `reason` | best early match for Sabine's warning-readiness-shelter teaching role without requiring full breach combat immediately |
| `primary warning fauna` | `monster.warning.vermin_surge` |
| `optional accent fauna` | `monster.warning.hungry_predators` if civilian exposure systems are ready |
| `opening tension target` | protect the `Field`, pull workers inside cleanly, and prove that warning response matters before a full breach |

### Recommended First Wave Baseline

| Field | Recommended Value |
| --- | --- |
| `wave_template_id` | `wave.early.scurry_passby` |
| `budget_placeholder` | `10` |
| `entry_readability_goal` | clear approach direction and food-risk message |
| `preferred_targets` | `Food`, `Storehouse Foundation`, `Fire-Prone` |
| `diversion_expectation` | low-to-moderate diversion toward the settlement if the `Field` sits near the approach |
| `suitable Sabine lesson` | use warning tools, shelter households, protect food, finish recovery work, do not over-draft |

Fallback if the prototype needs a more dramatic breach lesson:

- Use `wave.early.scurry_and_ramhorn` as the first full wave.
- Keep the pre-wave warning event as `warning.displaced_hunger`.
- Only do this if gate and wall interaction are already readable enough to avoid overwhelming the first 10-15 minutes.

## Opening Tutorial Goals

### First-Wave Teaching Goals

| Goal | Why It Matters |
| --- | --- |
| teach that warning arrives before impact | Sabine's identity is readiness, not omniscience |
| teach that `Field` and civilians are valid priorities, not just the tower | aligns with shared economy and social stakes |
| teach one protective spell use | `Household Ward` or `Rally Chime` should feel obviously useful |
| teach one first rune placement | `Alarm Rune` or `Waymark Rune` should have an immediate readable job |
| teach that the `Storehouse` objective is part of survival | logistics and recovery are not optional side systems |

### First-Cycle Tutorial Goals

| Goal | Why It Matters |
| --- | --- |
| finish or meaningfully advance the `Storehouse` | teaches guided civic build-out |
| keep the founding household safe | demonstrates Sabine's care standard and the household model |
| stabilize food and wood flow | sets up the first healthy expansion choice |
| use at least one readiness tool before contact | distinguishes Sabine from a generic neutral opener |
| make one recovery-priority decision after damage | teaches `Repair First` logic |
| understand that emergency drafting exists but is not free | establishes social cost framing early |

### What The Player Should Learn In The First 10-15 Minutes

- The tower sees only part of the truth; reports and warning structures matter.
- A compact road-connected opener is easier to defend and recover than a scattered one.
- The `Storehouse` is an opening survival objective, not delayed optimization.
- Households and children create real shelter timing decisions.
- Sabine's tools reward preparedness, triage, and orderly recovery more than reckless aggression.
- First-wave success means protecting food, people, and recovery capacity, not just killing monsters.

### Expected Early Player Decisions

| Decision | Expected Healthy Baseline |
| --- | --- |
| first spell use | `Survey Light` for resource signatures or `Rally Chime` on first warning |
| first rune placement | `Alarm Rune` on approach or `Waymark Rune` on road spine |
| first labor reassignment | pull one worker into `Storehouse` completion or hauling support |
| first civic priority | finish `Storehouse` before ambitious expansion |
| first warning response | shelter children, keep one adult working only if route is still safe |
| first social-risk choice | whether to use `Ordered Levies` if the edge becomes unsafe |

## Key Failure Risks In The Opening

| Risk | Why It Fails Runs Early |
| --- | --- |
| ignoring the `Storehouse` foundation | weak storage and weak recovery make the second pressure spike harsher |
| leaving children or caregivers exposed on warning escalation | causes outsized loyalty and grief damage under Sabine |
| overcommitting labor to expansion before logistics stabilize | creates hauling and recovery drag immediately |
| overusing emergency draft on the founding household | weakens both labor continuity and Sabine's legitimacy advantage |
| relying on `Measured Bolt` instead of readiness tools | teaches the wrong faction loop and masks warning/readiness problems |
| placing the first rune where it has no immediate route value | wastes Sabine's main teaching leverage |
| assuming the Bell Post grants full sight | breaks the intended reported-vs-visible information model |

## Prototype Data Boundary

### What Should Stay Data-Driven In The First Prototype

| Area | Data-Driven Recommendation |
| --- | --- |
| package id and faction links | stable string ids |
| starting buildings and their states | authored setup rows |
| incomplete `Storehouse` progress, remaining cost, and footprint | authored package data |
| starting stockpiles | authored package data |
| starting NPC roster, roles, and household links | authored package data |
| starting spell, rune, and policy unlocks | authored package data |
| warning profile and first-wave recommendation | authored package data |
| tutorial goals and suggested milestones | authored content hooks or scripting data |
| map survey state and named start sites | authored per-package or per-map-package data |

### What Can Be Hard-Coded Early If Needed

| Area | Temporary Hard-Coded Recommendation |
| --- | --- |
| `Bell Post` readiness bonus math | one shared Sabine-only response-speed modifier |
| `Storehouse` guided-objective scripting | one milestone-specific tutorial trigger chain |
| first warning timing | one authored early timer window |
| first household composition | fixed `2 adults + 2 children` in earliest prototype |
| first-wave chain | fixed `warning.displaced_hunger -> wave.early.scurry_passby` |
| initial site names | authored literals on the prototype map |

Recommended rule:

- Hard-code behavior loops only when needed to get the first playable running.
- Keep all ids, starting values, and unlock lists data-authored from the start so later conversion is cheap.

## Tuning Placeholders

### Highest-Movement Placeholder Values

These are the values most likely to move during balancing.

| Field | Current Placeholder | Why It Will Likely Move |
| --- | --- | --- |
| `storehouse_start_completion` | `40%` | strongly affects opening tempo and builder pressure |
| `starting_food` | `34` | changes how forgiving the first cycle feels |
| `starting_wood` | `36` | affects road, repair, and civic completion pacing |
| `starting_mana` | `24` | changes how much the player can lean on tutorial spells |
| `road_segments_placeholder` | `6` | changes logistics readability and route power |
| `field_proximity_to_wave_route` | `near but not guaranteed contact` | heavily affects first-wave tension |
| `first_warning_time_window` | `3-5 minutes` | changes how teachable the response loop feels |
| `protected_households_response_bonus` | placeholder only | can trivialize or underdeliver on civilian safety |
| `bell_post_response_speed_bonus` | placeholder only | key Sabine identity lever |
| `ordered_levies_early_penalty` | placeholder only | determines whether emergency drafting is viable or a trap |

### Recommended Placeholder Cost / Power Anchors

| Element | Placeholder Recommendation |
| --- | --- |
| `Survey Light` | low cost, no damage, resource-signature reveal only |
| `Household Ward` | one civic target, short duration, meaningful but not absolute damage smoothing |
| `Rally Chime` | short-radius readiness pulse with visible shelter / response speed effect |
| `Measured Bolt` | low-complexity single-target or short-line damage; reliable but not efficient enough to replace planning |
| `Alarm Rune` | modest warning lead-time gain |
| `Waymark Rune` | modest route-quality gain for one lane |
| `Sentry Seal` | report-confidence gain on one lookout or alarm site |

## Unresolved Questions

| Question | Current Recommended Placeholder |
| --- | --- |
| Should the founding household be `2 adults + 2 children` or `3 adults + 1 child`? | Start with `2 adults + 2 children`. |
| Should the lookout slot be a `lookout` or a `guard-sergeant`? | Start with `guard-sergeant` if direct-defense systems are ready; otherwise `lookout`. |
| Should the `Bell Post` be authored as a true building row now or remain a faction overlay stub? | Keep it as a faction-overlay stub for milestone 1. |
| How complete should the `Storehouse` foundation be at start? | Start at `40%` complete. |
| Should the first full wave be pass-by pressure or a small breach lesson? | Default to pass-by pressure first. |
| How much free survey information should Sabine begin with? | One compact surveyed district plus one resource-signature hint, not broad terrain reveal. |
| Should `Open Granary` be usable immediately or only after the first shock event? | Usable immediately, but only valuable after strain begins. |
| Does Sabine start with one or two adults actually available for guided construction? | Start with one reliable flex worker plus conditional help from the steward-clerk. |
| Should the first prototype expose package data as a standalone file or embed it in map setup data? | Start as standalone package data linked from map setup. |

## Suggested Data Conversion Shape

When this document is converted into authored setup data later, prefer one package object with these top-level groups:

- `package_meta`
- `starting_sites`
- `starting_buildings`
- `starting_roads`
- `starting_households`
- `starting_npcs`
- `starting_stockpiles`
- `starting_unlocks`
- `starting_warning_profile`
- `tutorial_goals`
- `tuning_placeholders`

This keeps the Sabine opener portable across maps while preserving room for map-specific overrides.
