import React from 'react';
import { Environment, Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export const EnvironmentSetup: React.FC = () => {
  return (
    <>
      {/* High-end Studio Lighting */}
      <ambientLight intensity={0.2} color="#001a10" />
      <spotLight
        position={[20, 20, 10]}
        angle={0.2}
        penumbra={1}
        intensity={2}
        color="#fff5e0"
        castShadow
        shadow-bias={-0.0001}
      />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#00ff88" />

      {/* Background Ambience */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={200} scale={12} size={2} speed={0.4} opacity={0.5} color="#ffd700" />

      {/* HDRI for Reflections (Gold needs this to look real) */}
      <Environment preset="city" />

      {/* Post Processing for Cinematic Feel */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.8} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.4} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.05} blendFunction={BlendFunction.OVERLAY} />
      </EffectComposer>
    </>
  );
};