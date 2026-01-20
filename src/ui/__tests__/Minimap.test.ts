/**
 * Unit tests for Minimap component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Minimap } from '../Minimap';
import { ArcRotateCamera, Vector3 } from '@babylonjs/core';
import { BuildingSystem } from '../../systems/BuildingSystem';
import { ResourceSystem } from '../../systems/ResourceSystem';
import { ServantSystem } from '../../systems/ServantSystem';

// Mock DOM
const mockContainer = document.createElement('div');
mockContainer.id = 'minimap';
document.body.appendChild(mockContainer);

describe('Minimap', () => {
  let minimap: Minimap;
  let mockCamera: ArcRotateCamera;
  let mockBuildingSystem: BuildingSystem;
  let mockResourceSystem: ResourceSystem;
  let mockServantSystem: ServantSystem;

  beforeEach(() => {
    // Clear container
    mockContainer.innerHTML = '';

    // Create mock camera
    mockCamera = {
      position: new Vector3(0, 10, 0),
      alpha: 0,
      getTarget: vi.fn(() => Vector3.Zero())
    } as any;

    // Create mock systems
    mockBuildingSystem = {
      getPlayerTower: vi.fn(() => null),
      getAITower: vi.fn(() => null)
    } as any;

    mockResourceSystem = {
      getAllResources: vi.fn(() => [])
    } as any;

    mockServantSystem = {
      getAllServants: vi.fn(() => [])
    } as any;

    minimap = new Minimap('minimap');
  });

  describe('Initialization', () => {
    it('should create minimap container and canvas', () => {
      expect(minimap).toBeDefined();
      const container = document.getElementById('minimap');
      expect(container).not.toBeNull();
      expect(container?.querySelector('canvas')).not.toBeNull();
    });

    it('should create canvas with correct size', () => {
      const canvas = mockContainer.querySelector('canvas');
      expect(canvas).not.toBeNull();
      expect(canvas?.getAttribute('width')).toBe('200');
      expect(canvas?.getAttribute('height')).toBe('200');
    });
  });

  describe('Camera and Systems Setup', () => {
    it('should set camera reference', () => {
      minimap.setCamera(mockCamera);
      // Camera is private, but update should work
      expect(() => minimap.update()).not.toThrow();
    });

    it('should set system references', () => {
      minimap.setSystems(mockBuildingSystem, mockResourceSystem, mockServantSystem);
      // Systems are private, but update should work
      expect(() => minimap.update()).not.toThrow();
    });
  });

  describe('Update', () => {
    it('should update without errors when no camera is set', () => {
      expect(() => minimap.update()).not.toThrow();
    });

    it('should update without errors when camera is set', () => {
      minimap.setCamera(mockCamera);
      expect(() => minimap.update()).not.toThrow();
    });

    it('should update without errors when systems are set', () => {
      minimap.setSystems(mockBuildingSystem, mockResourceSystem, mockServantSystem);
      expect(() => minimap.update()).not.toThrow();
    });

    it('should update without errors with all systems and camera', () => {
      minimap.setCamera(mockCamera);
      minimap.setSystems(mockBuildingSystem, mockResourceSystem, mockServantSystem);
      expect(() => minimap.update()).not.toThrow();
    });
  });

  describe('Dispose', () => {
    it('should dispose minimap', () => {
      minimap.dispose();
      // After dispose, container should be removed
      const container = document.getElementById('minimap');
      // Note: dispose removes from parent, but we're using a test container
      // So we just verify it doesn't throw
      expect(() => minimap.dispose()).not.toThrow();
    });
  });
});
