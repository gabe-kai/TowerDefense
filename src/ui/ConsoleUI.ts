/**
 * Console UI - Developer console overlay for cheat codes and debugging
 */

export class ConsoleUI {
  private container: HTMLDivElement;
  private input: HTMLInputElement;
  private output!: HTMLDivElement; // Definite assignment - set in createOutput()
  private isVisible: boolean = false;
  private commandHistory: string[] = [];
  private historyIndex: number = -1;
  private onCommand: ((command: string) => void) | null = null;

  constructor(containerId: string = 'console') {
    this.container = this.createContainer(containerId);
    this.input = this.createInput();
    this.output = this.createOutput();
    this.hide();
    this.setupEventListeners();
  }

  private createContainer(id: string): HTMLDivElement {
    let container = document.getElementById(id) as HTMLDivElement;
    
    if (!container) {
      container = document.createElement('div');
      container.id = id;
      container.className = 'console';
      document.body.appendChild(container);
    }
    
    container.style.display = 'none';
    return container;
  }

  private createInput(): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'console-input';
    input.placeholder = 'Enter command (e.g., "give wood 100")...';
    input.autocomplete = 'off';
    this.container.appendChild(input);
    return input;
  }

  private createOutput(): HTMLDivElement {
    const output = document.createElement('div');
    output.className = 'console-output';
    this.container.appendChild(output);
    // Assign to this.output before calling addOutputLine
    this.output = output;
    this.addOutputLine('Developer Console - Type "help" for available commands', 'system');
    return output;
  }

  private setupEventListeners(): void {
    // Stop all keyboard events from propagating when console input is focused
    this.input.addEventListener('keydown', (e) => {
      // Stop propagation to prevent camera controls from receiving these events
      e.stopPropagation();
      
      if (e.key === 'Enter') {
        e.preventDefault();
        this.executeCommand();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateHistory(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateHistory(1);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.hide();
      }
    });

    // Also stop keyup events
    this.input.addEventListener('keyup', (e) => {
      e.stopPropagation();
    });

    // Stop all keypress events
    this.input.addEventListener('keypress', (e) => {
      e.stopPropagation();
    });

    // Focus input when console is shown
    this.container.addEventListener('click', () => {
      this.input.focus();
    });
  }

  private navigateHistory(direction: number): void {
    if (this.commandHistory.length === 0) return;

    if (direction < 0) {
      // Up arrow - go back in history
      if (this.historyIndex === -1) {
        this.historyIndex = this.commandHistory.length - 1;
      } else if (this.historyIndex > 0) {
        this.historyIndex--;
      }
    } else {
      // Down arrow - go forward in history
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
      } else {
        this.historyIndex = -1;
        this.input.value = '';
        return;
      }
    }

    this.input.value = this.commandHistory[this.historyIndex];
  }

  private executeCommand(): void {
    const command = this.input.value.trim();
    if (!command) return;

    // Add to history
    this.commandHistory.push(command);
    this.historyIndex = -1; // Reset history navigation

    // Display command in output
    this.addOutputLine(`> ${command}`, 'command');

    // Clear input
    this.input.value = '';

    // Execute command
    if (this.onCommand) {
      this.onCommand(command);
    }
  }

  /**
   * Set command handler
   */
  setCommandHandler(handler: (command: string) => void): void {
    this.onCommand = handler;
  }

  /**
   * Add output line to console
   */
  addOutputLine(text: string, type: 'command' | 'output' | 'error' | 'system' = 'output'): void {
    const line = document.createElement('div');
    line.className = `console-line console-line-${type}`;
    line.textContent = text;
    this.output.appendChild(line);
    
    // Auto-scroll to bottom
    this.output.scrollTop = this.output.scrollHeight;

    // Limit output lines to prevent memory issues
    const maxLines = 100;
    while (this.output.children.length > maxLines) {
      this.output.removeChild(this.output.firstChild!);
    }
  }

  /**
   * Clear console output
   */
  clear(): void {
    this.output.innerHTML = '';
    this.addOutputLine('Console cleared', 'system');
  }

  /**
   * Show console
   */
  show(): void {
    this.isVisible = true;
    this.container.style.display = 'block';
    // Focus input after a short delay to ensure it's visible
    setTimeout(() => {
      this.input.focus();
    }, 10);
  }

  /**
   * Hide console
   */
  hide(): void {
    this.isVisible = false;
    this.container.style.display = 'none';
    this.input.blur();
  }

  /**
   * Toggle console visibility
   */
  toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Check if console is visible
   */
  isConsoleVisible(): boolean {
    return this.isVisible;
  }
}
