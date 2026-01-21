/**
 * Compass - Shows camera direction using cardinal directions
 */

import { FreeCamera } from '@babylonjs/core';

export class Compass {
  private container: HTMLDivElement;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private camera: FreeCamera | null = null;
  
  private canvasSize = 60; // Compass size in pixels (bigger than 40, but still compact)
  private radius = 24; // Compass radius (scaled proportionally)

  constructor(containerId: string = 'compass') {
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
      container.className = 'compass';
      // Position as overlay on minimap
      const minimapContainer = document.getElementById('minimap');
      if (minimapContainer) {
        minimapContainer.appendChild(container);
      } else {
        document.body.appendChild(container);
      }
    } else {
      container.className = 'compass';
    }

    return container;
  }

  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = this.canvasSize;
    canvas.height = this.canvasSize;
    canvas.className = 'compass-canvas';
    this.container.appendChild(canvas);
    return canvas;
  }

  /**
   * Set camera reference for tracking
   */
  setCamera(camera: FreeCamera): void {
    this.camera = camera;
  }

  /**
   * Update compass display
   */
  update(): void {
    if (!this.ctx || !this.camera) {
      return;
    }

    const centerX = this.canvasSize / 2;
    const centerY = this.canvasSize / 2;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);

    // Draw compass background circle
    this.ctx.fillStyle = 'rgba(20, 15, 30, 0.9)';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.strokeStyle = '#8b6f47';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Get camera rotation (yaw is horizontal rotation around Y axis)
    // FreeCamera uses rotation.y for yaw
    // Convert to degrees and adjust for compass (0 = North, 90 = East, etc.)
    const yaw = this.camera.rotation.y;
    const angleDegrees = (yaw * 180 / Math.PI) % 360;
    const compassAngle = (angleDegrees + 90) % 360; // Adjust so 0 = North

    // Draw cardinal directions
    this.drawCardinalDirections(centerX, centerY, compassAngle);

    // Draw direction indicator (arrow pointing in camera direction)
    this.drawDirectionIndicator(centerX, centerY, compassAngle);
  }

  /**
   * Draw cardinal directions (N, E, S, W)
   */
  private drawCardinalDirections(centerX: number, centerY: number, rotation: number): void {
    const directions = [
      { label: 'N', angle: 0, color: '#ff4a4a' },   // North - Red
      { label: 'E', angle: 90, color: '#4a9eff' },   // East - Blue
      { label: 'S', angle: 180, color: '#4aff4a' },  // South - Green
      { label: 'W', angle: 270, color: '#ffaa4a' }   // West - Orange
    ];

    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(-rotation * Math.PI / 180); // Rotate compass to show camera direction

    directions.forEach(dir => {
      const angle = (dir.angle - 90) * Math.PI / 180; // Convert to radians, adjust for screen coordinates
      const x = Math.cos(angle) * (this.radius - 5);
      const y = Math.sin(angle) * (this.radius - 5);

      // Draw direction line
      this.ctx.strokeStyle = dir.color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(Math.cos(angle) * this.radius, Math.sin(angle) * this.radius);
      this.ctx.stroke();

      // Draw label
      this.ctx.fillStyle = dir.color;
      this.ctx.font = 'bold 10px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(dir.label, x, y);
    });

    this.ctx.restore();
  }

  /**
   * Draw direction indicator (arrow showing camera facing direction)
   */
  private drawDirectionIndicator(centerX: number, centerY: number, rotation: number): void {
    // Draw center dot
    this.ctx.fillStyle = '#ffff00';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw arrow pointing forward (always points up/North, compass rotates around it)
    this.ctx.strokeStyle = '#ffff00';
    this.ctx.fillStyle = '#ffff00';
    this.ctx.lineWidth = 3;
    
    const arrowLength = this.radius - 20;
    const arrowHeadSize = 8;
    
    // Arrow shaft
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY);
    this.ctx.lineTo(centerX, centerY - arrowLength);
    this.ctx.stroke();

    // Arrow head (pointing up/North)
    this.ctx.beginPath();
    this.ctx.moveTo(centerX, centerY - arrowLength);
    this.ctx.lineTo(centerX - arrowHeadSize / 2, centerY - arrowLength + arrowHeadSize);
    this.ctx.lineTo(centerX + arrowHeadSize / 2, centerY - arrowLength + arrowHeadSize);
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * Dispose of compass
   */
  dispose(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
