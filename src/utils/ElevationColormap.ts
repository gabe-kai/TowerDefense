/**
 * Elevation Colormap - Creates materials that color terrain based on elevation
 * 
 * Provides elevation-based coloring with bands at 1m and 5m intervals
 */

import { ShaderMaterial, Scene, Color3, Effect } from '@babylonjs/core';
import { createCategoryLogger } from './Logger';
import { GameScale } from './GameScale';

export class ElevationColormap {
  private static instance: ElevationColormap;
  private materials: Map<string, ShaderMaterial> = new Map();
  private logger = createCategoryLogger('ElevationColormap');

  private constructor() {
    // Initialize shader
    this.initializeShader();
  }

  static getInstance(): ElevationColormap {
    if (!ElevationColormap.instance) {
      ElevationColormap.instance = new ElevationColormap();
    }
    return ElevationColormap.instance;
  }

  /**
   * Initialize the elevation colormap shader
   */
  private initializeShader(): void {
    // Vertex shader - passes through position and world position
    const vertexShader = `
      precision highp float;
      
      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;
      
      uniform mat4 worldViewProjection;
      uniform mat4 world;
      
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      
      void main() {
        vec4 worldPos = world * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        vPosition = position;
        vNormal = normal;
        gl_Position = worldViewProjection * vec4(position, 1.0);
      }
    `;

    // Fragment shader - colors based on elevation with bands
    const fragmentShader = `
      precision highp float;
      
      varying vec3 vPosition;
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      
      uniform float minElevation;
      uniform float maxElevation;
      uniform float bandInterval1m;
      uniform float bandInterval5m;
      uniform float bandThickness1m;
      uniform float bandThickness5m;
      
      // Sea level (0m elevation) - but terrain is raised, so water is at -10m relative to base
      const float seaLevel = -10.0; // Adjusted for raised terrain
      const float sandLevel = -5.0; // 5m above sea level (now -5m)
      
      // Calculate slope angle from normal (0 = flat, 90 = vertical)
      float getSlopeAngle(vec3 normal) {
        // normal.y is the cosine of the slope angle
        // For flat terrain: normal.y = 1, angle = 0°
        // For vertical: normal.y = 0, angle = 90°
        float slopeRadians = acos(clamp(normal.y, 0.0, 1.0));
        return slopeRadians * (180.0 / 3.14159265359); // Convert to degrees
      }
      
      // Simple noise function for texture variation
      float noise2D(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      // Get terrain color based on elevation and slope
      vec3 getTerrainColor(float elevation, float slopeAngle) {
        // Sea level and below: dark blue
        if (elevation <= seaLevel) {
          return vec3(0.0, 0.1, 0.4); // Dark blue for sea level
        }
        
        // 0-5m above sea level: sandy brown (dark to light)
        if (elevation <= sandLevel) {
          float sandHeight = elevation / sandLevel; // 0 to 1
          // Sandy brown: dark brown at low, light tan at high
          vec3 darkSand = vec3(0.4, 0.3, 0.2); // Dark brown
          vec3 lightSand = vec3(0.7, 0.65, 0.5); // Light tan
          return mix(darkSand, lightSand, sandHeight);
        }
        
        // 5m+ above sea level: grass or rock based on slope
        // Consider slopes > 30 degrees as rocky
        const float rockSlopeThreshold = 30.0;
        
        if (slopeAngle > rockSlopeThreshold) {
          // Rocky gray with uniform noise
          vec3 baseRock = vec3(0.5, 0.5, 0.5); // Medium gray
          vec2 rockNoiseCoord = vWorldPosition.xz * 0.1; // Uniform noise scale
          float rockNoise = noise2D(rockNoiseCoord) * 0.2; // ±20% variation
          return baseRock + vec3(rockNoise);
        } else {
          // Dark grassy green with noise
          vec3 baseGrass = vec3(0.1, 0.4, 0.15); // Dark green
          vec2 grassNoiseCoord = vWorldPosition.xz * 0.05; // Higher frequency noise
          float grassNoise = (noise2D(grassNoiseCoord) - 0.5) * 0.15; // ±15% variation
          return baseGrass + vec3(grassNoise * 0.3, grassNoise, grassNoise * 0.2); // More variation in green
        }
      }
      
      void main() {
        // Get elevation from world Y position
        float elevation = vWorldPosition.y;
        
        // Calculate slope angle from normal
        float slopeAngle = getSlopeAngle(normalize(vNormal));
        
        // Get terrain color based on elevation and slope
        vec3 baseColor = getTerrainColor(elevation, slopeAngle);
        
        // Calculate band patterns for elevation visualization
        float absElev = abs(elevation);
        float mod1m = mod(absElev, bandInterval1m);
        float mod5m = mod(absElev, bandInterval5m);
        
        // Check if we're in a band
        bool inBand1m = mod1m < bandThickness1m || mod1m > (bandInterval1m - bandThickness1m);
        bool inBand5m = mod5m < bandThickness5m || mod5m > (bandInterval5m - bandThickness5m);
        
        // Apply bands (only if above sea level, don't band the water)
        vec3 finalColor = baseColor;
        if (elevation > seaLevel) {
          if (inBand5m) {
            // Thicker 5m bands: darker
            finalColor = baseColor * 0.7;
          } else if (inBand1m) {
            // Thinner 1m bands: slightly darker
            finalColor = baseColor * 0.9;
          }
        }
        
        // Add subtle lighting based on normal
        vec3 lightDir = normalize(vec3(0.5, 1.0, 0.3));
        float lightIntensity = max(dot(normalize(vNormal), lightDir), 0.4);
        finalColor *= lightIntensity;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    // Register shader using Effect.ShadersStore
    Effect.ShadersStore['elevationColormapVertexShader'] = vertexShader;
    Effect.ShadersStore['elevationColormapFragmentShader'] = fragmentShader;
    
    this.logger.info('Elevation colormap shader initialized');
  }

  /**
   * Create an elevation colormap material
   */
  createMaterial(
    scene: Scene,
    materialId: string,
    minElevation: number = GameScale.GORGE_DEPTH,
    maxElevation: number = GameScale.MOUNTAIN_HEIGHT,
    bandInterval1m: number = 1.0,
    bandInterval5m: number = 5.0,
    bandThickness1m: number = 0.05,
    bandThickness5m: number = 0.15
  ): ShaderMaterial {
    if (this.materials.has(materialId)) {
      return this.materials.get(materialId)!;
    }

    const shaderMaterial = new ShaderMaterial(
      materialId,
      scene,
      {
        vertex: 'elevationColormap',
        fragment: 'elevationColormap'
      },
      {
        attributes: ['position', 'normal', 'uv'],
        uniforms: [
          'worldViewProjection',
          'world',
          'minElevation',
          'maxElevation',
          'bandInterval1m',
          'bandInterval5m',
          'bandThickness1m',
          'bandThickness5m'
        ],
        needAlphaBlending: false
      }
    );

    // Set uniform values
    shaderMaterial.setFloat('minElevation', minElevation);
    shaderMaterial.setFloat('maxElevation', maxElevation);
    shaderMaterial.setFloat('bandInterval1m', bandInterval1m);
    shaderMaterial.setFloat('bandInterval5m', bandInterval5m);
    shaderMaterial.setFloat('bandThickness1m', bandThickness1m);
    shaderMaterial.setFloat('bandThickness5m', bandThickness5m);

    this.materials.set(materialId, shaderMaterial);
    this.logger.info('Elevation colormap material created', {
      materialId,
      minElevation,
      maxElevation
    });

    return shaderMaterial;
  }

  /**
   * Get existing material
   */
  getMaterial(materialId: string): ShaderMaterial | undefined {
    return this.materials.get(materialId);
  }

  /**
   * Dispose of all materials
   */
  dispose(): void {
    this.materials.forEach(material => material.dispose());
    this.materials.clear();
  }
}
