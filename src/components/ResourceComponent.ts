/**
 * Resource Component - Resource data
 */

export enum ResourceType {
  WOOD = 'wood',
  STONE = 'stone',
  GOLD = 'gold',
  CRYSTAL = 'crystal',
  ESSENCE = 'essence',
  MANA = 'mana'
}

export interface ResourceData {
  type: ResourceType;
  amount: number;
  collected: boolean;
}

export class ResourceComponent {
  type: ResourceType;
  amount: number;
  collected: boolean;

  constructor(type: ResourceType, amount: number = 1) {
    this.type = type;
    this.amount = amount;
    this.collected = false;
  }

  collect(): number {
    if (this.collected) {
      return 0;
    }
    this.collected = true;
    return this.amount;
  }
}
