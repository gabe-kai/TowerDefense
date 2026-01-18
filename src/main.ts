/**
 * Main entry point
 */

import { Game } from './core/Game';

// Suppress known Firefox/Babylon.js WEBGL deprecation warning
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  const message = args.join(' ');
  // Filter out the WEBGL_debug_renderer_info deprecation warning
  if (message.includes('WEBGL_debug_renderer_info is deprecated')) {
    return; // Suppress this specific warning
  }
  originalWarn.apply(console, args);
};

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const game = new Game('renderCanvas');
    await game.initialize();
    
    // Auto-start game
    game.start();

    // Expose game to window for debugging
    (window as any).game = game;
  } catch (error) {
    console.error('Failed to initialize game:', error);
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: red; color: white; padding: 20px; z-index: 10000;';
    errorDiv.textContent = `Failed to initialize game: ${error}`;
    document.body.appendChild(errorDiv);
  }
});
