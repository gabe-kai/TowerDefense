# NPC Schema and Value Ranges

Status: Draft
Scope: Prototype Data
Phase: Pre-production
Owner: Design
Source of Truth: No

This document translates the current NPC and social design into an implementation-facing schema reference for the first implementation milestone and first playable baseline.

It does not replace the design docs. It is a working schema spec for implementation planning, balance placeholders, simulation tuning, save-data planning, and content authoring.

All values are provisional and should be treated as recommended placeholders unless locked elsewhere.

Primary companion docs:

- `docs/social-systems-design.md`
- `docs/mvp-scope-and-prototype-plan.md`
- `docs/prototype-backlog.md`
- `docs/economy-buildings-design.md`
- `docs/factions/sabine-merrow-faction-design.md`

## Scope

- Target milestone: first implementation milestone
- Target baseline: first playable social layer for one settlement under Sabine Merrow
- Target use: NPC data authoring, simulation planning, UI surfacing decisions, balance placeholders
- Out of scope: deep romance, inheritance law, decades-long personality drift, complex ideology simulation, full long-term bond web

## Prototype Sequencing Rule

This sheet covers the first-playable NPC schema, but not every field here belongs in the earliest implementation slice.

Use three implementation labels:

- `M1 required`: required for the first implementation milestone and Prototype 4 social proof
- `First-playable later`: should exist by the first playable baseline, but can wait until after the minimum social slice works
- `Future hook only`: reserve field or schema slot now, but do not simulate deeply yet

## Reader Intent

This file is optimized for later implementation agents.

Read order:

1. `Schema Summary`
2. `Core Identity Schema`
3. `Simulation Fields`
4. `Prototype-Minimum Schema`
5. `Future Hooks`

Interpretation rules:

- prefer explicit values in this sheet over inferred values from prose docs
- treat any field marked `placeholder` or listed in `Unresolved Schema Questions` as non-final
- preserve stable ids even if display labels, defaults, or exact ranges change later

## Shared Data Conventions

| Rule Area | Recommended Placeholder |
| --- | --- |
| Stable id format | Use `npc.*` for individuals, `household.*` for households, and `bond.*` for relationship records if bonds become separate rows. |
| Value scale policy | Prefer `0-100` for fast-moving condition/state values, `0-5` for skills, `1-5` for core attributes, and small enums for authored categories. |
| Missing values | If a future-facing field is not simulated yet, store an explicit default or `none` value instead of leaving it undefined. |
| UI policy | Only surface values that support player decisions in the first playable. Keep hidden weights, internal biases, and debug-only derivations out of the normal UI. |
| Time model | Support `immediate`, `short interval`, `daily or wave-end`, and `event-driven` updates instead of continuous full-social simulation. |
| Household model | Household is the main social container for safety, burden, grief, child protection, and desertion pressure. |
| Loyalty model | Use one visible loyalty score in milestone 1, with hidden loyalty-target weights under the hood. |
| Children policy | Children are visible NPCs with household membership and risk, but not full workers in milestone 1. |
| Death policy | Missing, wounded, dead, and bedridden should all be distinct states even if the first implementation handles them simply. |
| Placeholder-first policy | When long-term design is unclear, create a reserved field with a narrow enum or scalar placeholder rather than vague prose. |

## Schema Summary

| Field | Type | Allowed / Format | Visibility | Implementation Priority | Notes |
| --- | --- | --- | --- | --- | --- |
| `id` | enum string | `npc.*` | hidden | `M1 required` | Stable internal id. |
| `household_id` | enum string | `household.*` or `none` | hidden | `M1 required` | Primary social grouping key. |
| `display_name` | string | title case | visible | `M1 required` | Full player-facing name. |
| `given_name` | string | text | hidden | `First-playable later` | Useful for localization and procedural naming later. |
| `family_name` | string | text or `none` | hidden | `First-playable later` | Supports family-line hooks later. |
| `age_years` | int | `0-90` placeholder | hidden | `M1 required` | Numeric age for simulation rules. |
| `age_class` | enum string | `infant`, `child`, `youth`, `adult`, `elder` | visible | `M1 required` | Use class, not raw years, for most rules. |
| `sex` | enum string | `female`, `male`, `unknown`, `unspecified` | hidden | `Future hook only` | Reserve only if later family-line systems need it. |
| `origin_type` | enum string | `tower_born`, `village_born`, `migrant`, `retainer`, `refugee`, `rescued_outsider` | hidden | `M1 required` | Core settlement-history field. |
| `arrival_context` | enum string | `start_settler`, `joined_peacefully`, `joined_after_disaster`, `born_here`, `rescued`, `appointed` | hidden | `First-playable later` | Helps migration and event logic. |
| `household_role` | enum string | `head`, `partner`, `child`, `elder`, `dependent`, `lodger`, `servant` | hidden | `M1 required` | Household burden and protection logic. |
| `settlement_role` | enum string | `villager`, `laborer`, `artisan`, `guard`, `lookout`, `retainer`, `servant`, `apprentice`, `dependent` | visible | `M1 required` | Main player-facing role label. |
| `status` | enum string | `active`, `wounded`, `bedridden`, `drafted`, `missing`, `dead` | visible | `M1 required` | Distinct support for wounded, missing, and dead. |
| `is_child_dependent` | bool | `true`, `false` | hidden | `M1 required` | Quick dependency rule. |
| `is_primary_caregiver` | bool | `true`, `false` | hidden | `M1 required` | Important for drafting and shelter logic. |
| `dependent_count` | int | `0-8` placeholder | hidden | `First-playable later` | For burden and importance weighting. |
| `body` | int | `1-5` | visible in detail view | `M1 required` | Physical labor and resilience. |
| `mind` | int | `1-5` | visible in detail view | `M1 required` | Learning and complex work. |
| `nerve` | int | `1-5` | visible in detail view | `M1 required` | Panic resistance and danger tolerance. |
| `skill_farming` | int | `0-5` | visible in detail view | `M1 required` | Core skill. |
| `skill_hauling` | int | `0-5` | visible in detail view | `M1 required` | Core skill. |
| `skill_building` | int | `0-5` | visible in detail view | `M1 required` | Core skill. |
| `skill_crafting` | int | `0-5` | visible in detail view | `M1 required` | Core skill. |
| `skill_tending` | int | `0-5` | visible in detail view | `M1 required` | Caregiving, recovery, animal care. |
| `skill_guard` | int | `0-5` | visible in detail view | `M1 required` | Defense capability. |
| `skill_lore` | int | `0-5` | visible in detail view | `First-playable later` | Useful once lore or mana work matters more. |
| `skill_leadership` | int | `0-5` | visible in detail view | `First-playable later` | Strong hook for guards, retainers, and important villagers. |
| `trait_bravery` | int | `-2 to 2` | hidden | `M1 required` | Stable personality trait. |
| `trait_diligence` | int | `-2 to 2` | hidden | `M1 required` | Stable personality trait. |
| `trait_sociability` | int | `-2 to 2` | hidden | `M1 required` | Stable personality trait. |
| `trait_obedience` | int | `-2 to 2` | hidden | `M1 required` | Stable personality trait. |
| `trait_tenderness` | int | `-2 to 2` | hidden | `M1 required` | Stable personality trait. |
| `work_like_1` | enum string | job tag or `none` | hidden | `M1 required` | Preference hook. |
| `work_like_2` | enum string | job tag or `none` | hidden | `First-playable later` | Optional second like. |
| `work_dislike_1` | enum string | job tag or `none` | hidden | `M1 required` | Preference hook. |
| `work_dislike_2` | enum string | job tag or `none` | hidden | `First-playable later` | Optional second dislike. |
| `value_preference` | enum string | `safety`, `fairness`, `status`, `family`, `piety`, `freedom`, `service` | hidden | `M1 required` | One primary value orientation. |
| `health` | int | `0-100` | hidden or debug | `M1 required` | Core physical survivability. |
| `injury` | int | `0-100` | hidden or debug | `M1 required` | Distinct from health for recovery logic. |
| `fatigue` | int | `0-100` | hidden | `First-playable later` | Helps work and recovery pacing. |
| `hunger` | int | `0-100` | hidden | `First-playable later` | Use even if food UI stays pooled. |
| `morale` | int | `0-100` | visible | `M1 required` | Core visible social state. |
| `loyalty` | int | `0-100` | visible | `M1 required` | Visible tower-obedience score. |
| `fear` | int | `0-100` | hidden or situationally visible | `M1 required` | Immediate danger response. |
| `stress` | int | `0-100` | hidden | `M1 required` | Long-burn strain meter. |
| `grief` | int | `0-100` | visible | `M1 required` | Loss and mourning load. |
| `belonging` | int | `0-100` | hidden or summary-level visible | `M1 required` | Rootedness and anti-desertion anchor. |
| `importance` | int | `0-100` | hidden | `M1 required` | Internal consequence weighting. |
| `loyalty_household_weight` | int | `0-100` | hidden | `First-playable later` | Hidden split loyalty target. |
| `loyalty_village_weight` | int | `0-100` | hidden | `First-playable later` | Hidden split loyalty target. |
| `loyalty_tower_weight` | int | `0-100` | hidden | `First-playable later` | Hidden split loyalty target. |
| `loyalty_master_weight` | int | `0-100` | hidden | `First-playable later` | Hidden split loyalty target. |
| `draft_eligibility` | enum string | `eligible`, `reluctant`, `restricted`, `ineligible` | hidden | `M1 required` | Quick draft rules. |
| `draft_experience` | int | `0-3` | hidden | `First-playable later` | Prior militia or levy familiarity. |
| `current_assignment` | enum string | job tag, `idle`, `sheltering`, `evacuating`, `recovering`, `missing`, `dead` | visible in detail view | `M1 required` | Current role and state display. |
| `shelter_site_id` | string | site id or `none` | hidden | `First-playable later` | Helps evacuation and child safety. |
| `bond_count` | int | `0-16` placeholder | hidden | `Future hook only` | Lightweight fast lookup. |
| `notable_bond_ids` | string list | `bond.*` or npc ids | hidden | `First-playable later` | Enough for grief and social response. |

## Core Identity Schema

### NPC Id Assumptions

| Field | Recommendation |
| --- | --- |
| `id` | stable internal string such as `npc.founding_household_01_adult_a` |
| id stability rule | never reuse an id after death, migration, or save/load removal |
| content authoring rule | authored starting NPCs should use human-readable ids; generated migrants can use deterministic numeric suffixes |
| household linkage rule | `household_id` must remain stable even if the NPC changes jobs |
| save-data rule | id must be safe for save files, event logs, and bond references |

### Naming Fields

| Field | Type | Range / Format | Default | Priority | Notes |
| --- | --- | --- | --- | --- | --- |
| `display_name` | string | full name | required | `M1 required` | Only required player-facing name field in milestone 1. |
| `given_name` | string | text | copy from display-name parse or authored | `First-playable later` | Reserve for future text systems. |
| `family_name` | string | text or `none` | `none` | `First-playable later` | Useful when family lines matter more. |
| `name_seed` | int | any int | `0` | `Future hook only` | Useful for procedural generation consistency. |

### Age Fields and Age Classes

| Field | Type | Recommended Range | Default | Priority | Notes |
| --- | --- | --- | --- | --- | --- |
| `age_years` | int | `0-90` | authored | `M1 required` | Hidden driver for age-class assignment. |
| `age_class` | enum | `infant`, `child`, `youth`, `adult`, `elder` | derived from age | `M1 required` | Prefer class checks over exact years in most gameplay. |
| `is_child_dependent` | bool | `true`, `false` | derived | `M1 required` | `true` for `infant` and `child`; usually `false` otherwise. |

Recommended placeholder age bands:

| Age Class | Placeholder Years | Gameplay Role |
| --- | --- | --- |
| `infant` | `0-3` | fully dependent, cannot self-evacuate |
| `child` | `4-11` | visible dependent, limited self-movement, no normal labor |
| `youth` | `12-15` | still dependent by default, future apprentice hook |
| `adult` | `16-59` | standard worker and defender pool |
| `elder` | `60+` | adult logic with higher burden and lower draft expectation |

### Origin Fields

| Field | Type | Allowed Values | Default | Priority | Notes |
| --- | --- | --- | --- | --- | --- |
| `origin_type` | enum | `tower_born`, `village_born`, `migrant`, `retainer`, `refugee`, `rescued_outsider` | authored | `M1 required` | Core identity and belonging input. |
| `arrival_context` | enum | `start_settler`, `joined_peacefully`, `joined_after_disaster`, `born_here`, `rescued`, `appointed` | `start_settler` | `First-playable later` | Useful for migration tuning. |
| `birth_household_id` | string | `household.*` or `none` | `none` | `Future hook only` | Preserve family-line hook. |

### Household Linkage Fields

| Field | Type | Range / Format | Default | Priority | Notes |
| --- | --- | --- | --- | --- | --- |
| `household_id` | string | `household.*` or `none` | required | `M1 required` | Required for almost all villagers and dependents. |
| `household_role` | enum | `head`, `partner`, `child`, `elder`, `dependent`, `lodger`, `servant` | `dependent` | `M1 required` | Supports burden and care logic. |
| `is_primary_caregiver` | bool | `true`, `false` | `false` | `M1 required` | Strong drafting and evacuation modifier. |
| `dependent_count` | int | `0-8` | `0` | `First-playable later` | Derived or authored. |
| `dwelling_site_id` | string | site id or `none` | `none` | `First-playable later` | Useful once housing and sheltering are spatially explicit. |

### Role and Status Fields

| Field | Type | Allowed Values | Default | Priority | Notes |
| --- | --- | --- | --- | --- | --- |
| `settlement_role` | enum | `villager`, `laborer`, `artisan`, `guard`, `lookout`, `retainer`, `servant`, `apprentice`, `dependent` | `villager` | `M1 required` | Main role tag. |
| `current_assignment` | enum | job tag or state tag | `idle` | `M1 required` | Current practical assignment. |
| `status` | enum | `active`, `wounded`, `bedridden`, `drafted`, `missing`, `dead` | `active` | `M1 required` | Do not collapse these into one damage meter. |
| `draft_eligibility` | enum | `eligible`, `reluctant`, `restricted`, `ineligible` | `eligible` | `M1 required` | Fast draft gate. |
| `draft_experience` | int | `0-3` | `0` | `First-playable later` | Prior militia familiarity hook. |

## Simulation Fields

### Core Attributes

| Field | Type | Range | Recommended Default | Sensitivity | Notes |
| --- | --- | --- | --- | --- | --- |
| `body` | int | `1-5` | `3` | medium | Affects labor, carrying, wound tolerance. |
| `mind` | int | `1-5` | `3` | medium | Affects learning, planning, complex work. |
| `nerve` | int | `1-5` | `3` | high | Affects panic resistance and dangerous-task performance. |

Recommended interpretation:

| Value | Meaning |
| --- | --- |
| `1` | notably weak |
| `2` | below average |
| `3` | ordinary adult baseline |
| `4` | strong |
| `5` | exceptional |

### Skill Fields

| Field | Type | Range | Recommended Default | Priority | Notes |
| --- | --- | --- | --- | --- | --- |
| `skill_farming` | int | `0-5` | `1` | `M1 required` | Food work baseline. |
| `skill_hauling` | int | `0-5` | `1` | `M1 required` | Logistics baseline. |
| `skill_building` | int | `0-5` | `0` | `M1 required` | Construction and repair. |
| `skill_crafting` | int | `0-5` | `0` | `M1 required` | Workshops and specialist work. |
| `skill_tending` | int | `0-5` | `0` | `M1 required` | Care work, animal handling, recovery support. |
| `skill_guard` | int | `0-5` | `0` | `M1 required` | Defense and standing watch. |
| `skill_lore` | int | `0-5` | `0` | `First-playable later` | Mana and arcane utility hook. |
| `skill_leadership` | int | `0-5` | `0` | `First-playable later` | Rally, command compliance, local authority. |

Recommended skill meaning:

| Value | Meaning |
| --- | --- |
| `0` | untrained |
| `1` | basic familiarity |
| `2` | competent |
| `3` | strong |
| `4` | expert |
| `5` | settlement-defining specialist |

### Personality Trait Fields

| Field | Type | Range | Default | Priority | Notes |
| --- | --- | --- | --- | --- | --- |
| `trait_bravery` | int | `-2 to 2` | `0` | `M1 required` | Risk tolerance. |
| `trait_diligence` | int | `-2 to 2` | `0` | `M1 required` | Work discipline. |
| `trait_sociability` | int | `-2 to 2` | `0` | `M1 required` | Social cohesion and contagion. |
| `trait_obedience` | int | `-2 to 2` | `0` | `M1 required` | Command compliance. |
| `trait_tenderness` | int | `-2 to 2` | `0` | `M1 required` | Care, rescue, and child-protection bias. |

Recommended interpretation:

| Value | Meaning |
| --- | --- |
| `-2` | strongly opposite tendency |
| `-1` | mild opposite tendency |
| `0` | ordinary / mixed |
| `1` | mild positive tendency |
| `2` | strong positive tendency |

### Work-Like, Work-Dislike, and Value-Preference Fields

Suggested job-tag vocabulary for milestone 1:

- `food_work`
- `hauling`
- `building`
- `crafting`
- `tending`
- `tower_service`
- `defense_support`
- `direct_defense`
- `general_labor`

| Field | Type | Allowed Values | Default | Priority | Notes |
| --- | --- | --- | --- | --- | --- |
| `work_like_1` | enum | job tag or `none` | `none` | `M1 required` | One strong preference is enough for the first milestone. |
| `work_like_2` | enum | job tag or `none` | `none` | `First-playable later` | Second preference if needed. |
| `work_dislike_1` | enum | job tag or `none` | `none` | `M1 required` | One clear dislike is enough for the first milestone. |
| `work_dislike_2` | enum | job tag or `none` | `none` | `First-playable later` | Optional second dislike. |
| `value_preference` | enum | `safety`, `fairness`, `status`, `family`, `piety`, `freedom`, `service` | `family` for common villagers | `M1 required` | Primary decision weight anchor. |

### Condition and State Fields

| Field | Type | Range | Recommended Default | Priority | Notes |
| --- | --- | --- | --- | --- | --- |
| `health` | int | `0-100` | `100` | `M1 required` | Overall physical survivability. |
| `injury` | int | `0-100` | `0` | `M1 required` | Distinct harm burden, not just missing health. |
| `fatigue` | int | `0-100` | `20` | `First-playable later` | Daily wear and overwork pressure. |
| `hunger` | int | `0-100` | `15` | `First-playable later` | Hidden individual food stress hook. |
| `morale` | int | `0-100` | `65` | `M1 required` | Main visible social readiness value. |
| `loyalty` | int | `0-100` | `55` | `M1 required` | Visible tower loyalty. |
| `fear` | int | `0-100` | `10` | `M1 required` | Immediate hazard response. |
| `stress` | int | `0-100` | `20` | `M1 required` | Long-burn pressure. |
| `grief` | int | `0-100` | `0` | `M1 required` | Loss burden. |
| `belonging` | int | `0-100` | `60` settlers, `40` migrants | `M1 required` | Rootedness and anti-desertion anchor. |
| `importance` | int | `0-100` | `20` | `M1 required` | Internal event and consequence weighting. |

Recommended thresholds for `morale`, `loyalty`, `fear`, `stress`, `grief`, and `belonging`:

| Band | Range | Use |
| --- | --- | --- |
| `very_low` | `0-19` | crisis or severe instability |
| `low` | `20-39` | unstable |
| `mid` | `40-59` | ordinary strained baseline |
| `high` | `60-79` | healthy baseline |
| `very_high` | `80-100` | exceptional state, use sparingly |

### Visible Versus Hidden Fields

#### Surface In Normal UI

- `display_name`
- `age_class`
- `settlement_role`
- `status`
- `current_assignment`
- `household` or household name
- `Body`
- `Mind`
- `Nerve`
- core skills actually relevant to current jobs
- `morale`
- `loyalty`
- `grief`
- child or caregiver markers when relevant

#### Hide In Normal UI

- raw trait scores
- full hidden loyalty-target weights
- `fear`, unless during an active crisis or debug view
- `stress`, unless the design later adds a clearer player action loop around it
- `importance`
- `hunger` and `fatigue` while food remains pooled and sleep is abstracted
- full bond graph details unless a character-specific panel needs them

#### Debug or Tuning View Only

- exact state values for all `0-100` fields
- hidden loyalty weights
- draft-eligibility derivation
- importance calculation inputs
- job scoring contributors

## First-Playable Update Cadence Expectations

| Cadence | Fields / Systems | Notes |
| --- | --- | --- |
| `immediate` | `fear`, `status`, `current_assignment`, civilian exposure state, shelter response | Use for attacks, breaches, fire, nearby deaths. |
| `short interval` | job choice, path-to-shelter decisions, draft response, work continuation or refusal | Suggested every few simulation seconds or similar coarse tick. |
| `daily or wave-end` | `morale`, `loyalty`, `stress`, `grief`, `belonging`, `importance` refresh | Batch most social math here for readability and tuning control. |
| `event-driven` | death, missing, wound, birth hook, migration, household split, caregiver loss, promoted role | Keep big social events explicit and loggable. |

## Recommended Defaults

### Baseline Adult Villager

| Field | Recommended Default |
| --- | --- |
| `age_class` | `adult` |
| `settlement_role` | `villager` |
| `status` | `active` |
| `body` / `mind` / `nerve` | `3 / 3 / 3` |
| core skills | `1` in likely daily work, `0-1` elsewhere |
| traits | all `0` unless authored otherwise |
| `work_like_1` | likely job family or `general_labor` |
| `work_dislike_1` | one unsuitable or dangerous job family |
| `value_preference` | `family` or `safety` |
| `health` | `100` |
| `injury` | `0` |
| `morale` | `65` |
| `loyalty` | `55` |
| `fear` | `10` |
| `stress` | `20` |
| `grief` | `0` |
| `belonging` | `60` |
| `importance` | `20` |
| `draft_eligibility` | `eligible` |

### Baseline Child Dependent

| Field | Recommended Default |
| --- | --- |
| `age_class` | `child` |
| `settlement_role` | `dependent` |
| `status` | `active` |
| `is_child_dependent` | `true` |
| `is_primary_caregiver` | `false` |
| `body` / `mind` / `nerve` | `1 / 2 / 1` |
| all skills | `0` |
| `morale` | `70` |
| `loyalty` | `50` |
| `fear` | `20` |
| `stress` | `10` |
| `grief` | `0` |
| `belonging` | `70` if tower-born or village-born, `45` if refugee |
| `draft_eligibility` | `ineligible` |

### Baseline Retainer or Guard

| Field | Recommended Default |
| --- | --- |
| `settlement_role` | `retainer` or `guard` |
| `body` / `mind` / `nerve` | `3 / 3 / 4` |
| `skill_guard` | `2` |
| `skill_leadership` | `1` if sergeant-like |
| `trait_obedience` | `1` |
| `loyalty` | `65` |
| `belonging` | `50-60` |
| `draft_eligibility` | `eligible` |

## Household and Bond Relationship Hooks

### Minimum Household Data Expected Alongside NPC Records

| Field | Type | Priority | Notes |
| --- | --- | --- | --- |
| `household.id` | string | `M1 required` | Stable household key. |
| `member_ids` | string list | `M1 required` | Includes children and dependents. |
| `dwelling_site_id` | string or `none` | `M1 required` | Needed for housing, shelter, and displacement. |
| `food_security` | int `0-100` | `First-playable later` | Hidden if food remains pooled. |
| `safety` | int `0-100` | `M1 required` | Household-level danger pressure. |
| `burden` | int `0-100` | `M1 required` | Dependents, injury, housing loss, overwork. |
| `bereavement` | int `0-100` | `M1 required` | Household grief summary. |
| `absent_member_count` | int | `M1 required` | Supports missing, drafted, dead. |

### Bond Relationship Hooks

Recommended first-pass bond model:

| Field | Type | Range / Format | Priority | Notes |
| --- | --- | --- | --- | --- |
| `bond_type` | enum | `spouse_partner`, `parent_child`, `sibling`, `kin`, `close_friend`, `rival`, `protector_dependent` | `First-playable later` | Keep the list small. |
| `target_npc_id` | string | `npc.*` | `First-playable later` | Bond target. |
| `closeness` | int | `0-100` | `First-playable later` | Main grief and support weight. |
| `trust` | int | `0-100` | `Future hook only` | Useful later for conflicts and persuasion. |
| `strain` | int | `0-100` | `Future hook only` | Useful later for disputes and household splits. |

Recommendation:

- milestone 1 can work with parent-child and partner links only
- first playable can add friend, rival, and protector-dependent hooks if needed
- do not build a broad freeform social graph yet

## Draft-Related Values

| Field | Type | Allowed / Range | Default | Priority | Notes |
| --- | --- | --- | --- | --- | --- |
| `draft_eligibility` | enum | `eligible`, `reluctant`, `restricted`, `ineligible` | derived/authored | `M1 required` | Fast gating field. |
| `draft_experience` | int | `0-3` | `0` | `First-playable later` | Helps drafted performance. |
| `recent_draft_strain` | int | `0-100` | `0` | `First-playable later` | Helps resentment and fatigue. |
| `draft_response_last` | enum | `volunteer`, `comply`, `comply_resentfully`, `evade`, `refuse`, `flee`, `none` | `none` | `Future hook only` | Event memory, not required at first. |

Recommended draft-eligibility defaults:

| Case | Default |
| --- | --- |
| healthy adult villager | `eligible` |
| sole caregiver with young dependents | `restricted` |
| child | `ineligible` |
| bedridden or severe injury | `ineligible` |
| elder under heavy burden | `reluctant` |

## Death, Missing, Wounded, and Dependent Support

Support these cases from the start:

| Case | Required Representation |
| --- | --- |
| wounded adult | `status = wounded` plus non-zero `injury` |
| bedridden adult | `status = bedridden` plus high `injury` or recovery state |
| missing adult or child | `status = missing` distinct from dead |
| dead adult or child | `status = dead`, record kept, id not reused |
| child dependent | `age_class = child` or `infant`, linked household, no labor role |
| caregiver loss | household recalculates burden and draft restrictions |
| displaced household | household keeps members even if dwelling is gone |

Do not delete dead NPC records in milestone 1. Their persistence is needed for grief, logs, and consequence weighting.

## Which Fields Are Required in the First Implementation Milestone

### `M1 required`

- stable npc id
- display name
- age years
- age class
- origin type
- household id
- household role
- settlement role
- status
- child-dependent flag
- primary-caregiver flag
- `Body`, `Mind`, `Nerve`
- six core milestone skills:
  - farming
  - hauling
  - building
  - crafting
  - tending
  - guard
- five stable traits
- one work like
- one work dislike
- one value preference
- `health`
- `injury`
- `morale`
- `loyalty`
- `fear`
- `stress`
- `grief`
- `belonging`
- `importance`
- draft eligibility
- current assignment

## Which Fields Are First-Playable But Can Wait Until Later in Implementation

### `First-playable later`

- given name and family name split
- arrival context
- dependent count
- dwelling site id
- `skill_lore`
- `skill_leadership`
- second work like
- second work dislike
- `fatigue`
- `hunger`
- hidden loyalty-target weights
- draft experience
- shelter site id
- notable bond ids
- household food security as a hidden value

## Which Fields Are Future Hooks Only

### `Future hook only`

- sex field if later family-line simulation truly needs it
- birth household id
- name seed
- bond trust and strain values
- draft response memory
- bond count cache
- broad family-line genealogy beyond parent-child links
- deep ideology, religion, or doctrine fields
- long-term class or inheritance tags

## Recommended Minimum Viable NPC Record For The Very First Prototype

Use this for the earliest Prototype 4 proof that named villagers matter.

```yaml
id: npc.proto_001
display_name: Mara Fen
age_years: 31
age_class: adult
origin_type: village_born
household_id: household.fen
household_role: head
settlement_role: villager
status: active
is_child_dependent: false
is_primary_caregiver: true
body: 3
mind: 2
nerve: 3
skill_farming: 2
skill_hauling: 1
skill_building: 0
skill_crafting: 0
skill_tending: 1
skill_guard: 0
trait_bravery: 0
trait_diligence: 1
trait_sociability: 0
trait_obedience: 0
trait_tenderness: 1
work_like_1: food_work
work_dislike_1: direct_defense
value_preference: family
health: 100
injury: 0
morale: 65
loyalty: 55
fear: 10
stress: 20
grief: 0
belonging: 65
importance: 25
draft_eligibility: restricted
current_assignment: food_work
```

## Recommended First-Playable NPC Record

Use this once the broader first-playable baseline supports fuller household, social, and hidden-state hooks.

```yaml
id: npc.sabine_start_001
display_name: Tomas Alder
given_name: Tomas
family_name: Alder
age_years: 38
age_class: adult
origin_type: village_born
arrival_context: start_settler
household_id: household.alder
household_role: head
settlement_role: laborer
status: active
is_child_dependent: false
is_primary_caregiver: false
dependent_count: 2
body: 4
mind: 2
nerve: 3
skill_farming: 1
skill_hauling: 2
skill_building: 2
skill_crafting: 0
skill_tending: 0
skill_guard: 1
skill_lore: 0
skill_leadership: 0
trait_bravery: 0
trait_diligence: 1
trait_sociability: 0
trait_obedience: 1
trait_tenderness: 0
work_like_1: building
work_like_2: hauling
work_dislike_1: tower_service
work_dislike_2: none
value_preference: fairness
health: 100
injury: 0
fatigue: 20
hunger: 15
morale: 68
loyalty: 58
fear: 8
stress: 18
grief: 0
belonging: 70
importance: 28
loyalty_household_weight: 40
loyalty_village_weight: 28
loyalty_tower_weight: 22
loyalty_master_weight: 10
draft_eligibility: eligible
draft_experience: 1
current_assignment: building
shelter_site_id: site.house_alder
notable_bond_ids:
  - npc.sabine_start_002
  - npc.sabine_start_003
```

## Prototype-Minimum Schema

### Minimum NPC Record For Milestone 1

| Group | Required Fields |
| --- | --- |
| identity | `id`, `display_name`, `age_years`, `age_class`, `origin_type` |
| household | `household_id`, `household_role`, `is_child_dependent`, `is_primary_caregiver` |
| role and status | `settlement_role`, `status`, `draft_eligibility`, `current_assignment` |
| attributes | `body`, `mind`, `nerve` |
| skills | `skill_farming`, `skill_hauling`, `skill_building`, `skill_crafting`, `skill_tending`, `skill_guard` |
| personality | five stable traits, one work like, one work dislike, one value preference |
| condition | `health`, `injury`, `morale`, `loyalty`, `fear`, `stress`, `grief`, `belonging`, `importance` |

### Recommended Minimum Household Record

```yaml
id: household.fen
member_ids:
  - npc.proto_001
  - npc.proto_002
  - npc.proto_003
dwelling_site_id: site.house_fen
safety: 60
burden: 35
bereavement: 0
absent_member_count: 0
```

## UI Surfacing Guidance

### Surface Early

- name
- role
- current job or assignment
- age class
- household name or icon
- wounded, missing, dead, drafted status
- `Body`, `Mind`, `Nerve`
- a compact skill readout relevant to current role
- `morale`
- `loyalty`
- `grief`

### Hide Early

- exact hidden weights and preference math
- full loyalty split
- importance score
- second-order household burden math
- detailed bond values
- stress and fear unless the UI clearly teaches what actions change them

### Conditional or Debug Surfacing

- `fear` during active breach or evacuation
- `stress` in a social-debug or tuning panel
- draft eligibility reasons in tooltip or debug
- hidden appetite or hunger hooks in debug only

## Notes On Tuning Sensitivity

### Highest Sensitivity

- `nerve`
- `morale`
- `loyalty`
- `fear`
- `stress`
- `grief`
- `belonging`
- `importance`
- draft eligibility

Reason:

- these fields can quickly create runaway collapse, refusal loops, or unintuitive player punishment if tuned too aggressively

### Medium Sensitivity

- `body`, `mind`, `skill_*`
- stable traits
- work likes and dislikes

Reason:

- these affect job quality and personality flavor, but usually do not instantly destabilize the settlement on their own

### Low Early Sensitivity

- name split fields
- family-line hooks
- future bond metadata
- precise sex or genealogy fields

Reason:

- these are mostly authoring or future-system support and should not drive milestone-1 tuning effort

## Which Values Are Most Dangerous To Overcomplicate Too Early

- hidden loyalty-target weighting
- bond trust and strain values
- per-household food accounting in the main UI
- exact fatigue and hunger math
- large personality-trait rosters
- too many role tags
- deep draft-response memory systems
- long family-line genealogy

Recommendation:

- keep visible social state focused on `morale`, `loyalty`, and `grief`
- keep hidden simulation focused on a few readable causes: danger, housing loss, hunger pressure, casualties, unfair burden, and child risk

## Future Hooks

Fields and systems worth reserving without fully implementing now:

- full bond graph rows
- parent-child line persistence beyond immediate grief use
- youth apprenticeship promotion
- richer caregiver and protector logic
- per-household food security and ration policy
- migration memory and prior-settlement trauma
- master-specific loyalty overlays
- faction-specific value-preference weighting
- richer retainer and office-holder role tags

## Unresolved Schema Questions

- Should `age_years` stay fully numeric in data, or should milestone 1 store authored age bands and derive years only when needed?
- Should `skill_lore` exist from the first data pass, even if only a handful of retainers use it?
- Should `settlement_role` and `current_assignment` remain separate when some early prototypes may blur them?
- Should `importance` be fully authored at first, or derived from household role, rarity, and dependents with only a manual override?
- How much of `fear` should ever be player-visible outside alarms, crisis cards, or debug panels?
- Should `draft_eligibility` be stored directly, or derived at runtime from age, injury, caregiving, and recent loss?
- How many explicit bond links are actually needed to make grief feel legible in the first playable?
- Should children always occupy NPC rows, or can infants be represented as household dependents until the visible-child gameplay slice is ready?
- Should `belonging` be visible as a summary stat in the normal character panel, or remain hidden until migration and desertion are more active systems?
- Which fields should be save-authoritative versus derived at load time to reduce data drift?

## Recommended Milestone Notes

| Rule Area | Recommended Placeholder |
| --- | --- |
| Prototype framing | Treat the `M1 required` set as the minimum social record needed to prove that named villagers, households, grief, and drafting matter. |
| Attribute policy | Lock `Body`, `Mind`, and `Nerve` now. Do not expand to more base attributes for the first playable. |
| Skill policy | Start with six skills in milestone 1, then add `Lore` and `Leadership` when first-playable systems can actually use them. |
| UI policy | Surface only values the player can act on. Use debug views for the rest. |
| Children policy | Keep children as real NPC records as soon as practical, but avoid giving them worker logic. |
| Bond policy | Parent-child and partner links are enough to start. Anything deeper should be justified by a concrete gameplay need. |
| Draft policy | Store a direct draft-eligibility field early even if it becomes more derived later. It is easier to tune and author. |
| Death policy | Keep dead and missing NPCs in save data and social logs. Do not erase them after the event resolves. |
