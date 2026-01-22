/**
 * ConsoleSystem Tests
 * 
 * Comprehensive tests for developer console command parsing and execution
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConsoleSystem } from '../ConsoleSystem';
import { ConsoleUI } from '../../ui/ConsoleUI';
import { GameStateManager } from '../../core/GameState';

// Mock GameStateManager
const mockStateManager = {
  getResources: vi.fn((player: 'player' | 'ai') => ({
    wood: 0,
    stone: 0,
    gold: 0,
    crystal: 0,
    essence: 0,
    mana: 0
  })),
  addResource: vi.fn()
};

// Mock ConsoleUI
const mockConsoleUI = {
  setCommandHandler: vi.fn(),
  addOutputLine: vi.fn(),
  clear: vi.fn(),
  toggle: vi.fn(),
  isConsoleVisible: vi.fn(() => false)
};

vi.mock('../../core/GameState', () => ({
  GameStateManager: {
    getInstance: vi.fn(() => mockStateManager)
  }
}));

vi.mock('../../ui/ConsoleUI', () => ({
  ConsoleUI: vi.fn().mockImplementation(() => mockConsoleUI)
}));

vi.mock('../../utils/Logger', () => ({
  createCategoryLogger: vi.fn(() => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }))
}));

describe('ConsoleSystem', () => {
  let consoleSystem: ConsoleSystem;
  let commandHandler: ((command: string) => void) | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    // Capture the command handler when setCommandHandler is called
    mockConsoleUI.setCommandHandler.mockImplementation((handler: (command: string) => void) => {
      commandHandler = handler;
    });
    consoleSystem = new ConsoleSystem(mockConsoleUI as any);
  });

  describe('Command Parsing', () => {
    it('should parse simple commands', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('help');
      expect(mockConsoleUI.addOutputLine).toHaveBeenCalled();
    });

    it('should parse commands with arguments', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('give wood 100');
      expect(mockStateManager.addResource).toHaveBeenCalled();
    });

    it('should handle empty command', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('');
      // Empty commands should not call addOutputLine
      expect(mockConsoleUI.addOutputLine).not.toHaveBeenCalled();
    });

    it('should handle whitespace-only command', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('   ');
      // Whitespace-only commands should not call addOutputLine
      expect(mockConsoleUI.addOutputLine).not.toHaveBeenCalled();
    });

    it('should be case-insensitive for commands', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('HELP');
      expect(mockConsoleUI.addOutputLine).toHaveBeenCalled();
      mockConsoleUI.addOutputLine.mockClear();
      
      commandHandler('Help');
      expect(mockConsoleUI.addOutputLine).toHaveBeenCalled();
      mockConsoleUI.addOutputLine.mockClear();
      
      commandHandler('help');
      expect(mockConsoleUI.addOutputLine).toHaveBeenCalled();
    });
  });

  describe('Help Command', () => {
    it('should show help message', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('help');
      
      expect(mockConsoleUI.addOutputLine).toHaveBeenCalled();
      const callArgs = mockConsoleUI.addOutputLine.mock.calls[0];
      expect(callArgs[0]).toContain('Available Commands');
    });

    it('should list all available commands', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('help');
      
      const callArgs = mockConsoleUI.addOutputLine.mock.calls[0];
      expect(callArgs[0]).toContain('motherlode');
      expect(callArgs[0]).toContain('give');
      expect(callArgs[0]).toContain('help');
    });
  });

  describe('Motherlode Command', () => {
    it('should add resources to player', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('motherlode player');
      
      expect(mockStateManager.addResource).toHaveBeenCalledWith('player', 'wood', 10000);
      expect(mockStateManager.addResource).toHaveBeenCalledWith('player', 'stone', 10000);
      expect(mockStateManager.addResource).toHaveBeenCalledWith('player', 'gold', 10000);
      expect(mockStateManager.addResource).toHaveBeenCalledWith('player', 'crystal', 10000);
      expect(mockStateManager.addResource).toHaveBeenCalledWith('player', 'essence', 10000);
      expect(mockStateManager.addResource).toHaveBeenCalledWith('player', 'mana', 10000);
    });

    it('should add resources to AI', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('motherlode ai');
      
      expect(mockStateManager.addResource).toHaveBeenCalledWith('ai', 'wood', 10000);
    });

    it('should default to player when no argument', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('motherlode');
      
      expect(mockStateManager.addResource).toHaveBeenCalledWith('player', 'wood', 10000);
    });

    it('should reject invalid player argument', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('motherlode invalid');
      
      expect(mockConsoleUI.addOutputLine).toHaveBeenCalled();
      const callArgs = mockConsoleUI.addOutputLine.mock.calls[0];
      expect(callArgs[0]).toContain('Invalid player');
    });
  });

  describe('Give Command', () => {
    it('should add specific resource to player', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('give wood 100');
      
      expect(mockStateManager.addResource).toHaveBeenCalledWith('player', 'wood', 100);
    });

    it('should add specific resource to AI', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('give stone 50 ai');
      
      expect(mockStateManager.addResource).toHaveBeenCalledWith('ai', 'stone', 50);
    });

    it('should require resource and amount', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('give');
      
      expect(mockConsoleUI.addOutputLine).toHaveBeenCalled();
      const callArgs = mockConsoleUI.addOutputLine.mock.calls[0];
      expect(callArgs[0]).toContain('Usage: give');
    });

    it('should validate resource type', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('give invalid 100');
      
      expect(mockConsoleUI.addOutputLine).toHaveBeenCalled();
      const callArgs = mockConsoleUI.addOutputLine.mock.calls[0];
      expect(callArgs[0]).toContain('Invalid resource');
    });

    it('should validate player argument', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('give wood 100 invalid');
      
      expect(mockConsoleUI.addOutputLine).toHaveBeenCalled();
      const callArgs = mockConsoleUI.addOutputLine.mock.calls[0];
      expect(callArgs[0]).toContain('Invalid player');
    });

    it('should parse numeric amount correctly', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('give gold 500');
      
      expect(mockStateManager.addResource).toHaveBeenCalledWith('player', 'gold', 500);
    });

    it('should handle zero amount', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('give wood 0');
      
      expect(mockStateManager.addResource).toHaveBeenCalledWith('player', 'wood', 0);
    });

    it('should reject non-numeric amount', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('give wood abc');
      
      expect(mockConsoleUI.addOutputLine).toHaveBeenCalled();
      const callArgs = mockConsoleUI.addOutputLine.mock.calls[0];
      expect(callArgs[0]).toContain('Invalid amount');
    });

    describe('All Resource Types', () => {
      const resourceTypes = ['wood', 'stone', 'gold', 'crystal', 'essence', 'mana'];
      
      resourceTypes.forEach(resourceType => {
        it(`should add ${resourceType} resource`, () => {
          if (!commandHandler) throw new Error('Command handler not set');
          commandHandler(`give ${resourceType} 100`);
          
          expect(mockStateManager.addResource).toHaveBeenCalledWith('player', resourceType, 100);
        });
      });
    });
  });

  describe('Unknown Commands', () => {
    it('should handle unknown command', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('unknowncommand');
      
      expect(mockConsoleUI.addOutputLine).toHaveBeenCalled();
      const callArgs = mockConsoleUI.addOutputLine.mock.calls[0];
      expect(callArgs[0]).toContain('Unknown command');
    });

    it('should suggest help for unknown command', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('unknowncommand');
      
      const callArgs = mockConsoleUI.addOutputLine.mock.calls[0];
      expect(callArgs[0]).toContain('help');
    });
  });

  describe('Edge Cases', () => {
    it('should handle commands with extra whitespace', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('  help  ');
      
      expect(mockConsoleUI.addOutputLine).toHaveBeenCalled();
    });

    it('should handle commands with multiple spaces', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('give   wood   100');
      
      expect(mockStateManager.addResource).toHaveBeenCalledWith('player', 'wood', 100);
    });

    it('should handle very long commands', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      const longCommand = 'give wood ' + '1'.repeat(100);
      commandHandler(longCommand);
      
      // Should parse correctly or fail gracefully
      expect(mockConsoleUI.addOutputLine).toHaveBeenCalled();
    });

    it('should handle special characters in command', () => {
      if (!commandHandler) throw new Error('Command handler not set');
      commandHandler('help!@#$%');
      
      expect(mockConsoleUI.addOutputLine).toHaveBeenCalled();
      const callArgs = mockConsoleUI.addOutputLine.mock.calls[0];
      expect(callArgs[0]).toContain('Unknown command');
    });
  });
});
