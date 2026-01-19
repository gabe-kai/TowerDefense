import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/main.ts',
        '**/index.html',
        '**/entities/**', // Entities require full 3D setup - integration tests
        '**/core/SceneManager.ts', // Requires WebGL - integration tests
        '**/core/Game.ts', // Requires full game setup - integration tests
        '**/ui/**', // UI requires DOM - integration tests
        '**/assets/AssetManager.ts', // Requires full asset pipeline
        '**/assets/PrimitiveFactory.ts' // Requires 3D scene
      ],
      thresholds: {
        lines: 50, // Realistic for MVP unit tests
        functions: 50,
        branches: 40, // Lower for branches (more edge cases)
        statements: 50
      }
    },
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    exclude: ['node_modules', 'dist']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
