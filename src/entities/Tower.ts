/**
 * Tower Entity - Tower with modular building
 */

import { Mesh, Vector3 } from '@babylonjs/core';
import { BuildingComponent, BuildingType, RoomType } from '../components/BuildingComponent';
import { PrimitiveFactory } from '../assets/PrimitiveFactory';
import { AssetCatalog, AssetCategory, AssetType } from '../assets/AssetCatalog';

export interface Floor {
  level: number;
  roomType: RoomType;
  buildingType: BuildingType;
  mesh: Mesh;
  component: BuildingComponent;
}

export class Tower {
  private baseMesh: Mesh;
  private floors: Floor[] = [];
  private position: Vector3;
  private primitiveFactory: PrimitiveFactory;
  private catalog: AssetCatalog;
  private owner: 'player' | 'ai';

  constructor(position: Vector3, owner: 'player' | 'ai' = 'player') {
    this.position = position.clone();
    this.owner = owner;
    this.primitiveFactory = PrimitiveFactory.getInstance();
    this.catalog = AssetCatalog.getInstance();

    // Create base (cottage)
    this.baseMesh = this.primitiveFactory.createTowerBase(`${owner}_tower_base`, position);
    this.baseMesh.metadata = { ...this.baseMesh.metadata, tower: this };
    this.registerTowerAssets();
  }

  private registerTowerAssets(): void {
    this.catalog.registerAsset(
      'tower_base',
      'Tower Base (Cottage)',
      AssetCategory.BUILDINGS,
      AssetType.MODEL_3D,
      'Starting tower base - wizard cottage',
      { usageContext: 'Player starting building' }
    );

    this.catalog.registerAsset(
      'tower_floor',
      'Tower Floor',
      AssetCategory.BUILDINGS,
      AssetType.MODEL_3D,
      'Modular tower floor piece',
      { usageContext: 'Vertical tower expansion' }
    );
  }

  /**
   * Add a floor to the tower
   */
  addFloor(roomType: RoomType, buildingType: BuildingType, component: BuildingComponent): Floor {
    const floorLevel = this.floors.length + 1;
    const floorHeight = 3; // Height per floor
    const floorPosition = this.position.add(new Vector3(0, floorLevel * floorHeight, 0));

    // Create floor mesh
    const floorMesh = this.primitiveFactory.createBox(
      `${this.owner}_tower_floor_${floorLevel}`,
      {
        size: 3,
        position: floorPosition,
        materialId: this.getMaterialForBuildingType(buildingType)
      }
    );

    // Add tower metadata to floor mesh
    floorMesh.metadata = { ...floorMesh.metadata, tower: this, building: true, buildingType };

    const floor: Floor = {
      level: floorLevel,
      roomType,
      buildingType,
      mesh: floorMesh,
      component
    };

    this.floors.push(floor);
    return floor;
  }

  /**
   * Get material ID for building type
   */
  private getMaterialForBuildingType(type: BuildingType): string {
    const materialMap: Record<BuildingType, string> = {
      [BuildingType.TOWER_BASE]: 'wood',
      [BuildingType.TOWER_FLOOR]: 'wood',
      [BuildingType.TURRET]: 'stone_wall',
      [BuildingType.CANNON]: 'stone_wall',
      [BuildingType.WALL]: 'stone_wall',
      [BuildingType.BARRIER]: 'stone',
      [BuildingType.STORAGE]: 'wood',
      [BuildingType.WORKSHOP]: 'wood',
      [BuildingType.BARRACKS]: 'wood',
      [BuildingType.LIBRARY]: 'wood',
      [BuildingType.SPELL_TOWER]: 'stone_wall'
    };

    return materialMap[type] || 'wood';
  }

  /**
   * Get tower height (number of floors)
   */
  getHeight(): number {
    return this.floors.length + 1; // +1 for base
  }

  /**
   * Get all floors
   */
  getFloors(): Floor[] {
    return [...this.floors];
  }

  /**
   * Get base mesh
   */
  getBaseMesh(): Mesh {
    return this.baseMesh;
  }

  /**
   * Get tower position
   */
  getPosition(): Vector3 {
    return this.position;
  }

  /**
   * Get owner
   */
  getOwner(): 'player' | 'ai' {
    return this.owner;
  }

  /**
   * Check if tower is destroyed
   */
  isDestroyed(): boolean {
    // Check base
    const baseComponent = this.baseMesh.metadata?.component as BuildingComponent | undefined;
    if (baseComponent && baseComponent.isDestroyed()) {
      return true;
    }

    // Check if all floors destroyed
    return this.floors.every(floor => floor.component.isDestroyed());
  }

  /**
   * Get total health
   */
  getTotalHealth(): number {
    let health = 0;
    const baseComponent = this.baseMesh.metadata?.component as BuildingComponent | undefined;
    if (baseComponent) {
      health += baseComponent.stats.health;
    }
    this.floors.forEach(floor => {
      health += floor.component.stats.health;
    });
    return health;
  }

  dispose(): void {
    this.floors.forEach(floor => floor.mesh.dispose());
    this.baseMesh.dispose();
  }
}
