/**
 * Info Panel - Displays information about selected objects
 */

export interface ObjectInfo {
  name: string;
  type: string;
  details: Record<string, string | number>;
  actions?: ActionButton[];
}

export interface ActionButton {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export class InfoPanel {
  private container: HTMLDivElement;
  private isVisible: boolean = false;

  constructor(containerId: string = 'info-panel') {
    this.container = this.createContainer(containerId);
    this.hide();
  }

  private createContainer(id: string): HTMLDivElement {
    let container = document.getElementById(id) as HTMLDivElement;
    
    if (!container) {
      container = document.createElement('div');
      container.id = id;
      container.className = 'info-panel';
      document.body.appendChild(container);
    }

    return container;
  }

  /**
   * Show info panel with object information
   */
  show(info: ObjectInfo): void {
    this.isVisible = true;
    this.container.style.display = 'block';
    this.updateContent(info);
  }

  /**
   * Hide info panel
   */
  hide(): void {
    this.isVisible = false;
    this.container.style.display = 'none';
  }

  /**
   * Update panel content
   */
  private updateContent(info: ObjectInfo): void {
    const nameHtml = `<h3 class="info-panel-name">${this.escapeHtml(info.name)}</h3>`;
    const typeHtml = `<div class="info-panel-type">${this.escapeHtml(info.type)}</div>`;
    
    let detailsHtml = '';
    if (Object.keys(info.details).length > 0) {
      detailsHtml = '<div class="info-panel-details">';
      Object.entries(info.details).forEach(([key, value]) => {
        const label = this.formatLabel(key);
        detailsHtml += `<div class="info-panel-detail-item">
          <span class="info-panel-detail-label">${this.escapeHtml(label)}:</span>
          <span class="info-panel-detail-value">${this.escapeHtml(String(value))}</span>
        </div>`;
      });
      detailsHtml += '</div>';
    }

    let actionsHtml = '';
    if (info.actions && info.actions.length > 0) {
      actionsHtml = '<div class="info-panel-actions">';
      info.actions.forEach((action, index) => {
        const disabledAttr = action.disabled ? 'disabled' : '';
        const buttonId = `info-panel-action-${index}`;
        actionsHtml += `<button class="info-panel-action-button" id="${buttonId}" ${disabledAttr}>${this.escapeHtml(action.label)}</button>`;
      });
      actionsHtml += '</div>';

      // Attach event listeners after a brief delay to ensure DOM is ready
      setTimeout(() => {
        info.actions!.forEach((action, index) => {
          const button = document.getElementById(`info-panel-action-${index}`);
          if (button && !action.disabled) {
            button.addEventListener('click', action.onClick);
          }
        });
      }, 0);
    }

    this.container.innerHTML = `
      <div class="info-panel-content">
        <button class="info-panel-close" onclick="document.getElementById('${this.container.id}').style.display='none'">×</button>
        ${nameHtml}
        ${typeHtml}
        ${detailsHtml}
        ${actionsHtml}
      </div>
    `;
  }

  /**
   * Format label (convert camelCase to Title Case)
   */
  private formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Check if panel is visible
   */
  isPanelVisible(): boolean {
    return this.isVisible;
  }
}
