/**
 * Enemy Entity
 */

import { Mesh, Vector3 } from '@babylonjs/core';
import { CombatComponent, EnemyType } from '../components/CombatComponent';
import { PrimitiveFactory } from '../assets/PrimitiveFactory';
import { Pathfinding } from '../utils/Pathfinding';
import { Tower } from './Tower';

export class Enemy {
  private mesh: Mesh;
  private component: CombatComponent;
  private currentPath: Vector3[] = [];
  private currentPathIndex: number = 0;
  private targetTower: Tower | null = null;
  private primitiveFactory: PrimitiveFactory;

  constructor(
    enemyType: EnemyType,
    position: Vector3,
    component: CombatComponent
  ) {
    this.primitiveFactory = PrimitiveFactory.getInstance();
    this.component = component;
    
    // Create visual representation
    this.mesh = this.primitiveFactory.createEnemy(enemyType, position);
    this.mesh.metadata = { enemy: this };
  }

  getMesh(): Mesh {
    return this.mesh;
  }

  getComponent(): CombatComponent {
    return this.component;
  }

  getPosition(): Vector3 {
    return this.mesh.position;
  }

  getType(): EnemyType {
    return this.component.enemyType;
  }

  /**
   * Set target tower and find path to it
   */
  setTargetTower(tower: Tower): void {
    this.targetTower = tower;
    const path = Pathfinding.findPath(this.mesh.position, tower.getPosition());
    if (path.length > 0) {
      this.currentPath = path;
      this.currentPathIndex = 0;
    }
  }

  /**
   * Update enemy (call each frame)
   */
  update(deltaTime: number): void {
    if (this.component.isDead()) {
      return;
    }

    // Move towards target
    if (this.targetTower && this.currentPath.length > 0) {
      this.updateMovement(deltaTime);
    }
  }

  private updateMovement(deltaTime: number): void {
    if (this.currentPathIndex >= this.currentPath.length) {
      // Reached tower, start attacking
      if (this.targetTower) {
        this.attackTower();
      }
      return;
    }

    const target = this.currentPath[this.currentPathIndex];
    const direction = target.subtract(this.mesh.position);
    const distance = direction.length();

    if (distance < 0.1) {
      // Reached this waypoint
      this.currentPathIndex++;
      if (this.currentPathIndex >= this.currentPath.length && this.targetTower) {
        this.attackTower();
      }
    } else {
      // Move towards target
      const moveDistance = this.component.stats.speed * deltaTime;
      const moveVector = direction.normalize().scale(Math.min(moveDistance, distance));
      this.mesh.position.addInPlace(moveVector);

      // Face movement direction
      if (moveVector.lengthSquared() > 0) {
        this.mesh.lookAt(target);
      }
    }
  }

  private attackTower(): void {
    if (!this.targetTower) {
      return;
    }

    const currentTime = Date.now();
    if (this.component.canAttack(currentTime)) {
      const damage = this.component.attack(null, currentTime);
      
      // Apply damage to tower base
      const baseMesh = this.targetTower.getBaseMesh();
      const baseComponent = baseMesh.metadata?.component;
      if (baseComponent) {
        baseComponent.takeDamage(damage);
      }
    }
  }

  /**
   * Take damage
   */
  takeDamage(amount: number, damageType: 'physical' | 'magic' = 'physical'): number {
    return this.component.takeDamage(amount, damageType);
  }

  /**
   * Check if enemy is dead
   */
  isDead(): boolean {
    return this.component.isDead();
  }

  dispose(): void {
    this.mesh.dispose();
  }
}
