/**
 * Game UI - Main UI controller
 */

import { ResourceDisplay } from './ResourceDisplay';
import { WaveTimer } from './WaveTimer';
import { PowerLevelDisplay } from './PowerLevelDisplay';
import { BuildingMenu } from './BuildingMenu';
import { WaveSystem } from '../systems/WaveSystem';
import { BuildingSystem } from '../systems/BuildingSystem';
import { Tower } from '../entities/Tower';
import { Vector3 } from '@babylonjs/core';

export class GameUI {
  private resourceDisplay: ResourceDisplay;
  private waveTimer: WaveTimer;
  private powerLevelDisplay: PowerLevelDisplay;
  private buildingMenu: BuildingMenu;
  private gameOverModal: HTMLDivElement | null = null;

  constructor(
    waveSystem: WaveSystem,
    buildingSystem: BuildingSystem
  ) {
    // Create UI containers if they don't exist
    this.createUIContainers();

    // Initialize UI components
    this.resourceDisplay = new ResourceDisplay('resource-display');
    this.waveTimer = new WaveTimer('wave-timer', waveSystem);
    this.powerLevelDisplay = new PowerLevelDisplay('power-level-display');
    this.buildingMenu = new BuildingMenu('building-menu', buildingSystem);

    // Set up wave trigger callback
    this.waveTimer.setTriggerCallback(() => {
      const playerTower = buildingSystem.getPlayerTower();
      if (playerTower) {
        const spawnPos = new Vector3(0, 0, -25); // Spawn enemies from valley entrance
        waveSystem.triggerWaveEarly(playerTower, spawnPos);
      }
    });

    // Create building menu toggle button
    this.createBuildingMenuButton();
  }

  private createUIContainers(): void {
    // Resource display
    if (!document.getElementById('resource-display')) {
      const resourceDiv = document.createElement('div');
      resourceDiv.id = 'resource-display';
      document.body.appendChild(resourceDiv);
    }

    // Wave timer
    if (!document.getElementById('wave-timer')) {
      const waveDiv = document.createElement('div');
      waveDiv.id = 'wave-timer';
      document.body.appendChild(waveDiv);
    }

    // Power level display
    if (!document.getElementById('power-level-display')) {
      const powerDiv = document.createElement('div');
      powerDiv.id = 'power-level-display';
      document.body.appendChild(powerDiv);
    }

    // Building menu
    if (!document.getElementById('building-menu')) {
      const menuDiv = document.createElement('div');
      menuDiv.id = 'building-menu';
      document.body.appendChild(menuDiv);
    }
  }

  private createBuildingMenuButton(): void {
    const button = document.createElement('button');
    button.id = 'building-menu-toggle';
    button.textContent = 'Build';
    button.className = 'building-menu-toggle';
    button.onclick = () => this.buildingMenu.toggle();
    document.body.appendChild(button);
  }

  /**
   * Update all UI elements
   */
  update(playerTower: Tower | null, aiTower: Tower | null): void {
    this.resourceDisplay.update();
    this.waveTimer.update();
    this.powerLevelDisplay.update(playerTower, aiTower);
  }

  /**
   * Show game over modal
   */
  showGameOver(winner: 'player' | 'ai' | 'tie', message: string): void {
    if (this.gameOverModal) {
      this.gameOverModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'game-over-modal';
    modal.innerHTML = `
      <div class="game-over-content">
        <h2>Game Over</h2>
        <p class="game-over-message">${message}</p>
        <p class="game-over-winner">Winner: ${winner === 'player' ? 'You!' : winner === 'ai' ? 'AI' : 'Tie'}</p>
        <button class="game-over-button" onclick="location.reload()">Play Again</button>
      </div>
    `;
    document.body.appendChild(modal);
    this.gameOverModal = modal;
  }
}
