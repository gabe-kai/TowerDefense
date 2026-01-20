/**
 * Minimap - Shows game world overview with camera position and direction
 */

import { ArcRotateCamera, Vector3 } from '@babylonjs/core';
import { BuildingSystem } from '../systems/BuildingSystem';
import { ResourceSystem } from '../systems/ResourceSystem';
import { ServantSystem } from '../systems/ServantSystem';

export class Minimap {
  private container: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private camera: ArcRotateCamera | null = null;
  private buildingSystem: BuildingSystem | null = null;
  private resourceSystem: ResourceSystem | null = null;
  private servantSystem: ServantSystem | null = null;
  
  // Minimap bounds (world coordinates)
  private worldBounds = {
    minX: -30,
    maxX: 30,
    minZ: -30,
    maxZ: 30
  };
  
  private canvasSize = 200; // Minimap size in pixels

  constructor(containerId: string = 'minimap') {
    this.container = this.createContainer(containerId);
    this.canvas = this.createCanvas();
    this.ctx = this.canvas.getContext('2d')!;
    this.update();
  }

  private createContainer(id: string): HTMLDivElement {
    let container = document.getElementById(id) as HTMLDivElement;
    
    if (!container) {
      container = document.createElement('div');
      container.id = id;
      container.className = 'minimap';
      document.body.appendChild(container);
    } else {
      container.className = 'minimap';
    }

    return container;
  }

  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasSize;
    canvas.height = this.canvasSize;
    canvas.className = 'minimap-canvas';
    this.container.appendChild(canvas);
    return canvas;
  }

  /**
   * Set camera reference for tracking
   */
  setCamera(camera: ArcRotateCamera): void {
    this.camera = camera;
  }

  /**
   * Set system references for displaying entities
   */
  setSystems(
    buildingSystem: BuildingSystem,
    resourceSystem: ResourceSystem,
    servantSystem: ServantSystem
  ): void {
    this.buildingSystem = buildingSystem;
    this.resourceSystem = resourceSystem;
    this.servantSystem = servantSystem;
  }

  /**
   * Convert world position to minimap coordinates
   */
  private worldToMinimap(worldPos: Vector3): { x: number; y: number } {
    const normalizedX = (worldPos.x - this.worldBounds.minX) / (this.worldBounds.maxX - this.worldBounds.minX);
    const normalizedZ = (worldPos.z - this.worldBounds.minZ) / (this.worldBounds.maxZ - this.worldBounds.minZ);
    
    return {
      x: normalizedX * this.canvasSize,
      y: (1 - normalizedZ) * this.canvasSize // Flip Z (screen Y is inverted)
    };
  }

  /**
   * Update minimap display
   */
  update(): void {
    if (!this.ctx) {
      return;
    }

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);

    // Draw background
    this.ctx.fillStyle = 'rgba(20, 15, 30, 0.9)';
    this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);

    // Draw grid
    this.drawGrid();

    // Draw towers
    this.drawTowers();

    // Draw resources
    this.drawResources();

    // Draw servants
    this.drawServants();

    // Draw camera position and direction
    this.drawCamera();
  }

  /**
   * Draw grid lines
   */
  private drawGrid(): void {
    this.ctx.strokeStyle = 'rgba(139, 111, 71, 0.3)';
    this.ctx.lineWidth = 1;

    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const pos = (i / gridLines) * this.canvasSize;
      
      // Vertical lines
      this.ctx.beginPath();
      this.ctx.moveTo(pos, 0);
      this.ctx.lineTo(pos, this.canvasSize);
      this.ctx.stroke();

      // Horizontal lines
      this.ctx.beginPath();
      this.ctx.moveTo(0, pos);
      this.ctx.lineTo(this.canvasSize, pos);
      this.ctx.stroke();
    }
  }

  /**
   * Draw towers on minimap
   */
  private drawTowers(): void {
    if (!this.buildingSystem) {
      return;
    }

    const playerTower = this.buildingSystem.getPlayerTower();
    const aiTower = this.buildingSystem.getAITower();

    if (playerTower) {
      const pos = this.worldToMinimap(playerTower.getPosition());
      this.ctx.fillStyle = '#4a9eff'; // Blue for player
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
      this.ctx.fill();
    }

    if (aiTower) {
      const pos = this.worldToMinimap(aiTower.getPosition());
      this.ctx.fillStyle = '#ff4a4a'; // Red for AI
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * Draw resources on minimap
   */
  private drawResources(): void {
    if (!this.resourceSystem) {
      return;
    }

    const resources = this.resourceSystem.getAllResources();
    resources.forEach(resource => {
      if (!resource.isCollected()) {
        const pos = this.worldToMinimap(resource.getPosition());
        const type = resource.getType();
        
        // Color by resource type
        const colors: Record<string, string> = {
          'wood': '#8b4513',
          'stone': '#808080',
          'gold': '#ffd700',
          'crystal': '#9370db',
          'essence': '#00ff7f',
          'mana': '#4169e1'
        };
        
        this.ctx.fillStyle = colors[type] || '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
  }

  /**
   * Draw servants on minimap
   */
  private drawServants(): void {
    if (!this.servantSystem) {
      return;
    }

    const servants = this.servantSystem.getAllServants();
    servants.forEach(servant => {
      const pos = this.worldToMinimap(servant.getPosition());
      this.ctx.fillStyle = '#90ee90'; // Light green for servants
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  /**
   * Draw camera position and facing direction
   */
  private drawCamera(): void {
    if (!this.camera) {
      return;
    }

    // Get camera position (projected to ground level for minimap)
    const cameraPos = this.camera.position;
    const groundPos = new Vector3(cameraPos.x, 0, cameraPos.z);
    const pos = this.worldToMinimap(groundPos);

    // Draw camera position
    this.ctx.fillStyle = '#ffff00'; // Yellow for camera
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw camera facing direction
    // ArcRotateCamera alpha is horizontal rotation (around Y axis)
    const alpha = this.camera.alpha;
    const directionLength = 15;
    const dirX = Math.cos(alpha) * directionLength;
    const dirY = -Math.sin(alpha) * directionLength; // Negative because screen Y is inverted

    this.ctx.strokeStyle = '#ffff00';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x, pos.y);
    this.ctx.lineTo(pos.x + dirX, pos.y + dirY);
    this.ctx.stroke();

    // Draw arrow head
    const arrowAngle = Math.atan2(dirY, dirX);
    const arrowSize = 5;
    const arrowAngle1 = arrowAngle + Math.PI * 0.8;
    const arrowAngle2 = arrowAngle - Math.PI * 0.8;
    
    this.ctx.beginPath();
    this.ctx.moveTo(pos.x + dirX, pos.y + dirY);
    this.ctx.lineTo(
      pos.x + dirX - Math.cos(arrowAngle1) * arrowSize,
      pos.y + dirY - Math.sin(arrowAngle1) * arrowSize
    );
    this.ctx.moveTo(pos.x + dirX, pos.y + dirY);
    this.ctx.lineTo(
      pos.x + dirX - Math.cos(arrowAngle2) * arrowSize,
      pos.y + dirY - Math.sin(arrowAngle2) * arrowSize
    );
    this.ctx.stroke();
  }

  /**
   * Dispose of minimap
   */
  dispose(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
