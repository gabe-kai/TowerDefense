/**
 * Building Menu - Building/upgrade interface
 */

import { BuildingType, RoomType } from '../components/BuildingComponent';
import { BuildingSystem } from '../systems/BuildingSystem';
import { Tower } from '../entities/Tower';
import { Vector3 } from '@babylonjs/core';

export class BuildingMenu {
  private container: HTMLDivElement;
  private buildingSystem: BuildingSystem;
  private isVisible: boolean = false;

  constructor(containerId: string, buildingSystem: BuildingSystem) {
    this.buildingSystem = buildingSystem;
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container as HTMLDivElement;
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
      this.buildGroundStructure(BuildingType.TURRET);
    });
    const wallButton = this.createBuildButton('Wall', () => {
      this.buildGroundStructure(BuildingType.WALL);
    });
    defenseSection.appendChild(turretButton);
    defenseSection.appendChild(wallButton);
    this.container.appendChild(defenseSection);

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

  private buildGroundStructure(buildingType: BuildingType): void {
    const tower = this.buildingSystem.getPlayerTower();
    if (tower) {
      const position = tower.getPosition().add(new Vector3(5, 0, 0));
      this.buildingSystem.buildGroundStructure(buildingType, position, 'player');
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
}
