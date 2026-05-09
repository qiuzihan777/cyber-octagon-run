import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Plane, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/useGameStore';

export default function Track() {
  const groupRef = useRef<THREE.Group>(null);
  const { gameState, getSpeed } = useGameStore();
  const laneColors = ['#00e5ff', '#39ff14', '#ff2bd6', '#facc15', '#ff7a00'];
  const ringColors = ['#00e5ff', '#ff2bd6', '#39ff14', '#facc15', '#8b5cf6', '#ff7a00'];

  useFrame((_, delta) => {
    if (gameState !== 'PLAYING') return;

    if (groupRef.current) {
      groupRef.current.position.z += delta * getSpeed();
      if (groupRef.current.position.z > 20) {
        groupRef.current.position.z = 0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <Plane args={[10, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -40]}>
        <MeshReflectorMaterial
          blur={[260, 80]}
          resolution={1024}
          mixBlur={0.9}
          mixStrength={30}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#050505"
          metalness={0.5}
          mirror={1}
        />
      </Plane>
      
      <gridHelper args={[10, 10, '#00ffff', '#164e63']} rotation={[0, 0, 0]} position={[0, 0.01, -40]} />
      <gridHelper args={[10, 20, '#facc15', '#581c87']} rotation={[0, 0, 0]} position={[0, 0.012, -50]} />

      {laneColors.map((color, index) => (
        <Plane
          key={color}
          args={[index % 2 === 0 ? 0.08 : 0.045, 100]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-4 + index * 2, 0.025 + index * 0.002, -40]}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={4}
            transparent
            opacity={0.78}
          />
        </Plane>
      ))}

      {Array.from({ length: 9 }).map((_, index) => (
        <mesh key={`gate-${index}`} position={[0, 1.85, -10 - index * 11]} rotation={[0, 0, Math.PI / 8 + index * 0.06]}>
          <torusGeometry args={[3.65, 0.035, 8, 72]} />
          <meshStandardMaterial
            color={ringColors[index % ringColors.length]}
            emissive={ringColors[index % ringColors.length]}
            emissiveIntensity={4.4}
            transparent
            opacity={0.72}
          />
        </mesh>
      ))}
      
      <Plane args={[1, 100]} rotation={[0, -Math.PI / 2, 0]} position={[-5, 0.5, -40]}>
        <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={6.5} />
      </Plane>
      <Plane args={[1, 100]} rotation={[0, Math.PI / 2, 0]} position={[5, 0.5, -40]}>
        <meshStandardMaterial color="#ff7a00" emissive="#ff7a00" emissiveIntensity={6.5} />
      </Plane>
    </group>
  );
}
