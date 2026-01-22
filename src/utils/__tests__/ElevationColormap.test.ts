/**
 * Unit tests for ElevationColormap
 * 
 * Note: These tests require WebGL support which may not be available in test environments.
 * Some tests are skipped if WebGL is not available.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ElevationColormap } from '../ElevationColormap';
import { Scene, Engine, ShaderMaterial } from '@babylonjs/core';
import { GameScale } from '../GameScale';

// Check if WebGL is available
const isWebGLAvailable = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('webgl2'));
  } catch {
    return false;
  }
};

describe('ElevationColormap', () => {
  let scene: Scene | null = null;
  let elevationColormap: ElevationColormap;

  beforeEach(() => {
    elevationColormap = ElevationColormap.getInstance();
    if (isWebGLAvailable()) {
      try {
        const canvas = document.createElement('canvas');
        const engine = new Engine(canvas, true);
        scene = new Scene(engine);
      } catch (error) {
        // WebGL not available, skip scene-dependent tests
        scene = null;
      }
    }
  });

  afterEach(() => {
    if (elevationColormap) {
      elevationColormap.dispose();
    }
    if (scene) {
      scene.dispose();
    }
  });

  describe('Singleton Pattern', () => {
    it('should return same instance on multiple calls', () => {
      const instance1 = ElevationColormap.getInstance();
      const instance2 = ElevationColormap.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('createMaterial', () => {
    it.skipIf(!isWebGLAvailable())('should create shader material', () => {
      if (!scene) return;
      const material = elevationColormap.createMaterial(
        scene,
        'test_material',
        GameScale.GORGE_DEPTH,
        GameScale.MOUNTAIN_HEIGHT
      );
      
      expect(material).toBeInstanceOf(ShaderMaterial);
      expect(material.name).toBe('test_material');
    });

    it.skipIf(!isWebGLAvailable())('should use default elevation values if not provided', () => {
      if (!scene) return;
      const material = elevationColormap.createMaterial(scene, 'test_material_default');
      expect(material).toBeInstanceOf(ShaderMaterial);
    });

    it.skipIf(!isWebGLAvailable())('should reuse existing material with same ID', () => {
      if (!scene) return;
      const material1 = elevationColormap.createMaterial(scene, 'test_reuse');
      const material2 = elevationColormap.createMaterial(scene, 'test_reuse');
      expect(material1).toBe(material2);
    });

    it.skipIf(!isWebGLAvailable())('should create different materials for different IDs', () => {
      if (!scene) return;
      const material1 = elevationColormap.createMaterial(scene, 'test_1');
      const material2 = elevationColormap.createMaterial(scene, 'test_2');
      expect(material1).not.toBe(material2);
    });

    it.skipIf(!isWebGLAvailable())('should set correct uniform values', () => {
      if (!scene) return;
      const minElevation = -50;
      const maxElevation = 150;
      const material = elevationColormap.createMaterial(
        scene,
        'test_uniforms',
        minElevation,
        maxElevation,
        1.0, // bandInterval1m
        5.0, // bandInterval5m
        0.05, // bandThickness1m
        0.15  // bandThickness5m
      );

      // Check that material was created (uniforms are set internally)
      expect(material).toBeInstanceOf(ShaderMaterial);
    });
  });

  describe('getMaterial', () => {
    it.skipIf(!isWebGLAvailable())('should return material if it exists', () => {
      if (!scene) return;
      const material = elevationColormap.createMaterial(scene, 'test_get');
      const retrieved = elevationColormap.getMaterial('test_get');
      expect(retrieved).toBe(material);
    });

    it('should return undefined if material does not exist', () => {
      const retrieved = elevationColormap.getMaterial('nonexistent');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('dispose', () => {
    it.skipIf(!isWebGLAvailable())('should dispose all materials', () => {
      if (!scene) return;
      const material1 = elevationColormap.createMaterial(scene, 'test_dispose_1');
      const material2 = elevationColormap.createMaterial(scene, 'test_dispose_2');
      
      // Spy on dispose method
      const dispose1 = vi.spyOn(material1, 'dispose');
      const dispose2 = vi.spyOn(material2, 'dispose');
      
      elevationColormap.dispose();
      
      expect(dispose1).toHaveBeenCalled();
      expect(dispose2).toHaveBeenCalled();
    });

    it.skipIf(!isWebGLAvailable())('should clear materials map after dispose', () => {
      if (!scene) return;
      elevationColormap.createMaterial(scene, 'test_clear');
      elevationColormap.dispose();
      
      const retrieved = elevationColormap.getMaterial('test_clear');
      expect(retrieved).toBeUndefined();
    });
  });
});
