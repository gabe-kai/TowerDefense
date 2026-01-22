/**
 * House Entity - Separate upgradable structure attached to tower
 */

import { Mesh, Vector3 } from '@babylonjs/core';
import { BuildingComponent, BuildingType } from '../components/BuildingComponent';
import { PrimitiveFactory } from '../assets/PrimitiveFactory';
import { GameScale } from '../utils/GameScale';
import { createCategoryLogger } from '../utils/Logger';
import { SelectableObject } from '../systems/SelectableObject';
import { ObjectInfo } from '../ui/InfoPanel';

export interface HouseStructure {
  mesh: Mesh;
  component: BuildingComponent;
  upgradeLevel: number;
}

export class House implements SelectableObject {
  private mesh: Mesh;
  private position: Vector3;
  private primitiveFactory: PrimitiveFactory;
  private owner: 'player' | 'ai';
  private component: BuildingComponent;
  private upgradeLevel: number = 0;
  private logger = createCategoryLogger('House');

  constructor(position: Vector3, owner: 'player' | 'ai' = 'player', component: BuildingComponent) {
    this.position = position.clone();
    this.owner = owner;
    this.primitiveFactory = PrimitiveFactory.getInstance();
    this.component = component;

    // Create house mesh
    this.mesh = this.primitiveFactory.createHouse(`${owner}_house`, position, owner);
    this.mesh.metadata = { ...this.mesh.metadata, house: this, building: true, buildingType: BuildingType.TOWER_BASE };
  }

  /**
   * Get house mesh
   */
  getMesh(): Mesh {
    return this.mesh;
  }

  /**
   * Get house position
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
   * Get building component
   */
  getComponent(): BuildingComponent {
    return this.component;
  }

  /**
   * Get upgrade level
   */
  getUpgradeLevel(): number {
    return this.upgradeLevel;
  }

  /**
   * Upgrade the house
   */
  upgrade(): boolean {
    // TODO: Check resources, deduct costs, etc.
    this.upgradeLevel++;
    this.logger.info('House upgraded', { owner: this.owner, upgradeLevel: this.upgradeLevel });
    
    // Rebuild house with new size
    this.rebuild();
    return true;
  }

  /**
   * Rebuild house with current upgrade level
   */
  private rebuild(): void {
    // Dispose old mesh
    this.mesh.dispose();

    // Create new house mesh with upgraded size
    this.mesh = this.primitiveFactory.createHouse(
      `${this.owner}_house`,
      this.position,
      this.owner,
      this.upgradeLevel
    );
    this.mesh.metadata = { ...this.mesh.metadata, house: this, building: true, buildingType: BuildingType.TOWER_BASE };
  }

  /**
   * ISelectable implementation
   */
  getName(): string {
    return `${this.owner === 'player' ? 'Player' : 'AI'} House`;
  }

  getObjectInfo(): ObjectInfo {
    const health = this.component.stats.health;
    const maxHealth = this.component.stats.maxHealth;
    const defense = this.component.stats.defense;
    const healthPercent = maxHealth > 0 ? Math.round((health / maxHealth) * 100) : 0;
    const sizeMultiplier = 1.0 + (this.upgradeLevel * 0.1);

    return {
      name: this.getName(),
      type: 'House',
      details: {
        'Health': `${health}/${maxHealth} (${healthPercent}%)`,
        'Defense': defense.toString(),
        'Upgrade Level': this.upgradeLevel.toString(),
        'Size': `${(sizeMultiplier * 100).toFixed(0)}%`
      },
      actions: [
        {
          label: `Upgrade House (Size: ${((sizeMultiplier + 0.1) * 100).toFixed(0)}%)`,
          onClick: () => {
            this.upgrade();
          }
        }
      ]
    };
  }

  isSelectable(): boolean {
    return true;
  }

  dispose(): void {
    this.mesh.dispose();
  }
}
