/**
 * Building System - Building placement, upgrades, modular floors
 */

import { Scene, Vector3 } from '@babylonjs/core';
import { Tower } from '../entities/Tower';
import { BuildingComponent, BuildingType, RoomType } from '../components/BuildingComponent';
import { BuildingValidator } from '../utils/BuildingValidator';
import { GameStateManager } from '../core/GameState';
import { AssetCatalog, AssetCategory, AssetType } from '../assets/AssetCatalog';
import { PowerCalculator } from '../utils/PowerCalculator';
import { createCategoryLogger } from '../utils/Logger';

export interface BuildingDefinition {
  type: BuildingType;
  roomType: RoomType;
  cost: {
    wood?: number;
    stone?: number;
    gold?: number;
    crystal?: number;
    essence?: number;
    mana?: number;
  };
  stats: {
    health: number;
    defense: number;
    attack?: number;
    range?: number;
  };
}

export class BuildingSystem {
  private scene: Scene;
  private playerTower: Tower | null = null;
  private aiTower: Tower | null = null;
  private groundStructures: Map<string, { mesh: any; component: BuildingComponent }> = new Map();
  private stateManager: GameStateManager;
  private catalog: AssetCatalog;
  private powerCalculator: PowerCalculator;
  private logger = createCategoryLogger('BuildingSystem');

  // Building definitions
  private buildingDefinitions: Map<BuildingType, BuildingDefinition> = new Map();

  constructor(scene: Scene) {
    this.scene = scene;
    this.stateManager = GameStateManager.getInstance();
    this.catalog = AssetCatalog.getInstance();
    this.powerCalculator = PowerCalculator.getInstance();
    
    this.initializeBuildingDefinitions();
    this.registerBuildingAssets();
  }

  private initializeBuildingDefinitions(): void {
    // Tower base
    this.buildingDefinitions.set(BuildingType.TOWER_BASE, {
      type: BuildingType.TOWER_BASE,
      roomType: RoomType.SPECIALIZED,
      cost: { wood: 0, stone: 0 }, // Free starting building
      stats: { health: 100, defense: 10 }
    });

    // Tower floor
    this.buildingDefinitions.set(BuildingType.TOWER_FLOOR, {
      type: BuildingType.TOWER_FLOOR,
      roomType: RoomType.SPECIALIZED,
      cost: { wood: 20, stone: 10 },
      stats: { health: 50, defense: 5 }
    });

    // Defense structures
    this.buildingDefinitions.set(BuildingType.TURRET, {
      type: BuildingType.TURRET,
      roomType: RoomType.DEFENSE,
      cost: { wood: 15, stone: 20 },
      stats: { health: 80, defense: 15, attack: 20, range: 10 }
    });

    this.buildingDefinitions.set(BuildingType.CANNON, {
      type: BuildingType.CANNON,
      roomType: RoomType.OFFENSE,
      cost: { wood: 10, stone: 25, gold: 5 },
      stats: { health: 60, defense: 10, attack: 40, range: 15 }
    });

    this.buildingDefinitions.set(BuildingType.WALL, {
      type: BuildingType.WALL,
      roomType: RoomType.DEFENSE,
      cost: { stone: 15 },
      stats: { health: 100, defense: 20 }
    });

    this.buildingDefinitions.set(BuildingType.BARRIER, {
      type: BuildingType.BARRIER,
      roomType: RoomType.DEFENSE,
      cost: { wood: 10, stone: 5 },
      stats: { health: 50, defense: 10 }
    });

    // Resource buildings
    this.buildingDefinitions.set(BuildingType.STORAGE, {
      type: BuildingType.STORAGE,
      roomType: RoomType.RESOURCE,
      cost: { wood: 20, stone: 10 },
      stats: { health: 60, defense: 5 }
    });

    this.buildingDefinitions.set(BuildingType.WORKSHOP, {
      type: BuildingType.WORKSHOP,
      roomType: RoomType.RESOURCE,
      cost: { wood: 25, stone: 15 },
      stats: { health: 70, defense: 5 }
    });

    // Housing
    this.buildingDefinitions.set(BuildingType.BARRACKS, {
      type: BuildingType.BARRACKS,
      roomType: RoomType.HOUSING,
      cost: { wood: 30, stone: 20 },
      stats: { health: 80, defense: 8 }
    });

    // Specialized
    this.buildingDefinitions.set(BuildingType.LIBRARY, {
      type: BuildingType.LIBRARY,
      roomType: RoomType.SPECIALIZED,
      cost: { wood: 40, stone: 30, crystal: 10 },
      stats: { health: 90, defense: 10 }
    });

    this.buildingDefinitions.set(BuildingType.SPELL_TOWER, {
      type: BuildingType.SPELL_TOWER,
      roomType: RoomType.OFFENSE,
      cost: { stone: 30, crystal: 20, essence: 10 },
      stats: { health: 70, defense: 12, attack: 35, range: 12 }
    });
  }

  private registerBuildingAssets(): void {
    // Register all building types
    Object.values(BuildingType).forEach(type => {
      this.catalog.registerAsset(
        `building_${type}`,
        `${type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        AssetCategory.BUILDINGS,
        AssetType.MODEL_3D,
        `${type} building structure`,
        { usageContext: 'Tower building and defense' }
      );
    });
  }

  /**
   * Create player tower
   */
  createPlayerTower(position: Vector3): Tower {
    const tower = new Tower(position, 'player');
    this.playerTower = tower;
    
    // Initialize base component
    const baseDef = this.buildingDefinitions.get(BuildingType.TOWER_BASE)!;
    const baseComponent = new BuildingComponent(
      BuildingType.TOWER_BASE,
      baseDef.roomType,
      1,
      {
        health: baseDef.stats.health,
        maxHealth: baseDef.stats.health,
        defense: baseDef.stats.defense,
        cost: baseDef.cost
      }
    );
    tower.getBaseMesh().metadata = { component: baseComponent };

    this.stateManager.setTowerHeight('player', tower.getHeight());
    this.logger.info('Player tower created', { position, height: tower.getHeight() });
    return tower;
  }

  /**
   * Create AI tower
   */
  createAITower(position: Vector3): Tower {
    const tower = new Tower(position, 'ai');
    this.aiTower = tower;
    
    // Initialize base component
    const baseDef = this.buildingDefinitions.get(BuildingType.TOWER_BASE)!;
    const baseComponent = new BuildingComponent(
      BuildingType.TOWER_BASE,
      baseDef.roomType,
      1,
      {
        health: baseDef.stats.health,
        maxHealth: baseDef.stats.health,
        defense: baseDef.stats.defense,
        cost: baseDef.cost
      }
    );
    tower.getBaseMesh().metadata = { component: baseComponent };

    this.stateManager.setTowerHeight('ai', tower.getHeight());
    return tower;
  }

  /**
   * Build a floor on tower
   */
  buildFloor(tower: Tower, roomType: RoomType, buildingType: BuildingType, player: 'player' | 'ai'): boolean {
    const def = this.buildingDefinitions.get(buildingType);
    if (!def) {
      this.logger.warn('Building definition not found', { buildingType });
      return false;
    }

    // Check resources
    const resources = this.stateManager.getResources(player);
    for (const [resource, amount] of Object.entries(def.cost)) {
      if (amount && (resources[resource as keyof typeof resources] < amount)) {
        this.logger.warn('Insufficient resources for building', { 
          player, 
          buildingType, 
          required: def.cost, 
          available: resources 
        });
        return false;
      }
    }

    // Deduct resources
    for (const [resource, amount] of Object.entries(def.cost)) {
      if (amount) {
        this.stateManager.addResource(player, resource as any, -amount);
      }
    }

    // Create component
    const component = new BuildingComponent(
      buildingType,
      roomType,
      1,
      {
        health: def.stats.health,
        maxHealth: def.stats.health,
        defense: def.stats.defense,
        attack: def.stats.attack,
        range: def.stats.range,
        cost: def.cost
      }
    );

    // Add floor
    tower.addFloor(roomType, buildingType, component);
    this.stateManager.setTowerHeight(player, tower.getHeight());
    
    this.logger.info('Tower floor built', { player, buildingType, roomType, height: tower.getHeight(), cost: def.cost });
    return true;
  }

  /**
   * Build ground structure
   */
  buildGroundStructure(buildingType: BuildingType, position: Vector3, player: 'player' | 'ai'): boolean {
    const def = this.buildingDefinitions.get(buildingType);
    if (!def) {
      return false;
    }

    // Validate placement
    const existingPositions = Array.from(this.groundStructures.values()).map(s => s.mesh.position);
    const tower = player === 'player' ? this.playerTower : this.aiTower;
    const validation = BuildingValidator.validatePlacement(
      position,
      buildingType,
      existingPositions,
      tower?.getPosition()
    );

    if (!validation.valid) {
      return false;
    }

    // Check resources
    const resources = this.stateManager.getResources(player);
    for (const [resource, amount] of Object.entries(def.cost)) {
      if (amount && (resources[resource as keyof typeof resources] < amount)) {
        return false;
      }
    }

    // Deduct resources
    for (const [resource, amount] of Object.entries(def.cost)) {
      if (amount) {
        this.stateManager.addResource(player, resource as any, -amount);
      }
    }

    // Create structure (simplified for MVP - would use PrimitiveFactory)
    // For now, just register it
    const component = new BuildingComponent(
      buildingType,
      def.roomType,
      1,
      {
        health: def.stats.health,
        maxHealth: def.stats.health,
        defense: def.stats.defense,
        attack: def.stats.attack,
        range: def.stats.range,
        cost: def.cost
      }
    );

    const structureId = `${player}_${buildingType}_${Date.now()}`;
    this.groundStructures.set(structureId, {
      mesh: { position } as any, // Placeholder
      component
    });

    return true;
  }

  /**
   * Get building definition
   */
  getBuildingDefinition(type: BuildingType): BuildingDefinition | undefined {
    return this.buildingDefinitions.get(type);
  }

  /**
   * Get player tower
   */
  getPlayerTower(): Tower | null {
    return this.playerTower;
  }

  /**
   * Get AI tower
   */
  getAITower(): Tower | null {
    return this.aiTower;
  }

  /**
   * Get all ground structures
   */
  getGroundStructures(): Map<string, { mesh: any; component: BuildingComponent }> {
    return this.groundStructures;
  }
}
