import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/useGameStore';

const cityColors = ['#00e5ff', '#ff2bd6', '#39ff14', '#facc15', '#8b5cf6', '#ff7a00', '#ff1744'];
const signTexts = ['RUN', 'NEON', 'BYTE', '夜市', '404', 'SYNC', '電脳', 'FOOD', 'HUB', '光'];

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

type Sign = {
  id: string;
  side: -1 | 1;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  color: string;
  text: string;
  vertical: boolean;
};

const createBuildings = () => {
  const buildings: Building[] = [];

  for (let i = 0; i < 36; i++) {
    [-1, 1].forEach((side) => {
      const layer = i % 3;
      const width = 1.35 + ((i + layer) % 4) * 0.34;
      const depth = 1.7 + ((i * 3 + layer) % 5) * 0.32;
      const height = 4 + ((i * 7 + layer) % 9) * 0.74;
      const x = side * (6.3 + layer * 1.18 + ((i % 2) * 0.32));
      const z = -i * 5.25 - 7 - layer * 1.3;

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

const createSigns = (buildings: Building[]) => {
  const signs: Sign[] = [];

  buildings.forEach((building, index) => {
    const count = index % 3 === 0 ? 3 : 2;

    for (let i = 0; i < count; i++) {
      const vertical = (index + i) % 2 === 0;
      const y = Math.min(building.height - 0.5, 1.4 + i * 1.35 + ((index % 4) * 0.25));

      signs.push({
        id: `${building.id}-sign-${i}`,
        side: building.side,
        x: building.x - building.side * (building.width / 2 + 0.08),
        y,
        z: building.z + (i - 0.5) * (building.depth * 0.38),
        width: vertical ? 0.48 : building.depth * 0.92,
        height: vertical ? 1.7 : 0.42,
        color: cityColors[(index + i * 2) % cityColors.length],
        text: signTexts[(index + i) % signTexts.length],
        vertical,
      });
    }
  });

  return signs;
};

export default function Cityscape() {
  const groupRef = useRef<THREE.Group>(null);
  const { gameState, getSpeed } = useGameStore();
  const buildings = useMemo(createBuildings, []);
  const signs = useMemo(() => createSigns(buildings), [buildings]);

  useFrame((_, delta) => {
    if (gameState !== 'PLAYING') return;

    if (groupRef.current) {
      groupRef.current.position.z += delta * (getSpeed() * 0.72);
      if (groupRef.current.position.z > 32) {
        groupRef.current.position.z = 0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 7.2, -95]}>
        <boxGeometry args={[5.8, 13, 1]} />
        <meshStandardMaterial color="#061326" emissive="#00e5ff" emissiveIntensity={0.42} />
      </mesh>
      <mesh position={[-4.6, 5.6, -92]}>
        <boxGeometry args={[3.3, 9.5, 1]} />
        <meshStandardMaterial color="#080f22" emissive="#8b5cf6" emissiveIntensity={0.36} />
      </mesh>
      <mesh position={[4.7, 5.1, -93]}>
        <boxGeometry args={[3.6, 8.3, 1]} />
        <meshStandardMaterial color="#09101c" emissive="#ff2bd6" emissiveIntensity={0.34} />
      </mesh>

      {buildings.map((building, index) => (
        <group key={building.id} position={[building.x, building.height / 2 - 0.02, building.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[building.width, building.height, building.depth]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? '#07111f' : '#0b1022'}
              emissive={index % 2 === 0 ? '#061225' : '#160923'}
              emissiveIntensity={0.8}
              roughness={0.5}
              metalness={0.42}
            />
          </mesh>

          {Array.from({ length: Math.min(10, Math.floor(building.height * 1.25)) }).map((_, row) => (
            <mesh
              key={`window-${row}`}
              position={[
                -building.side * (building.width / 2 + 0.012),
                -building.height / 2 + 0.5 + row * 0.48,
                ((row % 4) - 1.5) * building.depth * 0.18,
              ]}
              rotation={[0, building.side === 1 ? Math.PI / 2 : -Math.PI / 2, 0]}
            >
              <planeGeometry args={[building.depth * (row % 2 === 0 ? 0.58 : 0.35), 0.055]} />
              <meshStandardMaterial
                color={cityColors[(index + row) % cityColors.length]}
                emissive={cityColors[(index + row) % cityColors.length]}
                emissiveIntensity={2.4 + (row % 3) * 0.58}
                transparent
                opacity={row % 4 === 0 ? 0.42 : 0.76}
              />
            </mesh>
          ))}

          {index % 5 === 0 && (
            <mesh position={[0, -building.height / 2 + 0.48, -building.depth / 2 - 0.035]}>
              <boxGeometry args={[building.width * 1.08, 0.55, 0.05]} />
              <meshStandardMaterial color={building.color} emissive={building.color} emissiveIntensity={3.2} />
            </mesh>
          )}
        </group>
      ))}

      {signs.map((sign) => (
        <group
          key={sign.id}
          position={[sign.x, sign.y, sign.z]}
          rotation={[0, sign.side === 1 ? Math.PI / 2 : -Math.PI / 2, 0]}
        >
          <mesh>
            <planeGeometry args={[sign.width, sign.height]} />
            <meshStandardMaterial
              color={sign.color}
              emissive={sign.color}
              emissiveIntensity={4.8}
              transparent
              opacity={0.88}
            />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[sign.width * 0.78, sign.height * 0.62]} />
            <meshBasicMaterial color="#02030a" transparent opacity={0.42} />
          </mesh>
        </group>
      ))}

      {Array.from({ length: 20 }).map((_, index) => {
        const z = -index * 8 - 4;
        const color = cityColors[index % cityColors.length];

        return (
          <group key={`street-light-${index}`}>
            {[-1, 1].map((side) => (
              <group key={side} position={[side * 5.45, 1.35, z]}>
                <mesh>
                  <cylinderGeometry args={[0.035, 0.035, 2.7, 10]} />
                  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3.4} />
                </mesh>
                <mesh position={[0, 1.45, 0]}>
                  <sphereGeometry args={[0.16, 12, 12]} />
                  <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5.2} />
                </mesh>
                <pointLight color={color} intensity={0.62} distance={4.8} />
              </group>
            ))}
          </group>
        );
      })}

      {Array.from({ length: 9 }).map((_, index) => (
        <group key={`wire-${index}`} position={[0, 4.4 + (index % 3) * 0.35, -10 - index * 11]}>
          <mesh rotation={[0, 0, 0.04 * (index % 2 === 0 ? 1 : -1)]}>
            <boxGeometry args={[11.4, 0.025, 0.025]} />
            <meshStandardMaterial color="#172554" emissive="#38bdf8" emissiveIntensity={0.45} />
          </mesh>
          <mesh position={[-3.8, -0.22, 0]}>
            <sphereGeometry args={[0.11, 10, 10]} />
            <meshStandardMaterial color="#ff2bd6" emissive="#ff2bd6" emissiveIntensity={3.8} />
          </mesh>
          <mesh position={[3.8, -0.18, 0]}>
            <sphereGeometry args={[0.11, 10, 10]} />
            <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={3.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

