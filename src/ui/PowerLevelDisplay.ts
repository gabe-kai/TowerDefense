/**
 * Power Level Display - Power level indicator
 */

import { PowerCalculator } from '../utils/PowerCalculator';
import { Tower } from '../entities/Tower';

export class PowerLevelDisplay {
  private container: HTMLDivElement;
  private powerCalculator: PowerCalculator;
  private playerPowerElement: HTMLDivElement;
  private aiPowerElement: HTMLDivElement;

  constructor(containerId: string) {
    this.powerCalculator = PowerCalculator.getInstance();
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container as HTMLDivElement;
    this.createDisplay();
  }

  private createDisplay(): void {
    this.container.innerHTML = '';
    this.container.className = 'power-level-display';

    const title = document.createElement('div');
    title.className = 'power-title';
    title.textContent = 'Power Levels';
    this.container.appendChild(title);

    // Player power
    const playerDiv = document.createElement('div');
    playerDiv.className = 'power-item player-power';
    const playerLabel = document.createElement('span');
    playerLabel.textContent = 'Player: ';
    this.playerPowerElement = document.createElement('span');
    this.playerPowerElement.className = 'power-value';
    this.playerPowerElement.textContent = '0';
    playerDiv.appendChild(playerLabel);
    playerDiv.appendChild(this.playerPowerElement);
    this.container.appendChild(playerDiv);

    // AI power
    const aiDiv = document.createElement('div');
    aiDiv.className = 'power-item ai-power';
    const aiLabel = document.createElement('span');
    aiLabel.textContent = 'AI: ';
    this.aiPowerElement = document.createElement('span');
    this.aiPowerElement.className = 'power-value';
    this.aiPowerElement.textContent = '0';
    aiDiv.appendChild(aiLabel);
    aiDiv.appendChild(this.aiPowerElement);
    this.container.appendChild(aiDiv);
  }

  /**
   * Update power level display
   */
  update(playerTower: Tower | null, aiTower: Tower | null): void {
    const playerPower = this.powerCalculator.calculatePowerLevel('player', playerTower);
    const aiPower = this.powerCalculator.calculatePowerLevel('ai', aiTower);

    this.playerPowerElement.textContent = playerPower.toString();
    this.aiPowerElement.textContent = aiPower.toString();

    // Highlight leader
    if (playerPower > aiPower) {
      this.playerPowerElement.classList.add('leader');
      this.aiPowerElement.classList.remove('leader');
    } else if (aiPower > playerPower) {
      this.aiPowerElement.classList.add('leader');
      this.playerPowerElement.classList.remove('leader');
    } else {
      this.playerPowerElement.classList.remove('leader');
      this.aiPowerElement.classList.remove('leader');
    }
  }
}
