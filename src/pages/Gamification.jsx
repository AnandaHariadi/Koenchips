import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, Crown, Users, TrendingUp, Gauge } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useMood } from '../context/MoodContext';
import { badges } from '../data/ayat';

export default function Gamification() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(3);
  const { gamify } = useApp();
  const { points, streak } = useMood();

  useEffect(() => {
    // Mock leaderboard
    setLeaderboard([
      { name: 'Abdullah S.', points: 1250, rank: 1, level: 8 },
      { name: 'Fatimah K.', points: 980, rank: 2, level: 7 },
      { name: 'Ustadz Kamal', points: 850, rank: 3, level: 6 },
      { name: 'Aisyah R.', points: 720, rank: 4, level: 5 },
    ]);
  }, []);

  const userLevel = Math.min(Math.floor(points / 200) + 1, 20);

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-heading font-bold text-center mb-8 bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent"
        >
          Gamifikasi Qur'ani
        </motion.h1>
        <p className="text-xl text-neutral-600 text-center mb-16 max-w-3xl mx-auto leading-relaxed">
          Badge Sabr • Syukur • Tawakkal | Poin | Leaderboard Komunitas
        </p>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Progress & Stats */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* User Stats */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 border border-amber-100 glow-accent">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex flex-col items-center justify-center text-2xl font-bold text-white shadow-2xl">
                  <div className="text-4xl mb-1">{userLevel}</div>
                  <div className="text-sm opacity-90">LVL</div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-neutral-900 mb-1">Rank #{userRank}</h3>
                  <p className="text-5xl font-black text-amber-600">{points.toLocaleString()}</p>
                  <p className="text-neutral-600 font-medium">Total Poin</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">{streak}</div>
                  <p className="text-sm text-neutral-600 uppercase tracking-wider">Streak</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">47%</div>
                  <p className="text-sm text-neutral-600 uppercase tracking-wider">Win Rate</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-purple-600 mb-1">12</div>
                  <p className="text-sm text-neutral-600 uppercase tracking-wider">Badges</p>
                </div>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-4 mb-6 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((points % 2000) / 20, 100)}%` }}
                  transition={{ duration: 2 }}
                />
              </div>
              <p className="text-center text-neutral-600 text-lg font-semibold">
                Next Level: {200 * userLevel} poin lagi
              </p>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-amber-100">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-600" />
                Badge Kamu ({gamify.badges.length || 3}/12)
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {badges.slice(0, 8).map((badge) => (
                  <motion.div
                    key={badge.id}
                    className="group relative cursor-pointer"
                    whileHover={{ scale: 1.1, y: -8 }}
                  >
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl transition-all group-hover:shadow-amber-500/50 ${
                      gamify.badges.includes(badge.id) 
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white' 
                        : 'bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-500'
                    }`}>
                      {badge.icon}
                    </div>
                    <p className="text-xs font-bold text-center mt-2 capitalize group-hover:text-amber-700">
                      {badge.name}
                    </p>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-all">
                      ✓
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-amber-100">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                Leaderboard Minggu Ini
              </h3>
              <div className="space-y-4">
                {leaderboard.map(({ name, points, rank, level }, index) => (
                  <motion.div
                    key={name}
                    className={`flex items-center gap-4 p-6 rounded-2xl transition-all ${
                      rank === userRank 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-2xl border-4 border-yellow-400' 
                        : index < 3 
                          ? 'bg-gradient-to-r from-yellow-100 to-orange-100 hover:bg-yellow-200 border-2 border-yellow-200' 
                          : 'hover:bg-neutral-50 border border-neutral-200'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-white/50 to-transparent rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
                      {rank === 1 ? <Crown className="w-8 h-8 text-yellow-400" /> : rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{name}</p>
                      <p className="text-sm opacity-75">Level {level}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black">{points.toLocaleString()}</div>
                      <div className="text-sm opacity-75">poin</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Daily Goals */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-amber-100">
              <h4 className="text-xl font-bold text-neutral-900 mb-6">Target Harian</h4>
              <div className="space-y-3">
                {[
                  { goal: 'Mood tracking', progress: 1, target: 1, icon: <Gauge className="w-5 h-5" /> },
                  { goal: 'Journal', progress: 0, target: 1, icon: <Book className="w-5 h-5" /> },
                  { goal: 'Reflection', progress: 0, target: 1, icon: <Star className="w-5 h-5" /> },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">{item.goal}</p>
                      <div className="w-full bg-neutral-200 rounded-full h-2 mt-1">
                        <motion.div 
                          className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full shadow-sm"
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.progress / item.target) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-bold text-sm text-neutral-700">{item.progress}/{item.target}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

