/**
 * Asset Manifest - Generates asset requirement manifest/export
 */

import { AssetCatalog, AssetCategory, AssetType, AssetEntry } from './AssetCatalog';
import { MaterialLibrary } from './MaterialLibrary';

export interface AssetManifest {
  generatedAt: string;
  totalAssets: number;
  categories: {
    [key in AssetCategory]: {
      count: number;
      assets: AssetEntry[];
    };
  };
  byType: {
    [key in AssetType]: AssetEntry[];
  };
  materials: {
    id: string;
    name: string;
    description: string;
    color: { r: number; g: number; b: number };
    roughness?: number;
    metallic?: number;
  }[];
  summary: {
    models3D: number;
    textures: number;
    materials: number;
    audio: number;
  };
}

export class AssetManifestGenerator {
  private catalog: AssetCatalog;
  private materialLibrary: MaterialLibrary;

  constructor() {
    this.catalog = AssetCatalog.getInstance();
    this.materialLibrary = MaterialLibrary.getInstance();
  }

  /**
   * Generate complete asset manifest
   */
  generateManifest(): AssetManifest {
    const allAssets = this.catalog.getAllAssets();
    const categories: Partial<Record<AssetCategory, { count: number; assets: AssetEntry[] }>> = {};

    // Group by category
    Object.values(AssetCategory).forEach(category => {
      const assets = this.catalog.getAssetsByCategory(category);
      categories[category] = {
        count: assets.length,
        assets
      };
    });

    // Group by type
    const byType: Partial<Record<AssetType, AssetEntry[]>> = {};
    Object.values(AssetType).forEach(type => {
      byType[type] = this.catalog.getAssetsByType(type);
    });

    // Get materials
    const materials = this.materialLibrary.getAllMaterials().map(mat => ({
      id: mat.id,
      name: mat.name,
      description: mat.description,
      color: {
        r: mat.color.r,
        g: mat.color.g,
        b: mat.color.b
      },
      roughness: mat.roughness,
      metallic: mat.metallic
    }));

    // Calculate summary
    const summary = {
      models3D: byType[AssetType.MODEL_3D]?.length || 0,
      textures: byType[AssetType.TEXTURE]?.length || 0,
      materials: materials.length,
      audio: byType[AssetType.AUDIO]?.length || 0
    };

    return {
      generatedAt: new Date().toISOString(),
      totalAssets: allAssets.length,
      categories: categories as Record<AssetCategory, { count: number; assets: AssetEntry[] }>,
      byType: byType as Record<AssetType, AssetEntry[]>,
      materials,
      summary
    };
  }

  /**
   * Export manifest as JSON string
   */
  exportJSON(): string {
    return JSON.stringify(this.generateManifest(), null, 2);
  }

  /**
   * Generate human-readable shopping list
   */
  generateShoppingList(): string {
    const manifest = this.generateManifest();
    let output = '=== ASSET SHOPPING LIST ===\n\n';
    output += `Generated: ${manifest.generatedAt}\n`;
    output += `Total Assets Required: ${manifest.totalAssets}\n\n`;

    // Summary
    output += '=== SUMMARY ===\n';
    output += `3D Models: ${manifest.summary.models3D}\n`;
    output += `Textures: ${manifest.summary.textures}\n`;
    output += `Materials: ${manifest.summary.materials}\n`;
    output += `Audio: ${manifest.summary.audio}\n\n`;

    // By Category
    output += '=== BY CATEGORY ===\n\n';
    Object.entries(manifest.categories).forEach(([category, data]) => {
      if (data.count > 0) {
        output += `\n${category.toUpperCase()} (${data.count} assets):\n`;
        data.assets.forEach(asset => {
          output += `  - ${asset.name} (${asset.type})\n`;
          if (asset.description) {
            output += `    ${asset.description}\n`;
          }
          if (asset.variants && asset.variants.length > 0) {
            output += `    Variants: ${asset.variants.join(', ')}\n`;
          }
        });
      }
    });

    // Materials
    output += '\n=== MATERIALS ===\n';
    manifest.materials.forEach(mat => {
      output += `\n${mat.name} (${mat.id}):\n`;
      output += `  Color: RGB(${mat.color.r}, ${mat.color.g}, ${mat.color.b})\n`;
      if (mat.roughness !== undefined) {
        output += `  Roughness: ${mat.roughness}\n`;
      }
      if (mat.metallic !== undefined) {
        output += `  Metallic: ${mat.metallic}\n`;
      }
      if (mat.description) {
        output += `  ${mat.description}\n`;
      }
    });

    // Detailed breakdown by type
    output += '\n=== DETAILED BREAKDOWN ===\n\n';
    Object.entries(manifest.byType).forEach(([type, assets]) => {
      if (assets.length > 0) {
        output += `\n${type.toUpperCase()}:\n`;
        assets.forEach(asset => {
          output += `  - ${asset.name} [${asset.category}]\n`;
        });
      }
    });

    return output;
  }

  /**
   * Generate markdown format shopping list
   */
  generateMarkdownList(): string {
    const manifest = this.generateManifest();
    let output = '# Asset Shopping List\n\n';
    output += `**Generated:** ${manifest.generatedAt}\n`;
    output += `**Total Assets:** ${manifest.totalAssets}\n\n`;

    // Summary table
    output += '## Summary\n\n';
    output += '| Type | Count |\n';
    output += '|------|-------|\n';
    output += `| 3D Models | ${manifest.summary.models3D} |\n`;
    output += `| Textures | ${manifest.summary.textures} |\n`;
    output += `| Materials | ${manifest.summary.materials} |\n`;
    output += `| Audio | ${manifest.summary.audio} |\n\n`;

    // By Category
    output += '## Assets by Category\n\n';
    Object.entries(manifest.categories).forEach(([category, data]) => {
      if (data.count > 0) {
        output += `### ${category.charAt(0).toUpperCase() + category.slice(1)} (${data.count})\n\n`;
        data.assets.forEach(asset => {
          output += `- **${asset.name}** (${asset.type})\n`;
          if (asset.description) {
            output += `  - ${asset.description}\n`;
          }
          if (asset.variants && asset.variants.length > 0) {
            output += `  - Variants: ${asset.variants.join(', ')}\n`;
          }
        });
        output += '\n';
      }
    });

    return output;
  }
}
