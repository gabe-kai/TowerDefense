/**
 * Servant Entity
 */

import { Mesh, Vector3, Animation, Scene, StandardMaterial, Color3 } from '@babylonjs/core';
import { PrimitiveFactory } from '../assets/PrimitiveFactory';
import { Pathfinding } from '../utils/Pathfinding';
import { Resource } from './Resource';
import { ResourceType } from '../components/ResourceComponent';
import { createCategoryLogger } from '../utils/Logger';

export enum ServantState {
  IDLE = 'idle',
  MOVING = 'moving',
  COLLECTING = 'collecting',
  WORKING = 'working', // Working at resource location
  RETURNING = 'returning'
}

export interface Command {
  type: 'collect' | 'move';
  target: Vector3 | Resource;
  completed: boolean;
}

export class Servant {
  private mesh: Mesh;
  private state: ServantState = ServantState.IDLE;
  private commandQueue: Command[] = [];
  private currentPath: Vector3[] = [];
  private currentPathIndex: number = 0;
  private speed: number = 2.0; // units per second
  private homePosition: Vector3;
  private carryingResource: Resource | null = null;
  private primitiveFactory: PrimitiveFactory;
  private carryingIndicator: Mesh | null = null; // Visual indicator for carried resource
  private scene: Scene | null = null;
  private logger = createCategoryLogger('Servant');
  private originalEmissiveColor: Color3 | null = null; // Store original emissive color for movement glow
  private workingTime: number = 0; // Time spent working at resource
  private workingDuration: number = 1.0; // Seconds to work at resource before collecting
  private baseYPosition: number = 0.5; // Base Y position for working animation

  constructor(name: string, position: Vector3, scene?: Scene) {
    this.primitiveFactory = PrimitiveFactory.getInstance();
    this.scene = scene || null;
    this.homePosition = position.clone();
    this.mesh = this.primitiveFactory.createServant(name, position);
    this.mesh.metadata = { servant: this };
  }

  getMesh(): Mesh {
    return this.mesh;
  }

  getPosition(): Vector3 {
    return this.mesh.position;
  }

  getState(): ServantState {
    return this.state;
  }

  getHomePosition(): Vector3 {
    return this.homePosition;
  }

  setHomePosition(position: Vector3): void {
    this.homePosition = position.clone();
  }

  /**
   * Queue a command to collect a resource
   */
  queueCollectCommand(resource: Resource): void {
    this.commandQueue.push({
      type: 'collect',
      target: resource,
      completed: false
    });
  }

  /**
   * Queue a command to move to a position
   */
  queueMoveCommand(position: Vector3): void {
    this.commandQueue.push({
      type: 'move',
      target: position,
      completed: false
    });
  }

  /**
   * Update servant (call each frame)
   */
  update(deltaTime: number): void {
    // Process command queue
    if (this.commandQueue.length > 0 && this.state === ServantState.IDLE) {
      const command = this.commandQueue[0];
      this.executeCommand(command);
    }

    // Update working state
    if (this.state === ServantState.WORKING) {
      this.updateWorking(deltaTime);
    }

    // Update movement
    const wasMoving = this.state === ServantState.MOVING || this.state === ServantState.RETURNING;
    if (wasMoving) {
      this.updateMovement(deltaTime);
    }

    // Update visual indicators (movement glow, carrying indicator)
    this.updateVisualIndicators(wasMoving || this.state === ServantState.WORKING);
  }

  private executeCommand(command: Command): void {
    if (command.type === 'collect' && command.target instanceof Resource) {
      const resource = command.target as Resource;
      if (resource.isCollected()) {
        // Resource already collected, skip
        this.commandQueue.shift();
        return;
      }

      // Find path to resource
      const path = Pathfinding.findPath(this.mesh.position, resource.getPosition());
      if (path.length > 0) {
        this.currentPath = path;
        this.currentPathIndex = 0;
        this.state = ServantState.MOVING;
        this.setMovementGlow(true);
      }
    } else if (command.type === 'move') {
      const target = command.target as Vector3;
      const path = Pathfinding.findPath(this.mesh.position, target);
      if (path.length > 0) {
        this.currentPath = path;
        this.currentPathIndex = 0;
        this.state = ServantState.MOVING;
        this.setMovementGlow(true);
      }
    }
  }

  private updateMovement(deltaTime: number): void {
    if (this.currentPath.length === 0 || this.currentPathIndex >= this.currentPath.length) {
      // Reached destination
      this.onReachedDestination();
      return;
    }

    const target = this.currentPath[this.currentPathIndex];
    const direction = target.subtract(this.mesh.position);
    const distance = direction.length();

    if (distance < 0.1) {
      // Reached this waypoint, move to next
      this.currentPathIndex++;
      if (this.currentPathIndex >= this.currentPath.length) {
        this.onReachedDestination();
      }
    } else {
      // Move towards target
      const moveDistance = this.speed * deltaTime;
      const moveVector = direction.normalize().scale(Math.min(moveDistance, distance));
      this.mesh.position.addInPlace(moveVector);

      // Face movement direction
      if (moveVector.lengthSquared() > 0) {
        this.mesh.lookAt(target);
      }
    }
  }

  private onReachedDestination(): void {
    const command = this.commandQueue[0];
    if (!command) {
      this.state = ServantState.IDLE;
      this.setMovementGlow(false);
      return;
    }

    if (command.type === 'collect' && command.target instanceof Resource) {
      const resource = command.target as Resource;
      if (!resource.isCollected()) {
        // Start working at resource location
        this.state = ServantState.WORKING;
        this.workingTime = 0;
        this.baseYPosition = this.mesh.position.y; // Store base position for animation
        this.setMovementGlow(false);
        this.logger.debug('Reached resource, starting work', { resourceType: resource.getType() });
      } else {
        // Resource already collected, skip
        command.completed = true;
        this.commandQueue.shift();
        this.state = ServantState.IDLE;
        this.setMovementGlow(false);
      }
    } else if (command.type === 'move') {
      command.completed = true;
      this.commandQueue.shift();
      this.state = ServantState.IDLE;
      this.setMovementGlow(false);
    }

    // If returning home and reached home
    if (this.state === ServantState.RETURNING && 
        Vector3.Distance(this.mesh.position, this.homePosition) < 1.0) {
      this.deliverResourceToTower();
    }
  }

  /**
   * Update working state (mining/collecting animation)
   */
  private updateWorking(deltaTime: number): void {
    this.workingTime += deltaTime;
    
    // Play working animation (subtle bobbing)
    if (this.scene) {
      const bobAmount = Math.sin(this.workingTime * 8) * 0.05; // Fast bobbing
      this.mesh.position.y = this.baseYPosition + bobAmount;
    }

    // After working duration, collect the resource
    if (this.workingTime >= this.workingDuration) {
      const command = this.commandQueue[0];
      if (command && command.type === 'collect' && command.target instanceof Resource) {
        const resource = command.target as Resource;
        if (!resource.isCollected()) {
          // Collect resource (deduct from patch)
          const amount = resource.collect();
          this.carryingResource = resource;
          this.state = ServantState.RETURNING;
          this.createCarryingIndicator(resource.getType());
          this.logger.debug('Resource collected, returning home', { resourceType: resource.getType(), amount });

          // Path back to home
          const path = Pathfinding.findPath(this.mesh.position, this.homePosition);
          if (path.length > 0) {
            this.currentPath = path;
            this.currentPathIndex = 0;
          }
          this.setMovementGlow(true);

          // Mark command as completed
          command.completed = true;
          this.commandQueue.shift();
        } else {
          // Resource was collected by someone else
          command.completed = true;
          this.commandQueue.shift();
          this.state = ServantState.IDLE;
          this.setMovementGlow(false);
        }
      }
    }
  }

  /**
   * Deliver resource to tower
   */
  private deliverResourceToTower(): void {
    if (this.carryingResource) {
      this.logger.debug('Reached home, ready to deliver', { resourceType: this.carryingResource.getType() });
    }
    // The actual delivery is handled by ServantSystem.deliverResource()
    // This just cleans up the visual state
    this.removeCarryingIndicator();
    this.state = ServantState.IDLE;
    this.setMovementGlow(false);
  }
  
  /**
   * Get resource being delivered (call when at home)
   */
  deliverResource(): Resource | null {
    if (this.state === ServantState.RETURNING && 
        Vector3.Distance(this.mesh.position, this.homePosition) < 1.0 &&
        this.carryingResource) {
      const resource = this.carryingResource;
      this.removeCarryingIndicator();
      this.carryingResource = null;
      this.state = ServantState.IDLE;
      return resource;
    }
    return null;
  }

  /**
   * Get resource being carried
   */
  getCarryingResource(): Resource | null {
    return this.carryingResource;
  }

  /**
   * Get command queue
   */
  getCommandQueue(): Command[] {
    return [...this.commandQueue];
  }

  /**
   * Check if servant is available for new commands
   */
  isAvailable(): boolean {
    return this.state === ServantState.IDLE && this.commandQueue.length === 0;
  }

  /**
   * Create visual indicator for carried resource
   */
  private createCarryingIndicator(resourceType: ResourceType | string): void {
    if (!this.scene) {
      this.logger.debug('Cannot create carrying indicator - no scene reference');
      return; // Can't create indicator without scene
    }

    // Remove existing indicator if any
    this.removeCarryingIndicator();
    this.logger.debug('Creating carrying indicator', { resourceType });

    // Create a small sphere above the servant to represent the resource
    this.carryingIndicator = Mesh.CreateSphere('carrying_indicator', 8, 0.3, this.scene);
    
    // Make it a child of the servant mesh FIRST so position is relative to parent
    this.carryingIndicator.parent = this.mesh;
    
    // Position it just above the servant's head (servant height is 1.2, so top is at +0.6)
    // Position at +0.65 to have it almost touching the head (relative to parent center)
    this.carryingIndicator.position = new Vector3(0, 0.65, 0); // Local position relative to parent
    
    // Set material color based on resource type
    const material = new StandardMaterial('carrying_material', this.scene);
    const colorMap: Record<string, Color3> = {
      'wood': new Color3(0.6, 0.4, 0.2),      // Brown
      'stone': new Color3(0.5, 0.5, 0.5),     // Gray
      'gold': new Color3(1.0, 0.84, 0.0),     // Gold
      'crystal': new Color3(0.5, 0.0, 1.0),   // Purple
      'essence': new Color3(0.0, 1.0, 0.5),   // Green
      'mana': new Color3(0.0, 0.5, 1.0)       // Blue
    };
    
    material.diffuseColor = colorMap[resourceType] || new Color3(1, 1, 1);
    material.emissiveColor = colorMap[resourceType] || new Color3(0.3, 0.3, 0.3);
    material.emissiveColor.scale(0.5); // Dim the emissive
    
    this.carryingIndicator.material = material;
    
    // Add a subtle floating animation
    this.addFloatingAnimation();
  }

  /**
   * Remove carrying indicator
   */
  private removeCarryingIndicator(): void {
    if (this.carryingIndicator) {
      this.carryingIndicator.dispose();
      this.carryingIndicator = null;
    }
  }

  /**
   * Add floating animation to carrying indicator
   */
  private addFloatingAnimation(): void {
    if (!this.carryingIndicator || !this.scene) {
      return;
    }

    // Create a simple up-and-down floating animation (relative to parent)
    const animation = new Animation(
      'floating',
      'position.y',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    // Since it's a child, position.y is relative to parent
    const baseY = 0.65; // Base offset above servant (almost touching head)
    const keys = [
      { frame: 0, value: baseY },
      { frame: 30, value: baseY + 0.15 }, // Smaller float range for closer indicator
      { frame: 60, value: baseY }
    ];
    animation.setKeys(keys);

    this.carryingIndicator.animations.push(animation);
    this.scene.beginAnimation(this.carryingIndicator, 0, 60, true);
  }

  /**
   * Update visual indicators (called each frame)
   */
  private updateVisualIndicators(isMoving: boolean): void {
    // Carrying indicator is parented to mesh, so it moves automatically
    // Movement glow is handled by setMovementGlow
  }

  /**
   * Set movement glow effect (subtle emissive glow when moving)
   */
  private setMovementGlow(enabled: boolean): void {
    if (!this.mesh.material || !(this.mesh.material instanceof StandardMaterial)) {
      return;
    }

    const material = this.mesh.material as StandardMaterial;
    
    if (enabled) {
      // Store original emissive color if not already stored
      if (!this.originalEmissiveColor) {
        this.originalEmissiveColor = material.emissiveColor.clone();
      }
      // Add subtle blue glow when moving
      material.emissiveColor = new Color3(0.1, 0.2, 0.4);
    } else {
      // Restore original emissive (or clear if no original)
      if (this.originalEmissiveColor) {
        material.emissiveColor = this.originalEmissiveColor.clone();
        this.originalEmissiveColor = null; // Reset after restoring
      } else {
        material.emissiveColor = new Color3(0, 0, 0);
      }
    }
  }

  /**
   * Set scene reference (needed for visual indicators)
   */
  setScene(scene: Scene): void {
    this.scene = scene;
  }

  dispose(): void {
    this.removeCarryingIndicator();
    this.mesh.dispose();
  }
}
