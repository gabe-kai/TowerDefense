/**
 * Game State - Centralized game state management
 */

export enum GamePhase {
  MENU = 'menu',
  PLAYING = 'playing',
  PAUSED = 'paused',
  WAVE_COUNTDOWN = 'wave_countdown',
  WAVE_ACTIVE = 'wave_active',
  GAME_OVER = 'game_over'
}

export interface ResourceInventory {
  wood: number;
  stone: number;
  gold: number;
  crystal: number;
  essence: number;
  mana: number;
}

export interface PlayerState {
  resources: ResourceInventory;
  towerHeight: number;
  powerLevel: number;
  servants: number;
}

export interface GameState {
  phase: GamePhase;
  player: PlayerState;
  ai: PlayerState;
  currentWave: number;
  nextWaveTime: number;
  gameStartTime: number;
}

export class GameStateManager {
  private static instance: GameStateManager;
  private state: GameState;

  private constructor() {
    this.state = this.createInitialState();
  }

  static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  private createInitialState(): GameState {
    const initialResources: ResourceInventory = {
      wood: 0,
      stone: 0,
      gold: 0,
      crystal: 0,
      essence: 0,
      mana: 0
    };

    return {
      phase: GamePhase.MENU,
      player: {
        resources: { ...initialResources },
        towerHeight: 1,
        powerLevel: 0,
        servants: 1
      },
      ai: {
        resources: { ...initialResources },
        towerHeight: 1,
        powerLevel: 0,
        servants: 1
      },
      currentWave: 0,
      nextWaveTime: 0,
      gameStartTime: Date.now()
    };
  }

  getState(): GameState {
    return this.state;
  }

  setPhase(phase: GamePhase): void {
    this.state.phase = phase;
  }

  getPhase(): GamePhase {
    return this.state.phase;
  }

  addResource(player: 'player' | 'ai', resource: keyof ResourceInventory, amount: number): void {
    this.state[player].resources[resource] += amount;
  }

  getResources(player: 'player' | 'ai'): ResourceInventory {
    return { ...this.state[player].resources };
  }

  setTowerHeight(player: 'player' | 'ai', height: number): void {
    this.state[player].towerHeight = height;
    this.updatePowerLevel(player);
  }

  addServant(player: 'player' | 'ai'): void {
    this.state[player].servants += 1;
    this.updatePowerLevel(player);
  }

  setCurrentWave(wave: number): void {
    this.state.currentWave = wave;
  }

  setNextWaveTime(time: number): void {
    this.state.nextWaveTime = time;
  }

  private updatePowerLevel(player: 'player' | 'ai'): void {
    const state = this.state[player];
    // Simple power level calculation - can be enhanced
    state.powerLevel = state.towerHeight * 10 + state.servants * 5;
  }

  reset(): void {
    this.state = this.createInitialState();
  }
}
