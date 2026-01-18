/**
 * Material Library - Material definitions and management
 */

import { StandardMaterial, Color3, Scene } from '@babylonjs/core';
import { AssetCatalog, AssetCategory, AssetType } from './AssetCatalog';

export interface MaterialDefinition {
  id: string;
  name: string;
  color: Color3;
  roughness?: number;
  metallic?: number;
  emissive?: Color3;
  description: string;
}

export class MaterialLibrary {
  private static instance: MaterialLibrary;
  private materials: Map<string, MaterialDefinition> = new Map();
  private babylonMaterials: Map<string, StandardMaterial> = new Map();
  private catalog: AssetCatalog;

  private constructor() {
    this.catalog = AssetCatalog.getInstance();
    this.initializeDefaultMaterials();
  }

  static getInstance(): MaterialLibrary {
    if (!MaterialLibrary.instance) {
      MaterialLibrary.instance = new MaterialLibrary();
    }
    return MaterialLibrary.instance;
  }

  /**
   * Initialize default materials for MVP
   */
  private initializeDefaultMaterials(): void {
    // Terrain materials
    this.registerMaterial('grass', 'Grass', new Color3(0.2, 0.6, 0.2), 0.8, 0.0, 'Green grass material for terrain');
    this.registerMaterial('dirt', 'Dirt', new Color3(0.4, 0.3, 0.2), 0.9, 0.0, 'Brown dirt material for terrain');
    this.registerMaterial('stone', 'Stone', new Color3(0.5, 0.5, 0.5), 0.7, 0.1, 'Gray stone material');
    this.registerMaterial('path', 'Path', new Color3(0.3, 0.3, 0.3), 0.6, 0.0, 'Dark path/road material');

    // Building materials
    this.registerMaterial('wood', 'Wood', new Color3(0.5, 0.3, 0.2), 0.7, 0.0, 'Brown wood material for buildings');
    this.registerMaterial('stone_wall', 'Stone Wall', new Color3(0.6, 0.6, 0.6), 0.8, 0.0, 'Stone wall material');
    this.registerMaterial('roof_tile', 'Roof Tile', new Color3(0.3, 0.2, 0.2), 0.6, 0.0, 'Dark roof tile material');

    // Resource materials
    this.registerMaterial('wood_resource', 'Wood Resource', new Color3(0.4, 0.25, 0.1), 0.6, 0.0, 'Wood resource material');
    this.registerMaterial('stone_resource', 'Stone Resource', new Color3(0.5, 0.5, 0.5), 0.7, 0.0, 'Stone resource material');
    this.registerMaterial('gold', 'Gold', new Color3(0.8, 0.7, 0.2), 0.3, 0.2, 'Gold material');
    this.registerMaterial('crystal', 'Crystal', new Color3(0.3, 0.5, 0.9), 0.2, 0.5, 'Blue crystal material');
    this.registerMaterial('essence', 'Essence', new Color3(0.7, 0.3, 0.9), 0.1, 0.6, 'Purple essence material');
    this.registerMaterial('mana', 'Mana', new Color3(0.2, 0.5, 0.9), 0.1, 0.7, 'Blue mana material');

    // Character materials
    this.registerMaterial('servant', 'Servant', new Color3(0.8, 0.7, 0.6), 0.5, 0.0, 'Servant character material');
    this.registerMaterial('enemy_basic', 'Basic Enemy', new Color3(0.7, 0.2, 0.2), 0.6, 0.0, 'Basic enemy material');
  }

  /**
   * Register a new material
   */
  registerMaterial(
    id: string,
    name: string,
    color: Color3,
    roughness: number = 0.5,
    metallic: number = 0.0,
    description: string = '',
    emissive?: Color3
  ): void {
    const materialDef: MaterialDefinition = {
      id,
      name,
      color,
      roughness,
      metallic,
      emissive,
      description
    };

    this.materials.set(id, materialDef);

    // Register in asset catalog
    this.catalog.registerAsset(
      id,
      name,
      AssetCategory.TERRAIN, // Default, can be overridden
      AssetType.MATERIAL,
      description,
      { required: true }
    );
  }

  /**
   * Get a Babylon.js material, creating it if it doesn't exist
   */
  getBabylonMaterial(id: string, scene: Scene): StandardMaterial {
    if (this.babylonMaterials.has(id)) {
      return this.babylonMaterials.get(id)!;
    }

    const materialDef = this.materials.get(id);
    if (!materialDef) {
      throw new Error(`Material ${id} not found`);
    }

    const material = new StandardMaterial(id, scene);
    material.diffuseColor = materialDef.color;
    material.roughness = materialDef.roughness ?? 0.5;
    material.metallic = materialDef.metallic ?? 0.0;
    
    if (materialDef.emissive) {
      material.emissiveColor = materialDef.emissive;
    }

    this.babylonMaterials.set(id, material);
    return material;
  }

  /**
   * Get material definition
   */
  getMaterial(id: string): MaterialDefinition | undefined {
    return this.materials.get(id);
  }

  /**
   * Get all materials
   */
  getAllMaterials(): MaterialDefinition[] {
    return Array.from(this.materials.values());
  }

  /**
   * Clear Babylon materials (call when scene is disposed)
   */
  clearBabylonMaterials(): void {
    this.babylonMaterials.forEach(material => material.dispose());
    this.babylonMaterials.clear();
  }
}
