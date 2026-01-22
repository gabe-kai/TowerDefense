/**
 * Game Scale - Defines realistic scale for game entities
 * 
 * Assumption: Servant is person-sized (~1.7m tall, ~0.5m wide)
 * All other entities are scaled relative to this.
 */

export class GameScale {
  // Base unit: 1 unit = 1 meter
  
  // Human/Character sizes
  static readonly SERVANT_HEIGHT = 1.7; // meters (average person height)
  static readonly SERVANT_RADIUS = 0.25; // meters (shoulder width / 2)
  static readonly SERVANT_SPEED = 1.5; // meters per second (walking speed)
  
  // Building sizes
  static readonly TOWER_BASE_SIZE = 4.0; // meters (small cottage, 4x4x4)
  static readonly TOWER_FLOOR_HEIGHT = 3.0; // meters (each floor is 3m tall)
  static readonly TOWER_FLOOR_SIZE = 3.5; // meters (slightly smaller than base)
  
  // Tower stepping system
  static readonly TOWER_STARTING_RADIUS = 2.5; // meters (smallest radius - starting size)
  static readonly TOWER_STEP_SIZE = 0.5; // meters (radius increase per upgrade)
  static readonly TOWER_FLOORS_PER_TIER = 3; // floors before upgrading lower tiers
  
  // Cottage/Hut specific sizes
  static readonly COTTAGE_HOUSE_WIDTH = 5.0; // meters (front to back)
  static readonly COTTAGE_HOUSE_DEPTH = 4.0; // meters (side to side)
  static readonly COTTAGE_HOUSE_HEIGHT = 3.0; // meters (wall height)
  static readonly COTTAGE_TOWER_SIZE = 2.5; // meters (tower base size)
  static readonly COTTAGE_TOWER_HEIGHT = 6.0; // meters (two-story tower)
  static readonly COTTAGE_PORCH_DEPTH = 1.5; // meters (porch extends from front)
  static readonly COTTAGE_PORCH_HEIGHT = 2.5; // meters (porch roof height)
  static readonly COTTAGE_ROOF_PEAK_HEIGHT = 1.5; // meters (roof peak above walls)
  static readonly COTTAGE_TOWER_ROOF_HEIGHT = 1.0; // meters (cone roof height)
  static readonly COTTAGE_FLAGPOLE_HEIGHT = 2.0; // meters (flag pole above tower roof)
  static readonly COTTAGE_FLAGPOLE_RADIUS = 0.05; // meters (thin pole)
  
  // Resource node sizes
  static readonly RESOURCE_NODE_SIZE = 0.8; // meters (resource deposit size)
  static readonly RESOURCE_NODE_SMALL = 0.4; // meters (crystal/essence/mana - smaller, magical)
  
  // Enemy sizes
  static readonly ENEMY_BASIC_SIZE = 1.0; // meters (basic enemy, roughly person-sized)
  static readonly ENEMY_LARGE_SIZE = 1.5; // meters (large enemy)
  
  // Ground structure sizes
  static readonly TURRET_SIZE = 1.5; // meters (defensive turret)
  static readonly WALL_HEIGHT = 2.0; // meters (defensive wall)
  static readonly WALL_THICKNESS = 0.5; // meters
  
  // Carrying indicator
  static readonly CARRYING_INDICATOR_SIZE = 0.15; // meters (small sphere above servant)
  static readonly CARRYING_INDICATOR_OFFSET = 0.9; // meters above servant center (head level)
  
  // Delivery feedback
  static readonly DELIVERY_FEEDBACK_SIZE = 0.3; // meters
  static readonly DELIVERY_FEEDBACK_RISE = 2.0; // meters (how high it rises)
  
  // Working animation
  static readonly WORKING_BOBBING_RANGE = 0.1; // meters (up/down movement)
  
  // Map dimensions
  static readonly MAP_WIDTH = 3000; // meters (3km wide valley)
  static readonly MAP_DEPTH = 3000; // meters (3km deep valley)
  static readonly MAP_CENTER_X = 0; // meters (center of map)
  static readonly MAP_CENTER_Z = 0; // meters (center of map)
  
  // Tower positioning
  static readonly TOWER_DISTANCE = 2000; // meters (2km apart)
  static readonly TOWER_RANDOMIZATION_RANGE = 500; // meters (±500m randomization - expanded for higher ground bias)
  static readonly TOWER_BASE_ELEVATION_MIN = 15; // meters (minimum height for tower bases)
  static readonly TOWER_BASE_ELEVATION_MAX = 25; // meters (maximum height for tower bases)
  static readonly TOWER_PLACEMENT_SAMPLES = 20; // Number of candidate positions to test for higher ground
  
  // Terrain features
  static readonly RIVER_WIDTH = 200; // meters (river width at center)
  static readonly VALLEY_FLOOR_HEIGHT = 0; // meters (river/valley floor elevation)
  static readonly HILL_HEIGHT = 30; // meters (peak height of hills)
  
  // Dramatic terrain features (Phase 1.5)
  static readonly GORGE_DEPTH = -50; // meters (gorge below valley floor - dramatic drop)
  static readonly MOUNTAIN_HEIGHT = 150; // meters (peak height of mountain slopes)
  static readonly VALLEY_CUT_DEPTH = -30; // meters (valley cutting perpendicular through terrain)
  static readonly TERRAIN_NOISE_SCALE = 0.02; // noise frequency for small-scale variation
  static readonly TERRAIN_NOISE_AMPLITUDE = 5; // meters (amplitude of noise variation)
  static readonly MOUNTAIN_SLOPE_DIRECTION = 1; // 1 = slopes up in +X direction, -1 = slopes up in -X direction
  
  /**
   * Convert game units to meters (for display/logging)
   */
  static toMeters(units: number): number {
    return units;
  }
  
  /**
   * Convert meters to game units
   */
  static fromMeters(meters: number): number {
    return meters;
  }
}
