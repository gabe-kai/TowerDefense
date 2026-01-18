/**
 * Resource System - Resource spawning, collection, management
 */

import { Scene, Vector3 } from '@babylonjs/core';
import { Resource } from '../entities/Resource';
import { ResourceComponent, ResourceType } from '../components/ResourceComponent';
import { AssetCatalog, AssetCategory, AssetType } from '../assets/AssetCatalog';

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
  
  // Valley bounds for spawning
  private valleyBounds = {
    minX: -20,
    maxX: 20,
    minZ: -20,
    maxZ: 20,
    y: 0.5
  };

  // Resource spawn configuration
  private spawnConfigs: ResourceSpawnConfig[] = [
    { type: ResourceType.WOOD, minAmount: 1, maxAmount: 3, spawnChance: 0.3 },
    { type: ResourceType.STONE, minAmount: 1, maxAmount: 2, spawnChance: 0.25 },
    { type: ResourceType.GOLD, minAmount: 1, maxAmount: 1, spawnChance: 0.15 },
    { type: ResourceType.CRYSTAL, minAmount: 1, maxAmount: 2, spawnChance: 0.1 },
    { type: ResourceType.ESSENCE, minAmount: 1, maxAmount: 1, spawnChance: 0.1 },
    { type: ResourceType.MANA, minAmount: 1, maxAmount: 1, spawnChance: 0.1 }
  ];

  constructor(scene: Scene) {
    this.scene = scene;
    this.catalog = AssetCatalog.getInstance();
    this.registerResourceAssets();
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
    const spawnPosition = position || this.getRandomSpawnPosition();
    const amount = this.getRandomAmount(resourceType);

    const resource = new Resource(resourceType, spawnPosition, amount);
    this.resources.push(resource);

    return resource;
  }

  /**
   * Spawn multiple resources randomly
   */
  spawnRandomResources(count: number): void {
    for (let i = 0; i < count; i++) {
      // Check spawn chance for each resource type
      this.spawnConfigs.forEach(config => {
        if (Math.random() < config.spawnChance) {
          this.spawnResource(config.type);
        }
      });
    }
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
   * Get random spawn position in valley
   */
  private getRandomSpawnPosition(): Vector3 {
    // Avoid spawning on hills (where towers are)
    const avoidZones = [
      { center: new Vector3(-20, 0, 0), radius: 5 },
      { center: new Vector3(20, 0, 0), radius: 5 }
    ];

    let position: Vector3;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      position = new Vector3(
        this.valleyBounds.minX + Math.random() * (this.valleyBounds.maxX - this.valleyBounds.minX),
        this.valleyBounds.y,
        this.valleyBounds.minZ + Math.random() * (this.valleyBounds.maxZ - this.valleyBounds.minZ)
      );
      attempts++;
    } while (
      attempts < maxAttempts &&
      avoidZones.some(zone => Vector3.Distance(position, zone.center) < zone.radius)
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
