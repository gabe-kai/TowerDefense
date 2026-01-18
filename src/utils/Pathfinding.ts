/**
 * Pathfinding - Simple pathfinding utilities
 */

import { Vector3 } from '@babylonjs/core';

export interface PathNode {
  position: Vector3;
  g: number; // Cost from start
  h: number; // Heuristic to goal
  f: number; // Total cost
  parent: PathNode | null;
}

/**
 * Simple A* pathfinding implementation
 */
export class Pathfinding {
  /**
   * Find path from start to goal (simplified - direct path with obstacle avoidance)
   */
  static findPath(start: Vector3, goal: Vector3, obstacles: Vector3[] = []): Vector3[] {
    // For MVP, use simple direct pathfinding
    // In full implementation, this would use proper A* with grid/navmesh
    
    const path: Vector3[] = [start.clone()];
    
    // Simple direct path - can be enhanced with proper A*
    const direction = goal.subtract(start);
    const distance = Vector3.Distance(start, goal);
    const steps = Math.ceil(distance / 2); // Step size of 2 units
    
    if (steps > 1) {
      const stepSize = 1 / steps;
      for (let i = 1; i < steps; i++) {
        const t = i * stepSize;
        const point = start.add(direction.scale(t));
        
        // Check if point is too close to obstacles
        const tooClose = obstacles.some(obs => Vector3.Distance(point, obs) < 1.5);
        if (!tooClose) {
          path.push(point);
        }
      }
    }
    
    path.push(goal.clone());
    return path;
  }

  /**
   * Get direction vector from start to goal
   */
  static getDirection(start: Vector3, goal: Vector3): Vector3 {
    return goal.subtract(start).normalize();
  }

  /**
   * Check if position is reachable (not blocked)
   */
  static isReachable(position: Vector3, obstacles: Vector3[] = [], radius: number = 1.5): boolean {
    return !obstacles.some(obs => Vector3.Distance(position, obs) < radius);
  }
}
