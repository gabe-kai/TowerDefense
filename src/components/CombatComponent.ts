/**
 * Combat Component - Combat stats and behavior
 */

export enum EnemyType {
  BASIC_MELEE = 'basic_melee',
  BASIC_RANGED = 'basic_ranged',
  FLYING = 'flying',
  TANK = 'tank',
  FAST = 'fast',
  MAGIC_RESISTANT = 'magic_resistant',
  BOSS = 'boss'
}

export interface CombatStats {
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  range?: number;
  attackCooldown: number;
  lastAttackTime: number;
}

export class CombatComponent {
  enemyType: EnemyType;
  stats: CombatStats;
  target: any | null = null; // Target tower or building

  constructor(enemyType: EnemyType, stats: CombatStats) {
    this.enemyType = enemyType;
    this.stats = stats;
    this.stats.lastAttackTime = 0;
  }

  takeDamage(amount: number, damageType: 'physical' | 'magic' = 'physical'): number {
    let actualDamage = amount;

    // Apply defense
    if (damageType === 'physical') {
      actualDamage = Math.max(1, amount - this.stats.defense);
    } else if (damageType === 'magic' && this.enemyType === EnemyType.MAGIC_RESISTANT) {
      actualDamage = Math.max(1, amount * 0.5); // 50% magic resistance
    }

    this.stats.health = Math.max(0, this.stats.health - actualDamage);
    return actualDamage;
  }

  canAttack(currentTime: number): boolean {
    return (currentTime - this.stats.lastAttackTime) >= this.stats.attackCooldown;
  }

  attack(target: any, currentTime: number): number {
    if (!this.canAttack(currentTime)) {
      return 0;
    }

    this.stats.lastAttackTime = currentTime;
    return this.stats.attack;
  }

  isDead(): boolean {
    return this.stats.health <= 0;
  }

  getHealthPercentage(): number {
    return this.stats.health / this.stats.maxHealth;
  }
}
