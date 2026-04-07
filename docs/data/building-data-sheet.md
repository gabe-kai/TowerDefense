# Building Data Sheet

Status: Draft
Scope: Prototype Data
Phase: Pre-production
Owner: Design
Source of Truth: No

This document translates the current building and economy design into an implementation-facing sheet for the first implementation milestone and first playable baseline.

It does not replace the design docs. It is a working data spec for prototyping, balancing, content setup, and milestone planning.

All values are provisional and should be treated as recommended placeholders unless locked elsewhere.

Primary companion docs:

- `docs/prototype-backlog.md`
- `docs/economy-buildings-design.md`
- `docs/camera-controls-and-visibility-spec.md`
- `docs/data/npc-schema-and-value-ranges.md`

## Scope

- Target milestone: first implementation milestone
- Target faction baseline: shared roster plus Sabine-compatible hooks
- Target use: prototype data authoring, implementation planning, balance placeholders
- Out of scope: long-term industry chains, advanced faction-only buildings, late-V1 upgrades

## Prototype Sequencing Rule

This sheet covers the first-playable roster for the first implementation milestone, but not every building here belongs in the earliest prototype.

Use three implementation labels:

- `P2 minimum`: required by Prototype 2 `Settlement Economy and Rebuild Loop`
- `Later in milestone`: belongs to the first implementation milestone, but can wait until after the Prototype 2 minimum slice
- `Optional in milestone`: useful support content for the milestone, but not required for baseline validation

## Reader Intent

This file is optimized for later implementation agents.

Read order:

1. `Schema Summary`
2. `Roster Summary`
3. per-building entries only as needed

Interpretation rules:

- prefer explicit values in this sheet over inferred values from prose docs
- treat any field marked `placeholder` or listed in `Unresolved Tuning Questions` as non-final
- preserve stable ids even if display names or balance values change later

## Schema Summary

| Field | Type | Allowed / Format | Notes |
| --- | --- | --- | --- |
| `id` | enum string | `building.*` | Stable internal id. |
| `display_name` | string | title case | Player-facing label. |
| `category` | enum string | `core`, `housing`, `food`, `extraction`, `storage`, `construction`, `defense`, `logistics`, `magic`, `defense_support` | Use one primary value only. |
| `ownership` | enum string | `shared`, `faction_specific` | This sheet uses `shared` only. |
| `milestone_required` | bool | `true`, `false` | Required for first implementation milestone. |
| `prototype_priority` | enum string | `p2_minimum`, `later_in_milestone`, `optional_in_milestone` | Maps to backlog sequencing. |
| `footprint` | string | `WxH cells`, `linear segment`, or `starts_built` | Placement-map shorthand. |
| `terrain_constraints` | short string list | semicolon-separated | Use placement-rule language, not flavor text. |
| `construction_cost` | resource tuple | `Wood:X, Stone:Y, Food:Z, Mana:W` or `starts_built` | Omit zero-cost resources when helpful. |
| `repair_rule` | enum string | `A`, `B`, `C`, `special` | See Shared Data Conventions. |
| `build_progress` | int or `starts_built` | numeric | Shared build-progress system. |
| `jobs_created` | string list | comma-separated; use `role xN` for repeated slots | Job opportunities created by the building. |
| `worker_roles` | string list | comma-separated | Roles that operate, build, or maintain it. |
| `inputs` | short string list | comma-separated | Ongoing requirement or source dependency. |
| `outputs` | short string list | comma-separated | Production or functional outputs. |
| `storage_effects` | short string list | comma-separated | Capacity deltas only. |
| `durability_band` | enum string | `light`, `medium`, `heavy`, `fortified` | Placeholder survivability band. |
| `fire_band` | enum string | `none`, `low`, `medium`, `high` | Placeholder fire vulnerability band. |
| `legibility_effects` | short string list | comma-separated | Warning / visibility / command-site behavior only. |
| `named_command_site` | enum string | `yes`, `no`, `conditional`, `contributes_only` | Naming behavior. |
| `faction_override_hooks` | short string list | comma-separated | Allowed future overlay axes. |

## Shared Data Conventions

| Field | Placeholder Rule |
| --- | --- |
| Placement cell | `1 cell = ~4m x 4m` on the surveyed placement map. This is a prototype placeholder, not a final rendering or nav-grid commitment. |
| Cost units | Construction cost uses stockpiled `Food`, `Wood`, `Stone`, `Mana`. If omitted, assume `0`. |
| Build progress | Uses the shared `Build Progress` model from the economy doc. |
| Job model | `Jobs created` means job opportunities enabled by the building, not hard assignment slots. |
| Inputs / outputs | Unless noted otherwise, ongoing values are per in-game day. Harvest-cycle outputs are called out explicitly. |
| Repair rule A | `Light repair`: cost up to `50%` of build cost at `100%` damage, scales linearly by missing durability. |
| Repair rule B | `Structural repair`: cost up to `60%` of build cost at `100%` damage, scales linearly by missing durability. |
| Repair rule C | `Infrastructure repair`: cost up to `40%` of build cost at `100%` damage, scales linearly by missing durability. |
| Destroyed rebuild rule | If reduced to rubble, rebuild by paying full build cost again. Future salvage can override this later. |
| Durability band | `Light`, `Medium`, `Heavy`, `Fortified` are expectation bands for the first prototype, not final HP values. |
| Fire band | `High`, `Medium`, `Low`, `None` expresses expected vulnerability and spread behavior priority. |
| Named command site | `Yes` means the building should create or strongly support a named site for alerts, orders, or reports. |
| Faction override hooks | Every shared building may later accept overlay fields for rename, art set, cost delta, stat delta, special rule, and command-site behavior. |
| Prototype priority | Uses the implementation labels defined in `Prototype Sequencing Rule`. |

## Roster Summary

| id | display_name | category | milestone_required | prototype_priority | footprint | cost | jobs | core outputs / effects |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `building.tower_core` | `Tower Core` | `core` | `true` | `p2_minimum` | `2x2 cells; starts_built` | `starts_built` | `tower service`, `magical maintenance` | `+2 Mana/day`, `+20 protected storage`, `+40 mana cap`, command anchor |
| `building.house` | `House` | `housing` | `true` | `p2_minimum` | `2x2 cells` | `Wood:20, Stone:5` | none | `+6 housing capacity` |
| `building.field` | `Field` | `food` | `true` | `p2_minimum` | `3x3 cells` | `Wood:12` | `farmer` | `24 Food / 6 days` |
| `building.pasture` | `Pasture` | `food` | `true` | `later_in_milestone` | `4x4 cells` | `Wood:16` | `herder` | `up to 3 Food/day`, herd-based |
| `building.woodcutter_camp` | `Woodcutter Camp` | `extraction` | `true` | `p2_minimum` | `2x2 cells` | `Wood:14` | `woodcutter` | `8 Wood/day` |
| `building.quarry` | `Quarry` | `extraction` | `true` | `later_in_milestone` | `3x3 cells` | `Wood:16, Stone:6` | `quarry worker` | `5 Stone/day` |
| `building.storehouse` | `Storehouse` | `storage` | `true` | `p2_minimum` | `3x2 cells` | `Wood:18, Stone:6` | `hauler` | `+120 storage`, `+40 protected food storage` |
| `building.builders_yard` | `Builder's Yard` | `construction` | `true` | `p2_minimum` | `3x2 cells` | `Wood:18, Stone:8` | `builder x2` | build / repair throughput unlock |
| `building.mana_well_tap` | `Mana Well Tap` | `magic` | `true` | `later_in_milestone` | `2x2 cells` | `Wood:12, Stone:10` | `mana tender` | `+10 Mana/day`, `+20 mana cap` |
| `building.palisade_segment` | `Palisade` | `defense` | `true` | `p2_minimum` | `linear segment` | `Wood:2 per segment` | none | light barrier, route shaping |
| `building.gate` | `Gate` | `defense` | `true` | `p2_minimum` | `1x1 cells` | `Wood:8, Stone:2` | none | route control, chokepoint |
| `building.road_segment` | `Road` | `logistics` | `true` | `p2_minimum` | `linear segment` | `Wood:1 per segment` | none | `+50%` move / haul throughput |
| `building.watchtower` | `Watchtower` | `defense_support` | `false` | `optional_in_milestone` | `1x1 cells` | `Wood:12, Stone:4` | `lookout` | warning lead time, report quality |
| `building.guard_post` | `Guard Post` | `defense_support` | `false` | `optional_in_milestone` | `1x1 cells` | `Wood:14, Stone:4` | `guard` | local readiness, rally support |
| `building.mana_reservoir` | `Mana Reservoir` | `magic` | `false` | `optional_in_milestone` | `2x2 cells` | `Wood:10, Stone:12` | `magical maintenance` | `+60 mana cap` |

## First-Playable Building Roster

## `building.tower_core`

| Field | Value |
| --- | --- |
| `display_name` | `Tower Core` |
| `category` | `core` |
| `ownership` | `shared` |
| `milestone_required` | `true` |
| `prototype_priority` | `p2_minimum` |
| `footprint` | `2x2 cells; starts_built` |
| `terrain_constraints` | `starting site only`; `not player-placeable in milestone 1` |
| `construction_cost` | `starts_built` |
| `repair_rule` | `special` |
| `build_progress` | `starts_built` |
| `jobs_created` | `tower service`, `magical maintenance` |
| `worker_roles` | `tower servant`, `mana tender` |
| `inputs` | none |
| `outputs` | `+2 Mana/day`, `command anchor`, `spellcasting enabled` |
| `storage_effects` | `+20 protected general storage`, `+40 mana capacity` |
| `durability_band` | `heavy` |
| `fire_band` | `low` |
| `legibility_effects` | `primary live-view anchor`, `primary alert orientation anchor`, `root command context` |
| `named_command_site` | `yes` |
| `faction_override_hooks` | `tower_name`, `visual_set`, `mana_delta`, `command_aura`, `tower_rule` |

## `building.house`

| Field | Value |
| --- | --- |
| `display_name` | `House` |
| `category` | `housing` |
| `ownership` | `shared` |
| `milestone_required` | `true` |
| `prototype_priority` | `p2_minimum` |
| `footprint` | `2x2 cells` |
| `terrain_constraints` | `surveyed terrain`; `no water`; `avoid steep slope`; `reachable ground path required` |
| `construction_cost` | `Wood:20, Stone:5` |
| `repair_rule` | `A` |
| `build_progress` | `24` |
| `jobs_created` | none |
| `worker_roles` | `builder`, `repair worker` |
| `inputs` | none |
| `outputs` | none |
| `storage_effects` | `+6 housing capacity` |
| `durability_band` | `light` |
| `fire_band` | `high` |
| `legibility_effects` | `civilian protection site`, `shelter alert target`, `damage alert target` |
| `named_command_site` | `conditional` |
| `faction_override_hooks` | `shelter_priority`, `housing_morale`, `style_variant`, `protected_household_rule` |

## `building.field`

| Field | Value |
| --- | --- |
| `display_name` | `Field` |
| `category` | `food` |
| `ownership` | `shared` |
| `milestone_required` | `true` |
| `prototype_priority` | `p2_minimum` |
| `footprint` | `3x3 cells` |
| `terrain_constraints` | `surveyed terrain`; `reasonably flat`; `open ground`; `no water`; `not rocky`; `clear dense trees first` |
| `construction_cost` | `Wood:12` |
| `repair_rule` | `C` |
| `build_progress` | `14` |
| `jobs_created` | `farmer` |
| `worker_roles` | `farmer`, `general laborer` |
| `inputs` | none |
| `outputs` | `24 Food / 6 days if intact` |
| `storage_effects` | none |
| `durability_band` | `light` |
| `fire_band` | `high` |
| `legibility_effects` | `economic warning target`, `crop fire alert target` |
| `named_command_site` | `yes` |
| `faction_override_hooks` | `crop_type`, `yield_delta`, `protection_bias`, `terrain_bonus_tags` |

## `building.pasture`

| Field | Value |
| --- | --- |
| `display_name` | `Pasture` |
| `category` | `food` |
| `ownership` | `shared` |
| `milestone_required` | `true` |
| `prototype_priority` | `later_in_milestone` |
| `footprint` | `4x4 cells` |
| `terrain_constraints` | `surveyed terrain`; `gentle slope allowed`; `not dense forest`; `not rocky`; `fenced walkable ground required` |
| `construction_cost` | `Wood:16` |
| `repair_rule` | `C` |
| `build_progress` | `16` |
| `jobs_created` | `herder` |
| `worker_roles` | `herder`, `general laborer` |
| `inputs` | `livestock assignment`; `up to 6 sheep/goats` |
| `outputs` | `up to 3 Food/day`; `0.5 Food/day per living present animal` |
| `storage_effects` | none |
| `durability_band` | `light` |
| `fire_band` | `medium` |
| `legibility_effects` | `breach alert target`, `livestock-loss alert target` |
| `named_command_site` | `yes` |
| `faction_override_hooks` | `animal_type`, `herd_cap_delta`, `resilience_rule`, `terrain_affinity`, `civic_protection_rule` |

## `building.woodcutter_camp`

| Field | Value |
| --- | --- |
| `display_name` | `Woodcutter Camp` |
| `category` | `extraction` |
| `ownership` | `shared` |
| `milestone_required` | `true` |
| `prototype_priority` | `p2_minimum` |
| `footprint` | `2x2 cells` |
| `terrain_constraints` | `surveyed terrain`; `near harvestable trees`; `practical hauling distance required` |
| `construction_cost` | `Wood:14` |
| `repair_rule` | `A` |
| `build_progress` | `16` |
| `jobs_created` | `woodcutter` |
| `worker_roles` | `woodcutter`, `hauler` |
| `inputs` | `harvestable timber nodes` |
| `outputs` | `8 Wood/day` |
| `storage_effects` | none |
| `durability_band` | `light` |
| `fire_band` | `high` |
| `legibility_effects` | `outlying work site`, `worker exposure report source`, `edge pressure alert source` |
| `named_command_site` | `yes` |
| `faction_override_hooks` | `yield_delta`, `woodland_placement_mod`, `safer_camp_variant`, `warning_coverage` |

## `building.quarry`

| Field | Value |
| --- | --- |
| `display_name` | `Quarry` |
| `category` | `extraction` |
| `ownership` | `shared` |
| `milestone_required` | `true` |
| `prototype_priority` | `later_in_milestone` |
| `footprint` | `3x3 cells` |
| `terrain_constraints` | `surveyed terrain`; `stone-bearing ground required`; `no water`; `avoid steep unworkable cliffs` |
| `construction_cost` | `Wood:16, Stone:6` |
| `repair_rule` | `B` |
| `build_progress` | `20` |
| `jobs_created` | `quarry worker` |
| `worker_roles` | `quarry worker`, `hauler` |
| `inputs` | `stone deposit`, `quarryable terrain` |
| `outputs` | `5 Stone/day` |
| `storage_effects` | none |
| `durability_band` | `medium` |
| `fire_band` | `low` |
| `legibility_effects` | `strategic material site`, `collapse alert target`, `attack alert target` |
| `named_command_site` | `yes` |
| `faction_override_hooks` | `yield_delta`, `terrain_fit_bonus`, `safer_cut_variant`, `visual_set` |

## `building.storehouse`

| Field | Value |
| --- | --- |
| `display_name` | `Storehouse` |
| `category` | `storage` |
| `ownership` | `shared` |
| `milestone_required` | `true` |
| `prototype_priority` | `p2_minimum` |
| `footprint` | `3x2 cells` |
| `terrain_constraints` | `surveyed terrain`; `reasonably flat`; `path or road access strongly recommended` |
| `construction_cost` | `Wood:18, Stone:6` |
| `repair_rule` | `B` |
| `build_progress` | `18` |
| `jobs_created` | `hauler` |
| `worker_roles` | `hauler`, `storekeeper` |
| `inputs` | `any hauled stockpiled resource` |
| `outputs` | none |
| `storage_effects` | `+120 general storage`, `+40 protected food storage` |
| `durability_band` | `medium` |
| `fire_band` | `medium` |
| `legibility_effects` | `critical logistics site`, `recovery alert target`, `fire alert target`, `priority-repair target` |
| `named_command_site` | `yes` |
| `faction_override_hooks` | `protected_storage_bonus`, `rebuild_priority_bonus`, `civic_name`, `storage_tags` |

## `building.builders_yard`

| Field | Value |
| --- | --- |
| `display_name` | `Builder's Yard` |
| `category` | `construction` |
| `ownership` | `shared` |
| `milestone_required` | `true` |
| `prototype_priority` | `p2_minimum` |
| `footprint` | `3x2 cells` |
| `terrain_constraints` | `surveyed terrain`; `reasonably flat`; `road connection preferred` |
| `construction_cost` | `Wood:18, Stone:8` |
| `repair_rule` | `B` |
| `build_progress` | `20` |
| `jobs_created` | `builder x2` |
| `worker_roles` | `builder`, `repair worker`, `hauler` |
| `inputs` | `construction materials from stockpile` |
| `outputs` | `dedicated build throughput`, `dedicated repair throughput`, `construction prioritization` |
| `storage_effects` | none |
| `durability_band` | `medium` |
| `fire_band` | `medium` |
| `legibility_effects` | `recovery site`, `rebuild-readiness indicator`, `damage alert target` |
| `named_command_site` | `yes` |
| `faction_override_hooks` | `recovery_priority_tuning`, `throughput_delta`, `construction_doctrine_tags` |

## `building.mana_well_tap`

| Field | Value |
| --- | --- |
| `display_name` | `Mana Well Tap` |
| `category` | `magic` |
| `ownership` | `shared` |
| `milestone_required` | `true` |
| `prototype_priority` | `later_in_milestone` |
| `footprint` | `2x2 cells` |
| `terrain_constraints` | `surveyed terrain`; `valid mana source required` |
| `construction_cost` | `Wood:12, Stone:10` |
| `repair_rule` | `B` |
| `build_progress` | `22` |
| `jobs_created` | `mana tender` |
| `worker_roles` | `mana tender`, `magical maintenance` |
| `inputs` | `valid mana source` |
| `outputs` | `+10 Mana/day`, `+20 mana capacity` |
| `storage_effects` | `+20 mana capacity` |
| `durability_band` | `medium` |
| `fire_band` | `low` |
| `legibility_effects` | `critical infrastructure`, `mana disruption alert target`, `outage alert target` |
| `named_command_site` | `yes` |
| `faction_override_hooks` | `display_name_override`, `throughput_delta`, `ritual_requirement`, `command_site_behavior` |

## `building.palisade_segment`

| Field | Value |
| --- | --- |
| `display_name` | `Palisade` |
| `category` | `defense` |
| `ownership` | `shared` |
| `milestone_required` | `true` |
| `prototype_priority` | `p2_minimum` |
| `footprint` | `linear segment` |
| `terrain_constraints` | `surveyed terrain`; `grounded route only`; `no deep water`; `avoid excessive slope`; `must respect routing-rule constraints` |
| `construction_cost` | `Wood:2 per segment` |
| `repair_rule` | `C` |
| `build_progress` | `3 per segment` |
| `jobs_created` | none |
| `worker_roles` | `builder`, `repair worker` |
| `inputs` | none |
| `outputs` | `light barrier`, `route shaping`, `pass blocking` |
| `storage_effects` | none |
| `durability_band` | `light` |
| `fire_band` | `high` |
| `legibility_effects` | `breach surface`, `damage-state readability required` |
| `named_command_site` | `contributes_only` |
| `faction_override_hooks` | `material_variant`, `durability_delta`, `warning_attachment`, `doctrine_tags` |

## `building.gate`

| Field | Value |
| --- | --- |
| `display_name` | `Gate` |
| `category` | `defense` |
| `ownership` | `shared` |
| `milestone_required` | `true` |
| `prototype_priority` | `p2_minimum` |
| `footprint` | `1x1 cells` |
| `terrain_constraints` | `surveyed terrain`; `must snap into palisade line`; `passable ground required` |
| `construction_cost` | `Wood:8, Stone:2` |
| `repair_rule` | `B` |
| `build_progress` | `10` |
| `jobs_created` | none |
| `worker_roles` | `builder`, `repair worker`, `guard` |
| `inputs` | none |
| `outputs` | `controllable opening`, `route control`, `chokepoint behavior` |
| `storage_effects` | none |
| `durability_band` | `medium` |
| `fire_band` | `medium` |
| `legibility_effects` | `high-priority alert site`, `order target`, `route-open-close target` |
| `named_command_site` | `yes` |
| `faction_override_hooks` | `gate_control_behavior`, `guard_synergy`, `civic_variant`, `ritual_variant` |

## `building.road_segment`

| Field | Value |
| --- | --- |
| `display_name` | `Road` |
| `category` | `logistics` |
| `ownership` | `shared` |
| `milestone_required` | `true` |
| `prototype_priority` | `p2_minimum` |
| `footprint` | `linear segment` |
| `terrain_constraints` | `surveyed terrain`; `grounded route only`; `moderate slope allowed`; `prefer cleared terrain` |
| `construction_cost` | `Wood:1 per segment` |
| `repair_rule` | `C` |
| `build_progress` | `1 per segment` |
| `jobs_created` | none |
| `worker_roles` | `builder`, `hauler` |
| `inputs` | none |
| `outputs` | `+50% movement throughput`, `+50% hauling throughput` |
| `storage_effects` | none |
| `durability_band` | `light` |
| `fire_band` | `none` |
| `legibility_effects` | `route legibility support`, `non-primary warning structure` |
| `named_command_site` | `no` |
| `faction_override_hooks` | `display_name_override`, `route_bonus_delta`, `evacuation_synergy`, `rune_synergy` |

## `building.watchtower`

| Field | Value |
| --- | --- |
| `display_name` | `Watchtower` |
| `category` | `defense_support` |
| `ownership` | `shared` |
| `milestone_required` | `false` |
| `prototype_priority` | `optional_in_milestone` |
| `footprint` | `1x1 cells` |
| `terrain_constraints` | `surveyed terrain`; `elevated or edge-facing ground preferred`; `avoid blocked interior placement unless local-watch role intended` |
| `construction_cost` | `Wood:12, Stone:4` |
| `repair_rule` | `B` |
| `build_progress` | `14` |
| `jobs_created` | `lookout` |
| `worker_roles` | `lookout` |
| `inputs` | none |
| `outputs` | `warning lead time`, `report quality` |
| `storage_effects` | none |
| `durability_band` | `light` |
| `fire_band` | `medium` |
| `legibility_effects` | `alert lead-time improvement`, `report-confidence improvement`, `no automatic full player vision` |
| `named_command_site` | `yes` |
| `faction_override_hooks` | `report_quality_delta`, `alert_lead_time_delta`, `alternate_warning_structure_synergy` |

## `building.guard_post`

| Field | Value |
| --- | --- |
| `display_name` | `Guard Post` |
| `category` | `defense_support` |
| `ownership` | `shared` |
| `milestone_required` | `false` |
| `prototype_priority` | `optional_in_milestone` |
| `footprint` | `1x1 cells` |
| `terrain_constraints` | `surveyed terrain`; `place near gate road-junction worksite-edge or fallback-line` |
| `construction_cost` | `Wood:14, Stone:4` |
| `repair_rule` | `A` |
| `build_progress` | `16` |
| `jobs_created` | `guard x2` |
| `worker_roles` | `guard` |
| `inputs` | none |
| `outputs` | `local defense readiness`, `rally support` |
| `storage_effects` | none |
| `durability_band` | `light` |
| `fire_band` | `medium` |
| `legibility_effects` | `local response clarity`, `named defense site support`, `readiness support not sight support` |
| `named_command_site` | `yes` |
| `faction_override_hooks` | `guard_doctrine`, `rally_bonus`, `militia_variant`, `legitimacy_modifier`, `discipline_modifier` |

## `building.mana_reservoir`

| Field | Value |
| --- | --- |
| `display_name` | `Mana Reservoir` |
| `category` | `magic` |
| `ownership` | `shared` |
| `milestone_required` | `false` |
| `prototype_priority` | `optional_in_milestone` |
| `footprint` | `2x2 cells` |
| `terrain_constraints` | `surveyed terrain`; `reasonably flat`; `tower or mana network connection required by rule` |
| `construction_cost` | `Wood:10, Stone:12` |
| `repair_rule` | `B` |
| `build_progress` | `18` |
| `jobs_created` | `magical maintenance` |
| `worker_roles` | `magical maintenance` |
| `inputs` | `mana inflow from tower or intake network` |
| `outputs` | none |
| `storage_effects` | `+60 mana capacity` |
| `durability_band` | `medium` |
| `fire_band` | `low` |
| `legibility_effects` | `outage resilience support`, `reduced reserve-state alert target` |
| `named_command_site` | `yes` |
| `faction_override_hooks` | `storage_delta`, `network_rule_variant`, `ritual_styling` |

## Recommended Milestone Notes

| Rule Area | Recommended Placeholder |
| --- | --- |
| Prototype framing | Treat `P2 minimum` as the first engineering slice. Add `Later in milestone` entries once the rebuild loop is readable, then layer `Optional in milestone` support structures after the shared baseline works. |
| Shared baseline vs Sabine overlay | All buildings in this sheet remain shared baseline data entries. Sabine-specific content should ship as additive overlays, not separate duplicate building definitions. |
| Sabine-specific structure not listed here | `Bell Post` should remain outside this sheet until the shared baseline roster is implemented, then be added as a faction-overlay data entry or a thin derived building spec. |
| Mana naming | Implement one shared data archetype with display-name override support: `Mana Well Tap` by default, `Ley-Line Intake` as a faction or map-context rename. |
| Site naming | `Tower Core`, `Field`, `Pasture`, `Storehouse`, `Builder's Yard`, `Mana Well Tap`, `Gate`, `Watchtower`, `Guard Post`, and `Mana Reservoir` should create named sites immediately. `House` and `Palisade` should usually inherit cluster or perimeter names. `Road` should not create a site by itself. |
| Data authoring recommendation | Use stable internal ids exactly as listed in this document, keep display names fully data-driven, and convert per-building tables directly into structured data rows where possible. |

## Unresolved Tuning Questions

- Should `House` always create its own named site, or only when it houses a notable household?
- Should `Pasture` use smooth per-animal output loss, or readability-friendly threshold bands in the first prototype UI?
- How strict should `Field` and `Pasture` slope rules be before terrain flattening tools exist?
- Should `Watchtower` and `Guard Post` stay separate in milestone 1, or collapse into one simpler support-defense structure for the earliest prototype?
- Should `Mana Reservoir` require explicit network adjacency to `Tower Core` or `Mana Well Tap`, or only surveyed placement plus reachable pathing?
- How much rubble salvage should destroyed structures return in the first playable, if any?
