import Player from './Player';
import Track from './Track';
import Obstacles from './Obstacles';
import { Stars } from '@react-three/drei';

export default function Game() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <hemisphereLight color="#7dd3fc" groundColor="#4c1d95" intensity={0.75} />
      <pointLight position={[4, 3, 6]} color="#00e5ff" intensity={3.2} />
      <pointLight position={[-5, 2, -8]} color="#ff2bd6" intensity={3.6} />
      <pointLight position={[0, 4, -18]} color="#facc15" intensity={1.8} />
      <pointLight position={[6, 2, -24]} color="#39ff14" intensity={1.9} />
      <pointLight position={[-6, 2.8, -30]} color="#ff7a00" intensity={2.1} />
      <pointLight position={[0, 6, -42]} color="#8b5cf6" intensity={2.4} />
      <spotLight 
        position={[0, 10, 0]} 
        angle={0.2} 
        penumbra={1} 
        intensity={3.3} 
        castShadow 
      />
      
      <Stars radius={120} depth={60} count={4200} factor={5.8} saturation={0.55} fade speed={1.4} />
      
      <Player />
      <Track />
      <Obstacles />
    </>
  );
}
