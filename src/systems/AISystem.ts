/**
 * AI System - AI opponent logic
 */

import { Vector3 } from '@babylonjs/core';
import { ServantSystem } from './ServantSystem';
import { ResourceSystem } from './ResourceSystem';
import { BuildingSystem } from './BuildingSystem';
import { Tower } from '../entities/Tower';
import { Resource } from '../entities/Resource';
import { BuildingType, RoomType } from '../components/BuildingComponent';
import { GameStateManager } from '../core/GameState';
import { createCategoryLogger } from '../utils/Logger';

export class AISystem {
  private servantSystem: ServantSystem;
  private resourceSystem: ResourceSystem;
  private buildingSystem: BuildingSystem;
  private stateManager: GameStateManager;
  private aiTower: Tower | null = null;
  private lastActionTime: number = 0;
  private actionInterval: number = 2000; // 2 seconds between AI actions
  private lastResourceCollectionTime: number = 0;
  private resourceCollectionInterval: number = 3000; // 3 seconds between resource collection attempts
  private logger = createCategoryLogger('AISystem');

  constructor(
    servantSystem: ServantSystem,
    resourceSystem: ResourceSystem,
    buildingSystem: BuildingSystem
  ) {
    this.servantSystem = servantSystem;
    this.resourceSystem = resourceSystem;
    this.buildingSystem = buildingSystem;
    this.stateManager = GameStateManager.getInstance();
  }

  /**
   * Initialize AI with tower
   */
  initialize(aiTower: Tower): void {
    this.aiTower = aiTower;
  }

  /**
   * Update AI (call each frame or periodically)
   */
  update(): void {
    if (!this.aiTower) {
      return;
    }

    const now = Date.now();

    // Resource collection
    if (now - this.lastResourceCollectionTime >= this.resourceCollectionInterval) {
      this.collectResources();
      this.lastResourceCollectionTime = now;
    }

    // Building and upgrades
    if (now - this.lastActionTime >= this.actionInterval) {
      this.makeBuildingDecisions();
      this.lastActionTime = now;
    }
  }

  /**
   * AI resource collection logic
   */
  private collectResources(): void {
    const availableServants = this.servantSystem.getAvailableServants('ai');
    if (availableServants.length === 0) {
      return;
    }

    // Find nearest resources
    const allResources = this.resourceSystem.getAllResources();
    if (allResources.length === 0) {
      return;
    }

    // Command servants to collect nearest resources
    availableServants.forEach(servant => {
      const nearestResource = this.resourceSystem.findNearestResource(servant.getPosition());
      if (nearestResource && !nearestResource.isCollected()) {
        this.servantSystem.commandCollect(servant, nearestResource);
      }
    });
  }

  /**
   * AI building decisions
   */
  private makeBuildingDecisions(): void {
    if (!this.aiTower) {
      return;
    }

    const resources = this.stateManager.getResources('ai');
    const towerHeight = this.aiTower.getHeight();

    // Priority 1: Build defensive structures if low on defense
    if (this.shouldBuildDefense(resources)) {
      this.buildDefensiveStructure();
      return;
    }

    // Priority 2: Build tower floors if have resources
    if (this.shouldBuildFloor(resources, towerHeight)) {
      this.buildTowerFloor();
      return;
    }

    // Priority 3: Recruit servants if have resources and few servants
    if (this.shouldRecruitServant(resources)) {
      this.recruitServant();
      return;
    }
  }

  /**
   * Check if AI should build defense
   */
  private shouldBuildDefense(resources: any): boolean {
    // Build defense if have enough resources and tower is at least level 2
    return (
      resources.wood >= 15 &&
      resources.stone >= 20 &&
      this.aiTower!.getHeight() >= 2
    );
  }

  /**
   * Build a defensive structure
   */
  private buildDefensiveStructure(): void {
    if (!this.aiTower) {
      return;
    }

    const towerPos = this.aiTower.getPosition();
    // Place defensive structure near tower
    const structurePos = towerPos.add(new Vector3(
      (Math.random() - 0.5) * 8,
      0,
      (Math.random() - 0.5) * 8
    ));

    // Try to build a turret
    if (this.buildingSystem.buildGroundStructure(BuildingType.TURRET, structurePos, 'ai')) {
      this.logger.debug('AI built turret', { position: structurePos });
      return;
    }

    // Fallback to barrier
    if (this.buildingSystem.buildGroundStructure(BuildingType.BARRIER, structurePos, 'ai')) {
      this.logger.debug('AI built barrier', { position: structurePos });
    }
  }

  /**
   * Check if AI should build a floor
   */
  private shouldBuildFloor(resources: any, towerHeight: number): boolean {
    // Build floor if have enough resources
    return (
      resources.wood >= 20 &&
      resources.stone >= 10 &&
      towerHeight < 10 // Limit tower height
    );
  }

  /**
   * Build a tower floor
   */
  private buildTowerFloor(): void {
    if (!this.aiTower) {
      return;
    }

    // Randomly choose room type
    const roomTypes: RoomType[] = [
      RoomType.DEFENSE,
      RoomType.OFFENSE,
      RoomType.RESOURCE
    ];
    const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];

    // Choose building type based on room type
    let buildingType: BuildingType;
    switch (roomType) {
      case RoomType.DEFENSE:
        buildingType = BuildingType.TOWER_FLOOR; // Can be enhanced
        break;
      case RoomType.OFFENSE:
        buildingType = BuildingType.TOWER_FLOOR;
        break;
      case RoomType.RESOURCE:
        buildingType = BuildingType.TOWER_FLOOR;
        break;
      default:
        buildingType = BuildingType.TOWER_FLOOR;
    }

    this.buildingSystem.buildFloor(this.aiTower, roomType, buildingType, 'ai');
  }

  /**
   * Check if AI should recruit a servant
   */
  private shouldRecruitServant(resources: any): boolean {
    const servantCount = this.servantSystem.getServants('ai').length;
    return (
      resources.wood >= 10 &&
      resources.stone >= 5 &&
      servantCount < 5 // Limit servant count
    );
  }

  /**
   * Recruit a servant
   */
  private recruitServant(): void {
    if (!this.aiTower) {
      return;
    }

    const towerPos = this.aiTower.getPosition();
    const spawnPos = towerPos.add(new Vector3(
      (Math.random() - 0.5) * 3,
      0,
      (Math.random() - 0.5) * 3
    ));

    this.servantSystem.recruitServant(spawnPos, 'ai');
  }

  /**
   * Get AI tower
   */
  getAITower(): Tower | null {
    return this.aiTower;
  }
}
