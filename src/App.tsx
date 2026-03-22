import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-glitch-cyan flex flex-col items-center justify-center p-4 relative overflow-hidden font-pixel">
      {/* Background Noise Layer */}
      <div className="absolute inset-0 noise-bg pointer-events-none z-0" />
      <div className="scanline" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="z-10 flex flex-col items-center gap-12 w-full max-w-5xl"
      >
        <header className="text-center relative">
          <h1 className="text-4xl md:text-6xl font-black tracking-widest uppercase glitch-text mb-2">
            TERMINAL_SNAKE
          </h1>
          <div className="h-1 bg-glitch-magenta w-full animate-pulse" />
          <p className="text-glitch-magenta text-[8px] uppercase tracking-[0.8em] mt-4">
            ENCRYPTION_LEVEL: MAXIMUM | PROTOCOL: GLITCH_ARCADE
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start w-full">
          <div className="flex justify-center">
            <MusicPlayer />
          </div>
          
          <div className="flex justify-center">
            <SnakeGame />
          </div>
        </main>

        <footer className="w-full border-t border-glitch-cyan/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[6px] uppercase tracking-widest text-glitch-cyan/40">
          <div>USER_ID: BLVEENASHREE@GMAIL.COM</div>
          <div className="flex gap-8">
            <span className="animate-pulse">SYSTEM_STABLE: TRUE</span>
            <span>Uptime: 00:00:00:00</span>
          </div>
          <div className="glitch-text text-glitch-magenta">UNAUTHORIZED_ACCESS_DETECTED</div>
        </footer>
      </motion.div>

      {/* Screen Tearing Effect Overlays */}
      <div className="absolute top-1/4 left-0 w-full h-[1px] bg-glitch-magenta/30 animate-[glitch_2s_infinite] pointer-events-none" />
      <div className="absolute top-3/4 left-0 w-full h-[1px] bg-glitch-cyan/30 animate-[glitch_3s_infinite] pointer-events-none" />
    </div>
  );
}
