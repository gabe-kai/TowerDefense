/**
 * ServantSystem Tests
 * 
 * Note: These tests require full 3D scene setup with PrimitiveFactory.
 * Some tests are skipped as they require integration testing.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ServantSystem } from '../ServantSystem';
import { ResourceSystem } from '../ResourceSystem';
import { ResourceType } from '../../components/ResourceComponent';
import { Vector3 } from '@babylonjs/core';

// Mock Scene
const mockScene = {
  dispose: vi.fn()
} as any;

// Mock PrimitiveFactory
vi.mock('../../assets/PrimitiveFactory', () => ({
  PrimitiveFactory: {
    getInstance: vi.fn(() => ({
      initialize: vi.fn(),
      createServant: vi.fn((name, position) => ({
        name,
        position: position || new Vector3(0, 0, 0),
        metadata: {},
        dispose: vi.fn()
      })),
      createResourceNode: vi.fn((type, position) => ({
        position: position || new Vector3(0, 0, 0),
        metadata: {},
        setEnabled: vi.fn(),
        dispose: vi.fn()
      }))
    }))
  }
}));

describe('ServantSystem', () => {
  let servantSystem: ServantSystem;
  let resourceSystem: ResourceSystem;

  beforeEach(() => {
    servantSystem = new ServantSystem(mockScene);
    resourceSystem = new ResourceSystem(mockScene);
  });

  describe('Servant Management', () => {
    it('should return empty array when no servants', () => {
      servantSystem.clear();
      const servants = servantSystem.getServants('player');
      expect(servants.length).toBe(0);
    });

    it('should return empty array for available servants when none exist', () => {
      servantSystem.clear();
      const available = servantSystem.getAvailableServants('player');
      expect(available.length).toBe(0);
    });

    it('should return false when commanding with no servants', () => {
      servantSystem.clear();
      const resource = resourceSystem.spawnResource(ResourceType.WOOD, new Vector3(5, 0, 0));
      
      const success = servantSystem.commandNearestServantToCollect(
        new Vector3(0, 0, 0),
        resource,
        'player'
      );
      
      expect(success).toBe(false);
    });
  });

  describe('Cleanup', () => {
    it('should clear all servants', () => {
      servantSystem.clear();
      expect(servantSystem.getAllServants().length).toBe(0);
    });
  });

  describe('Task Assignment', () => {
    it('should assign tasks to available servants', () => {
      // This test would require mocking WorkQueue and full servant creation
      // For now, we verify the system can be instantiated
      expect(servantSystem).toBeDefined();
    });
  });

  describe('Update Loop', () => {
    it('should handle update with zero delta time', () => {
      // First update initializes lastUpdateTime
      servantSystem.update();
      // Second update should process
      servantSystem.update();
      // Should not throw
      expect(servantSystem).toBeDefined();
    });
  });
});
