import { motion, AnimatePresence } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import { Trophy, Play, ShoppingCart, Pause, Gauge, Timer, Crown, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';

export default function UI() {
  const { gameState, setGameState, score, highScore, coins, elapsedTime, resetRunProgress, getSpeed, getLevel, setPlayerLane } = useGameStore();
  const [showShop, setShowShop] = useState(false);

  const startRun = () => {
    resetRunProgress();
    setPlayerLane(0);
    setGameState('PLAYING');
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center font-mono ui-container shadow-none ui-vignette">
      {gameState === 'START' && (
        <div className="absolute top-8 left-8 pointer-events-none flex items-center gap-2 text-yellow-200 text-sm sm:text-base font-bold tracking-[0.18em] hud-panel">
          <Crown size={18} /> HIGH SCORE {Math.floor(highScore)}
        </div>
      )}

      {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
        <div className="absolute top-8 left-8 pointer-events-none flex flex-col gap-2 text-left hud-panel">
          <div className="text-cyan-200 text-2xl font-bold italic tracking-wider drop-shadow-[0_0_12px_rgba(34,211,238,0.95)]">
            SCORE: {Math.floor(score)}
          </div>
          <div className="flex items-center gap-2 text-yellow-200 text-sm font-bold tracking-[0.18em]">
            <Crown size={16} /> BEST {Math.floor(highScore)}
          </div>
          <div className="flex items-center gap-2 text-fuchsia-200 text-sm font-bold tracking-[0.18em]">
            <Gauge size={16} /> SPEED {getSpeed().toFixed(0)}
          </div>
          <div className="flex items-center gap-2 text-lime-200 text-sm font-bold tracking-[0.18em]">
            <Timer size={16} /> LEVEL {getLevel()} / {Math.floor(elapsedTime)}S
          </div>
        </div>
      )}

      {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs sm:text-sm text-white/60 tracking-[0.18em] pointer-events-none">
          SPACE PAUSE / ARROWS SHIFT LANES
        </div>
      )}

      <AnimatePresence mode="wait">
        {gameState === 'START' && (
          <motion.div
            key="start-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="pointer-events-auto flex flex-col items-center gap-5 sm:gap-7 px-5 py-7 text-center start-panel cover-panel"
          >
            <div className="cover-badges">
              <span className="cover-badge cover-badge-cyan"><Sparkles size={14} /> NIGHT CITY</span>
              <span className="cover-badge cover-badge-pink">LEVEL SHIFT</span>
              <span className="cover-badge cover-badge-lime"><Zap size={14} /> 60 FPS MODE</span>
            </div>

            <div className="cover-title-wrap">
              <div className="text-xs sm:text-sm font-bold tracking-[0.45em] text-fuchsia-200/80 uppercase">
                Neon velocity protocol
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black italic tracking-tighter text-white title-glow cover-title uppercase">
                CYBER <span>OCTAGON</span>
              </h1>
              <div className="cover-subtitle">RUN THE RAINBOW GRID</div>
            </div>

            <div className="cover-stats">
              <div>
                <span>BEST</span>
                <strong>{Math.floor(highScore)}</strong>
              </div>
              <div>
                <span>MODE</span>
                <strong>ARCADE</strong>
              </div>
              <div>
                <span>THREAT</span>
                <strong>RISING</strong>
              </div>
            </div>

            <div className="cover-controls">
              <div className="flex items-center gap-2">
                <kbd>LEFT</kbd>
                <kbd>RIGHT</kbd>
                <span>SHIFT LANES</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd>SPACE</kbd>
                <span>PAUSE</span>
              </div>
              <div className="cover-warning">Faster speed, tighter gates, no mercy</div>
            </div>

            <button
              onClick={startRun}
              className="group cover-start-button"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Play size={24} fill="currentColor" /> START MISSION
              </span>
            </button>

            <div className="cover-secondary-actions">
              <button
                onClick={() => setShowShop(true)}
                className="cover-icon-button"
              >
                <ShoppingCart size={24} />
              </button>
              <button className="cover-leader-button">
                <Trophy size={20} /> LEADERBOARD
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'PAUSED' && (
          <motion.div
            key="paused-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-auto flex flex-col items-center gap-5 pause-panel px-8 py-7 mx-4"
          >
            <div className="flex items-center gap-3 text-cyan-300 text-3xl sm:text-4xl font-black tracking-[0.18em]">
              <Pause size={32} fill="currentColor" /> PAUSED
            </div>
            <div className="text-white/60 text-sm tracking-[0.16em]">PRESS SPACE TO RESUME</div>
            <button
              onClick={() => setGameState('PLAYING')}
              className="px-8 py-3 border border-cyan-400 text-cyan-300 font-bold hover:bg-cyan-400 hover:text-black transition-colors"
            >
              RESUME
            </button>
          </motion.div>
        )}

        {gameState === 'GAME_OVER' && (
          <motion.div
            key="game-over-screen"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-auto flex flex-col items-center gap-4 gameover-panel p-8 sm:p-12 mx-4"
          >
            <h2 className="text-3xl sm:text-5xl font-black text-red-500 mb-2 tracking-widest text-center">MISSION FAILED</h2>
            <div className="text-xl sm:text-2xl text-white">FINAL SCORE: {Math.floor(score)}</div>
            <div className="flex items-center gap-2 text-base sm:text-lg text-yellow-200 mb-6 sm:mb-8 italic font-bold">
              <Crown size={20} /> HIGH SCORE: {Math.floor(highScore)}
            </div>

            <button
              onClick={startRun}
              className="px-8 py-3 bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
            >
              TRY AGAIN
            </button>
            <button
              onClick={() => setGameState('START')}
              className="text-gray-400 hover:text-white transition-colors"
            >
              MAIN MENU
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShop && (
          <motion.div
            key="shop-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 pointer-events-auto p-8"
          >
            <div className="w-full max-w-2xl border-2 border-cyan-500 p-8 relative">
              <button
                onClick={() => setShowShop(false)}
                className="absolute top-4 right-4 text-cyan-500 hover:text-white"
              >
                [ CLOSE ]
              </button>
              <h2 className="text-3xl font-bold text-cyan-400 mb-8">CYBER SKIN REPOSITORY</h2>
              <div className="grid grid-cols-2 gap-4">
                {['DEFAULT', 'NEON PINK', 'GOLDEN VIRUS', 'VOID CRYSTAL'].map((skin) => (
                  <div key={skin} className="p-4 border border-cyan-800 bg-cyan-950/20 hover:border-cyan-400 cursor-pointer transition-all">
                    <div className="text-lg font-bold">{skin}</div>
                    <div className="text-cyan-600 text-sm">COST: 500 CREDITS</div>
                  </div>
                ))}
              </div>
              <div className="mt-12 text-fuchsia-400 font-bold">CREDITS: {coins}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
