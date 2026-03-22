import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';
const SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<string>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 1);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black glitch-border relative overflow-hidden">
      <div className="absolute inset-0 noise-bg pointer-events-none" />
      <div className="scanline" />
      
      <div className="flex justify-between w-full mb-6 px-2 font-pixel text-[10px]">
        <div className="flex items-center gap-2">
          <span className="text-glitch-magenta uppercase">DATA_COLLECTED:</span>
          <span className="text-glitch-cyan glitch-text">{String(score).padStart(4, '0')}</span>
        </div>
        <div className="text-glitch-magenta/50 uppercase">
          SYS_STATUS: {isPaused ? 'IDLE' : 'ACTIVE'}
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-glitch-cyan/30 overflow-hidden"
        style={{ 
          width: GRID_SIZE * 16, 
          height: GRID_SIZE * 16,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${segment.x}-${segment.y}-${i}`}
            className={`absolute ${i === 0 ? 'bg-glitch-cyan' : 'bg-glitch-cyan/40'}`}
            style={{
              width: 16,
              height: 16,
              left: segment.x * 16,
              top: segment.y * 16,
              boxShadow: i === 0 ? '0 0 8px #00ffff' : 'none'
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-glitch-magenta animate-pulse"
          style={{
            width: 12,
            height: 12,
            left: food.x * 16 + 2,
            top: food.y * 16 + 2,
            boxShadow: '0 0 10px #ff00ff'
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 font-pixel"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-glitch-magenta glitch-text text-xl mb-6">CRITICAL_FAILURE</h2>
                  <button
                    onClick={resetGame}
                    className="bg-glitch-cyan text-black px-4 py-2 hover:bg-glitch-magenta transition-colors uppercase text-[10px]"
                  >
                    REBOOT_SYSTEM
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-glitch-cyan glitch-text text-xl mb-6">SYSTEM_HALTED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="bg-glitch-magenta text-black px-4 py-2 hover:bg-glitch-cyan transition-colors uppercase text-[10px]"
                  >
                    RESUME_PROCESS
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 text-glitch-cyan/40 text-[8px] uppercase tracking-widest font-pixel">
        INPUT: ARROWS | HALT: SPACE
      </div>
    </div>
  );
}
