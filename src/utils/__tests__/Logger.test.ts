/**
 * Logger Tests
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Logger, LogLevel, createCategoryLogger } from '../Logger';

describe('Logger', () => {
  let logger: Logger;
  let consoleSpy: any;

  beforeEach(() => {
    logger = Logger.getInstance();
    logger.setLevel(LogLevel.DEBUG);
    
    // Spy on console methods
    consoleSpy = {
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
      info: vi.spyOn(console, 'info').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {})
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Log Levels', () => {
    it('should log debug messages when level is DEBUG', async () => {
      logger.setLevel(LogLevel.DEBUG);
      logger.debug('Test', 'Debug message');
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(consoleSpy.debug).toHaveBeenCalled();
    });

    it('should not log debug messages when level is INFO', async () => {
      logger.setLevel(LogLevel.INFO);
      logger.debug('Test', 'Debug message');
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(consoleSpy.debug).not.toHaveBeenCalled();
    });

    it('should log info messages', async () => {
      logger.info('Test', 'Info message');
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(consoleSpy.info).toHaveBeenCalled();
    });

    it('should log warning messages', async () => {
      logger.warn('Test', 'Warning message');
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('should log error messages', async () => {
      const error = new Error('Test error');
      logger.error('Test', 'Error message', error);
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });

  describe('Category Logging', () => {
    it('should create category logger', async () => {
      const categoryLogger = createCategoryLogger('GameSystem');
      categoryLogger.info('Test message');
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(consoleSpy.info).toHaveBeenCalled();
    });
  });

  describe('Custom Outputs', () => {
    it('should call custom output functions', () => {
      const customOutput = vi.fn();
      logger.addOutput(customOutput);
      logger.info('Test', 'Message');
      
      // Wait for async logging
      return new Promise(resolve => {
        setTimeout(() => {
          expect(customOutput).toHaveBeenCalled();
          expect(customOutput.mock.calls[0][0].category).toBe('Test');
          expect(customOutput.mock.calls[0][0].message).toBe('Message');
          resolve(undefined);
        }, 10);
      });
    });

    it('should remove custom outputs', () => {
      const customOutput = vi.fn();
      logger.addOutput(customOutput);
      logger.removeOutput(customOutput);
      logger.info('Test', 'Message');
      
      return new Promise(resolve => {
        setTimeout(() => {
          expect(customOutput).not.toHaveBeenCalled();
          resolve(undefined);
        }, 10);
      });
    });
  });
});
