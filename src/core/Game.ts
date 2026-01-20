/**
 * Game - Main game controller
 */

import { SceneManager } from './SceneManager';
import { GameStateManager, GamePhase } from './GameState';
import { ResourceSystem } from '../systems/ResourceSystem';
import { ServantSystem } from '../systems/ServantSystem';
import { BuildingSystem } from '../systems/BuildingSystem';
import { EnemySystem } from '../systems/EnemySystem';
import { WaveSystem } from '../systems/WaveSystem';
import { AISystem } from '../systems/AISystem';
import { InteractionSystem } from '../systems/InteractionSystem';
import { GameUI } from '../ui/GameUI';
import { PowerCalculator } from '../utils/PowerCalculator';
import { Vector3 } from '@babylonjs/core';
import { createCategoryLogger } from '../utils/Logger';

export class Game {
  private sceneManager: SceneManager | null = null;
  private stateManager: GameStateManager;
  private canvas: HTMLCanvasElement;
  private isRunning: boolean = false;

  // Systems
  private resourceSystem: ResourceSystem | null = null;
  private servantSystem: ServantSystem | null = null;
  private buildingSystem: BuildingSystem | null = null;
  private enemySystem: EnemySystem | null = null;
  private waveSystem: WaveSystem | null = null;
  private aiSystem: AISystem | null = null;
  private interactionSystem: InteractionSystem | null = null;
  private gameUI: GameUI | null = null;
  private powerCalculator: PowerCalculator;
  private logger = createCategoryLogger('Game');

  // Game loop
  private lastUpdateTime: number = 0;
  private updateInterval: number = 16; // ~60 FPS

  constructor(canvasId: string) {
    const canvasElement = document.getElementById(canvasId);
    if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }
    this.canvas = canvasElement;
    this.stateManager = GameStateManager.getInstance();
    this.powerCalculator = PowerCalculator.getInstance();
  }

  /**
   * Initialize the game
   */
  async initialize(): Promise<void> {
    // Create scene
    this.sceneManager = new SceneManager(this.canvas);
    const scene = this.sceneManager.getScene();

    // Initialize systems
    this.resourceSystem = new ResourceSystem(scene);
    this.servantSystem = new ServantSystem(scene);
    this.buildingSystem = new BuildingSystem(scene);
    this.enemySystem = new EnemySystem(scene);
    this.waveSystem = new WaveSystem(this.enemySystem);
    this.aiSystem = new AISystem(
      this.servantSystem,
      this.resourceSystem,
      this.buildingSystem
    );
    
    // Initialize interaction system (handles clicks, hover)
    this.interactionSystem = new InteractionSystem(
      scene,
      this.servantSystem,
      this.resourceSystem,
      this.buildingSystem
    );

    // Create towers
    const playerTowerPos = new Vector3(-20, 2, 0);
    const aiTowerPos = new Vector3(20, 2, 0);
    const playerTower = this.buildingSystem.createPlayerTower(playerTowerPos);
    const aiTower = this.buildingSystem.createAITower(aiTowerPos);

    // Initialize AI
    this.aiSystem.initialize(aiTower);

    // Create initial servant for player
    this.servantSystem.createServant(playerTowerPos.add(new Vector3(2, 0, 0)), 'player');

    // Spawn initial resources
    this.resourceSystem.spawnRandomResources(20);

    // Initialize UI
    this.gameUI = new GameUI(this.waveSystem, this.buildingSystem);

    // Start render loop
    this.sceneManager.render();

    // Set initial game phase
    this.stateManager.setPhase(GamePhase.PLAYING);

    // Start game loop
    this.startGameLoop();

    this.logger.info('Game initialized', { 
      playerTower: playerTower.getPosition(), 
      aiTower: aiTower.getPosition(),
      initialResources: this.resourceSystem.getAllResources().length
    });
  }

  /**
   * Start the game
   */
  start(): void {
    if (this.isRunning) {
      return;
    }

    this.stateManager.setPhase(GamePhase.PLAYING);
    this.isRunning = true;
    this.logger.info('Game started');
  }

  /**
   * Game loop
   */
  private startGameLoop(): void {
    const gameLoop = () => {
      if (!this.isRunning) {
        return;
      }

      const currentTime = Date.now();
      if (currentTime - this.lastUpdateTime >= this.updateInterval) {
        this.update();
        this.lastUpdateTime = currentTime;
      }

      requestAnimationFrame(gameLoop);
    };

    this.lastUpdateTime = Date.now();
    gameLoop();
  }

  /**
   * Update game systems
   */
  private update(): void {
    if (this.stateManager.getPhase() !== GamePhase.PLAYING && 
        this.stateManager.getPhase() !== GamePhase.WAVE_ACTIVE &&
        this.stateManager.getPhase() !== GamePhase.WAVE_COUNTDOWN) {
      return;
    }

    // Update systems
    if (this.interactionSystem) {
      this.interactionSystem.update();
    }

    if (this.servantSystem) {
      this.servantSystem.update();
    }

    if (this.enemySystem) {
      this.enemySystem.update();
    }

    if (this.aiSystem) {
      this.aiSystem.update();
    }

    // Update wave system
    if (this.waveSystem && this.buildingSystem) {
      const playerTower = this.buildingSystem.getPlayerTower();
      if (playerTower) {
        const spawnPos = new Vector3(0, 0, -25);
        this.waveSystem.update(playerTower, spawnPos);
      }
    }

    // Cleanup collected resources
    if (this.resourceSystem) {
      this.resourceSystem.cleanup();
    }

    // Update UI
    if (this.gameUI && this.buildingSystem) {
      const playerTower = this.buildingSystem.getPlayerTower();
      const aiTower = this.buildingSystem.getAITower();
      this.gameUI.update(playerTower, aiTower);
    }

    // Check win/loss conditions
    this.checkWinConditions();
  }


  /**
   * Check win/loss conditions
   */
  private checkWinConditions(): void {
    if (!this.buildingSystem || !this.gameUI) {
      return;
    }

    const playerTower = this.buildingSystem.getPlayerTower();
    const aiTower = this.buildingSystem.getAITower();

    if (!playerTower || !aiTower) {
      return;
    }

    // Check if player tower is destroyed
    if (playerTower.isDestroyed()) {
      this.endGame('ai', 'Your tower has been destroyed!');
      return;
    }

    // Check if AI tower is destroyed
    if (aiTower.isDestroyed()) {
      this.endGame('player', 'AI tower has been destroyed!');
      return;
    }

    // Check if wave is complete and compare power levels
    if (this.waveSystem && !this.waveSystem.isWaveActive() && this.waveSystem.getCurrentWave() > 0) {
      const winner = this.powerCalculator.comparePowerLevels(playerTower, aiTower);
      if (winner !== 'tie') {
        const message = winner === 'player' 
          ? 'You have the highest power level!'
          : 'AI has the highest power level!';
        this.endGame(winner, message);
      }
    }
  }

  /**
   * End the game
   */
  private endGame(winner: 'player' | 'ai' | 'tie', message: string): void {
    this.isRunning = false;
    this.stateManager.setPhase(GamePhase.GAME_OVER);
    
    if (this.gameUI) {
      this.gameUI.showGameOver(winner, message);
    }

    this.logger.info('Game Over', { winner, message, wave: this.waveSystem?.getCurrentWave() || 0 });
  }

  /**
   * Pause the game
   */
  pause(): void {
    if (this.stateManager.getPhase() === GamePhase.PLAYING) {
      this.stateManager.setPhase(GamePhase.PAUSED);
    }
  }

  /**
   * Resume the game
   */
  resume(): void {
    if (this.stateManager.getPhase() === GamePhase.PAUSED) {
      this.stateManager.setPhase(GamePhase.PLAYING);
    }
  }

  /**
   * Get scene manager
   */
  getSceneManager(): SceneManager | null {
    return this.sceneManager;
  }

  /**
   * Get state manager
   */
  getStateManager(): GameStateManager {
    return this.stateManager;
  }

  /**
   * Cleanup and dispose
   */
  dispose(): void {
    this.isRunning = false;
    if (this.interactionSystem) {
      this.interactionSystem.dispose();
    }
    if (this.sceneManager) {
      this.sceneManager.dispose();
    }
    if (this.resourceSystem) {
      this.resourceSystem.clear();
    }
    if (this.servantSystem) {
      this.servantSystem.clear();
    }
    if (this.enemySystem) {
      this.enemySystem.clear();
    }
  }
}
