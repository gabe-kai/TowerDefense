# Tower Stepping Design

## Current State

- **Tower Base**: 2.5m radius (5m diameter) - `COTTAGE_TOWER_SIZE`
- **Tower Floors**: Previously 1.75m radius (3.5m diameter) - `TOWER_FLOOR_SIZE / 2`
- **Status**: ✅ **IMPLEMENTED** - Upgrade-based progressive stepping system

## Implemented Progressive Stepping System

### Concept: Upgrade-Based Width System

The tower starts at the **smallest width** (2.5m radius) and grows **wider** as you build upward. When you complete a tier (3 floors), all lower tiers automatically upgrade to be wider, creating a stepped-upward progression.

### Width Progression

Starting radius: **2.5m** (smallest)
- Step size: **0.5m** per upgrade
- Floors per tier: **3 floors**
- Continues indefinitely (no cap)

### How It Works

1. **Floors 1-3**: Built at 2.5m radius (starting size)
2. **When Floor 4 is added** (starting Tier 3):
   - All floors 1-3 upgrade to 3.0m radius (2.5 + 0.5)
   - Floor 4 is built at 3.0m radius
3. **Floors 4-6**: All at 3.0m radius
4. **When Floor 7 is added** (starting Tier 4):
   - Base upgrades to 3.5m radius
   - Floors 1-3 upgrade to 3.5m radius
   - Floors 4-6 upgrade to 3.5m radius
   - Floor 7 is built at 3.5m radius
5. **Continues indefinitely**: Each new tier upgrades all lower tiers by 0.5m

### Visual Example

```
        [Tier 5: 3.5m] ← Floor 10-12 (upgraded from 3.0m)
       ────────────────
      [Tier 4: 3.5m] ← Floor 7-9 (upgraded from 3.0m)
     ──────────────────
    [Tier 3: 3.5m] ← Floor 4-6 (upgraded from 3.0m)
   ────────────────────
  [Tier 2: 3.5m] ← Floor 1-3 (upgraded from 2.5m)
 ────────────────────────
[Tier 1: 3.5m] ← Base (upgraded from 2.5m)
```

After adding floor 7, all tiers are upgraded to 3.5m. When floor 10 is added, all tiers upgrade to 4.0m, and so on.

## Implementation Plan

### Phase 1: Basic Stepping (Current Priority)

1. **Add Tier Calculation Logic**
   - `Tower.getTierForFloor(floorLevel: number): number`
   - Returns tier number (1-5) based on floor level
   - Tier 1 = base, Tier 2+ = floors

2. **Add Radius Calculation**
   - `Tower.getRadiusForTier(tier: number): number`
   - Returns radius in meters for each tier

3. **Update `createTowerFloor`**
   - Accept `radius` parameter instead of using fixed `TOWER_FLOOR_SIZE`
   - Calculate radius based on floor level

4. **Update `Tower.addFloor`**
   - Calculate tier and radius before creating floor
   - Pass radius to `createTowerFloor`

### Phase 2: Visual Stepping (Polish)

1. **Add Transition Elements**
   - Small decorative ring/ledge at tier boundaries
   - Makes stepping more visually obvious

2. **Material Variations**
   - Different materials for different tiers
   - Stone base → Wood middle → Magical top

### Phase 3: Upgrade System (Future)

1. **Tier Upgrade Data**
   - Store upgrade level per tier
   - Track expanded radius for upgraded tiers

2. **Upgrade UI**
   - Show upgrade options in building menu
   - Display cost and benefits

3. **Upgrade Logic**
   - Rebuild floors in upgraded tier with new radius
   - Update visual appearance

## Code Structure

### New Constants (GameScale.ts)

```typescript
// Tower tier sizes (radius in meters)
static readonly TOWER_TIER_1_RADIUS = 2.5; // Base tier
static readonly TOWER_TIER_2_RADIUS = 2.0; // Floors 1-3
static readonly TOWER_TIER_3_RADIUS = 1.75; // Floors 4-6
static readonly TOWER_TIER_4_RADIUS = 1.5; // Floors 7-9
static readonly TOWER_TIER_5_RADIUS = 1.25; // Floors 10+

// Floors per tier before stepping down
static readonly TOWER_FLOORS_PER_TIER = 3;
```

### Tower Methods

```typescript
/**
 * Get tier number for a given floor level
 * Tier 1 = base, Tier 2+ = floors
 */
getTierForFloor(floorLevel: number): number {
  if (floorLevel === 0) return 1; // Base
  return Math.floor((floorLevel - 1) / GameScale.TOWER_FLOORS_PER_TIER) + 2;
}

/**
 * Get radius for a given tier
 */
getRadiusForTier(tier: number): number {
  switch (tier) {
    case 1: return GameScale.TOWER_TIER_1_RADIUS;
    case 2: return GameScale.TOWER_TIER_2_RADIUS;
    case 3: return GameScale.TOWER_TIER_3_RADIUS;
    case 4: return GameScale.TOWER_TIER_4_RADIUS;
    case 5: return GameScale.TOWER_TIER_5_RADIUS;
    default: return GameScale.TOWER_TIER_5_RADIUS; // Cap at tier 5
  }
}

/**
 * Get radius for a specific floor level
 */
getRadiusForFloor(floorLevel: number): number {
  const tier = this.getTierForFloor(floorLevel);
  return this.getRadiusForTier(tier);
}
```

### Updated createTowerFloor

```typescript
createTowerFloor(
  name: string, 
  position: Vector3,
  radius: number, // NEW: Accept radius parameter
  roomType: RoomType | string = RoomType.SPECIALIZED,
  buildingType: string = 'tower_floor'
): Mesh {
  // Use radius parameter instead of fixed TOWER_FLOOR_SIZE
  const floorHeight = GameScale.TOWER_FLOOR_HEIGHT;
  const floorCylinder = Mesh.CreateCylinder(
    `${name}_cylinder`, 
    floorHeight, 
    radius, // Use provided radius
    radius, 
    16, 
    1, 
    this.scene
  );
  // ... rest of implementation
}
```

## Visual Example

```
        [Tier 5: 1.25m] ← Floor 10+
       ────────────────
      [Tier 4: 1.5m] ← Floor 7-9
     ──────────────────
    [Tier 3: 1.75m] ← Floor 4-6
   ────────────────────
  [Tier 2: 2.0m] ← Floor 1-3
 ────────────────────────
[Tier 1: 2.5m] ← Base (2 stories + roof)
```

## Questions to Answer

1. **How many floors per tier?** 
   - Proposed: 3 floors per tier
   - Alternative: 2 floors (more frequent stepping) or 4 floors (less frequent)

2. **Step size?**
   - Proposed: 0.25m reduction per tier
   - Alternative: 0.5m (more dramatic) or 0.15m (more gradual)

3. **Maximum tier?**
   - Proposed: 5 tiers (unlimited floors at tier 5)
   - Alternative: Continue stepping down indefinitely

4. **Upgrade system priority?**
   - Phase 2: Basic stepping only
   - Phase 3+: Add upgrade system

## Next Steps

1. **Decide on stepping parameters** (floors per tier, step size)
2. **Implement tier calculation logic** in `Tower` class
3. **Update `createTowerFloor`** to accept radius parameter
4. **Update `Tower.addFloor`** to calculate and pass radius
5. **Test visual appearance** with multiple floors
6. **Add visual transition elements** at tier boundaries (optional polish)
