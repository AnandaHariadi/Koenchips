import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Brain, Pause, Play, Volume2, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRandomAyat } from '../data/quran';
import { getAudio } from '../utils/quranApi';

export default function Mindfulness() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [timer, setTimer] = useState(300); // 5 min
  const [currentAyat, setCurrentAyat] = useState(getRandomAyat());
  const { dispatch } = useApp();

  const breathingCycle = useCallback(() => {
    if (!isBreathing) return;

    const phases = [
      { phase: 'inhale', duration: 4000 },
      { phase: 'hold', duration: 4000 },
      { phase: 'exhale', duration: 6000 },
      { phase: 'hold', duration: 2000 }
    ];

    let totalCycle = 0;
    phases.forEach(({ duration }) => totalCycle += duration);

    const cycle = () => {
      phases.forEach(({ phase, duration }) => {
        setTimeout(() => {
          setBreathPhase(phase);
        }, totalCycle - duration);
      });
    };

    const interval = setInterval(cycle, totalCycle);
    return interval;
  }, [isBreathing]);

  useEffect(() => {
    let interval;
    if (isBreathing) {
      breathingCycle();
      const tick = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsBreathing(false);
            clearInterval(tick);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
      interval = tick;
    }
    return () => clearInterval(interval);
  }, [isBreathing, breathingCycle]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleBreathing = () => {
    setIsBreathing(!isBreathing);
    dispatch.setLoading(!isBreathing);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-3/4 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xl px-8 py-6 rounded-3xl shadow-2xl border border-white/30 mb-8">
            <Brain className="w-12 h-12 text-yellow-300" />
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent mb-2">
                Mindfulness Mode
              </h1>
              <p className="text-xl text-white/90 font-medium">Pernapasan Qur'ani + Ayat Penenang</p>
            </div>
          </div>
        </motion.div>

        {/* Breathing Circle */}
        <motion.div
          className="w-80 h-80 mx-auto mb-12 relative"
          animate={isBreathing ? {
            scale: breathPhase === 'inhale' ? [1, 1.2, 1] : breathPhase === 'exhale' ? [1, 0.9, 1] : 1
          } : 1}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="absolute inset-0 w-80 h-80 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-2xl opacity-50 animate-pulse"></div>
          <div className="absolute inset-4 bg-white/20 backdrop-blur-2xl rounded-full shadow-xl border-4 border-white/30"></div>
          <div className="absolute inset-8 bg-gradient-to-r from-white to-blue-100 text-3xl font-bold flex items-center justify-center rounded-full shadow-inner">
            {breathPhase === 'inhale' && 'MASUK'}
            {breathPhase === 'hold' && 'TAHAN'}
            {breathPhase === 'exhale' && 'KELUAR'}
          </div>
        </motion.div>

        {/* Controls */}
        <div className="space-y-6 mb-12">
          <motion.button
            onClick={toggleBreathing}
            className={`w-full max-w-sm mx-auto block px-12 py-6 rounded-3xl font-bold text-2xl shadow-2xl transition-all duration-300 ${
              isBreathing
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/40'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-emerald-500/40'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isBreathing ? <><Pause className="w-8 h-8 inline mr-2" />Pause</> : <><Play className="w-8 h-8 inline mr-2" />Mulai Sesi}
          </motion.button>

          {isBreathing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl font-bold text-yellow-300 bg-white/20 backdrop-blur-xl px-12 py-6 rounded-3xl shadow-xl"
            >
              {formatTime(timer)}
            </motion.div>
          )}
        </div>

        {/* Ayat Companion */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30"
        >
          <div className="flex items-center gap-4 mb-6">
            <Volume2 className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl p-3 shadow-lg text-neutral-900 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold mb-1">Ayat Penenang</h3>
              <p className="text-yellow-100">Dengarkan sambil bernafas</p>
            </div>
          </div>
          <div className="arabic text-3xl font-bold mb-6 text-center py-6 bg-white/30 rounded-2xl backdrop-blur-sm glow-primary">
            {currentAyat.arabic}
          </div>
          <audio controls autoPlay={isBreathing} className="w-full rounded-2xl shadow-2xl">
            <source src={getAudio(currentAyat.id)} type="audio/mpeg" />
          </audio>
          <motion.button
            className="mt-4 w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-neutral-900 font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-yellow-400/40 transition-all"
            whileHover={{ scale: 1.02 }}
            onClick={() => setCurrentAyat(getRandomAyat('resilience'))}
          >
            Ayat Baru <Heart className="w-5 h-5 inline ml-2" />
          </motion.button>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

