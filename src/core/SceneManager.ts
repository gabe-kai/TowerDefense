/**
 * Scene Manager - 3D scene setup and management
 */

import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, Color3 } from '@babylonjs/core';
import '@babylonjs/core/Cameras/Inputs/arcRotateCameraPointersInput';
import { PrimitiveFactory } from '../assets/PrimitiveFactory';
import { MaterialLibrary } from '../assets/MaterialLibrary';
import { AssetCatalog, AssetCategory, AssetType } from '../assets/AssetCatalog';

export class SceneManager {
  private engine: Engine;
  private scene: Scene;
  private camera: ArcRotateCamera;
  private primitiveFactory: PrimitiveFactory;
  private materialLibrary: MaterialLibrary;
  private catalog: AssetCatalog;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    
    // Ensure canvas is properly sized
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Create engine
    this.engine = new Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true
    });

    // Create scene
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color3(0.5, 0.8, 1.0); // Sky blue

    // Initialize asset systems
    this.primitiveFactory = PrimitiveFactory.getInstance();
    this.primitiveFactory.initialize(this.scene);
    this.materialLibrary = MaterialLibrary.getInstance();
    this.catalog = AssetCatalog.getInstance();

    // Setup camera
    this.setupCamera();

    // Setup lighting
    this.setupLighting();

    // Create valley terrain
    this.createValley();

    // Register terrain assets
    this.registerTerrainAssets();

    // Handle window resize
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.engine.resize();
    });
  }

  private setupCamera(): void {
    // Arc rotate camera for 3D view
    this.camera = new ArcRotateCamera(
      'camera',
      -Math.PI / 2, // Alpha (horizontal rotation)
      Math.PI / 3,  // Beta (vertical rotation)
      30,           // Radius (distance)
      Vector3.Zero(), // Target
      this.scene
    );

    // Set as active camera
    this.scene.activeCamera = this.camera;
    
    // Attach camera controls using inputs manager
    // In Babylon.js v6, use camera.inputs.attachElement
    this.camera.inputs.attachElement(this.canvas);

    // Set camera limits
    this.camera.lowerBetaLimit = 0.1;
    this.camera.upperBetaLimit = Math.PI / 2.2;
    this.camera.lowerRadiusLimit = 10;
    this.camera.upperRadiusLimit = 100;
  }

  private setupLighting(): void {
    // Hemispheric light for ambient lighting
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
    light.intensity = 0.8;

    // Register lighting in catalog
    this.catalog.registerAsset(
      'hemispheric_light',
      'Hemispheric Light',
      AssetCategory.ENVIRONMENT,
      AssetType.MODEL_3D,
      'Main ambient light source',
      { required: false }
    );
  }

  private createValley(): void {
    // Create valley floor
    const valleyFloor = this.primitiveFactory.createGround('valley_floor', 50, 50, {
      materialId: 'grass',
      position: new Vector3(0, 0, 0)
    });

    // Create hills on either side (where towers will be placed)
    const hillLeft = this.primitiveFactory.createBox('hill_left', {
      size: 8,
      position: new Vector3(-20, 2, 0),
      materialId: 'dirt'
    });
    hillLeft.scaling.y = 0.3; // Flatten it

    const hillRight = this.primitiveFactory.createBox('hill_right', {
      size: 8,
      position: new Vector3(20, 2, 0),
      materialId: 'dirt'
    });
    hillRight.scaling.y = 0.3; // Flatten it

    // Add some decorative elements
    this.addValleyDecorations();
  }

  private addValleyDecorations(): void {
    // Add some trees (simple boxes for now)
    const treePositions = [
      new Vector3(-15, 0.5, -10),
      new Vector3(-10, 0.5, 5),
      new Vector3(10, 0.5, -8),
      new Vector3(15, 0.5, 8)
    ];

    treePositions.forEach((pos, index) => {
      const tree = this.primitiveFactory.createCylinder(`tree_${index}`, {
        size: 1,
        position: pos,
        materialId: 'wood'
      });
      tree.scaling.y = 2; // Make trees taller

      // Register trees
      this.catalog.registerAsset(
        `tree_${index}`,
        'Tree',
        AssetCategory.ENVIRONMENT,
        AssetType.MODEL_3D,
        'Decorative tree in valley',
        { variants: ['tree_1', 'tree_2', 'tree_3'], required: false }
      );
    });
  }

  private registerTerrainAssets(): void {
    // Register terrain materials
    this.catalog.registerAsset(
      'valley_floor',
      'Valley Floor',
      AssetCategory.TERRAIN,
      AssetType.MODEL_3D,
      'Main valley ground plane',
      { required: true }
    );

    this.catalog.registerAsset(
      'hill',
      'Hill',
      AssetCategory.TERRAIN,
      AssetType.MODEL_3D,
      'Hill for tower placement',
      { variants: ['hill_left', 'hill_right'], required: true }
    );
  }

  getScene(): Scene {
    return this.scene;
  }

  getCamera(): ArcRotateCamera {
    return this.camera;
  }

  getEngine(): Engine {
    return this.engine;
  }

  render(): void {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  dispose(): void {
    this.scene.dispose();
    this.engine.dispose();
    this.materialLibrary.clearBabylonMaterials();
  }
}
