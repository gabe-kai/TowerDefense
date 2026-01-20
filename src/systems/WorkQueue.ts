/**
 * Work Queue System - Manages global task queue for servants
 */

import { Resource } from '../entities/Resource';
import { Servant } from '../entities/Servant';
import { Vector3 } from '@babylonjs/core';
import { createCategoryLogger } from '../utils/Logger';

export type TaskType = 'collect' | 'move';

export interface WorkTask {
  id: string;
  type: TaskType;
  target: Resource | Vector3;
  priority: number; // Lower number = higher priority
  assignedServant: Servant | null;
  createdAt: number;
}

export class WorkQueue {
  private static instance: WorkQueue;
  private tasks: WorkTask[] = [];
  private nextTaskId: number = 0;
  private logger = createCategoryLogger('WorkQueue');

  private constructor() {
    this.logger.info('WorkQueue initialized');
  }

  static getInstance(): WorkQueue {
    if (!WorkQueue.instance) {
      WorkQueue.instance = new WorkQueue();
    }
    return WorkQueue.instance;
  }

  /**
   * Add a task to the work queue
   */
  addTask(type: TaskType, target: Resource | Vector3, priority: number = 0): string {
    const taskId = `task_${this.nextTaskId++}`;
    const task: WorkTask = {
      id: taskId,
      type,
      target,
      priority,
      assignedServant: null,
      createdAt: Date.now()
    };

    // Insert task based on priority (lower priority number = higher priority)
    const insertIndex = this.tasks.findIndex(t => t.priority > priority);
    if (insertIndex === -1) {
      this.tasks.push(task);
    } else {
      this.tasks.splice(insertIndex, 0, task);
    }

    this.logger.info('Task added to work queue', { taskId, type, priority, queueLength: this.tasks.length });
    return taskId;
  }

  /**
   * Remove a task from the queue
   */
  removeTask(taskId: string): boolean {
    const index = this.tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.logger.debug('Task removed from work queue', { taskId });
      return true;
    }
    return false;
  }

  /**
   * Move task up in priority (decrease priority number)
   */
  moveTaskUp(taskId: string): boolean {
    const index = this.tasks.findIndex(t => t.id === taskId);
    if (index === -1 || index === 0) {
      return false; // Task not found or already at top
    }

    const task = this.tasks[index];
    const previousTask = this.tasks[index - 1];
    
    // Swap priorities
    const tempPriority = task.priority;
    task.priority = previousTask.priority;
    previousTask.priority = tempPriority;

    // Re-sort tasks
    this.tasks.sort((a, b) => a.priority - b.priority);

    this.logger.debug('Task moved up in queue', { taskId, newPriority: task.priority });
    return true;
  }

  /**
   * Move task down in priority (increase priority number)
   */
  moveTaskDown(taskId: string): boolean {
    const index = this.tasks.findIndex(t => t.id === taskId);
    if (index === -1 || index === this.tasks.length - 1) {
      return false; // Task not found or already at bottom
    }

    const task = this.tasks[index];
    const nextTask = this.tasks[index + 1];
    
    // Swap priorities
    const tempPriority = task.priority;
    task.priority = nextTask.priority;
    nextTask.priority = tempPriority;

    // Re-sort tasks
    this.tasks.sort((a, b) => a.priority - b.priority);

    this.logger.debug('Task moved down in queue', { taskId, newPriority: task.priority });
    return true;
  }

  /**
   * Assign a task to a servant
   */
  assignTask(taskId: string, servant: Servant): boolean {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task || task.assignedServant) {
      return false; // Task not found or already assigned
    }

    // Check if task target is still valid
    if (task.type === 'collect' && task.target instanceof Resource) {
      if (task.target.isCollected()) {
        this.logger.warn('Cannot assign task - resource already collected', { taskId });
        this.removeTask(taskId);
        return false;
      }
    }

    task.assignedServant = servant;
    
    // Add command to servant's queue
    if (task.type === 'collect' && task.target instanceof Resource) {
      servant.queueCollectCommand(task.target);
    } else if (task.type === 'move' && task.target instanceof Vector3) {
      servant.queueMoveCommand(task.target);
    }

    this.logger.info('Task assigned to servant', { 
      taskId, 
      servantName: servant.getMesh().name,
      taskType: task.type 
    });
    return true;
  }

  /**
   * Get next unassigned task
   */
  getNextUnassignedTask(): WorkTask | null {
    return this.tasks.find(t => !t.assignedServant) || null;
  }

  /**
   * Get all tasks
   */
  getAllTasks(): WorkTask[] {
    return [...this.tasks];
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(assigned: boolean): WorkTask[] {
    return this.tasks.filter(t => assigned ? t.assignedServant !== null : t.assignedServant === null);
  }

  /**
   * Get task by ID
   */
  getTask(taskId: string): WorkTask | null {
    return this.tasks.find(t => t.id === taskId) || null;
  }

  /**
   * Complete a task (remove from queue)
   */
  completeTask(taskId: string): boolean {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      this.removeTask(taskId);
      this.logger.info('Task completed', { taskId, taskType: task.type });
      return true;
    }
    return false;
  }

  /**
   * Clear all tasks
   */
  clear(): void {
    this.tasks = [];
    this.logger.info('Work queue cleared');
  }

  /**
   * Get queue length
   */
  getLength(): number {
    return this.tasks.length;
  }
}
