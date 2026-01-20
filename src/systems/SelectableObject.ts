/**
 * Selectable Object Interface - Defines objects that can be selected/hovered
 */

import { Mesh } from '@babylonjs/core';
import { ObjectInfo } from '../ui/InfoPanel';

export interface SelectableObject {
  getMesh(): Mesh;
  getName(): string;
  getObjectInfo(): ObjectInfo;
  isSelectable(): boolean;
}
