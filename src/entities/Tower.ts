/**
 * Tower Entity - Tower with modular building
 */

import { Mesh, Vector3 } from '@babylonjs/core';
import { BuildingComponent, BuildingType, RoomType } from '../components/BuildingComponent';
import { PrimitiveFactory } from '../assets/PrimitiveFactory';
import { AssetCatalog, AssetCategory, AssetType } from '../assets/AssetCatalog';
import { GameScale } from '../utils/GameScale';
import { createCategoryLogger } from '../utils/Logger';
import { House } from './House';
import { SelectableObject } from '../systems/SelectableObject';
import { ObjectInfo } from '../ui/InfoPanel';

export interface Floor {
  level: number;
  roomType: RoomType;
  buildingType: BuildingType;
  mesh: Mesh;
  component: BuildingComponent;
}

export class Tower implements SelectableObject {
  private baseMesh: Mesh;
  private house: House | null = null;
  private floors: Floor[] = [];
  private position: Vector3;
  private primitiveFactory: PrimitiveFactory;
  private catalog: AssetCatalog;
  private owner: 'player' | 'ai';
  private tierUpgrades: Map<number, number> = new Map(); // tier -> upgrade level (0 = base radius)
  private logger = createCategoryLogger('Tower');
  private baseComponent: BuildingComponent | null = null;

  constructor(position: Vector3, owner: 'player' | 'ai' = 'player', baseComponent: BuildingComponent) {
    this.position = position.clone();
    this.owner = owner;
    this.primitiveFactory = PrimitiveFactory.getInstance();
    this.catalog = AssetCatalog.getInstance();
    this.baseComponent = baseComponent;

    // Create tower base (just the cylinder, no house)
    const baseRadius = this.getRadiusForTier(1);
    this.baseMesh = this.primitiveFactory.createTowerBase(`${owner}_tower_base`, position, baseRadius);
    this.baseMesh.metadata = { ...this.baseMesh.metadata, tower: this, building: true, buildingType: BuildingType.TOWER_BASE, selectable: this };
    
    // Create house separately
    const houseComponent = new BuildingComponent(
      BuildingType.TOWER_BASE,
      baseComponent.roomType,
      baseComponent.level,
      {
        health: baseComponent.stats.health,
        maxHealth: baseComponent.stats.maxHealth,
        defense: baseComponent.stats.defense,
        cost: baseComponent.stats.cost
      }
    );
    this.house = new House(position, owner, houseComponent);
    this.house.getMesh().metadata = { ...this.house.getMesh().metadata, house: this.house, building: true, buildingType: BuildingType.TOWER_BASE, selectable: this.house };
    
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
   * Get tier number for a given floor level
   * Tier 1 = base, Tier 2+ = floors
   */
  getTierForFloor(floorLevel: number): number {
    if (floorLevel === 0) return 1; // Base
    return Math.floor((floorLevel - 1) / GameScale.TOWER_FLOORS_PER_TIER) + 2;
  }

  /**
   * Get upgrade level for a tier (0 = base radius, 1 = +0.5m, 2 = +1.0m, etc.)
   */
  getTierUpgradeLevel(tier: number): number {
    return this.tierUpgrades.get(tier) || 0;
  }

  /**
   * Get radius for a given tier at its current upgrade level
   */
  getRadiusForTier(tier: number): number {
    const upgradeLevel = this.getTierUpgradeLevel(tier);
    return GameScale.TOWER_STARTING_RADIUS + (upgradeLevel * GameScale.TOWER_STEP_SIZE);
  }

  /**
   * Get radius for a specific floor level
   */
  getRadiusForFloor(floorLevel: number): number {
    const tier = this.getTierForFloor(floorLevel);
    return this.getRadiusForTier(tier);
  }

  /**
   * Upgrade all tiers up to (but not including) the given tier
   * Called when starting a new tier
   */
  private upgradeLowerTiers(upToTier: number): void {
    for (let tier = 1; tier < upToTier; tier++) {
      const currentUpgrade = this.getTierUpgradeLevel(tier);
      this.tierUpgrades.set(tier, currentUpgrade + 1);
      this.logger.debug('Tier upgraded', { tier, upgradeLevel: currentUpgrade + 1, newRadius: this.getRadiusForTier(tier) });
    }
  }

  /**
   * Rebuild a floor with a new radius (for upgrades)
   */
  private rebuildFloor(floor: Floor, newRadius: number): void {
    const floorHeight = GameScale.TOWER_FLOOR_HEIGHT;
    const towerBaseHeight = 7.0;
    const floorY = towerBaseHeight + (floor.level - 1) * floorHeight;
    const floorPosition = this.position.add(new Vector3(0, floorY, 0));

    // Dispose old mesh
    floor.mesh.dispose();

    // Create new floor mesh with new radius
    const floorMesh = this.primitiveFactory.createTowerFloor(
      `${this.owner}_tower_floor_${floor.level}`,
      floorPosition,
      newRadius,
      floor.roomType,
      floor.buildingType
    );

    // Update floor mesh
    floor.mesh = floorMesh;
    floorMesh.metadata = { ...floorMesh.metadata, tower: this, building: true, buildingType: floor.buildingType };
  }

  /**
   * Rebuild base with a new radius (for upgrades)
   */
  private rebuildBase(newRadius: number): void {
    // Note: Base rebuilding is complex (has house, roof, etc.)
    // For now, we'll just log it - full base rebuild can be added later
    this.logger.debug('Base upgrade requested', { newRadius });
    // TODO: Implement base rebuilding when needed
  }

  /**
   * Rebuild all floors in a tier with a new radius
   */
  private rebuildTier(tier: number, newRadius: number): void {
    if (tier === 1) {
      // Rebuild base
      this.rebuildBase(newRadius);
    } else {
      // Rebuild floors in this tier
      const startFloor = (tier - 2) * GameScale.TOWER_FLOORS_PER_TIER + 1;
      const endFloor = startFloor + GameScale.TOWER_FLOORS_PER_TIER - 1;
      
      for (const floor of this.floors) {
        if (floor.level >= startFloor && floor.level <= endFloor) {
          this.rebuildFloor(floor, newRadius);
        }
      }
    }
  }

  /**
   * Add a floor to the tower
   */
  addFloor(roomType: RoomType, buildingType: BuildingType, component: BuildingComponent): Floor {
    const floorLevel = this.floors.length + 1;
    const floorHeight = GameScale.TOWER_FLOOR_HEIGHT;
    
    // Calculate floor position:
    // Tower base has 2 stories (6m) + roof (1m) = 7m total height
    // First floor starts at 7m (on top of roof)
    // Each subsequent floor is 3m higher
    const towerBaseHeight = 7.0; // 2 stories (6m) + roof (1m)
    const floorY = towerBaseHeight + (floorLevel - 1) * floorHeight;
    const floorPosition = this.position.add(new Vector3(0, floorY, 0));

    // Determine tier for this floor
    const newTier = this.getTierForFloor(floorLevel);
    
    // Check if we're starting a new tier (first floor of a tier)
    const isNewTier = (floorLevel - 1) % GameScale.TOWER_FLOORS_PER_TIER === 0;
    
    if (isNewTier && newTier > 2) {
      // Starting a new tier - upgrade all lower tiers
      this.upgradeLowerTiers(newTier);
      
      // Rebuild all lower tiers with their new radii
      for (let tier = 1; tier < newTier; tier++) {
        const newRadius = this.getRadiusForTier(tier);
        this.rebuildTier(tier, newRadius);
      }
    }

    // Get radius for this floor's tier
    const floorRadius = this.getRadiusForTier(newTier);

    // Create floor mesh using new createTowerFloor method with radius
    const floorMesh = this.primitiveFactory.createTowerFloor(
      `${this.owner}_tower_floor_${floorLevel}`,
      floorPosition,
      floorRadius,
      roomType,
      buildingType
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
    
    this.logger.info('Floor added', { 
      floorLevel, 
      tier: newTier, 
      radius: floorRadius,
      upgradeLevel: this.getTierUpgradeLevel(newTier)
    });
    
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
   * Get house
   */
  getHouse(): House | null {
    return this.house;
  }

  /**
   * Get base component
   */
  getBaseComponent(): BuildingComponent | null {
    return this.baseComponent;
  }

  /**
   * ISelectable implementation
   */
  getMesh(): Mesh {
    return this.baseMesh;
  }

  getName(): string {
    return `${this.owner === 'player' ? 'Player' : 'AI'} Tower`;
  }

  getObjectInfo(): ObjectInfo {
    const component = this.baseComponent;
    const health = component ? component.stats.health : 0;
    const maxHealth = component ? component.stats.maxHealth : 0;
    const defense = component ? component.stats.defense : 0;
    const healthPercent = maxHealth > 0 ? Math.round((health / maxHealth) * 100) : 0;

    return {
      name: this.getName(),
      type: 'Tower',
      details: {
        'Height': `${this.getHeight()} floors`,
        'Health': `${health}/${maxHealth} (${healthPercent}%)`,
        'Defense': defense.toString(),
        'Floors': this.floors.length.toString(),
        'Radius': `${this.getRadiusForTier(1).toFixed(1)}m`
      },
      actions: [
        {
          label: 'Add Floor',
          onClick: () => {
            // TODO: Show floor building menu
            this.logger.info('Add floor requested');
          }
        },
        {
          label: `Upgrade Tower (Radius: ${(this.getRadiusForTier(1) + GameScale.TOWER_STEP_SIZE).toFixed(1)}m)`,
          onClick: () => {
            // TODO: Implement tower upgrade
            this.logger.info('Tower upgrade requested');
          }
        }
      ]
    };
  }

  isSelectable(): boolean {
    return true;
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
    // Check base - if base is destroyed, tower is destroyed
    const baseComponent = this.baseMesh.metadata?.component as BuildingComponent | undefined;
    if (baseComponent && baseComponent.isDestroyed()) {
      return true;
    }

    // If no floors, tower is healthy (base is healthy and no floors to check)
    if (this.floors.length === 0) {
      return false;
    }

    // If there are floors, tower is destroyed only if ALL floors are destroyed
    // (Base must be healthy at this point, otherwise we would have returned above)
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
