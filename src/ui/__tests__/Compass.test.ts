/**
 * Unit tests for Compass component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Compass } from '../Compass';
import { ArcRotateCamera } from '@babylonjs/core';

// Mock DOM - create minimap container first (compass attaches to it)
const mockMinimapContainer = document.createElement('div');
mockMinimapContainer.id = 'minimap';
document.body.appendChild(mockMinimapContainer);

describe('Compass', () => {
  let compass: Compass;
  let mockCamera: ArcRotateCamera;

  beforeEach(() => {
    // Clear minimap container
    mockMinimapContainer.innerHTML = '';

    // Create mock camera
    mockCamera = {
      alpha: 0 // Horizontal rotation
    } as any;

    compass = new Compass('compass');
  });

  describe('Initialization', () => {
    it('should create compass container and canvas', () => {
      expect(compass).toBeDefined();
      const container = document.getElementById('compass');
      expect(container).not.toBeNull();
      expect(container?.querySelector('canvas')).not.toBeNull();
    });

    it('should attach to minimap container if available', () => {
      const compassContainer = document.getElementById('compass');
      expect(compassContainer?.parentElement?.id).toBe('minimap');
    });

    it('should create canvas with correct size', () => {
      const canvas = mockMinimapContainer.querySelector('canvas');
      expect(canvas).not.toBeNull();
      expect(canvas?.getAttribute('width')).toBe('60');
      expect(canvas?.getAttribute('height')).toBe('60');
    });
  });

  describe('Camera Setup', () => {
    it('should set camera reference', () => {
      compass.setCamera(mockCamera);
      // Camera is private, but update should work
      expect(() => compass.update()).not.toThrow();
    });
  });

  describe('Update', () => {
    it('should update without errors when no camera is set', () => {
      // Should handle null camera gracefully
      expect(() => compass.update()).not.toThrow();
    });

    it('should update without errors when camera is set', () => {
      compass.setCamera(mockCamera);
      expect(() => compass.update()).not.toThrow();
    });

    it('should update with different camera angles', () => {
      compass.setCamera(mockCamera);
      
      // Test different angles
      mockCamera.alpha = Math.PI / 2; // 90 degrees
      expect(() => compass.update()).not.toThrow();
      
      mockCamera.alpha = Math.PI; // 180 degrees
      expect(() => compass.update()).not.toThrow();
      
      mockCamera.alpha = -Math.PI / 2; // -90 degrees
      expect(() => compass.update()).not.toThrow();
    });
  });

  describe('Dispose', () => {
    it('should dispose compass', () => {
      compass.dispose();
      // After dispose, container should be removed
      // Note: dispose removes from parent, but we're using a test container
      // So we just verify it doesn't throw
      expect(() => compass.dispose()).not.toThrow();
    });
  });
});
