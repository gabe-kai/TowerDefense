# Testing Guide

## Overview

This project uses **Vitest** for testing, which is Vite-native and provides fast test execution.

## Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are located alongside source files with the pattern:
- `src/**/*.test.ts` - Unit tests
- `src/**/*.spec.ts` - Specification tests

## Test Categories

### Unit Tests
Test individual functions, classes, and utilities in isolation.

**Example**: `src/utils/__tests__/Logger.test.ts`

### Integration Tests
Test how multiple systems work together.

**Example**: Test resource collection flow (ResourceSystem + ServantSystem)

### System Tests
Test entire game systems end-to-end.

**Example**: Test complete wave spawning and combat

## Mocking Babylon.js

Babylon.js is mocked in `src/test/setup.ts` to allow testing game logic without requiring WebGL/3D rendering.

For integration tests that need real 3D rendering, use a separate test environment.

## Coverage Goals

- **Target**: 70-80% coverage for core systems
- **Focus Areas**:
  - Game systems (ResourceSystem, ServantSystem, BuildingSystem, etc.)
  - Utilities (Pathfinding, PowerCalculator, Logger)
  - Components (ResourceComponent, BuildingComponent, CombatComponent)

## Writing Tests

### Example Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { MyClass } from '../MyClass';

describe('MyClass', () => {
  let instance: MyClass;

  beforeEach(() => {
    instance = new MyClass();
  });

  it('should do something', () => {
    expect(instance.method()).toBe(expected);
  });
});
```

### Using Test Helpers

```typescript
import { createTestResource, createTestServant } from '../test/helpers';

const resource = createTestResource(ResourceType.WOOD, 5);
const servant = createTestServant('servant_1', createVector3(0, 0, 0));
```

## Best Practices

1. **Test one thing at a time** - Each test should verify a single behavior
2. **Use descriptive names** - Test names should clearly describe what they test
3. **Arrange-Act-Assert** - Structure tests clearly
4. **Mock external dependencies** - Don't test Babylon.js, test your game logic
5. **Keep tests fast** - Unit tests should run in milliseconds
6. **Test edge cases** - Don't just test happy paths

## Continuous Integration

Tests should run automatically in CI/CD pipelines. The project is configured to fail builds if coverage drops below thresholds.
