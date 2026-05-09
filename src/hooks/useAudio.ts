import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useGameStore } from '../store/useGameStore';

export function useAudio() {
  const { gameState } = useGameStore();
  const bgMusic = useRef<Howl | null>(null);

  useEffect(() => {
    // Cyberpunk style synthwave (placeholder URL)
    bgMusic.current = new Howl({
      src: ['https://assets.mixkit.co/music/preview/mixkit-cyberpunk-gaming-153.mp3'],
      loop: true,
      volume: 0.3,
    });

    return () => {
      bgMusic.current?.unload();
    };
  }, []);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      bgMusic.current?.play();
    } else if (gameState === 'GAME_OVER') {
      bgMusic.current?.fade(0.3, 0, 1000);
      setTimeout(() => bgMusic.current?.stop(), 1000);
    } else {
        bgMusic.current?.stop();
    }
  }, [gameState]);
}
