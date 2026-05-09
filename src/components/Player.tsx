import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Octahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/useGameStore';

export default function Player() {
  const meshRef = useRef<THREE.Group>(null);
  const { selectedSkin, gameState, incrementScore, incrementElapsedTime, playerLane, setPlayerLane, setPlayerX, resetRunProgress, togglePause, getSpeed } = useGameStore();

  useFrame((_, delta) => {
    if (gameState !== 'PLAYING') return;

    if (meshRef.current) {
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        playerLane * 2,
        delta * 12
      );
      setPlayerX(meshRef.current.position.x);
      
      meshRef.current.rotation.x += delta * 5;
      meshRef.current.rotation.y += delta * 2;
      
      incrementElapsedTime(delta);
      incrementScore(delta * getSpeed());
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePause();
        return;
      }

      if (gameState !== 'PLAYING') return;
      if (e.key === 'ArrowLeft') setPlayerLane(Math.max(playerLane - 1, -1));
      if (e.key === 'ArrowRight') setPlayerLane(Math.min(playerLane + 1, 1));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, playerLane, setPlayerLane, togglePause]);

  // Reset player on the menu or before a fresh run, but keep the impact position on game over.
  useEffect(() => {
    if (gameState === 'START') {
        setPlayerLane(0);
        setPlayerX(0);
        if (meshRef.current) meshRef.current.position.set(0, 0.5, 0);
        resetRunProgress();
    }
  }, [gameState, setPlayerLane, setPlayerX, resetRunProgress]);

  return (
    <group ref={meshRef} position={[0, 0.5, 0]}>
      <Octahedron args={[0.5, 2]} castShadow>
        <MeshDistortMaterial
          color={selectedSkin === 'neon-pink' ? '#ff00ff' : '#00ffff'}
          emissive={selectedSkin === 'neon-pink' ? '#ff00ff' : '#00ffff'}
          emissiveIntensity={2}
          speed={gameState === 'PLAYING' ? 2.6 : 0.4}
          distort={gameState === 'PLAYING' ? 0.36 : 0.12}
        />
      </Octahedron>
      <pointLight 
        color={selectedSkin === 'neon-pink' ? '#ff00ff' : '#00ffff'} 
        intensity={5} 
        distance={5} 
      />
    </group>
  );
}
