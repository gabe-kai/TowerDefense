# Camera Controls and Visibility Spec

Status: Active
Scope: System
Phase: Pre-production
Owner: Design
Source of Truth: Yes

This document defines the first-playable camera, visibility, alert, and command model for the tower defense + settlement builder game.

It is intentionally V1-focused. The goal is to make moment-to-moment play readable under real-time pressure while preserving the fantasy that the player is a bound spirit attached to a tower rather than a free-roaming god camera.

This document focuses on:

- the main live gameplay camera
- the strategic top-down map
- view switching
- what actions are available from each view
- what requires direct sight versus reported information
- alert and report behavior
- how spirit anchors, runes, spells, and specialist spotters extend awareness
- how building placement, spell targeting, and military orders are issued
- fog-of-war and surveyed territory
- what should be simplified or postponed for the first playable

## V1 Design Goals

- Preserve the tower-anchored perspective as a core fantasy and mechanical constraint.
- Keep warnings readable enough that the player can prepare before direct contact.
- Let the player act on incomplete information without granting omniscience.
- Make the strategic map useful for planning without replacing the live tower view.
- Support Sabine, Ash-Hart, and Aurelian through one shared camera-and-information model.
- Keep military control broad and site-based rather than unit-micro-intensive.

## Core Principle

The player is not a battlefield avatar and not a Total War-style field commander.

The player is the tower's perception-and-intent network:

- seeing what can be seen from the tower and allied anchors
- receiving reports from guards, lookouts, spotters, and magical systems
- issuing broad intent orders to named places
- choosing when to trust incomplete information

Competent soldiers, guards, workers, and specialists are expected to execute those orders with local judgment.

## View Model

V1 uses two core views:

- `Live Tower View`
- `Strategic Survey Map`

These views should be complementary rather than interchangeable.

### Live Tower View

The live view is the player's main moment-to-moment presence in the world.

Its jobs are:

- read urgency
- read visible threats
- understand occlusion and terrain from a grounded angle
- inspect local structures and activity
- cast line-of-sight spells
- respond quickly to alerts

### Strategic Survey Map

The strategic map is the player's planning and command surface.

Its jobs are:

- place buildings
- place runes
- target broad area effects
- issue site-based military and civilian orders
- inspect surveyed territory
- review reports and warning coverage

## Live Tower Camera

### Default Behavior

The live camera is always anchored to the tower.

The player can control:

- `Yaw`
- `Pitch`
- `Zoom`
- `Short lateral orbit`

The player cannot freely translate across the landscape.

### Lateral Orbit

V1 live camera movement should include a small lateral orbit around the tower's spirit perch.

Intent:

- let the player lean around the tower
- peek past rooflines and wall corners
- look down approach lanes and gate edges
- reduce frustration from perfect centerline locking

Rules:

- early game orbit is small and feels like leaning over the edge
- later tower and spirit upgrades increase orbit radius modestly
- upgraded orbit should still remain measured in meters, not building spans
- past a short radius, remote anchors and map use should become more cost-effective than further orbit growth

### Camera Orientation Helpers

The live camera should support:

- a quick `snap north` or orientation reset
- a `return to tower center` action after orbiting
- `face alert from tower` behavior that rotates and offsets the camera toward a disturbance without granting false vision

### Occlusion Rules

Occlusion matters even from an elevated tower.

Examples:

- the player may see over a wall but not the ground immediately below it
- the player may see movement beyond a roofline without seeing the exact point of impact beneath it
- the player may see defenders reacting at a gate while only receiving reports about what is striking them

This is a feature, not a bug. The player should often understand that danger is present before they can see it cleanly.

## Strategic Survey Map

### Purpose

The strategic map is a surveyed planning layer, not an omniscient tactical camera.

It exists so that:

- strategic placement can be legible
- the tower-anchored live view can remain constrained
- broad command can stay practical during real-time play

### Territory States

V1 should use three map-knowledge states:

- `Visible now`
- `Surveyed but not currently visible`
- `Unknown`

#### Visible Now

- current sight from tower, anchors, spotters, or allied vision
- supports precise information and precision actions

#### Surveyed But Not Currently Visible

- terrain, roads, structures, and sites remain known from prior survey
- enemy information may be stale, partial, or absent
- supports planning, building, and broad orders

#### Unknown

- unsurveyed fog-of-war
- cannot support normal building, targeting, or precise planning

### How Survey Progresses

The survey map is built from surviving friendly exploration and observation.

Rules:

- any friendly character who reaches an area and survives to report can contribute survey knowledge
- any current friendly vision into fog can update the strategic map
- surveyed terrain persists after line of sight is lost
- current enemy truth does not persist indefinitely once sight is lost

## View Switching

V1 should make switching fast and readable.

Recommended rules:

- one explicit input opens and closes the strategic map
- alert cards always include two buttons:
  - `Face From Tower`
  - `Open On Map`
- switching to the map should preserve recent context
- closing the map should return the player to their last live tower framing

The player should bounce between the two views often during warning and wave play.

## What The Player Can Do From Each View

### From Live Tower View

The player can:

- inspect visible structures, friendlies, and threats
- cast line-of-sight spells
- trigger quick emergency responses tied to visible or reported sites
- face active alerts from the tower
- inspect local warning and combat states
- open the strategic map

The live view should not be the default interface for:

- detailed building placement
- rune layout
- broad route planning
- precise remote targeting

### From Strategic Survey Map

The player can:

- place buildings on valid surveyed terrain
- place runes on valid surveyed terrain
- issue broad site-based military orders
- issue civilian emergency orders such as shelter, evacuate, or firefighting response
- target area spells that allow strategic targeting
- review reports, warning sources, and survey state
- inspect planned routes, fallback sites, and remote anchor coverage

## Core Command Loop

### Peace Phase

The player should spend more time in live view, using the map intermittently for planning.

Typical loop:

1. read the tower's immediate surroundings
2. open the map to place buildings, roads, and runes
3. return to live view to monitor activity and approaches
4. respond to minor alerts or reports

### Warning Phase

The player should move rhythmically between live view and map.

Typical loop:

1. receive omen, report, or warning escalation
2. `Face From Tower` to orient
3. optionally `Open On Map` for planning
4. issue preparedness orders
5. return to live view to watch escalation

### Active Wave Phase

The player should live mostly in the tower view and use the map for short, high-value command bursts.

Typical loop:

1. read breaches, fires, pressure points, and visible contact
2. pivot to urgent alerts
3. issue broad intent orders
4. cast emergency spells
5. return to live view to watch consequences

## Alerts and Reports

### Design Goal

Alerts should give the player actionable warning without collapsing imperfect information into full visual access.

### Alert Ladder

V1 should use four escalating information states:

#### 1. Omen

- vague warning
- directional but not exact
- little or no targetable detail

Example:

- disturbance in the north woods

#### 2. Report

- sourced by a friendly observer or system
- gives rough type and rough place
- may be incomplete or inaccurate

Example:

- lookout reports heavy beasts near Miller's Bridge

#### 3. Confirmed Contact

- at least one friendly source currently sees the threat
- provides stronger location confidence
- may unlock spotter-guided offensive options

#### 4. Crisis

- a site is actively breaking down or suffering loss
- breach, fire, casualties, panic, route failure, or anchor loss

### Alert Card Content

Important alerts should show:

- source
- site or direction
- confidence
- age
- threat type if known
- recommended action hint
- `Face From Tower`
- `Open On Map`

### Alert Wording

Alerts should prefer named sites over vague compass wording once a place is known well enough.

Good:

- movement near Miller's Bridge
- fire at the North Palisade
- runners report pressure at East Bridge

Less good:

- danger somewhere east

## Site Names and Command Legibility

V1 should use a dual-name site model.

Each important site can have:

- a stable `functional descriptor`
- a player-facing `common name`

Examples:

- `Mud Creek Wooden Bridge 1`
- `Split Rapids Triple Arch Stone Bridge 2`
- renamed in daily use to `Miller's Bridge` or `Three Sisters`

Rules:

- the common name is the primary name in alerts and orders once it exists
- the full functional descriptor remains available in detailed views and search
- duplicate common names should be refused
- the player should be allowed to rename important sites early

Cross-system note:

- later social and civic systems should consider rewarding good naming practices through improved report clarity, response legibility, and civic effectiveness

## Action Permissions

V1 should separate `what the player knows` from `what the player is allowed to attempt`.

### Direct Line Of Sight Required

These require current direct visibility:

- line-of-sight direct attack spells
- precise single-target spell use
- exact inspection of enemy composition
- manual confirmation of some structure states when no reporting source is available
- any action that depends on precise timing against moving visible targets

### Reported Information Is Enough

These can be attempted on reports alone:

- broad military orders
- shelter, muster, evacuate, and fallback commands
- site reinforcement
- route closures and gate state changes
- dispatching firefighters or guards
- blind-cast area effects that support report-based targeting

### Surveyed Territory Required

These require surveyed terrain knowledge even if it is not currently visible:

- building placement
- rune placement
- broad route planning
- most strategic area targeting

### Unknown Territory Restrictions

Unknown fog-of-war should not support:

- normal building placement
- normal rune placement
- precision targeting
- confident route planning

The player may still be able to send scouts or specialist surveyors into the unknown.

## Spotters and Blind-Casting

### Core Rule

Blind-casting exists in V1, and friendly fire is possible.

However, long-range offensive action into unseen space should rely on `spotting`, not on free UI certainty.

### Spotting Is A Specialist Role

Spotting should be treated as a specific job or unit function that depends on:

- trained personnel or equivalent magical specialists
- pre-agreed communications
- prepared observation points, signal methods, or magical links

Ordinary nearby friendlies should not automatically count as high-quality spotters.

### Spotter-Guided Targeting

Blind-cast targeting quality should depend on the source:

- fleeing civilian report: poor
- ordinary guard report: moderate for warning, weak for precise fire
- trained spotter at prepared post: strong
- rune or spirit-linked targeting anchor: strong, if active and supplied

Possible outcomes of low-quality targeting:

- drift
- delay error
- wrong side of a structure
- friendly fire into nearby defenders or civilians

### UI Framing

The interface may still show an estimated danger area, but it should be framed as a `spotter estimate` rather than exact truth.

The player should understand:

- who is guiding the attack
- how current the spotting is
- how confident the aim is

## Vision Extension Systems

V1 should preserve a clear hierarchy of awareness tools.

### Tower Sight

- baseline vision source
- improved by height and related upgrades

### Guards and Lookouts

- provide reports and warnings
- do not automatically grant full player vision

### Specialist Spotters

- enable better remote threat localization
- enable stronger blind-cast accuracy
- should often occupy prepared or elevated positions

### Spirit Anchors

- static supernatural placements that extend awareness and command presence
- should be more powerful than mundane warning structures

### Rune Anchors

- placed magical infrastructure with ongoing upkeep
- can support awareness, warning, or targeting functions

### Spell Anchors

- temporary remote sight or camera tools
- useful in emergencies or short tactical windows

### Familiars

- postpone as a major camera mode for V1
- keep as a later extension rather than a core first-playable requirement

## Building Placement, Spell Targeting, and Order Issuing

### Building Placement

- defaults to the strategic map
- requires surveyed terrain
- should respect terrain, footprint, and known pathing constraints

### Rune Placement

- defaults to the strategic map
- requires surveyed terrain
- should surface network, district, or anchor relationships clearly enough for Aurelian-style play without changing the core view model

### Spell Targeting

Spell targeting should split into two broad categories:

- `Live-view line-of-sight spells`
- `Strategic targeted area spells`

Strategic area spells:

- can target surveyed or reported spaces if the spell supports that mode
- should reflect report quality and spotting quality
- can inflict friendly fire

### Military Orders

V1 military control should be broad and site-based.

The default grammar is:

- assign force to site
- choose intent at site

Examples:

- Archers to North Palisade
- Second Infantry hold Miller's Bridge
- Reinforce East Bridge
- Fall back to Inner Gate

### Core V1 Site Orders

Recommended V1 order set:

- `Hold`
- `Reinforce`
- `Fall Back To`
- `Intercept At`
- `Guard`
- `Stand Ready`
- `Shelter Civilians`
- `Evacuate`
- `Extinguish Fires`
- `Keep Route Open`
- `Do Not Pursue`

The player should not be micromanaging formations, facing, or individual unit movement in V1.

## Sites, Zones, and Naming

### Sites

Sites are the default command targets in V1.

Examples:

- East Bridge
- North Palisade
- South Gate
- Mill Yard
- Inner Court

### Zones

Zones should be secondary and only appear when a settlement has meaningful named structure.

Examples:

- Apple Tree Lane North
- West Orchard Edge
- Lower Market

Zones work best when tied to:

- roads
- districts
- landmarks

V1 should avoid heavy freeform zone drawing and instead rely on named places the player can remember.

## Fog-of-War

### Rules

- unknown terrain begins hidden
- surveyed terrain remains known after sight is lost
- current hostile truth decays when not actively observed
- fresh friendly vision updates the map

### Readability Requirement

The player must be able to tell at a glance whether information is:

- visible now
- surveyed but stale
- only reported
- completely unknown

If those states blur together, the whole system becomes frustrating.

## First-Playable Scope

### Keep For V1

- two-view model
- short tower-anchored live orbit
- strategic surveyed map
- surveyed versus visible versus reported information states
- alert cards with `Face From Tower` and `Open On Map`
- site-based broad orders
- spotter-mediated blind-casting with friendly fire
- tower, lookout, spotter, spirit, rune, and spell-based awareness as distinct roles

### Simplify Or Postpone

- free-moving familiar camera
- multiple simultaneous remote camera bodies
- deep artillery calibration tools
- detailed formation control
- freeform drawn combat zones
- complex reconnaissance decay simulation
- faction-specific camera paradigms

## Key Readability Risks

The following risks should be solved early:

- players confusing visible, surveyed, reported, and unknown information states
- alert spam burying critical events
- lateral orbit becoming so strong that anchors and map use feel unnecessary
- spotter-guided blind-casting feeling unfair because the source of inaccuracy is unclear
- dual-name sites becoming confusing if names are duplicated or poorly surfaced
- broad orders producing inconsistent behavior that makes site commands feel unreliable

## Summary Of The V1 Player Experience

In the first playable, the player should feel like a spirit perched in and around a tower, reading the land, leaning for angle, hearing bells and shouted reports, opening the survey map to place intent, and gambling on incomplete information when the pressure becomes too high to wait for perfect sight.

The player should not feel like:

- a free camera god
- an omniscient artillery computer
- a formation-by-formation battlefield commander

The intended fantasy is:

- see from the tower
- learn from reports
- name places
- issue intent
- trust specialists
- live with uncertainty
