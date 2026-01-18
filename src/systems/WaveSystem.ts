/**
 * Wave System - Wave spawning, countdown timer, difficulty
 */

import { Vector3 } from '@babylonjs/core';
import { EnemySystem, EnemySpawnConfig } from './EnemySystem';
import { EnemyType } from '../components/CombatComponent';
import { Tower } from '../entities/Tower';
import { GameStateManager, GamePhase } from '../core/GameState';

export interface WaveConfig {
  waveNumber: number;
  enemyConfigs: EnemySpawnConfig[];
  spawnPosition: Vector3;
  bonusMultiplier?: number; // Bonus for early trigger
}

export class WaveSystem {
  private enemySystem: EnemySystem;
  private stateManager: GameStateManager;
  private currentWave: number = 0;
  private nextWaveTime: number = 0;
  private waveInterval: number = 120000; // 2 minutes in milliseconds
  private waveActive: boolean = false;
  private earlyTriggerBonus: number = 1.5; // 50% bonus for early trigger

  constructor(enemySystem: EnemySystem) {
    this.enemySystem = enemySystem;
    this.stateManager = GameStateManager.getInstance();
    this.scheduleNextWave();
  }

  /**
   * Schedule the next wave
   */
  scheduleNextWave(): void {
    const now = Date.now();
    this.nextWaveTime = now + this.waveInterval;
    this.stateManager.setNextWaveTime(this.nextWaveTime);
    this.stateManager.setPhase(GamePhase.WAVE_COUNTDOWN);
    this.waveActive = false;
  }

  /**
   * Get time until next wave (in seconds)
   */
  getTimeUntilNextWave(): number {
    const now = Date.now();
    const remaining = Math.max(0, this.nextWaveTime - now);
    return Math.floor(remaining / 1000);
  }

  /**
   * Check if wave can be triggered early
   */
  canTriggerEarly(): boolean {
    return !this.waveActive && this.getTimeUntilNextWave() > 10; // Can't trigger if less than 10 seconds remaining
  }

  /**
   * Trigger next wave early (with bonus)
   */
  triggerWaveEarly(targetTower: Tower, spawnPosition: Vector3): boolean {
    if (!this.canTriggerEarly()) {
      return false;
    }

    const timeRemaining = this.getTimeUntilNextWave();
    const bonusMultiplier = 1 + (timeRemaining / this.waveInterval) * 0.5; // Up to 50% bonus

    this.startWave(targetTower, spawnPosition, bonusMultiplier);
    return true;
  }

  /**
   * Start a wave
   */
  startWave(targetTower: Tower, spawnPosition: Vector3, bonusMultiplier: number = 1.0): void {
    if (this.waveActive) {
      return; // Wave already active
    }

    this.currentWave++;
    this.stateManager.setCurrentWave(this.currentWave);
    this.stateManager.setPhase(GamePhase.WAVE_ACTIVE);
    this.waveActive = true;

    // Generate wave config
    const waveConfig = this.generateWaveConfig(this.currentWave, spawnPosition, bonusMultiplier);

    // Spawn enemies
    this.enemySystem.spawnWave(waveConfig.enemyConfigs, targetTower);

    console.log(`Wave ${this.currentWave} started with ${waveConfig.enemyConfigs.reduce((sum, c) => sum + c.count, 0)} enemies`);
  }

  /**
   * Generate wave configuration based on wave number
   */
  private generateWaveConfig(waveNumber: number, spawnPosition: Vector3, bonusMultiplier: number): WaveConfig {
    const enemyConfigs: EnemySpawnConfig[] = [];

    // Base enemy count increases with wave
    const baseCount = 3 + waveNumber * 2;

    // Wave 1: Basic enemies only
    if (waveNumber === 1) {
      enemyConfigs.push({
        type: EnemyType.BASIC_MELEE,
        count: baseCount,
        spawnPosition
      });
    }
    // Wave 2-3: Mix of basic types
    else if (waveNumber <= 3) {
      enemyConfigs.push({
        type: EnemyType.BASIC_MELEE,
        count: Math.floor(baseCount * 0.6),
        spawnPosition
      });
      enemyConfigs.push({
        type: EnemyType.BASIC_RANGED,
        count: Math.floor(baseCount * 0.4),
        spawnPosition
      });
    }
    // Wave 4-5: Add flying and fast enemies
    else if (waveNumber <= 5) {
      enemyConfigs.push({
        type: EnemyType.BASIC_MELEE,
        count: Math.floor(baseCount * 0.4),
        spawnPosition
      });
      enemyConfigs.push({
        type: EnemyType.BASIC_RANGED,
        count: Math.floor(baseCount * 0.3),
        spawnPosition
      });
      enemyConfigs.push({
        type: EnemyType.FLYING,
        count: Math.floor(baseCount * 0.2),
        spawnPosition
      });
      enemyConfigs.push({
        type: EnemyType.FAST,
        count: Math.floor(baseCount * 0.1),
        spawnPosition
      });
    }
    // Wave 6-8: Add tank and magic resistant
    else if (waveNumber <= 8) {
      enemyConfigs.push({
        type: EnemyType.BASIC_MELEE,
        count: Math.floor(baseCount * 0.3),
        spawnPosition
      });
      enemyConfigs.push({
        type: EnemyType.BASIC_RANGED,
        count: Math.floor(baseCount * 0.2),
        spawnPosition
      });
      enemyConfigs.push({
        type: EnemyType.FLYING,
        count: Math.floor(baseCount * 0.15),
        spawnPosition
      });
      enemyConfigs.push({
        type: EnemyType.FAST,
        count: Math.floor(baseCount * 0.15),
        spawnPosition
      });
      enemyConfigs.push({
        type: EnemyType.TANK,
        count: Math.floor(baseCount * 0.1),
        spawnPosition
      });
      enemyConfigs.push({
        type: EnemyType.MAGIC_RESISTANT,
        count: Math.floor(baseCount * 0.1),
        spawnPosition
      });
    }
    // Wave 9+: All types including boss
    else {
      enemyConfigs.push({
        type: EnemyType.BASIC_MELEE,
        count: Math.floor(baseCount * 0.25),
        spawnPosition
      });
      enemyConfigs.push({
        type: EnemyType.BASIC_RANGED,
        count: Math.floor(baseCount * 0.2),
        spawnPosition
      });
      enemyConfigs.push({
        type: EnemyType.FLYING,
        count: Math.floor(baseCount * 0.15),
        spawnPosition
      });
      enemyConfigs.push({
        type: EnemyType.FAST,
        count: Math.floor(baseCount * 0.15),
        spawnPosition
      });
      enemyConfigs.push({
        type: EnemyType.TANK,
        count: Math.floor(baseCount * 0.1),
        spawnPosition
      });
      enemyConfigs.push({
        type: EnemyType.MAGIC_RESISTANT,
        count: Math.floor(baseCount * 0.1),
        spawnPosition
      });
      
      // Boss every 3 waves starting from wave 9
      if (waveNumber % 3 === 0) {
        enemyConfigs.push({
          type: EnemyType.BOSS,
          count: 1,
          spawnPosition
        });
      }
    }

    // Apply bonus multiplier for early trigger
    if (bonusMultiplier > 1.0) {
      enemyConfigs.forEach(config => {
        config.count = Math.floor(config.count * bonusMultiplier);
      });
    }

    return {
      waveNumber: this.currentWave,
      enemyConfigs,
      spawnPosition,
      bonusMultiplier
    };
  }

  /**
   * Update wave system (check if wave should start automatically)
   */
  update(targetTower: Tower, spawnPosition: Vector3): void {
    const now = Date.now();

    // Check if it's time for next wave
    if (!this.waveActive && now >= this.nextWaveTime) {
      this.startWave(targetTower, spawnPosition);
    }

    // Check if current wave is complete (all enemies defeated)
    if (this.waveActive && this.enemySystem.getEnemyCount() === 0) {
      this.onWaveComplete();
    }
  }

  /**
   * Handle wave completion
   */
  private onWaveComplete(): void {
    this.waveActive = false;
    this.stateManager.setPhase(GamePhase.PLAYING);
    this.scheduleNextWave();
    console.log(`Wave ${this.currentWave} completed`);
  }

  /**
   * Get current wave number
   */
  getCurrentWave(): number {
    return this.currentWave;
  }

  /**
   * Check if wave is active
   */
  isWaveActive(): boolean {
    return this.waveActive;
  }

  /**
   * Get next wave time
   */
  getNextWaveTime(): number {
    return this.nextWaveTime;
  }
}
