import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Loader } from '@react-three/drei';
import { TreeParticles } from './components/TreeParticles';
import { EnvironmentSetup } from './components/EnvironmentSetup';
import { Overlay } from './components/Overlay';
import { TreeState } from './types';

function App() {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.SCATTERED);

  const toggleState = () => {
    setTreeState((prev) => 
      prev === TreeState.SCATTERED ? TreeState.TREE_SHAPE : TreeState.SCATTERED
    );
  };

  return (
    <div className="relative w-full h-screen bg-[#000502]">
      {/* Main 3D Scene */}
      <Canvas
        shadows
        camera={{ position: [0, 5, 25], fov: 45 }}
        dpr={[1, 2]} // Performance optimization for high DPI screens
        gl={{ antialias: false, toneMappingExposure: 1.2 }}
      >
        <Suspense fallback={null}>
          <EnvironmentSetup />
          
          <TreeParticles mode={treeState} />
          
          <OrbitControls 
            enablePan={false}
            enableZoom={true}
            minDistance={10}
            maxDistance={50}
            autoRotate={treeState === TreeState.SCATTERED}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 1.5} // Prevent going below ground too much
          />
          
          {/* Ground Reflection Plane for luxury feel */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial 
              color="#010a06" 
              roughness={0} 
              metalness={0.8}
              opacity={0.8}
              transparent
            />
          </mesh>
        </Suspense>
      </Canvas>

      {/* Loading Overlay from Drei */}
      <Loader 
        containerStyles={{ background: '#000502' }}
        innerStyles={{ background: '#111', width: '200px' }}
        barStyles={{ background: '#d4af37', height: '2px' }}
        dataStyles={{ color: '#d4af37', fontFamily: 'Montserrat', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}
      />

      {/* UI Overlay */}
      <Overlay currentState={treeState} onToggleState={toggleState} />
    </div>
  );
}

export default App;