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
      const distance = Vector3.Distance(position, towerPosition);
      if (distance > 1.5) {
        return {
          valid: false,
          reason: 'Tower floor must be directly above tower'
        };
      }
    }

    // Check if position is on ground level (for ground structures)
    const groundStructures = [
      BuildingType.TURRET,
      BuildingType.CANNON,
      BuildingType.WALL,
      BuildingType.BARRIER,
      BuildingType.STORAGE,
      BuildingType.WORKSHOP,
      BuildingType.BARRACKS,
      BuildingType.LIBRARY
    ];

    if (groundStructures.includes(buildingType) && position.y > 0.5) {
      return {
        valid: false,
        reason: 'Ground structure must be placed on ground level'
      };
    }

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
