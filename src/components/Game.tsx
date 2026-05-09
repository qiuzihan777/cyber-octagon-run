import Player from './Player';
import Track from './Track';
import Obstacles from './Obstacles';
import Cityscape from './Cityscape';
import { Stars } from '@react-three/drei';

export default function Game() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <hemisphereLight color="#7dd3fc" groundColor="#4c1d95" intensity={0.75} />
      <pointLight position={[4, 3, 6]} color="#00e5ff" intensity={2.4} />
      <pointLight position={[-5, 2, -8]} color="#ff2bd6" intensity={2.7} />
      <pointLight position={[0, 4, -18]} color="#facc15" intensity={1.25} />
      <spotLight 
        position={[0, 10, 0]} 
        angle={0.2} 
        penumbra={1} 
        intensity={2.4} 
      />
      
      <Stars radius={120} depth={60} count={2200} factor={5.2} saturation={0.55} fade speed={1.1} />
      
      <Player />
      <Track />
      <Cityscape />
      <Obstacles />
    </>
  );
}
