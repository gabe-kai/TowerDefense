# Babylon.js Terrain Features Guide

## Overview

Babylon.js provides built-in terrain capabilities that eliminate the need for custom height sampling or raycasting. This guide documents how to use these features for our tower defense game.

## Built-in Terrain Features

### 1. `MeshBuilder.CreateGroundFromHeightMap`

Creates a 3D terrain mesh from a heightmap (grayscale image or data buffer).

**Basic Usage:**
```typescript
import { MeshBuilder, Texture } from '@babylonjs/core';

// From image file
const heightmapTexture = new Texture('assets/heightmap.png', scene);
const terrain = MeshBuilder.CreateGroundFromHeightMap(
  'terrain',
  {
    width: 50,           // World width in units
    height: 50,           // World depth in units
    subdivisions: 100,    // Number of subdivisions (higher = smoother)
    minHeight: 0,        // Minimum height (black pixels)
    maxHeight: 10,        // Maximum height (white pixels)
    buffer: heightmapTexture  // Texture or Uint8Array
  },
  scene
);
```

**From Procedural Data:**
```typescript
// Generate heightmap data (256x256 grayscale)
const size = 256;
const data = new Uint8Array(size * size * 4); // RGBA
for (let i = 0; i < size * size; i++) {
  const x = i % size;
  const z = Math.floor(i / size);
  const height = generateHeight(x, z); // Your noise function
  const gray = Math.floor(height * 255);
  data[i * 4] = gray;     // R
  data[i * 4 + 1] = gray; // G
  data[i * 4 + 2] = gray; // B
  data[i * 4 + 3] = 255;  // A
}

const terrain = MeshBuilder.CreateGroundFromHeightMap(
  'terrain',
  {
    width: 50,
    height: 50,
    subdivisions: 100,
    minHeight: 0,
    maxHeight: 10,
    buffer: data
  },
  scene
);
```

### 2. Height Sampling: `GroundMesh.getHeightAtCoordinates()`

**Built-in method** to get terrain height at any X/Z coordinate.

```typescript
import { GroundMesh } from '@babylonjs/core';

const terrain: GroundMesh = MeshBuilder.CreateGroundFromHeightMap(...);

// Get height at specific coordinates
const height = terrain.getHeightAtCoordinates(x, z);

// Use for building placement
const buildingPosition = new Vector3(x, terrain.getHeightAtCoordinates(x, z), z);
```

**Important Notes:**
- Returns Y coordinate (height) at the given X/Z position
- Works automatically with the heightmap mesh
- No custom raycasting needed!

### 3. Normal Sampling: `GroundMesh.getNormalAtCoordinates()`

**Built-in method** to get surface normal (for slope calculation).

```typescript
// Get surface normal
const normal = terrain.getNormalAtCoordinates(x, z);

// Calculate slope angle
// Normal.y is the cosine of the slope angle
const slopeRadians = Math.acos(normal.y);
const slopeDegrees = slopeRadians * (180 / Math.PI);

// Check if slope is too steep for building
const maxSlope = 20; // degrees
if (slopeDegrees > maxSlope) {
  // Too steep to build
}
```

### 4. Dynamic Terrain (Optional - For Large Maps)

For very large or infinite terrains, use the `DynamicTerrain` extension.

```typescript
import { DynamicTerrain } from '@babylonjs/core';

const terrain = new DynamicTerrain('terrain', {
  terrainSub: 100,        // Subdivisions
  mapData: heightmapData,  // Heightmap data
  mapSubX: 256,           // Heightmap width
  mapSubZ: 256,           // Heightmap height
  mapStatistics: {
    minHeight: 0,
    maxHeight: 10
  }
}, scene, camera);
```

**Use when:**
- Terrain is very large (1000+ units)
- Need infinite/streaming terrain
- Performance optimization needed

**Not needed for:**
- Small to medium maps (< 200 units)
- Fixed-size valley (our use case)

## Implementation Strategy

### Step 1: Create TerrainManager Wrapper

A thin wrapper around Babylon's `GroundMesh` for game-specific logic:

```typescript
// src/utils/TerrainManager.ts
import { GroundMesh, Vector3 } from '@babylonjs/core';

export class TerrainManager {
  private groundMesh: GroundMesh;
  
  constructor(groundMesh: GroundMesh) {
    this.groundMesh = groundMesh;
  }
  
  /**
   * Get terrain height at X/Z coordinates
   */
  getHeightAt(x: number, z: number): number {
    return this.groundMesh.getHeightAtCoordinates(x, z);
  }
  
  /**
   * Get surface normal at X/Z coordinates
   */
  getNormalAt(x: number, z: number): Vector3 {
    return this.groundMesh.getNormalAtCoordinates(x, z);
  }
  
  /**
   * Calculate slope angle in degrees
   */
  getSlopeAngle(x: number, z: number): number {
    const normal = this.getNormalAt(x, z);
    const slopeRadians = Math.acos(normal.y);
    return slopeRadians * (180 / Math.PI);
  }
  
  /**
   * Check if position is valid for building
   */
  isValidBuildLocation(position: Vector3, maxSlope: number = 20): boolean {
    const slope = this.getSlopeAngle(position.x, position.z);
    return slope <= maxSlope;
  }
  
  /**
   * Sample height for multiple positions
   */
  sampleHeights(positions: Vector3[]): Vector3[] {
    return positions.map(pos => {
      const height = this.getHeightAt(pos.x, pos.z);
      return new Vector3(pos.x, height, pos.z);
    });
  }
}
```

### Step 2: Update SceneManager

Replace `CreateGround` with `CreateGroundFromHeightMap`:

```typescript
// src/core/SceneManager.ts
import { MeshBuilder, Texture, GroundMesh } from '@babylonjs/core';
import { TerrainManager } from '../utils/TerrainManager';

export class SceneManager {
  private terrainManager: TerrainManager | null = null;
  
  private createValley(): void {
    // Option 1: From image (if you have a heightmap image)
    // const heightmapTexture = new Texture('assets/heightmap.png', this.scene);
    
    // Option 2: Procedural generation (for now)
    const heightmapData = this.generateProceduralHeightmap(256, 256);
    
    const valleyFloor = MeshBuilder.CreateGroundFromHeightMap(
      'valley_floor',
      {
        width: 50,
        height: 50,
        subdivisions: 100,
        minHeight: 0,
        maxHeight: 5, // Valley depth
        buffer: heightmapData
      },
      this.scene
    ) as GroundMesh;
    
    // Apply material
    const grassMaterial = this.materialLibrary.getBabylonMaterial('grass', this.scene);
    valleyFloor.material = grassMaterial;
    
    // Create TerrainManager wrapper
    this.terrainManager = new TerrainManager(valleyFloor);
  }
  
  private generateProceduralHeightmap(width: number, height: number): Uint8Array {
    // Simple procedural generation (can be replaced with Perlin noise later)
    const data = new Uint8Array(width * height * 4);
    
    for (let i = 0; i < width * height; i++) {
      const x = i % width;
      const z = Math.floor(i / width);
      
      // Create valley shape (lower in center, higher on edges)
      const centerX = width / 2;
      const centerZ = height / 2;
      const distFromCenter = Math.sqrt(
        Math.pow((x - centerX) / width, 2) + 
        Math.pow((z - centerZ) / height, 2)
      );
      
      // Valley: lower in center (0.3), higher on edges (1.0)
      const heightValue = 0.3 + (distFromCenter * 0.7);
      const gray = Math.floor(heightValue * 255);
      
      data[i * 4] = gray;     // R
      data[i * 4 + 1] = gray; // G
      data[i * 4 + 2] = gray; // B
      data[i * 4 + 3] = 255;  // A
    }
    
    return data;
  }
  
  getTerrainManager(): TerrainManager | null {
    return this.terrainManager;
  }
}
```

### Step 3: Update BuildingValidator

Use `TerrainManager` for slope validation:

```typescript
// src/utils/BuildingValidator.ts
import { TerrainManager } from './TerrainManager';

export class BuildingValidator {
  static validatePlacement(
    position: Vector3,
    buildingType: BuildingType,
    existingBuildings: Vector3[],
    terrainManager: TerrainManager | null,
    towerPosition?: Vector3
  ): PlacementValidation {
    // ... existing distance checks ...
    
    // Check slope if terrain manager available
    if (terrainManager) {
      const slope = terrainManager.getSlopeAngle(position.x, position.z);
      if (slope > 20) { // Max 20 degree slope
        return {
          valid: false,
          reason: 'Terrain too steep for building'
        };
      }
      
      // Sample actual terrain height
      const terrainHeight = terrainManager.getHeightAt(position.x, position.z);
      if (Math.abs(position.y - terrainHeight) > 0.5) {
        return {
          valid: false,
          reason: 'Building must be placed on terrain surface'
        };
      }
    }
    
    return { valid: true };
  }
}
```

### Step 4: Update BuildingSystem

Use terrain height for placement:

```typescript
// src/systems/BuildingSystem.ts
buildGroundStructure(
  buildingType: BuildingType, 
  position: Vector3, 
  player: 'player' | 'ai',
  terrainManager: TerrainManager | null
): boolean {
  // Sample terrain height if available
  let finalPosition = position.clone();
  if (terrainManager) {
    const terrainHeight = terrainManager.getHeightAt(position.x, position.z);
    finalPosition.y = terrainHeight;
  }
  
  // ... rest of building logic ...
}
```

## Benefits of Using Babylon's Built-ins

1. ✅ **No custom raycasting** - Built-in height sampling
2. ✅ **Automatic optimization** - Babylon handles mesh optimization
3. ✅ **Standard approach** - Well-documented and supported
4. ✅ **Less code** - Thin wrapper instead of full implementation
5. ✅ **Better performance** - Optimized by Babylon.js team

## Next Steps

1. Create `TerrainManager` wrapper class
2. Update `SceneManager` to use `CreateGroundFromHeightMap`
3. Generate or create heightmap (procedural or image)
4. Update `BuildingValidator` to use terrain manager
5. Update `BuildingSystem` to sample terrain height
6. Implement visual preview with terrain following

## References

- [Babylon.js GroundMesh Documentation](https://doc.babylonjs.com/divingDeeper/mesh/dynamicMeshMorph#groundmesh)
- [CreateGroundFromHeightMap API](https://doc.babylonjs.com/typedoc/classes/babylon.meshbuilder#creategroundfromheightmap)
- [Dynamic Terrain Documentation](https://doc.babylonjs.com/divingDeeper/mesh/dynamicTerrain)
