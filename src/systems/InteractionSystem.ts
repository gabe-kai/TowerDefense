/**
 * Interaction System - Handles player input (clicks, hover) on 3D objects
 */

import { Scene, PickingInfo, PointerEventTypes, Mesh, AbstractMesh, StandardMaterial, Color3, Animation, Vector3, HighlightLayer } from '@babylonjs/core';
import { Resource } from '../entities/Resource';
import { Tower } from '../entities/Tower';
import { Servant } from '../entities/Servant';
import { ServantSystem } from './ServantSystem';
import { ResourceSystem } from './ResourceSystem';
import { BuildingSystem } from './BuildingSystem';
import { InfoPanel, ObjectInfo, ActionButton } from '../ui/InfoPanel';
import { WorkQueue } from './WorkQueue';
import { createCategoryLogger } from '../utils/Logger';
import { SelectableObject } from './SelectableObject';

export class InteractionSystem {
  private scene: Scene;
  private servantSystem: ServantSystem;
  private resourceSystem: ResourceSystem;
  private buildingSystem: BuildingSystem | null = null;
  private infoPanel: InfoPanel;
  private workQueue: WorkQueue;
  private logger = createCategoryLogger('InteractionSystem');
  
  // Hover/Selection state
  private hoveredObject: { mesh: Mesh; type: string } | null = null;
  private selectedObject: { mesh: Mesh; type: string } | null = null;
  private highlightLayer: HighlightLayer | null = null;
  
  // Click feedback
  private clickFeedbackMeshes: Mesh[] = [];

  constructor(
    scene: Scene,
    servantSystem: ServantSystem,
    resourceSystem: ResourceSystem,
    buildingSystem?: BuildingSystem
  ) {
    this.scene = scene;
    this.servantSystem = servantSystem;
    this.resourceSystem = resourceSystem;
    this.buildingSystem = buildingSystem || null;
    this.infoPanel = new InfoPanel();
    this.workQueue = WorkQueue.getInstance();
    
    this.setupHighlightLayer();
    this.setupEventListeners();
    
    this.logger.info('InteractionSystem initialized');
  }

  /**
   * Setup highlight layer for perimeter highlighting
   */
  private setupHighlightLayer(): void {
    this.highlightLayer = new HighlightLayer('highlightLayer', this.scene, {
      blurHorizontalSize: 1.5, // Slight blur for glow effect
      blurVerticalSize: 1.5,
      alphaBlendingMode: 2 // Additive blending for glow effect
    });
  }

  /**
   * Setup mouse event listeners
   */
  private setupEventListeners(): void {
    // Handle pointer move for hover - use manual raycasting
    this.scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
        // Manually perform raycast for hover detection
        const pickInfo = this.scene.pick(
          pointerInfo.event.offsetX,
          pointerInfo.event.offsetY
        );
        if (pickInfo && pickInfo.hit) {
          this.handlePointerMove(pickInfo);
        } else {
          this.clearHover();
        }
      } else if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
        if (pointerInfo.event.button === 0) { // Left click
          // Manually perform raycast for click detection (more reliable)
          const pickInfo = this.scene.pick(
            pointerInfo.event.offsetX,
            pointerInfo.event.offsetY
          );
          this.handlePointerClick(pickInfo || { hit: false } as PickingInfo);
        }
      }
    });
  }

  /**
   * Handle pointer move (hover detection)
   */
  private handlePointerMove(pickInfo: PickingInfo): void {
    if (!pickInfo.hit || !pickInfo.pickedMesh) {
      this.clearHover();
      return;
    }

    const hitMesh = pickInfo.pickedMesh;
    
    if (!this.isMesh(hitMesh)) {
      this.clearHover();
      return;
    }

    // Check if hovering over a selectable object
    const selectable = this.getSelectableObject(hitMesh);
    
    if (selectable && selectable.isSelectable()) {
      // Only highlight if not already hovering this object
      if (!this.hoveredObject || this.hoveredObject.mesh !== hitMesh) {
        this.clearHover();
        this.setHover(hitMesh);
      }
    } else {
      // Not hovering over a selectable object
      this.clearHover();
    }
  }

  /**
   * Handle pointer click
   */
  private handlePointerClick(pickInfo: PickingInfo): void {
    // If clicking on empty space or non-mesh, clear selection
    if (!pickInfo.hit || !pickInfo.pickedMesh || !this.isMesh(pickInfo.pickedMesh)) {
      this.clearSelected();
      this.infoPanel.hide();
      return;
    }

    const hitMesh = pickInfo.pickedMesh;
    const selectable = this.getSelectableObject(hitMesh);
    
    if (selectable && selectable.isSelectable()) {
      // Clear previous selection first (if different object)
      if (this.selectedObject && this.selectedObject.mesh !== hitMesh) {
        this.clearSelected();
      }
      
      // Set selected object
      this.setSelected(hitMesh);
      
      // Show info panel
      const objectInfo = selectable.getObjectInfo();
      
      // Add "Add to Work Queue" button for resources
      if (hitMesh.metadata && hitMesh.metadata.resource) {
        const resource = hitMesh.metadata.resource as Resource;
        if (!resource.isCollected()) {
          objectInfo.actions = [{
            label: 'Add to Work Queue',
            onClick: () => {
              this.workQueue.addTask('collect', resource);
              this.infoPanel.hide(); // Hide panel after adding to queue
              this.clearSelected(); // Clear selection after action
              this.logger.info('Resource added to work queue', { resourceType: resource.getType() });
            },
            disabled: false // Can be dynamically set based on game state
          }];
        }
      }

      this.infoPanel.show(objectInfo);
    } else {
      // Clicked on non-selectable object, clear selection and hide panel
      this.clearSelected();
      this.infoPanel.hide();
    }
  }

  /**
   * Check if object is a Mesh (works in both runtime and test environments)
   */
  private isMesh(obj: AbstractMesh | null): obj is Mesh {
    if (!obj) return false;
    // Check for Mesh-specific properties
    return 'material' in obj && 'position' in obj && 'metadata' in obj;
  }

  /**
   * Handle resource click - command servant to collect
   */
  private handleResourceClick(resource: Resource, clickPosition: Vector3 | null): void {
    const resourcePosition = resource.getPosition();
    
    // Command nearest available servant to collect
    const success = this.servantSystem.commandNearestServantToCollect(
      resourcePosition,
      resource,
      'player'
    );

    if (success) {
      this.logger.info('Resource click - servant commanded', {
        resourceType: resource.getType(),
        position: resourcePosition
      });
      
      // Visual feedback is handled by the green selection glow
    } else {
      this.logger.warn('Resource click - no available servant', {
        resourceType: resource.getType(),
        position: resourcePosition
      });
    }
  }

  /**
   * Get selectable object from mesh metadata
   */
  private getSelectableObject(mesh: Mesh): { getName: () => string; getObjectInfo: () => ObjectInfo; isSelectable: () => boolean } | null {
    if (!mesh.metadata) {
      return null;
    }

    // Check for resource
    if (mesh.metadata.resource) {
      const resource = mesh.metadata.resource as Resource;
      if (resource.isCollected()) {
        return null;
      }
      return {
        getName: () => this.getResourceName(resource),
        getObjectInfo: () => this.getResourceInfo(resource),
        isSelectable: () => !resource.isCollected()
      };
    }

    // Check for tower (via selectable metadata)
    if (mesh.metadata.selectable) {
      const selectable = mesh.metadata.selectable as SelectableObject;
      if (typeof selectable.isSelectable === 'function' && typeof selectable.getName === 'function' && typeof selectable.getObjectInfo === 'function') {
        return selectable;
      }
    }

    // Check for tower (legacy support)
    if (mesh.metadata.tower) {
      const tower = mesh.metadata.tower as Tower;
      return {
        getName: () => this.getTowerName(tower),
        getObjectInfo: () => this.getTowerInfo(tower),
        isSelectable: () => true
      };
    }

    // Check for house
    if (mesh.metadata.house) {
      const house = mesh.metadata.house as SelectableObject;
      if (typeof house.isSelectable === 'function' && typeof house.getName === 'function' && typeof house.getObjectInfo === 'function') {
        return house;
      }
    }

    // Check for servant
    if (mesh.metadata.servant) {
      const servant = mesh.metadata.servant as Servant;
      return {
        getName: () => this.getServantName(servant),
        getObjectInfo: () => this.getServantInfo(servant),
        isSelectable: () => true
      };
    }

    // Check for building/ground structure
    if (mesh.metadata.building) {
      return {
        getName: () => mesh.name || 'Building',
        getObjectInfo: () => this.getBuildingInfo(mesh),
        isSelectable: () => true
      };
    }

    return null;
  }

  /**
   * Set hover state on mesh (yellow/orange glow)
   */
  private setHover(mesh: Mesh): void {
    if (!this.highlightLayer) {
      this.logger.warn('HighlightLayer not initialized');
      return;
    }

    // Don't hover if already hovering this mesh or if it's selected
    if ((this.hoveredObject && this.hoveredObject.mesh === mesh) || 
        (this.selectedObject && this.selectedObject.mesh === mesh)) {
      return;
    }

    this.hoveredObject = { mesh, type: 'unknown' };
    
    // Add yellow/orange glow for hover
    const yellowGlow = new Color3(1, 0.8, 0); // Bright yellow-orange
    this.highlightLayer.addMesh(mesh, yellowGlow);
  }

  /**
   * Clear hover state
   */
  private clearHover(): void {
    if (this.hoveredObject && this.highlightLayer) {
      const mesh = this.hoveredObject.mesh;
      
      // Only remove if not selected (selected objects keep their white outline)
      if (!this.selectedObject || this.selectedObject.mesh !== mesh) {
        this.highlightLayer.removeMesh(mesh);
      }
      
      this.hoveredObject = null;
    }
  }

  /**
   * Set selected state on mesh (white glow - visible but not too bright)
   */
  private setSelected(mesh: Mesh): void {
    if (!this.highlightLayer) {
      return;
    }

    // Clear previous selection
    this.clearSelected();

    this.selectedObject = { mesh, type: 'unknown' };
    
    // Add white glow for selection - brighter than dim green but not full intensity
    const whiteGlow = new Color3(0.7, 0.7, 0.7); // Bright white, but not full intensity
    this.highlightLayer.addMesh(mesh, whiteGlow);
  }

  /**
   * Clear selected state
   */
  private clearSelected(): void {
    if (this.selectedObject && this.highlightLayer) {
      const mesh = this.selectedObject.mesh;
      this.highlightLayer.removeMesh(mesh);
      this.selectedObject = null;
    }
  }

  /**
   * Create visual feedback for click
   */
  private createClickFeedback(position: Vector3): void {
    try {
      // Create a larger, more visible sphere that pulses and fades
      const feedbackMesh = Mesh.CreateSphere('clickFeedback', 16, 1.0, this.scene);
      if (!feedbackMesh) {
        this.logger.warn('Failed to create click feedback mesh');
        return;
      }
      
      // Position slightly above ground for visibility
      feedbackMesh.position = position.clone();
      feedbackMesh.position.y += 0.5; // Raise it slightly
      feedbackMesh.scaling = new Vector3(1.0, 1.0, 1.0);
      
      // Create bright, visible material for feedback
      const feedbackMaterial = new StandardMaterial('clickFeedbackMaterial', this.scene);
      feedbackMaterial.emissiveColor = new Color3(0, 1, 0); // Bright green
      feedbackMaterial.diffuseColor = new Color3(0, 0.8, 0); // Green
      feedbackMaterial.alpha = 0.9;
      feedbackMesh.material = feedbackMaterial;
      
      // Ensure mesh is properly initialized and added to scene
      feedbackMesh.setEnabled(true);
      feedbackMesh.renderingGroupId = 1; // Ensure it renders on top
      
      // Animate: scale up and fade out using Babylon.js animations
      const scaleAnimation = new Animation(
        'clickFeedbackScale',
        'scaling',
        30, // frames per second
        Animation.ANIMATIONTYPE_VECTOR3,
        Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      
      // Keyframes: scale from 1.0 to 3.0 (larger for visibility)
      const scaleKeys = [
        { frame: 0, value: new Vector3(1.0, 1.0, 1.0) },
        { frame: 30, value: new Vector3(3.0, 3.0, 3.0) }
      ];
      
      scaleAnimation.setKeys(scaleKeys);
      feedbackMesh.animations.push(scaleAnimation);
      
      // Store reference before starting animation
      this.clickFeedbackMeshes.push(feedbackMesh);
      
      // Manually animate alpha fade using a simple timer
      let alpha = 0.9;
      const fadeInterval = setInterval(() => {
        alpha -= 0.02; // Slower fade for visibility
        if (feedbackMaterial && alpha > 0) {
          feedbackMaterial.alpha = Math.max(0, alpha);
        } else {
          clearInterval(fadeInterval);
        }
      }, 16); // ~60fps
      
      // Start scale animation
      const animatable = this.scene.beginAnimation(feedbackMesh, 0, 30, false, 1, () => {
        // Cleanup when animation completes
        clearInterval(fadeInterval);
        if (feedbackMesh && !feedbackMesh.isDisposed()) {
          feedbackMesh.dispose();
        }
        if (feedbackMaterial) {
          feedbackMaterial.dispose();
        }
        const index = this.clickFeedbackMeshes.indexOf(feedbackMesh);
        if (index > -1) {
          this.clickFeedbackMeshes.splice(index, 1);
        }
      });
      
      // If animation failed to start, clean up
      if (!animatable) {
        clearInterval(fadeInterval);
        if (feedbackMesh && !feedbackMesh.isDisposed()) {
          feedbackMesh.dispose();
        }
        if (feedbackMaterial) {
          feedbackMaterial.dispose();
        }
        const index = this.clickFeedbackMeshes.indexOf(feedbackMesh);
        if (index > -1) {
          this.clickFeedbackMeshes.splice(index, 1);
        }
      }
    } catch (error) {
      this.logger.warn('Error creating click feedback', { error });
    }
  }

  /**
   * Get resource name
   */
  private getResourceName(resource: Resource): string {
    const typeNames: Record<string, string> = {
      wood: 'Wood Resource',
      stone: 'Stone Resource',
      gold: 'Gold Deposit',
      crystal: 'Crystal Node',
      essence: 'Essence Well',
      mana: 'Mana Spring'
    };
    return typeNames[resource.getType()] || 'Resource';
  }

  /**
   * Get resource info
   */
  private getResourceInfo(resource: Resource): ObjectInfo {
    const actions: ActionButton[] = [];
    
    // Add "Add to Work Queue" button for uncollected resources
    if (!resource.isCollected()) {
      actions.push({
        label: 'Add to Work Queue',
        onClick: () => {
          this.workQueue.addTask('collect', resource);
          this.logger.info('Resource added to work queue', {
            resourceType: resource.getType(),
            amount: resource.getAmount()
          });
          // Update the info panel to show it was added
          this.infoPanel.show(this.getResourceInfo(resource));
        }
      });
    }

    return {
      name: this.getResourceName(resource),
      type: 'Resource',
      details: {
        type: resource.getType(),
        amount: resource.getAmount(),
        collected: resource.isCollected() ? 'Yes' : 'No'
      },
      actions
    };
  }

  /**
   * Get tower name
   */
  private getTowerName(tower: Tower): string {
    return tower.getOwner() === 'player' ? 'Your Tower' : 'AI Tower';
  }

  /**
   * Get tower info
   */
  private getTowerInfo(tower: Tower): ObjectInfo {
    const floors = tower.getFloors();
    return {
      name: this.getTowerName(tower),
      type: 'Tower',
      details: {
        owner: tower.getOwner(),
        height: tower.getHeight(),
        floors: floors.length,
        totalHealth: tower.getTotalHealth(),
        destroyed: tower.isDestroyed() ? 'Yes' : 'No'
      }
    };
  }

  /**
   * Get servant name
   */
  private getServantName(servant: Servant): string {
    return servant.getMesh().name || 'Servant';
  }

  /**
   * Get servant info
   */
  private getServantInfo(servant: Servant): ObjectInfo {
    const state = servant.getState();
    const carrying = servant.getCarryingResource() !== null;
    return {
      name: this.getServantName(servant),
      type: 'Servant',
      details: {
        state: state,
        carryingResource: carrying ? 'Yes' : 'No',
        commandsQueued: servant.getCommandQueue().length
      }
    };
  }

  /**
   * Get building info
   */
  private getBuildingInfo(mesh: Mesh): ObjectInfo {
    const component = mesh.metadata?.component;
    const buildingType = mesh.metadata?.buildingType || 'Unknown';
    
    const details: Record<string, string | number> = {
      type: buildingType
    };

    if (component) {
      details.health = component.stats?.health || 0;
      details.defense = component.stats?.defense || 0;
      if (component.stats?.attack) {
        details.attack = component.stats.attack;
      }
      if (component.stats?.range) {
        details.range = component.stats.range;
      }
    }

    return {
      name: mesh.name || 'Building',
      type: 'Building',
      details
    };
  }

  /**
   * Update interaction system (called each frame)
   */
  update(): void {
    // Cleanup any expired click feedback meshes
    this.clickFeedbackMeshes = this.clickFeedbackMeshes.filter(mesh => {
      if (mesh.isDisposed()) {
        return false;
      }
      return true;
    });
  }

  /**
   * Dispose and cleanup
   */
  dispose(): void {
    this.logger.debug('Disposing InteractionSystem');
    
    this.clearHover();
    this.clearSelected();
    
    // Dispose all click feedback meshes
    this.clickFeedbackMeshes.forEach(mesh => {
      if (!mesh.isDisposed()) {
        mesh.dispose();
      }
    });
    this.clickFeedbackMeshes = [];
    
    // Dispose highlight layer
    if (this.highlightLayer) {
      this.highlightLayer.dispose();
      this.highlightLayer = null;
    }
    
    this.logger.info('InteractionSystem disposed');
  }
}
