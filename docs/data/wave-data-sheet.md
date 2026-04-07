# Wave Data Sheet

Status: Draft
Scope: Prototype Data
Phase: Pre-production
Owner: Design
Source of Truth: No

This document translates the current monster and wave design into an implementation-facing sheet for the first implementation milestone and first playable baseline.

It does not replace the design docs. It is a working data spec for prototyping, balancing, encounter setup, content authoring, and milestone planning.

All values are provisional and should be treated as recommended placeholders unless locked elsewhere.

Primary companion docs:

- `docs/prototype-backlog.md`
- `docs/monster-wave-design.md`
- `docs/mvp-scope-and-prototype-plan.md`
- `docs/camera-controls-and-visibility-spec.md`
- `docs/economy-buildings-design.md`
- `docs/factions/sabine-merrow-faction-design.md`

## Scope

- Target milestone: first implementation milestone
- Target faction baseline: shared monster roster plus Sabine-compatible readability hooks
- Target use: prototype data authoring, implementation planning, balance placeholders, encounter tuning
- Out of scope: full long-term bestiary, advanced locomotion families, multi-wave strategic AI, permanent corruption systems, faction-exclusive monster rosters

## Prototype Sequencing Rule

This sheet covers the first-playable wave roster for the first implementation milestone, but not every monster here belongs in the earliest wave-routing prototype.

Use four implementation labels:

- `P3 minimum`: required by Prototype 3 `Wave Routing and Defensive Pressure`
- `Later in milestone`: belongs to the first implementation milestone, but can wait until after the Prototype 3 minimum slice
- `First-playable only`: part of the broader first-playable baseline, but not required for the earliest milestone validation slice
- `Future only`: not part of the first implementation milestone or first playable baseline

## Reader Intent

This file is optimized for later implementation agents.

Read order:

1. `Schema Summary`
2. `Monster Roster Summary`
3. `Wave Template Data`
4. `Warning-Stage Data`
5. per-monster tables only as needed

Interpretation rules:

- prefer explicit values in this sheet over inferred values from prose docs
- treat any field marked `placeholder` or listed in `Unresolved Tuning Questions` as non-final
- preserve stable ids even if display names, wave names, or balance values change later

## Schema Summary

| Field | Type | Allowed / Format | Notes |
| --- | --- | --- | --- |
| `id` | enum string | `monster.*` or `wave.*` | Stable internal id. |
| `display_name` | string | title case | Player-facing label. |
| `family` | enum string | `warning_fauna`, `scurry_swarm`, `brute_beast`, `sly_raider`, `ember_wretch`, `mana_taken_lord` | Use one primary family only. |
| `threat_role` | enum string | `warning_nuisance`, `warning_predator`, `warning_panic_beast`, `swarm_attrition`, `field_raider`, `line_breaker`, `objective_raider`, `fire_support`, `boss_pressure` | Keep one primary value per monster. |
| `escalation_band` | enum string | `warning`, `early`, `mid`, `late` | `warning` is for omen-stage fauna and mini-hordes. |
| `movement_type` | enum string | `ground`, `ground_breach` | Keep V1 ground-only. |
| `target_tags` | ordered short string list | comma-separated | Ordered attraction priorities. |
| `diversion_behavior` | enum string | `none`, `low`, `event_driven`, `opportunistic`, `deliberate`, `mana_locked` | Group-level intent shorthand. |
| `wall_gate_interaction` | enum string | `avoids_walls`, `uses_openings`, `prefers_gate`, `breaches_gate`, `breaches_wall_if_needed`, `boss_breach` | Path and attack shorthand. |
| `terrain_interaction` | short string list | comma-separated | Use rule language, not flavor text. |
| `fire_interaction` | enum string | `ignores_fire`, `flammable`, `fire_setter`, `fire_resistant`, `placeholder` | First-pass simplification only. |
| `threat_to_civilians` | enum string | `low`, `medium`, `high`, `severe` | Exposure consequence rating. |
| `threat_to_livestock` | enum string | `low`, `medium`, `high`, `severe` | Pasture and herd threat rating. |
| `threat_to_structures` | enum string | `low`, `medium`, `high`, `severe` | General structure threat rating. |
| `warning_signs` | short string list | comma-separated | Primary signs linked to this monster or family. |
| `in_first_implementation_milestone` | bool | `true`, `false` | Required or planned inside milestone scope. |
| `in_broader_first_playable_only` | bool | `true`, `false` | Outside earliest milestone slice, but inside first-playable baseline. |
| `future_scope_only` | bool | `true`, `false` | Reserved for future content. |
| `implementation_priority` | enum string | `p3_minimum`, `later_in_milestone`, `first_playable_only`, `future_only` | Maps to backlog sequencing. |
| `faction_readability_hooks` | short string list | comma-separated | Most relevant for Sabine in milestone 1. |
| `prototype_simplification_notes` | short string list | comma-separated | What to fake, merge, or hard-code early. |

## Shared Data Conventions

| Field | Placeholder Rule |
| --- | --- |
| Wave budget | Use abstract `wave points` in milestone 1. Do not convert to final HP or DPS budgets yet. |
| Family | Family is the primary content bucket for wave logic, warnings, and readability. |
| Threat role | Role is the gameplay job of the monster, not its lore rank. |
| Escalation band | `Warning` is for pre-wave fauna or omen events. `Early`, `Mid`, and `Late` are the three main wave bands from the monster design doc. |
| Target tags | Tags should map to structure or civilian categories already surfaced elsewhere: `Mana`, `Food`, `Gate`, `Wall`, `Defender`, `Housing`, `Storehouse`, `Fire-Prone`, `Path Blocker`, `Livestock`, `Civilian`. |
| Diversion behavior | Treat this as group-level AI bias, not per-unit continuous path recomputation. |
| Threat ratings | `Low`, `Medium`, `High`, `Severe` are expectation bands for milestone 1, not final simulation values. |
| Warning signs | Warning signs should overlap with alert/report language from the camera and visibility spec. |
| Inclusion flags | Exactly one of `in_broader_first_playable_only` or `future_scope_only` may be `true`. `in_first_implementation_milestone` may coexist with neither. |
| Faction readability hooks | Use these to integrate shared monsters with Sabine's `Bell Post`, `Alarm Rune`, `Sentry Seal`, `Waymark Rune`, `Survey Light`, and protective command style. |
| Prototype simplification | If a monster needs custom simulation, replace it with a simpler shared behavior unless the field explicitly says otherwise. |

## Monster Roster Summary

| id | display_name | family | threat_role | escalation_band | implementation_priority | milestone | first-playable only | future only | core purpose |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `monster.warning.vermin_surge` | `Vermin Surge` | `warning_fauna` | `warning_nuisance` | `warning` | `p3_minimum` | `true` | `false` | `false` | early warning pressure against food, stores, and small animals |
| `monster.warning.hungry_predators` | `Hungry Predators` | `warning_fauna` | `warning_predator` | `warning` | `later_in_milestone` | `true` | `false` | `false` | pre-wave danger to livestock and isolated villagers |
| `monster.warning.panicked_herd` | `Panicked Herd` | `warning_fauna` | `warning_panic_beast` | `warning` | `later_in_milestone` | `true` | `false` | `false` | collision threat that tramples fields, fences, and gates |
| `monster.scurry.gnawers` | `Gnawers` | `scurry_swarm` | `swarm_attrition` | `early` | `p3_minimum` | `true` | `false` | `false` | baseline early swarm threat |
| `monster.scurry.blight_locusts` | `Blight Locusts` | `scurry_swarm` | `field_raider` | `early` | `later_in_milestone` | `true` | `false` | `false` | crop and pasture pressure variant |
| `monster.brute.ramhorns` | `Ramhorns` | `brute_beast` | `line_breaker` | `early` | `p3_minimum` | `true` | `false` | `false` | simplest wall and gate pressure unit |
| `monster.raider.scrap_runners` | `Scrap Runners` | `sly_raider` | `objective_raider` | `mid` | `later_in_milestone` | `true` | `false` | `false` | first deliberate mana and logistics raider |
| `monster.raider.gate_cutters` | `Gate-Cutters` | `sly_raider` | `objective_raider` | `mid` | `first_playable_only` | `false` | `true` | `false` | heavier gate and mana sabotage raider |
| `monster.ember.cinderkin` | `Cinderkin` | `ember_wretch` | `fire_support` | `mid` | `first_playable_only` | `false` | `true` | `false` | simplest mixed-wave fire setter |
| `monster.boss.wellmaw` | `Wellmaw` | `mana_taken_lord` | `boss_pressure` | `late` | `first_playable_only` | `false` | `true` | `false` | simplest viable boss family anchor |
| `monster.boss.horned_exile` | `Horned Exile` | `mana_taken_lord` | `boss_pressure` | `late` | `future_only` | `false` | `false` | `true` | later brute-lord breach boss |

## First-Playable Monster Roster

## `monster.warning.vermin_surge`

| Field | Value |
| --- | --- |
| `display_name` | `Vermin Surge` |
| `family` | `warning_fauna` |
| `threat_role` | `warning_nuisance` |
| `escalation_band` | `warning` |
| `movement_type` | `ground` |
| `target_tags` | `Food`, `Storehouse`, `Livestock`, `Civilian` |
| `diversion_behavior` | `event_driven` |
| `wall_gate_interaction` | `uses_openings` |
| `terrain_interaction` | `prefers field edges`; `uses roads and gaps`; `slowed by rough ground only slightly`; `does not attack for long` |
| `fire_interaction` | `ignores_fire` |
| `threat_to_civilians` | `low` |
| `threat_to_livestock` | `medium` |
| `threat_to_structures` | `low` |
| `warning_signs` | `restless birds`, `gnawed grain`, `livestock panic`, `small carcasses`, `moving vermin bands` |
| `in_first_implementation_milestone` | `true` |
| `in_broader_first_playable_only` | `false` |
| `future_scope_only` | `false` |
| `implementation_priority` | `p3_minimum` |
| `faction_readability_hooks` | `Bell Post escalates shelter cue`, `Alarm Rune can surface edge approach`, `Protected Households should pull children indoors early` |
| `prototype_simplification_notes` | `spawn as event group not full AI faction`, `despawn on timer or after minor damage`, `do not model pack tactics`, `reuse civilian-exposure rules instead of bespoke combat` |

## `monster.warning.hungry_predators`

| Field | Value |
| --- | --- |
| `display_name` | `Hungry Predators` |
| `family` | `warning_fauna` |
| `threat_role` | `warning_predator` |
| `escalation_band` | `warning` |
| `movement_type` | `ground` |
| `target_tags` | `Livestock`, `Civilian`, `Food`, `Defender` |
| `diversion_behavior` | `opportunistic` |
| `wall_gate_interaction` | `uses_openings` |
| `terrain_interaction` | `prefers field edge and road interceptions`; `avoids dense defended spaces`; `uses forest cover as entry zone` |
| `fire_interaction` | `flammable` |
| `threat_to_civilians` | `high` |
| `threat_to_livestock` | `high` |
| `threat_to_structures` | `low` |
| `warning_signs` | `missing small animals`, `tracks near pasture`, `mauled carcasses`, `workers running from edge sites` |
| `in_first_implementation_milestone` | `true` |
| `in_broader_first_playable_only` | `false` |
| `future_scope_only` | `false` |
| `implementation_priority` | `later_in_milestone` |
| `faction_readability_hooks` | `Guard Post and Bell Post improve edge response`, `Rally Chime should shorten evacuation delay`, `Sentry Seal can improve report confidence` |
| `prototype_simplification_notes` | `implement as small pack event`, `prioritize exposed targets only`, `skip stealth behaviors`, `use same movement class as raiders without wall logic` |

## `monster.warning.panicked_herd`

| Field | Value |
| --- | --- |
| `display_name` | `Panicked Herd` |
| `family` | `warning_fauna` |
| `threat_role` | `warning_panic_beast` |
| `escalation_band` | `warning` |
| `movement_type` | `ground_breach` |
| `target_tags` | `Food`, `Gate`, `Wall`, `Civilian`, `Livestock` |
| `diversion_behavior` | `low` |
| `wall_gate_interaction` | `breaches_gate` |
| `terrain_interaction` | `follows broad lane`; `weakly slowed by light barriers`; `poor turning`; `uses downhill momentum` |
| `fire_interaction` | `flammable` |
| `threat_to_civilians` | `high` |
| `threat_to_livestock` | `high` |
| `threat_to_structures` | `medium` |
| `warning_signs` | `distant tremors`, `broken fences`, `trampled brush`, `roadside wreckage`, `herd panic noise` |
| `in_first_implementation_milestone` | `true` |
| `in_broader_first_playable_only` | `false` |
| `future_scope_only` | `false` |
| `implementation_priority` | `later_in_milestone` |
| `faction_readability_hooks` | `Face From Tower alerts should strongly orient impact direction`, `Waymark Rune can help keep evacuation lanes clear`, `Household Ward may save one impact site` |
| `prototype_simplification_notes` | `treat as timed collision wave not tactical attackers`, `single path commitment`, `no target reevaluation after spawn` |

## `monster.scurry.gnawers`

| Field | Value |
| --- | --- |
| `display_name` | `Gnawers` |
| `family` | `scurry_swarm` |
| `threat_role` | `swarm_attrition` |
| `escalation_band` | `early` |
| `movement_type` | `ground` |
| `target_tags` | `Food`, `Storehouse`, `Fire-Prone`, `Housing` |
| `diversion_behavior` | `opportunistic` |
| `wall_gate_interaction` | `avoids_walls` |
| `terrain_interaction` | `uses gaps and open edges`; `benefits from roads if available`; `slowed by trenches and rough ground`; `poor against defended choke` |
| `fire_interaction` | `flammable` |
| `threat_to_civilians` | `medium` |
| `threat_to_livestock` | `medium` |
| `threat_to_structures` | `medium` |
| `warning_signs` | `dogs barking`, `gnawed remains`, `moving ground`, `crop edge damage`, `vermin clusters` |
| `in_first_implementation_milestone` | `true` |
| `in_broader_first_playable_only` | `false` |
| `future_scope_only` | `false` |
| `implementation_priority` | `p3_minimum` |
| `faction_readability_hooks` | `Bell Post should cue food-site response`, `Alarm Rune on outer routes improves lead time`, `Protected Households reduces early civilian catastrophe` |
| `prototype_simplification_notes` | `baseline early swarm type`, `single shared swarm AI`, `no wall damage unless already inside`, `can be merged with Blight Locusts if scope tightens` |

## `monster.scurry.blight_locusts`

| Field | Value |
| --- | --- |
| `display_name` | `Blight Locusts` |
| `family` | `scurry_swarm` |
| `threat_role` | `field_raider` |
| `escalation_band` | `early` |
| `movement_type` | `ground` |
| `target_tags` | `Food`, `Livestock`, `Fire-Prone`, `Housing` |
| `diversion_behavior` | `opportunistic` |
| `wall_gate_interaction` | `avoids_walls` |
| `terrain_interaction` | `prefers fields and pastures`; `weak against defended interior`; `slowed by rough wet ground` |
| `fire_interaction` | `flammable` |
| `threat_to_civilians` | `low` |
| `threat_to_livestock` | `medium` |
| `threat_to_structures` | `low` |
| `warning_signs` | `crop blight`, `sudden bird lift`, `field shimmer`, `stripped growth`, `pasture agitation` |
| `in_first_implementation_milestone` | `true` |
| `in_broader_first_playable_only` | `false` |
| `future_scope_only` | `false` |
| `implementation_priority` | `later_in_milestone` |
| `faction_readability_hooks` | `Survey Light can help identify outer food-value clusters`, `Repair First and Open Granary help absorb crop shock`, `Bell Post should signal field worker recall` |
| `prototype_simplification_notes` | `variant of Gnawers with different targets and visuals`, `reuse same locomotion and diversion code`, `skip building-specific crop disease systems` |

## `monster.brute.ramhorns`

| Field | Value |
| --- | --- |
| `display_name` | `Ramhorns` |
| `family` | `brute_beast` |
| `threat_role` | `line_breaker` |
| `escalation_band` | `early` |
| `movement_type` | `ground_breach` |
| `target_tags` | `Gate`, `Wall`, `Defender`, `Path Blocker` |
| `diversion_behavior` | `event_driven` |
| `wall_gate_interaction` | `breaches_gate` |
| `terrain_interaction` | `prefers wide approach`; `poor at sharp turns`; `slowed by trenches and steep slopes`; `benefits from roads and open lanes` |
| `fire_interaction` | `flammable` |
| `threat_to_civilians` | `medium` |
| `threat_to_livestock` | `high` |
| `threat_to_structures` | `high` |
| `warning_signs` | `tremors`, `gouged bark`, `broken tree line`, `abandoned carts`, `horned silhouettes` |
| `in_first_implementation_milestone` | `true` |
| `in_broader_first_playable_only` | `false` |
| `future_scope_only` | `false` |
| `implementation_priority` | `p3_minimum` |
| `faction_readability_hooks` | `Face From Tower should bias toward gates and wall sectors`, `Household Ward is a useful emergency response`, `Sabine fallback orders should read clearly at breach points` |
| `prototype_simplification_notes` | `simplest breach-capable unit`, `attack nearest gate or blocking palisade`, `no rage phases`, `reuse for panic-beast collision tuning where useful` |

## `monster.raider.scrap_runners`

| Field | Value |
| --- | --- |
| `display_name` | `Scrap Runners` |
| `family` | `sly_raider` |
| `threat_role` | `objective_raider` |
| `escalation_band` | `mid` |
| `movement_type` | `ground` |
| `target_tags` | `Mana`, `Food`, `Gate`, `Defender` |
| `diversion_behavior` | `deliberate` |
| `wall_gate_interaction` | `prefers_gate` |
| `terrain_interaction` | `seeks lower-resistance routes`; `uses roads aggressively`; `avoids steep bad ground if alternate path exists`; `tests damaged sections` |
| `fire_interaction` | `flammable` |
| `threat_to_civilians` | `high` |
| `threat_to_livestock` | `medium` |
| `threat_to_structures` | `medium` |
| `warning_signs` | `missing tools`, `cut lines`, `sprung traps`, `stripped travelers`, `disciplined scouts` |
| `in_first_implementation_milestone` | `true` |
| `in_broader_first_playable_only` | `false` |
| `future_scope_only` | `false` |
| `implementation_priority` | `later_in_milestone` |
| `faction_readability_hooks` | `Alarm Rune and Sentry Seal should improve route-reading`, `Waymark Rune can protect evacuation and hauling lanes`, `Sabine command text should highlight mana and storehouse risk` |
| `prototype_simplification_notes` | `first true intelligent raider`, `group-level path recheck only`, `no stealth or climbing`, `same core family can carry Gate-Cutter variant later` |

## `monster.raider.gate_cutters`

| Field | Value |
| --- | --- |
| `display_name` | `Gate-Cutters` |
| `family` | `sly_raider` |
| `threat_role` | `objective_raider` |
| `escalation_band` | `mid` |
| `movement_type` | `ground_breach` |
| `target_tags` | `Gate`, `Mana`, `Storehouse`, `Defender` |
| `diversion_behavior` | `deliberate` |
| `wall_gate_interaction` | `breaches_gate` |
| `terrain_interaction` | `prefers prepared openings`; `benefits from roads`; `low patience for long detours`; `will use damaged perimeter segments` |
| `fire_interaction` | `flammable` |
| `threat_to_civilians` | `high` |
| `threat_to_livestock` | `medium` |
| `threat_to_structures` | `high` |
| `warning_signs` | `cut messenger lines`, `damaged outer gates`, `raider tool marks`, `retreating guards`, `organized approach traces` |
| `in_first_implementation_milestone` | `false` |
| `in_broader_first_playable_only` | `true` |
| `future_scope_only` | `false` |
| `implementation_priority` | `first_playable_only` |
| `faction_readability_hooks` | `Sabine gate-defense orders need distinct wording`, `Bell Post should accelerate lock-gate and fall-back behavior`, `Household Ward may preserve a critical gatehouse or mana intake` |
| `prototype_simplification_notes` | `upgrade of Scrap Runner rather than full new system`, `same perception model`, `bonus gate damage only`, `delay entirely if Scrap Runners already create enough pressure` |

## `monster.ember.cinderkin`

| Field | Value |
| --- | --- |
| `display_name` | `Cinderkin` |
| `family` | `ember_wretch` |
| `threat_role` | `fire_support` |
| `escalation_band` | `mid` |
| `movement_type` | `ground` |
| `target_tags` | `Fire-Prone`, `Storehouse`, `Mana`, `Housing` |
| `diversion_behavior` | `deliberate` |
| `wall_gate_interaction` | `uses_openings` |
| `terrain_interaction` | `seeks active fighting and wooden density`; `not especially good at breaching`; `uses roads if open` |
| `fire_interaction` | `fire_setter` |
| `threat_to_civilians` | `high` |
| `threat_to_livestock` | `high` |
| `threat_to_structures` | `high` |
| `warning_signs` | `ash fall`, `orange glow`, `smoke columns`, `burned livestock`, `blackened survivors` |
| `in_first_implementation_milestone` | `false` |
| `in_broader_first_playable_only` | `true` |
| `future_scope_only` | `false` |
| `implementation_priority` | `first_playable_only` |
| `faction_readability_hooks` | `Extinguish Fires order becomes critical`, `Bell Post should sharpen fire crisis response`, `Repair First should prioritize storage and housing after burn damage` |
| `prototype_simplification_notes` | `only monster that intentionally starts new fires in milestone scope`, `apply simple ignite status on hit`, `no advanced fire avoidance or fire use AI` |

## `monster.boss.wellmaw`

| Field | Value |
| --- | --- |
| `display_name` | `Wellmaw` |
| `family` | `mana_taken_lord` |
| `threat_role` | `boss_pressure` |
| `escalation_band` | `late` |
| `movement_type` | `ground_breach` |
| `target_tags` | `Mana`, `Gate`, `Wall`, `Defender` |
| `diversion_behavior` | `mana_locked` |
| `wall_gate_interaction` | `boss_breach` |
| `terrain_interaction` | `takes shortest viable route to mana`; `accepts poor terrain if mana target is near`; `low interest in houses unless blocked`; `becomes wall-breaker when denied access` |
| `fire_interaction` | `fire_resistant` |
| `threat_to_civilians` | `severe` |
| `threat_to_livestock` | `high` |
| `threat_to_structures` | `severe` |
| `warning_signs` | `mana flicker`, `rune instability`, `ley shimmer`, `drained survivors`, `visible corrupted focal beast` |
| `in_first_implementation_milestone` | `false` |
| `in_broader_first_playable_only` | `true` |
| `future_scope_only` | `false` |
| `implementation_priority` | `first_playable_only` |
| `faction_readability_hooks` | `Survey Light and mana alerts should make mana geography legible`, `Sabine commands should emphasize protecting mana intake over outer sheds`, `Bell Post should support orderly fallback when mana site is threatened` |
| `prototype_simplification_notes` | `ship one boss family only`, `single aura effect: nearby allies gain mana attraction`, `single boss status effect: temporary mana disruption`, `no permanent corruption`, `no multi-phase boss fight` |

## `monster.boss.horned_exile`

| Field | Value |
| --- | --- |
| `display_name` | `Horned Exile` |
| `family` | `mana_taken_lord` |
| `threat_role` | `boss_pressure` |
| `escalation_band` | `late` |
| `movement_type` | `ground_breach` |
| `target_tags` | `Gate`, `Wall`, `Defender`, `Path Blocker` |
| `diversion_behavior` | `deliberate` |
| `wall_gate_interaction` | `boss_breach` |
| `terrain_interaction` | `placeholder` |
| `fire_interaction` | `placeholder` |
| `threat_to_civilians` | `severe` |
| `threat_to_livestock` | `severe` |
| `threat_to_structures` | `severe` |
| `warning_signs` | `heavy tremors`, `broken roads`, `brute-lord spoor`, `routed militia` |
| `in_first_implementation_milestone` | `false` |
| `in_broader_first_playable_only` | `false` |
| `future_scope_only` | `true` |
| `implementation_priority` | `future_only` |
| `faction_readability_hooks` | `placeholder` |
| `prototype_simplification_notes` | `do not implement for first playable baseline unless Wellmaw is already solid` |

## Minimum Viable Wave Template Structure

Use one shared template shape for milestone 1.

| Field | Type | Allowed / Format | Notes |
| --- | --- | --- | --- |
| `id` | enum string | `wave.*` | Stable internal id. |
| `display_name` | string | title case | Player-facing label if surfaced. |
| `wave_band` | enum string | `warning_event`, `early`, `mid`, `late` | High-level pacing band. |
| `entry_edge` | enum string | `north`, `east`, `south`, `west`, `placeholder_spawn_lane` | Use map-relative values. |
| `projected_exit_edge` | enum string | `north`, `east`, `south`, `west`, `hidden_until_stage_X` | Visibility can be delayed by warning stage. |
| `intelligence_tier` | enum string | `animalistic`, `cunning`, `directed` | Matches wave design doc. |
| `objective_bias` | enum string | `displaced_hunger`, `passing_hunger`, `plunder`, `breach`, `mana_hunger` | Keep the shared bias list small. |
| `primary_family` | enum string | family id | Main warning and composition anchor. |
| `support_family` | enum string or `none` | family id | Optional secondary family. |
| `wave_budget_points` | int | placeholder range | Abstract encounter budget. |
| `boss_monster_id` | enum string or `none` | `monster.*` | One boss max in first playable. |
| `composition_rules` | short string list | semicolon-separated | Percent or points by role/family. |
| `notice_range_band` | enum string | `short`, `medium`, `long` | Group-level detection range. |
| `diversion_checks` | short string list | event triggers | Use event-driven recompute only. |
| `warning_profile_id` | enum string | `warning.*` | Links to warning-stage content. |
| `preferred_targets` | ordered short string list | comma-separated | Wave-level target weighting. |
| `fallback_route_rule` | enum string | `stay_course`, `retry_gate`, `seek_weak_point`, `boss_force_breach` | Simple reroute grammar. |
| `spawn_cadence` | short string | `burst`, `stream`, `clustered_bursts` | Readability and pacing aid. |
| `prototype_notes` | short string list | comma-separated | Hard-code or simplification notes. |

## Wave Point Budget / Composition Logic

### Budget Model

- Use one abstract `wave_budget_points` value per wave.
- Convert points into monster groups, not individual bespoke authoring, for milestone 1.
- Keep warning-stage fauna on a smaller `event budget` separate from the main wave budget.

### Recommended First-Pass Budget Bands

| Wave band | Budget placeholder | Intended pressure |
| --- | --- | --- |
| `warning_event` | `2-8` | nuisance, exposure, and economic disruption |
| `early` | `8-18` | readable swarm pressure with one breach-capable accent |
| `mid` | `18-32` | mixed-role threat with deliberate objective targeting |
| `late` | `32-48` plus optional boss | layered incursion that threatens continuity, not just perimeter HP |

### Cost Placeholder by Monster

| monster id | Point cost placeholder | Notes |
| --- | --- | --- |
| `monster.warning.vermin_surge` | `1` | use as grouped nuisance spawn |
| `monster.warning.hungry_predators` | `2` | small pack event |
| `monster.warning.panicked_herd` | `3` | collision-heavy event |
| `monster.scurry.gnawers` | `1` | baseline cheap swarm |
| `monster.scurry.blight_locusts` | `1` | same cost as Gnawers for first pass |
| `monster.brute.ramhorns` | `4` | early breach premium |
| `monster.raider.scrap_runners` | `3` | first deliberate objective unit |
| `monster.raider.gate_cutters` | `4` | heavier gate pressure |
| `monster.ember.cinderkin` | `3` | support-costed due to ignition risk |
| `monster.boss.wellmaw` | `12` | one-per-wave max |

### Composition Rules

- Early waves should be mostly one-family with at most one support family.
- Mid waves should use one primary family plus one support family and one accent role.
- Late waves should use one primary family, one support family, one breach accent, and optional boss.
- Do not build fully freeform procedural ecology logic in milestone 1.
- Use role caps before using deep behavior scripts.

### Recommended Role Caps

| Wave band | Recommended cap |
| --- | --- |
| `early` | max `1` breach unit per `8` points |
| `mid` | max `2` breach or fire-support units per `16` points |
| `late` | max `1` boss, max `3` breach units, max `3` fire-support groups |

## Wave Template Data

## Roster Summary

| id | display_name | wave_band | implementation_priority | intended use |
| --- | --- | --- | --- | --- |
| `wave.warning.displaced_foragers` | `Displaced Foragers` | `warning_event` | `p3_minimum` | minimum viable omen-stage fauna event |
| `wave.early.scurry_passby` | `Scurry Pass-By` | `early` | `p3_minimum` | earliest playable swarm route-pressure test |
| `wave.early.scurry_and_ramhorn` | `Scurry With Ramhorn` | `early` | `p3_minimum` | first wall/gate interaction template |
| `wave.mid.raider_plunder` | `Raider Plunder` | `mid` | `later_in_milestone` | first mana/food diversion template |
| `wave.mid.raider_breach_fire` | `Raider Breach With Fire` | `mid` | `first_playable_only` | first playable layered threat template |
| `wave.late.wellmaw_mana_hunger` | `Wellmaw Mana Hunger` | `late` | `first_playable_only` | simplest viable boss-led finale template |

## `wave.warning.displaced_foragers`

| Field | Value |
| --- | --- |
| `display_name` | `Displaced Foragers` |
| `wave_band` | `warning_event` |
| `entry_edge` | `placeholder_spawn_lane` |
| `projected_exit_edge` | `hidden_until_stage_4` |
| `intelligence_tier` | `animalistic` |
| `objective_bias` | `displaced_hunger` |
| `primary_family` | `warning_fauna` |
| `support_family` | `none` |
| `wave_budget_points` | `4` |
| `boss_monster_id` | `none` |
| `composition_rules` | `50% Vermin Surge`; `50% Hungry Predators or Panicked Herd based on terrain` |
| `notice_range_band` | `short` |
| `diversion_checks` | `on spawn`; `on civilian sight`; `on pasture proximity` |
| `warning_profile_id` | `warning.displaced_hunger` |
| `preferred_targets` | `Food`, `Livestock`, `Civilian` |
| `fallback_route_rule` | `stay_course` |
| `spawn_cadence` | `clustered_bursts` |
| `prototype_notes` | `treat as warning-stage event not full wave`, `safe to hard-code per map lane in earliest prototype` |

## `wave.early.scurry_passby`

| Field | Value |
| --- | --- |
| `display_name` | `Scurry Pass-By` |
| `wave_band` | `early` |
| `entry_edge` | `map-selected` |
| `projected_exit_edge` | `revealed_at_stage_3` |
| `intelligence_tier` | `animalistic` |
| `objective_bias` | `passing_hunger` |
| `primary_family` | `scurry_swarm` |
| `support_family` | `none` |
| `wave_budget_points` | `10` |
| `boss_monster_id` | `none` |
| `composition_rules` | `80-100% Gnawers`; `0-20% Blight Locusts if implemented` |
| `notice_range_band` | `medium` |
| `diversion_checks` | `on settlement notice range`; `on heavy defender attack`; `on path-near food site` |
| `warning_profile_id` | `warning.scurry_swarm` |
| `preferred_targets` | `Food`, `Storehouse`, `Fire-Prone` |
| `fallback_route_rule` | `stay_course` |
| `spawn_cadence` | `stream` |
| `prototype_notes` | `minimum viable early wave`, `keep settlement diversion chance low`, `prove pass-by behavior before smart raiders` |

## `wave.early.scurry_and_ramhorn`

| Field | Value |
| --- | --- |
| `display_name` | `Scurry With Ramhorn` |
| `wave_band` | `early` |
| `entry_edge` | `map-selected` |
| `projected_exit_edge` | `revealed_at_stage_3` |
| `intelligence_tier` | `animalistic` |
| `objective_bias` | `breach` |
| `primary_family` | `scurry_swarm` |
| `support_family` | `brute_beast` |
| `wave_budget_points` | `14` |
| `boss_monster_id` | `none` |
| `composition_rules` | `60-75% Gnawers`; `25-40% Ramhorns by points`; `max 2 Ramhorns` |
| `notice_range_band` | `medium` |
| `diversion_checks` | `on settlement notice range`; `after failed gate hit`; `after major terrain block` |
| `warning_profile_id` | `warning.brute_beast` |
| `preferred_targets` | `Gate`, `Wall`, `Food` |
| `fallback_route_rule` | `retry_gate` |
| `spawn_cadence` | `burst` |
| `prototype_notes` | `minimum breach template`, `good for palisade/gate prototype`, `do not add raiders here` |

## `wave.mid.raider_plunder`

| Field | Value |
| --- | --- |
| `display_name` | `Raider Plunder` |
| `wave_band` | `mid` |
| `entry_edge` | `map-selected` |
| `projected_exit_edge` | `revealed_at_stage_4` |
| `intelligence_tier` | `cunning` |
| `objective_bias` | `plunder` |
| `primary_family` | `sly_raider` |
| `support_family` | `scurry_swarm` |
| `wave_budget_points` | `24` |
| `boss_monster_id` | `none` |
| `composition_rules` | `40-55% Scrap Runners`; `25-40% Gnawers or Blight Locusts`; `10-20% Ramhorns` |
| `notice_range_band` | `medium` |
| `diversion_checks` | `on settlement notice range`; `after breach failure`; `after mana target sighted` |
| `warning_profile_id` | `warning.sly_raider` |
| `preferred_targets` | `Mana`, `Food`, `Gate`, `Storehouse` |
| `fallback_route_rule` | `seek_weak_point` |
| `spawn_cadence` | `clustered_bursts` |
| `prototype_notes` | `first deliberate objective wave`, `enable route reevaluation only at event triggers`, `good bridge from migration to incursion` |

## `wave.mid.raider_breach_fire`

| Field | Value |
| --- | --- |
| `display_name` | `Raider Breach With Fire` |
| `wave_band` | `mid` |
| `entry_edge` | `map-selected` |
| `projected_exit_edge` | `revealed_at_stage_4` |
| `intelligence_tier` | `cunning` |
| `objective_bias` | `breach` |
| `primary_family` | `sly_raider` |
| `support_family` | `ember_wretch` |
| `wave_budget_points` | `30` |
| `boss_monster_id` | `none` |
| `composition_rules` | `35-45% Scrap Runners and Gate-Cutters`; `15-25% Ramhorns`; `10-15% Cinderkin`; `remaining points Gnawers` |
| `notice_range_band` | `long` |
| `diversion_checks` | `on settlement notice range`; `after failed breach`; `after first fire started` |
| `warning_profile_id` | `warning.ember_wretch` |
| `preferred_targets` | `Gate`, `Fire-Prone`, `Storehouse`, `Mana` |
| `fallback_route_rule` | `seek_weak_point` |
| `spawn_cadence` | `clustered_bursts` |
| `prototype_notes` | `first playable only`, `do not ship until fire crisis readability is good`, `can remove Gate-Cutters if scope compresses` |

## `wave.late.wellmaw_mana_hunger`

| Field | Value |
| --- | --- |
| `display_name` | `Wellmaw Mana Hunger` |
| `wave_band` | `late` |
| `entry_edge` | `map-selected` |
| `projected_exit_edge` | `revealed_at_stage_4` |
| `intelligence_tier` | `directed` |
| `objective_bias` | `mana_hunger` |
| `primary_family` | `mana_taken_lord` |
| `support_family` | `sly_raider` |
| `wave_budget_points` | `40` |
| `boss_monster_id` | `monster.boss.wellmaw` |
| `composition_rules` | `1 Wellmaw`; `25-35% Scrap Runners or Gate-Cutters`; `15-25% Ramhorns`; `10-15% Gnawers`; `0-10% Cinderkin` |
| `notice_range_band` | `long` |
| `diversion_checks` | `on boss notice of mana structure`; `after failed gate hit`; `after mana site destroyed or disrupted` |
| `warning_profile_id` | `warning.mana_hunger_boss` |
| `preferred_targets` | `Mana`, `Gate`, `Wall`, `Defender` |
| `fallback_route_rule` | `boss_force_breach` |
| `spawn_cadence` | `burst` |
| `prototype_notes` | `simplest boss-led capstone`, `one aura rule only`, `one disruption rule only`, `skip second boss family` |

## Warning-Stage Progression Structure

Use one shared five-stage ladder for all main wave families.

1. `Omen`
2. `Sign`
3. `Refugees`
4. `Survivors or Scouts`
5. `Main Body Sighted`

### Recommended System Rules

- Each wave template references one `warning_profile_id`.
- Warning stages should escalate on time plus confidence, not only distance.
- `Bell Post`, `Watchtower`, `Alarm Rune`, and `Sentry Seal` should change lead time, confidence, or site naming quality rather than reveal perfect truth.
- Earliest prototype can hard-code one warning event per stage.
- Later milestone version can switch to a weighted event pool by `warning_profile_id`.

## Warning-Stage Data

## Warning Profile Summary

| id | family anchor | use case |
| --- | --- | --- |
| `warning.displaced_hunger` | `warning_fauna` | pre-wave fauna, food exposure, civilian recall |
| `warning.scurry_swarm` | `scurry_swarm` | food attrition and moving-ground readability |
| `warning.brute_beast` | `brute_beast` | breach pressure and impact readability |
| `warning.sly_raider` | `sly_raider` | deliberate raiding and route-discipline readability |
| `warning.ember_wretch` | `ember_wretch` | fire-risk readability and smoke panic |
| `warning.mana_hunger_boss` | `mana_taken_lord` | mana-risk climax and boss framing |

## `warning.displaced_hunger`

| Stage | Default signal | Player-facing implication |
| --- | --- | --- |
| `Omen` | wildlife moves against normal patterns | edge workers and children may need earlier recall |
| `Sign` | damaged fences, droppings, small carcasses | fields, coops, and hutches are exposed |
| `Refugees` | herders or foragers sprint in from outer work sites | vulnerable civilians are already being displaced |
| `Survivors or Scouts` | mauled workers or shaken hunters identify what is being driven inward | threat class becomes clearer: nuisance, predator, or panic beast |
| `Main Body Sighted` | mini-horde contact or signs of the true wave behind it | immediate shelter and edge defense response |

## `warning.scurry_swarm`

| Stage | Default signal | Player-facing implication |
| --- | --- | --- |
| `Omen` | dogs bark, birds lift, livestock agitate | food sites near routes may be at risk soon |
| `Sign` | gnawed remains, trampled undergrowth, first vermin clusters | swarm family confirmed |
| `Refugees` | farmers or burners report crop-edge movement | pull workers from exposed food sites |
| `Survivors or Scouts` | ranger or wagon report describes moving ground | pass-by versus diversion feels readable |
| `Main Body Sighted` | dark carpet or churning bands appear | defend food and stores, not just the tower |

## `warning.brute_beast`

| Stage | Default signal | Player-facing implication |
| --- | --- | --- |
| `Omen` | distant tremors, herd panic, broken tree line | gates and outer walls may soon matter |
| `Sign` | gouged bark, wrecked brush, abandoned carts | breach-capable threat likely |
| `Refugees` | herders and road crews flee impact paths | clear approach lanes and shelter civilians |
| `Survivors or Scouts` | wounded militia report heavy beasts | prepare gate defense or fallback line |
| `Main Body Sighted` | horned wedge pushes through terrain | expect wall or gate contact soon |

## `warning.sly_raider`

| Stage | Default signal | Player-facing implication |
| --- | --- | --- |
| `Omen` | distant fires, missing tools, disturbed camps | deliberate hostile pressure is approaching |
| `Sign` | sprung traps, cut lines, skirmish dead | raider family likely targeting logistics |
| `Refugees` | stripped traders or migrants arrive in groups | outer roads and stores are unsafe |
| `Survivors or Scouts` | retreating guards or runners describe route discipline | mana and gate targets should be prioritized |
| `Main Body Sighted` | bands move with visible scouting and spacing | the wave intends to choose weak points |

## `warning.ember_wretch`

| Stage | Default signal | Player-facing implication |
| --- | --- | --- |
| `Omen` | soot in air, orange glow at night | fire preparedness matters now |
| `Sign` | isolated brush fires, burned livestock | flammable layouts are at special risk |
| `Refugees` | smoke-choked villagers and teamsters arrive | fire response and sheltering must begin early |
| `Survivors or Scouts` | blackened fighters report torch-bearing raiders | expect mixed breach and burn pressure |
| `Main Body Sighted` | moving flame points mark the approach | storage, houses, and palisades become crisis targets |

## `warning.mana_hunger_boss`

| Stage | Default signal | Player-facing implication |
| --- | --- | --- |
| `Omen` | mana flicker, rune instability, pressure around tower | mana network is the likely objective |
| `Sign` | ley shimmer, strange glow at well, familiars refuse approach | boss-class mana threat is plausible |
| `Refugees` | drained retainers or escaped apprentices arrive | nearby tower or well already failed |
| `Survivors or Scouts` | wounded mage or guard captain describes the lord | specific mana defense prep becomes valid |
| `Main Body Sighted` | lesser monsters cluster around focal monster or corruption wake | expect direct mana-site assault |

## What Data a Wave Template Needs

At minimum, every authored wave template should define:

- stable id
- wave band
- entry edge
- projected exit edge visibility rule
- intelligence tier
- objective bias
- primary family
- support family or `none`
- wave budget points
- monster composition rules
- warning profile id
- diversion check triggers
- preferred targets
- fallback route rule
- spawn cadence

Recommended but optional in milestone 1:

- site-priority overrides for special maps
- weather modifier hooks
- map tag affinities such as `forest_route`, `bridge_route`, `mana_dense_route`
- faction-specific warning text variants

## What Should Be Hard-Coded Early Versus Data-Driven Later

| Area | Hard-code early | Data-drive later |
| --- | --- | --- |
| Monster roster | `Gnawers`, `Ramhorns`, `Vermin Surge` | all remaining entries |
| Movement classes | `ground`, `ground_breach` only | future locomotion types |
| Diversion checks | fixed event triggers in code | per-template trigger lists and weights |
| Target tags | small shared enum set in code | per-monster ordered priority tables |
| Warning stages | fixed five-stage ladder | per-profile event pools and faction text variants |
| Wave budgets | a few authored budget values | dynamic scaling by cycle, map, difficulty |
| Composition rules | authored template arrays | weighted generation from family pools |
| Fire logic | simple ignite status and spread bands | richer fire-response tuning |
| Boss logic | one boss family, one aura, one disruption rule | multi-phase bosses and alternate boss families |
| Exit-edge visibility | one or two reveal rules | per-wave intelligence-linked reveal timing |

### Recommended Early Hard-Coded Slice

If implementation scope gets tight, the minimum viable wave system should ship with:

- `monster.warning.vermin_surge`
- `monster.scurry.gnawers`
- `monster.brute.ramhorns`
- `wave.warning.displaced_foragers`
- `wave.early.scurry_passby`
- `wave.early.scurry_and_ramhorn`
- one shared warning-stage ladder
- one shared attraction-score diversion rule

Then add in order:

1. `monster.raider.scrap_runners`
2. `wave.mid.raider_plunder`
3. `monster.ember.cinderkin`
4. `monster.boss.wellmaw`

## Recommended Milestone Notes

| Rule Area | Recommended Placeholder |
| --- | --- |
| Minimum prototype roster | Treat `Gnawers`, `Ramhorns`, and `Vermin Surge` as the non-negotiable baseline. They cover food pressure, breach pressure, and warning-stage fauna with the fewest behavior classes. |
| Raider introduction | `Scrap Runners` are the correct first mid-tier raider because they validate mana targeting, road risk, and deliberate diversion without requiring a full siege ecosystem. |
| Fire scope | `Cinderkin` belongs in first playable scope, not Prototype 3 minimum. Fire should not block proving route pressure first. |
| Boss scope | `Wellmaw` is the only recommended first-playable boss. Do not split time across multiple boss families. |
| Sabine integration | In milestone 1, Sabine should change readability, response timing, and fallback clarity more than she changes monster rules. |
| Data authoring recommendation | Convert monster roster tables directly into structured data rows. Keep wave templates as authored content entries, not pure procedural generation rules. |

## Unresolved Tuning Questions

- Should `Blight Locusts` exist as a separate early monster in the milestone, or remain a display/targeting variant of `Gnawers` until later?
- Should `Gate-Cutters` be a distinct data row in first playable, or just a `Scrap Runner` modifier package with gate-damage bonus?
- How often should `Mana` outrank `Food` in mid-wave templates before the player has significant mana infrastructure?
- At what warning stage should `projected_exit_edge` become visible for `animalistic` versus `cunning` waves?
- How many `wave_budget_points` should one defended `Palisade + Gate` line reasonably absorb before recovery becomes impossible?
- Should `Panicked Herd` and `Ramhorns` share the same collision and barrier-break rules in milestone 1 to save implementation time?
- How much of fire response should be automatic villager behavior versus explicit `Extinguish Fires` orders in the first playable?
