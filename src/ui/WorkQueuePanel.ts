/**
 * Work Queue Panel - Displays and manages the work queue
 */

import { WorkQueue, WorkTask } from '../systems/WorkQueue';
import { Resource } from '../entities/Resource';
import { Vector3 } from '@babylonjs/core';

export class WorkQueuePanel {
  private container: HTMLDivElement;
  private workQueue: WorkQueue;
  private isVisible: boolean = false;
  private updateInterval: number | null = null;
  private clickHandler: ((e: MouseEvent) => void) | null = null;

  constructor(containerId: string = 'work-queue-panel') {
    this.workQueue = WorkQueue.getInstance();
    this.container = this.createContainer(containerId);
    this.hide();
  }

  private createContainer(id: string): HTMLDivElement {
    let container = document.getElementById(id) as HTMLDivElement;
    
    if (!container) {
      container = document.createElement('div');
      container.id = id;
      document.body.appendChild(container);
    }
    
    // Always ensure the container has the correct class and initial state
    container.className = 'work-queue-panel';
    container.style.display = 'none';

    return container;
  }

  /**
   * Show work queue panel
   */
  show(): void {
    this.isVisible = true;
    this.container.style.display = 'block';
    this.update();
    
    // Update panel periodically
    if (this.updateInterval === null) {
      this.updateInterval = window.setInterval(() => {
        if (this.isVisible) {
          this.update();
        }
      }, 500); // Update every 500ms
    }
  }

  /**
   * Hide work queue panel
   */
  hide(): void {
    this.isVisible = false;
    this.container.style.display = 'none';
    
    if (this.updateInterval !== null) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Toggle panel visibility
   */
  toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Update panel content
   */
  update(): void {
    const tasks = this.workQueue.getAllTasks();
    
    if (tasks.length === 0) {
      this.container.innerHTML = `
        <div class="work-queue-content">
          <div class="work-queue-header">
            <h3>Work Queue</h3>
            <button class="work-queue-close" id="work-queue-close-btn">×</button>
          </div>
          <div class="work-queue-empty">No tasks in queue</div>
        </div>
      `;
      
      // Set up close button
      const closeBtn = document.getElementById('work-queue-close-btn');
      if (closeBtn) {
        closeBtn.onclick = () => this.hide();
      }
      
      return;
    }

    let tasksHtml = '<div class="work-queue-tasks">';
    tasks.forEach((task, index) => {
      // Skip tasks with invalid targets (e.g., collected resources)
      if (task.type === 'collect' && task.target instanceof Resource && task.target.isCollected()) {
        return; // Skip this task
      }

      const taskDescription = this.getTaskDescription(task);
      const assignedTo = task.assignedServant 
        ? task.assignedServant.getMesh().name 
        : 'Pending';
      const canMoveUp = index > 0 && !task.assignedServant; // Can't reorder assigned tasks
      const canMoveDown = index < tasks.length - 1 && !task.assignedServant;

      const taskId = task.id;
      tasksHtml += `
        <div class="work-queue-task" data-task-id="${taskId}">
          <div class="work-queue-task-info">
            <div class="work-queue-task-description">${this.escapeHtml(taskDescription)}</div>
            <div class="work-queue-task-assignment">Assigned: ${this.escapeHtml(assignedTo)}</div>
          </div>
          <div class="work-queue-task-actions">
            <button class="work-queue-move-up" ${!canMoveUp ? 'disabled' : ''} 
              data-task-id="${taskId}" data-action="move-up" title="Move Up">↑</button>
            <button class="work-queue-move-down" ${!canMoveDown ? 'disabled' : ''} 
              data-task-id="${taskId}" data-action="move-down" title="Move Down">↓</button>
            <button class="work-queue-remove" 
              data-task-id="${taskId}" data-action="remove" title="Remove">×</button>
          </div>
        </div>
      `;
    });
    tasksHtml += '</div>';

    // Filter out invalid tasks for count
    const validTasks = tasks.filter(t => 
      !(t.type === 'collect' && t.target instanceof Resource && t.target.isCollected())
    );

    this.container.innerHTML = `
      <div class="work-queue-content">
        <div class="work-queue-header">
          <h3>Work Queue (${validTasks.length})</h3>
          <button class="work-queue-close" id="work-queue-close-btn">×</button>
        </div>
        ${tasksHtml}
      </div>
    `;

    // Set up close button
    const closeBtn = document.getElementById('work-queue-close-btn');
    if (closeBtn) {
      closeBtn.onclick = () => this.hide();
    }

    // Remove old click handler if it exists
    if (this.clickHandler) {
      this.container.removeEventListener('click', this.clickHandler);
    }

    // Set up task action buttons using event delegation
    this.clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.dataset.action && target.dataset.taskId) {
        const taskId = target.dataset.taskId;
        const action = target.dataset.action;
        
        if (action === 'move-up') {
          this.workQueue.moveTaskUp(taskId);
          this.update();
        } else if (action === 'move-down') {
          this.workQueue.moveTaskDown(taskId);
          this.update();
        } else if (action === 'remove') {
          this.workQueue.removeTask(taskId);
          this.update();
        }
      }
    };
    
    this.container.addEventListener('click', this.clickHandler);
  }

  /**
   * Get human-readable task description
   */
  private getTaskDescription(task: WorkTask): string {
    if (task.type === 'collect' && task.target instanceof Resource) {
      return `Collect ${task.target.getType()} (${task.target.getAmount()})`;
    } else if (task.type === 'move' && task.target instanceof Vector3) {
      return `Move to (${Math.round(task.target.x)}, ${Math.round(task.target.z)})`;
    }
    return `${task.type} task`;
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

  /**
   * Dispose and cleanup
   */
  dispose(): void {
    if (this.updateInterval !== null) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    if (this.clickHandler) {
      this.container.removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }
    this.hide();
  }
}
