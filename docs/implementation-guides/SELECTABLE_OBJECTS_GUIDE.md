# Selectable Objects Guide

## Overview

The Interaction System automatically detects and handles selectable objects in the game. When a player hovers over or clicks on a selectable object, it will:
- Show a yellow glow on hover
- Display an info panel with object details on click
- Allow interaction-specific actions (e.g., commanding servants to collect resources)

## How It Works

The `InteractionSystem` checks mesh metadata to identify selectable objects. Each selectable object type must have specific metadata attached to its mesh.

## Supported Object Types

Currently supported selectable objects:
- **Resources** - Resource nodes that can be collected
- **Towers** - Player and AI towers
- **Servants** - Player-controlled servants
- **Buildings** - Ground structures and tower floors

## Adding a New Selectable Object Type

To add a new selectable object type, follow these steps:

### Step 1: Add Metadata to Mesh

When creating your entity's mesh, add the appropriate metadata:

```typescript
// Example: Adding metadata for a new "Enemy" selectable object
export class Enemy {
  private mesh: Mesh;
  
  constructor(position: Vector3) {
    this.mesh = this.createMesh(position);
    // Add metadata - use a unique key for your object type
    this.mesh.metadata = { 
      ...this.mesh.metadata, 
      enemy: this  // Use lowercase singular form
    };
  }
  
  getMesh(): Mesh {
    return this.mesh;
  }
}
```

### Step 2: Update InteractionSystem.getSelectableObject()

Add a check for your new object type in `InteractionSystem.ts`:

```typescript
private getSelectableObject(mesh: Mesh): { getName: () => string; getObjectInfo: () => ObjectInfo; isSelectable: () => boolean } | null {
  if (!mesh.metadata) {
    return null;
  }

  // ... existing checks ...

  // Add your new check here
  if (mesh.metadata.enemy) {
    const enemy = mesh.metadata.enemy as Enemy;
    return {
      getName: () => this.getEnemyName(enemy),
      getObjectInfo: () => this.getEnemyInfo(enemy),
      isSelectable: () => !enemy.isDead() // Example: only selectable if alive
    };
  }

  return null;
}
```

### Step 3: Add Info Methods

Add methods to generate the name and info for your object:

```typescript
/**
 * Get enemy name
 */
private getEnemyName(enemy: Enemy): string {
  return `${enemy.getType()} Enemy`;
}

/**
 * Get enemy info
 */
private getEnemyInfo(enemy: Enemy): ObjectInfo {
  return {
    name: this.getEnemyName(enemy),
    type: 'Enemy',
    details: {
      type: enemy.getType(),
      health: enemy.getHealth(),
      maxHealth: enemy.getMaxHealth(),
      attack: enemy.getAttack(),
      speed: enemy.getSpeed()
    }
  };
}
```

### Step 4: Add Click Handler (Optional)

If your object needs special click behavior (like resources adding to work queue), add a handler:

```typescript
private handlePointerClick(pickInfo: PickingInfo): void {
  // ... existing code ...
  
  const hitMesh = pickInfo.pickedMesh;
  const selectable = this.getSelectableObject(hitMesh);
  
  if (selectable && selectable.isSelectable()) {
    // Show info panel
    const objectInfo = selectable.getObjectInfo();
    
    // Add action buttons if needed
    if (hitMesh.metadata && hitMesh.metadata.enemy) {
      const enemy = hitMesh.metadata.enemy as Enemy;
      objectInfo.actions = [{
        label: 'Attack Enemy',
        onClick: () => this.handleEnemyClick(enemy),
        disabled: false
      }];
    }
    
    this.infoPanel.show(objectInfo);
  }
}

private handleEnemyClick(enemy: Enemy): void {
  // Your custom click logic here
  this.workQueue.addTask('attack', enemy); // Example: add to work queue
  this.logger.info('Enemy clicked', { enemyType: enemy.getType() });
}
```

## Metadata Requirements

### Required Metadata Keys

Use lowercase, singular forms for metadata keys:
- `resource` - For Resource objects
- `tower` - For Tower objects
- `servant` - For Servant objects
- `building` - For Building objects
- `enemy` - For Enemy objects (example)

### Metadata Structure

```typescript
mesh.metadata = {
  // Your object reference (required)
  yourObjectType: yourObjectInstance,
  
  // Optional: Additional metadata
  component: buildingComponent,  // For buildings
  buildingType: BuildingType.TURRET,  // For buildings
  // ... other metadata
}
```

## ObjectInfo Structure

The `ObjectInfo` interface requires:

```typescript
interface ObjectInfo {
  name: string;        // Display name (e.g., "Wood Resource")
  type: string;        // Object type (e.g., "Resource", "Tower")
  details: Record<string, string | number>;  // Key-value pairs of information
}
```

### Details Best Practices

- Use descriptive keys (e.g., `health`, `maxHealth`, not `h`, `mh`)
- Format numbers appropriately (e.g., `health: 100` not `health: "100"`)
- Include relevant stats (health, attack, defense, etc.)
- Use boolean strings for clarity (e.g., `collected: "Yes"` or `"No"`)

## Examples

### Example 1: Resource (Already Implemented)

```typescript
// In Resource.ts
this.mesh.metadata = { resource: this };

// In InteractionSystem.ts
if (mesh.metadata.resource) {
  const resource = mesh.metadata.resource as Resource;
  return {
    getName: () => this.getResourceName(resource),
    getObjectInfo: () => this.getResourceInfo(resource),
    isSelectable: () => !resource.isCollected()
  };
}
```

### Example 2: Tower (Already Implemented)

```typescript
// In Tower.ts
this.baseMesh.metadata = { ...this.baseMesh.metadata, tower: this };

// In InteractionSystem.ts
if (mesh.metadata.tower) {
  const tower = mesh.metadata.tower as Tower;
  return {
    getName: () => this.getTowerName(tower),
    getObjectInfo: () => this.getTowerInfo(tower),
    isSelectable: () => true
  };
}
```

## Testing

When adding a new selectable object type, update tests in `src/systems/__tests__/InteractionSystem.test.ts`:

```typescript
it('should handle click on new object type', () => {
  const newObject = createMockNewObject();
  const mockMesh = newObject.getMesh();
  
  if (pointerObservableCallback) {
    pointerObservableCallback({
      type: PointerEventTypes.POINTERDOWN,
      event: { button: 0 },
      pickInfo: {
        hit: true,
        pickedMesh: mockMesh,
        pickedPoint: new Vector3(0, 0, 0)
      }
    });
  }

  // Verify info panel was shown
  expect(mockInfoPanel.show).toHaveBeenCalled();
});
```

## Logging

Add appropriate logging when objects are selected:

```typescript
private handleNewObjectClick(newObject: NewObject): void {
  this.logger.info('New object clicked', {
    objectType: newObject.getType(),
    position: newObject.getPosition()
  });
  
  // Your click logic
}
```

## Troubleshooting

### Object Not Showing Hover Glow

1. Check that metadata is set: `mesh.metadata.yourObjectType = yourObject`
2. Verify `getSelectableObject()` includes a check for your object type
3. Ensure `isSelectable()` returns `true` when appropriate

### Info Panel Not Showing

1. Verify `getSelectableObject()` returns a non-null object
2. Check that `isSelectable()` returns `true`
3. Ensure `getObjectInfo()` returns a valid `ObjectInfo` object
4. Check browser console for errors

### Wrong Information Displayed

1. Verify `getObjectInfo()` method returns correct data
2. Check that details object has the right keys and values
3. Ensure object state is up-to-date when info is generated

## Best Practices

1. **Consistent Naming**: Use lowercase, singular forms for metadata keys
2. **Clear Names**: Object names should be user-friendly (e.g., "Wood Resource" not "Resource_WOOD")
3. **Relevant Details**: Only show information that's useful to the player
4. **Performance**: Keep info generation fast - don't do heavy calculations
5. **State Awareness**: Check object state in `isSelectable()` (e.g., don't select dead enemies)

## Future Enhancements

Potential improvements:
- Custom click actions per object type
- Context menus for different object types
- Multi-select support
- Object highlighting groups
- Selection persistence
