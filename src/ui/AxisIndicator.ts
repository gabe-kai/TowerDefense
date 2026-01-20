/**
 * Axis Indicator - Small UI element showing X, Y, Z axes
 */

export class AxisIndicator {
  private container: HTMLDivElement;

  constructor(containerId: string = 'axis-indicator') {
    this.container = this.createContainer(containerId);
    this.createDisplay();
  }

  private createContainer(id: string): HTMLDivElement {
    let container = document.getElementById(id) as HTMLDivElement;
    
    if (!container) {
      container = document.createElement('div');
      container.id = id;
      document.body.appendChild(container);
    }
    
    // Always ensure it has the correct class
    container.className = 'axis-indicator';
    container.style.display = 'block'; // Ensure it's visible

    return container;
  }

  private createDisplay(): void {
    this.container.innerHTML = `
      <div class="axis-indicator-title">Axes</div>
      <div class="axis-indicator-content">
        <div class="axis-item">
          <div class="axis-color" style="background-color: #ff0000;"></div>
          <span class="axis-label">X</span>
        </div>
        <div class="axis-item">
          <div class="axis-color" style="background-color: #00ff00;"></div>
          <span class="axis-label">Y</span>
        </div>
        <div class="axis-item">
          <div class="axis-color" style="background-color: #0000ff;"></div>
          <span class="axis-label">Z</span>
        </div>
      </div>
    `;
  }

  /**
   * Update axis indicator (if needed in future)
   */
  update(): void {
    // Could update based on camera rotation, etc.
  }

  /**
   * Dispose of the indicator
   */
  dispose(): void {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
