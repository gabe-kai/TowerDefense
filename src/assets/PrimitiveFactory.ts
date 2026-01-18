/**
 * Primitive Factory - Creates primitive meshes for MVP
 */

import { Scene, Mesh, StandardMaterial, Color3, Vector3 } from '@babylonjs/core';
import { MaterialLibrary } from './MaterialLibrary';
import { AssetCatalog, AssetCategory, AssetType } from './AssetCatalog';

export interface PrimitiveOptions {
  materialId?: string;
  color?: Color3;
  size?: number;
  position?: Vector3;
}

export class PrimitiveFactory {
  private static instance: PrimitiveFactory;
  private scene: Scene | null = null;
  private materialLibrary: MaterialLibrary;
  private catalog: AssetCatalog;

  private constructor() {
    this.materialLibrary = MaterialLibrary.getInstance();
    this.catalog = AssetCatalog.getInstance();
  }

  static getInstance(): PrimitiveFactory {
    if (!PrimitiveFactory.instance) {
      PrimitiveFactory.instance = new PrimitiveFactory();
    }
    return PrimitiveFactory.instance;
  }

  /**
   * Initialize with scene
   */
  initialize(scene: Scene): void {
    this.scene = scene;
  }

  /**
   * Create a box primitive
   */
  createBox(name: string, options: PrimitiveOptions = {}): Mesh {
    if (!this.scene) {
      throw new Error('PrimitiveFactory not initialized with scene');
    }

    const size = options.size ?? 1;
    const box = Mesh.CreateBox(name, size, this.scene);
    
    if (options.position) {
      box.position = options.position;
    }

    this.applyMaterial(box, options);
    return box;
  }

  /**
   * Create a sphere primitive
   */
  createSphere(name: string, options: PrimitiveOptions = {}): Mesh {
    if (!this.scene) {
      throw new Error('PrimitiveFactory not initialized with scene');
    }

    const size = options.size ?? 1;
    const sphere = Mesh.CreateSphere(name, 16, size, this.scene);
    
    if (options.position) {
      sphere.position = options.position;
    }

    this.applyMaterial(sphere, options);
    return sphere;
  }

  /**
   * Create a cylinder primitive
   */
  createCylinder(name: string, options: PrimitiveOptions = {}): Mesh {
    if (!this.scene) {
      throw new Error('PrimitiveFactory not initialized with scene');
    }

    const size = options.size ?? 1;
    const cylinder = Mesh.CreateCylinder(name, size, size, size, 16, 1, this.scene);
    
    if (options.position) {
      cylinder.position = options.position;
    }

    this.applyMaterial(cylinder, options);
    return cylinder;
  }

  /**
   * Create a ground plane
   */
  createGround(name: string, width: number, height: number, options: PrimitiveOptions = {}): Mesh {
    if (!this.scene) {
      throw new Error('PrimitiveFactory not initialized with scene');
    }

    const ground = Mesh.CreateGround(name, width, height, 2, this.scene);
    
    if (options.position) {
      ground.position = options.position;
    }

    this.applyMaterial(ground, options);
    return ground;
  }

  /**
   * Apply material to mesh
   */
  private applyMaterial(mesh: Mesh, options: PrimitiveOptions): void {
    if (options.materialId) {
      const material = this.materialLibrary.getBabylonMaterial(options.materialId, this.scene!);
      mesh.material = material;
    } else if (options.color) {
      const material = new StandardMaterial(`${mesh.name}_material`, this.scene!);
      material.diffuseColor = options.color;
      mesh.material = material;
    }
  }

  /**
   * Create a tower base (cottage) primitive
   */
  createTowerBase(name: string, position: Vector3): Mesh {
    const base = this.createBox(`${name}_base`, {
      size: 3,
      position: position.clone(),
      materialId: 'wood'
    });

    // Register in catalog
    this.catalog.registerAsset(
      `${name}_base`,
      'Tower Base (Cottage)',
      AssetCategory.BUILDINGS,
      AssetType.MODEL_3D,
      'Starting tower base - wizard cottage',
      { usageContext: 'Player starting building' }
    );

    return base;
  }

  /**
   * Create a resource node primitive
   */
  createResourceNode(resourceType: string, position: Vector3): Mesh {
    const materialMap: Record<string, string> = {
      'wood': 'wood_resource',
      'stone': 'stone_resource',
      'gold': 'gold',
      'crystal': 'crystal',
      'essence': 'essence',
      'mana': 'mana'
    };

    const materialId = materialMap[resourceType] || 'stone_resource';
    const size = resourceType === 'crystal' || resourceType === 'essence' || resourceType === 'mana' ? 0.5 : 1;

    const shape = resourceType === 'crystal' || resourceType === 'essence' || resourceType === 'mana'
      ? this.createSphere(`resource_${resourceType}`, { size, position, materialId })
      : this.createBox(`resource_${resourceType}`, { size, position, materialId });

    // Register in catalog
    this.catalog.registerAsset(
      `resource_${resourceType}`,
      `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} Resource Node`,
      AssetCategory.RESOURCES,
      AssetType.MODEL_3D,
      `${resourceType} resource collection node`,
      { usageContext: 'Resource spawning' }
    );

    return shape;
  }

  /**
   * Create a servant primitive
   */
  createServant(name: string, position: Vector3): Mesh {
    const servant = this.createCylinder(name, {
      size: 0.5,
      position,
      materialId: 'servant'
    });

    // Register in catalog
    this.catalog.registerAsset(
      'servant',
      'Servant',
      AssetCategory.CHARACTERS,
      AssetType.MODEL_3D,
      'Player-controlled servant for resource collection',
      { variants: ['servant_1', 'servant_2'] }
    );

    return servant;
  }

  /**
   * Create an enemy primitive
   */
  createEnemy(enemyType: string, position: Vector3): Mesh {
    const enemy = this.createBox(`enemy_${enemyType}`, {
      size: 0.8,
      position,
      materialId: 'enemy_basic'
    });

    // Register in catalog
    this.catalog.registerAsset(
      `enemy_${enemyType}`,
      `${enemyType.charAt(0).toUpperCase() + enemyType.slice(1)} Enemy`,
      AssetCategory.CHARACTERS,
      AssetType.MODEL_3D,
      `${enemyType} enemy type`,
      { usageContext: 'Wave combat' }
    );

    return enemy;
  }
}
