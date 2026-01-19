/**
 * CombatComponent Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CombatComponent, EnemyType } from '../CombatComponent';

describe('CombatComponent', () => {
  let component: CombatComponent;

  beforeEach(() => {
    component = new CombatComponent(EnemyType.BASIC_MELEE, {
      health: 50,
      maxHealth: 50,
      attack: 10,
      defense: 2,
      speed: 1.5,
      attackCooldown: 1000,
      lastAttackTime: 0
    });
  });

  describe('Initialization', () => {
    it('should create with correct stats', () => {
      expect(component.enemyType).toBe(EnemyType.BASIC_MELEE);
      expect(component.stats.health).toBe(50);
      expect(component.stats.maxHealth).toBe(50);
      expect(component.stats.attack).toBe(10);
      expect(component.stats.defense).toBe(2);
    });
  });

  describe('Damage', () => {
    it('should take physical damage and apply defense', () => {
      const damage = component.takeDamage(15, 'physical');
      
      // 15 damage - 2 defense = 13 actual damage
      expect(component.stats.health).toBe(37);
      expect(damage).toBe(13);
    });

    it('should take minimum 1 damage even with high defense', () => {
      component.stats.defense = 100;
      const damage = component.takeDamage(5, 'physical');
      
      expect(damage).toBeGreaterThanOrEqual(1);
      expect(component.stats.health).toBeLessThan(50);
    });

    it('should apply magic resistance for magic-resistant enemies', () => {
      const magicResistant = new CombatComponent(EnemyType.MAGIC_RESISTANT, {
        health: 60,
        maxHealth: 60,
        attack: 12,
        defense: 5,
        speed: 1.3,
        attackCooldown: 1000,
        lastAttackTime: 0
      });
      
      const damage = magicResistant.takeDamage(20, 'magic');
      
      // Magic damage should be reduced by 50% for magic-resistant enemies
      expect(damage).toBeLessThan(20);
      expect(magicResistant.stats.health).toBeGreaterThan(40);
    });
  });

  describe('Attack', () => {
    it('should attack when cooldown is ready', () => {
      const currentTime = Date.now();
      const damage = component.attack(null, currentTime);
      
      expect(damage).toBe(10);
      expect(component.stats.lastAttackTime).toBe(currentTime);
    });

    it('should not attack if cooldown not ready', () => {
      const currentTime = Date.now();
      component.attack(null, currentTime);
      
      // Try to attack immediately again
      const damage = component.attack(null, currentTime);
      
      expect(damage).toBe(0);
    });

    it('should allow attack after cooldown period', () => {
      const time1 = Date.now();
      component.attack(null, time1);
      
      const time2 = time1 + 1001; // Just over cooldown
      const damage = component.attack(null, time2);
      
      expect(damage).toBe(10);
    });
  });

  describe('Death', () => {
    it('should be dead when health is zero', () => {
      // 50 damage - 2 defense = 48 actual damage, so 50 - 48 = 2 health remaining
      // Need to deal enough damage to kill
      component.takeDamage(52, 'physical'); // 52 - 2 = 50 damage, exactly kills
      
      expect(component.isDead()).toBe(true);
    });

    it('should not be dead when health is above zero', () => {
      component.takeDamage(25, 'physical');
      
      expect(component.isDead()).toBe(false);
    });

    it('should return correct health percentage', () => {
      component.takeDamage(25, 'physical');
      
      // 50 - 23 (25 - 2 defense) = 27 health remaining
      // 27 / 50 = 0.54
      const percentage = component.getHealthPercentage();
      expect(percentage).toBeCloseTo(0.54, 2);
    });
  });
});
