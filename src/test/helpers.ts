/**
 * Test Helper Utilities
 */

import { Vector3 } from '@babylonjs/core';
import { ResourceType } from '../components/ResourceComponent';
import { Resource } from '../entities/Resource';
import { Servant } from '../entities/Servant';
import { EnemyType } from '../components/CombatComponent';
import { Enemy } from '../entities/Enemy';
import { CombatComponent } from '../components/CombatComponent';

/**
 * Create a mock Vector3
 */
export function createVector3(x = 0, y = 0, z = 0): Vector3 {
  return new Vector3(x, y, z);
}

/**
 * Create a test resource
 */
export function createTestResource(type: ResourceType = ResourceType.WOOD, amount = 1): Resource {
  return new Resource(type, createVector3(0, 0, 0), amount);
}

/**
 * Create a test servant
 */
export function createTestServant(name = 'test_servant', position = createVector3(0, 0, 0)): Servant {
  return new Servant(name, position);
}

/**
 * Create a test enemy
 */
export function createTestEnemy(
  type: EnemyType = EnemyType.BASIC_MELEE,
  position = createVector3(0, 0, 0)
): Enemy {
  const component = new CombatComponent(type, {
    health: 50,
    maxHealth: 50,
    attack: 10,
    defense: 2,
    speed: 1.5,
    attackCooldown: 1000,
    lastAttackTime: 0
  });
  
  return new Enemy(type, position, component);
}

/**
 * Wait for async operations
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock game state
 */
export function createMockGameState() {
  return {
    phase: 'playing' as const,
    player: {
      resources: {
        wood: 100,
        stone: 50,
        gold: 0,
        crystal: 0,
        essence: 0,
        mana: 0
      },
      towerHeight: 1,
      powerLevel: 0,
      servants: 1
    },
    ai: {
      resources: {
        wood: 100,
        stone: 50,
        gold: 0,
        crystal: 0,
        essence: 0,
        mana: 0
      },
      towerHeight: 1,
      powerLevel: 0,
      servants: 1
    },
    currentWave: 0,
    nextWaveTime: 0,
    gameStartTime: Date.now()
  };
}
