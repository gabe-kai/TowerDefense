/**
 * BuildingValidator Tests
 * 
 * Comprehensive tests for building placement validation logic
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BuildingValidator } from '../BuildingValidator';
import { BuildingType } from '../../components/BuildingComponent';
import { Vector3 } from '@babylonjs/core';

describe('BuildingValidator', () => {
  describe('validatePlacement', () => {
    it('should allow placement with no existing buildings', () => {
      const position = new Vector3(10, 0, 10);
      const result = BuildingValidator.validatePlacement(
        position,
        BuildingType.TURRET,
        [],
        undefined
      );

      expect(result.valid).toBe(true);
    });

    it('should reject placement too close to existing building', () => {
      const position = new Vector3(5, 0, 5);
      const existingBuildings = [
        new Vector3(6, 0, 6) // Less than 2m away (distance ~1.41m)
      ];

      const result = BuildingValidator.validatePlacement(
        position,
        BuildingType.TURRET,
        existingBuildings,
        undefined
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Too close to another building');
    });

    it('should allow placement far enough from existing building', () => {
      const position = new Vector3(0, 0, 0);
      const existingBuildings = [
        new Vector3(3, 0, 3) // More than 2m away (distance ~4.24m)
      ];

      const result = BuildingValidator.validatePlacement(
        position,
        BuildingType.TURRET,
        existingBuildings,
        undefined
      );

      expect(result.valid).toBe(true);
    });

    it('should check distance to all existing buildings', () => {
      const position = new Vector3(5, 0, 5);
      const existingBuildings = [
        new Vector3(10, 0, 10), // Far away
        new Vector3(6, 0, 6)    // Too close
      ];

      const result = BuildingValidator.validatePlacement(
        position,
        BuildingType.TURRET,
        existingBuildings,
        undefined
      );

      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Too close to another building');
    });

    it('should allow placement exactly at minimum distance', () => {
      const position = new Vector3(0, 0, 0);
      const existingBuildings = [
        new Vector3(2, 0, 0) // Exactly 2m away
      ];

      const result = BuildingValidator.validatePlacement(
        position,
        BuildingType.TURRET,
        existingBuildings,
        undefined
      );

      expect(result.valid).toBe(true);
    });

    describe('Tower Floor Validation', () => {
      it('should require tower position for tower floor', () => {
        const position = new Vector3(0, 5, 0);
        const result = BuildingValidator.validatePlacement(
          position,
          BuildingType.TOWER_FLOOR,
          [],
          undefined // No tower position
        );

        expect(result.valid).toBe(false);
        expect(result.reason).toBe('Tower floor must be attached to tower');
      });

      it('should allow tower floor directly above tower', () => {
        const towerPosition = new Vector3(0, 0, 0);
        const floorPosition = new Vector3(0, 3, 0); // Directly above (only Y differs)

        const result = BuildingValidator.validatePlacement(
          floorPosition,
          BuildingType.TOWER_FLOOR,
          [],
          towerPosition
        );

        expect(result.valid).toBe(true);
      });

      it('should reject tower floor too far from tower', () => {
        const towerPosition = new Vector3(0, 0, 0);
        const floorPosition = new Vector3(2, 3, 0); // Too far horizontally

        const result = BuildingValidator.validatePlacement(
          floorPosition,
          BuildingType.TOWER_FLOOR,
          [],
          towerPosition
        );

        expect(result.valid).toBe(false);
        expect(result.reason).toBe('Tower floor must be directly above tower');
      });

      it('should allow tower floor within 1.5m horizontal distance', () => {
        const towerPosition = new Vector3(0, 0, 0);
        const floorPosition = new Vector3(1, 3, 0); // Within 1.5m

        const result = BuildingValidator.validatePlacement(
          floorPosition,
          BuildingType.TOWER_FLOOR,
          [],
          towerPosition
        );

        expect(result.valid).toBe(true);
      });
    });

    describe('All Building Types', () => {
      const buildingTypes = [
        BuildingType.TURRET,
        BuildingType.CANNON,
        BuildingType.WALL,
        BuildingType.BARRIER,
        BuildingType.STORAGE,
        BuildingType.WORKSHOP,
        BuildingType.BARRACKS,
        BuildingType.LIBRARY,
        BuildingType.SPELL_TOWER
      ];

      buildingTypes.forEach(buildingType => {
        it(`should validate ${buildingType} placement`, () => {
          const position = new Vector3(10, 0, 10);
          const result = BuildingValidator.validatePlacement(
            position,
            buildingType,
            [],
            undefined
          );

          expect(result.valid).toBe(true);
        });
      });
    });

    describe('Edge Cases', () => {
      it('should handle zero position', () => {
        const position = new Vector3(0, 0, 0);
        const result = BuildingValidator.validatePlacement(
          position,
          BuildingType.TURRET,
          [],
          undefined
        );

        expect(result.valid).toBe(true);
      });

      it('should handle negative positions', () => {
        const position = new Vector3(-10, -5, -10);
        const result = BuildingValidator.validatePlacement(
          position,
          BuildingType.TURRET,
          [],
          undefined
        );

        expect(result.valid).toBe(true);
      });

      it('should handle very large distances', () => {
        const position = new Vector3(1000, 0, 1000);
        const existingBuildings = [
          new Vector3(0, 0, 0)
        ];

        const result = BuildingValidator.validatePlacement(
          position,
          BuildingType.TURRET,
          existingBuildings,
          undefined
        );

        expect(result.valid).toBe(true);
      });

      it('should handle many existing buildings', () => {
        const position = new Vector3(10, 0, 10);
        // Create buildings far enough away (at least 2m)
        const existingBuildings = Array.from({ length: 100 }, (_, i) => 
          new Vector3(i * 5 + 20, 0, i * 5 + 20) // All at least 14m away
        );

        const result = BuildingValidator.validatePlacement(
          position,
          BuildingType.TURRET,
          existingBuildings,
          undefined
        );

        // Should check all buildings
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('isInBuildableArea', () => {
    it('should allow placement when no bounds specified', () => {
      const position = new Vector3(10, 0, 10);
      const result = BuildingValidator.isInBuildableArea(position);

      expect(result).toBe(true);
    });

    it('should allow placement within bounds', () => {
      const position = new Vector3(5, 0, 5);
      const bounds = {
        minX: 0,
        maxX: 10,
        minZ: 0,
        maxZ: 10
      };

      const result = BuildingValidator.isInBuildableArea(position, bounds);

      expect(result).toBe(true);
    });

    it('should reject placement outside bounds', () => {
      const position = new Vector3(15, 0, 5);
      const bounds = {
        minX: 0,
        maxX: 10,
        minZ: 0,
        maxZ: 10
      };

      const result = BuildingValidator.isInBuildableArea(position, bounds);

      expect(result).toBe(false);
    });

    it('should allow placement on boundary edges', () => {
      const position = new Vector3(10, 0, 10);
      const bounds = {
        minX: 0,
        maxX: 10,
        minZ: 0,
        maxZ: 10
      };

      const result = BuildingValidator.isInBuildableArea(position, bounds);

      expect(result).toBe(true);
    });

    it('should reject placement outside min boundary', () => {
      const position = new Vector3(-1, 0, 5);
      const bounds = {
        minX: 0,
        maxX: 10,
        minZ: 0,
        maxZ: 10
      };

      const result = BuildingValidator.isInBuildableArea(position, bounds);

      expect(result).toBe(false);
    });

    it('should handle negative bounds', () => {
      const position = new Vector3(-5, 0, -5);
      const bounds = {
        minX: -10,
        maxX: 0,
        minZ: -10,
        maxZ: 0
      };

      const result = BuildingValidator.isInBuildableArea(position, bounds);

      expect(result).toBe(true);
    });
  });
});
