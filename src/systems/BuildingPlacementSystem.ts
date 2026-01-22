/**
 * Building Placement System - Handles building placement preview and click-to-place
 */

import { Scene, Mesh, Vector3, StandardMaterial, Color3, PickingInfo, PointerEventTypes } from '@babylonjs/core';
import { BuildingType } from '../components/BuildingComponent';
import { BuildingSystem } from './BuildingSystem';
import { TerrainManager } from '../utils/TerrainManager';
import { BuildingValidator } from '../utils/BuildingValidator';
import { PrimitiveFactory } from '../assets/PrimitiveFactory';
import { createCategoryLogger } from '../utils/Logger';

export class BuildingPlacementSystem {
  private scene: Scene;
  private buildingSystem: BuildingSystem;
  private terrainManager: TerrainManager | null = null;
  private primitiveFactory: PrimitiveFactory;
  private logger = createCategoryLogger('BuildingPlacementSystem');

  // Placement state
  private isPlacing: boolean = false;
  private currentBuildingType: BuildingType | null = null;
  private previewMesh: Mesh | null = null;
  private previewMaterial: StandardMaterial | null = null;
  private validMaterial: StandardMaterial | null = null;
  private invalidMaterial: StandardMaterial | null = null;
  private currentPosition: Vector3 = Vector3.Zero();
  private currentValidationReason: string | null = null;
  private useStilts: boolean = false; // Option to use stilts/foundations for uneven terrain
  private onPlacementComplete: ((position: Vector3, useStilts?: boolean) => void) | null = null;
  private onPlacementCancel: (() => void) | null = null;
  
  // Tooltip UI
  private tooltipElement: HTMLDivElement | null = null;

  constructor(scene: Scene, buildingSystem: BuildingSystem, terrainManager?: TerrainManager) {
    this.scene = scene;
    this.buildingSystem = buildingSystem;
    this.terrainManager = terrainManager || null;
    this.primitiveFactory = PrimitiveFactory.getInstance();
    this.primitiveFactory.initialize(scene);
    
    this.setupMaterials();
    this.setupTooltip();
    this.setupEventListeners();
  }

  /**
   * Setup preview materials (semi-transparent, green for valid, red for invalid)
   */
  private setupMaterials(): void {
    // Valid placement material (green, semi-transparent)
    this.validMaterial = new StandardMaterial('placementValid', this.scene);
    this.validMaterial.diffuseColor = new Color3(0, 1, 0); // Green
    this.validMaterial.alpha = 0.5;
    this.validMaterial.emissiveColor = new Color3(0, 0.3, 0); // Subtle green glow

    // Invalid placement material (red, semi-transparent)
    this.invalidMaterial = new StandardMaterial('placementInvalid', this.scene);
    this.invalidMaterial.diffuseColor = new Color3(1, 0, 0); // Red
    this.invalidMaterial.alpha = 0.5;
    this.invalidMaterial.emissiveColor = new Color3(0.3, 0, 0); // Subtle red glow
  }

  /**
   * Setup tooltip element for showing placement validation feedback
   */
  private setupTooltip(): void {
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.className = 'placement-tooltip';
    this.tooltipElement.style.display = 'none';
    document.body.appendChild(this.tooltipElement);
  }

  /**
   * Setup event listeners for mouse movement and clicks
   */
  private setupEventListeners(): void {
    // Listen for keyboard events for stilts toggle
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if console is not visible/focused
      const activeElement = document.activeElement;
      const isInputFocused = activeElement instanceof HTMLInputElement || 
                           activeElement instanceof HTMLTextAreaElement;
      
      if (this.isPlacing && (e.key === 's' || e.key === 'S') && !isInputFocused) {
        e.preventDefault();
        e.stopPropagation();
        this.useStilts = !this.useStilts;
        
        // Recreate preview mesh with new stilts setting
        if (this.currentBuildingType && this.previewMesh) {
          const oldPosition = this.currentPosition.clone();
          const oldMesh = this.previewMesh;
          this.createPreviewMesh(this.currentBuildingType);
          if (oldMesh) {
            oldMesh.dispose();
          }
          // Restore position and re-validate
          this.previewMesh.position = oldPosition;
          const validation = this.validatePlacement(oldPosition);
          this.currentValidationReason = validation.reason || null;
          this.previewMesh.material = validation.valid ? this.validMaterial : this.invalidMaterial;
        }
        
        this.logger.info('Stilts toggled', { useStilts: this.useStilts });
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);

    this.scene.onPointerObservable.add((pointerInfo) => {
      if (!this.isPlacing) {
        this.hideTooltip();
        return;
      }

      if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
        this.updatePreviewPosition(pointerInfo.event.offsetX, pointerInfo.event.offsetY);
        this.updateTooltip(pointerInfo.event.offsetX, pointerInfo.event.offsetY);
      } else if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
        if (pointerInfo.event.button === 0) { // Left click
          this.handlePlacementClick(pointerInfo.event.offsetX, pointerInfo.event.offsetY);
        } else if (pointerInfo.event.button === 2) { // Right click
          this.cancelPlacement();
        }
      }
    });
  }

  /**
   * Start placement mode for a building type
   */
  startPlacement(
    buildingType: BuildingType,
    onComplete: (position: Vector3, useStilts?: boolean) => void,
    onCancel: () => void = () => {}
  ): void {
    if (this.isPlacing) {
      this.cancelPlacement();
    }

    this.isPlacing = true;
    this.currentBuildingType = buildingType;
    this.useStilts = false; // Reset stilts option when starting new placement
    this.onPlacementComplete = onComplete;
    this.onPlacementCancel = onCancel;

    // Create preview mesh
    this.createPreviewMesh(buildingType);
    
    this.logger.info('Placement mode started', { buildingType });
  }

  /**
   * Cancel placement mode
   */
  cancelPlacement(): void {
    if (!this.isPlacing) return;

    this.isPlacing = false;
    this.currentBuildingType = null;
    this.currentValidationReason = null;
    
    if (this.previewMesh) {
      this.previewMesh.dispose();
      this.previewMesh = null;
    }

    this.hideTooltip();

    if (this.onPlacementCancel) {
      this.onPlacementCancel();
    }

    this.logger.info('Placement mode cancelled');
  }

  /**
   * Create preview mesh for the building type
   */
  private createPreviewMesh(buildingType: BuildingType): void {
    // Create a temporary preview mesh at origin (will be moved to cursor position)
    // Use a position slightly above ground so it's visible initially
    const tempPosition = new Vector3(0, 1, 0);
    // Convert BuildingType enum to string (enum values are already strings)
    // Preview shows stilts if enabled
    this.previewMesh = this.primitiveFactory.createGroundStructure(buildingType as string, tempPosition, this.useStilts);
    
    // Make it semi-transparent and non-pickable
    this.previewMesh.isPickable = false;
    this.previewMesh.renderingGroupId = 1; // Render on top
    this.previewMesh.metadata = { ...this.previewMesh.metadata, isPreview: true, hasStilts: this.useStilts };
    
    // Ensure mesh is visible
    this.previewMesh.setEnabled(true);
    this.previewMesh.isVisible = true;
    
    // Apply valid material initially
    if (this.validMaterial) {
      this.previewMesh.material = this.validMaterial;
    }
    
    // Initialize current position
    this.currentPosition = tempPosition.clone();
  }

  /**
   * Update preview position based on mouse cursor
   */
  private updatePreviewPosition(offsetX: number, offsetY: number): void {
    if (!this.isPlacing || !this.previewMesh) return;

    // Raycast to find terrain intersection
    // Use a longer ray to ensure we hit terrain even if it's far away
    const pickInfo = this.scene.pick(offsetX, offsetY, undefined, false, this.scene.activeCamera);
    
    let position: Vector3 | null = null;
    
    if (pickInfo && pickInfo.hit && pickInfo.pickedPoint) {
      // Use picked point as base position
      position = pickInfo.pickedPoint.clone();
    } else {
      // If raycast didn't hit, create a ray from camera and intersect with a plane at ground level
      // Or use terrain manager to get height at screen position
      if (this.terrainManager && this.scene.activeCamera) {
        // Create a ray from camera through mouse position
        const ray = this.scene.createPickingRay(offsetX, offsetY, null, this.scene.activeCamera);
        
        // Sample terrain at multiple points along the ray
        // Start from camera position and go forward
        const startPos = ray.origin;
        const direction = ray.direction;
        
        // Sample at intervals along the ray
        for (let t = 0; t < 1000; t += 10) {
          const testPos = startPos.add(direction.scale(t));
          const terrainHeight = this.terrainManager.getHeightAt(testPos.x, testPos.z);
          
          // If we're close to terrain surface, use this position
          if (Math.abs(testPos.y - terrainHeight) < 5) {
            position = new Vector3(testPos.x, terrainHeight, testPos.z);
            break;
          }
        }
        
        // Fallback: use a position in front of camera
        if (!position) {
          const forward = ray.direction.scale(50);
          const testPos = startPos.add(forward);
          const terrainHeight = this.terrainManager.getHeightAt(testPos.x, testPos.z);
          position = new Vector3(testPos.x, terrainHeight, testPos.z);
        }
      } else {
        // No terrain manager - use a default position
        if (this.scene.activeCamera) {
          const ray = this.scene.createPickingRay(offsetX, offsetY, null, this.scene.activeCamera);
          position = ray.origin.add(ray.direction.scale(50));
          position.y = 0; // Ground level
        }
      }
    }
    
    if (position) {
      // If we have terrain manager, snap to terrain height
      if (this.terrainManager) {
        const terrainHeight = this.terrainManager.getHeightAt(position.x, position.z);
        position.y = terrainHeight;
      }

      this.currentPosition = position;
      this.previewMesh.position = position;

      // Update material and validation reason based on placement validity
      const validation = this.validatePlacement(position);
      const isValid = validation.valid;
      this.currentValidationReason = validation.reason || null;
      
      // Debug: Log validation reason to help troubleshoot
      if (this.currentValidationReason) {
        this.logger.debug('Placement validation', { 
          reason: this.currentValidationReason, 
          position: position,
          isValid 
        });
      }
      
      if (this.previewMesh.material !== (isValid ? this.validMaterial : this.invalidMaterial)) {
        this.previewMesh.material = isValid ? this.validMaterial : this.invalidMaterial;
      }
    }
  }

  /**
   * Validate placement at the given position and return validation result with reason
   */
  private validatePlacement(position: Vector3): { valid: boolean; reason?: string } {
    if (!this.currentBuildingType) {
      return { valid: false, reason: 'No building type selected' };
    }

    // Get existing building positions
    const groundStructures = this.buildingSystem.getGroundStructures();
    const existingPositions = Array.from(groundStructures.values()).map(s => s.mesh.position);
    
    // Get tower positions
    const playerTower = this.buildingSystem.getPlayerTower();
    const aiTower = this.buildingSystem.getAITower();
    const towerPositions: Vector3[] = [];
    if (playerTower) towerPositions.push(playerTower.getPosition());
    if (aiTower) towerPositions.push(aiTower.getPosition());

    // Validate placement using BuildingValidator
    const validation = BuildingValidator.validatePlacement(
      position,
      this.currentBuildingType,
      existingPositions,
      playerTower?.getPosition()
    );

    // If BuildingValidator found an issue, return that reason
    if (!validation.valid && validation.reason) {
      return validation;
    }

    // Also check terrain slope if terrain manager is available
    if (this.terrainManager) {
      const isValid = this.terrainManager.isValidBuildLocation(position, 30, this.useStilts);
      if (!isValid) {
        const slope = this.terrainManager.getSlopeAngle(position.x, position.z);
        if (this.useStilts) {
          return { 
            valid: false, 
            reason: `Terrain too steep (${slope.toFixed(1)}°). Maximum with stilts: 45°` 
          };
        } else {
          return { 
            valid: false, 
            reason: `Terrain too steep (${slope.toFixed(1)}°). Maximum slope: 30° (Press S for stilts)` 
          };
        }
      }
    }

    return validation;
  }

  /**
   * Check if placement is valid at the given position (legacy method for compatibility)
   */
  private isPlacementValid(position: Vector3): boolean {
    return this.validatePlacement(position).valid;
  }

  /**
   * Handle placement click
   */
  private handlePlacementClick(offsetX: number, offsetY: number): void {
    if (!this.isPlacing || !this.currentBuildingType) return;

    // Update position first in case it wasn't updated recently
    this.updatePreviewPosition(offsetX, offsetY);

    // Get current preview position
    const position = this.currentPosition.clone();
    
    // Ensure position is valid (not zero)
    if (position.length() < 0.1) {
      this.logger.warn('Invalid position for placement', { position });
      return;
    }

    // Validate placement
    const validation = this.validatePlacement(position);
    if (!validation.valid) {
      this.logger.warn('Invalid placement location', { 
        position, 
        buildingType: this.currentBuildingType,
        reason: validation.reason 
      });
      return;
    }

    // Complete placement (pass stilts option)
    if (this.onPlacementComplete) {
      this.onPlacementComplete(position, this.useStilts);
    }

    // Clean up preview
    this.cancelPlacement();
  }

  /**
   * Check if currently in placement mode
   */
  isInPlacementMode(): boolean {
    return this.isPlacing;
  }

  /**
   * Get current building type being placed
   */
  getCurrentBuildingType(): BuildingType | null {
    return this.currentBuildingType;
  }

  /**
   * Update tooltip position and content
   */
  private updateTooltip(offsetX: number, offsetY: number): void {
    if (!this.tooltipElement || !this.isPlacing) {
      return;
    }

    // Show tooltip only if placement is invalid
    if (this.currentValidationReason) {
      this.tooltipElement.textContent = this.currentValidationReason;
      this.tooltipElement.style.display = 'block';
      // Position tooltip near cursor (offset to avoid covering it)
      this.tooltipElement.style.left = `${offsetX + 15}px`;
      this.tooltipElement.style.top = `${offsetY - 30}px`;
    } else {
      this.hideTooltip();
    }
  }

  /**
   * Hide tooltip
   */
  private hideTooltip(): void {
    if (this.tooltipElement) {
      this.tooltipElement.style.display = 'none';
      // Reset tooltip styling
      this.tooltipElement.style.borderColor = '#ff6b6b';
      this.tooltipElement.style.color = '#ff6b6b';
    }
  }

  /**
   * Update placement system (called each frame)
   */
  update(): void {
    // Preview position is updated via event listeners
    // This method can be used for additional per-frame updates if needed
  }

  /**
   * Dispose and cleanup
   */
  dispose(): void {
    this.cancelPlacement();
    
    if (this.tooltipElement) {
      this.tooltipElement.remove();
      this.tooltipElement = null;
    }
    
    if (this.validMaterial) {
      this.validMaterial.dispose();
    }
    if (this.invalidMaterial) {
      this.invalidMaterial.dispose();
    }
  }
}
