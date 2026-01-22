/**
 * Building Validator - Building placement validation
 */

import { Vector3 } from '@babylonjs/core';
import { BuildingType } from '../components/BuildingComponent';

export interface PlacementValidation {
  valid: boolean;
  reason?: string;
}

export class BuildingValidator {
  /**
   * Validate building placement
   */
  static validatePlacement(
    position: Vector3,
    buildingType: BuildingType,
    existingBuildings: Vector3[],
    towerPosition?: Vector3
  ): PlacementValidation {
    // Check if too close to other buildings
    for (const existing of existingBuildings) {
      const distance = Vector3.Distance(position, existing);
      if (distance < 2.0) {
        return {
          valid: false,
          reason: 'Too close to another building'
        };
      }
    }

    // For tower floors, check if attached to tower
    if (buildingType === BuildingType.TOWER_FLOOR) {
      if (!towerPosition) {
        return {
          valid: false,
          reason: 'Tower floor must be attached to tower'
        };
      }
      // Check horizontal distance only (ignore Y difference for stacking)
      const horizontalDistance = Math.sqrt(
        Math.pow(position.x - towerPosition.x, 2) + 
        Math.pow(position.z - towerPosition.z, 2)
      );
      if (horizontalDistance > 1.5) {
        return {
          valid: false,
          reason: 'Tower floor must be directly above tower'
        };
      }
    }

    // Removed ground level check - terrain height varies, so we allow placement at any terrain height
    // Terrain slope validation is handled separately by TerrainManager

    return { valid: true };
  }

  /**
   * Check if position is within buildable area
   */
  static isInBuildableArea(position: Vector3, bounds?: { minX: number; maxX: number; minZ: number; maxZ: number }): boolean {
    if (!bounds) {
      return true; // No bounds specified
    }

    return (
      position.x >= bounds.minX &&
      position.x <= bounds.maxX &&
      position.z >= bounds.minZ &&
      position.z <= bounds.maxZ
    );
  }
}
