/**
 * ResourceComponent Tests
 */

import { describe, it, expect } from 'vitest';
import { ResourceComponent, ResourceType } from '../ResourceComponent';

describe('ResourceComponent', () => {
  describe('Initialization', () => {
    it('should create with correct type and amount', () => {
      const component = new ResourceComponent(ResourceType.WOOD, 5);
      
      expect(component.type).toBe(ResourceType.WOOD);
      expect(component.amount).toBe(5);
      expect(component.collected).toBe(false);
    });

    it('should default to amount 1 if not specified', () => {
      const component = new ResourceComponent(ResourceType.STONE);
      
      expect(component.amount).toBe(1);
    });
  });

  describe('Collection', () => {
    it('should collect resource and return amount', () => {
      const component = new ResourceComponent(ResourceType.WOOD, 3);
      const collected = component.collect();
      
      expect(collected).toBe(3);
      expect(component.collected).toBe(true);
    });

    it('should return 0 if already collected', () => {
      const component = new ResourceComponent(ResourceType.WOOD, 3);
      component.collect();
      const collectedAgain = component.collect();
      
      expect(collectedAgain).toBe(0);
      expect(component.collected).toBe(true);
    });
  });
});
