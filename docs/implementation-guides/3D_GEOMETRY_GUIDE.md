# 3D Geometry and Babylon.js Patterns Guide

This guide documents lessons learned from building complex 3D structures in Babylon.js, particularly the wizard's cottage/tower base. Follow these patterns to avoid common pitfalls when creating new building elements.

## Coordinate System

**Babylon.js uses Y-up:**
- **Y-axis**: Vertical (up/down)
- **X-axis**: Horizontal (left/right, typically front/back for buildings)
- **Z-axis**: Horizontal (forward/back, typically side-to-side for buildings)

Always remember: **Y is vertical**. When positioning meshes, use `position.y = height / 2` to center a mesh at half its height above the ground.

## Creating Cones (Tower Roofs)

**`Mesh.CreateCylinder` parameters:**
```typescript
Mesh.CreateCylinder(name, height, diameterTop, diameterBottom, tessellation, subdivisions, scene)
```

**For a cone pointing UP:**
- `diameterTop = 0` (point at the top)
- `diameterBottom = baseRadius` (base of the cone)

**Common mistake:** Reversing these creates an upside-down cone!

**Example:**
```typescript
// Correct: Cone pointing up
const cone = Mesh.CreateCylinder('roof', height, 0, baseRadius, 16, 1, scene);

// Wrong: Upside down cone
const cone = Mesh.CreateCylinder('roof', height, baseRadius, 0, 16, 1, scene);
```

## Rotation Around a Pivot Point

**Problem:** By default, meshes rotate around their own center, not a specific pivot point.

**Solution:** Use a `TransformNode` as a pivot point:

```typescript
// Create pivot at desired rotation point
const pivot = new TransformNode('pivot', scene);
pivot.position = new Vector3(0, 0, 0); // Pivot point location
pivot.parent = parentMesh;

// Create mesh offset from pivot
const mesh = Mesh.CreateBox('mesh', size, scene);
mesh.position = new Vector3(offsetX, offsetY, offsetZ); // Offset from pivot
mesh.parent = pivot;

// Rotate the pivot (not the mesh)
pivot.rotation.y = angle; // Mesh rotates around pivot point
```

**Key points:**
- The pivot node is positioned at the rotation point
- The mesh is positioned relative to the pivot
- Rotation is applied to the pivot, not the mesh
- Both the pivot and mesh should be parented to the main structure

## Parenting and Relative Positioning

**When parenting meshes:**
- Positions become **relative to the parent**, not world coordinates
- Always set position **after** setting the parent (or ensure you're using local coordinates)
- Parent invisible meshes can be used as containers for complex structures

**Pattern for complex structures:**
```typescript
// Create invisible parent container
const container = Mesh.CreateBox('container', 0.1, scene);
container.isVisible = false;
container.position = worldPosition;

// Create child meshes with local positions
const child = Mesh.CreateBox('child', size, scene);
child.position = new Vector3(0, height/2, 0); // Relative to parent
child.parent = container;

return container; // Return parent for manipulation
```

## Creating Custom Meshes with VertexData

**When building custom geometry (like A-frame roofs):**

### 1. Define Vertices Clearly
```typescript
// 6 vertices for a triangular prism
const vertices = new Float32Array([
  // Front triangle (X = +halfWidth)
  halfWidth, 0, halfDepth,        // Left bottom
  halfWidth, 0, -halfDepth,       // Right bottom  
  halfWidth, peakHeight, 0,       // Peak (centered)
  // Back triangle (X = -halfWidth)
  -halfWidth, 0, halfDepth,       // Left bottom
  -halfWidth, 0, -halfDepth,      // Right bottom
  -halfWidth, peakHeight, 0       // Peak (centered)
]);
```

### 2. Winding Order is Critical for Normals

**Babylon.js convention:** Counter-clockwise winding when viewed from **outside** the mesh.

**How to check:**
- Imagine standing outside the mesh looking at a face
- Vertices should be ordered counter-clockwise
- If a face is inside-out (see-through), reverse the winding order

**Example for triangular prism:**
```typescript
const indices = new Uint16Array([
  // Front triangle - counter-clockwise when viewed from +X (outside)
  0, 2, 1,  // Correct winding
  // Back triangle - counter-clockwise when viewed from -X (outside)
  3, 4, 5,  // Correct winding
  // Left side (two triangles)
  0, 2, 5,  // Triangle 1
  0, 5, 3,  // Triangle 2
  // Right side (two triangles)
  1, 2, 5,  // Triangle 1
  1, 5, 4,  // Triangle 2
  // Bottom side (two triangles)
  0, 3, 4,  // Triangle 1
  0, 4, 1   // Triangle 2
]);
```

### 3. Compute Normals Properly
```typescript
const vertexData = new VertexData();
vertexData.positions = vertices;
vertexData.indices = indices;

// Compute normals - create empty array first
const normals: number[] = [];
VertexData.ComputeNormals(vertices, indices, normals);
vertexData.normals = new Float32Array(normals);

vertexData.applyToMesh(mesh);
```

**Common error:** Passing `vertexData.normals!` directly - it's undefined until you compute it!

## Overhang and Dimension Confusion

**Key lesson:** Be explicit about which axis has overhang and why.

**For an A-frame roof:**
- **Peak runs along:** One axis (e.g., X-axis for long edge of house)
- **Triangle cross-section spans:** Perpendicular axis (e.g., Z-axis for short edge)
- **Overhang on long edges:** Extend in the **perpendicular** direction (Z-axis if peak runs along X)

**Avoid naming confusion:**
- Don't use generic "width" and "depth" - use explicit axis names or "parallel to peak" / "perpendicular to peak"
- Document which dimension corresponds to which axis

**Example pattern:**
```typescript
// Explicit axis-based naming
const peakAxis = 'X'; // Peak runs along X-axis
const triangleAxis = 'Z'; // Triangle cross-section spans Z-axis

const roofWidth = houseWidth; // X-axis dimension (no overhang)
const roofDepth = houseDepth + (overhang * 2); // Z-axis dimension (overhang perpendicular to peak)
```

**Or use descriptive names:**
```typescript
const roofLength = houseWidth; // Parallel to peak (no overhang)
const roofSpan = houseDepth + (overhang * 2); // Perpendicular to peak (overhang)
```

## Front/Back Orientation Convention

**Critical for house and tower structures:** Understanding which side is "front" vs "back" is essential for adding features like entryways, porches, doors, etc.

### House Orientation

For houses attached to towers:
- **Back:** The side that overlaps/attaches to the tower (back wall center is at tower center)
- **Front:** The opposite side, facing away from the tower toward the map center

**Positioning Logic:**
```typescript
// Back wall center is at pivot (tower center): X = 0
// House center is at: X = directionToMapCenter * houseWidth / 2
// Front wall is at: X = directionToMapCenter * houseWidth

// Example: Adding mudroom to front
const mudroomPosition = new Vector3(
  directionToMapCenter * (houseWidth + mudroomSize / 2), // Front wall + half mudroom forward
  mudroomHeight / 2,
  0 // Centered on Z axis
);
```

**Key Points:**
- Back wall center = pivot point (tower center)
- Front wall = back wall + `houseWidth` in the `directionToMapCenter` direction
- `directionToMapCenter` = +1 for player tower (toward +X), -1 for AI tower (toward -X)
- All front-facing features (mudroom, porch, door) should be positioned relative to the front wall

### Tower Orientation

For towers:
- **Base:** Bottom of tower (at ground level)
- **Top:** Flagpole/roof at the top
- **Sides:** All sides are equivalent (cylindrical)

**When adding features:**
- Use the house's front/back convention if the feature relates to the house
- Tower-specific features (like windows) can be placed around the perimeter

## Common Mistakes Checklist

When creating a new building element, verify:

- [ ] **Cones:** `diameterTop = 0, diameterBottom = radius` for upward-pointing cone
- [ ] **Rotation pivot:** Using `TransformNode` if rotating around a specific point
- [ ] **Parenting:** Positions are relative to parent, set parent first or use local coordinates
- [ ] **Winding order:** Counter-clockwise when viewed from outside
- [ ] **Normals:** Compute normals properly with empty array first
- [ ] **Overhang logic:** Overhang perpendicular to peak direction
- [ ] **Axis clarity:** Document which dimension maps to which axis
- [ ] **Y-up:** Remember Y is vertical, not Z
- [ ] **Front/Back orientation:** Understand which side is front vs back for houses

## Testing Tips

1. **Start simple:** Build one piece at a time, test each addition
2. **Use visible parent meshes temporarily:** Set `isVisible = false` only after everything works
3. **Test rotation early:** If an element needs rotation, test it before adding other parts
4. **Check from multiple angles:** View your structure from different camera angles
5. **Verify normals:** If you can see through faces, check winding order

## Recommended Pattern for New Structures

```typescript
createStructure(name: string, position: Vector3): Mesh {
  // 1. Create invisible parent container
  const container = Mesh.CreateBox(`${name}_container`, 0.1, scene);
  container.position = position.clone();
  container.isVisible = false;
  
  // 2. Create pivot if rotation needed
  const pivot = new TransformNode(`${name}_pivot`, scene);
  pivot.position = new Vector3(pivotX, pivotY, pivotZ);
  pivot.parent = container;
  
  // 3. Create parts relative to pivot/container
  const part1 = Mesh.CreateBox(`${name}_part1`, size, scene);
  part1.position = new Vector3(x1, y1, z1); // Local coordinates
  part1.parent = pivot; // Or container if no rotation
  
  // 4. Apply rotation to pivot if needed
  pivot.rotation.y = angle;
  
  // 5. Return container for manipulation
  return container;
}
```

## Camera Systems and Camera-Relative Movement

### FreeCamera vs ArcRotateCamera

**FreeCamera** (FPS-style, currently used):
- Camera position is the pivot point (like an eyeball at center of sphere)
- Rotation is stored in `rotation` property as `Vector3`:
  - `rotation.x` = **Pitch** (up/down, rotation around horizontal left-right axis)
  - `rotation.y` = **Yaw** (left/right, rotation around vertical Y-axis)
  - `rotation.z` = **Roll** (rotation around forward axis, rarely used)
- Movement is relative to camera's current view direction
- Use `getDirection(Vector3.Forward())` to get forward vector
- Use `getDirection(Vector3.Right())` to get right vector
- Use `getDirection(Vector3.Up())` to get up vector

**ArcRotateCamera** (orbit-style, previously used):
- Camera orbits around a target point
- Rotation stored as `alpha` (horizontal) and `beta` (vertical)
- Movement moves the target, not the camera position
- Less intuitive for FPS-style navigation

### Getting Camera-Relative Directions

**For FreeCamera**, use `getDirection()` to get vectors relative to camera's current rotation:

```typescript
// Get camera's forward, right, and up vectors
const forward = camera.getDirection(Vector3.Forward());
const right = camera.getDirection(Vector3.Right());
const up = camera.getDirection(Vector3.Up());

// Move forward relative to camera view
const newPosition = camera.position.add(forward.scale(distance));

// Strafe right relative to camera view
const newPosition = camera.position.add(right.scale(distance));

// Move up relative to camera view
const newPosition = camera.position.add(up.scale(distance));
```

**Key Points:**
- `getDirection()` returns normalized vectors (length = 1)
- Vectors are relative to camera's current rotation
- Forward = direction camera is looking
- Right = perpendicular right to camera's view
- Up = perpendicular up to camera's view

### Camera-Relative Movement Patterns

**Moving forward/backward:**
```typescript
const forward = camera.getDirection(Vector3.Forward());
const newPosition = camera.position.add(forward.scale(moveDistance)); // Forward
// or
const newPosition = camera.position.subtract(forward.scale(moveDistance)); // Backward
```

**Strafing left/right (horizontal plane only):**
```typescript
const right = camera.getDirection(Vector3.Right());
const rightHorizontal = new Vector3(right.x, 0, right.z).normalize(); // Project to XZ plane
const newPosition = camera.position.add(rightHorizontal.scale(moveDistance)); // Right
// or
const newPosition = camera.position.subtract(rightHorizontal.scale(moveDistance)); // Left
```

**Rotating camera:**
```typescript
// Yaw (left/right around Y-axis)
camera.rotation.y += rotationAmount; // Rotate right
camera.rotation.y -= rotationAmount; // Rotate left

// Pitch (up/down around horizontal axis)
camera.rotation.x += rotationAmount; // Look down
camera.rotation.x -= rotationAmount; // Look up

// Limit pitch to prevent flipping
camera.rotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, camera.rotation.x));
```

### Converting Camera Rotation to Direction (for UI)

**For compass/minimap display:**
```typescript
// Get yaw angle (horizontal rotation)
const yaw = camera.rotation.y;

// Convert to direction vector on XZ plane
const dirX = Math.cos(yaw);
const dirZ = Math.sin(yaw);

// For 2D display (screen Y is inverted)
const screenDirX = Math.cos(yaw);
const screenDirY = -Math.sin(yaw); // Negative because screen Y is inverted
```

**Key Points:**
- `rotation.y` (yaw) determines horizontal facing direction
- `Math.cos(yaw)` gives X component
- `Math.sin(yaw)` gives Z component
- Screen Y-axis is inverted, so use `-Math.sin(yaw)` for 2D displays

## Terrain Placement and Height Sampling

**Critical for structures:** All structures must be positioned on the terrain surface, not floating in the air.

### Positioning Structures on Terrain

**Pattern for terrain-aware positioning:**

```typescript
// 1. Sample terrain height at desired X/Z position
const terrainHeight = terrainManager.getHeightAt(position.x, position.z);

// 2. Set parent container at terrain height
const container = Mesh.CreateBox(`${name}_container`, 0.1, scene);
container.position = new Vector3(position.x, terrainHeight, position.z);

// 3. Position child meshes relative to parent (bottom at parent Y = terrain height)
const child = Mesh.CreateCylinder(`${name}_story1`, height, radius, radius, 16, 1, scene);
child.position = new Vector3(0, height / 2, 0); // Bottom at parent Y (terrain height)
child.parent = container;
```

**Key Points:**
- Parent container Y = terrain height (sampled from `TerrainManager`)
- Child meshes positioned with `position.y = height / 2` so bottom is at parent Y
- For boxes: `position.y = boxHeight / 2` (bottom at terrain)
- For cylinders: `position.y = cylinderHeight / 2` (bottom at terrain)
- For spheres: `position.y = radius` (bottom at terrain)

### Water/Land Placement Rules

**Different resource types have different placement requirements:**

```typescript
// Land-only resources (must be above sea level)
const LAND_RESOURCES = ['WOOD', 'STONE', 'CRYSTAL', 'ESSENCE'];
const LAND_THRESHOLD = -9.5; // 0.5m above sea level (-10m)

// Water-allowed resources (can be in water)
const WATER_RESOURCES = ['GOLD', 'MANA'];
const SEA_LEVEL = -10.0; // Adjusted for raised terrain

// Validate position
if (LAND_RESOURCES.includes(resourceType)) {
  if (terrainHeight <= LAND_THRESHOLD) {
    // Invalid - retry at different position
  }
}
```

**Tower Placement:**
- Towers must be on land (at least 1m above sea level = -9m)
- Use spiral search pattern if initial position is in water
- Prefer higher ground when multiple valid positions available

### Common Mistakes

- **Floating structures**: Forgetting to sample terrain height, using fixed Y coordinate
- **Wrong Y offset**: Positioning mesh center at terrain height instead of bottom
- **Water placement**: Placing land-only resources in water without validation
- **No retry logic**: Not handling cases where initial position is invalid

**Always verify:**
- [ ] Terrain height sampled before positioning
- [ ] Parent container Y = terrain height
- [ ] Child meshes positioned so bottom is at parent Y
- [ ] Water/land rules enforced for resources
- [ ] Retry logic for invalid positions

## Related Documentation

- [Babylon.js Documentation](https://doc.babylonjs.com/)
- [GameScale](../utils/GameScale.ts) - Scale constants for consistent sizing
- [PrimitiveFactory](../assets/PrimitiveFactory.ts) - Examples of structure creation
- [Camera Controls Status](../status/CAMERA_CONTROLS_COMPLETE.md) - Full camera implementation details
- [Terrain System Status](../status/TERRAIN_SYSTEM_COMPLETE.md) - Terrain system implementation details