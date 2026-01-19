# Logging System Guide

## Overview

The project uses a unified logging system that provides structured, environment-aware logging with multiple output destinations.

## Quick Start

```typescript
import { createCategoryLogger } from '@/utils/Logger';

const logger = createCategoryLogger('MySystem');

logger.info('Game started');
logger.warn('Low resources');
logger.error('Failed to load', error);
logger.debug('Debug info', { data: 'value' });
```

## Log Levels

- **DEBUG** (0) - Detailed information for debugging
- **INFO** (1) - General informational messages
- **WARN** (2) - Warning messages for potential issues
- **ERROR** (3) - Error messages for failures

## Usage

### Category Logger (Recommended)

Create a logger for a specific category (system, component, etc.):

```typescript
import { createCategoryLogger } from '@/utils/Logger';

const logger = createCategoryLogger('ResourceSystem');

logger.info('Resource spawned', { type: 'wood', amount: 5 });
logger.error('Failed to spawn resource', error);
```

### Direct Logger Access

```typescript
import { getLogger } from '@/utils/Logger';

const logger = getLogger();
logger.info('ResourceSystem', 'Resource spawned', { type: 'wood' });
```

### Setting Log Level

```typescript
import { getLogger, LogLevel } from '@/utils/Logger';

const logger = getLogger();
logger.setLevel(LogLevel.WARN); // Only show warnings and errors
```

## Environment Awareness

- **Development**: Defaults to DEBUG level (verbose)
- **Production**: Defaults to INFO level (minimal)

The logger automatically detects the environment and adjusts verbosity.

## Log Format

Logs include:
- **Timestamp** - ISO format timestamp
- **Level** - DEBUG, INFO, WARN, or ERROR
- **Category** - System/component name
- **Message** - Human-readable message
- **Data** (optional) - Additional context data
- **Error** (optional) - Error object for error logs

Example output:
```
[2024-01-15T10:30:45.123Z] [INFO] [ResourceSystem] Resource spawned { type: 'wood', amount: 5 }
```

## Custom Outputs

Add custom output destinations (file, remote service, etc.):

```typescript
import { getLogger, LogOutput, LogEntry } from '@/utils/Logger';

const fileOutput: LogOutput = (entry: LogEntry) => {
  // Write to file, send to server, etc.
  console.log(JSON.stringify(entry));
};

const logger = getLogger();
logger.addOutput(fileOutput);
```

## Best Practices

1. **Use category loggers** - Create a logger per system/component
2. **Choose appropriate levels** - Don't use ERROR for warnings
3. **Include context** - Pass relevant data objects
4. **Don't log sensitive data** - Avoid passwords, tokens, etc.
5. **Use structured data** - Pass objects, not concatenated strings

## Examples by System

### Resource System
```typescript
const logger = createCategoryLogger('ResourceSystem');

logger.debug('Spawning resource', { type, position });
logger.info('Resource collected', { type, amount });
logger.warn('No resources available');
logger.error('Failed to spawn resource', error);
```

### Servant System
```typescript
const logger = createCategoryLogger('ServantSystem');

logger.debug('Servant created', { id, position });
logger.info('Servant collecting resource', { servantId, resourceId });
logger.warn('No available servants');
logger.error('Servant pathfinding failed', error);
```

### Building System
```typescript
const logger = createCategoryLogger('BuildingSystem');

logger.debug('Building placement validated', { type, position });
logger.info('Building constructed', { type, cost });
logger.warn('Insufficient resources', { required, available });
logger.error('Building placement failed', error);
```

### Wave System
```typescript
const logger = createCategoryLogger('WaveSystem');

logger.debug('Wave config generated', { waveNumber, enemyCount });
logger.info('Wave started', { waveNumber, enemyCount });
logger.warn('Wave triggered early');
logger.error('Wave spawning failed', error);
```

## Performance

- Logging is **asynchronous** to avoid blocking game loop
- Logs are batched and processed in the background
- Console output is optimized for performance

## Future Enhancements

- File logging (Node.js environment)
- Remote logging service integration
- Log filtering and search
- Performance metrics logging
- Log rotation and archival
