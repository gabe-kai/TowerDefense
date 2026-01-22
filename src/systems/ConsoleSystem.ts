/**
 * Console System - Handles command parsing and execution for developer console
 */

import { GameStateManager } from '../core/GameState';
import { ResourceInventory } from '../core/GameState';
import { createCategoryLogger } from '../utils/Logger';
import { ConsoleUI } from '../ui/ConsoleUI';

export type CommandHandler = (args: string[]) => string | void;

export class ConsoleSystem {
  private consoleUI: ConsoleUI;
  private stateManager: GameStateManager;
  private logger = createCategoryLogger('ConsoleSystem');
  private commands: Map<string, CommandHandler> = new Map();

  constructor(consoleUI: ConsoleUI) {
    this.consoleUI = consoleUI;
    this.stateManager = GameStateManager.getInstance();
    this.registerCommands();
    this.consoleUI.setCommandHandler((command) => this.handleCommand(command));
  }

  /**
   * Register all available commands
   */
  private registerCommands(): void {
    // Resource commands
    this.registerCommand('give', this.handleGiveCommand.bind(this));
    this.registerCommand('set', this.handleSetCommand.bind(this));
    this.registerCommand('resources', this.handleResourcesCommand.bind(this));
    this.registerCommand('motherlode', this.handleMotherlodeCommand.bind(this));
    
    // Help command
    this.registerCommand('help', this.handleHelpCommand.bind(this));
    this.registerCommand('clear', this.handleClearCommand.bind(this));
  }

  /**
   * Register a command handler
   */
  registerCommand(name: string, handler: CommandHandler): void {
    this.commands.set(name.toLowerCase(), handler);
  }

  /**
   * Handle command execution
   */
  private handleCommand(input: string): void {
    const parts = input.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) {
      return;
    }

    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const handler = this.commands.get(commandName);
    if (handler) {
      try {
        const result = handler(args);
        if (result) {
          this.consoleUI.addOutputLine(result, 'output');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.consoleUI.addOutputLine(`Error: ${errorMessage}`, 'error');
        this.logger.error('Command execution error', { command: commandName, error: errorMessage });
      }
    } else {
      this.consoleUI.addOutputLine(`Unknown command: ${commandName}. Type "help" for available commands.`, 'error');
    }
  }

  /**
   * Handle "give" command: give <resource> <amount> [player]
   * Examples:
   *   give wood 100
   *   give stone 50 player
   *   give gold 1000 ai
   */
  private handleGiveCommand(args: string[]): string {
    if (args.length < 2) {
      return 'Usage: give <resource> <amount> [player|ai]';
    }

    const resourceName = args[0].toLowerCase();
    const amount = parseInt(args[1], 10);
    const player = args[2]?.toLowerCase() || 'player';

    if (isNaN(amount) || amount < 0) {
      return `Invalid amount: ${args[1]}`;
    }

    if (player !== 'player' && player !== 'ai') {
      return `Invalid player: ${player}. Use "player" or "ai"`;
    }

    const validResources: (keyof ResourceInventory)[] = ['wood', 'stone', 'gold', 'crystal', 'essence', 'mana'];
    if (!validResources.includes(resourceName as keyof ResourceInventory)) {
      return `Invalid resource: ${resourceName}. Valid resources: ${validResources.join(', ')}`;
    }

    this.stateManager.addResource(player, resourceName as keyof ResourceInventory, amount);
    const current = this.stateManager.getResources(player)[resourceName as keyof ResourceInventory];
    
    this.logger.info('Resource given via console', { resource: resourceName, amount, player, total: current });
    return `Gave ${amount} ${resourceName} to ${player}. Total: ${current}`;
  }

  /**
   * Handle "set" command: set <resource> <amount> [player]
   * Examples:
   *   set wood 500
   *   set stone 200 player
   */
  private handleSetCommand(args: string[]): string {
    if (args.length < 2) {
      return 'Usage: set <resource> <amount> [player|ai]';
    }

    const resourceName = args[0].toLowerCase();
    const amount = parseInt(args[1], 10);
    const player = args[2]?.toLowerCase() || 'player';

    if (isNaN(amount) || amount < 0) {
      return `Invalid amount: ${args[1]}`;
    }

    if (player !== 'player' && player !== 'ai') {
      return `Invalid player: ${player}. Use "player" or "ai"`;
    }

    const validResources: (keyof ResourceInventory)[] = ['wood', 'stone', 'gold', 'crystal', 'essence', 'mana'];
    if (!validResources.includes(resourceName as keyof ResourceInventory)) {
      return `Invalid resource: ${resourceName}. Valid resources: ${validResources.join(', ')}`;
    }

    const current = this.stateManager.getResources(player);
    const oldAmount = current[resourceName as keyof ResourceInventory];
    const difference = amount - oldAmount;
    
    if (difference !== 0) {
      this.stateManager.addResource(player, resourceName as keyof ResourceInventory, difference);
    }
    
    this.logger.info('Resource set via console', { resource: resourceName, amount, player });
    return `Set ${resourceName} to ${amount} for ${player} (was ${oldAmount})`;
  }

  /**
   * Handle "resources" command: Show current resources
   * Examples:
   *   resources
   *   resources player
   *   resources ai
   */
  private handleResourcesCommand(args: string[]): string {
    const player = args[0]?.toLowerCase() || 'player';
    
    if (player !== 'player' && player !== 'ai') {
      return `Invalid player: ${player}. Use "player" or "ai"`;
    }

    const resources = this.stateManager.getResources(player);
    const lines = [
      `${player.toUpperCase()} Resources:`,
      `  Wood: ${resources.wood}`,
      `  Stone: ${resources.stone}`,
      `  Gold: ${resources.gold}`,
      `  Crystal: ${resources.crystal}`,
      `  Essence: ${resources.essence}`,
      `  Mana: ${resources.mana}`
    ];
    
    return lines.join('\n');
  }

  /**
   * Handle "motherlode" command: Give 10,000 of all resources
   * Examples:
   *   motherlode
   *   motherlode player
   *   motherlode ai
   */
  private handleMotherlodeCommand(args: string[]): string {
    const player = args[0]?.toLowerCase() || 'player';
    const amount = 10000;
    
    if (player !== 'player' && player !== 'ai') {
      return `Invalid player: ${player}. Use "player" or "ai"`;
    }

    const validResources: (keyof ResourceInventory)[] = ['wood', 'stone', 'gold', 'crystal', 'essence', 'mana'];
    
    // Give all resources
    validResources.forEach(resource => {
      this.stateManager.addResource(player, resource, amount);
    });

    const current = this.stateManager.getResources(player);
    
    this.logger.info('Motherlode cheat used', { player, amount });
    
    const lines = [
      `Motherlode! Gave ${amount} of all resources to ${player}.`,
      '',
      'Current Resources:',
      `  Wood: ${current.wood}`,
      `  Stone: ${current.stone}`,
      `  Gold: ${current.gold}`,
      `  Crystal: ${current.crystal}`,
      `  Essence: ${current.essence}`,
      `  Mana: ${current.mana}`
    ];
    
    return lines.join('\n');
  }

  /**
   * Handle "help" command
   */
  private handleHelpCommand(): string {
    const helpText = [
      'Available Commands:',
      '  give <resource> <amount> [player|ai]  - Give resources (default: player)',
      '  set <resource> <amount> [player|ai]   - Set resource amount (default: player)',
      '  resources [player|ai]                 - Show current resources (default: player)',
      '  motherlode [player|ai]               - Give 10,000 of all resources (default: player)',
      '  clear                                 - Clear console output',
      '  help                                  - Show this help message',
      '',
      'Resources: wood, stone, gold, crystal, essence, mana',
      '',
      'Examples:',
      '  give wood 100',
      '  give stone 50 player',
      '  set gold 1000',
      '  motherlode',
      '  motherlode ai',
      '  resources ai'
    ];
    
    return helpText.join('\n');
  }

  /**
   * Handle "clear" command
   */
  private handleClearCommand(): void {
    this.consoleUI.clear();
  }

  /**
   * Toggle console visibility
   */
  toggle(): void {
    this.consoleUI.toggle();
  }

  /**
   * Check if console is visible
   */
  isVisible(): boolean {
    return this.consoleUI.isConsoleVisible();
  }
}
