/**
 * Primitive Factory - Creates primitive meshes for MVP
 */

import { Scene, Mesh, StandardMaterial, Color3, Vector3, TransformNode, VertexData } from '@babylonjs/core';
import { MaterialLibrary } from './MaterialLibrary';
import { AssetCatalog, AssetCategory, AssetType } from './AssetCatalog';
import { GameScale } from '../utils/GameScale';
import { RoomType } from '../components/BuildingComponent';

export interface PrimitiveOptions {
  materialId?: string;
  color?: Color3;
  size?: number;
  position?: Vector3;
}

export class PrimitiveFactory {
  private static instance: PrimitiveFactory;
  private scene: Scene | null = null;
  private materialLibrary: MaterialLibrary;
  private catalog: AssetCatalog;

  private constructor() {
    this.materialLibrary = MaterialLibrary.getInstance();
    this.catalog = AssetCatalog.getInstance();
  }

  static getInstance(): PrimitiveFactory {
    if (!PrimitiveFactory.instance) {
      PrimitiveFactory.instance = new PrimitiveFactory();
    }
    return PrimitiveFactory.instance;
  }

  /**
   * Initialize with scene
   */
  initialize(scene: Scene): void {
    this.scene = scene;
  }

  /**
   * Create a box primitive
   */
  createBox(name: string, options: PrimitiveOptions = {}): Mesh {
    if (!this.scene) {
      throw new Error('PrimitiveFactory not initialized with scene');
    }

    const size = options.size ?? 1;
    const box = Mesh.CreateBox(name, size, this.scene);
    box.isPickable = true; // Enable raycasting/picking
    
    if (options.position) {
      box.position = options.position;
    }

    this.applyMaterial(box, options);
    return box;
  }

  /**
   * Create a sphere primitive
   */
  createSphere(name: string, options: PrimitiveOptions = {}): Mesh {
    if (!this.scene) {
      throw new Error('PrimitiveFactory not initialized with scene');
    }

    const size = options.size ?? 1;
    const sphere = Mesh.CreateSphere(name, 16, size, this.scene);
    sphere.isPickable = true; // Enable raycasting/picking
    
    if (options.position) {
      sphere.position = options.position;
    }

    this.applyMaterial(sphere, options);
    return sphere;
  }

  /**
   * Create a cylinder primitive
   */
  createCylinder(name: string, options: PrimitiveOptions = {}): Mesh {
    if (!this.scene) {
      throw new Error('PrimitiveFactory not initialized with scene');
    }

    const size = options.size ?? 1;
    const cylinder = Mesh.CreateCylinder(name, size, size, size, 16, 1, this.scene);
    cylinder.isPickable = true; // Enable raycasting/picking
    
    if (options.position) {
      cylinder.position = options.position;
    }

    this.applyMaterial(cylinder, options);
    return cylinder;
  }

  /**
   * Create a ground plane
   */
  createGround(name: string, width: number, height: number, options: PrimitiveOptions = {}): Mesh {
    if (!this.scene) {
      throw new Error('PrimitiveFactory not initialized with scene');
    }

    const ground = Mesh.CreateGround(name, width, height, 2, this.scene);
    ground.isPickable = false; // Ground should not be pickable (to allow clicking through to objects)
    
    if (options.position) {
      ground.position = options.position;
    }

    this.applyMaterial(ground, options);
    return ground;
  }

  /**
   * Apply material to mesh
   */
  private applyMaterial(mesh: Mesh, options: PrimitiveOptions): void {
    if (options.materialId) {
      const material = this.materialLibrary.getBabylonMaterial(options.materialId, this.scene!);
      mesh.material = material;
    } else if (options.color) {
      const material = new StandardMaterial(`${mesh.name}_material`, this.scene!);
      material.diffuseColor = options.color;
      mesh.material = material;
    }
  }

  /**
   * Create a tower base - simple 2-story tower (just the cylinder, no house)
   * Two cylinders (one per story), cone roof, and flagpole
   */
  createTowerBase(name: string, position: Vector3, radius?: number): Mesh {
    if (!this.scene) {
      throw new Error('PrimitiveFactory not initialized with scene');
    }

    // Create a parent mesh to hold all parts
    const tower = Mesh.CreateBox(`${name}_base`, 0.1, this.scene); // Tiny invisible parent
    tower.position = position.clone();
    tower.isVisible = false; // Parent is invisible, only children show
    tower.isPickable = true;

    const towerSize = radius ?? GameScale.COTTAGE_TOWER_SIZE; // Radius of tower (use provided or default)
    const floorHeight = GameScale.TOWER_FLOOR_HEIGHT; // Height of each story
    const towerRoofHeight = GameScale.COTTAGE_TOWER_ROOF_HEIGHT;
    const flagpoleHeight = GameScale.COTTAGE_FLAGPOLE_HEIGHT;
    const flagpoleRadius = GameScale.COTTAGE_FLAGPOLE_RADIUS;

    // Generate unique random gray shade for THIS tower's stories (0.3 to 0.7 for medium grays)
    // Use name hash to ensure uniqueness even if Math.random() returns similar values
    const nameHash = this.hashString(name);
    const towerGrayShade = 0.3 + ((Math.random() + nameHash) % 1) * 0.4; // Random between 0.3 and 0.7, seeded by name
    const towerGray = new Color3(towerGrayShade, towerGrayShade, towerGrayShade);

    // First story (bottom cylinder) - uses tower gray
    // Position so bottom of cylinder is at parent position (terrain height)
    const story1 = Mesh.CreateCylinder(`${name}_story1`, floorHeight, towerSize, towerSize, 16, 1, this.scene);
    story1.position = new Vector3(0, floorHeight / 2, 0); // Bottom at parent position (0), center at half height
    story1.parent = tower;
    story1.isPickable = true;
    // Create unique material instance for this tower's stories
    const story1Material = new StandardMaterial(`${name}_story1_material`, this.scene);
    story1Material.diffuseColor = towerGray;
    story1.material = story1Material;

    // Second story (top cylinder) - uses same tower gray
    const story2 = Mesh.CreateCylinder(`${name}_story2`, floorHeight, towerSize, towerSize, 16, 1, this.scene);
    story2.position = new Vector3(0, floorHeight + floorHeight / 2, 0); // On top of first story
    story2.parent = tower;
    story2.isPickable = true;
    // Create unique material instance for this tower's stories
    const story2Material = new StandardMaterial(`${name}_story2_material`, this.scene);
    story2Material.diffuseColor = towerGray;
    story2.material = story2Material;

    // Generate unique random dark green or red for THIS tower's roof
    // Use name hash to ensure uniqueness
    const towerRoofHash = this.hashString(`${name}_roof`);
    const towerIsGreen = ((Math.random() + towerRoofHash) % 1) > 0.5;
    const towerDarkShade = 0.2 + ((Math.random() + towerRoofHash * 0.7) % 1) * 0.2; // Random between 0.2 and 0.4 (dark)
    const towerRoofColor = towerIsGreen 
      ? new Color3(0, towerDarkShade, 0) // Dark green
      : new Color3(towerDarkShade, 0, 0); // Dark red

    // Cone roof
    // CreateCylinder: (name, height, diameterTop, diameterBottom, tessellation, subdivisions, scene)
    // For a cone pointing up: diameterTop = 0 (point), diameterBottom = towerSize (base)
    const roof = Mesh.CreateCylinder(`${name}_roof`, towerRoofHeight, 0, towerSize, 16, 1, this.scene);
    roof.position = new Vector3(0, floorHeight * 2 + towerRoofHeight / 2, 0); // On top of second story
    roof.parent = tower;
    roof.isPickable = true;
    // Create unique material instance for this tower's roof
    const roofMaterial = new StandardMaterial(`${name}_roof_material`, this.scene);
    roofMaterial.diffuseColor = towerRoofColor;
    roof.material = roofMaterial;

    // Flag pole (thin cylinder on top of roof)
    const flagpole = Mesh.CreateCylinder(`${name}_flagpole`, flagpoleHeight, flagpoleRadius, flagpoleRadius, 8, 1, this.scene);
    flagpole.position = new Vector3(0, floorHeight * 2 + towerRoofHeight + flagpoleHeight / 2, 0);
    flagpole.parent = tower;
    flagpole.isPickable = true;
    const flagpoleMaterial = new StandardMaterial(`${name}_flagpole_material`, this.scene);
    flagpoleMaterial.diffuseColor = new Color3(0.3, 0.3, 0.3); // Dark gray for metal pole
    flagpole.material = flagpoleMaterial;

    // House is now created separately via createHouse method

    // Register in catalog
    this.catalog.registerAsset(
      `${name}_base`,
      'Tower Base (2-Story Tower)',
      AssetCategory.BUILDINGS,
      AssetType.MODEL_3D,
      'Starting tower base - 2-story cylindrical tower with cone roof',
      { usageContext: 'Player starting building' }
    );

    return tower;
  }

  /**
   * Create a house structure (separate from tower)
   * @param name - Unique name for the house mesh
   * @param position - World position (should be at tower center)
   * @param owner - 'player' or 'ai' (determines direction)
   * @param upgradeLevel - Upgrade level (0 = base size, increases size)
   */
  createHouse(name: string, position: Vector3, owner: 'player' | 'ai', upgradeLevel: number = 0): Mesh {
    if (!this.scene) {
      throw new Error('PrimitiveFactory not initialized with scene');
    }

    // Create a parent mesh to hold all parts
    const houseContainer = Mesh.CreateBox(`${name}_container`, 0.1, this.scene);
    houseContainer.position = position.clone();
    houseContainer.isVisible = false; // Parent is invisible, only children show
    houseContainer.isPickable = true;

    // House dimensions from GameScale (can be upgraded)
    const baseWidth = GameScale.COTTAGE_HOUSE_WIDTH; // 5.0m (long edge - front to back)
    const baseDepth = GameScale.COTTAGE_HOUSE_DEPTH; // 4.0m (short edge - side to side)
    const baseHeight = GameScale.COTTAGE_HOUSE_HEIGHT; // 3.0m (wall height)
    
    // Upgrade increases size by 10% per level
    const upgradeMultiplier = 1.0 + (upgradeLevel * 0.1);
    const houseWidth = baseWidth * upgradeMultiplier;
    const houseDepth = baseDepth * upgradeMultiplier;
    const houseHeight = baseHeight * upgradeMultiplier;
    
    // Determine direction from tower to map center (0, 0, 0)
    // Player tower at (-20, 0, 0) -> map center (0, 0, 0) = +X direction
    // AI tower at (20, 0, 0) -> map center (0, 0, 0) = -X direction
    const directionToMapCenter = owner === 'player' ? 1 : -1; // +1 for +X, -1 for -X
    
    // Create a pivot node at the tower center (where back wall center will be)
    const housePivot = new TransformNode(`${name}_house_pivot`, this.scene);
    housePivot.position = new Vector3(0, 0, 0); // Pivot at tower center
    housePivot.parent = houseContainer;
    
    // Create rectangular house box
    // Box is created with height as the size parameter, then scaled
    // Long edge (houseWidth) goes along X axis, short edge (houseDepth) goes along Z axis
    const house = Mesh.CreateBox(`${name}_house`, houseHeight, this.scene);
    house.scaling = new Vector3(houseWidth / houseHeight, 1, houseDepth / houseHeight);
    
    // Position house relative to pivot:
    // - Back wall center is at pivot (tower center)
    // - House center is offset forward by half the width (houseWidth/2) in the direction toward map center
    // - Bottom of house box is at pivot Y position (terrain height)
    house.position = new Vector3(
      directionToMapCenter * houseWidth / 2, // X: forward toward map center from pivot
      houseHeight / 2, // Y: bottom at pivot (0), center at half height
      0 // Z: centered (no offset)
    );
    
    // Parent house to pivot node (so it rotates around the pivot)
    house.parent = housePivot;
    
    // Rotate pivot node around Y axis (vertical) at the tower center
    // Base direction points toward map center (0°), add random ±90° variation
    const randomVariation = (Math.random() - 0.5) * Math.PI; // -90° to +90°
    housePivot.rotation.y = randomVariation;
    
    // Now the house rotates around the pivot (back wall center at tower center)
    house.isPickable = true;
    
    // Generate unique random gray shade for THIS house (0.3 to 0.7 for medium grays)
    // Use name hash to ensure uniqueness even if Math.random() returns similar values
    const houseNameHash = this.hashString(name);
    const houseGrayShade = 0.3 + ((Math.random() + houseNameHash) % 1) * 0.4; // Random between 0.3 and 0.7, seeded by name
    const houseGray = new Color3(houseGrayShade, houseGrayShade, houseGrayShade);
    
    // Create unique material instance for this house
    const houseMaterial = new StandardMaterial(`${name}_house_material`, this.scene);
    houseMaterial.diffuseColor = houseGray;
    house.material = houseMaterial;

    // Create mudroom/entryway at the front of the house
    // Front is opposite from the back (which overlaps the tower)
    // Mudroom: 1/3 the length of the short edge (houseDepth), square, 1 story tall
    const mudroomSize = houseDepth / 3; // Square mudroom
    const mudroomHeight = houseHeight; // Same height as house walls (1 story)
    
    // Position mudroom at the front center of the house
    // House positioning:
    // - Back wall center is at pivot (tower center): X = 0
    // - House center is at: X = directionToMapCenter * houseWidth / 2
    // - Front wall is at: X = directionToMapCenter * houseWidth
    // Mudroom center should be at front wall + half mudroom depth forward
    const mudroom = Mesh.CreateBox(`${name}_mudroom`, mudroomHeight, this.scene);
    mudroom.scaling = new Vector3(mudroomSize / mudroomHeight, 1, mudroomSize / mudroomHeight); // Square base
    mudroom.position = new Vector3(
      directionToMapCenter * (houseWidth + mudroomSize / 2), // Front wall + half mudroom depth forward
      mudroomHeight / 2, // Half height above ground
      0 // Centered on Z axis (front wall center)
    );
    mudroom.parent = housePivot; // Parent to pivot so it rotates with house
    mudroom.isPickable = true;
    
    // Use same gray as house (or could be slightly different)
    const mudroomMaterial = new StandardMaterial(`${name}_mudroom_material`, this.scene);
    mudroomMaterial.diffuseColor = houseGray.clone(); // Same gray as house
    mudroom.material = mudroomMaterial;

    // Create A-frame roof (triangular prism) with overhang on long sides only
    const roofPeakHeight = GameScale.COTTAGE_ROOF_PEAK_HEIGHT * upgradeMultiplier; // 1.5m peak height (scaled)
    const roofOverhang = 0.5 * upgradeMultiplier; // 0.5m overhang on each long side (scaled)
    // The roof peak runs along X-axis (the long edge direction)
    // For an A-frame roof: peak runs along long edge (X-axis), triangle cross-section spans short edge (Z-axis)
    // Overhang should be on the LONG edges: these are the edges parallel to the peak (along X-axis)
    // So the overhang extends in the X direction (where the peak runs)
    // roofWidth (X-axis) = houseWidth + overhang (overhangs long edges)
    // roofDepth (Z-axis) = houseDepth (no overhang, matches short edges exactly)
    const roofWidth = houseWidth + (roofOverhang * 2); // Overhang on long edges (X-axis)
    const roofDepth = houseDepth; // No overhang on short edges (Z-axis)
    
    // Create a triangular prism (roof shape) using VertexData
    const houseRoof = new Mesh(`${name}_house_roof`, this.scene);
    
    // Define vertices for triangular prism
    // The roof peak runs along the long axis (X-axis), with triangle cross-section in YZ plane
    const halfWidth = roofWidth / 2; // Half width including overhang (X-axis, where peak runs)
    const halfDepth = roofDepth / 2; // Half depth (Z-axis, perpendicular to peak)
    
    // Vertices for triangular prism (6 vertices for front and back triangles)
    const vertices = new Float32Array([
      // Front triangle (X = +halfWidth, along the long edge)
      halfWidth, 0, halfDepth,               // Left bottom front
      halfWidth, 0, -halfDepth,              // Right bottom front
      halfWidth, roofPeakHeight, 0,          // Peak front (centered on Z axis)
      
      // Back triangle (X = -halfWidth, along the long edge)
      -halfWidth, 0, halfDepth,              // Left bottom back
      -halfWidth, 0, -halfDepth,             // Right bottom back
      -halfWidth, roofPeakHeight, 0          // Peak back (centered on Z axis)
    ]);
    
    // Indices to form triangular faces for triangular prism
    // Using counter-clockwise winding when viewed from outside for proper normals
    const indices = new Uint16Array([
      // Front triangle (X = +halfWidth) - counter-clockwise when viewed from +X direction (outward)
      0, 2, 1,  // front left (halfDepth), front peak, front right (-halfDepth)
      // Back triangle (X = -halfWidth) - counter-clockwise when viewed from -X direction (outward)
      3, 4, 5,  // back left (halfDepth), back right (-halfDepth), back peak
      // Left rectangular side (positive Z side)
      0, 3, 5,  // front left, back left, back peak
      0, 5, 2,  // front left, back peak, front peak
      // Right rectangular side (negative Z side)
      1, 2, 5,  // front right, front peak, back peak
      1, 5, 4,  // front right, back peak, back right
      // Bottom rectangular side (base)
      0, 1, 4,  // front left, front right, back right
      0, 4, 3   // front left, back right, back left
    ]);
    
    // Create VertexData
    const vertexData = new VertexData();
    vertexData.positions = vertices;
    vertexData.indices = indices;
    
    // Compute normals for proper lighting
    const normals: number[] = [];
    VertexData.ComputeNormals(vertices, indices, normals);
    vertexData.normals = new Float32Array(normals);
    
    // Apply vertex data to mesh
    vertexData.applyToMesh(houseRoof);
    
    // Position roof on top of house
    houseRoof.position = new Vector3(
      directionToMapCenter * houseWidth / 2, // Same X offset as house center
      houseHeight, // Base of roof sits on top of house walls
      0 // Centered on Z axis
    );
    
    houseRoof.parent = housePivot; // Parent to pivot so it rotates with house
    houseRoof.isPickable = true;
    
    // Generate unique random dark green or red for THIS house's roof
    // Use name hash to ensure uniqueness and independence from tower roof
    const houseRoofHash = this.hashString(`${name}_house_roof`);
    const houseIsGreen = ((Math.random() + houseRoofHash) % 1) > 0.5;
    const houseDarkShade = 0.2 + ((Math.random() + houseRoofHash * 0.7) % 1) * 0.2; // Random between 0.2 and 0.4 (dark)
    const houseRoofColor = houseIsGreen 
      ? new Color3(0, houseDarkShade, 0) // Dark green
      : new Color3(houseDarkShade, 0, 0); // Dark red

    // Create unique material instance for this house's roof
    const houseRoofMaterial = new StandardMaterial(`${name}_house_roof_material`, this.scene);
    houseRoofMaterial.diffuseColor = houseRoofColor;
    houseRoof.material = houseRoofMaterial;
    
    // Create A-frame roof for mudroom (same style as house roof)
    // Peak runs along X-axis (same orientation as house roof)
    // Triangle cross-section spans Z-axis
    // Overhang on X-axis edges (parallel to peak), no overhang on Z-axis edges
    const mudroomRoofPeakHeight = GameScale.COTTAGE_ROOF_PEAK_HEIGHT * upgradeMultiplier; // Same peak height as house
    const mudroomRoofOverhang = 0.5 * upgradeMultiplier; // Same overhang as house
    const mudroomRoofWidth = mudroomSize + (mudroomRoofOverhang * 2); // Overhang on X-axis edges (parallel to peak)
    const mudroomRoofDepth = mudroomSize; // No overhang on Z-axis edges (perpendicular to peak)
    
    // Create triangular prism for mudroom roof
    const mudroomRoof = new Mesh(`${name}_mudroom_roof`, this.scene);
    
    // Define vertices for triangular prism (same structure as house roof)
    const mudroomHalfWidth = mudroomRoofWidth / 2; // Half width including overhang (X-axis, where peak runs)
    const mudroomHalfDepth = mudroomRoofDepth / 2; // Half depth (Z-axis, perpendicular to peak)
    
    const mudroomRoofVertices = new Float32Array([
      // Front triangle (X = +mudroomHalfWidth, along the long edge)
      mudroomHalfWidth, 0, mudroomHalfDepth,               // Left bottom front
      mudroomHalfWidth, 0, -mudroomHalfDepth,              // Right bottom front
      mudroomHalfWidth, mudroomRoofPeakHeight, 0,          // Peak front (centered on Z axis)
      
      // Back triangle (X = -mudroomHalfWidth, along the long edge)
      -mudroomHalfWidth, 0, mudroomHalfDepth,              // Left bottom back
      -mudroomHalfWidth, 0, -mudroomHalfDepth,             // Right bottom back
      -mudroomHalfWidth, mudroomRoofPeakHeight, 0          // Peak back (centered on Z axis)
    ]);
    
    // Indices for triangular prism (same winding order as house roof)
    const mudroomRoofIndices = new Uint16Array([
      // Front triangle (X = +mudroomHalfWidth) - counter-clockwise when viewed from +X direction (outward)
      0, 2, 1,  // front left (mudroomHalfDepth), front peak, front right (-mudroomHalfDepth)
      // Back triangle (X = -mudroomHalfWidth) - counter-clockwise when viewed from -X direction (outward)
      3, 4, 5,  // back left (mudroomHalfDepth), back right (-mudroomHalfDepth), back peak
      // Left rectangular side (positive Z side)
      0, 3, 5,  // front left, back left, back peak
      0, 5, 2,  // front left, back peak, front peak
      // Right rectangular side (negative Z side)
      1, 2, 5,  // front right, front peak, back peak
      1, 5, 4,  // front right, back peak, back right
      // Bottom rectangular side (base)
      0, 1, 4,  // front left, front right, back right
      0, 4, 3   // front left, back right, back left
    ]);
    
    // Create VertexData for mudroom roof
    const mudroomRoofVertexData = new VertexData();
    mudroomRoofVertexData.positions = mudroomRoofVertices;
    mudroomRoofVertexData.indices = mudroomRoofIndices;
    
    // Compute normals
    const mudroomRoofNormals: number[] = [];
    VertexData.ComputeNormals(mudroomRoofVertices, mudroomRoofIndices, mudroomRoofNormals);
    mudroomRoofVertexData.normals = new Float32Array(mudroomRoofNormals);
    
    // Apply vertex data to mesh
    mudroomRoofVertexData.applyToMesh(mudroomRoof);
    
    // Position mudroom roof on top of mudroom
    mudroomRoof.position = new Vector3(
      directionToMapCenter * (houseWidth + mudroomSize / 2), // Same X offset as mudroom center
      mudroomHeight, // Base of roof sits on top of mudroom walls
      0 // Centered on Z axis
    );
    
    mudroomRoof.parent = housePivot; // Parent to pivot so it rotates with house
    mudroomRoof.isPickable = true;
    
    // Use same roof color as house roof
    const mudroomRoofMaterial = new StandardMaterial(`${name}_mudroom_roof_material`, this.scene);
    mudroomRoofMaterial.diffuseColor = houseRoofColor.clone(); // Same color as house roof
    mudroomRoof.material = mudroomRoofMaterial;

    return houseContainer;
  }

  /**
   * Create a resource node primitive
   */
  createResourceNode(resourceType: string, position: Vector3): Mesh {
    const materialMap: Record<string, string> = {
      'wood': 'wood_resource',
      'stone': 'stone_resource',
      'gold': 'gold',
      'crystal': 'crystal',
      'essence': 'essence',
      'mana': 'mana'
    };

    const materialId = materialMap[resourceType] || 'stone_resource';
    const size = resourceType === 'crystal' || resourceType === 'essence' || resourceType === 'mana' 
      ? GameScale.RESOURCE_NODE_SMALL 
      : GameScale.RESOURCE_NODE_SIZE;

    const shape = resourceType === 'crystal' || resourceType === 'essence' || resourceType === 'mana'
      ? this.createSphere(`resource_${resourceType}`, { size, position, materialId })
      : this.createBox(`resource_${resourceType}`, { size, position, materialId });

    // Register in catalog
    this.catalog.registerAsset(
      `resource_${resourceType}`,
      `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} Resource Node`,
      AssetCategory.RESOURCES,
      AssetType.MODEL_3D,
      `${resourceType} resource collection node`,
      { usageContext: 'Resource spawning' }
    );

    return shape;
  }

  /**
   * Create a servant primitive
   * Servant is person-sized: ~1.7m tall, ~0.5m wide
   */
  createServant(name: string, position: Vector3): Mesh {
    if (!this.scene) {
      throw new Error('PrimitiveFactory not initialized with scene');
    }
    
    const radius = GameScale.SERVANT_RADIUS;
    const height = GameScale.SERVANT_HEIGHT;
    const servant = Mesh.CreateCylinder(name, height, radius, radius, 16, 1, this.scene);
    servant.isPickable = true; // Enable raycasting/picking
    servant.position = position;
    
    // Apply material
    const material = this.materialLibrary.getBabylonMaterial('servant', this.scene);
    servant.material = material;

    // Register in catalog
    this.catalog.registerAsset(
      'servant',
      'Servant',
      AssetCategory.CHARACTERS,
      AssetType.MODEL_3D,
      'Player-controlled servant for resource collection',
      { variants: ['servant_1', 'servant_2'] }
    );

    return servant;
  }

  /**
   * Create an enemy primitive
   */
  createEnemy(enemyType: string, position: Vector3): Mesh {
    const size = enemyType === 'large' ? GameScale.ENEMY_LARGE_SIZE : GameScale.ENEMY_BASIC_SIZE;
    const enemy = this.createBox(`enemy_${enemyType}`, {
      size,
      position,
      materialId: 'enemy_basic'
    });

    // Register in catalog
    this.catalog.registerAsset(
      `enemy_${enemyType}`,
      `${enemyType.charAt(0).toUpperCase() + enemyType.slice(1)} Enemy`,
      AssetCategory.CHARACTERS,
      AssetType.MODEL_3D,
      `${enemyType} enemy type`,
      { usageContext: 'Wave combat' }
    );

    return enemy;
  }

  /**
   * Create a ground structure (turret, wall, etc.)
   * @param buildingType - Building type from BuildingType enum (e.g., 'turret', 'wall')
   */
  /**
   * Create a tower floor - cylindrical structure that stacks on tower base
   * @param name - Unique name for the floor mesh
   * @param position - World position (should be calculated from tower base top)
   * @param roomType - Type of room (affects visual appearance)
   * @param buildingType - Building type enum
   */
  createTowerFloor(
    name: string, 
    position: Vector3,
    radius: number, // Radius in meters for this floor
    roomType: RoomType | string = RoomType.SPECIALIZED,
    buildingType: string = 'tower_floor'
  ): Mesh {
    if (!this.scene) {
      throw new Error('PrimitiveFactory not initialized with scene');
    }

    // Create a parent mesh to hold all parts
    const floor = Mesh.CreateBox(`${name}_container`, 0.1, this.scene);
    floor.position = position.clone();
    floor.isVisible = false; // Parent is invisible, only children show
    floor.isPickable = true;

    const floorHeight = GameScale.TOWER_FLOOR_HEIGHT; // 3.0m tall

    // Main cylindrical floor structure - use provided radius
    const floorCylinder = Mesh.CreateCylinder(`${name}_cylinder`, floorHeight, radius, radius, 16, 1, this.scene);
    floorCylinder.position = new Vector3(0, floorHeight / 2, 0); // Center at half height relative to parent
    floorCylinder.parent = floor;
    floorCylinder.isPickable = true;
    
    // Base material - wood/stone depending on room type
    const baseMaterial = this.materialLibrary.getBabylonMaterial('wood', this.scene);
    floorCylinder.material = baseMaterial;

    // Add visual variations based on room type
    this.addRoomTypeVariations(floor, floorCylinder, roomType, radius, floorHeight);

    return floor;
  }

  /**
   * Add visual variations to tower floor based on room type
   */
  private addRoomTypeVariations(
    parent: Mesh,
    floorCylinder: Mesh,
    roomType: RoomType | string,
    floorRadius: number,
    floorHeight: number
  ): void {
    if (!this.scene) return;

    // Normalize room type to string for comparison
    const roomTypeStr = typeof roomType === 'string' ? roomType.toLowerCase() : (roomType as RoomType).toLowerCase();

    // Small decorative elements based on room type
    switch (roomTypeStr) {
      case 'defense':
        // Add small turret-like protrusions or defensive elements
        // Create small boxes around the perimeter to suggest battlements
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * floorRadius * 0.9;
          const z = Math.sin(angle) * floorRadius * 0.9;
          const battlement = Mesh.CreateBox(`${parent.name}_battlement_${i}`, 0.3, this.scene);
          battlement.position = new Vector3(x, floorHeight - 0.15, z);
          battlement.scaling = new Vector3(0.2, 0.3, 0.2);
          battlement.parent = parent;
          battlement.isPickable = true;
          const defenseMaterial = this.materialLibrary.getBabylonMaterial('stone_wall', this.scene);
          battlement.material = defenseMaterial;
        }
        // Darken the floor material slightly for defensive look
        if (floorCylinder.material instanceof StandardMaterial) {
          floorCylinder.material.diffuseColor = new Color3(0.5, 0.5, 0.5); // Gray stone
        }
        break;

      case 'offense':
        // Add cannon mounts or offensive elements
        // Create small cylinders on top to suggest cannon mounts
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          const x = Math.cos(angle) * floorRadius * 0.7;
          const z = Math.sin(angle) * floorRadius * 0.7;
          const mount = Mesh.CreateCylinder(`${parent.name}_mount_${i}`, 0.2, 0.15, 0.15, 8, 1, this.scene);
          mount.position = new Vector3(x, floorHeight - 0.1, z);
          mount.parent = parent;
          mount.isPickable = true;
          const metalMaterial = new StandardMaterial(`${parent.name}_metal_${i}`, this.scene);
          metalMaterial.diffuseColor = new Color3(0.2, 0.2, 0.2); // Dark metal
          mount.material = metalMaterial;
        }
        break;

      case 'resource':
        // Add storage crates or workshop elements
        // Create small boxes to suggest storage
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const x = Math.cos(angle) * floorRadius * 0.6;
          const z = Math.sin(angle) * floorRadius * 0.6;
          const crate = Mesh.CreateBox(`${parent.name}_crate_${i}`, 0.4, this.scene);
          crate.position = new Vector3(x, floorHeight / 2, z);
          crate.scaling = new Vector3(0.3, 0.4, 0.3);
          crate.parent = parent;
          crate.isPickable = true;
          const woodMaterial = this.materialLibrary.getBabylonMaterial('wood', this.scene);
          crate.material = woodMaterial;
        }
        break;

      case 'housing':
        // Add windows or balcony elements
        // Create small boxes to suggest windows
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * floorRadius * 0.95;
          const z = Math.sin(angle) * floorRadius * 0.95;
          const window = Mesh.CreateBox(`${parent.name}_window_${i}`, 0.2, this.scene);
          window.position = new Vector3(x, floorHeight * 0.6, z);
          window.scaling = new Vector3(0.15, 0.3, 0.05);
          window.parent = parent;
          window.isPickable = true;
          const windowMaterial = new StandardMaterial(`${parent.name}_window_mat_${i}`, this.scene);
          windowMaterial.diffuseColor = new Color3(0.1, 0.1, 0.2); // Dark blue for windows
          window.material = windowMaterial;
        }
        break;

      case 'specialized':
      default:
        // Magical elements - glowing runes or magical symbols
        // Create small glowing spheres to suggest magical energy
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const x = Math.cos(angle) * floorRadius * 0.8;
          const z = Math.sin(angle) * floorRadius * 0.8;
          const rune = Mesh.CreateSphere(`${parent.name}_rune_${i}`, 8, 0.15, this.scene);
          rune.position = new Vector3(x, floorHeight * 0.7, z);
          rune.parent = parent;
          rune.isPickable = true;
          const runeMaterial = new StandardMaterial(`${parent.name}_rune_mat_${i}`, this.scene);
          runeMaterial.diffuseColor = new Color3(0.2, 0.3, 0.8); // Blue glow
          runeMaterial.emissiveColor = new Color3(0.1, 0.15, 0.4); // Emissive glow
          rune.material = runeMaterial;
        }
        break;
    }
  }

  createGroundStructure(buildingType: string, position: Vector3): Mesh {
    if (!this.scene) {
      throw new Error('PrimitiveFactory not initialized with scene');
    }

    let mesh: Mesh;
    let materialId: string;

    switch (buildingType) {
      case 'turret':
        // Turret: Cylindrical base with smaller cylinder on top
        const turretBase = Mesh.CreateCylinder(`${buildingType}_base`, GameScale.TURRET_SIZE * 0.6, GameScale.TURRET_SIZE, GameScale.TURRET_SIZE, 16, 1, this.scene);
        turretBase.position = position.clone();
        turretBase.position.y = GameScale.TURRET_SIZE * 0.3;
        turretBase.isPickable = true;
        
        const turretTop = Mesh.CreateCylinder(`${buildingType}_top`, GameScale.TURRET_SIZE * 0.4, GameScale.TURRET_SIZE * 0.7, GameScale.TURRET_SIZE * 0.7, 16, 1, this.scene);
        turretTop.position = position.clone();
        turretTop.position.y = GameScale.TURRET_SIZE * 0.8;
        turretTop.parent = turretBase;
        turretTop.isPickable = false; // Only base is pickable
        
        materialId = 'stone';
        const turretMaterial = this.materialLibrary.getBabylonMaterial(materialId, this.scene);
        turretBase.material = turretMaterial;
        turretTop.material = turretMaterial;
        
        mesh = turretBase; // Return base as main mesh
        break;

      case 'wall':
        // Wall: Long rectangular box
        const wallLength = 2.0; // meters
        const wallHeight = GameScale.WALL_HEIGHT;
        const wallThickness = GameScale.WALL_THICKNESS;
        mesh = Mesh.CreateBox(`${buildingType}_${Date.now()}`, wallHeight, this.scene);
        mesh.scaling = new Vector3(wallLength / wallHeight, 1, wallThickness / wallHeight);
        mesh.position = position.clone();
        mesh.position.y = wallHeight / 2;
        mesh.isPickable = true;
        materialId = 'stone';
        break;

      case 'cannon':
        // Cannon: Box base with cylinder barrel
        const cannonBase = Mesh.CreateBox(`${buildingType}_base`, GameScale.TURRET_SIZE * 0.8, this.scene);
        cannonBase.position = position.clone();
        cannonBase.position.y = GameScale.TURRET_SIZE * 0.4;
        cannonBase.isPickable = true;
        
        const cannonBarrel = Mesh.CreateCylinder(`${buildingType}_barrel`, GameScale.TURRET_SIZE * 0.6, GameScale.TURRET_SIZE * 0.3, GameScale.TURRET_SIZE * 0.3, 16, 1, this.scene);
        cannonBarrel.position = position.clone();
        cannonBarrel.position.y = GameScale.TURRET_SIZE * 0.9;
        cannonBarrel.rotation.z = Math.PI / 2; // Rotate barrel to point forward
        cannonBarrel.parent = cannonBase;
        cannonBarrel.isPickable = false;
        
        materialId = 'stone';
        const cannonMaterial = this.materialLibrary.getBabylonMaterial(materialId, this.scene);
        cannonBase.material = cannonMaterial;
        cannonBarrel.material = cannonMaterial;
        
        mesh = cannonBase;
        break;

      case 'barrier':
        // Barrier: Smaller wall-like structure
        const barrierHeight = 1.5;
        const barrierLength = 1.5;
        const barrierThickness = 0.3;
        mesh = Mesh.CreateBox(`${buildingType}_${Date.now()}`, barrierHeight, this.scene);
        mesh.scaling = new Vector3(barrierLength / barrierHeight, 1, barrierThickness / barrierHeight);
        mesh.position = position.clone();
        mesh.position.y = barrierHeight / 2;
        mesh.isPickable = true;
        materialId = 'wood';
        break;

      case 'storage':
        // Storage: Box structure
        const storageSize = 2.0;
        mesh = Mesh.CreateBox(`${buildingType}_${Date.now()}`, storageSize, this.scene);
        mesh.position = position.clone();
        mesh.position.y = storageSize / 2;
        mesh.isPickable = true;
        materialId = 'wood';
        break;

      case 'workshop':
        // Workshop: Box with peaked roof
        const workshopSize = 2.5;
        const workshopBase = Mesh.CreateBox(`${buildingType}_base`, workshopSize * 0.8, this.scene);
        workshopBase.position = position.clone();
        workshopBase.position.y = workshopSize * 0.4;
        workshopBase.isPickable = true;
        
        const workshopRoof = Mesh.CreateBox(`${buildingType}_roof`, workshopSize * 0.3, this.scene);
        workshopRoof.scaling = new Vector3(1, 1, 1);
        workshopRoof.position = position.clone();
        workshopRoof.position.y = workshopSize * 0.9;
        workshopRoof.rotation.x = Math.PI / 6; // Slight tilt for roof effect
        workshopRoof.parent = workshopBase;
        workshopRoof.isPickable = false;
        
        materialId = 'wood';
        const workshopMaterial = this.materialLibrary.getBabylonMaterial(materialId, this.scene);
        workshopBase.material = workshopMaterial;
        // Create darker material for roof
        const workshopRoofMaterial = new StandardMaterial(`${buildingType}_roof_material`, this.scene);
        workshopRoofMaterial.diffuseColor = new Color3(0.4, 0.3, 0.2);
        workshopRoof.material = workshopRoofMaterial;
        
        mesh = workshopBase;
        break;

      case 'barracks':
        // Barracks: Larger box structure
        const barracksSize = 3.0;
        mesh = Mesh.CreateBox(`${buildingType}_${Date.now()}`, barracksSize, this.scene);
        mesh.position = position.clone();
        mesh.position.y = barracksSize / 2;
        mesh.isPickable = true;
        materialId = 'wood';
        break;

      case 'library':
        // Library: Box with decorative elements
        const librarySize = 2.5;
        mesh = Mesh.CreateBox(`${buildingType}_${Date.now()}`, librarySize, this.scene);
        mesh.position = position.clone();
        mesh.position.y = librarySize / 2;
        mesh.isPickable = true;
        materialId = 'wood';
        break;

      case 'spell_tower':
        // Spell Tower: Tall cylinder
        const spellTowerHeight = 4.0;
        const spellTowerRadius = 1.0;
        mesh = Mesh.CreateCylinder(`${buildingType}_${Date.now()}`, spellTowerHeight, spellTowerRadius, spellTowerRadius, 16, 1, this.scene);
        mesh.position = position.clone();
        mesh.position.y = spellTowerHeight / 2;
        mesh.isPickable = true;
        materialId = 'crystal'; // Magical material
        break;

      default:
        // Default: Simple box
        mesh = Mesh.CreateBox(`${buildingType}_${Date.now()}`, 1.5, this.scene);
        mesh.position = position.clone();
        mesh.position.y = 0.75;
        mesh.isPickable = true;
        materialId = 'wood';
    }

    // Apply material if not already set
    if (!mesh.material) {
      const material = this.materialLibrary.getBabylonMaterial(materialId, this.scene);
      mesh.material = material;
    }

    // Register in catalog
    this.catalog.registerAsset(
      `${buildingType}_ground`,
      `${buildingType.charAt(0).toUpperCase() + buildingType.slice(1)} Ground Structure`,
      AssetCategory.BUILDINGS,
      AssetType.MODEL_3D,
      `${buildingType} ground structure`,
      { usageContext: 'Building placement' }
    );

    return mesh;
  }

  /**
   * Simple hash function to convert string to number (0-1 range)
   * Used to seed random colors based on object name
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Convert to 0-1 range
    return Math.abs(hash) / 2147483647;
  }
}
