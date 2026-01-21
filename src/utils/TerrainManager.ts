/**
 * TerrainManager - Wrapper around Babylon.js GroundMesh for terrain height sampling
 * 
 * Provides game-specific terrain utilities while leveraging Babylon's built-in
 * height sampling capabilities.
 */

import { GroundMesh, Vector3 } from '@babylonjs/core';
import { createCategoryLogger } from './Logger';

export class TerrainManager {
  private groundMesh: GroundMesh;
  private logger = createCategoryLogger('TerrainManager');

  constructor(groundMesh: GroundMesh) {
    if (!(groundMesh instanceof GroundMesh)) {
      throw new Error('TerrainManager requires a GroundMesh instance');
    }
    this.groundMesh = groundMesh;
    this.logger.info('TerrainManager initialized', { 
      meshName: groundMesh.name,
      width: groundMesh.getBoundingInfo().boundingBox.extendSize.x * 2,
      height: groundMesh.getBoundingInfo().boundingBox.extendSize.z * 2
    });
  }

  /**
   * Get terrain height at X/Z coordinates
   * Uses Babylon's built-in getHeightAtCoordinates method
   */
  getHeightAt(x: number, z: number): number {
    try {
      return this.groundMesh.getHeightAtCoordinates(x, z);
    } catch (error) {
      this.logger.warn('Failed to get height at coordinates', { x, z, error });
      return 0; // Fallback to ground level
    }
  }

  /**
   * Get surface normal at X/Z coordinates
   * Uses Babylon's built-in getNormalAtCoordinates method
   */
  getNormalAt(x: number, z: number): Vector3 {
    try {
      return this.groundMesh.getNormalAtCoordinates(x, z);
    } catch (error) {
      this.logger.warn('Failed to get normal at coordinates', { x, z, error });
      return new Vector3(0, 1, 0); // Fallback to vertical normal
    }
  }

  /**
   * Calculate slope angle in degrees
   * Returns 0 for flat terrain, 90 for vertical
   */
  getSlopeAngle(x: number, z: number): number {
    const normal = this.getNormalAt(x, z);
    // Normal.y is the cosine of the slope angle
    // For flat terrain: normal.y = 1, angle = 0°
    // For vertical: normal.y = 0, angle = 90°
    const slopeRadians = Math.acos(Math.max(0, Math.min(1, normal.y)));
    return slopeRadians * (180 / Math.PI);
  }

  /**
   * Check if position is valid for building
   * @param position World position to check
   * @param maxSlope Maximum allowed slope in degrees (default: 20°)
   */
  isValidBuildLocation(position: Vector3, maxSlope: number = 20): boolean {
    const slope = this.getSlopeAngle(position.x, position.z);
    return slope <= maxSlope;
  }

  /**
   * Sample height for multiple positions
   * Useful for placing buildings with multiple anchor points
   */
  sampleHeights(positions: Vector3[]): Vector3[] {
    return positions.map(pos => {
      const height = this.getHeightAt(pos.x, pos.z);
      return new Vector3(pos.x, height, pos.z);
    });
  }

  /**
   * Get the ground mesh instance
   */
  getGroundMesh(): GroundMesh {
    return this.groundMesh;
  }

  /**
   * Check if coordinates are within terrain bounds
   */
  isInBounds(x: number, z: number): boolean {
    const boundingInfo = this.groundMesh.getBoundingInfo();
    const minX = boundingInfo.boundingBox.minimumWorld.x;
    const maxX = boundingInfo.boundingBox.maximumWorld.x;
    const minZ = boundingInfo.boundingBox.minimumWorld.z;
    const maxZ = boundingInfo.boundingBox.maximumWorld.z;
    
    return x >= minX && x <= maxX && z >= minZ && z <= maxZ;
  }
}
