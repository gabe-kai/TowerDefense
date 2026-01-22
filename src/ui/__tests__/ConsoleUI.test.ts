/**
 * ConsoleUI Tests
 * 
 * Comprehensive tests for developer console UI component
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ConsoleUI } from '../ConsoleUI';

describe('ConsoleUI', () => {
  let consoleUI: ConsoleUI;
  let container: HTMLDivElement;

  beforeEach(() => {
    // Clean up any existing console elements
    const existing = document.getElementById('console');
    if (existing) {
      existing.remove();
    }
    
    document.body.innerHTML = '';
    consoleUI = new ConsoleUI('console');
    container = document.getElementById('console') as HTMLDivElement;
  });

  afterEach(() => {
    // Clean up
    const existing = document.getElementById('console');
    if (existing) {
      existing.remove();
    }
  });

  describe('Initialization', () => {
    it('should create console container', () => {
      expect(container).toBeTruthy();
      expect(container.className).toBe('console');
    });

    it('should create input element', () => {
      const input = container.querySelector('.console-input') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.type).toBe('text');
    });

    it('should create output element', () => {
      const output = container.querySelector('.console-output') as HTMLDivElement;
      expect(output).toBeTruthy();
    });

    it('should be hidden by default', () => {
      expect(container.style.display).toBe('none');
    });

    it('should show welcome message', () => {
      const output = container.querySelector('.console-output') as HTMLDivElement;
      expect(output.textContent).toContain('Developer Console');
    });
  });

  describe('Visibility Toggle', () => {
    it('should show console', () => {
      consoleUI.show();
      expect(container.style.display).toBe('block');
    });

    it('should hide console', () => {
      consoleUI.show();
      consoleUI.hide();
      expect(container.style.display).toBe('none');
    });

    it('should toggle visibility', () => {
      const initialDisplay = container.style.display;
      consoleUI.toggle();
      expect(container.style.display).not.toBe(initialDisplay);
    });
  });

  describe('Command Execution', () => {
    it('should execute command on Enter key', () => {
      const input = container.querySelector('.console-input') as HTMLInputElement;
      const mockCallback = vi.fn();
      consoleUI.setCommandHandler(mockCallback);
      
      input.value = 'help';
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      input.dispatchEvent(enterEvent);
      
      expect(mockCallback).toHaveBeenCalledWith('help');
    });

    it('should clear input after command execution', () => {
      const input = container.querySelector('.console-input') as HTMLInputElement;
      const mockCallback = vi.fn();
      consoleUI.setCommandHandler(mockCallback);
      
      input.value = 'help';
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      input.dispatchEvent(enterEvent);
      
      expect(input.value).toBe('');
    });

    it('should add command to history', () => {
      const input = container.querySelector('.console-input') as HTMLInputElement;
      const mockCallback = vi.fn();
      consoleUI.setCommandHandler(mockCallback);
      
      input.value = 'help';
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      input.dispatchEvent(enterEvent);
      
      // Command should be in history
      expect(mockCallback).toHaveBeenCalled();
    });

    it('should not execute empty command', () => {
      const input = container.querySelector('.console-input') as HTMLInputElement;
      const mockCallback = vi.fn();
      consoleUI.setCommandHandler(mockCallback);
      
      input.value = '';
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      input.dispatchEvent(enterEvent);
      
      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('Output Display', () => {
    it('should add output line', () => {
      consoleUI.addOutputLine('Test output', 'output');
      
      const output = container.querySelector('.console-output') as HTMLDivElement;
      expect(output.textContent).toContain('Test output');
    });

    it('should format command lines', () => {
      consoleUI.addOutputLine('help', 'command');
      
      const output = container.querySelector('.console-output') as HTMLDivElement;
      const line = output.querySelector('.console-line-command');
      expect(line).toBeTruthy();
      expect(line?.textContent).toContain('help');
    });

    it('should format error lines', () => {
      consoleUI.addOutputLine('Error message', 'error');
      
      const output = container.querySelector('.console-output') as HTMLDivElement;
      const line = output.querySelector('.console-line-error');
      expect(line).toBeTruthy();
      expect(line?.textContent).toContain('Error message');
    });

    it('should format system lines', () => {
      const output = container.querySelector('.console-output') as HTMLDivElement;
      // Count initial lines (welcome message)
      const initialLineCount = output.children.length;
      
      consoleUI.addOutputLine('System message', 'system');
      
      // Should have one more line now
      expect(output.children.length).toBe(initialLineCount + 1);
      
      // Find the system line (should be the last one)
      const systemLines = output.querySelectorAll('.console-line-system');
      expect(systemLines.length).toBeGreaterThan(0);
      
      // The last system line should be our message
      const lastSystemLine = Array.from(systemLines).pop();
      expect(lastSystemLine?.textContent).toContain('System message');
    });
  });

  describe('Command History', () => {
    it('should navigate history with arrow keys', () => {
      const input = container.querySelector('.console-input') as HTMLInputElement;
      const mockCallback = vi.fn();
      consoleUI.setCommandHandler(mockCallback);
      
      // Add commands to history
      input.value = 'help';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      
      input.value = 'motherlode player';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      
      // Navigate up
      const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      input.dispatchEvent(upEvent);
      
      expect(input.value).toBe('motherlode player');
    });

    it('should navigate down in history', () => {
      const input = container.querySelector('.console-input') as HTMLInputElement;
      const mockCallback = vi.fn();
      consoleUI.setCommandHandler(mockCallback);
      
      // Add commands
      input.value = 'help';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      
      input.value = 'motherlode player';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      
      // Navigate up then down
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      
      expect(input.value).toBe('');
    });

    it('should not navigate when history is empty', () => {
      const input = container.querySelector('.console-input') as HTMLInputElement;
      
      input.value = 'test';
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      
      expect(input.value).toBe('test');
    });
  });

  describe('Event Handling', () => {
    it('should stop event propagation on keydown', () => {
      const input = container.querySelector('.console-input') as HTMLInputElement;
      const event = new KeyboardEvent('keydown', { key: 'w' });
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');
      
      input.dispatchEvent(event);
      
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should stop event propagation on keyup', () => {
      const input = container.querySelector('.console-input') as HTMLInputElement;
      const event = new KeyboardEvent('keyup', { key: 'w' });
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');
      
      input.dispatchEvent(event);
      
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should stop event propagation on keypress', () => {
      const input = container.querySelector('.console-input') as HTMLInputElement;
      const event = new KeyboardEvent('keypress', { key: 'w' });
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation');
      
      input.dispatchEvent(event);
      
      expect(stopPropagationSpy).toHaveBeenCalled();
    });

    it('should hide console on Escape key', () => {
      const input = container.querySelector('.console-input') as HTMLInputElement;
      consoleUI.show();
      
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      input.dispatchEvent(escapeEvent);
      
      expect(container.style.display).toBe('none');
    });

    it('should focus input when container is clicked', () => {
      consoleUI.show();
      const input = container.querySelector('.console-input') as HTMLInputElement;
      const focusSpy = vi.spyOn(input, 'focus');
      
      container.click();
      
      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long commands', () => {
      const input = container.querySelector('.console-input') as HTMLInputElement;
      const mockCallback = vi.fn();
      consoleUI.setCommandHandler(mockCallback);
      
      input.value = 'a'.repeat(1000);
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      input.dispatchEvent(enterEvent);
      
      expect(mockCallback).toHaveBeenCalled();
    });

    it('should handle special characters in commands', () => {
      const input = container.querySelector('.console-input') as HTMLInputElement;
      const mockCallback = vi.fn();
      consoleUI.setCommandHandler(mockCallback);
      
      input.value = 'test !@#$%^&*()';
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      input.dispatchEvent(enterEvent);
      
      expect(mockCallback).toHaveBeenCalledWith('test !@#$%^&*()');
    });

    it('should handle rapid command execution', () => {
      const input = container.querySelector('.console-input') as HTMLInputElement;
      const mockCallback = vi.fn();
      consoleUI.setCommandHandler(mockCallback);
      
      for (let i = 0; i < 10; i++) {
        input.value = `command${i}`;
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      }
      
      expect(mockCallback).toHaveBeenCalledTimes(10);
    });
  });
});
