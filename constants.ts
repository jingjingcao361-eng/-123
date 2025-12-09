import * as THREE from 'three';

export const COLORS = {
  EMERALD_DEEP: new THREE.Color('#021a12'),
  EMERALD_LIGHT: new THREE.Color('#0b4a34'),
  GOLD_METALLIC: new THREE.Color('#ffbf00'), // Rich amber gold
  GOLD_PALE: new THREE.Color('#f9e5bc'), // Champagne
  ACCENT_RED: new THREE.Color('#8a0303'), // Deep ruby (sparse)
};

export const CONFIG = {
  PARTICLE_COUNT: 2500,
  ORNAMENT_COUNT: 150,
  SCATTER_RADIUS: 25,
  TREE_HEIGHT: 14,
  TREE_RADIUS_BASE: 5,
  ANIMATION_SPEED: 2.5, // Damping factor
};

// Shader / Material props
export const GOLD_MATERIAL_PROPS = {
  metalness: 1,
  roughness: 0.15,
  envMapIntensity: 2.5,
  color: COLORS.GOLD_METALLIC,
};

export const EMERALD_MATERIAL_PROPS = {
  metalness: 0.4,
  roughness: 0.7, // Velvet-like
  envMapIntensity: 0.5,
  color: COLORS.EMERALD_LIGHT,
};