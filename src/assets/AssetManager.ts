/**
 * Asset Manager - Asset loading, caching, and management
 */

import { Scene, AbstractMesh, AssetContainer } from '@babylonjs/core';
import { AssetCatalog } from './AssetCatalog';
import { PrimitiveFactory } from './PrimitiveFactory';
import { MaterialLibrary } from './MaterialLibrary';

export interface LoadedAsset {
  id: string;
  mesh?: AbstractMesh;
  meshes?: AbstractMesh[];
  container?: AssetContainer;
  loaded: boolean;
}

export class AssetManager {
  private static instance: AssetManager;
  private scene: Scene | null = null;
  private loadedAssets: Map<string, LoadedAsset> = new Map();
  private catalog: AssetCatalog;
  private primitiveFactory: PrimitiveFactory;
  private materialLibrary: MaterialLibrary;
  private usePrimitives: boolean = true; // MVP mode - use primitives

  private constructor() {
    this.catalog = AssetCatalog.getInstance();
    this.primitiveFactory = PrimitiveFactory.getInstance();
    this.materialLibrary = MaterialLibrary.getInstance();
  }

  static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager();
    }
    return AssetManager.instance;
  }

  /**
   * Initialize with scene
   */
  initialize(scene: Scene): void {
    this.scene = scene;
    this.primitiveFactory.initialize(scene);
  }

  /**
   * Set whether to use primitives (MVP mode) or real assets
   */
  setUsePrimitives(usePrimitives: boolean): void {
    this.usePrimitives = usePrimitives;
  }

  /**
   * Get or create an asset
   * In MVP mode, creates primitives. In asset mode, loads from files.
   */
  async getAsset(assetId: string): Promise<LoadedAsset | null> {
    // Check cache
    if (this.loadedAssets.has(assetId)) {
      return this.loadedAssets.get(assetId)!;
    }

    // Check catalog
    const catalogEntry = this.catalog.getAsset(assetId);
    if (!catalogEntry) {
      console.warn(`Asset ${assetId} not found in catalog`);
      return null;
    }

    if (this.usePrimitives) {
      // MVP mode - create primitive
      return this.createPrimitiveAsset(assetId, catalogEntry);
    } else {
      // Asset mode - load from file (future implementation)
      return this.loadAssetFromFile(assetId, catalogEntry);
    }
  }

  /**
   * Create primitive asset (MVP mode)
   */
  private createPrimitiveAsset(assetId: string, catalogEntry: any): LoadedAsset {
    if (!this.scene) {
      throw new Error('AssetManager not initialized with scene');
    }

    // This will be called by the specific systems that know what primitives to create
    // For now, return a placeholder
    const asset: LoadedAsset = {
      id: assetId,
      loaded: true
    };

    this.loadedAssets.set(assetId, asset);
    return asset;
  }

  /**
   * Load asset from file (future implementation)
   */
  private async loadAssetFromFile(assetId: string, catalogEntry: any): Promise<LoadedAsset> {
    // TODO: Implement glTF/GLB loading when real assets are integrated
    throw new Error('Asset loading from files not yet implemented');
  }

  /**
   * Preload assets
   */
  async preloadAssets(assetIds: string[]): Promise<void> {
    const promises = assetIds.map(id => this.getAsset(id));
    await Promise.all(promises);
  }

  /**
   * Clear all loaded assets
   */
  clear(): void {
    this.loadedAssets.forEach(asset => {
      if (asset.meshes) {
        asset.meshes.forEach(mesh => mesh.dispose());
      }
      if (asset.mesh) {
        asset.mesh.dispose();
      }
      if (asset.container) {
        asset.container.dispose();
      }
    });
    this.loadedAssets.clear();
  }

  /**
   * Get all loaded assets
   */
  getAllLoadedAssets(): LoadedAsset[] {
    return Array.from(this.loadedAssets.values());
  }
}
