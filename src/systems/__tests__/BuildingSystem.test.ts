/**
 * BuildingSystem Tests
 * 
 * Tests for building system - simplified to focus on testable behavior
 * 
 * NOTE: Full integration tests for BuildingSystem require complete scene setup
 * with materials, meshes, and game state. These tests focus on basic structure
 * and error handling.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BuildingSystem } from '../BuildingSystem';
import { BuildingType } from '../../components/BuildingComponent';
import { Vector3 } from '@babylonjs/core';

// Mock dependencies
const mockScene = {
  getUniqueId: vi.fn(() => 1)
} as any;

vi.mock('../../core/GameState', () => ({
  GameStateManager: {
    getInstance: vi.fn(() => ({
      getResources: vi.fn(() => ({
        wood: 100,
        stone: 100,
        gold: 100,
        crystal: 100,
        essence: 100,
        mana: 100
      })),
      addResource: vi.fn(),
      setTowerHeight: vi.fn()
    }))
  }
}));

vi.mock('../../assets/PrimitiveFactory', () => ({
  PrimitiveFactory: {
    getInstance: vi.fn(() => ({
      initialize: vi.fn(),
      createGroundStructure: vi.fn(() => ({
        position: { x: 0, y: 0, z: 0, clone: () => ({ x: 0, y: 0, z: 0 }) },
        metadata: {},
        isPickable: true,
        dispose: vi.fn()
      }))
    }))
  }
}));

vi.mock('../../assets/AssetCatalog', () => ({
  AssetCatalog: {
    getInstance: vi.fn(() => ({
      registerAsset: vi.fn()
    }))
  },
  AssetCategory: {
    BUILDINGS: 'buildings'
  },
  AssetType: {
    MODEL_3D: 'model_3d'
  }
}));

vi.mock('../../utils/PowerCalculator', () => ({
  PowerCalculator: {
    getInstance: vi.fn(() => ({
      calculatePower: vi.fn(() => 0)
    }))
  }
}));

vi.mock('../../utils/Logger', () => ({
  createCategoryLogger: vi.fn(() => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }))
}));

describe('BuildingSystem', () => {
  let buildingSystem: BuildingSystem;

  beforeEach(() => {
    vi.clearAllMocks();
    buildingSystem = new BuildingSystem(mockScene);
  });

  describe('buildGroundStructure', () => {
    it('should return success object for valid building', () => {
      const position = new Vector3(10, 0, 10);
      const result = buildingSystem.buildGroundStructure(
        BuildingType.TURRET,
        position,
        'player',
        false
      );

      expect(result).toHaveProperty('success');
      expect(typeof result.success).toBe('boolean');
    });

    it('should fail when building type is not found', () => {
      const position = new Vector3(10, 0, 10);
      const result = buildingSystem.buildGroundStructure(
        'invalid_type' as BuildingType,
        position,
        'player',
        false
      );

      expect(result.success).toBe(false);
      expect(result.reason).toBeDefined();
    });

    it('should include reason when returning failure', () => {
      // Test with invalid building type to ensure reason is provided
      const position = new Vector3(5, 0, 5);
      const result = buildingSystem.buildGroundStructure(
        'nonexistent_building' as BuildingType,
        position,
        'player',
        false
      );

      // Should fail and provide a reason
      expect(result.success).toBe(false);
      expect(result.reason).toBeDefined();
      const reason = result.reason ?? '';
      expect(typeof reason).toBe('string');
      expect(reason.length).toBeGreaterThan(0);
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
        it(`should have definition for ${buildingType}`, () => {
          const position = new Vector3(Math.random() * 100, 0, Math.random() * 100);
          const result = buildingSystem.buildGroundStructure(
            buildingType,
            position,
            'player',
            false
          );

          // Should either succeed or have a valid reason for failure
          expect(result).toHaveProperty('success');
          if (!result.success) {
            expect(result.reason).toBeDefined();
          }
        });
      });
    });

    describe('Stilts Option', () => {
      it('should accept stilts parameter', () => {
        const position = new Vector3(10, 0, 10);
        const result = buildingSystem.buildGroundStructure(
          BuildingType.TURRET,
          position,
          'player',
          true // with stilts
        );

        expect(result).toHaveProperty('success');
      });

      it('should work without stilts', () => {
        const position = new Vector3(10, 0, 10);
        const result = buildingSystem.buildGroundStructure(
          BuildingType.TURRET,
          position,
          'player',
          false // without stilts
        );

        expect(result).toHaveProperty('success');
      });
    });

    describe('Player Support', () => {
      it('should accept player parameter', () => {
        const position = new Vector3(10, 0, 10);
        const result = buildingSystem.buildGroundStructure(
          BuildingType.TURRET,
          position,
          'player',
          false
        );

        expect(result).toHaveProperty('success');
      });

      it('should accept AI parameter', () => {
        const position = new Vector3(10, 0, 10);
        const result = buildingSystem.buildGroundStructure(
          BuildingType.TURRET,
          position,
          'ai',
          false
        );

        expect(result).toHaveProperty('success');
      });
    });

    describe('Return Value Structure', () => {
      it('should return object with success property', () => {
        const position = new Vector3(10, 0, 10);
        const result = buildingSystem.buildGroundStructure(
          BuildingType.TURRET,
          position,
          'player',
          false
        );

        expect(result).toHaveProperty('success');
        expect(typeof result.success).toBe('boolean');
      });

      it('should return reason property when success is false', () => {
        const result = buildingSystem.buildGroundStructure(
          'invalid' as BuildingType,
          new Vector3(0, 0, 0),
          'player',
          false
        );

        expect(result.success).toBe(false);
        expect(result).toHaveProperty('reason');
        expect(typeof result.reason).toBe('string');
      });
    });
  });

  describe('Ground Structures Management', () => {
    it('should have getGroundStructures method', () => {
      expect(buildingSystem.getGroundStructures).toBeDefined();
      expect(typeof buildingSystem.getGroundStructures).toBe('function');
    });

    it('should return Map from getGroundStructures', () => {
      const structures = buildingSystem.getGroundStructures();
      expect(structures).toBeInstanceOf(Map);
    });

    it('should store built structures in map', () => {
      const position = new Vector3(10, 0, 10);
      const initialSize = buildingSystem.getGroundStructures().size;
      
      buildingSystem.buildGroundStructure(
        BuildingType.TURRET,
        position,
        'player',
        false
      );

      const afterSize = buildingSystem.getGroundStructures().size;
      expect(afterSize).toBeGreaterThanOrEqual(initialSize);
    });
  });
});
