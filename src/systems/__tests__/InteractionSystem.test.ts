/**
 * InteractionSystem Tests
 * 
 * Tests for player interaction system (clicks, hover)
 * Note: Some tests are skipped as they require full 3D scene setup with materials
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { InteractionSystem } from '../InteractionSystem';
import { Resource } from '../../entities/Resource';
import { ResourceType } from '../../components/ResourceComponent';
import { Vector3, PointerEventTypes } from '@babylonjs/core';

// Define mock objects before vi.mock calls
const mockWorkQueue = {
  addTask: vi.fn(),
  getAllTasks: vi.fn(() => [])
};

const mockInfoPanel = {
  show: vi.fn(),
  hide: vi.fn(),
  isPanelVisible: vi.fn(() => false)
};

const mockHighlightLayer = {
  addMesh: vi.fn(),
  removeMesh: vi.fn(),
  dispose: vi.fn()
};

// Mock WorkQueue singleton
vi.mock('../WorkQueue', () => ({
  WorkQueue: {
    getInstance: vi.fn(() => mockWorkQueue)
  }
}));

// Mock InfoPanel
vi.mock('../../ui/InfoPanel', () => ({
  InfoPanel: class {
    show = mockInfoPanel.show;
    hide = mockInfoPanel.hide;
    isPanelVisible = mockInfoPanel.isPanelVisible;
  }
}));

// Mock StandardMaterial, Color3, HighlightLayer, and Mesh to avoid full 3D setup
vi.mock('@babylonjs/core', async () => {
  const actual = await vi.importActual('@babylonjs/core');
  return {
    ...actual,
    HighlightLayer: class {
      addMesh = mockHighlightLayer.addMesh;
      removeMesh = mockHighlightLayer.removeMesh;
      dispose = mockHighlightLayer.dispose;
      constructor(name: string, scene: any, options?: any) {}
    },
    StandardMaterial: class {
      name: string;
      emissiveColor: any;
      diffuseColor: any;
      alpha: number;
      animations: any[];
      
      constructor(name: string, scene: any) {
        this.name = name;
        this.emissiveColor = { r: 0, g: 0, b: 0 };
        this.diffuseColor = { r: 0, g: 0, b: 0 };
        this.alpha = 1.0;
        this.animations = [];
      }
      
      dispose = vi.fn();
    },
    Color3: class {
      r: number;
      g: number;
      b: number;
      
      constructor(r = 0, g = 0, b = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
      }
    },
    Mesh: {
      CreateSphere: vi.fn((name: string, segments: number, diameter: number, scene: any) => ({
        name,
        position: new Vector3(0, 0, 0),
        scaling: { x: 1, y: 1, z: 1, setAll: vi.fn() },
        material: null,
        animations: [],
        dispose: vi.fn(),
        isDisposed: vi.fn(() => false)
      }))
    },
    Animation: class {
      name: string;
      property: string;
      framePerSecond: number;
      dataType: string;
      loopMode: string;
      keys: any[];
      
      constructor(name: string, property: string, fps: number, dataType: string, loopMode: string) {
        this.name = name;
        this.property = property;
        this.framePerSecond = fps;
        this.dataType = dataType;
        this.loopMode = loopMode;
        this.keys = [];
      }
      
      setKeys = vi.fn();
    }
  };
});

// Mock dependencies
const mockScene = {
  onPointerObservable: {
    add: vi.fn()
  },
  pick: vi.fn(),
  beginAnimation: vi.fn(),
  dispose: vi.fn()
} as any;

const mockServantSystem = {
  commandNearestServantToCollect: vi.fn()
} as any;

const mockResourceSystem = {
  getAllResources: vi.fn(() => [])
} as any;

// Mock Resource
const createMockResource = (type: ResourceType = ResourceType.WOOD, collected: boolean = false): Resource => {
  const mockMesh = {
    position: new Vector3(0, 0, 0),
    material: null,
    metadata: { resource: null as Resource | null },
    setEnabled: vi.fn(),
    dispose: vi.fn(),
    name: `resource_${type}`
  } as any;

  const resource = {
    getMesh: () => mockMesh,
    getType: () => type,
    getPosition: () => new Vector3(0, 0, 0),
    isCollected: () => collected,
    getAmount: () => 1,
    getSelectableInfo: () => ({
      name: `${type} Resource`,
      type: 'Resource',
      details: { type, amount: 1, collected: collected ? 'Yes' : 'No' }
    })
  } as any;
  
  // Link resource to mesh metadata
  mockMesh.metadata.resource = resource;
  
  return resource;
};

describe('InteractionSystem', () => {
  let interactionSystem: InteractionSystem;
  let pointerObservableCallback: ((pointerInfo: any) => void) | null = null;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Capture the callback passed to onPointerObservable
    mockScene.onPointerObservable.add.mockImplementation((callback: any) => {
      pointerObservableCallback = callback;
    });

    interactionSystem = new InteractionSystem(
      mockScene,
      mockServantSystem,
      mockResourceSystem
    );
  });

  afterEach(() => {
    if (interactionSystem) {
      interactionSystem.dispose();
    }
  });

  describe('Initialization', () => {
    it('should initialize with scene and systems', () => {
      expect(interactionSystem).toBeDefined();
      expect(mockScene.onPointerObservable.add).toHaveBeenCalled();
    });

    it('should setup event listeners', () => {
      expect(pointerObservableCallback).not.toBeNull();
    });
  });

  describe('Pointer Click', () => {
    it('should handle click on resource and show info panel with work queue button', () => {
      const resource = createMockResource();
      const mockMesh = resource.getMesh();
      
      // Mock scene.pick to return the resource mesh
      mockScene.pick.mockReturnValue({
        hit: true,
        pickedMesh: mockMesh,
        pickedPoint: new Vector3(0, 0, 0)
      });
      
      if (pointerObservableCallback) {
        pointerObservableCallback({
          type: PointerEventTypes.POINTERDOWN,
          event: { button: 0, offsetX: 100, offsetY: 100 } // Left click
        });
      }

      // Should show info panel with action button (work queue is added when button is clicked)
      expect(mockInfoPanel.show).toHaveBeenCalled();
      // Verify info panel was called with object info that includes actions
      const showCall = mockInfoPanel.show.mock.calls[0];
      expect(showCall[0].actions).toBeDefined();
      expect(showCall[0].actions.length).toBe(1);
      expect(showCall[0].actions[0].label).toBe('Add to Work Queue');
      
      // Work queue is NOT added on click, only when action button is clicked
      expect(mockWorkQueue.addTask).not.toHaveBeenCalled();
    });

    it('should not handle right click', () => {
      const resource = createMockResource();
      const mockMesh = resource.getMesh();
      
      mockScene.pick.mockReturnValue({
        hit: true,
        pickedMesh: mockMesh
      });
      
      if (pointerObservableCallback) {
        pointerObservableCallback({
          type: PointerEventTypes.POINTERDOWN,
          event: { button: 2, offsetX: 100, offsetY: 100 } // Right click
        });
      }

      expect(mockWorkQueue.addTask).not.toHaveBeenCalled();
    });

    it('should clear selection when clicking empty space', () => {
      // First, set a selected object so we can test clearing it
      const resource = createMockResource();
      const mockMesh = resource.getMesh();
      
      // Set up a selected object first
      mockScene.pick.mockReturnValueOnce({
        hit: true,
        pickedMesh: mockMesh,
        pickedPoint: new Vector3(0, 0, 0)
      });
      
      if (pointerObservableCallback) {
        pointerObservableCallback({
          type: PointerEventTypes.POINTERDOWN,
          event: { button: 0, offsetX: 100, offsetY: 100 }
        });
      }
      
      // Clear mocks
      vi.clearAllMocks();
      
      // Now click empty space
      mockScene.pick.mockReturnValue({
        hit: false,
        pickedMesh: null
      });
      
      if (pointerObservableCallback) {
        pointerObservableCallback({
          type: PointerEventTypes.POINTERDOWN,
          event: { button: 0, offsetX: 200, offsetY: 200 }
        });
      }

      expect(mockWorkQueue.addTask).not.toHaveBeenCalled();
      expect(mockInfoPanel.hide).toHaveBeenCalled();
      // Selection should be cleared (highlight removed) if there was a selection
      expect(mockHighlightLayer.removeMesh).toHaveBeenCalled();
    });

    it('should not handle click on collected resource', () => {
      const resource = createMockResource(ResourceType.WOOD, true); // collected
      const mockMesh = resource.getMesh();
      
      mockScene.pick.mockReturnValue({
        hit: true,
        pickedMesh: mockMesh,
        pickedPoint: new Vector3(0, 0, 0)
      });
      
      if (pointerObservableCallback) {
        pointerObservableCallback({
          type: PointerEventTypes.POINTERDOWN,
          event: { button: 0, offsetX: 100, offsetY: 100 }
        });
      }

      // Should not add to work queue for collected resource
      expect(mockWorkQueue.addTask).not.toHaveBeenCalled();
    });

    it('should show info panel with work queue button even if no servant available', () => {
      const resource = createMockResource();
      const mockMesh = resource.getMesh();
      
      mockScene.pick.mockReturnValue({
        hit: true,
        pickedMesh: mockMesh,
        pickedPoint: new Vector3(0, 0, 0)
      });
      
      if (pointerObservableCallback) {
        pointerObservableCallback({
          type: PointerEventTypes.POINTERDOWN,
          event: { button: 0, offsetX: 100, offsetY: 100 }
        });
      }

      // Should show info panel with action button (work queue is added when button is clicked)
      expect(mockInfoPanel.show).toHaveBeenCalled();
      // Work queue is NOT added on click, only when action button is clicked
      expect(mockWorkQueue.addTask).not.toHaveBeenCalled();
    });
  });

  describe('Hover Highlighting', () => {
    it('should apply hover glow when hovering over selectable object', () => {
      const resource = createMockResource();
      const mockMesh = resource.getMesh();
      
      mockScene.pick.mockReturnValue({
        hit: true,
        pickedMesh: mockMesh
      });
      
      if (pointerObservableCallback) {
        pointerObservableCallback({
          type: PointerEventTypes.POINTERMOVE,
          event: { offsetX: 100, offsetY: 100 }
        });
      }

      // Should apply hover glow
      expect(mockHighlightLayer.addMesh).toHaveBeenCalled();
    });

    it('should clear hover glow when moving away from object', () => {
      const resource = createMockResource();
      const mockMesh = resource.getMesh();
      
      // First, hover over an object to set hoveredObject
      mockScene.pick.mockReturnValueOnce({
        hit: true,
        pickedMesh: mockMesh
      });
      
      if (pointerObservableCallback) {
        pointerObservableCallback({
          type: PointerEventTypes.POINTERMOVE,
          event: { offsetX: 100, offsetY: 100 }
        });
      }
      
      // Clear mocks
      vi.clearAllMocks();
      
      // Now move away from object
      mockScene.pick.mockReturnValue({
        hit: false,
        pickedMesh: null
      });
      
      if (pointerObservableCallback) {
        pointerObservableCallback({
          type: PointerEventTypes.POINTERMOVE,
          event: { offsetX: 200, offsetY: 200 }
        });
      }

      // Should clear hover glow if there was a hovered object
      expect(mockHighlightLayer.removeMesh).toHaveBeenCalled();
    });
  });

  describe('Update', () => {
    it('should update without errors', () => {
      expect(() => interactionSystem.update()).not.toThrow();
    });
  });

  describe('Disposal', () => {
    it('should dispose resources properly', () => {
      expect(() => interactionSystem.dispose()).not.toThrow();
      expect(mockHighlightLayer.dispose).toHaveBeenCalled();
    });
  });

  describe('Info Panel', () => {
    it('should show info panel when object is clicked', () => {
      const resource = createMockResource();
      const mockMesh = resource.getMesh();
      
      mockScene.pick.mockReturnValue({
        hit: true,
        pickedMesh: mockMesh,
        pickedPoint: new Vector3(0, 0, 0)
      });
      
      if (pointerObservableCallback) {
        pointerObservableCallback({
          type: PointerEventTypes.POINTERDOWN,
          event: { button: 0, offsetX: 100, offsetY: 100 }
        });
      }

      // Info panel should be shown with action button
      expect(mockInfoPanel.show).toHaveBeenCalled();
      const showCall = mockInfoPanel.show.mock.calls[0];
      expect(showCall[0].actions).toBeDefined();
      // Work queue is added when action button is clicked, not on resource click
      expect(mockWorkQueue.addTask).not.toHaveBeenCalled();
    });
    
    it('should add to work queue when action button is clicked', () => {
      const resource = createMockResource();
      const mockMesh = resource.getMesh();
      
      mockScene.pick.mockReturnValue({
        hit: true,
        pickedMesh: mockMesh,
        pickedPoint: new Vector3(0, 0, 0)
      });
      
      if (pointerObservableCallback) {
        pointerObservableCallback({
          type: PointerEventTypes.POINTERDOWN,
          event: { button: 0, offsetX: 100, offsetY: 100 }
        });
      }

      // Get the action button onClick handler
      const showCall = mockInfoPanel.show.mock.calls[0];
      const actionButton = showCall[0].actions[0];
      
      // Simulate clicking the action button
      actionButton.onClick();
      
      // Now work queue should be called
      expect(mockWorkQueue.addTask).toHaveBeenCalledWith('collect', resource);
      expect(mockInfoPanel.hide).toHaveBeenCalled();
    });

    it('should hide info panel when clicking non-selectable object', () => {
      mockScene.pick.mockReturnValue({
        hit: true,
        pickedMesh: { metadata: {} } as any, // No selectable metadata
        pickedPoint: new Vector3(0, 0, 0)
      });
      
      if (pointerObservableCallback) {
        pointerObservableCallback({
          type: PointerEventTypes.POINTERDOWN,
          event: { button: 0, offsetX: 100, offsetY: 100 }
        });
      }

      // Should hide panel and clear selection for non-selectable object
      expect(mockInfoPanel.hide).toHaveBeenCalled();
      expect(mockWorkQueue.addTask).not.toHaveBeenCalled();
    });
  });

  describe('Selectable Object Detection', () => {
    it('should detect resources as selectable', () => {
      const resource = createMockResource();
      const mockMesh = resource.getMesh();
      
      const selectable = (interactionSystem as any).getSelectableObject(mockMesh);
      
      expect(selectable).not.toBeNull();
      expect(selectable.isSelectable()).toBe(true);
      expect(selectable.getName()).toContain('Resource');
    });

    it('should not detect collected resources as selectable', () => {
      const resource = createMockResource(ResourceType.WOOD, true); // collected
      const mockMesh = resource.getMesh();
      
      const selectable = (interactionSystem as any).getSelectableObject(mockMesh);
      
      expect(selectable).toBeNull();
    });

    it('should return null for non-selectable meshes', () => {
      const mockMesh = {
        metadata: {}
      } as any;
      
      const selectable = (interactionSystem as any).getSelectableObject(mockMesh);
      
      expect(selectable).toBeNull();
    });
  });
});
