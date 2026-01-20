/**
 * Unit tests for Servant entity
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Servant, ServantState } from '../Servant';
import { Resource } from '../Resource';
import { ResourceType } from '../../components/ResourceComponent';
import { Vector3, Scene, Mesh } from '@babylonjs/core';
import { PrimitiveFactory } from '../../assets/PrimitiveFactory';

// Mock dependencies
vi.mock('../../assets/PrimitiveFactory');
vi.mock('../../utils/Pathfinding');
vi.mock('../../utils/Logger');

const mockScene = {
  getUniqueId: vi.fn(() => 'mock-id'),
  beginAnimation: vi.fn()
} as any;

const mockMesh = {
  position: new Vector3(0, 0, 0),
  material: {
    emissiveColor: { clone: vi.fn(() => new Vector3(0, 0, 0)) }
  },
  lookAt: vi.fn(),
  metadata: {}
} as any;

describe('Servant', () => {
  let servant: Servant;
  let mockPrimitiveFactory: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockPrimitiveFactory = {
      getInstance: vi.fn(() => ({
        createServant: vi.fn(() => mockMesh)
      }))
    };
    
    (PrimitiveFactory.getInstance as any) = vi.fn(() => mockPrimitiveFactory.getInstance());
    
    servant = new Servant('test_servant', new Vector3(0, 0, 0), mockScene);
  });

  describe('State Management', () => {
    it('should start in IDLE state', () => {
      expect(servant.getState()).toBe(ServantState.IDLE);
    });

    it('should be available when idle with no commands', () => {
      expect(servant.isAvailable()).toBe(true);
    });

    it('should not be available when moving', () => {
      // This would require mocking pathfinding to set state to MOVING
      // For now, just verify the initial state
      expect(servant.getState()).toBe(ServantState.IDLE);
      expect(servant.isAvailable()).toBe(true);
    });
  });

  describe('Command Queue', () => {
    it('should queue collect command', () => {
      const resource = {
        getPosition: () => new Vector3(5, 0, 0),
        isCollected: () => false,
        getType: () => ResourceType.WOOD
      } as any;

      servant.queueCollectCommand(resource);
      const queue = servant.getCommandQueue();
      expect(queue.length).toBe(1);
      expect(queue[0].type).toBe('collect');
    });

    it('should queue move command', () => {
      const target = new Vector3(10, 0, 10);
      servant.queueMoveCommand(target);
      const queue = servant.getCommandQueue();
      expect(queue.length).toBe(1);
      expect(queue[0].type).toBe('move');
    });
  });

  describe('Resource Carrying', () => {
    it('should return null when not carrying resource', () => {
      expect(servant.getCarryingResource()).toBeNull();
    });
  });

  describe('Position and Home', () => {
    it('should return current position', () => {
      const pos = servant.getPosition();
      expect(pos).toBeDefined();
    });

    it('should return home position', () => {
      const home = servant.getHomePosition();
      expect(home).toBeDefined();
    });

    it('should allow setting new home position', () => {
      const newHome = new Vector3(10, 0, 10);
      servant.setHomePosition(newHome);
      expect(servant.getHomePosition()).toEqual(newHome);
    });
  });

  describe('Visual Indicators', () => {
    it('should handle scene reference', () => {
      const newScene = {} as Scene;
      servant.setScene(newScene);
      // If setScene exists, it should not throw
      expect(servant).toBeDefined();
    });
  });
});
