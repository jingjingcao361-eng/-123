export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface DualPosition {
  x: number;
  y: number;
  z: number;
}

export interface TreeParticleData {
  id: number;
  treePos: DualPosition;
  scatterPos: DualPosition;
  rotation: [number, number, number];
  scale: number;
  type: 'NEEDLE' | 'ORNAMENT' | 'DIAMOND';
  color: string;
}

export interface UIState {
  currentState: TreeState;
  isAudioPlaying: boolean;
}