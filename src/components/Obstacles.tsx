import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../store/useGameStore';

const obstacleCount = 28;
const baseObstacleSpacing = 13;
const obstacleStartZ = -24;
const obstacleHalfWidth = 0.81;
const obstacleHalfDepth = 0.45;
const playerRadius = 0.46;
const lanes = [-2, 0, 2];
const obstacleColors = ['#ff1744', '#ff7a00', '#facc15', '#39ff14', '#00e5ff', '#8b5cf6', '#ff2bd6'];

const getRandomLaneX = (previousLaneX?: number) => {
  const shouldAvoidRepeat = previousLaneX !== undefined && Math.random() < 0.72;
  const availableLanes = shouldAvoidRepeat ? lanes.filter((lane) => lane !== previousLaneX) : lanes;
  return availableLanes[Math.floor(Math.random() * availableLanes.length)];
};

const createObstacleLayout = () => {
  let previousLaneX: number | undefined;

  return Array.from({ length: obstacleCount }, (_, index) => {
    const laneX = getRandomLaneX(previousLaneX);
    previousLaneX = laneX;

    return {
      id: index,
      position: new THREE.Vector3(
        laneX,
        0.55,
        -index * baseObstacleSpacing + obstacleStartZ
      )
    };
  });
};

export default function Obstacles() {
  const { gameState, setGameState, playerX, getSpeed, getLevel } = useGameStore();
  const groupRef = useRef<THREE.Group>(null);
  const previousGameState = useRef(gameState);

  const obstacles = useMemo(createObstacleLayout, []);

  useFrame((_, delta) => {
    const isNewRun = gameState === 'PLAYING' && (
        previousGameState.current === 'START' ||
        previousGameState.current === 'GAME_OVER'
    );

    if (isNewRun) {
        if (groupRef.current) {
            const nextLayout = createObstacleLayout();
            groupRef.current.position.set(0, 0, 0);
            groupRef.current.children.forEach((child, index) => {
                child.position.copy(nextLayout[index].position);
                child.visible = true;
            });
        }
    }
    previousGameState.current = gameState;

    if (gameState !== 'PLAYING') return;
    
    if (groupRef.current && groupRef.current.children) {
        const level = getLevel();
        const activeObstacleCount = Math.min(obstacleCount, 18 + level * 2);
        const obstacleSpacing = Math.max(7.2, baseObstacleSpacing - (level - 1) * 0.85);
        const loopDistance = activeObstacleCount * obstacleSpacing;

        groupRef.current.position.z += delta * (getSpeed() + 4 + level * 1.2);
        
        const children = groupRef.current.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (!child) continue;
            child.visible = i < activeObstacleCount;
            if (!child.visible) continue;
            
            const worldPos = new THREE.Vector3();
            child.getWorldPosition(worldPos);
            
            // Re-spawn
            if (worldPos.z > 5) {
                child.position.z -= loopDistance;
                child.position.x = getRandomLaneX(child.position.x);
            }

            const dx = Math.abs(worldPos.x - playerX);
            const dz = Math.abs(worldPos.z - 0);
            
            if (dx < obstacleHalfWidth + playerRadius && dz < obstacleHalfDepth + playerRadius) {
                setGameState('GAME_OVER');
            }
        }
    }
  });

  return (
    <group ref={groupRef}>
      {obstacles.map((obs) => (
        <group key={obs.id} position={obs.position}>
          <Box args={[1.62, 1.14, 0.9]}>
            <meshStandardMaterial
              color={obstacleColors[obs.id % obstacleColors.length]}
              emissive={obstacleColors[obs.id % obstacleColors.length]}
              emissiveIntensity={6.2}
              roughness={0.28}
              metalness={0.42}
            />
          </Box>
          <Plane args={[1.75, 1.05]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.56, 0]}>
            <meshStandardMaterial
              color={obstacleColors[obs.id % obstacleColors.length]}
              emissive={obstacleColors[obs.id % obstacleColors.length]}
              emissiveIntensity={2.4}
              transparent
              opacity={0.34}
              depthWrite={false}
            />
          </Plane>
        </group>
      ))}
    </group>
  );
}
