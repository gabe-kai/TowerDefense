/**
 * Servant System - Servant AI, command queue, recruitment
 */

import { Scene, Vector3 } from '@babylonjs/core';
import { Servant } from '../entities/Servant';
import { Resource } from '../entities/Resource';
import { GameStateManager } from '../core/GameState';
import { AssetCatalog, AssetCategory, AssetType } from '../assets/AssetCatalog';
import { ResourceType } from '../components/ResourceComponent';
import { createCategoryLogger } from '../utils/Logger';

export class ServantSystem {
  private scene: Scene;
  private servants: Servant[] = [];
  private stateManager: GameStateManager;
  private catalog: AssetCatalog;
  private lastUpdateTime: number = 0;
  private logger = createCategoryLogger('ServantSystem');

  constructor(scene: Scene) {
    this.scene = scene;
    this.stateManager = GameStateManager.getInstance();
    this.catalog = AssetCatalog.getInstance();
    this.registerServantAssets();
  }

  private registerServantAssets(): void {
    this.catalog.registerAsset(
      'servant',
      'Servant',
      AssetCategory.CHARACTERS,
      AssetType.MODEL_3D,
      'Player-controlled servant for resource collection',
      { variants: ['servant_1', 'servant_2'], usageContext: 'Resource collection' }
    );
  }

  /**
   * Create a new servant at position
   */
  createServant(position: Vector3, player: 'player' | 'ai' = 'player'): Servant {
    const servant = new Servant(`${player}_servant_${this.servants.length}`, position);
    this.servants.push(servant);
    
    if (player === 'player') {
      this.stateManager.addServant('player');
    } else {
      this.stateManager.addServant('ai');
    }

    this.logger.info('Servant created', { player, position, totalServants: this.servants.length });
    return servant;
  }

  /**
   * Recruit a new servant (costs resources)
   */
  recruitServant(position: Vector3, player: 'player' | 'ai' = 'player'): boolean {
    // Check if player has enough resources (simple cost: 10 wood, 5 stone)
    const resources = this.stateManager.getResources(player);
    
    if (player === 'player' && resources.wood >= 10 && resources.stone >= 5) {
      // Deduct resources
      this.stateManager.addResource(player, 'wood', -10);
      this.stateManager.addResource(player, 'stone', -5);
      
      this.createServant(position, player);
      this.logger.info('Servant recruited', { player, cost: { wood: 10, stone: 5 } });
      return true;
    } else if (player === 'ai') {
      // AI can recruit (simplified for MVP)
      this.createServant(position, player);
      this.logger.debug('AI servant recruited', { position });
      return true;
    }

    this.logger.warn('Servant recruitment failed', { player, resources });
    return false;
  }

  /**
   * Command a servant to collect a resource
   */
  commandCollect(servant: Servant, resource: Resource): void {
    servant.queueCollectCommand(resource);
  }

  /**
   * Command nearest available servant to collect resource
   */
  commandNearestServantToCollect(position: Vector3, resource: Resource, player: 'player' | 'ai' = 'player'): boolean {
    const availableServants = this.getAvailableServants(player);
    if (availableServants.length === 0) {
      return false;
    }

    // Find nearest servant
    let nearest: Servant | null = null;
    let nearestDistance = Infinity;

    availableServants.forEach(servant => {
      const distance = Vector3.Distance(position, servant.getPosition());
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = servant;
      }
    });

    if (nearest) {
      this.commandCollect(nearest, resource);
      return true;
    }

    return false;
  }

  /**
   * Get all servants for a player
   */
  getServants(player: 'player' | 'ai'): Servant[] {
    return this.servants.filter(s => s.getMesh().name.startsWith(player));
  }

  /**
   * Get available servants (idle, no commands)
   */
  getAvailableServants(player: 'player' | 'ai'): Servant[] {
    return this.getServants(player).filter(s => s.isAvailable());
  }

  /**
   * Update all servants (call each frame)
   */
  update(): void {
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Convert to seconds
    this.lastUpdateTime = currentTime;

    if (deltaTime > 0.1) {
      // Limit delta time to prevent large jumps
      this.servants.forEach(servant => {
        servant.update(Math.min(deltaTime, 0.1));
        
        // Check if servant delivered resource
        const resource = servant.deliverResource();
        if (resource) {
          // Add resource to player inventory
          const resourceType = resource.getType() as ResourceType;
          const amount = resource.getAmount();
          const player = servant.getMesh().name.startsWith('player') ? 'player' : 'ai';
          this.stateManager.addResource(player, resourceType, amount);
          this.logger.debug('Resource delivered', { player, type: resourceType, amount });
        }
      });
    }
  }

  /**
   * Get all servants
   */
  getAllServants(): Servant[] {
    return this.servants;
  }

  /**
   * Clear all servants
   */
  clear(): void {
    this.servants.forEach(s => s.dispose());
    this.servants = [];
  }
}
