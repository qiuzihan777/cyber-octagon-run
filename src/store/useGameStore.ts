import { create } from 'zustand';

export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
export const getRunLevel = (elapsedTime: number) => {
  if (elapsedTime < 15) return 1;
  return Math.min(8, 2 + Math.floor((elapsedTime - 15) / 12));
};
export const getRunSpeed = (elapsedTime: number) => {
  const level = getRunLevel(elapsedTime);
  return Math.min(54, 20 + (level - 1) * 4.2);
};

interface GameStore {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  togglePause: () => void;
  score: number;
  incrementScore: (amount: number) => void;
  elapsedTime: number;
  incrementElapsedTime: (amount: number) => void;
  resetRunProgress: () => void;
  getLevel: () => number;
  getSpeed: () => number;
  coins: number;
  addCoins: (amount: number) => void;
  highScore: number;
  setHighScore: (score: number) => void;
  selectedSkin: string;
  setSelectedSkin: (skin: string) => void;
  playerLane: number;
  setPlayerLane: (lane: number) => void;
  playerX: number;
  setPlayerX: (playerX: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'START',
  setGameState: (gameState) => set({ gameState }),
  togglePause: () => set((state) => {
    if (state.gameState === 'PLAYING') return { gameState: 'PAUSED' as GameState };
    if (state.gameState === 'PAUSED') return { gameState: 'PLAYING' as GameState };
    return {};
  }),
  score: 0,
  incrementScore: (amount) => set((state) => ({ score: state.score + amount })),
  elapsedTime: 0,
  incrementElapsedTime: (amount) => set((state) => ({ elapsedTime: state.elapsedTime + amount })),
  resetRunProgress: () => set({ score: 0, elapsedTime: 0 }),
  getLevel: () => getRunLevel(get().elapsedTime),
  getSpeed: () => getRunSpeed(get().elapsedTime),
  coins: 0,
  addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
  highScore: 0,
  setHighScore: (highScore) => set({ highScore }),
  selectedSkin: 'default',
  setSelectedSkin: (selectedSkin) => set({ selectedSkin }),
  playerLane: 0,
  setPlayerLane: (playerLane) => set({ playerLane }),
  playerX: 0,
  setPlayerX: (playerX) => set({ playerX }),
}));
