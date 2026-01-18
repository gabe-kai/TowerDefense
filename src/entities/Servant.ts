/**
 * Servant Entity
 */

import { Mesh, Vector3, Animation } from '@babylonjs/core';
import { PrimitiveFactory } from '../assets/PrimitiveFactory';
import { Pathfinding } from '../utils/Pathfinding';
import { Resource } from './Resource';

export enum ServantState {
  IDLE = 'idle',
  MOVING = 'moving',
  COLLECTING = 'collecting',
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

  constructor(name: string, position: Vector3) {
    this.primitiveFactory = PrimitiveFactory.getInstance();
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

    // Update movement
    if (this.state === ServantState.MOVING || this.state === ServantState.RETURNING) {
      this.updateMovement(deltaTime);
    }
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
      }
    } else if (command.type === 'move') {
      const target = command.target as Vector3;
      const path = Pathfinding.findPath(this.mesh.position, target);
      if (path.length > 0) {
        this.currentPath = path;
        this.currentPathIndex = 0;
        this.state = ServantState.MOVING;
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
      return;
    }

    if (command.type === 'collect' && command.target instanceof Resource) {
      const resource = command.target as Resource;
      if (!resource.isCollected()) {
        // Collect resource
        const amount = resource.collect();
        this.carryingResource = resource;
        this.state = ServantState.RETURNING;

        // Path back to home
        const path = Pathfinding.findPath(this.mesh.position, this.homePosition);
        if (path.length > 0) {
          this.currentPath = path;
          this.currentPathIndex = 0;
        }

        // Mark command as completed
        command.completed = true;
        this.commandQueue.shift();
      }
    } else if (command.type === 'move') {
      command.completed = true;
      this.commandQueue.shift();
      this.state = ServantState.IDLE;
    }

    // If returning home and reached home
    if (this.state === ServantState.RETURNING && 
        Vector3.Distance(this.mesh.position, this.homePosition) < 1.0) {
      this.carryingResource = null;
      this.state = ServantState.IDLE;
    }
  }
  
  /**
   * Get resource being delivered (call when at home)
   */
  deliverResource(): Resource | null {
    if (this.state === ServantState.RETURNING && 
        Vector3.Distance(this.mesh.position, this.homePosition) < 1.0 &&
        this.carryingResource) {
      const resource = this.carryingResource;
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
   * Check if servant is available for new commands
   */
  isAvailable(): boolean {
    return this.state === ServantState.IDLE && this.commandQueue.length === 0;
  }

  dispose(): void {
    this.mesh.dispose();
  }
}
