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
import { GameScale } from '../utils/GameScale';
import { SeededRandom } from '../utils/SeededRandom';

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
  private seededRandom: SeededRandom;

  // Game loop
  private lastUpdateTime: number = 0;
  private updateInterval: number = 16; // ~60 FPS

  constructor(canvasId: string, seed?: number) {
    const canvasElement = document.getElementById(canvasId);
    if (!canvasElement || !(canvasElement instanceof HTMLCanvasElement)) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }
    this.canvas = canvasElement;
    this.stateManager = GameStateManager.getInstance();
    this.powerCalculator = PowerCalculator.getInstance();
    
    // Initialize seeded random number generator
    // Check for seed in URL parameter, otherwise generate new seed
    const urlParams = new URLSearchParams(window.location.search);
    const seedParam = urlParams.get('seed');
    const gameSeed = seedParam ? parseInt(seedParam, 10) : seed;
    
    this.seededRandom = new SeededRandom(gameSeed);
    const seedValue = this.seededRandom.getSeed();
    this.logger.info('Game initialized with seeded randomization', { 
      seed: seedValue,
      seedUrl: `?seed=${seedValue}`,
      note: 'Use ?seed=<number> in URL to replay with same terrain'
    });
    
    // Log seed to console for easy sharing
    console.log(`%cGame Seed: ${seedValue}`, 'color: #4CAF50; font-weight: bold; font-size: 14px;');
    console.log(`%cReplay URL: ${window.location.origin}${window.location.pathname}?seed=${seedValue}`, 'color: #2196F3;');
  }

  /**
   * Initialize the game
   */
  async initialize(): Promise<void> {
    // Create scene with seeded random for terrain generation
    this.sceneManager = new SceneManager(this.canvas, this.seededRandom);
    const scene = this.sceneManager.getScene();
    
    // Get terrain manager early (needed for resource system)
    const terrainManager = this.sceneManager.getTerrainManager();

    // Initialize systems
    this.resourceSystem = new ResourceSystem(scene, terrainManager || undefined);
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

    // Create towers positioned 2km apart on opposite sides of the valley
    // Towers are placed on hills with slight randomization
    
    // Base positions: 2km apart (1000m on each side of center)
    const baseDistance = GameScale.TOWER_DISTANCE / 2; // 1000m from center
    const randomization = GameScale.TOWER_RANDOMIZATION_RANGE; // ±500m (expanded)
    
    // Find best tower positions with bias toward higher ground
    // Sample multiple candidate positions and pick the highest ones
    const findBestTowerPosition = (baseX: number, baseZ: number, side: 'player' | 'ai'): Vector3 => {
      const candidates: Array<{ x: number; z: number; y: number }> = [];
      
      // Generate candidate positions within randomization range
      for (let i = 0; i < GameScale.TOWER_PLACEMENT_SAMPLES; i++) {
        const offsetX = (this.seededRandom.next() - 0.5) * randomization;
        const offsetZ = (this.seededRandom.next() - 0.5) * randomization;
        const candidateX = baseX + offsetX;
        const candidateZ = baseZ + offsetZ;
        
        if (terrainManager) {
          const candidateY = terrainManager.getHeightAt(candidateX, candidateZ);
          // Adjusted for raised terrain (base elevation +10m, so sea level is effectively -10m)
          const seaLevel = -10.0;
          const landThreshold = -9.0; // At least 1m above sea level (now -9m)
          
          // Only consider positions on land
          if (candidateY > landThreshold) {
            candidates.push({ x: candidateX, z: candidateZ, y: candidateY });
          }
        }
      }
      
      // Sort by elevation (highest first) and pick the best
      candidates.sort((a, b) => b.y - a.y);
      
      if (candidates.length > 0) {
        const best = candidates[0];
        this.logger.debug(`Best ${side} tower position found`, { 
          x: best.x, 
          z: best.z, 
          elevation: best.y,
          candidatesTested: candidates.length 
        });
        return new Vector3(best.x, best.y, best.z);
      }
      
      // Fallback: use base position
      const fallbackY = terrainManager ? terrainManager.getHeightAt(baseX, baseZ) : 0;
      const landThreshold = -9.0; // Adjusted for raised terrain
      this.logger.warn(`No valid ${side} tower position found, using base position`, { x: baseX, z: baseZ });
      return new Vector3(baseX, Math.max(fallbackY, landThreshold), baseZ);
    };
    
    // Find best positions for both towers (with bias toward higher ground)
    const playerTowerPos = findBestTowerPosition(-baseDistance, 0, 'player');
    const aiTowerPos = findBestTowerPosition(baseDistance, 0, 'ai');
    
    const playerTower = this.buildingSystem.createPlayerTower(playerTowerPos);
    const aiTower = this.buildingSystem.createAITower(aiTowerPos);

    // Initialize AI
    this.aiSystem.initialize(aiTower);

    // Create initial servant for player (on terrain, near tower)
    // Servant cylinder center should be at half its height above terrain
    const servantPos = playerTowerPos.clone();
    servantPos.x += 2; // 2 meters to the right of tower
    
    // Sample terrain height for servant position
    if (terrainManager) {
      const terrainHeight = terrainManager.getHeightAt(servantPos.x, servantPos.z);
      servantPos.y = terrainHeight + GameScale.SERVANT_HEIGHT / 2; // Half height above terrain
    } else {
      servantPos.y = GameScale.SERVANT_HEIGHT / 2; // Fallback to ground level
    }
    
    this.servantSystem.createServant(servantPos, 'player');

    // Spawn initial resources
    this.resourceSystem.spawnRandomResources(20);

    // Initialize UI
    const camera = this.sceneManager.getCamera();
    this.gameUI = new GameUI(
      this.waveSystem, 
      this.buildingSystem,
      this.resourceSystem,
      this.servantSystem,
      camera
    );

    // Start render loop
    this.sceneManager.render();

    // Set initial game phase
    this.stateManager.setPhase(GamePhase.PLAYING);

    // Start the game (set isRunning before starting loop)
    this.isRunning = true;

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
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
    
    // Always update camera controls (even when paused)
    if (this.sceneManager) {
      this.sceneManager.updateCamera(deltaTime);
    }

    if (this.stateManager.getPhase() !== GamePhase.PLAYING && 
        this.stateManager.getPhase() !== GamePhase.WAVE_ACTIVE &&
        this.stateManager.getPhase() !== GamePhase.WAVE_COUNTDOWN) {
      this.lastUpdateTime = currentTime; // Update time even when paused
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
      this.gameUI.updateMinimap();
      this.gameUI.updateCompass();
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
