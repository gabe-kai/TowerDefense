/**
 * Seeded Random Number Generator
 * 
 * Provides deterministic random number generation based on a seed value.
 * Useful for generating consistent but varied terrain, tower positions, etc.
 * Same seed = same sequence of random numbers.
 */

import { createCategoryLogger } from './Logger';

/**
 * Seeded random number generator using a simple LCG (Linear Congruential Generator)
 * This ensures deterministic randomness - same seed produces same sequence
 */
export class SeededRandom {
  private seed: number;
  private logger = createCategoryLogger('SeededRandom');

  /**
   * Create a seeded random number generator
   * @param seed Seed value (integer). If not provided, uses current timestamp
   */
  constructor(seed?: number) {
    if (seed === undefined) {
      // Generate seed from timestamp (for unique runs)
      seed = Date.now();
    }
    this.seed = seed;
    this.logger.debug('SeededRandom initialized', { seed });
  }

  /**
   * Get the current seed value
   */
  getSeed(): number {
    return this.seed;
  }

  /**
   * Set a new seed value
   */
  setSeed(seed: number): void {
    this.seed = seed;
    this.logger.debug('Seed updated', { seed });
  }

  /**
   * Generate next random number in sequence (0 to 1)
   * Uses Linear Congruential Generator algorithm
   */
  next(): number {
    // LCG parameters (same as used in many game engines)
    // a = 1664525, c = 1013904223, m = 2^32
    this.seed = (this.seed * 1664525 + 1013904223) % 0x100000000;
    return (this.seed >>> 0) / 0x100000000; // Convert to 0-1 range
  }

  /**
   * Generate random integer between min (inclusive) and max (exclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * Generate random number between min (inclusive) and max (exclusive)
   */
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Generate random number with normal distribution (Gaussian)
   * Uses Box-Muller transform
   */
  nextGaussian(mean: number = 0, stdDev: number = 1): number {
    // Box-Muller transform requires two random numbers
    const u1 = this.next();
    const u2 = this.next();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  }

  /**
   * Generate random boolean
   */
  nextBoolean(): boolean {
    return this.next() >= 0.5;
  }

  /**
   * Pick random element from array
   */
  pick<T>(array: T[]): T {
    return array[this.nextInt(0, array.length)];
  }

  /**
   * Shuffle array in place (Fisher-Yates algorithm)
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Generate a hash-based seed from a string
   * Useful for creating consistent seeds from game session IDs, etc.
   */
  static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}
