/**
 * Scene Manager - 3D scene setup and management
 */

import { Engine, Scene, FreeCamera, HemisphericLight, Vector3, Color4, MeshBuilder, GroundMesh, PointerEventTypes } from '@babylonjs/core';
import { PrimitiveFactory } from '../assets/PrimitiveFactory';
import { MaterialLibrary } from '../assets/MaterialLibrary';
import { AssetCatalog, AssetCategory, AssetType } from '../assets/AssetCatalog';
import { createCategoryLogger } from '../utils/Logger';
import { TerrainManager } from '../utils/TerrainManager';
import { GameScale } from '../utils/GameScale';
import { ElevationColormap } from '../utils/ElevationColormap';
import { SeededRandom } from '../utils/SeededRandom';

export class SceneManager {
  private engine: Engine;
  private scene: Scene;
  private camera!: FreeCamera; // Definite assignment - initialized in setupCamera()
  private primitiveFactory: PrimitiveFactory;
  private materialLibrary: MaterialLibrary;
  private catalog: AssetCatalog;
  private terrainManager: TerrainManager | null = null;
  private logger = createCategoryLogger('SceneManager');
  private canvas: HTMLCanvasElement;
  private seededRandom: SeededRandom;
  
  // Camera control state
  private keysPressed: Set<string> = new Set();
  private cameraMoveSpeed: number = 50; // meters per second
  private cameraRotationSpeed: number = 1.5; // radians per second (for yaw/pitch)
  private cameraZoomSpeed: number = 30; // meters per second for mouse wheel zoom
  
  // Mouse control state
  private isMiddleMouseDown: boolean = false;
  private isRightMouseDown: boolean = false;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;
  private mouseRotationSpeed: number = 0.003; // radians per pixel
  private mousePanSpeed: number = 0.5; // meters per pixel for panning

  constructor(canvas: HTMLCanvasElement, seededRandom: SeededRandom) {
    this.canvas = canvas;
    this.seededRandom = seededRandom;
    
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
    this.scene.clearColor = new Color4(0.5, 0.8, 1.0, 1.0); // Sky blue

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
    // FreeCamera for FPS-style movement (eyeball at center of sphere)
    // Camera position is the pivot point (center of sphere)
    this.camera = new FreeCamera(
      'camera',
      new Vector3(0, 20, 0), // Start position (above ground)
      this.scene
    );

    // Set initial rotation (looking forward and slightly down)
    this.camera.rotation = new Vector3(Math.PI / 6, 0, 0); // Pitch down slightly, yaw centered

    // Set as active camera
    this.scene.activeCamera = this.camera;
    
    // Disable default mouse look (we'll handle rotation with Q/E/R/F and middle mouse)
    this.camera.inputs.removeByType("FreeCameraMouseInput");
    
    // Attach camera controls using inputs manager
    // @ts-ignore - attachElement accepts HTMLCanvasElement but TypeScript types may be incorrect
    this.camera.inputs.attachElement(this.canvas);
    this.logger.debug('Camera initialized', { position: this.camera.position, rotation: this.camera.rotation });
    
    // Setup keyboard controls
    this.setupKeyboardControls();
    
    // Setup mouse controls (middle-click orbit, mouse wheel zoom)
    this.setupMouseControls();
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
    // Generate procedural heightmap for dramatic gorge/mountain/valley terrain
    const heightmapData = this.generateValleyHeightmap(512, 512, this.seededRandom);
    
    // Create terrain mesh from heightmap using Babylon's built-in method
    // API: CreateGroundFromHeightMap(name, {data, width, height}, options)
    const heightmapWidth = 512;
    const heightmapHeight = 512;
    const valleyFloor = MeshBuilder.CreateGroundFromHeightMap(
      'valley_floor',
      {
        data: heightmapData,
        width: heightmapWidth,
        height: heightmapHeight
      },
      {
        width: GameScale.MAP_WIDTH,
        height: GameScale.MAP_DEPTH,
        subdivisions: 200, // High detail for smooth terrain
        minHeight: GameScale.GORGE_DEPTH + 10, // Raise minimum (water will be at ~-40m instead of -50m)
        maxHeight: GameScale.MOUNTAIN_HEIGHT + 10, // Raise maximum to match
        updatable: false
      },
      this.scene
    ) as GroundMesh;
    
    // Center the terrain at origin
    valleyFloor.position = new Vector3(0, 0, 0);
    
    // Apply elevation colormap material
    const elevationColormap = ElevationColormap.getInstance();
    const colormapMaterial = elevationColormap.createMaterial(
      this.scene,
      'terrain_elevation_colormap',
      GameScale.GORGE_DEPTH,
      GameScale.MOUNTAIN_HEIGHT,
      1.0, // 1m band interval
      5.0, // 5m band interval
      0.05, // 1m band thickness (5cm)
      0.15  // 5m band thickness (15cm)
    );
    valleyFloor.material = colormapMaterial;
    valleyFloor.isPickable = false; // Don't interfere with object picking
    
    // Create TerrainManager wrapper
    this.terrainManager = new TerrainManager(valleyFloor);
    
    // Add some decorative elements
    this.addValleyDecorations();
    
    this.logger.info('Dramatic valley terrain created', { 
      width: GameScale.MAP_WIDTH, 
      depth: GameScale.MAP_DEPTH,
      subdivisions: 200,
      minHeight: GameScale.GORGE_DEPTH,
      maxHeight: GameScale.MOUNTAIN_HEIGHT,
      hasTerrainManager: !!this.terrainManager
    });
  }

  /**
   * Generate procedural heightmap for dramatic gorge/mountain/valley terrain
   * Creates a rough, rocky landscape with:
   * - Deep gorge at the foot of a mountain
   * - Steep incline consistently in one direction (mountain slope)
   * - Valley cutting perpendicular through the terrain (along Z-axis)
   * - Towers on opposite sides of the valley
   * - Rough, rocky terrain with noise for small-scale variation
   */
  private generateValleyHeightmap(width: number, height: number, seededRandom: SeededRandom): Uint8Array {
    const data = new Uint8Array(width * height * 4);
    
    // Normalize coordinates to map space
    const mapWidth = GameScale.MAP_WIDTH;
    const mapDepth = GameScale.MAP_DEPTH;
    
    // Terrain parameters
    const gorgeDepth = GameScale.GORGE_DEPTH;
    const mountainHeight = GameScale.MOUNTAIN_HEIGHT;
    const valleyCutDepth = GameScale.VALLEY_CUT_DEPTH;
    const noiseScale = GameScale.TERRAIN_NOISE_SCALE;
    const noiseAmplitude = GameScale.TERRAIN_NOISE_AMPLITUDE;
    const slopeDirection = GameScale.MOUNTAIN_SLOPE_DIRECTION;
    
    // Seeded noise function for deterministic but varied terrain
    // Uses mathematical functions combined with seeded random offsets
    const noiseOffsets = [
      seededRandom.next() * 1000,
      seededRandom.next() * 1000,
      seededRandom.next() * 1000,
      seededRandom.next() * 1000
    ];
    
    const noise = (x: number, z: number): number => {
      // Add seeded offsets to create variation while maintaining determinism
      return (Math.sin((x + noiseOffsets[0]) * noiseScale) + 
              Math.cos((z + noiseOffsets[1]) * noiseScale * 1.3) + 
              Math.sin((x + noiseOffsets[2]) * noiseScale * 2.1) * 
              Math.cos((z + noiseOffsets[3]) * noiseScale * 1.7)) * noiseAmplitude;
    };
    
    for (let i = 0; i < width * height; i++) {
      const x = i % width;
      const z = Math.floor(i / width);
      
      // Convert pixel coordinates to world coordinates
      const worldX = (x / width - 0.5) * mapWidth;
      const worldZ = (z / height - 0.5) * mapDepth;
      
      // 1. Base mountain slope: South-North elevation ramp (South = high, North = low)
      // Normalize Z to -1 (North) to +1 (South) range, then apply slope
      // Add base elevation offset to raise everything and make water less prominent
      const baseElevationOffset = 10.0; // Raise entire landscape by 10m
      const normalizedZ = (worldZ / (mapDepth / 2));
      const baseSlope = normalizedZ * mountainHeight * 0.6 + baseElevationOffset; // 60% of max height + base offset (South is higher)
      
      // 2. Single deep gorge cutting East-West (along Z-axis, centered at X=0)
      // Create a single, deeper gorge with gentler slopes
      const distFromGorgeCenter = Math.abs(worldX);
      const gorgeWidth = GameScale.RIVER_WIDTH * 3; // Wider gorge for gentler slopes
      const gorgeHalfWidth = gorgeWidth / 2;
      
      // Gorge depth profile: deepest in center, gentler slopes up the sides
      let gorgeDepthOffset = 0;
      if (distFromGorgeCenter < gorgeHalfWidth) {
        // Use a smoother curve for gentler slopes (smoothstep-like function)
        const normalizedDist = distFromGorgeCenter / gorgeHalfWidth; // 0 at center, 1 at edge
        const smoothCurve = normalizedDist * normalizedDist * (3 - 2 * normalizedDist); // Smoothstep
        
        // Deeper gorge: combine valley cut depth and gorge depth for a single, deeper gorge
        // Total depth = -30m (valley) + -50m (gorge) = -80m at deepest point
        const totalGorgeDepth = valleyCutDepth + gorgeDepth;
        gorgeDepthOffset = totalGorgeDepth * (1 - smoothCurve); // Deepest at center, 0 at edges
      }
      
      // 3. Add small-scale noise for rough, rocky terrain (reduced to avoid creating gorges)
      // Use higher frequency, lower amplitude noise that doesn't create valleys
      const terrainNoise = noise(worldX * 0.05, worldZ * 0.05) * 0.3; // Reduced amplitude
      
      // 4. Combine all elevation components
      let elevation = baseSlope + gorgeDepthOffset + terrainNoise;
      
      // 5. Ensure towers are on high ground (opposite sides of valley)
      // Add elevation boost near tower positions (±1000m from center)
      const towerXPositions = [mapWidth / 4, -mapWidth / 4];
      for (const towerX of towerXPositions) {
        const distToTower = Math.abs(worldX - towerX);
        if (distToTower < 300) {
          // Boost elevation near tower positions
          const boost = Math.max(0, 1 - distToTower / 300) * 20; // Up to 20m boost
          elevation += boost;
        }
      }
      
      // 6. Clamp elevation to valid range
      elevation = Math.max(gorgeDepth, Math.min(mountainHeight, elevation));
      
      // 7. Convert elevation to grayscale (0-255)
      // Normalize to 0-1 range, then scale to 0-255
      const normalizedElevation = (elevation - gorgeDepth) / (mountainHeight - gorgeDepth);
      const gray = Math.floor(Math.max(0, Math.min(255, normalizedElevation * 255)));
      
      // Write RGBA data
      data[i * 4] = gray;     // R
      data[i * 4 + 1] = gray; // G
      data[i * 4 + 2] = gray; // B
      data[i * 4 + 3] = 255;  // A
    }
    
    return data;
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

  /**
   * Get the terrain manager instance
   */
  getTerrainManager(): TerrainManager | null {
    return this.terrainManager;
  }

  /**
   * Setup keyboard controls for camera movement
   */
  private setupKeyboardControls(): void {
    // Helper to check if user is typing in an input field
    const isInputFocused = (): boolean => {
      const activeElement = document.activeElement;
      return activeElement instanceof HTMLInputElement || 
             activeElement instanceof HTMLTextAreaElement ||
             activeElement?.tagName === 'INPUT' ||
             activeElement?.tagName === 'TEXTAREA';
    };

    // Track key presses
    window.addEventListener('keydown', (event) => {
      // Don't capture keys when user is typing in an input field
      if (isInputFocused()) {
        return;
      }
      this.keysPressed.add(event.key.toLowerCase());
    });

    window.addEventListener('keyup', (event) => {
      // Don't capture keys when user is typing in an input field
      if (isInputFocused()) {
        return;
      }
      this.keysPressed.delete(event.key.toLowerCase());
    });

    // Prevent default browser behavior for camera control keys
    window.addEventListener('keydown', (event) => {
      // Don't prevent default when user is typing in an input field
      if (isInputFocused()) {
        return;
      }
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'r', 'f', 'q', 'e'].includes(key)) {
        event.preventDefault();
      }
    });

    this.logger.info('Keyboard controls initialized', {
      movement: 'WASD',
      elevation: 'R/F',
      rotation: 'Q/E',
      zoom: 'Mouse wheel'
    });
  }

  /**
   * Setup mouse controls for camera
   * - Middle mouse button: Orbit (rotate camera)
   * - Right mouse button: Pan (strafe camera)
   * - Mouse wheel: Zoom (move forward/backward)
   */
  private setupMouseControls(): void {
    // Use Babylon's pointer observable for better integration
    this.scene.onPointerObservable.add((pointerInfo) => {
      const event = pointerInfo.event as MouseEvent;
      
      if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
        if (event.button === 1) { // Middle mouse button
          event.preventDefault();
          event.stopPropagation();
          this.isMiddleMouseDown = true;
          this.lastMouseX = event.clientX;
          this.lastMouseY = event.clientY;
          this.canvas.style.cursor = 'grab';
        } else if (event.button === 2) { // Right mouse button
          event.preventDefault();
          event.stopPropagation();
          this.isRightMouseDown = true;
          this.lastMouseX = event.clientX;
          this.lastMouseY = event.clientY;
          this.canvas.style.cursor = 'move';
        }
      } else if (pointerInfo.type === PointerEventTypes.POINTERUP) {
        if (event.button === 1) { // Middle mouse button
          event.preventDefault();
          event.stopPropagation();
          this.isMiddleMouseDown = false;
          this.canvas.style.cursor = 'default';
        } else if (event.button === 2) { // Right mouse button
          event.preventDefault();
          event.stopPropagation();
          this.isRightMouseDown = false;
          this.canvas.style.cursor = 'default';
        }
      } else if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
        const deltaX = event.clientX - this.lastMouseX;
        const deltaY = event.clientY - this.lastMouseY;

        if (this.isMiddleMouseDown) {
          event.preventDefault();
          event.stopPropagation();

          // Rotate camera based on mouse movement
          // Horizontal movement = yaw (rotation.y) - inverted
          this.camera.rotation.y += deltaX * this.mouseRotationSpeed;
          
          // Vertical movement = pitch (rotation.x) - inverted
          this.camera.rotation.x += deltaY * this.mouseRotationSpeed;
          
          // Limit pitch to prevent flipping
          this.camera.rotation.x = Math.max(
            -Math.PI / 2 + 0.1,
            Math.min(Math.PI / 2 - 0.1, this.camera.rotation.x)
          );

          this.lastMouseX = event.clientX;
          this.lastMouseY = event.clientY;
        } else if (this.isRightMouseDown) {
          event.preventDefault();
          event.stopPropagation();

          // Pan camera (strafe) based on mouse movement
          const right = this.camera.getDirection(Vector3.Right());
          
          // Horizontal movement = strafe right/left
          const rightHorizontal = new Vector3(right.x, 0, right.z).normalize();
          const panRight = rightHorizontal.scale(-deltaX * this.mousePanSpeed);
          
          // Vertical movement = move up/down
          const panUp = new Vector3(0, -deltaY * this.mousePanSpeed, 0);
          
          const newPosition = this.camera.position.add(panRight).add(panUp);
          
          // Don't go below terrain
          if (this.terrainManager) {
            const terrainHeight = this.terrainManager.getHeightAt(newPosition.x, newPosition.z);
            newPosition.y = Math.max(newPosition.y, terrainHeight + 2); // Keep at least 2m above terrain
          } else {
            newPosition.y = Math.max(newPosition.y, 0);
          }
          
          this.camera.position = newPosition;
          this.lastMouseX = event.clientX;
          this.lastMouseY = event.clientY;
        }
      }
    });

    // Mouse wheel for zooming (move forward/backward)
    this.canvas.addEventListener('wheel', (event) => {
      event.preventDefault();
      const zoomDirection = event.deltaY > 0 ? -1 : 1; // Scroll down = zoom out, scroll up = zoom in
      const forward = this.camera.getDirection(Vector3.Forward());
      const zoomDistance = this.cameraZoomSpeed * 0.016; // ~60fps frame time
      
      const newPosition = this.camera.position.add(forward.scale(zoomDirection * zoomDistance * Math.abs(event.deltaY) / 100));
      
      // Don't go below terrain
      if (this.terrainManager) {
        const terrainHeight = this.terrainManager.getHeightAt(newPosition.x, newPosition.z);
        newPosition.y = Math.max(newPosition.y, terrainHeight + 2); // Keep at least 2m above terrain
      } else {
        newPosition.y = Math.max(newPosition.y, 0);
      }
      
      this.camera.position = newPosition;
    });

    // Prevent context menu on right mouse button (we use it for panning)
    this.canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    this.logger.info('Mouse controls initialized', {
      orbit: 'Middle mouse button + drag',
      pan: 'Right mouse button + drag',
      zoom: 'Mouse wheel'
    });
  }

  /**
   * Update camera based on keyboard input
   * Should be called every frame
   * Camera is like an eyeball at center of sphere - pivot point is camera position itself
   */
  updateCamera(deltaTime: number): void {
    if (!this.camera) return;

    const dt = Math.min(deltaTime, 0.1); // Cap deltaTime to prevent large jumps
    const moveDistance = this.cameraMoveSpeed * dt;
    const rotationAmount = this.cameraRotationSpeed * dt;

    // Get camera's forward, right, and up vectors
    // FreeCamera provides these directly based on rotation
    const forward = this.camera.getDirection(Vector3.Forward());
    const right = this.camera.getDirection(Vector3.Right());
    const up = this.camera.getDirection(Vector3.Up());

    // Q/E: Yaw rotation (spin left/right around vertical Y axis)
    if (this.keysPressed.has('q')) {
      // Rotate left (decrease yaw - counter-clockwise when viewed from above)
      this.camera.rotation.y -= rotationAmount;
    }
    if (this.keysPressed.has('e')) {
      // Rotate right (increase yaw - clockwise when viewed from above)
      this.camera.rotation.y += rotationAmount;
    }

    // R/F: Pitch rotation (rotate up/down around horizontal left-right axis)
    if (this.keysPressed.has('r')) {
      // Rotate up (decrease pitch - look up)
      this.camera.rotation.x -= rotationAmount;
      // Limit pitch to prevent flipping
      this.camera.rotation.x = Math.max(this.camera.rotation.x, -Math.PI / 2 + 0.1);
    }
    if (this.keysPressed.has('f')) {
      // Rotate down (increase pitch - look down)
      this.camera.rotation.x += rotationAmount;
      // Limit pitch to prevent flipping
      this.camera.rotation.x = Math.min(this.camera.rotation.x, Math.PI / 2 - 0.1);
    }

    // W/S: Move forward/backward along camera's forward vector
    if (this.keysPressed.has('w')) {
      // Move forward (along camera's forward vector)
      const newPosition = this.camera.position.add(forward.scale(moveDistance));
      // Don't go below terrain
      if (this.terrainManager) {
        const terrainHeight = this.terrainManager.getHeightAt(newPosition.x, newPosition.z);
        newPosition.y = Math.max(newPosition.y, terrainHeight + 2); // Keep at least 2m above terrain
      } else {
        newPosition.y = Math.max(newPosition.y, 0);
      }
      this.camera.position = newPosition;
    }
    if (this.keysPressed.has('s')) {
      // Move backward (opposite to camera's forward vector)
      const newPosition = this.camera.position.subtract(forward.scale(moveDistance));
      // Don't go below terrain
      if (this.terrainManager) {
        const terrainHeight = this.terrainManager.getHeightAt(newPosition.x, newPosition.z);
        newPosition.y = Math.max(newPosition.y, terrainHeight + 2); // Keep at least 2m above terrain
      } else {
        newPosition.y = Math.max(newPosition.y, 0);
      }
      this.camera.position = newPosition;
    }

    // A/D: Strafe left/right along camera's right vector (horizontal plane)
    if (this.keysPressed.has('a')) {
      // Strafe left (subtract right vector, but keep Y elevation)
      const rightHorizontal = new Vector3(right.x, 0, right.z).normalize();
      const newPosition = this.camera.position.subtract(rightHorizontal.scale(moveDistance));
      // Preserve current Y elevation (don't change height when strafing)
      newPosition.y = this.camera.position.y;
      // Don't go below terrain
      if (this.terrainManager) {
        const terrainHeight = this.terrainManager.getHeightAt(newPosition.x, newPosition.z);
        newPosition.y = Math.max(newPosition.y, terrainHeight + 2);
      } else {
        newPosition.y = Math.max(newPosition.y, 0);
      }
      this.camera.position = newPosition;
    }
    if (this.keysPressed.has('d')) {
      // Strafe right (add right vector, but keep Y elevation)
      const rightHorizontal = new Vector3(right.x, 0, right.z).normalize();
      const newPosition = this.camera.position.add(rightHorizontal.scale(moveDistance));
      // Preserve current Y elevation (don't change height when strafing)
      newPosition.y = this.camera.position.y;
      // Don't go below terrain
      if (this.terrainManager) {
        const terrainHeight = this.terrainManager.getHeightAt(newPosition.x, newPosition.z);
        newPosition.y = Math.max(newPosition.y, terrainHeight + 2);
      } else {
        newPosition.y = Math.max(newPosition.y, 0);
      }
      this.camera.position = newPosition;
    }
  }

  getCamera(): FreeCamera {
    return this.camera;
  }

  /**
   * Set camera position and rotation to look from behind player house toward AI tower
   * @param playerTowerPos Position of player tower
   * @param aiTowerPos Position of AI tower
   */
  setInitialCameraPosition(playerTowerPos: Vector3, aiTowerPos: Vector3): void {
    // Calculate direction from player tower to AI tower
    const directionToAI = aiTowerPos.subtract(playerTowerPos);
    const distance = directionToAI.length();
    const directionNormalized = directionToAI.normalize();

    // House extends forward from tower (toward map center/AI tower)
    // "Behind" the house means opposite direction (away from AI tower)
    const houseWidth = GameScale.COTTAGE_HOUSE_WIDTH; // 5.0m (front to back)
    const houseHeight = GameScale.COTTAGE_HOUSE_HEIGHT; // 3.0m
    const towerBaseHeight = 7.0; // 2 stories (6m) + roof (1m)
    const totalHeight = towerBaseHeight + houseHeight; // Total height of tower + house

    // Position camera behind the house (on player's side, away from AI tower)
    // Offset back by house width + some extra space + 30m additional distance
    const backOffset = houseWidth + 3.0 + 30.0; // 5m (house) + 3m (extra space) + 30m (farther back)
    const cameraPosition = playerTowerPos.subtract(directionNormalized.scale(backOffset));
    
    // Elevate camera above the house and a little back (above the line)
    // Add tower height + house height + extra elevation
    const elevation = totalHeight + 5.0; // Above house + 5m extra
    cameraPosition.y += elevation;

    // Set camera position
    this.camera.position = cameraPosition;

    // Calculate rotation to look through/above player tower toward AI tower
    // Create a target point slightly above the AI tower
    const targetPoint = aiTowerPos.clone();
    targetPoint.y += towerBaseHeight / 2; // Look at middle of AI tower

    // Calculate direction from camera to target
    const lookDirection = targetPoint.subtract(cameraPosition).normalize();

    // Calculate yaw (rotation around Y axis) - horizontal angle
    const yaw = Math.atan2(lookDirection.x, lookDirection.z);

    // Calculate pitch (rotation around X axis) - vertical angle
    const horizontalDistance = Math.sqrt(lookDirection.x * lookDirection.x + lookDirection.z * lookDirection.z);
    const pitch = Math.atan2(-lookDirection.y, horizontalDistance);

    // Rotate camera down 5 degrees (so AI tower is higher on screen, player tower more visible)
    const additionalPitch = 5 * (Math.PI / 180); // 5 degrees in radians
    const finalPitch = pitch + additionalPitch;

    // Set camera rotation (pitch, yaw, roll)
    this.camera.rotation = new Vector3(finalPitch, yaw, 0);

    this.logger.info('Camera positioned for initial view', {
      cameraPosition: cameraPosition,
      targetPoint: targetPoint,
      yaw: yaw * (180 / Math.PI),
      pitch: finalPitch * (180 / Math.PI),
      pitchAdjustment: '5° down'
    });
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
