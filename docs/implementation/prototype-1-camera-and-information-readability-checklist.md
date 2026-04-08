# Prototype 1: Camera and Information Readability Checklist

Status: Draft
Scope: Prototype 1
Phase: Pre-production
Owner: Design / Engineering
Source of Truth: No

This document turns the current camera, visibility, alert, and command design into a concrete Prototype 1 build checklist.

It is not a replacement for:

- `docs/camera-controls-and-visibility-spec.md`
- `docs/mvp-scope-and-prototype-plan.md`
- `docs/prototype-backlog.md`

Its job is to define the smallest implementation slice that can prove the live tower camera and strategic survey map loop is readable under pressure.

## Prototype Goal

Prototype 1 should prove that the player can operate from a tower-anchored point of view, switch to a surveyed planning map when needed, and make reasonable decisions under incomplete information without feeling blind or cheated.

This prototype should stay intentionally small:

- one tower
- one simple prototype map
- a few named sites
- a few alert types
- one or two broad site-based orders
- enough warning and crisis pressure to test readability

Recommended placeholder framing:

- use one authored prototype map with a clear north-facing landmark layout
- use one tower site with `Tower Core` as the live-view anchor
- use a small site set such as `North Palisade`, `South Gate`, `Field`, `Storehouse Foundation`, and `Miller's Bridge`
- use authored alerts instead of a full wave simulation if needed for faster iteration

## Prototype Purpose

- [ ] Prove the tower-anchored live camera is readable and usable.
- [ ] Prove the strategic survey map is a useful planning surface instead of a second camera.
- [ ] Prove players can tell the difference between `visible`, `surveyed`, `reported`, and `unknown`.
- [ ] Prove alerts can drive quick orientation and map follow-up without granting false vision.
- [ ] Prove basic site naming improves alert comprehension and command legibility.
- [ ] Prove a small command grammar works with incomplete information.

## Prototype Success Criteria

- [ ] A tester can rotate, pitch, zoom, and slightly orbit around the tower without expecting free camera travel.
- [ ] A tester can use `Face From Tower` to orient toward an alert quickly enough to understand direction and urgency.
- [ ] A tester can open and close the strategic survey map quickly and return to the prior live framing.
- [ ] A tester can correctly explain what parts of the map are `visible now`, `surveyed`, `reported only`, and `unknown`.
- [ ] A tester can respond to at least one warning event and one crisis event without asking whether the UI is lying.
- [ ] A tester can issue at least one direct line-of-sight action and at least one report-based or surveyed-terrain action and understand why the permissions differ.
- [ ] A tester can recognize at least three named sites in alerts and on the map without relying on compass-only wording.
- [ ] Warning and crisis situations remain readable without alert spam burying the most important problem.

## Must-Prove Questions

- [ ] Is the live tower view fun enough to justify the anchor constraint?
- [ ] Does small lateral orbit reduce frustration without becoming a disguised free camera?
- [ ] Does return-to-center behavior feel reliable after orbiting and alert-facing?
- [ ] Does `Face From Tower` help orientation without pretending blocked areas are visible?
- [ ] Does the strategic survey map feel complementary to the live tower view instead of replacing it?
- [ ] Do map open/close flow and alert-card shortcuts support fast context switching?
- [ ] Can players act on reports and surveyed terrain without confusing those states with direct sight?
- [ ] Do named sites make broad orders and warnings easier to understand than compass-only alerts?
- [ ] Are warning and crisis states readable enough to move into Prototype 2 and Prototype 3?

## In Scope

### Camera

- [ ] tower-anchored live camera
- [ ] `Yaw`
- [ ] `Pitch`
- [ ] `Zoom`
- [ ] small lateral orbit around the tower perch
- [ ] return-to-center behavior
- [ ] orientation reset or `snap north`
- [ ] `Face From Tower` alert-facing behavior

### Strategic Survey Map

- [ ] strategic survey map as a separate view
- [ ] one explicit map open/close input
- [ ] close map returns to last live tower framing
- [ ] preserve recent context when opening map from an alert
- [ ] show surveyed terrain without pretending current enemy truth is known

### Information States

- [ ] `Visible Now`
- [ ] `Surveyed`
- [ ] `Reported`
- [ ] `Unknown`
- [ ] clear visual treatment for each state
- [ ] one stale-information placeholder rule for enemy truth on surveyed terrain

Recommended placeholder:

- treat `Reported` as an overlay or tagged alert/site state, not a full fourth terrain paint layer if that is cheaper to ship

### Alerts and Reports

- [ ] alert cards
- [ ] `Face From Tower`
- [ ] `Open On Map`
- [ ] basic alert metadata:
- [ ] source
- [ ] site or direction
- [ ] confidence
- [ ] age
- [ ] threat hint
- [ ] at least one warning-stage alert
- [ ] at least one crisis-stage alert

Recommended placeholder:

- use authored alert confidence values such as `low`, `medium`, `high`
- use authored age text such as `just now`, `recent`, `stale`

### Commands and Actions

- [ ] at least one direct line-of-sight action
- [ ] at least one report-based action
- [ ] at least one surveyed-terrain action
- [ ] at least one or two broad site-based orders

Recommended minimum order set:

- [ ] `Hold`
- [ ] `Shelter Civilians`

Recommended optional third order if cheap:

- [ ] `Reinforce`

### Naming

- [ ] site naming for a few key locations
- [ ] common name shown in alerts and command UI
- [ ] functional descriptor retained in detail view or debug view
- [ ] duplicate common names rejected

Recommended prototype site list:

- [ ] `Tower Core`
- [ ] `South Gate`
- [ ] `North Palisade`
- [ ] `Field`
- [ ] `Storehouse Foundation`
- [ ] `Miller's Bridge` or equivalent named bridge landmark

## Explicitly Out of Scope

- [ ] free-roaming god camera
- [ ] familiar camera
- [ ] multiple simultaneous remote camera bodies
- [ ] deep artillery calibration or detailed blind-fire tools
- [ ] deep spell-targeting rules
- [ ] formation control or per-unit micromanagement
- [ ] freeform combat-zone drawing
- [ ] full faction-specific camera paradigms
- [ ] full wave simulation fidelity
- [ ] full Sabine progression and full command cadence
- [ ] deep spotter hierarchy simulation beyond simple placeholder sources

## Required Systems

- [ ] live tower camera anchor system
- [ ] camera controls for yaw, pitch, zoom, and limited orbit
- [ ] camera return-to-center state handling
- [ ] alert-facing camera helper
- [ ] strategic survey map view controller
- [ ] map open/close state preservation
- [ ] territory knowledge state model
- [ ] reported-information state model
- [ ] site registry with stable ids and player-facing names
- [ ] alert/report data model
- [ ] action-permission rules by information source
- [ ] command-target site selection
- [ ] simple alert prioritization

Recommended placeholder implementation rules:

- [ ] use authored site ids and authored alert events first
- [ ] use simple booleans or enums for information state before building richer fog logic
- [ ] use one remembered live camera transform to restore after closing the map
- [ ] use one priority flag on alerts so crisis alerts always sort above warning alerts

## Required UI Elements

- [ ] live camera HUD hint for rotate / pitch / zoom / orbit / recenter / map toggle
- [ ] map toggle control
- [ ] map legend for `Visible`, `Surveyed`, `Reported`, `Unknown`
- [ ] alert card list or alert queue
- [ ] `Face From Tower` button on alert cards
- [ ] `Open On Map` button on alert cards
- [ ] selected-site panel or tooltip
- [ ] site name labels on map for key locations
- [ ] action availability feedback that explains why an action is blocked

Recommended placeholder text for blocked actions:

- [ ] `Requires direct sight`
- [ ] `Can use reports`
- [ ] `Requires surveyed terrain`
- [ ] `Unknown territory`

## Required Player Actions

### Live Tower View

- [ ] rotate around tower with yaw
- [ ] adjust pitch
- [ ] zoom in and out
- [ ] use small lateral orbit
- [ ] recenter on tower
- [ ] face active alert from tower
- [ ] trigger one line-of-sight action on a visible target or site
- [ ] open the strategic survey map

### Strategic Survey Map

- [ ] close back to live view
- [ ] inspect surveyed territory
- [ ] inspect reported site state
- [ ] issue a broad site-based order
- [ ] place one surveyed-terrain action such as placeholder building placement marker or route marker
- [ ] attempt one blocked action in unknown terrain and receive clear feedback

## Required Information States

### `Visible Now`

- [ ] shows current truth for visible terrain and entities
- [ ] supports direct line-of-sight actions
- [ ] is visually distinct from surveyed memory

### `Surveyed`

- [ ] keeps terrain and site knowledge after direct sight is lost
- [ ] supports building-placement or route-planning placeholder actions
- [ ] does not imply current enemy truth

### `Reported`

- [ ] can point to a named site or rough direction without granting line of sight
- [ ] supports broad orders and other report-based actions
- [ ] shows confidence and age
- [ ] clearly indicates the information source is indirect

### `Unknown`

- [ ] blocks normal building placement
- [ ] blocks normal rune placement if rune placement is surfaced at all
- [ ] blocks precision actions
- [ ] remains visually distinct from surveyed terrain

## Required Alert and Report Behaviors

- [ ] warning alert can reference direction before a site is fully known
- [ ] later alert should prefer named site wording once a site is known
- [ ] crisis alert should rise above normal warning noise
- [ ] `Face From Tower` should rotate and optionally offset the camera toward the disturbance
- [ ] `Face From Tower` should not reveal occluded ground or hidden enemies
- [ ] `Open On Map` should center or emphasize the relevant site on the map
- [ ] alert age should update or decay visibly enough to communicate staleness
- [ ] alert confidence should communicate uncertainty

Recommended placeholder alert ladder for Prototype 1:

- [ ] `Report`: example `Lookout reports movement near Miller's Bridge`
- [ ] `Crisis`: example `Fire at Storehouse Foundation`

Optional if cheap:

- [ ] `Omen`: example `Disturbance in the north woods`

## Required Site Naming Behavior

- [ ] implement stable internal site ids
- [ ] implement player-facing common names
- [ ] use common names first in alerts and orders once authored
- [ ] retain functional descriptor in details or debug view
- [ ] refuse duplicate common names
- [ ] allow at least one authored bridge or perimeter site to demonstrate why naming matters

Recommended placeholder naming rules:

- [ ] do not ship freeform naming UI in Prototype 1 unless it is already easy
- [ ] author 5-6 names directly in prototype map data
- [ ] if renaming is tested, support only one simple rename flow for one site type

## Core Feature Checklist

### Camera Core

- [ ] anchor live camera to `Tower Core`
- [ ] implement yaw control
- [ ] implement pitch control
- [ ] implement zoom control
- [ ] implement small lateral orbit
- [ ] clamp orbit radius so it feels like leaning, not travel
- [ ] implement recenter action
- [ ] implement orientation reset or north snap
- [ ] implement `Face From Tower`
- [ ] preserve last live framing when switching views

### Map Core

- [ ] implement strategic survey map view
- [ ] implement map open/close toggle
- [ ] return to previous live framing on close
- [ ] center map on relevant site when opened from alert
- [ ] render named key sites
- [ ] render territory state legend

### Information Readability Core

- [ ] render `Visible Now`
- [ ] render `Surveyed`
- [ ] render `Unknown`
- [ ] render `Reported` status on site or alert layer
- [ ] show at least one stale report state
- [ ] show at least one direct visible state for contrast

### Alert Core

- [ ] generate at least one warning report
- [ ] generate at least one crisis report
- [ ] show source, site, age, and confidence
- [ ] support `Face From Tower`
- [ ] support `Open On Map`
- [ ] sort crisis above warnings

### Command and Permission Core

- [ ] allow one direct-sight action only when target is visible
- [ ] allow one broad report-based order on a reported site
- [ ] allow one surveyed-terrain planning action on surveyed ground
- [ ] block equivalent action in unknown terrain with readable explanation

## Recommended Implementation Order

### Step 1: Camera Shell

- [ ] tower anchor
- [ ] yaw / pitch / zoom
- [ ] small lateral orbit
- [ ] recenter
- [ ] north snap

### Step 2: View Switching

- [ ] strategic survey map shell
- [ ] open / close flow
- [ ] restore last live framing

### Step 3: Site Framework

- [ ] site ids
- [ ] authored site names
- [ ] map labels
- [ ] selection / focus behavior

### Step 4: Information-State Rendering

- [ ] visible
- [ ] surveyed
- [ ] unknown
- [ ] reported overlay

### Step 5: Alert Cards

- [ ] warning card
- [ ] crisis card
- [ ] source / confidence / age
- [ ] `Face From Tower`
- [ ] `Open On Map`

### Step 6: Permission Rules

- [ ] direct line-of-sight action
- [ ] report-based action
- [ ] surveyed-terrain action
- [ ] blocked-action feedback

### Step 7: Broad Orders

- [ ] `Hold`
- [ ] `Shelter Civilians`
- [ ] optional `Reinforce`

### Step 8: Readability Pass

- [ ] warning test pass
- [ ] crisis test pass
- [ ] alert sort and wording pass
- [ ] information-state color / icon pass

## Minimum Test Scenarios

### Scenario 1: Camera Baseline

- [ ] From tower start, tester can yaw, pitch, zoom, orbit, and recenter without losing orientation.
- [ ] Tester can use north snap and explain where the major named sites are.

### Scenario 2: Alert Facing Without False Vision

- [ ] Trigger a report at `Miller's Bridge` or equivalent outer site.
- [ ] Tester uses `Face From Tower`.
- [ ] Camera points in the correct direction.
- [ ] Occluded area remains occluded.
- [ ] Tester understands there is a threat without expecting exact enemy visuals.

### Scenario 3: Map Open/Close Flow

- [ ] Trigger alert card.
- [ ] Tester uses `Open On Map`.
- [ ] Relevant site is centered or highlighted.
- [ ] Tester closes map.
- [ ] Live view returns to prior framing.

### Scenario 4: Information-State Distinction

- [ ] Show one area as `Visible Now`.
- [ ] Show one known site as `Surveyed` but not visible.
- [ ] Show one named site as `Reported` only.
- [ ] Show one area as `Unknown`.
- [ ] Ask tester what actions are allowed in each case.

### Scenario 5: Action Permission Distinction

- [ ] Attempt direct line-of-sight action on visible target and succeed.
- [ ] Attempt same action on reported-only target and fail with clear reason.
- [ ] Attempt broad order on reported site and succeed.
- [ ] Attempt surveyed-terrain action on surveyed ground and succeed.
- [ ] Attempt same surveyed-terrain action in unknown terrain and fail clearly.

### Scenario 6: Named-Site Readability

- [ ] Present alerts for `South Gate`, `Field`, and `Miller's Bridge`.
- [ ] Tester can identify which place is in danger without relying on compass-only wording.
- [ ] Duplicate-name prevention is verified in data or UI validation.

### Scenario 7: Warning Readability

- [ ] Trigger a lower-urgency warning about movement near an outer site.
- [ ] Tester can identify the site, source, and uncertainty level.
- [ ] Tester can take one preparatory action.

### Scenario 8: Crisis Readability

- [ ] Trigger a higher-urgency event such as `Fire at Storehouse Foundation` or `Pressure at South Gate`.
- [ ] Crisis alert surfaces above lower alerts.
- [ ] Tester can orient, open map, and issue one broad order quickly.

## Validation Criteria

- [ ] Live camera constraint feels intentional rather than broken.
- [ ] Orbit improves readability but does not replace map use.
- [ ] `Face From Tower` reduces orientation time during alerts.
- [ ] Map open/close loop is fast enough for repeated use during pressure.
- [ ] Information states are distinguishable at a glance.
- [ ] Named sites improve alert comprehension.
- [ ] Players understand why some actions require sight and others do not.
- [ ] Warning situations are readable.
- [ ] Crisis situations are readable.

Recommended validation method:

- [ ] run at least one guided internal test and one cold-read test
- [ ] ask testers to explain what they know, not only what they did
- [ ] log every moment where testers thought `surveyed`, `reported`, and `visible` meant the same thing

## Failure Cases to Watch For

- [ ] camera feels trapped rather than anchored
- [ ] orbit radius is so strong that map use feels unnecessary
- [ ] recenter does not return to a predictable framing
- [ ] `Face From Tower` overshoots or points to the wrong sector
- [ ] `Face From Tower` implies false visibility
- [ ] map close loses the player's prior live context
- [ ] `Visible`, `Surveyed`, `Reported`, and `Unknown` blend together visually
- [ ] reported alerts look as trustworthy as direct sight
- [ ] alert spam hides the true crisis
- [ ] site names are too sparse to be helpful
- [ ] site names are duplicated or too similar
- [ ] action-permission rules feel arbitrary
- [ ] blocked-action feedback is missing or vague
- [ ] broad site-based orders do not clearly attach to a named location
- [ ] warning situations are readable but crisis situations become chaotic

## Handoff To Prototype 2

Prototype 1 is ready to hand off when:

- [ ] the two-view loop works reliably
- [ ] the camera controls are stable enough to build on
- [ ] site naming and alert language are good enough to reuse
- [ ] information-state UI is readable enough to support building placement and logistics work
- [ ] action-permission distinctions are established clearly enough to expand into settlement, wave, and social prototypes

Prototype 2 should build on this by adding:

- [ ] building placement on surveyed terrain
- [ ] logistics and hauling readability
- [ ] repair and rebuilding priority sites
- [ ] more meaningful use of `Storehouse`, `Field`, `Gate`, and `House` as command and alert targets

## Follow-Up Questions For Later Prototypes

- [ ] Should `Reported` remain a site-level state, or later become a richer area overlay as spotting and rune systems grow?
- [ ] At what point should warning structures such as `Watchtower`, `Bell Post`, and `Sentry Seal` alter confidence versus lead time versus naming quality?
- [ ] When Prototype 3 adds real wave pressure, how much projected route information should appear before direct contact?
- [ ] Should early blind-cast or area-target actions enter in Prototype 3 or wait until command reliability is better proven?
- [ ] When building placement enters Prototype 2, does surveyed-terrain readability remain clear once placement overlays are layered onto the map?
- [ ] Should houses always become named sites, or only notable households and shelter-relevant houses?
- [ ] Does Sabine's `Bell Post` need to be visible in Prototype 1 as a named readiness site, or can it wait until the faction layer prototype?
- [ ] When social stakes deepen, how should alerts surface household risk without cluttering the core crisis UI?
