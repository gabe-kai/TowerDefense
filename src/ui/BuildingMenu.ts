/**
 * Building Menu - Building/upgrade interface
 */

import { BuildingType, RoomType } from '../components/BuildingComponent';
import { BuildingSystem } from '../systems/BuildingSystem';
import { BuildingPlacementSystem } from '../systems/BuildingPlacementSystem';
import { Tower } from '../entities/Tower';
import { Vector3 } from '@babylonjs/core';

export class BuildingMenu {
  private container: HTMLDivElement;
  private buildingSystem: BuildingSystem;
  private placementSystem: BuildingPlacementSystem | null = null;
  private isVisible: boolean = false;
  private errorNotification: HTMLDivElement | null = null;

  constructor(containerId: string, buildingSystem: BuildingSystem, placementSystem?: BuildingPlacementSystem) {
    this.buildingSystem = buildingSystem;
    this.placementSystem = placementSystem || null;
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container as HTMLDivElement;
    
    // Create error notification element
    this.errorNotification = document.createElement('div');
    this.errorNotification.className = 'placement-error-notification';
    this.errorNotification.style.display = 'none';
    document.body.appendChild(this.errorNotification);
    
    this.createMenu();
  }

  private createMenu(): void {
    this.container.innerHTML = '';
    this.container.className = 'building-menu';
    this.container.style.display = 'none';

    const title = document.createElement('div');
    title.className = 'menu-title';
    title.textContent = 'Buildings';
    this.container.appendChild(title);

    // Tower floors
    const floorSection = this.createSection('Tower Floors');
    const floorButton = this.createBuildButton('Add Floor', () => {
      this.buildFloor(RoomType.SPECIALIZED, BuildingType.TOWER_FLOOR);
    });
    floorSection.appendChild(floorButton);
    this.container.appendChild(floorSection);

    // Defense structures
    const defenseSection = this.createSection('Defense');
    const turretButton = this.createBuildButton('Turret', () => {
      this.startPlacement(BuildingType.TURRET);
    });
    const wallButton = this.createBuildButton('Wall', () => {
      this.startPlacement(BuildingType.WALL);
    });
    const barrierButton = this.createBuildButton('Barrier', () => {
      this.startPlacement(BuildingType.BARRIER);
    });
    defenseSection.appendChild(turretButton);
    defenseSection.appendChild(wallButton);
    defenseSection.appendChild(barrierButton);
    this.container.appendChild(defenseSection);

    // Offense structures
    const offenseSection = this.createSection('Offense');
    const cannonButton = this.createBuildButton('Cannon', () => {
      this.startPlacement(BuildingType.CANNON);
    });
    const spellTowerButton = this.createBuildButton('Spell Tower', () => {
      this.startPlacement(BuildingType.SPELL_TOWER);
    });
    offenseSection.appendChild(cannonButton);
    offenseSection.appendChild(spellTowerButton);
    this.container.appendChild(offenseSection);

    // Resource structures
    const resourceSection = this.createSection('Resource');
    const storageButton = this.createBuildButton('Storage', () => {
      this.startPlacement(BuildingType.STORAGE);
    });
    const workshopButton = this.createBuildButton('Workshop', () => {
      this.startPlacement(BuildingType.WORKSHOP);
    });
    resourceSection.appendChild(storageButton);
    resourceSection.appendChild(workshopButton);
    this.container.appendChild(resourceSection);

    // Housing
    const housingSection = this.createSection('Housing');
    const barracksButton = this.createBuildButton('Barracks', () => {
      this.startPlacement(BuildingType.BARRACKS);
    });
    housingSection.appendChild(barracksButton);
    this.container.appendChild(housingSection);

    // Specialized
    const specializedSection = this.createSection('Specialized');
    const libraryButton = this.createBuildButton('Library', () => {
      this.startPlacement(BuildingType.LIBRARY);
    });
    specializedSection.appendChild(libraryButton);
    this.container.appendChild(specializedSection);

    // Close button
    const closeButton = document.createElement('button');
    closeButton.className = 'menu-close';
    closeButton.textContent = 'Close';
    closeButton.onclick = () => this.hide();
    this.container.appendChild(closeButton);
  }

  private createSection(title: string): HTMLDivElement {
    const section = document.createElement('div');
    section.className = 'menu-section';
    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'section-title';
    sectionTitle.textContent = title;
    section.appendChild(sectionTitle);
    return section;
  }

  private createBuildButton(label: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'build-button';
    button.textContent = label;
    button.onclick = onClick;
    return button;
  }

  private buildFloor(roomType: RoomType, buildingType: BuildingType): void {
    const tower = this.buildingSystem.getPlayerTower();
    if (tower) {
      this.buildingSystem.buildFloor(tower, roomType, buildingType, 'player');
    }
  }

  /**
   * Start placement mode for a ground structure
   */
  private startPlacement(buildingType: BuildingType): void {
    if (!this.placementSystem) {
      // Fallback: place at fixed position if placement system not available
      this.buildGroundStructure(buildingType);
      return;
    }

    // Hide menu when starting placement
    this.hide();

    // Start placement mode
    this.placementSystem.startPlacement(
      buildingType,
      (position: Vector3, useStilts?: boolean) => {
        // Placement completed - build the structure
        const result = this.buildingSystem.buildGroundStructure(buildingType, position, 'player', useStilts);
        if (!result.success) {
          // If placement failed, show error message and menu again
          this.showPlacementError(result.reason || 'Unknown error');
          this.show();
        }
      },
      () => {
        // Placement cancelled - show menu again
        this.show();
      }
    );
  }

  /**
   * Fallback: Build at fixed position (if placement system not available)
   */
  private buildGroundStructure(buildingType: BuildingType): void {
    const tower = this.buildingSystem.getPlayerTower();
    if (tower) {
      const position = tower.getPosition().add(new Vector3(5, 0, 0));
      const result = this.buildingSystem.buildGroundStructure(buildingType, position, 'player');
      if (!result.success) {
        this.showPlacementError(result.reason || 'Unknown error');
      }
    }
  }

  show(): void {
    this.container.style.display = 'block';
    this.isVisible = true;
  }

  hide(): void {
    this.container.style.display = 'none';
    this.isVisible = false;
  }

  toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Show placement error notification
   */
  private showPlacementError(reason: string): void {
    if (!this.errorNotification) return;
    
    this.errorNotification.textContent = `Placement failed: ${reason}`;
    this.errorNotification.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (this.errorNotification) {
        this.errorNotification.style.display = 'none';
      }
    }, 5000);
  }
}
