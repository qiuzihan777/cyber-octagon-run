import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Game from './components/Game';
import UI from './components/UI';
import { useAudio } from './hooks/useAudio';

export default function App() {
  useAudio();
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  return (
    <div className="relative w-full h-screen bg-[#02030a]">
      <Canvas
        dpr={isTouchDevice ? [1, 1.1] : [1, 1.35]}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 3.2, 8], fov: 58 }}
      >
        <color attach="background" args={['#02030a']} />
        <fog attach="fog" args={['#09051a', 8, 48]} />
        
        <Suspense fallback={null}>
          <Game />
        </Suspense>
      </Canvas>
      
      <UI />
    </div>
  );
}
