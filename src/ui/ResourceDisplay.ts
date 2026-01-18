/**
 * Resource Display - Resource counter UI
 */

import { GameStateManager } from '../core/GameState';

export class ResourceDisplay {
  private container: HTMLDivElement;
  private stateManager: GameStateManager;

  constructor(containerId: string) {
    this.stateManager = GameStateManager.getInstance();
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }
    this.container = container as HTMLDivElement;
    this.createDisplay();
  }

  private createDisplay(): void {
    this.container.innerHTML = '';
    this.container.className = 'resource-display';

    const resources = ['wood', 'stone', 'gold', 'crystal', 'essence', 'mana'];
    const icons: Record<string, string> = {
      wood: '🪵',
      stone: '🪨',
      gold: '🪙',
      crystal: '💎',
      essence: '✨',
      mana: '🔮'
    };

    resources.forEach(resource => {
      const resourceDiv = document.createElement('div');
      resourceDiv.className = 'resource-item';
      resourceDiv.id = `resource-${resource}`;
      
      const icon = document.createElement('span');
      icon.className = 'resource-icon';
      icon.textContent = icons[resource] || '●';
      
      const label = document.createElement('span');
      label.className = 'resource-label';
      label.textContent = resource.charAt(0).toUpperCase() + resource.slice(1);
      
      const value = document.createElement('span');
      value.className = 'resource-value';
      value.id = `resource-value-${resource}`;
      value.textContent = '0';

      resourceDiv.appendChild(icon);
      resourceDiv.appendChild(label);
      resourceDiv.appendChild(value);
      this.container.appendChild(resourceDiv);
    });
  }

  /**
   * Update resource display
   */
  update(): void {
    const resources = this.stateManager.getResources('player');
    const resourceElements = {
      wood: document.getElementById('resource-value-wood'),
      stone: document.getElementById('resource-value-stone'),
      gold: document.getElementById('resource-value-gold'),
      crystal: document.getElementById('resource-value-crystal'),
      essence: document.getElementById('resource-value-essence'),
      mana: document.getElementById('resource-value-mana')
    };

    Object.entries(resources).forEach(([key, value]) => {
      const element = resourceElements[key as keyof typeof resources];
      if (element) {
        element.textContent = value.toString();
      }
    });
  }
}
