/**
 * BuildingComponent Tests
 */

import { describe, it, expect } from 'vitest';
import { BuildingComponent, BuildingType, RoomType } from '../BuildingComponent';

describe('BuildingComponent', () => {
  describe('Initialization', () => {
    it('should create with correct properties', () => {
      const component = new BuildingComponent(
        BuildingType.TOWER_FLOOR,
        RoomType.DEFENSE,
        1,
        {
          health: 100,
          maxHealth: 100,
          defense: 10,
          cost: { wood: 20, stone: 10 }
        }
      );
      
      expect(component.type).toBe(BuildingType.TOWER_FLOOR);
      expect(component.roomType).toBe(RoomType.DEFENSE);
      expect(component.level).toBe(1);
      expect(component.stats.health).toBe(100);
      expect(component.stats.maxHealth).toBe(100);
    });
  });

  describe('Upgrade', () => {
    it('should upgrade building and increase stats', () => {
      const component = new BuildingComponent(
        BuildingType.TOWER_FLOOR,
        RoomType.DEFENSE,
        1,
        {
          health: 100,
          maxHealth: 100,
          defense: 10,
          cost: { wood: 20, stone: 10 }
        }
      );
      
      const initialHealth = component.stats.health;
      const initialDefense = component.stats.defense;
      
      component.upgrade();
      
      expect(component.level).toBe(2);
      expect(component.stats.health).toBeGreaterThan(initialHealth);
      expect(component.stats.defense).toBeGreaterThan(initialDefense);
    });
  });

  describe('Damage', () => {
    it('should take damage and reduce health', () => {
      const component = new BuildingComponent(
        BuildingType.TOWER_FLOOR,
        RoomType.DEFENSE,
        1,
        {
          health: 100,
          maxHealth: 100,
          defense: 10,
          cost: { wood: 20, stone: 10 }
        }
      );
      
      component.takeDamage(20);
      
      expect(component.stats.health).toBe(80);
      expect(component.isDestroyed()).toBe(false);
    });

    it('should be destroyed when health reaches zero', () => {
      const component = new BuildingComponent(
        BuildingType.TOWER_FLOOR,
        RoomType.DEFENSE,
        1,
        {
          health: 50,
          maxHealth: 50,
          defense: 10,
          cost: { wood: 20, stone: 10 }
        }
      );
      
      component.takeDamage(50);
      
      expect(component.stats.health).toBe(0);
      expect(component.isDestroyed()).toBe(true);
    });

    it('should not go below zero health', () => {
      const component = new BuildingComponent(
        BuildingType.TOWER_FLOOR,
        RoomType.DEFENSE,
        1,
        {
          health: 10,
          maxHealth: 50,
          defense: 10,
          cost: { wood: 20, stone: 10 }
        }
      );
      
      component.takeDamage(100);
      
      expect(component.stats.health).toBe(0);
      expect(component.isDestroyed()).toBe(true);
    });
  });
});
