import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

const TRACKS = [
  {
    id: 1,
    title: "SIGNAL_01",
    artist: "VOID_SYNTH",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "SIGNAL_02",
    artist: "NULL_POINTER",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "SIGNAL_03",
    artist: "ROOT_ACCESS",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(p || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', skipForward);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', skipForward);
    };
  }, []);

  return (
    <div className="w-full max-w-md bg-black p-8 glitch-border relative font-pixel overflow-hidden">
      <div className="absolute inset-0 noise-bg pointer-events-none" />
      <div className="scanline" />
      <audio ref={audioRef} />
      
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-glitch-cyan flex items-center justify-center text-black font-bold">
            {isPlaying ? ">>" : "||"}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="text-glitch-cyan text-[12px] truncate glitch-text">{currentTrack.title}</h3>
            <p className="text-glitch-magenta/60 text-[8px] uppercase">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Oscilloscope Mockup */}
        <div className="h-12 border border-glitch-cyan/20 flex items-center justify-center gap-1 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: isPlaying ? [10, 30, 10] : 10 }}
              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
              className="w-1 bg-glitch-cyan/40"
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-4 bg-black border border-glitch-cyan/30 mb-8 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-glitch-magenta"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white mix-blend-difference">
          {Math.floor(progress)}%_LOADED
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-4">
        <button 
          onClick={skipBackward} 
          className="border border-glitch-cyan text-glitch-cyan py-2 hover:bg-glitch-cyan hover:text-black transition-all uppercase text-[8px]"
        >
          PREV_SIG
        </button>
        
        <button 
          onClick={togglePlay}
          className="bg-glitch-magenta text-black py-2 hover:bg-glitch-cyan transition-all uppercase text-[10px] font-bold"
        >
          {isPlaying ? "HALT" : "INIT"}
        </button>

        <button 
          onClick={skipForward} 
          className="border border-glitch-cyan text-glitch-cyan py-2 hover:bg-glitch-cyan hover:text-black transition-all uppercase text-[8px]"
        >
          NEXT_SIG
        </button>
      </div>

      <div className="mt-8 flex justify-between items-center text-[6px] text-glitch-cyan/30 uppercase">
        <span>AUDIO_STREAM_ACTIVE</span>
        <div className="flex gap-1">
          {TRACKS.map((_, i) => (
            <div 
              key={i}
              className={`w-1 h-1 ${i === currentTrackIndex ? 'bg-glitch-magenta' : 'bg-white/10'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
