/**
 * Unit tests for TerrainManager
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TerrainManager } from '../TerrainManager';
import { GroundMesh, Vector3 } from '@babylonjs/core';
import { Scene } from '@babylonjs/core';

describe('TerrainManager', () => {
  let mockGroundMesh: GroundMesh;
  let terrainManager: TerrainManager;

  beforeEach(() => {
    // Create a mock GroundMesh
    // Note: In a real test, we'd need a proper Babylon.js scene setup
    // For unit tests, we'll mock the essential methods
    // We need to make it pass the instanceof check, so we'll create a proper mock class
    class MockGroundMesh {
      name = 'test_terrain';
      getHeightAtCoordinates = vi.fn((x: number, z: number) => {
        // Simple mock: return height based on distance from center
        return Math.sqrt(x * x + z * z) * 0.1;
      });
      getNormalAtCoordinates = vi.fn((x: number, z: number) => {
        // Mock normal: mostly vertical with slight tilt
        const distance = Math.sqrt(x * x + z * z);
        if (distance < 0.001) {
          return new Vector3(0, 1, 0); // Vertical at center
        }
        // Slight tilt away from center
        return new Vector3(x / distance * 0.1, 0.995, z / distance * 0.1).normalize();
      });
      getBoundingInfo = vi.fn(() => ({
        boundingBox: {
          minimumWorld: new Vector3(-1500, -50, -1500),
          maximumWorld: new Vector3(1500, 150, 1500),
          extendSize: new Vector3(1500, 100, 1500)
        }
      }));
    }

    // Make it pass instanceof check by setting prototype
    Object.setPrototypeOf(MockGroundMesh.prototype, GroundMesh.prototype);
    mockGroundMesh = new MockGroundMesh() as any as GroundMesh;

    terrainManager = new TerrainManager(mockGroundMesh);
  });

  describe('Initialization', () => {
    it('should create TerrainManager with valid GroundMesh', () => {
      expect(terrainManager).toBeDefined();
    });

    it('should throw error if not given GroundMesh', () => {
      expect(() => {
        new TerrainManager({} as GroundMesh);
      }).toThrow('TerrainManager requires a GroundMesh instance');
    });
  });

  describe('getHeightAt', () => {
    it('should return height at coordinates', () => {
      const height = terrainManager.getHeightAt(10, 20);
      expect(height).toBeGreaterThanOrEqual(0);
      expect(mockGroundMesh.getHeightAtCoordinates).toHaveBeenCalledWith(10, 20);
    });

    it('should return 0 on error', () => {
      (mockGroundMesh.getHeightAtCoordinates as any).mockImplementationOnce(() => {
        throw new Error('Test error');
      });
      const height = terrainManager.getHeightAt(0, 0);
      expect(height).toBe(0);
    });

    it('should handle different coordinate ranges', () => {
      const testCases = [
        { x: 0, z: 0 },
        { x: 100, z: 100 },
        { x: -100, z: -100 },
        { x: 1000, z: 1000 }
      ];

      testCases.forEach(({ x, z }) => {
        const height = terrainManager.getHeightAt(x, z);
        expect(typeof height).toBe('number');
        expect(mockGroundMesh.getHeightAtCoordinates).toHaveBeenCalledWith(x, z);
      });
    });
  });

  describe('getNormalAt', () => {
    it('should return normal vector at coordinates', () => {
      const normal = terrainManager.getNormalAt(10, 20);
      expect(normal).toBeInstanceOf(Vector3);
      expect(mockGroundMesh.getNormalAtCoordinates).toHaveBeenCalledWith(10, 20);
    });

    it('should return vertical normal on error', () => {
      (mockGroundMesh.getNormalAtCoordinates as any).mockImplementationOnce(() => {
        throw new Error('Test error');
      });
      const normal = terrainManager.getNormalAt(0, 0);
      expect(normal).toEqual(new Vector3(0, 1, 0));
    });
  });

  describe('getSlopeAngle', () => {
    it('should return 0 for flat terrain', () => {
      (mockGroundMesh.getNormalAtCoordinates as any).mockReturnValueOnce(new Vector3(0, 1, 0));
      const slope = terrainManager.getSlopeAngle(0, 0);
      expect(slope).toBeCloseTo(0, 1);
    });

    it('should return angle for sloped terrain', () => {
      // 45 degree slope
      (mockGroundMesh.getNormalAtCoordinates as any).mockReturnValueOnce(
        new Vector3(0.707, 0.707, 0).normalize()
      );
      const slope = terrainManager.getSlopeAngle(10, 0);
      expect(slope).toBeGreaterThan(0);
      expect(slope).toBeLessThan(90);
    });

    it('should return 90 for vertical terrain', () => {
      (mockGroundMesh.getNormalAtCoordinates as any).mockReturnValueOnce(new Vector3(1, 0, 0));
      const slope = terrainManager.getSlopeAngle(0, 0);
      expect(slope).toBeCloseTo(90, 1);
    });
  });

  describe('isValidBuildLocation', () => {
    it('should return true for flat terrain', () => {
      (mockGroundMesh.getNormalAtCoordinates as any).mockReturnValue(new Vector3(0, 1, 0));
      const isValid = terrainManager.isValidBuildLocation(new Vector3(0, 0, 0));
      expect(isValid).toBe(true);
    });

    it('should return false for steep terrain', () => {
      // 45 degree slope (too steep for default 20° max)
      (mockGroundMesh.getNormalAtCoordinates as any).mockReturnValue(
        new Vector3(0.707, 0.707, 0).normalize()
      );
      const isValid = terrainManager.isValidBuildLocation(new Vector3(0, 0, 0));
      expect(isValid).toBe(false);
    });

    it('should respect custom maxSlope parameter', () => {
      // 30 degree slope
      (mockGroundMesh.getNormalAtCoordinates as any).mockReturnValue(
        new Vector3(0.5, 0.866, 0).normalize()
      );
      const isValid = terrainManager.isValidBuildLocation(new Vector3(0, 0, 0), 35);
      expect(isValid).toBe(true);
    });
  });

  describe('sampleHeights', () => {
    it('should sample heights for multiple positions', () => {
      const positions = [
        new Vector3(0, 0, 0),
        new Vector3(10, 0, 10),
        new Vector3(-10, 0, -10)
      ];

      const sampled = terrainManager.sampleHeights(positions);
      expect(sampled).toHaveLength(3);
      sampled.forEach((pos, i) => {
        expect(pos.x).toBe(positions[i].x);
        expect(pos.z).toBe(positions[i].z);
        expect(pos.y).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('isInBounds', () => {
    it('should return true for coordinates within bounds', () => {
      const inBounds = terrainManager.isInBounds(0, 0);
      expect(inBounds).toBe(true);
    });

    it('should return false for coordinates outside bounds', () => {
      const inBounds = terrainManager.isInBounds(2000, 2000);
      expect(inBounds).toBe(false);
    });

    it('should handle negative coordinates', () => {
      const inBounds = terrainManager.isInBounds(-2000, -2000);
      expect(inBounds).toBe(false);
    });
  });

  describe('getGroundMesh', () => {
    it('should return the ground mesh instance', () => {
      const mesh = terrainManager.getGroundMesh();
      expect(mesh).toBe(mockGroundMesh);
    });
  });
});
