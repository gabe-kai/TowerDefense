# Phase 2: Structure Design and Testing Checklist

This document outlines all structures that need to be designed, implemented, and tested during Phase 2: Building System Polish.

## Current Status

### ✅ Completed Structures
- **Tower Base (Wizard's Cottage)** - Complete
  - 2-story cylindrical tower with cone roof
  - 1-story rectangular house with A-frame roof
  - House rotates around back wall center
  - Proper overhang and normals

---

## Structures to Design and Test

### Priority 1: Core Tower Structures

#### 1. **Tower Floor** (Tower Modifications)
**Purpose**: Modular floors added on top of tower base  
**Visual Requirements**:
- Cylindrical floor structure (3m tall, 3.5m diameter)
- Slightly smaller than tower base (4m) to create a "stepped" tower effect
- Must align perfectly with previous floor/tower base
- Should have windows/door openings (or simple geometric representation)
- Support for different room types (visual variation based on `RoomType`)

**Design Considerations**:
- Position: Stacked on top of tower base or previous floor
- Pivot: Center-bottom of floor (for easy stacking)
- Materials: Match tower base aesthetic (stone/wood)
- Room Type Variations:
  - **DEFENSE**: Small turret-like protrusions or defensive elements
  - **OFFENSE**: Cannon mounts or offensive elements
  - **RESOURCE**: Storage crates or workshop elements
  - **HOUSING**: Barracks-style windows or balcony
  - **SPECIALIZED**: Magical elements (glowing runes, etc.)

**Testing Checklist**:
- [ ] Floor stacks correctly on tower base
- [ ] Floor stacks correctly on previous floor
- [ ] Multiple floors create visually appealing tower
- [ ] Room type variations are distinguishable
- [ ] Floor meshes are properly pickable for selection
- [ ] Floor health/destruction visualization works

---

### Priority 2: Ground Defense Structures

#### 2. **Turret** (Defense Structure)
**Purpose**: Automated defense structure that attacks enemies  
**Visual Requirements**:
- Cylindrical base (1.5m radius, 1-1.5m height)
- Rotating top section (cannon/arrow slot)
- Small defensive features (battlements, embrasures)
- Clear "defensive" appearance

**Design Considerations**:
- Size: `GameScale.TURRET_SIZE` (1.5m)
- Position: Ground level (Y = 0)
- Rotation: Top section should be able to rotate (for future combat system)
- Materials: Stone with metal accents
- Color: Gray/brown (stone), darker accents for metal parts

**Testing Checklist**:
- [ ] Turret mesh created correctly
- [ ] Turret placed at correct ground level
- [ ] Turret is visible when placed
- [ ] Turret can be selected (raycasting)
- [ ] Turret shows in info panel with correct stats
- [ ] Turret appears in minimap
- [ ] Multiple turrets can be placed without overlap

#### 3. **Cannon** (Offense Structure)
**Purpose**: Heavy artillery for long-range attacks  
**Visual Requirements**:
- Large barrel/cannon tube (2m long, 0.5m diameter)
- Carriage/base structure (1.5m x 1.5m base)
- Elevation mechanism visible
- Heavy, imposing appearance

**Design Considerations**:
- Size: Larger than turret (2m length, 1.5m base)
- Position: Ground level (Y = 0)
- Rotation: Base rotates, barrel can elevate (for future combat system)
- Materials: Heavy metal (dark gray/black) with wooden carriage
- Color: Dark metallic cannon, brown wooden base

**Testing Checklist**:
- [ ] Cannon mesh created correctly
- [ ] Cannon placed at correct ground level
- [ ] Cannon is visible when placed
- [ ] Cannon can be selected (raycasting)
- [ ] Cannon shows in info panel with correct stats
- [ ] Cannon appears in minimap
- [ ] Cannon size is distinguishable from turret

#### 4. **Wall** (Defense Structure)
**Purpose**: Barrier to block enemy movement  
**Visual Requirements**:
- Rectangular wall segment (2m tall, variable length/width)
- Stone/brick texture appearance
- Top surface (flat or crenelated)
- Connectable segments

**Design Considerations**:
- Size: `GameScale.WALL_HEIGHT` (2m), `GameScale.WALL_THICKNESS` (0.5m), variable length
- Position: Ground level (Y = 0)
- Rotation: Can rotate to face different directions
- Materials: Stone/brick
- Color: Gray stone
- Special: Should be able to place multiple segments that visually connect

**Testing Checklist**:
- [ ] Wall mesh created correctly
- [ ] Wall placed at correct ground level
- [ ] Wall is visible when placed
- [ ] Wall can be selected (raycasting)
- [ ] Wall shows in info panel with correct stats
- [ ] Wall appears in minimap
- [ ] Multiple wall segments can be placed adjacently
- [ ] Wall segments can rotate to face different directions

#### 5. **Barrier** (Defense Structure)
**Purpose**: Light defensive barrier, cheaper than wall  
**Visual Requirements**:
- Smaller than wall (1.5m tall)
- Wooden palisade or simple barrier appearance
- Simpler than full wall

**Design Considerations**:
- Size: Smaller than wall (1.5m tall, 0.3m thick)
- Position: Ground level (Y = 0)
- Rotation: Can rotate to face different directions
- Materials: Wood with spikes/pickets
- Color: Brown wood, darker spikes

**Testing Checklist**:
- [ ] Barrier mesh created correctly
- [ ] Barrier placed at correct ground level
- [ ] Barrier is visible when placed
- [ ] Barrier can be selected (raycasting)
- [ ] Barrier shows in info panel with correct stats
- [ ] Barrier appears in minimap
- [ ] Barrier is visually distinct from wall

---

### Priority 3: Resource Structures

#### 6. **Storage** (Resource Structure)
**Purpose**: Increase resource storage capacity  
**Visual Requirements**:
- Warehouse/barn appearance
- Rectangular structure with pitched roof
- Storage crates/barrels visible
- Functional, utilitarian appearance

**Design Considerations**:
- Size: Medium-sized building (2-3m wide, 2-3m deep, 2-2.5m tall)
- Position: Ground level (Y = 0)
- Rotation: Can face different directions
- Materials: Wood with simple roof
- Color: Brown wood, darker roof
- Special: May have visible storage containers inside/around it

**Testing Checklist**:
- [ ] Storage mesh created correctly
- [ ] Storage placed at correct ground level
- [ ] Storage is visible when placed
- [ ] Storage can be selected (raycasting)
- [ ] Storage shows in info panel with correct stats
- [ ] Storage appears in minimap

#### 7. **Workshop** (Resource Structure)
**Purpose**: Production/resource generation building  
**Visual Requirements**:
- Workshop/forge appearance
- Furnace/smokestack visible
- Workbenches or crafting areas visible
- Industrial/productive appearance

**Design Considerations**:
- Size: Medium-sized building (2.5-3m wide, 2.5-3m deep, 2.5m tall)
- Position: Ground level (Y = 0)
- Rotation: Can face different directions
- Materials: Stone base, metal/wood top
- Color: Gray stone, darker metal accents, brown wood
- Special: May have smoke/fire effects (for future particle system)

**Testing Checklist**:
- [ ] Workshop mesh created correctly
- [ ] Workshop placed at correct ground level
- [ ] Workshop is visible when placed
- [ ] Workshop can be selected (raycasting)
- [ ] Workshop shows in info panel with correct stats
- [ ] Workshop appears in minimap

---

### Priority 4: Housing Structures

#### 8. **Barracks** (Housing Structure)
**Purpose**: House more servants/units  
**Visual Requirements**:
- Barracks/military housing appearance
- Multiple windows or door openings
- Simple, functional design
- Can accommodate multiple units

**Design Considerations**:
- Size: Large rectangular building (3-4m wide, 4-5m deep, 3m tall)
- Position: Ground level (Y = 0)
- Rotation: Can face different directions
- Materials: Wood or stone
- Color: Brown wood or gray stone
- Special: May have multiple windows/doors to suggest multiple rooms

**Testing Checklist**:
- [ ] Barracks mesh created correctly
- [ ] Barracks placed at correct ground level
- [ ] Barracks is visible when placed
- [ ] Barracks can be selected (raycasting)
- [ ] Barracks shows in info panel with correct stats
- [ ] Barracks appears in minimap

---

### Priority 5: Specialized Structures

#### 9. **Library** (Specialized Structure)
**Purpose**: Magical research/knowledge building  
**Visual Requirements**:
- Magical/mystical appearance
- Book-filled shelves or scrolls visible
- Magical glow or runes
- Academic/magical aesthetic

**Design Considerations**:
- Size: Medium-sized building (3m wide, 3m deep, 3m tall)
- Position: Ground level (Y = 0) or can be tower floor
- Rotation: Can face different directions
- Materials: Stone with magical elements
- Color: Gray stone with glowing blue/purple accents
- Special: Emissive materials for magical glow (for future)

**Testing Checklist**:
- [ ] Library mesh created correctly
- [ ] Library placed at correct ground level
- [ ] Library is visible when placed
- [ ] Library can be selected (raycasting)
- [ ] Library shows in info panel with correct stats
- [ ] Library appears in minimap
- [ ] Library has magical visual elements (emissive glow)

#### 10. **Spell Tower** (Offense Structure)
**Purpose**: Magical offensive structure  
**Visual Requirements**:
- Tower-like structure (smaller than main tower)
- Magical elements (crystal, runes, glow)
- Obvious magical/offensive appearance
- Crystal or orb at top

**Design Considerations**:
- Size: Medium tower (2m radius, 4-5m tall)
- Position: Ground level (Y = 0)
- Rotation: Top can rotate (for future combat system)
- Materials: Stone with crystal/magical elements
- Color: Gray stone with glowing crystal (blue/purple/green)
- Special: Crystal/orb at top that can glow/pulse

**Testing Checklist**:
- [ ] Spell Tower mesh created correctly
- [ ] Spell Tower placed at correct ground level
- [ ] Spell Tower is visible when placed
- [ ] Spell Tower can be selected (raycasting)
- [ ] Spell Tower shows in info panel with correct stats
- [ ] Spell Tower appears in minimap
- [ ] Spell Tower has magical visual elements (glowing crystal)

---

## Design Principles

### Scale Consistency
- All structures must use `GameScale` constants for sizing
- Keep consistent with tower base (4m base size)
- Servant is person-sized (1.7m tall) - use as reference

### Visual Hierarchy
- Tower base is largest structure (foundation)
- Tower floors stack upward (progressive)
- Ground structures are smaller than tower base
- Each structure type should be visually distinct

### Material Consistency
- Use `MaterialLibrary` for consistent materials
- Match aesthetic (wizard's cottage style)
- Low-poly style for MVP (primitives acceptable)
- Colors should be distinguishable but cohesive

### Placement Requirements
- All ground structures: Y = 0 (ground level)
- All tower floors: Stack on top of base or previous floor
- All structures: Properly pickable for raycasting
- All structures: Appear in minimap when placed

### Testing Requirements
- Each structure must be:
  1. Created correctly by `PrimitiveFactory`
  2. Placed correctly by `BuildingSystem`
  3. Visible in scene
  4. Selectable via `InteractionSystem`
  5. Displayed in `InfoPanel`
  6. Shown in minimap
  7. Properly scaled and positioned

---

## Implementation Order

### Phase 2.1: Tower Floors
1. Create `createTowerFloor` in `PrimitiveFactory`
2. Test basic floor stacking
3. Add room type variations
4. Test with multiple floors

### Phase 2.2: Core Ground Structures
1. Turret
2. Wall
3. Barrier
4. Test placement and selection for each

### Phase 2.3: Offense Structures
1. Cannon
2. Spell Tower
3. Test placement and selection for each

### Phase 2.4: Resource Structures
1. Storage
2. Workshop
3. Test placement and selection for each

### Phase 2.5: Housing and Specialized
1. Barracks
2. Library
3. Test placement and selection for each

---

## Common Pitfalls to Avoid

Based on `3D_GEOMETRY_GUIDE.md`:

1. **Cones**: Use `diameterTop = 0, diameterBottom = radius` for upward-pointing
2. **Rotation Pivots**: Use `TransformNode` for rotation around specific point
3. **Parenting**: Positions become relative to parent
4. **Custom Meshes**: Counter-clockwise winding when viewed from outside
5. **Normals**: Compute with empty array first
6. **Overhang Logic**: Overhang perpendicular to peak direction
7. **Axis Clarity**: Document which dimension maps to which axis

---

## Success Criteria

Phase 2 is complete when:
- [ ] All structures can be created visually
- [ ] All structures can be placed in the game world
- [ ] All structures are visible when placed
- [ ] All structures can be selected and show info panel
- [ ] All structures appear correctly in minimap
- [ ] Tower floors stack correctly
- [ ] Multiple structures of same type can be placed
- [ ] All structures use consistent scale and materials
- [ ] All structures follow the design principles above

---

## Related Documentation

- [3D Geometry Guide](./3D_GEOMETRY_GUIDE.md) - Babylon.js patterns and pitfalls
- [Implementation Plan](./IMPLEMENTATION_PLAN.md) - Overall development roadmap
- [GameScale](../utils/GameScale.ts) - Scale constants
- [PrimitiveFactory](../assets/PrimitiveFactory.ts) - Structure creation
- [BuildingSystem](../systems/BuildingSystem.ts) - Building placement logic
