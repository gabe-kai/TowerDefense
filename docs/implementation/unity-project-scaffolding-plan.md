# Unity Project Scaffolding Plan

Status: Draft
Scope: First Implementation Milestone
Phase: Pre-production
Owner: Engineering / Design
Source of Truth: No

## Purpose

This document defines the practical scaffolding pass that should happen now that Unity has been initialized at the repository root.

Its job is to:

- turn the current template-generated Unity project into a clean milestone-1 working structure
- prevent tutorial and template leftovers from becoming part of the real project layout
- define a folder and naming baseline that supports the Prototype 1 through Prototype 5 integration order
- keep the team from over-designing a large production structure before the first playable slice exists

This is not:

- a generic Unity style guide
- a complete production pipeline design
- a promise that all long-term folder choices are already finalized

Read this alongside:

- `docs/implementation/engine-and-architecture-decision.md`
- `docs/implementation/prototype-integration-order.md`
- `docs/implementation/vertical-slice-acceptance-criteria.md`
- `docs/implementation/prototype-1-camera-and-information-readability-checklist.md`
- `docs/mvp-scope-and-prototype-plan.md`
- `docs/prototype-backlog.md`
- `docs/testing-and-debugging-strategy.md`
- `docs/definition-of-done.md`

## Current Starting State

Assumed current state for this plan:

- Unity project exists at repository root
- Unity version is from the current Unity 6 LTS line
- project template used: `Universal 3D (URP)`
- repository already contains non-Unity root files such as `README.md`, `LICENSE.md`, `.gitignore`, and `docs/`
- `Assets/` still mostly contains template-generated folders and files:
  - `Scenes/`
  - `Settings/`
  - `TutorialInfo/`
  - default input actions asset
  - template readme asset

This means the project should be treated as a newly initialized Unity repo that needs one deliberate cleanup and re-homing pass before real prototype implementation starts.

## Scaffolding Principles

- Build one shared project structure for the whole milestone, not per-prototype folder trees.
- Keep milestone-1 structure shallow, obvious, and easy to navigate in the Unity Project window.
- Put real project content under one project-root grouping folder in `Assets/` to avoid mixing template leftovers with production content.
- Keep Unity-owned project configuration where Unity expects it, but keep game-owned assets clearly separated from template defaults.
- Favor structures that support the planned shared runtime: one prototype map, one shared state model, one shared debug layer.
- Create dedicated homes for debug tools, data-authored assets, and prototype-only content so temporary work does not leak into baseline folders.
- Do not introduce assembly-definition fragmentation, package sprawl, or deeply nested domain hierarchies before the first milestone proves itself.

## Scaffolding Pass Purpose

The scaffolding pass should accomplish five things:

1. remove template noise that no longer helps the project
2. create one obvious home for real game assets
3. establish scene, script, data, and debug locations that match the current prototype plan
4. separate baseline shared content from prototype-only and faction-overlay content
5. leave the repository in a state where Prototype 1 work can begin immediately without further layout debate

## Recommended Repository Layout

Recommended repository layout for milestone 1:

```text
/
|- Assets/
|- Packages/
|- ProjectSettings/
|- UserSettings/                 generated, not committed
|- Library/                      generated, not committed
|- Logs/                         generated, not committed
|- Temp/                         generated, not committed
|- docs/
|  |- implementation/
|  |- data/
|- README.md
|- LICENSE.md
|- .gitignore
```

Root-level guidance:

- keep planning, design, and implementation docs under `docs/`, outside Unity's asset browser
- do not move repository docs into `Assets/`
- do not create a second root such as `game/` or `unity/` around the existing Unity project

## Recommended Assets Layout

Create one project-root grouping folder:

- `Assets/TowerDefense/`

This should become the home for all real game-owned content. The point is not branding. The point is to stop real implementation assets from being mixed with:

- Unity template leftovers
- package-generated settings
- future imported samples
- one-off prototype scratch files in the top level of `Assets/`

Recommended milestone-1 `Assets/` layout:

```text
Assets/
|- TowerDefense/
|  |- Art/
|  |  |- Environment/
|  |  |- Props/
|  |  |- Characters/
|  |  |- VFX/
|  |  |- Icons/
|  |- Audio/
|  |  |- Music/
|  |  |- SFX/
|  |  |- Ambient/
|  |- Data/
|  |  |- Buildings/
|  |  |- Waves/
|  |  |- NPCs/
|  |  |- Households/
|  |  |- Factions/
|  |  |  |- Shared/
|  |  |  |- Sabine/
|  |  |- Sites/
|  |  |- Packages/
|  |  |- Debug/
|  |- Debug/
|  |  |- Gizmos/
|  |  |- Materials/
|  |  |- Prefabs/
|  |  |- UI/
|  |- Materials/
|  |- Prefabs/
|  |  |- Core/
|  |  |- Buildings/
|  |  |- Environment/
|  |  |- UI/
|  |  |- Debug/
|  |- Prototype/
|  |  |- Shared/
|  |  |- Prototype1/
|  |- Scenes/
|  |  |- Bootstrap/
|  |  |- Gameplay/
|  |  |- Sandbox/
|  |- Scripts/
|  |  |- Core/
|  |  |- Gameplay/
|  |  |- Presentation/
|  |  |- UI/
|  |  |- Data/
|  |  |- Debug/
|  |  |- Editor/
|  |- Settings/
|  |  |- Input/
|  |  |- Rendering/
|  |  |- Physics/
|  |- UI/
|  |  |- HUD/
|  |  |- Panels/
|  |  |- Map/
|  |  |- Alerts/
|  |  |- Shared/
|- Settings/                     template/project config kept only if still needed by URP
|- Scenes/                       to be emptied and retired
|- TutorialInfo/                 to be removed
```

Folder naming guidance for now:

- use singular PascalCase top-level folders under `Assets/TowerDefense/`
- prefer a small number of obvious buckets over deep domain nesting
- avoid folder names like `Misc`, `New Folder`, `Art2`, or `Temp`
- if a folder exists, it should communicate ownership or purpose clearly

## Keep / Remove / Replace Decisions

### Keep

Keep these, though some should be moved or absorbed into the new project structure:

- `Packages/`
- `ProjectSettings/`
- URP and Unity-generated project settings that are actually in use
- the repository root docs and non-Unity files already present
- any template-generated rendering configuration that the current URP setup depends on

Keep in place or evaluate before moving:

- `Assets/Settings/`

Recommendation:

- keep `Assets/Settings/` only for the assets that are still actively referenced by the URP template or project graphics pipeline
- do not treat `Assets/Settings/` as the home for game-owned settings going forward
- create `Assets/TowerDefense/Settings/` for game-owned settings assets that the team authors

### Remove

Remove template/tutorial content that should not become part of the real project:

- `Assets/TutorialInfo/`
- template readme assets such as `Assets/Readme.asset`
- any sample/tutorial materials, prefabs, or demo assets that exist only to explain the template

Rationale:

- these assets create visual noise
- they encourage accidental reuse of tutorial folders as production homes
- they make the `Assets/` root look more complete than it really is

### Replace

Replace these template defaults with project-owned structure:

- `Assets/Scenes/`
- default input actions asset if its maps and naming are still template-generic

Recommendation for `Assets/Scenes/`:

- do not keep using `Assets/Scenes/` as the real scene home
- move or recreate the actual project scenes under `Assets/TowerDefense/Scenes/`
- once no real scene depends on `Assets/Scenes/`, leave it empty temporarily or remove it

Recommendation for the default input actions asset:

- do not keep the template-named `Assets/InputSystem_Actions.inputactions` as the long-term production asset
- replace it with a project-owned asset under `Assets/TowerDefense/Settings/Input/`
- recommended name: `TD_InputActions.inputactions`

Reasoning:

- Prototype 1 depends on clear camera, map, and alert-facing controls
- input naming should reflect the game's real actions, not template defaults
- this asset will likely become shared infrastructure early, so it should be project-owned immediately

Good-enough milestone-1 rule:

- it is acceptable to duplicate the current asset into the project folder and then rename and trim action maps there
- it is not necessary to design a final production input architecture yet

## Scene Strategy

Use one main playable prototype scene, plus small support scenes only where they reduce startup friction.

Recommended scene structure:

- `Assets/TowerDefense/Scenes/Bootstrap/Boot.unity`
- `Assets/TowerDefense/Scenes/Gameplay/PrototypeMap_Main.unity`
- `Assets/TowerDefense/Scenes/Sandbox/Prototype1_CameraSandbox.unity` only if camera iteration benefits from a lighter testbed

Primary recommendation:

- the project should have one main integration scene for milestone 1
- do not create separate full runtime scenes for each prototype track
- use additive bootstrap or tiny sandbox scenes only where they support faster iteration or isolated validation

Why this matches current project direction:

- the implementation docs explicitly call for one shared runtime
- Prototype 1 should feed directly into Prototype 2 and later phases
- the vertical slice must be repeatable in one honest end-to-end setup

### Handling Existing `Assets/Scenes`

Recommended action:

- treat `Assets/Scenes/` as template residue
- do not keep building the real project out of it
- migrate the useful scene content into `Assets/TowerDefense/Scenes/Gameplay/PrototypeMap_Main.unity`

If the template created a default scene:

- either move it into the new scene location and rename it
- or create a clean new scene in the target folder and discard the template scene

For milestone 1, the cleaner option is usually:

- create a fresh `PrototypeMap_Main` scene under the project-root folder
- avoid carrying template naming into the real structure

## Recommended Scene Hierarchy

Inside the main gameplay scene, align with the architecture decision doc:

- `Bootstrap`
- `World`
- `Terrain`
- `Sites`
- `Buildings`
- `Agents`
- `Camera`
- `UI`
- `Debug`

This should be treated as the runtime hierarchy target for the main scene, even if some roots stay mostly empty at first.

## Script Folder Strategy

Recommended script structure for milestone 1:

```text
Assets/TowerDefense/Scripts/
|- Core/
|  |- Bootstrap/
|  |- Time/
|  |- Events/
|  |- IDs/
|  |- Save/
|- Gameplay/
|  |- Sites/
|  |- Buildings/
|  |- Economy/
|  |- Waves/
|  |- NPCs/
|  |- Households/
|  |- Factions/
|  |- Commands/
|  |- Visibility/
|- Presentation/
|  |- Camera/
|  |- Views/
|  |- Selection/
|  |- Map/
|- UI/
|  |- HUD/
|  |- Alerts/
|  |- Panels/
|  |- Shared/
|- Data/
|  |- Definitions/
|  |- Runtime/
|  |- Loading/
|  |- Validation/
|- Debug/
|  |- HUD/
|  |- Inspectors/
|  |- Overlays/
|  |- Logging/
|- Editor/
```

Guidance:

- organize by project responsibility first, not by every possible technical pattern
- keep plain C# simulation code in gameplay/data/core folders
- keep MonoBehaviour-heavy camera, view, and scene glue in presentation/UI folders
- keep editor scripts isolated in `Scripts/Editor/`

What is good enough now:

- one script tree under `Assets/TowerDefense/Scripts/`
- no need yet for per-feature asmdefs unless compile times become painful
- no need yet for a deep `Runtime/Editor/Tests` package-style split

## High-Level Namespace Strategy

Use one root namespace:

- `TowerDefense`

Recommended namespace pattern:

- `TowerDefense.Core`
- `TowerDefense.Gameplay.Buildings`
- `TowerDefense.Gameplay.Visibility`
- `TowerDefense.Presentation.Camera`
- `TowerDefense.UI.Alerts`
- `TowerDefense.Data.Definitions`
- `TowerDefense.Debug.Overlays`
- `TowerDefense.Editor`

Rules for milestone 1:

- use namespaces that mirror the script folder structure at a high level
- do not create many top-level roots such as `Game`, `Runtime`, `Common`, `Sim`, and `Utils` all at once
- keep Sabine-specific code under shared roots until a real overlay boundary exists, for example `TowerDefense.Gameplay.Factions.Sabine`

Practical boundary:

- shared baseline systems own the main namespaces
- faction-specific code lives under faction subnamespaces, not separate architectural roots

## Data-Authored Asset Placement

Put data-authored assets under:

- `Assets/TowerDefense/Data/`

Recommended early subfolders:

- `Buildings/`
- `Waves/`
- `NPCs/`
- `Households/`
- `Sites/`
- `Packages/`
- `Factions/Shared/`
- `Factions/Sabine/`

Guidance:

- stable content definitions live here
- ScriptableObjects are a practical milestone-1 authoring format
- runtime save data should not be stored as editable authoring assets in these folders

Recommended early split:

- shared baseline building, wave, site, and NPC definition assets live in shared data folders
- Sabine starting package and Sabine overlay data live under the Sabine faction data folder or package folder

## Shared Baseline Content Versus Faction Overlays

Shared baseline content should live in:

- `Assets/TowerDefense/Data/Buildings/`
- `Assets/TowerDefense/Data/Waves/`
- `Assets/TowerDefense/Data/Sites/`
- `Assets/TowerDefense/Prefabs/Core/`
- `Assets/TowerDefense/Prefabs/Buildings/`
- `Assets/TowerDefense/UI/Shared/`
- `Assets/TowerDefense/Scripts/Core/`
- `Assets/TowerDefense/Scripts/Gameplay/`

Faction overlay content should live in:

- `Assets/TowerDefense/Data/Factions/Sabine/`
- `Assets/TowerDefense/Prefabs/Buildings/` only when the prefab is genuinely faction-specific
- `Assets/TowerDefense/UI/` subfolders only when the UI is specifically faction-owned
- `Assets/TowerDefense/Scripts/Gameplay/Factions/Sabine/`

Milestone-1 rule:

- do not create a parallel `Sabine` project structure for everything
- Sabine should overlay shared baseline systems, not replace them

## Debug / Prototype Support Structure

Debug tooling should be explicit in the project structure, not scattered inside unrelated folders.

Recommended locations:

- `Assets/TowerDefense/Debug/` for debug prefabs, materials, icons, and overlay assets
- `Assets/TowerDefense/Scripts/Debug/` for runtime debug code
- `Assets/TowerDefense/Data/Debug/` for debug scenario assets or test data assets if needed

Use these for:

- debug HUD
- state inspectors
- route overlays
- visibility overlays
- spawn/test tools
- log category helpers

Reasoning:

- the testing strategy explicitly prioritizes observability and debug surfaces
- the vertical slice requires inspectable route, warning, building-state, and NPC-consequence behavior

Prototype-only content should live in:

- `Assets/TowerDefense/Prototype/Shared/`
- `Assets/TowerDefense/Prototype/Prototype1/`

Use prototype folders for:

- temporary materials
- placeholder map markers
- authored fake alerts
- temporary prototype UI art
- one-off test prefabs that should not be mistaken for baseline content

Rule:

- if an asset exists only to answer Prototype 1's question and is likely to be deleted or replaced, put it in `Prototype/`
- if an asset is expected to survive into later prototypes, do not hide it in a prototype-only folder

## Handling Specific Existing Template Content

### `Assets/Scenes`

- replace as the primary scene home
- move real scenes under `Assets/TowerDefense/Scenes/`
- do not mix future project scenes with template defaults

### `Assets/Settings`

- keep only as long as URP template assets in this folder are genuinely referenced
- do not put new game-owned settings assets here by default
- create `Assets/TowerDefense/Settings/` for project-authored settings

### `Assets/TutorialInfo`

- remove

### Default Input Actions Asset

- replace with a project-owned input actions asset under `Assets/TowerDefense/Settings/Input/`
- rename to reflect real game controls
- trim and rename maps/actions around the actual milestone-1 needs

### Template Readme Asset

- remove

## Commit Versus Generated Content

Commit:

- `Assets/`
- `Packages/`
- `ProjectSettings/`
- `.meta` files
- root docs and repository files

Do not commit:

- `Library/`
- `Logs/`
- `Temp/`
- `UserSettings/`
- generated IDE files if the repository policy does not want them

Recommendation:

- keep `.gitignore` aligned with standard Unity generated-output rules
- treat accidental generated-file churn as scaffolding cleanup, not as normal repo noise

## Minimum Scaffolding Before Prototype 1 Starts

Before real Prototype 1 implementation begins, the project should have at least:

1. `Assets/TowerDefense/` created as the single project-root content folder
2. template tutorial/readme content removed
3. project-owned scene folder created and main prototype scene stubbed
4. project-owned input actions asset created under `Assets/TowerDefense/Settings/Input/`
5. script folder and root namespace baseline established
6. dedicated homes created for:
   - scenes
   - scripts
   - prefabs
   - materials
   - art
   - audio
   - UI
   - data-authored assets
   - debug tools
   - prototype-only content
7. one debug folder path chosen so early overlays and inspectors do not end up inside random feature folders
8. one main prototype scene decision made and documented

That is the minimum "clean enough to build on" state.

Prototype 1 does not need:

- final art structure depth
- final package import pipeline
- multi-faction folder layout
- production-grade asmdef layout
- full sandbox scene suite

## First Scaffolding Tasks

Recommended first tasks for the scaffolding branch:

1. Create `Assets/TowerDefense/` and the milestone-1 top-level subfolders.
2. Remove `Assets/TutorialInfo/` and the template `Readme.asset`.
3. Audit `Assets/Settings/` and keep only URP/template settings assets that are still actively required.
4. Create `Assets/TowerDefense/Scenes/` and create or move the main gameplay scene to `Gameplay/PrototypeMap_Main.unity`.
5. Create `Assets/TowerDefense/Scenes/Bootstrap/Boot.unity` only if bootstrap separation is immediately useful; otherwise defer the scene and keep the folder.
6. Create `Assets/TowerDefense/Settings/Input/TD_InputActions.inputactions` and re-home input ownership there.
7. Create the initial `Assets/TowerDefense/Scripts/` structure and adopt the `TowerDefense` root namespace.
8. Create `Assets/TowerDefense/Debug/` and `Assets/TowerDefense/Prototype/` so temporary work has an explicit destination.
9. Create `Assets/TowerDefense/Data/` subfolders for buildings, waves, NPCs, sites, packages, and factions, even if most stay empty at first.
10. Move any first real project assets out of template root folders so the `Assets/` top level stops growing as a dumping ground.

## Deferred Structure Decisions

These should explicitly wait until later:

- final assembly-definition breakdown
- package modularization
- addressables strategy
- save-file format and save asset layout
- deep separation between runtime and editor packages
- second-faction or many-faction content hierarchy
- large-scale art pipeline structure
- final importer tooling from markdown planning docs into Unity data assets
- whether navigation, terrain, or simulation subsystems need their own more specialized foldering

Practical rule:

- if a structure decision does not materially unblock Prototype 1 or reduce obvious layout debt now, defer it

## Good Enough Now Versus Too Early

Good enough now:

- one project-root grouping folder under `Assets/`
- one main gameplay scene
- one script tree
- one clear data asset home
- one explicit debug home
- one explicit prototype-only home
- simple namespace mirroring of the main script folders

Too early:

- designing a final enterprise architecture for every future subsystem
- creating many parallel scene stacks for each prototype
- creating separate top-level roots for every faction
- splitting code into many asmdefs before compile-time pain exists
- building long-lived structure around systems that are still intentionally deferred

## Final Recommendation

The scaffolding pass should be treated as a short, deliberate cleanup branch whose goal is clarity, not sophistication.

For milestone 1, the strongest practical choice is:

- put all real game-owned assets under `Assets/TowerDefense/`
- remove tutorial/template leftovers
- replace the default scene and input asset locations with project-owned ones
- keep one main prototype scene as the shared integration surface
- create explicit homes for data, debug tools, and prototype-only content

That structure is disciplined enough to avoid immediate project-layout debt, while still small enough to evolve as the first playable slice proves what actually needs to last.
