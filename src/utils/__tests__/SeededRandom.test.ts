/**
 * Unit tests for SeededRandom
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SeededRandom } from '../SeededRandom';

describe('SeededRandom', () => {
  describe('Initialization', () => {
    it('should create SeededRandom with provided seed', () => {
      const random = new SeededRandom(12345);
      expect(random.getSeed()).toBe(12345);
    });

    it('should create SeededRandom with timestamp if no seed provided', () => {
      const before = Date.now();
      const random = new SeededRandom();
      const after = Date.now();
      const seed = random.getSeed();
      expect(seed).toBeGreaterThanOrEqual(before);
      expect(seed).toBeLessThanOrEqual(after);
    });

    it('should allow setting seed', () => {
      const random = new SeededRandom(100);
      random.setSeed(200);
      expect(random.getSeed()).toBe(200);
    });
  });

  describe('Deterministic Randomness', () => {
    it('should produce same sequence for same seed', () => {
      const random1 = new SeededRandom(12345);
      const random2 = new SeededRandom(12345);

      const values1: number[] = [];
      const values2: number[] = [];

      for (let i = 0; i < 10; i++) {
        values1.push(random1.next());
        values2.push(random2.next());
      }

      expect(values1).toEqual(values2);
    });

    it('should produce different sequences for different seeds', () => {
      const random1 = new SeededRandom(12345);
      const random2 = new SeededRandom(54321);

      const values1: number[] = [];
      const values2: number[] = [];

      for (let i = 0; i < 10; i++) {
        values1.push(random1.next());
        values2.push(random2.next());
      }

      expect(values1).not.toEqual(values2);
    });
  });

  describe('next', () => {
    it('should return values between 0 and 1', () => {
      const random = new SeededRandom(12345);
      for (let i = 0; i < 100; i++) {
        const value = random.next();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it('should produce different values on subsequent calls', () => {
      const random = new SeededRandom(12345);
      const values = new Set<number>();
      for (let i = 0; i < 100; i++) {
        values.add(random.next());
      }
      // Should have many unique values (not all the same)
      expect(values.size).toBeGreaterThan(50);
    });
  });

  describe('nextInt', () => {
    it('should return integers in specified range', () => {
      const random = new SeededRandom(12345);
      for (let i = 0; i < 100; i++) {
        const value = random.nextInt(0, 10);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(10);
        expect(Number.isInteger(value)).toBe(true);
      }
    });

    it('should handle negative ranges', () => {
      const random = new SeededRandom(12345);
      for (let i = 0; i < 100; i++) {
        const value = random.nextInt(-10, 10);
        expect(value).toBeGreaterThanOrEqual(-10);
        expect(value).toBeLessThan(10);
      }
    });

    it('should produce same sequence for same seed', () => {
      const random1 = new SeededRandom(12345);
      const random2 = new SeededRandom(12345);

      const values1: number[] = [];
      const values2: number[] = [];

      for (let i = 0; i < 10; i++) {
        values1.push(random1.nextInt(0, 100));
        values2.push(random2.nextInt(0, 100));
      }

      expect(values1).toEqual(values2);
    });
  });

  describe('nextFloat', () => {
    it('should return floats in specified range', () => {
      const random = new SeededRandom(12345);
      for (let i = 0; i < 100; i++) {
        const value = random.nextFloat(5, 10);
        expect(value).toBeGreaterThanOrEqual(5);
        expect(value).toBeLessThan(10);
      }
    });

    it('should handle negative ranges', () => {
      const random = new SeededRandom(12345);
      for (let i = 0; i < 100; i++) {
        const value = random.nextFloat(-5, 5);
        expect(value).toBeGreaterThanOrEqual(-5);
        expect(value).toBeLessThan(5);
      }
    });
  });

  describe('nextGaussian', () => {
    it('should return numbers with normal distribution', () => {
      const random = new SeededRandom(12345);
      const values: number[] = [];
      for (let i = 0; i < 1000; i++) {
        values.push(random.nextGaussian());
      }

      // Calculate mean (should be close to 0)
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      expect(mean).toBeCloseTo(0, 0);

      // Calculate standard deviation (should be close to 1)
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
      expect(stdDev).toBeCloseTo(1, 0);
    });

    it('should respect custom mean and stdDev', () => {
      const random = new SeededRandom(12345);
      const mean = 10;
      const stdDev = 2;
      const values: number[] = [];
      for (let i = 0; i < 1000; i++) {
        values.push(random.nextGaussian(mean, stdDev));
      }

      const calculatedMean = values.reduce((a, b) => a + b, 0) / values.length;
      expect(calculatedMean).toBeCloseTo(mean, 0);
    });
  });

  describe('nextBoolean', () => {
    it('should return boolean values', () => {
      const random = new SeededRandom(12345);
      for (let i = 0; i < 100; i++) {
        const value = random.nextBoolean();
        expect(typeof value).toBe('boolean');
      }
    });

    it('should produce roughly 50/50 distribution', () => {
      const random = new SeededRandom(12345);
      let trueCount = 0;
      for (let i = 0; i < 1000; i++) {
        if (random.nextBoolean()) trueCount++;
      }
      // Should be roughly 50% (within 10% tolerance)
      expect(trueCount).toBeGreaterThan(400);
      expect(trueCount).toBeLessThan(600);
    });
  });

  describe('pick', () => {
    it('should pick element from array', () => {
      const random = new SeededRandom(12345);
      const array = [1, 2, 3, 4, 5];
      const picked = random.pick(array);
      expect(array).toContain(picked);
    });

    it('should produce same pick for same seed', () => {
      const random1 = new SeededRandom(12345);
      const random2 = new SeededRandom(12345);
      const array = [1, 2, 3, 4, 5];

      const picked1 = random1.pick(array);
      const picked2 = random2.pick(array);
      expect(picked1).toBe(picked2);
    });
  });

  describe('shuffle', () => {
    it('should shuffle array', () => {
      const random = new SeededRandom(12345);
      const array = [1, 2, 3, 4, 5];
      const shuffled = random.shuffle(array);
      
      expect(shuffled).toHaveLength(array.length);
      expect(shuffled.sort()).toEqual(array.sort());
    });

    it('should not modify original array', () => {
      const random = new SeededRandom(12345);
      const array = [1, 2, 3, 4, 5];
      const original = [...array];
      random.shuffle(array);
      expect(array).toEqual(original);
    });

    it('should produce same shuffle for same seed', () => {
      const random1 = new SeededRandom(12345);
      const random2 = new SeededRandom(12345);
      const array = [1, 2, 3, 4, 5];

      const shuffled1 = random1.shuffle(array);
      const shuffled2 = random2.shuffle(array);
      expect(shuffled1).toEqual(shuffled2);
    });
  });

  describe('hashString', () => {
    it('should produce consistent hash for same string', () => {
      const hash1 = SeededRandom.hashString('test');
      const hash2 = SeededRandom.hashString('test');
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different strings', () => {
      const hash1 = SeededRandom.hashString('test1');
      const hash2 = SeededRandom.hashString('test2');
      expect(hash1).not.toBe(hash2);
    });

    it('should always return positive number', () => {
      const hash = SeededRandom.hashString('test');
      expect(hash).toBeGreaterThanOrEqual(0);
    });

    it('should handle empty string', () => {
      const hash = SeededRandom.hashString('');
      expect(hash).toBeGreaterThanOrEqual(0);
    });

    it('should handle special characters', () => {
      const hash1 = SeededRandom.hashString('test!@#$%');
      const hash2 = SeededRandom.hashString('test!@#$%');
      expect(hash1).toBe(hash2);
    });
  });
});
