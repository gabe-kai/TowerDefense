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

### Interaction System
```typescript
const logger = createCategoryLogger('InteractionSystem');

logger.info('InteractionSystem initialized');
logger.info('Resource click - servant commanded', { resourceType, position });
logger.warn('Resource click - no available servant', { resourceType, position });
logger.info('Resource added to work queue', { resourceType });
logger.info('InteractionSystem disposed');
```

### Work Queue System
```typescript
const logger = createCategoryLogger('WorkQueue');

logger.info('WorkQueue initialized');
logger.info('Task added to work queue', { taskId, type, priority, queueLength });
logger.debug('Task removed from work queue', { taskId });
logger.debug('Task moved up in queue', { taskId, newPriority });
logger.debug('Task moved down in queue', { taskId, newPriority });
logger.info('Task assigned to servant', { taskId, servantName, taskType });
logger.warn('Cannot assign task - resource already collected', { taskId });
logger.info('Task completed', { taskId, taskType });
logger.info('Work queue cleared');
```

### Servant Visual Feedback
```typescript
const logger = createCategoryLogger('Servant');

logger.debug('Resource collected, returning home', { resourceType, amount });
logger.debug('Reached home, ready to deliver', { resourceType });
logger.debug('Creating carrying indicator', { resourceType });
logger.debug('Cannot create carrying indicator - no scene reference');
```

### Servant System (Delivery Feedback and Task Assignment)
```typescript
const logger = createCategoryLogger('ServantSystem');

logger.info('Servant created', { player, position, totalServants });
logger.debug('Resource delivered', { player, type, amount });
logger.info('Resource delivered to tower', { player, type, amount });
logger.debug('Delivery feedback shown', { resourceType, amount, position });
logger.debug('Work queue task completed', { taskId, resourceType });
logger.debug('No available servants for task assignment', { unassignedTasks, totalServants });
logger.debug('Assigning tasks to servants', { unassignedTasks, availableServants });
logger.debug('Task assigned to servant', { taskId, servantName, servantState });
logger.warn('Failed to assign task to servant', { taskId });
```

### Servant Entity (Visual Feedback and Work Flow)
```typescript
const logger = createCategoryLogger('Servant');

logger.debug('Reached resource, starting work', { resourceType });
logger.debug('Resource collected, returning home', { resourceType, amount });
logger.debug('Reached home, ready to deliver', { resourceType });
logger.debug('Creating carrying indicator', { resourceType });
logger.debug('Cannot create carrying indicator - no scene reference');
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
