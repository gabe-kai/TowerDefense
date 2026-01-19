/**
 * Test setup file
 * Runs before all tests
 */

import { vi } from 'vitest';

// Mock Babylon.js for unit tests
// This allows testing game logic without requiring WebGL/3D rendering

// Create mock Vector3 class
class MockVector3 {
  x: number;
  y: number;
  z: number;
  
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  static Zero() {
    return new MockVector3(0, 0, 0);
  }
  
  clone() {
    return new MockVector3(this.x, this.y, this.z);
  }
  
  add(other: MockVector3) {
    return new MockVector3(this.x + other.x, this.y + other.y, this.z + other.z);
  }
  
  subtract(other: MockVector3) {
    return new MockVector3(this.x - other.x, this.y - other.y, this.z - other.z);
  }
  
  normalize() {
    const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    if (length === 0) return this;
    return new MockVector3(this.x / length, this.y / length, this.z / length);
  }
  
  scale(factor: number) {
    return new MockVector3(this.x * factor, this.y * factor, this.z * factor);
  }
  
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  
  lengthSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  
  addInPlace(other: MockVector3) {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }
  
  static Distance(a: MockVector3, b: MockVector3): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

class MockColor3 {
  r: number;
  g: number;
  b: number;
  
  constructor(r = 0, g = 0, b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

// Make Babylon available globally for tests
(global as any).Babylon = {
  Engine: vi.fn().mockImplementation(() => ({
    runRenderLoop: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn()
  })),
  Scene: vi.fn().mockImplementation(() => ({
    clearColor: {},
    activeCamera: null,
    dispose: vi.fn()
  })),
  ArcRotateCamera: vi.fn().mockImplementation(() => ({
    inputs: {
      attachElement: vi.fn()
    },
    lowerBetaLimit: 0,
    upperBetaLimit: Math.PI,
    lowerRadiusLimit: 0,
    upperRadiusLimit: 100
  })),
  HemisphericLight: vi.fn().mockImplementation(() => ({
    intensity: 0.8
  })),
  Vector3: MockVector3,
  Color3: MockColor3,
  Mesh: {
    CreateBox: vi.fn().mockImplementation(() => ({
      position: new MockVector3(0, 0, 0),
      scaling: { x: 1, y: 1, z: 1 },
      material: null,
      metadata: {},
      setEnabled: vi.fn(),
      setEnabledInHierarchy: vi.fn(),
      lookAt: vi.fn(),
      dispose: vi.fn()
    })),
    CreateSphere: vi.fn().mockImplementation(() => ({
      position: new MockVector3(0, 0, 0),
      scaling: { x: 1, y: 1, z: 1 },
      material: null,
      metadata: {},
      setEnabled: vi.fn(),
      lookAt: vi.fn(),
      dispose: vi.fn()
    })),
    CreateCylinder: vi.fn().mockImplementation(() => ({
      position: new MockVector3(0, 0, 0),
      scaling: { x: 1, y: 1, z: 1 },
      material: null,
      metadata: {},
      setEnabled: vi.fn(),
      lookAt: vi.fn(),
      dispose: vi.fn()
    })),
    CreateGround: vi.fn().mockImplementation(() => ({
      position: new MockVector3(0, 0, 0),
      material: null,
      metadata: {},
      dispose: vi.fn()
    }))
  },
  StandardMaterial: vi.fn().mockImplementation(() => ({
    diffuseColor: new MockColor3(1, 1, 1),
    emissiveColor: new MockColor3(0, 0, 0),
    roughness: 0.5,
    metallic: 0.0,
    dispose: vi.fn()
  }))
};
