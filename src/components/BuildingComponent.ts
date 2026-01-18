/**
 * Building Component - Building data and stats
 */

export enum BuildingType {
  TOWER_BASE = 'tower_base',
  TOWER_FLOOR = 'tower_floor',
  TURRET = 'turret',
  CANNON = 'cannon',
  WALL = 'wall',
  BARRIER = 'barrier',
  STORAGE = 'storage',
  WORKSHOP = 'workshop',
  BARRACKS = 'barracks',
  LIBRARY = 'library',
  SPELL_TOWER = 'spell_tower'
}

export enum RoomType {
  DEFENSE = 'defense',
  OFFENSE = 'offense',
  RESOURCE = 'resource',
  HOUSING = 'housing',
  SPECIALIZED = 'specialized'
}

export interface BuildingStats {
  health: number;
  maxHealth: number;
  defense: number;
  attack?: number;
  range?: number;
  cost: {
    wood?: number;
    stone?: number;
    gold?: number;
    crystal?: number;
    essence?: number;
    mana?: number;
  };
}

export class BuildingComponent {
  type: BuildingType;
  roomType: RoomType;
  level: number;
  stats: BuildingStats;

  constructor(
    type: BuildingType,
    roomType: RoomType,
    level: number = 1,
    stats: BuildingStats
  ) {
    this.type = type;
    this.roomType = roomType;
    this.level = level;
    this.stats = stats;
  }

  upgrade(): void {
    this.level++;
    // Increase stats on upgrade
    this.stats.health = Math.floor(this.stats.health * 1.2);
    this.stats.maxHealth = Math.floor(this.stats.maxHealth * 1.2);
    if (this.stats.defense) {
      this.stats.defense = Math.floor(this.stats.defense * 1.15);
    }
    if (this.stats.attack) {
      this.stats.attack = Math.floor(this.stats.attack * 1.2);
    }
  }

  takeDamage(amount: number): void {
    this.stats.health = Math.max(0, this.stats.health - amount);
  }

  isDestroyed(): boolean {
    return this.stats.health <= 0;
  }
}
