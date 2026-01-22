/**
 * Resource System - Resource spawning, collection, management
 */

import { Scene, Vector3 } from '@babylonjs/core';
import { Resource } from '../entities/Resource';
import { ResourceComponent, ResourceType } from '../components/ResourceComponent';
import { AssetCatalog, AssetCategory, AssetType } from '../assets/AssetCatalog';
import { createCategoryLogger } from '../utils/Logger';
import { GameScale } from '../utils/GameScale';
import { TerrainManager } from '../utils/TerrainManager';

export interface ResourceSpawnConfig {
  type: ResourceType;
  minAmount: number;
  maxAmount: number;
  spawnChance: number; // 0-1
}

export class ResourceSystem {
  private scene: Scene;
  private resources: Resource[] = [];
  private catalog: AssetCatalog;
  private logger = createCategoryLogger('ResourceSystem');
  private terrainManager: TerrainManager | null = null;
  
  // Valley bounds for spawning (use full map, avoid tower areas)
  private valleyBounds = {
    minX: -GameScale.MAP_WIDTH / 2 + 300, // Keep resources away from map edges
    maxX: GameScale.MAP_WIDTH / 2 - 300,
    minZ: -GameScale.MAP_DEPTH / 2 + 300,
    maxZ: GameScale.MAP_DEPTH / 2 - 300,
    y: GameScale.VALLEY_FLOOR_HEIGHT // Resources spawn at valley floor level
  };
  
  // Sea level - resources below this are in water
  // Adjusted for raised terrain (base elevation +10m, so sea level is effectively -10m)
  private readonly SEA_LEVEL = -10.0; // meters (adjusted for raised terrain)
  private readonly LAND_THRESHOLD = -9.5; // meters (minimum elevation for land placement, 0.5m above sea level)

  // Resource spawn configuration
  private spawnConfigs: ResourceSpawnConfig[] = [
    { type: ResourceType.WOOD, minAmount: 1, maxAmount: 3, spawnChance: 0.3 },
    { type: ResourceType.STONE, minAmount: 1, maxAmount: 2, spawnChance: 0.25 },
    { type: ResourceType.GOLD, minAmount: 1, maxAmount: 1, spawnChance: 0.15 },
    { type: ResourceType.CRYSTAL, minAmount: 1, maxAmount: 2, spawnChance: 0.1 },
    { type: ResourceType.ESSENCE, minAmount: 1, maxAmount: 1, spawnChance: 0.1 },
    { type: ResourceType.MANA, minAmount: 1, maxAmount: 1, spawnChance: 0.1 }
  ];

  constructor(scene: Scene, terrainManager?: TerrainManager) {
    this.scene = scene;
    this.catalog = AssetCatalog.getInstance();
    this.terrainManager = terrainManager || null;
    this.registerResourceAssets();
  }
  
  /**
   * Set terrain manager for height sampling
   */
  setTerrainManager(terrainManager: TerrainManager): void {
    this.terrainManager = terrainManager;
  }
  
  /**
   * Check if resource type can be placed in water
   */
  private canBeInWater(type: ResourceType): boolean {
    // Most resources must be on land
    // GOLD and MANA could potentially be in water (magical/underwater deposits)
    return type === ResourceType.GOLD || type === ResourceType.MANA;
  }
  
  /**
   * Check if position is valid for resource placement
   */
  private isValidResourcePosition(position: Vector3, type: ResourceType): boolean {
    if (!this.terrainManager) {
      return true; // No terrain manager, allow placement
    }
    
    const elevation = this.terrainManager.getHeightAt(position.x, position.z);
    const isInWater = elevation <= this.SEA_LEVEL;
    const isOnLand = elevation > this.LAND_THRESHOLD;
    
    // Check if resource can be in water
    if (isInWater && !this.canBeInWater(type)) {
      return false; // Resource type cannot be in water
    }
    
    // For land-only resources, ensure they're on land
    if (!this.canBeInWater(type) && !isOnLand) {
      return false; // Not high enough above sea level
    }
    
    return true;
  }

  private registerResourceAssets(): void {
    // Register all resource types in catalog
    Object.values(ResourceType).forEach(type => {
      this.catalog.registerAsset(
        `resource_${type}`,
        `${type.charAt(0).toUpperCase() + type.slice(1)} Resource`,
        AssetCategory.RESOURCES,
        AssetType.MODEL_3D,
        `${type} resource node for collection`,
        { usageContext: 'Resource spawning and collection' }
      );
    });
  }

  /**
   * Spawn a resource at a random location
   */
  spawnResource(type?: ResourceType, position?: Vector3): Resource {
    const resourceType = type || this.getRandomResourceType();
    
    // If position provided, sample terrain height; otherwise get random position
    let spawnPosition: Vector3;
    if (position) {
      // Sample terrain height at provided position
      let y = position.y;
      if (this.terrainManager) {
        y = this.terrainManager.getHeightAt(position.x, position.z);
      }
      spawnPosition = new Vector3(position.x, y, position.z);
      
      // Validate placement
      if (!this.isValidResourcePosition(spawnPosition, resourceType)) {
        this.logger.warn('Invalid resource position, adjusting', { 
          type: resourceType, 
          originalPosition: position,
          sampledPosition: spawnPosition 
        });
        // Try to find a valid position nearby
        spawnPosition = this.getRandomSpawnPosition(resourceType);
      }
    } else {
      spawnPosition = this.getRandomSpawnPosition(resourceType);
    }
    
    const amount = this.getRandomAmount(resourceType);

    const resource = new Resource(resourceType, spawnPosition, amount);
    this.resources.push(resource);

    this.logger.debug('Resource spawned', { 
      type: resourceType, 
      amount, 
      position: spawnPosition,
      elevation: spawnPosition.y,
      inWater: spawnPosition.y <= this.SEA_LEVEL
    });
    return resource;
  }

  /**
   * Spawn multiple resources randomly
   */
  spawnRandomResources(count: number): void {
    let spawned = 0;
    for (let i = 0; i < count; i++) {
      // Check spawn chance for each resource type
      this.spawnConfigs.forEach(config => {
        if (Math.random() < config.spawnChance) {
          this.spawnResource(config.type);
          spawned++;
        }
      });
    }
    this.logger.info('Random resources spawned', { requested: count, spawned });
  }

  /**
   * Get random resource type based on spawn chances
   */
  private getRandomResourceType(): ResourceType {
    const rand = Math.random();
    let cumulative = 0;

    for (const config of this.spawnConfigs) {
      cumulative += config.spawnChance;
      if (rand < cumulative) {
        return config.type;
      }
    }

    // Fallback to wood
    return ResourceType.WOOD;
  }

  /**
   * Get random spawn position in valley, sampled on terrain
   */
  private getRandomSpawnPosition(type?: ResourceType): Vector3 {
    // Avoid spawning on hills (where towers are)
    const avoidZones = [
      { center: new Vector3(-GameScale.TOWER_DISTANCE / 2, 0, 0), radius: 300 },
      { center: new Vector3(GameScale.TOWER_DISTANCE / 2, 0, 0), radius: 300 }
    ];

    let position: Vector3;
    let attempts = 0;
    const maxAttempts = 100; // Increased attempts for terrain validation

    do {
      const x = this.valleyBounds.minX + Math.random() * (this.valleyBounds.maxX - this.valleyBounds.minX);
      const z = this.valleyBounds.minZ + Math.random() * (this.valleyBounds.maxZ - this.valleyBounds.minZ);
      
      // Sample terrain height at this position
      let y = this.valleyBounds.y;
      if (this.terrainManager) {
        y = this.terrainManager.getHeightAt(x, z);
      }
      
      position = new Vector3(x, y, z);
      attempts++;
    } while (
      attempts < maxAttempts &&
      (
        avoidZones.some(zone => Vector3.Distance(position, zone.center) < zone.radius) ||
        (type && !this.isValidResourcePosition(position, type))
      )
    );

    return position;
  }

  /**
   * Get random amount for resource type
   */
  private getRandomAmount(type: ResourceType): number {
    const config = this.spawnConfigs.find(c => c.type === type);
    if (!config) {
      return 1;
    }
    return config.minAmount + Math.floor(Math.random() * (config.maxAmount - config.minAmount + 1));
  }

  /**
   * Get all resources
   */
  getAllResources(): Resource[] {
    return this.resources.filter(r => !r.isCollected());
  }

  /**
   * Get resources by type
   */
  getResourcesByType(type: ResourceType): Resource[] {
    return this.resources.filter(r => r.getType() === type && !r.isCollected());
  }

  /**
   * Find nearest resource to position
   */
  findNearestResource(position: Vector3, type?: ResourceType): Resource | null {
    const available = type 
      ? this.getResourcesByType(type)
      : this.getAllResources();

    if (available.length === 0) {
      return null;
    }

    let nearest: Resource | null = null;
    let nearestDistance = Infinity;

    available.forEach(resource => {
      const distance = Vector3.Distance(position, resource.getPosition());
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = resource;
      }
    });

    return nearest;
  }

  /**
   * Remove collected resources
   */
  cleanup(): void {
    const collected = this.resources.filter(r => r.isCollected());
    collected.forEach(r => r.dispose());
    this.resources = this.resources.filter(r => !r.isCollected());
  }

  /**
   * Clear all resources
   */
  clear(): void {
    this.resources.forEach(r => r.dispose());
    this.resources = [];
  }
}
