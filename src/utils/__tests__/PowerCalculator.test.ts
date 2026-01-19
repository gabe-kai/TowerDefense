/**
 * PowerCalculator Tests
 * 
 * Note: These tests require full game state setup.
 * Some tests are simplified to test calculation logic.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PowerCalculator } from '../PowerCalculator';
import { Tower } from '../../entities/Tower';
import { Vector3 } from '@babylonjs/core';

// Mock PrimitiveFactory
vi.mock('../../assets/PrimitiveFactory', () => ({
  PrimitiveFactory: {
    getInstance: vi.fn(() => ({
      initialize: vi.fn(),
      createTowerBase: vi.fn((name, position) => ({
        name,
        position: position || new Vector3(0, 0, 0),
        metadata: {},
        dispose: vi.fn()
      }))
    }))
  }
}));

describe('PowerCalculator', () => {
  let calculator: PowerCalculator;

  beforeEach(() => {
    calculator = PowerCalculator.getInstance();
  });

  describe('Power Level Calculation', () => {
    it('should calculate power level for player with tower', () => {
      const tower = new Tower(new Vector3(0, 0, 0), 'player');
      const power = calculator.calculatePowerLevel('player', tower);
      
      expect(power).toBeGreaterThan(0);
      expect(typeof power).toBe('number');
    });

    it('should calculate power level without tower', () => {
      const power = calculator.calculatePowerLevel('player', null);
      
      expect(power).toBeGreaterThanOrEqual(0);
      expect(typeof power).toBe('number');
    });

    it('should return a number for any valid input', () => {
      const tower = new Tower(new Vector3(0, 0, 0), 'player');
      const power = calculator.calculatePowerLevel('player', tower);
      
      expect(typeof power).toBe('number');
      expect(Number.isFinite(power)).toBe(true);
    });
  });

  describe('Power Level Comparison', () => {
    it('should compare power levels and return valid winner', () => {
      const tower1 = new Tower(new Vector3(0, 0, 0), 'player');
      const tower2 = new Tower(new Vector3(10, 0, 0), 'ai');
      
      const winner = calculator.comparePowerLevels(tower1, tower2);
      
      expect(['player', 'ai', 'tie']).toContain(winner);
    });

    it('should handle null towers in comparison', () => {
      const winner = calculator.comparePowerLevels(null, null);
      expect(['player', 'ai', 'tie']).toContain(winner);
    });
  });
});
