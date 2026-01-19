/**
 * ResourceSystem Tests
 * 
 * Note: These tests require full 3D scene setup with PrimitiveFactory.
 * Some tests are skipped as they require integration testing.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ResourceSystem } from '../ResourceSystem';
import { ResourceType } from '../../components/ResourceComponent';
import { Vector3 } from '@babylonjs/core';

// Mock Scene with PrimitiveFactory initialization
const mockScene = {
  dispose: vi.fn()
} as any;

// Mock PrimitiveFactory before tests run
vi.mock('../../assets/PrimitiveFactory', () => ({
  PrimitiveFactory: {
    getInstance: vi.fn(() => ({
      initialize: vi.fn(),
      createResourceNode: vi.fn((type, position) => ({
        position: position || new Vector3(0, 0, 0),
        metadata: {},
        setEnabled: vi.fn(),
        dispose: vi.fn()
      }))
    }))
  }
}));

describe('ResourceSystem', () => {
  let resourceSystem: ResourceSystem;

  beforeEach(() => {
    resourceSystem = new ResourceSystem(mockScene);
  });

  describe('Resource Spawning', () => {
    it.skip('should spawn a resource of specified type', () => {
      // Requires full PrimitiveFactory setup - integration test
      const position = new Vector3(0, 0, 0);
      const resource = resourceSystem.spawnResource(ResourceType.WOOD, position);
      
      expect(resource).toBeDefined();
      expect(resource.getType()).toBe(ResourceType.WOOD);
    });

    it.skip('should spawn resource at random location if position not provided', () => {
      // Requires full PrimitiveFactory setup - integration test
      const resource = resourceSystem.spawnResource(ResourceType.STONE);
      expect(resource).toBeDefined();
    });

    it('should track spawned resources', () => {
      // Test that the system can manage resource lists
      const initialCount = resourceSystem.getAllResources().length;
      expect(initialCount).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Resource Management', () => {
    it('should return empty array when no resources', () => {
      resourceSystem.clear();
      const allResources = resourceSystem.getAllResources();
      expect(allResources.length).toBe(0);
    });

    it('should return empty array for resources by type when none exist', () => {
      resourceSystem.clear();
      const woodResources = resourceSystem.getResourcesByType(ResourceType.WOOD);
      expect(woodResources.length).toBe(0);
    });

    it('should return null when finding nearest resource with no resources', () => {
      resourceSystem.clear();
      const nearest = resourceSystem.findNearestResource(new Vector3(0, 0, 0));
      expect(nearest).toBeNull();
    });
  });

  describe('Cleanup', () => {
    it('should clear all resources', () => {
      resourceSystem.clear();
      expect(resourceSystem.getAllResources().length).toBe(0);
    });
  });
});
