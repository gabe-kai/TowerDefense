/**
 * Enemy System - Enemy spawning, pathfinding, combat
 */

import { Scene, Vector3 } from '@babylonjs/core';
import { Enemy } from '../entities/Enemy';
import { CombatComponent, EnemyType } from '../components/CombatComponent';
import { Tower } from '../entities/Tower';
import { AssetCatalog, AssetCategory, AssetType } from '../assets/AssetCatalog';
import { createCategoryLogger } from '../utils/Logger';

export interface EnemySpawnConfig {
  type: EnemyType;
  count: number;
  spawnPosition: Vector3;
}

export class EnemySystem {
  private scene: Scene;
  private enemies: Enemy[] = [];
  private catalog: AssetCatalog;
  private lastUpdateTime: number = 0;
  private logger = createCategoryLogger('EnemySystem');

  // Enemy type definitions
  private enemyDefinitions: Map<EnemyType, { health: number; attack: number; defense: number; speed: number }> = new Map();

  constructor(scene: Scene) {
    this.scene = scene;
    this.catalog = AssetCatalog.getInstance();
    this.initializeEnemyDefinitions();
    this.registerEnemyAssets();
  }

  private initializeEnemyDefinitions(): void {
    this.enemyDefinitions.set(EnemyType.BASIC_MELEE, {
      health: 50,
      attack: 10,
      defense: 2,
      speed: 1.5
    });

    this.enemyDefinitions.set(EnemyType.BASIC_RANGED, {
      health: 40,
      attack: 15,
      defense: 1,
      speed: 1.2
    });

    this.enemyDefinitions.set(EnemyType.FLYING, {
      health: 30,
      attack: 8,
      defense: 0,
      speed: 2.5
    });

    this.enemyDefinitions.set(EnemyType.TANK, {
      health: 150,
      attack: 12,
      defense: 10,
      speed: 0.8
    });

    this.enemyDefinitions.set(EnemyType.FAST, {
      health: 25,
      attack: 8,
      defense: 1,
      speed: 3.0
    });

    this.enemyDefinitions.set(EnemyType.MAGIC_RESISTANT, {
      health: 60,
      attack: 12,
      defense: 5,
      speed: 1.3
    });

    this.enemyDefinitions.set(EnemyType.BOSS, {
      health: 300,
      attack: 25,
      defense: 15,
      speed: 1.0
    });
  }

  private registerEnemyAssets(): void {
    Object.values(EnemyType).forEach(type => {
      this.catalog.registerAsset(
        `enemy_${type}`,
        `${type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        AssetCategory.CHARACTERS,
        AssetType.MODEL_3D,
        `${type} enemy type`,
        { usageContext: 'Wave combat' }
      );
    });
  }

  /**
   * Spawn an enemy
   */
  spawnEnemy(type: EnemyType, position: Vector3, targetTower: Tower): Enemy {
    const def = this.enemyDefinitions.get(type);
    if (!def) {
      this.logger.error('Enemy type not defined', undefined, { type });
      throw new Error(`Enemy type ${type} not defined`);
    }

    const component = new CombatComponent(type, {
      health: def.health,
      maxHealth: def.health,
      attack: def.attack,
      defense: def.defense,
      speed: def.speed,
      attackCooldown: 1000, // 1 second
      lastAttackTime: 0
    });

    const enemy = new Enemy(type, position, component);
    enemy.setTargetTower(targetTower);
    this.enemies.push(enemy);

    this.logger.debug('Enemy spawned', { type, position, health: def.health });
    return enemy;
  }

  /**
   * Spawn multiple enemies for a wave
   */
  spawnWave(enemyConfigs: EnemySpawnConfig[], targetTower: Tower): void {
    enemyConfigs.forEach(config => {
      for (let i = 0; i < config.count; i++) {
        // Spawn enemies in a spread pattern
        const offset = new Vector3(
          (Math.random() - 0.5) * 5,
          0,
          (Math.random() - 0.5) * 5
        );
        const spawnPos = config.spawnPosition.add(offset);
        
        this.spawnEnemy(config.type, spawnPos, targetTower);
      }
    });
  }

  /**
   * Update all enemies (call each frame)
   */
  update(): void {
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = currentTime;

    if (deltaTime > 0.1) {
      this.enemies.forEach(enemy => {
        enemy.update(Math.min(deltaTime, 0.1));
      });
    }

    // Remove dead enemies
    this.cleanup();
  }

  /**
   * Get all alive enemies
   */
  getAliveEnemies(): Enemy[] {
    return this.enemies.filter(e => !e.isDead());
  }

  /**
   * Get enemies by type
   */
  getEnemiesByType(type: EnemyType): Enemy[] {
    return this.enemies.filter(e => e.getType() === type && !e.isDead());
  }

  /**
   * Remove dead enemies
   */
  private cleanup(): void {
    const dead = this.enemies.filter(e => e.isDead());
    dead.forEach(e => e.dispose());
    this.enemies = this.enemies.filter(e => !e.isDead());
  }

  /**
   * Clear all enemies
   */
  clear(): void {
    this.enemies.forEach(e => e.dispose());
    this.enemies = [];
  }

  /**
   * Get enemy count
   */
  getEnemyCount(): number {
    return this.getAliveEnemies().length;
  }
}
