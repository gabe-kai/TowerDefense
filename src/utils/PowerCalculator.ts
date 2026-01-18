/**
 * Power Calculator - Power level calculation
 */

import { Tower } from '../entities/Tower';
import { GameStateManager } from '../core/GameState';

export class PowerCalculator {
  private static instance: PowerCalculator;
  private stateManager: GameStateManager;

  private constructor() {
    this.stateManager = GameStateManager.getInstance();
  }

  static getInstance(): PowerCalculator {
    if (!PowerCalculator.instance) {
      PowerCalculator.instance = new PowerCalculator();
    }
    return PowerCalculator.instance;
  }

  /**
   * Calculate power level for a player
   */
  calculatePowerLevel(player: 'player' | 'ai', tower: Tower | null): number {
    const state = this.stateManager.getState()[player];
    let power = 0;

    // Tower height contributes significantly
    if (tower) {
      power += tower.getHeight() * 10;
      power += tower.getTotalHealth() * 0.1;
    } else {
      power += state.towerHeight * 10;
    }

    // Servants contribute
    power += state.servants * 5;

    // Resources contribute (diminishing returns)
    const resources = state.resources;
    power += Math.sqrt(resources.wood) * 0.5;
    power += Math.sqrt(resources.stone) * 0.5;
    power += resources.gold * 2;
    power += resources.crystal * 3;
    power += resources.essence * 4;
    power += resources.mana * 5;

    return Math.floor(power);
  }

  /**
   * Update power levels for both players
   */
  updatePowerLevels(playerTower: Tower | null, aiTower: Tower | null): void {
    const playerPower = this.calculatePowerLevel('player', playerTower);
    const aiPower = this.calculatePowerLevel('ai', aiTower);
    
    // Update in state (this is a simplified version - actual update happens in GameState)
    // Power levels are calculated on-demand
  }

  /**
   * Compare power levels and determine winner
   */
  comparePowerLevels(playerTower: Tower | null, aiTower: Tower | null): 'player' | 'ai' | 'tie' {
    const playerPower = this.calculatePowerLevel('player', playerTower);
    const aiPower = this.calculatePowerLevel('ai', aiTower);

    if (playerPower > aiPower) {
      return 'player';
    } else if (aiPower > playerPower) {
      return 'ai';
    } else {
      return 'tie';
    }
  }
}
