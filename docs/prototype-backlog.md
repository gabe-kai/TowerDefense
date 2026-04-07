# Prototype Backlog

Status: Active
Scope: Planning
Phase: Pre-production
Owner: Design
Source of Truth: Yes

## Purpose

This document turns the MVP scope into a practical prototype backlog.

It is meant to answer:

- what we prototype first
- what each prototype must prove
- what minimum feature slice each prototype needs
- what should wait until later

This is not a detailed engineering task tracker. It is a high-level product and design backlog for prototype sequencing.

## Backlog Principles

- Prototype identity before content volume.
- Prototype readability before polish.
- Prototype one major risk at a time where possible.
- Prefer vertical slices over disconnected systems.
- Keep faction complexity out until the shared baseline works.

## Prototype Tracks

The current project should move through five main prototype tracks:

1. Camera and information readability
2. Settlement economy and rebuild loop
3. Wave routing and defensive pressure
4. Social consequence and named villagers
5. Sabine baseline faction layer

## Prototype 1: Camera and Information Readability

### Goal

Prove that the player experience works from a tower-anchored perspective without requiring a free god-camera.

### Must Answer

- Is the live tower view readable?
- Is the strategic survey map readable?
- Does switching between the two feel natural?
- Do alerts and reports feel actionable without granting omniscience?
- Can the player understand visible, surveyed, reported, and unknown states?

### Minimum Prototype Slice

- tower-anchored live camera
- limited lateral orbit
- zoom, pitch, and yaw controls
- strategic survey map
- three territory states:
  - visible now
  - surveyed but stale
  - unknown
- alert cards
- `Face From Tower`
- `Open On Map`
- site naming for a few important locations

### Success Criteria

- player can understand what is happening without feeling blind
- player can react to alerts quickly
- player understands when information is incomplete
- tower view feels like a constraint with gameplay value, not a usability mistake

### Out Of Scope For This Prototype

- familiars
- multiple remote camera bodies
- deep spell targeting
- faction-specific camera behaviors

## Prototype 2: Settlement Economy and Rebuild Loop

### Goal

Prove that building, logistics, damage, and rebuilding form a satisfying between-wave loop.

### Must Answer

- Does settlement expansion produce meaningful choices?
- Does housing loss matter immediately?
- Do roads and hauling matter enough to affect layout?
- Does rebuilding feel like real gameplay instead of dead time?
- Does the player understand why builder capacity matters?

### Minimum Prototype Slice

- `Tower Core`
- `House`
- `Field`
- `Woodcutter Camp`
- `Storehouse`
- `Builder's Yard`
- `Road`
- `Palisade`
- `Gate`
- stockpiled resources:
  - `Food`
  - `Wood`
  - `Stone`
  - `Mana`
- operational pressures:
  - labor
  - housing
  - storage
  - safety

### Success Criteria

- a damaged settlement can recover but not trivially
- layout affects travel and response time
- housing, food, and rebuilding produce visible pressure
- the player can see why “repair first” and “expand now” compete

### Out Of Scope For This Prototype

- deeper trade economy
- advanced livestock simulation
- decorative value systems
- advanced mana industry chains

## Prototype 3: Wave Routing and Defensive Pressure

### Goal

Prove that waves feel like moving landscape pressure instead of fixed-lane tower defense.

### Must Answer

- Do waves entering from off-map feel threatening and readable?
- Does terrain-aware routing produce interesting problems?
- Do palisades, gates, and open paths shape monster movement meaningfully?
- Can the player influence route pressure without fully solving it?

### Minimum Prototype Slice

- off-map entry and exit
- one simple terrain map with hills, open ground, and a chokepoint
- `Vermin Surge` warning-stage event
- `Gnawers` as the early swarm-type threat
- `Ramhorns` as the mid-tier brute threat
- warning-stage escalation
- simple settlement diversion logic
- simple structure targeting logic
- fire hazard from wave contact if practical

### Success Criteria

- player can identify pressure direction before full contact
- settlement placement and perimeter design matter
- monster pathing feels understandable enough to plan around
- damage feels like it happens because of route logic, not randomness

### Out Of Scope For This Prototype

- many monster families
- many boss families
- permanent corruption systems
- advanced siege ecosystems

## Prototype 4: Social Consequence and Named Villagers

### Goal

Prove that named villagers, households, and social consequences make losses feel different from ordinary RTS losses.

### Must Answer

- Do named villagers change player behavior?
- Does losing a person feel meaningfully different from losing a building?
- Do households make rehousing and casualty events more legible?
- Can a light social model already support drafting pressure and grief?

### Minimum Prototype Slice

- named villagers
- one or two households
- job market shell
- simple age classes
- visible children if practical
- morale
- loyalty
- grief
- rehousing consequence
- death consequence
- drafting consequence

### Success Criteria

- player notices and remembers specific people
- a bad loss creates visible social fallout
- rebuilding a structure is obviously easier than replacing a skilled person
- emergency drafting feels viable but costly

### Out Of Scope For This Prototype

- deep romance systems
- inheritance systems
- complex migration politics
- long generational simulation

## Prototype 5: Sabine Baseline Faction Layer

### Goal

Prove the baseline teaching faction on top of the shared systems.

### Must Answer

- Does Sabine make the game easier to learn without feeling bland?
- Do her command style and social logic reinforce the intended loop?
- Does her unique support structure and spell kit improve readability and recovery?
- Does her “over-cautious but not incompetent” personality create interesting tension?

### Minimum Prototype Slice

- Sabine command cadence
- `Bell Post`
- `Survey Light`
- `Household Ward`
- `Rally Chime`
- `Measured Bolt`
- `Alarm Rune`
- `Waymark Rune`
- `Sentry Seal`
- `Repair First`
- `Protected Households`

### Success Criteria

- Sabine feels distinct from a generic neutral faction
- the player learns warning, shelter, rebuilding, and fair-burden logic through her faction
- her presence clarifies the game rather than complicating it

### Out Of Scope For This Prototype

- Ash-Hart playable implementation
- Aurelian playable implementation
- Orren implementation

## Recommended Order

### First

- Prototype 1: Camera and Information Readability

### Second

- Prototype 2: Settlement Economy and Rebuild Loop

### Third

- Prototype 3: Wave Routing and Defensive Pressure

### Fourth

- Prototype 4: Social Consequence and Named Villagers

### Fifth

- Prototype 5: Sabine Baseline Faction Layer

This order is recommended because each later prototype depends on confidence in the earlier player-experience layer.

## Shared Baseline Before Faction Expansion

Do not treat Ash-Hart or Aurelian as implementation targets until the following baseline is proven:

- camera loop
- map readability
- alert/report model
- core economy loop
- wave routing pressure
- named-villager consequence
- one functioning baseline faction

## Candidate Follow-On Backlog

After the baseline prototype sequence, likely next backlog items are:

- Ash-Hart overlay prototype
- Aurelian overlay prototype
- fire suppression rules prototype
- boss encounter readability pass
- site naming and report-legibility polish
- implementation-facing data sheets
- follow-through on `docs/data/wave-data-sheet.md` milestone rows: `Scrap Runners`, then `Cinderkin`, then `Wellmaw`

## Relationship To Other Docs

This backlog should be read alongside:

- `docs/mvp-scope-and-prototype-plan.md`
- `docs/game-design-document.md`
- subsystem specs under `docs/`

If the MVP plan changes, this backlog should be updated to match it.
