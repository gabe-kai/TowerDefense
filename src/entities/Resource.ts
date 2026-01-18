/**
 * Resource Entity
 */

import { Mesh, Vector3 } from '@babylonjs/core';
import { ResourceComponent, ResourceType } from '../components/ResourceComponent';
import { PrimitiveFactory } from '../assets/PrimitiveFactory';

export class Resource {
  private mesh: Mesh;
  private component: ResourceComponent;
  private primitiveFactory: PrimitiveFactory;

  constructor(
    type: ResourceType,
    position: Vector3,
    amount: number = 1
  ) {
    this.primitiveFactory = PrimitiveFactory.getInstance();
    this.component = new ResourceComponent(type, amount);
    
    // Create visual representation
    this.mesh = this.primitiveFactory.createResourceNode(type, position);
    this.mesh.metadata = { resource: this };
  }

  getMesh(): Mesh {
    return this.mesh;
  }

  getComponent(): ResourceComponent {
    return this.component;
  }

  getType(): ResourceType {
    return this.component.type;
  }

  getAmount(): number {
    return this.component.amount;
  }

  getPosition(): Vector3 {
    return this.mesh.position;
  }

  isCollected(): boolean {
    return this.component.collected;
  }

  collect(): number {
    const amount = this.component.collect();
    if (amount > 0) {
      // Hide the mesh when collected
      this.mesh.setEnabled(false);
    }
    return amount;
  }

  dispose(): void {
    this.mesh.dispose();
  }
}
