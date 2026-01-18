/**
 * Wave Timer - Wave countdown display
 */

import { WaveSystem } from '../systems/WaveSystem';

export class WaveTimer {
  private container: HTMLDivElement;
  private waveSystem: WaveSystem;
  private timerElement: HTMLDivElement;
  private waveNumberElement: HTMLDivElement;
  private triggerButton: HTMLButtonElement | null = null;

  constructor(containerId: string, waveSystem: WaveSystem) {
    this.waveSystem = waveSystem;
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container as HTMLDivElement;
    this.createDisplay();
  }

  private createDisplay(): void {
    this.container.innerHTML = '';
    this.container.className = 'wave-timer';

    // Wave number
    this.waveNumberElement = document.createElement('div');
    this.waveNumberElement.className = 'wave-number';
    this.waveNumberElement.textContent = 'Wave: 0';
    this.container.appendChild(this.waveNumberElement);

    // Timer
    this.timerElement = document.createElement('div');
    this.timerElement.className = 'wave-timer-value';
    this.timerElement.textContent = 'Next wave in: --:--';
    this.container.appendChild(this.timerElement);

    // Early trigger button
    this.triggerButton = document.createElement('button');
    this.triggerButton.className = 'wave-trigger-button';
    this.triggerButton.textContent = 'Trigger Wave Early';
    this.triggerButton.disabled = true;
    this.container.appendChild(this.triggerButton);
  }

  /**
   * Set early trigger callback
   */
  setTriggerCallback(callback: () => void): void {
    if (this.triggerButton) {
      this.triggerButton.onclick = callback;
    }
  }

  /**
   * Update timer display
   */
  update(): void {
    const currentWave = this.waveSystem.getCurrentWave();
    const timeRemaining = this.waveSystem.getTimeUntilNextWave();
    const isWaveActive = this.waveSystem.isWaveActive();

    // Update wave number
    this.waveNumberElement.textContent = `Wave: ${currentWave}`;

    // Update timer
    if (isWaveActive) {
      this.timerElement.textContent = 'Wave Active!';
      if (this.triggerButton) {
        this.triggerButton.disabled = true;
      }
    } else {
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      this.timerElement.textContent = `Next wave in: ${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      if (this.triggerButton) {
        this.triggerButton.disabled = !this.waveSystem.canTriggerEarly();
      }
    }
  }
}
