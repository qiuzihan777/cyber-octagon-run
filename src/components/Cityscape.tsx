import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/useGameStore';

const cityColors = ['#00e5ff', '#ff2bd6', '#39ff14', '#facc15', '#8b5cf6', '#ff7a00'];

type Building = {
  id: string;
  side: -1 | 1;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
};

const createBuildings = () => {
  const buildings: Building[] = [];

  for (let i = 0; i < 30; i++) {
    [-1, 1].forEach((side) => {
      const layer = i % 3;
      const width = 1.4 + ((i + layer) % 4) * 0.35;
      const depth = 1.4 + ((i * 3 + layer) % 5) * 0.28;
      const height = 3 + ((i * 7 + layer) % 8) * 0.65;
      const x = side * (7.2 + layer * 1.55 + ((i % 2) * 0.45));
      const z = -i * 6.4 - 8 - layer * 1.8;

      buildings.push({
        id: `${side}-${i}-${layer}`,
        side: side as -1 | 1,
        x,
        z,
        width,
        depth,
        height,
        color: cityColors[(i + layer + (side === 1 ? 2 : 0)) % cityColors.length],
      });
    });
  }

  return buildings;
};

export default function Cityscape() {
  const groupRef = useRef<THREE.Group>(null);
  const { gameState, getSpeed } = useGameStore();
  const buildings = useMemo(createBuildings, []);

  useFrame((_, delta) => {
    if (gameState !== 'PLAYING') return;

    if (groupRef.current) {
      groupRef.current.position.z += delta * (getSpeed() * 0.72);
      if (groupRef.current.position.z > 38) {
        groupRef.current.position.z = 0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {buildings.map((building, index) => (
        <group key={building.id} position={[building.x, building.height / 2 - 0.02, building.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[building.width, building.height, building.depth]} />
            <meshStandardMaterial
              color="#07111f"
              emissive="#061225"
              emissiveIntensity={0.7}
              roughness={0.55}
              metalness={0.35}
            />
          </mesh>

          {Array.from({ length: Math.min(7, Math.floor(building.height)) }).map((_, row) => (
            <mesh
              key={`window-${row}`}
              position={[
                -building.side * (building.width / 2 + 0.012),
                -building.height / 2 + 0.65 + row * 0.7,
                0,
              ]}
              rotation={[0, building.side === 1 ? Math.PI / 2 : -Math.PI / 2, 0]}
            >
              <planeGeometry args={[building.depth * 0.72, 0.08]} />
              <meshStandardMaterial
                color={building.color}
                emissive={building.color}
                emissiveIntensity={2.6 + (row % 3) * 0.55}
                transparent
                opacity={0.72}
              />
            </mesh>
          ))}

          {index % 4 === 0 && (
            <mesh
              position={[-building.side * (building.width / 2 + 0.08), building.height * 0.18, 0]}
              rotation={[0, building.side === 1 ? Math.PI / 2 : -Math.PI / 2, 0]}
            >
              <planeGeometry args={[building.depth * 0.9, 0.5]} />
              <meshStandardMaterial
                color={cityColors[(index + 3) % cityColors.length]}
                emissive={cityColors[(index + 3) % cityColors.length]}
                emissiveIntensity={4.2}
                transparent
                opacity={0.86}
              />
            </mesh>
          )}
        </group>
      ))}

      {Array.from({ length: 18 }).map((_, index) => {
        const z = -index * 10 - 4;
        const color = cityColors[index % cityColors.length];

        return (
          <group key={`street-light-${index}`}>
            {[-1, 1].map((side) => (
              <group key={side} position={[side * 5.75, 1.35, z]}>
                <mesh>
                  <cylinderGeometry args={[0.035, 0.035, 2.7, 10]} />
                  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.4} />
                </mesh>
                <pointLight color={color} intensity={0.55} distance={4.5} />
              </group>
            ))}
          </group>
        );
      })}
    </group>
  );
}

