/**
 * Servant System - Servant AI, command queue, recruitment
 */

import { Scene, Vector3, Mesh, StandardMaterial, Color3, Animation } from '@babylonjs/core';
import { Servant } from '../entities/Servant';
import { Resource } from '../entities/Resource';
import { GameStateManager } from '../core/GameState';
import { AssetCatalog, AssetCategory, AssetType } from '../assets/AssetCatalog';
import { ResourceType } from '../components/ResourceComponent';
import { WorkQueue } from './WorkQueue';
import { createCategoryLogger } from '../utils/Logger';
import { GameScale } from '../utils/GameScale';

export class ServantSystem {
  private scene: Scene;
  private servants: Servant[] = [];
  private stateManager: GameStateManager;
  private catalog: AssetCatalog;
  private workQueue: WorkQueue;
  private lastUpdateTime: number = 0;
  private logger = createCategoryLogger('ServantSystem');

  constructor(scene: Scene) {
    this.scene = scene;
    this.stateManager = GameStateManager.getInstance();
    this.catalog = AssetCatalog.getInstance();
    this.workQueue = WorkQueue.getInstance();
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
    const servant = new Servant(`${player}_servant_${this.servants.length}`, position, this.scene);
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
    
    // Initialize lastUpdateTime on first call
    if (this.lastUpdateTime === 0) {
      this.lastUpdateTime = currentTime;
      return; // Skip first frame to get proper deltaTime next frame
    }
    
    const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Convert to seconds
    this.lastUpdateTime = currentTime;

    // Always update, but limit delta time to prevent large jumps
    const clampedDeltaTime = Math.min(deltaTime, 0.1);
    
    this.servants.forEach(servant => {
      servant.update(clampedDeltaTime);
      
      // Check if servant delivered resource (called after update, when state is IDLE and at home)
      const resource = servant.deliverResource();
      if (resource) {
        // Add resource to player inventory
        const resourceType = resource.getType() as ResourceType;
        const amount = resource.getAmount();
        const player = servant.getMesh().name.startsWith('player') ? 'player' : 'ai';
        this.stateManager.addResource(player, resourceType, amount);
        this.logger.info('Resource delivered to tower', { player, type: resourceType, amount });
        
        // Show delivery feedback
        this.showDeliveryFeedback(servant.getPosition(), resourceType, amount);
        
        // Complete any work queue tasks for this resource
        const tasks = this.workQueue.getAllTasks();
        tasks.forEach(task => {
          if (task.type === 'collect' && 
              task.target instanceof Resource && 
              task.target === resource && 
              task.assignedServant === servant) {
            this.workQueue.completeTask(task.id);
            this.logger.debug('Work queue task completed', { taskId: task.id, resourceType });
          }
        });
      }
    });

    // Assign unassigned tasks to available servants
    this.assignTasksToServants();
  }

  /**
   * Assign unassigned tasks to available servants
   */
  private assignTasksToServants(): void {
    const unassignedTasks = this.workQueue.getTasksByStatus(false);
    if (unassignedTasks.length === 0) {
      return;
    }

    const availableServants = this.getAvailableServants('player');
    if (availableServants.length === 0) {
      this.logger.debug('No available servants for task assignment', { 
        unassignedTasks: unassignedTasks.length,
        totalServants: this.servants.length 
      });
      return;
    }

    this.logger.debug('Assigning tasks to servants', { 
      unassignedTasks: unassignedTasks.length,
      availableServants: availableServants.length 
    });

    // Assign tasks to available servants
    unassignedTasks.forEach(task => {
      if (availableServants.length === 0) {
        return; // No more available servants
      }

      // Find nearest available servant
      let nearest: Servant | null = null;
      let nearestDistance = Infinity;
      const targetPosition = task.type === 'collect' && task.target instanceof Resource
        ? task.target.getPosition()
        : task.target instanceof Vector3
        ? task.target
        : null;

      if (!targetPosition) {
        return;
      }

      availableServants.forEach(servant => {
        const distance = Vector3.Distance(targetPosition, servant.getPosition());
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = servant;
        }
      });

      if (nearest !== null) {
        const assigned = this.workQueue.assignTask(task.id, nearest);
        if (assigned) {
          // TypeScript workaround: extract values to avoid narrowing issues
          const nearestServant: Servant = nearest;
          const servantName = nearestServant.getMesh().name;
          const servantState = nearestServant.getState();
          this.logger.debug('Task assigned to servant', { 
            taskId: task.id, 
            servantName,
            servantState
          });
          // Remove from available list
          const index = availableServants.indexOf(nearestServant);
          if (index > -1) {
            availableServants.splice(index, 1);
          }
        } else {
          this.logger.warn('Failed to assign task to servant', { taskId: task.id });
        }
      }
    });
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

  /**
   * Show visual feedback when resource is delivered
   */
  private showDeliveryFeedback(position: Vector3, resourceType: ResourceType, amount: number): void {
    if (!this.scene) {
      return;
    }

    // Create a floating sphere that rises and fades
    const feedbackMesh = Mesh.CreateSphere('delivery_feedback', 8, GameScale.DELIVERY_FEEDBACK_SIZE, this.scene);
    feedbackMesh.position = position.clone();
    feedbackMesh.position.y += GameScale.SERVANT_HEIGHT / 2; // Start at servant center height

    // Color based on resource type
    const material = new StandardMaterial('delivery_feedback_material', this.scene);
    const colorMap: Record<ResourceType, Color3> = {
      [ResourceType.WOOD]: new Color3(0.6, 0.4, 0.2),
      [ResourceType.STONE]: new Color3(0.5, 0.5, 0.5),
      [ResourceType.GOLD]: new Color3(1.0, 0.84, 0.0),
      [ResourceType.CRYSTAL]: new Color3(0.5, 0.0, 1.0),
      [ResourceType.ESSENCE]: new Color3(0.0, 1.0, 0.5),
      [ResourceType.MANA]: new Color3(0.0, 0.5, 1.0)
    };

    material.diffuseColor = colorMap[resourceType] || new Color3(1, 1, 1);
    material.emissiveColor = colorMap[resourceType] || new Color3(0.5, 0.5, 0.5);
    material.emissiveColor.scale(0.8);
    material.alpha = 1.0; // Start fully opaque
    feedbackMesh.material = material;

    // Animate: rise up and fade out
    const riseAnimation = new Animation(
      'delivery_rise',
      'position.y',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    const startY = feedbackMesh.position.y;
    riseAnimation.setKeys([
      { frame: 0, value: startY },
      { frame: 30, value: startY + GameScale.DELIVERY_FEEDBACK_RISE }
    ]);

    const fadeAnimation = new Animation(
      'delivery_fade',
      'material.alpha',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    fadeAnimation.setKeys([
      { frame: 0, value: 1.0 },
      { frame: 30, value: 0.0 }
    ]);

    feedbackMesh.animations.push(riseAnimation, fadeAnimation);

    // Start animation
    this.scene.beginAnimation(feedbackMesh, 0, 30, false, 1.0, () => {
      // Cleanup when animation completes
      feedbackMesh.dispose();
    });

    this.logger.debug('Delivery feedback shown', { resourceType, amount, position });
  }
}
