/**
 * Asset Catalog - Central registry tracking all required assets
 */

export enum AssetCategory {
  TERRAIN = 'terrain',
  ENVIRONMENT = 'environment',
  BUILDINGS = 'buildings',
  CHARACTERS = 'characters',
  RESOURCES = 'resources',
  EFFECTS = 'effects',
  UI = 'ui'
}

export enum AssetType {
  MODEL_3D = 'model_3d',
  TEXTURE = 'texture',
  MATERIAL = 'material',
  AUDIO = 'audio'
}

export interface AssetEntry {
  id: string;
  name: string;
  category: AssetCategory;
  type: AssetType;
  description: string;
  variants?: string[];
  usageContext?: string;
  required: boolean;
  registeredAt: Date;
}

export class AssetCatalog {
  private static instance: AssetCatalog;
  private assets: Map<string, AssetEntry> = new Map();

  private constructor() {}

  static getInstance(): AssetCatalog {
    if (!AssetCatalog.instance) {
      AssetCatalog.instance = new AssetCatalog();
    }
    return AssetCatalog.instance;
  }

  /**
   * Register a new asset in the catalog
   */
  registerAsset(
    id: string,
    name: string,
    category: AssetCategory,
    type: AssetType,
    description: string,
    options?: {
      variants?: string[];
      usageContext?: string;
      required?: boolean;
    }
  ): void {
    const entry: AssetEntry = {
      id,
      name,
      category,
      type,
      description,
      variants: options?.variants,
      usageContext: options?.usageContext,
      required: options?.required ?? true,
      registeredAt: new Date()
    };

    this.assets.set(id, entry);
  }

  /**
   * Get an asset entry by ID
   */
  getAsset(id: string): AssetEntry | undefined {
    return this.assets.get(id);
  }

  /**
   * Get all assets by category
   */
  getAssetsByCategory(category: AssetCategory): AssetEntry[] {
    return Array.from(this.assets.values()).filter(asset => asset.category === category);
  }

  /**
   * Get all assets by type
   */
  getAssetsByType(type: AssetType): AssetEntry[] {
    return Array.from(this.assets.values()).filter(asset => asset.type === type);
  }

  /**
   * Get all registered assets
   */
  getAllAssets(): AssetEntry[] {
    return Array.from(this.assets.values());
  }

  /**
   * Get asset count
   */
  getAssetCount(): number {
    return this.assets.size;
  }

  /**
   * Clear all assets (for testing/reset)
   */
  clear(): void {
    this.assets.clear();
  }
}
