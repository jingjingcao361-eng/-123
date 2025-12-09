import React, { useRef, useMemo, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CONFIG, COLORS, GOLD_MATERIAL_PROPS, EMERALD_MATERIAL_PROPS } from '../constants';
import { TreeState, TreeParticleData } from '../types';

interface TreeParticlesProps {
  mode: TreeState;
}

export const TreeParticles: React.FC<TreeParticlesProps> = ({ mode }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lightRef = useRef<THREE.Group>(null);
  
  // Dummy object for matrix calculations
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate Data Once
  const particles = useMemo(() => {
    const temp: TreeParticleData[] = [];
    const total = CONFIG.PARTICLE_COUNT + CONFIG.ORNAMENT_COUNT;

    for (let i = 0; i < total; i++) {
      const isOrnament = i >= CONFIG.PARTICLE_COUNT;
      
      // 1. Tree Position (Spiral Cone)
      // Normalized height (0 to 1)
      const pct = i / total;
      // We want ornaments distributed nicely, so we mix their indices or just place them randomly on surface
      // For this algorithm, we treat them as a single stream to form the shape
      
      const h = CONFIG.TREE_HEIGHT;
      const rBase = CONFIG.TREE_RADIUS_BASE;
      
      // y goes from -h/2 to h/2
      const yTree = (pct * h) - (h / 2);
      
      // Radius at this height (linear taper)
      // pct 0 (bottom) -> radius base
      // pct 1 (top) -> radius 0
      const currentR = rBase * (1 - pct);
      
      // Angle: Golden angle for nice distribution
      const theta = i * 2.39996; // Golden angle in radians approx
      
      const xTree = Math.cos(theta) * currentR;
      const zTree = Math.sin(theta) * currentR;

      // Add some noise to tree position for volume
      const noise = (Math.random() - 0.5) * 0.5;

      // 2. Scatter Position (Random Sphere)
      const rScatter = CONFIG.SCATTER_RADIUS * Math.cbrt(Math.random());
      const thetaScatter = Math.random() * 2 * Math.PI;
      const phiScatter = Math.acos(2 * Math.random() - 1);
      
      const xScatter = rScatter * Math.sin(phiScatter) * Math.cos(thetaScatter);
      const yScatter = rScatter * Math.sin(phiScatter) * Math.sin(thetaScatter);
      const zScatter = rScatter * Math.cos(phiScatter);

      temp.push({
        id: i,
        treePos: { x: xTree + noise, y: yTree, z: zTree + noise },
        scatterPos: { x: xScatter, y: yScatter, z: zScatter },
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: isOrnament ? Math.random() * 0.4 + 0.2 : Math.random() * 0.15 + 0.05,
        type: isOrnament ? 'ORNAMENT' : 'NEEDLE',
        color: isOrnament ? COLORS.GOLD_METALLIC.getStyle() : COLORS.EMERALD_LIGHT.getStyle()
      });
    }
    return temp;
  }, []);

  // Initialize Instance Colors
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    const color = new THREE.Color();
    
    particles.forEach((p, i) => {
        if (p.type === 'ORNAMENT') {
             color.set(COLORS.GOLD_METALLIC);
             // Make some ornaments randomly ruby or pale gold
             if (Math.random() > 0.8) color.set(COLORS.GOLD_PALE);
             if (Math.random() > 0.95) color.set(COLORS.ACCENT_RED);
        } else {
             // Variations of Green
             const shade = Math.random();
             if (shade > 0.5) color.set(COLORS.EMERALD_DEEP);
             else color.set(COLORS.EMERALD_LIGHT);
        }
        meshRef.current!.setColorAt(i, color);
    });
    meshRef.current.instanceColor!.needsUpdate = true;
  }, [particles]);

  // Animation Loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Determine target interpolation value (0 = Scatter, 1 = Tree)
    const targetLerp = mode === TreeState.TREE_SHAPE ? 1 : 0;
    
    // We store the current lerp value in a user-data property on the mesh to persist state across frames
    // If not present, init to 0
    if (meshRef.current.userData.lerpVal === undefined) {
      meshRef.current.userData.lerpVal = 0;
    }

    // Smoothly damp the current value towards target
    // Using simple lerp formula with delta for frame-rate independence
    const step = delta * CONFIG.ANIMATION_SPEED;
    meshRef.current.userData.lerpVal = THREE.MathUtils.lerp(
      meshRef.current.userData.lerpVal,
      targetLerp,
      step
    );
    
    const currentLerp = meshRef.current.userData.lerpVal;

    // If we are extremely close to the target, we can skip heavy calculation to save battery
    // But for "Interactive" feel, we might want continuous gentle motion. 
    // Let's add a "hover" breath effect when in tree mode.
    const time = state.clock.getElapsedTime();
    const breath = Math.sin(time * 0.5) * 0.02; // Subtle breathing

    particles.forEach((p, i) => {
      // Interpolate Position
      const x = THREE.MathUtils.lerp(p.scatterPos.x, p.treePos.x, currentLerp);
      const y = THREE.MathUtils.lerp(p.scatterPos.y, p.treePos.y, currentLerp);
      const z = THREE.MathUtils.lerp(p.scatterPos.z, p.treePos.z, currentLerp);

      // Add subtle motion
      const floatY = Math.sin(time + p.scatterPos.x) * 0.1 * (1 - currentLerp); // More float in scatter
      const treeBreath = currentLerp > 0.8 ? breath * (p.treePos.y + 10) * 0.1 : 0; 

      dummy.position.set(x, y + floatY + treeBreath, z);

      // Rotate particles: Ornaments spin slowly, Needles point outwards-ish or random
      if (p.type === 'ORNAMENT') {
          dummy.rotation.set(
            p.rotation[0] + time * 0.2, 
            p.rotation[1] + time * 0.1, 
            p.rotation[2]
          );
      } else {
          // Needles roughly orient to look chaotic or structured
          dummy.rotation.set(p.rotation[0], p.rotation[1] + time * 0.05, p.rotation[2]);
      }
      
      dummy.scale.setScalar(p.scale * (1 + breath)); // Scale pulse
      dummy.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Optional: Rotate the whole group slowly if in Tree mode
    if (lightRef.current && mode === TreeState.TREE_SHAPE) {
        lightRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, particles.length]}
        castShadow
        receiveShadow
      >
        {/* Using a Dodecahedron for a 'cut gem' or 'fancy ornament' look mixed with pine shape */}
        <dodecahedronGeometry args={[1, 0]} /> 
        <meshStandardMaterial
          roughness={0.2}
          metalness={0.8}
          envMapIntensity={1.5}
        />
      </instancedMesh>
      
      {/* Internal "Soul" Light of the tree */}
      <group ref={lightRef}>
        <pointLight
          position={[0, 0, 0]}
          intensity={mode === TreeState.TREE_SHAPE ? 10 : 0}
          color="#ffaa00"
          distance={15}
          decay={2}
        />
      </group>
    </group>
  );
};