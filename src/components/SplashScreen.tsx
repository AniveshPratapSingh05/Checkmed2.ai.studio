import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeartPulse, Activity, Sparkles, MapPin, ArrowRight, Flame, Shield, Zap, Award, Sword, Volume2 } from 'lucide-react';
import { speakWelcomeToCheckmed } from '../lib/sound';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState('Booting Checkmed Engine by Late X...');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(25);
      setStepText('Initializing Late X Core Modules...');
    }, 400);

    const timer2 = setTimeout(() => {
      setProgress(60);
      setStepText('Loading ICU Bed Tracker & Live GPS Ambulance Dispatch...');
    }, 1100);

    const timer3 = setTimeout(() => {
      setProgress(88);
      setStepText('Syncing Multi-Hospital Network & OPD Live Token Queues...');
    }, 1800);

    const timer4 = setTimeout(() => {
      setProgress(100);
      setStepText('Checkmed Ready • Designed by Late X ⚔️🔥');
    }, 2500);

    const timer5 = setTimeout(() => {
      setIsExiting(true);
      speakWelcomeToCheckmed();
      setTimeout(onComplete, 600); // Allow exit animation
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    speakWelcomeToCheckmed(true);
    setTimeout(onComplete, 300);
  };


  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070B14] text-white overflow-hidden p-6 select-none"
        >
          {/* Intense Radial Neon Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#EF4444]/25 via-[#F59E0B]/20 to-[#0EA5E9]/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#38BDF8]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Skip Intro Button */}
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleSkip}
            className="absolute top-6 right-6 px-4 py-2 rounded-full bg-[#1E293B]/90 hover:bg-[#334155] border border-[#F59E0B]/50 text-xs font-black text-white hover:text-[#F59E0B] transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-md shadow-xl"
          >
            <span>Skip Animation</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
          </motion.button>

          {/* Central Animated Content Container */}
          <div className="relative flex flex-col items-center justify-center max-w-lg w-full text-center space-y-7 z-10">
            
            {/* High-Energy Glowing Team Emblem */}
            <div className="relative flex items-center justify-center">
              
              {/* Spinning Pulsing Energy Rings */}
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                className="absolute w-44 h-44 rounded-full border-2 border-dashed border-[#F59E0B]/60"
              />
              <motion.div
                animate={{ rotate: -360, scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className="absolute w-52 h-52 rounded-full border border-dotted border-[#EF4444]/50"
              />
              <motion.div
                animate={{ scale: [1, 1.35, 1], opacity: [0.8, 0.1, 0.8] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="absolute w-36 h-36 rounded-full bg-[#0EA5E9]/20 blur-md"
              />

              {/* Main Badge Card */}
              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#EF4444] via-[#F59E0B] to-[#0EA5E9] p-1 shadow-2xl shadow-[#F59E0B]/50 flex items-center justify-center border-2 border-white/60 relative group"
              >
                <div className="w-full h-full rounded-[22px] bg-[#0F172A] flex flex-col items-center justify-center relative overflow-hidden">
                  <HeartPulse className="w-10 h-10 text-[#EF4444] animate-pulse drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
                  <span className="text-[10px] font-black text-[#F59E0B] tracking-wider uppercase mt-1">LATE X</span>
                </div>
              </motion.div>
            </div>

            {/* Main Animated Title & Tagline */}
            <div className="space-y-3">
              
              {/* Creator Team Badge Banner */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#EF4444]/20 via-[#F59E0B]/20 to-[#0EA5E9]/20 border border-[#F59E0B]/60 text-white text-xs font-black uppercase tracking-widest shadow-lg backdrop-blur-md"
              >
                <Flame className="w-4 h-4 text-[#F59E0B] animate-bounce" />
                <span className="bg-gradient-to-r from-[#F59E0B] via-[#EF4444] to-[#38BDF8] bg-clip-text text-transparent font-black">
                  PRESENTED BY LATE X
                </span>
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              </motion.div>

              {/* Giant "CHECKMED APP" Animated Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-none"
              >
                Checkmed <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#10B981]">App</span>
              </motion.h1>

              {/* Sub-Headline "By Late X" */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-base sm:text-lg font-black text-[#F59E0B] tracking-wide"
              >
                <Sword className="w-5 h-5 text-[#EF4444] animate-pulse" />
                <span className="underline decoration-[#F59E0B] decoration-2 underline-offset-4">
                  By Late X
                </span>
                <Zap className="w-5 h-5 text-[#F59E0B] animate-bounce" />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xs text-[#CBD5E1] font-semibold max-w-sm mx-auto"
              >
                24x7 Multi-Hospital Emergency Network • Live ICU Beds • GPS Ambulances • OPD Queues
              </motion.p>
            </div>

            {/* Regional City Badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center gap-1.5 flex-wrap text-[10px] font-extrabold text-[#CBD5E1]"
            >
              {['Kanpur', 'Gorakhpur', 'Prayagraj', 'Varanasi', 'Lucknow'].map((city) => (
                <span
                  key={city}
                  className="px-2.5 py-1 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center gap-1 text-[#38BDF8] shadow-md"
                >
                  <MapPin className="w-3 h-3 text-[#10B981]" /> {city}
                </span>
              ))}
            </motion.div>

            {/* Animated Loading Bar & Status Text */}
            <div className="w-full space-y-2.5 pt-2">
              <div className="w-full h-3 rounded-full bg-[#1E293B] border border-[#F59E0B]/40 overflow-hidden p-0.5 relative shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#EF4444] via-[#F59E0B] via-[#0EA5E9] to-[#10B981] rounded-full shadow-md"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-[#CBD5E1]">
                <span className="flex items-center gap-2 text-[#F59E0B] font-mono">
                  <Activity className="w-4 h-4 animate-spin text-[#EF4444]" />
                  {stepText}
                </span>
                <span className="font-mono text-white text-sm font-black bg-[#1E293B] px-2 py-0.5 rounded border border-[#334155]">
                  {progress}%
                </span>
              </div>
            </div>

          </div>

          {/* Footer Heartbeat Laser Graphic */}
          <div className="absolute bottom-6 left-0 right-0 text-center opacity-40 pointer-events-none">
            <svg className="w-full h-10 text-[#F59E0B]" viewBox="0 0 500 50" fill="none">
              <path
                d="M0 25 L150 25 L160 5 L170 45 L180 2 L190 48 L200 25 L500 25"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

