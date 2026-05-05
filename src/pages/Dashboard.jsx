import { motion } from 'framer-motion'
import { Gauge, HeartPulse, TrendingUp, Award, BookOpen, Users, Volume2, Brain } from 'lucide-react'
import { useMood } from '../context/MoodContext'
import { sampleAyat, badges } from '../data/ayat'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { moods, streak, points, badges: userBadges, todayMood } = useMood()
  
  const dashboardData = {
    moodToday: todayMood || 'calm',
    streak,
    points,
    dailyAyat: sampleAyat[0],
    badges: userBadges.length > 0 ? userBadges : ['Sabr', 'Syukur', 'Tawakkal'],
    moodHistory: moods.slice(0,5).map(m => Math.floor(Math.random() * 25 + 70)) || [75, 82, 68, 91, 85]
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Dashboard */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-white to-primary-100 bg-clip-text text-transparent drop-shadow-2xl"
          >
            Selamat Datang
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-primary-100/90 font-medium text-center max-w-3xl mx-auto mb-16 leading-relaxed"
          >
            Ringkasan Harian Spiritual & Mental Resilience
          </motion.p>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <HeartPulse className="w-6 h-6 text-neutral-900" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-200 uppercase tracking-wider">Mood Hari Ini</p>
                </div>
              </div>
              <div className="mood-calm text-3xl font-bold mb-2">{dashboardData.moodToday}</div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div className="mood-calm h-3 rounded-full" style={{width: '75%'}} />
              </div>
            </div>
            <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-neutral-900" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-200 uppercase tracking-wider">Streak</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-emerald-300">{dashboardData.streak}<span className="text-lg"> hari</span></div>
            </div>
            <div className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-neutral-900" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-200 uppercase tracking-wider">Total Poin</p>
                </div>
              </div>
              <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-accent-400 to-yellow-400 bg-clip-text text-transparent">{dashboardData.points.toLocaleString()}</div>
              <p className="text-primary-200 mt-2">Rank #47 • Level 5</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="py-20 bg-neutral-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Link to="/mood" className="group bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-3xl p-8 shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-500/10 to-transparent transform group-hover:translate-x-4 transition-transform duration-500" />
              <HeartPulse className="w-16 h-16 text-white/90 group-hover:text-accent-300 mx-auto mb-6 opacity-90 group-hover:opacity-100 transition-all" />
              <h3 className="font-heading text-2xl font-bold mb-3 text-center drop-shadow-lg">Mood Tracker</h3>
              <p className="text-primary-100 text-center leading-relaxed opacity-90">Manual atau Auto via Kamera</p>
            </Link>
            <Link to="/daily" className="group bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-3xl p-8 shadow-2xl hover:shadow-emerald-500/40 hover:-translate-y-2 transition-all duration-500 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent transform group-hover:translate-x-4 transition-transform" />
              <BookOpen className="w-16 h-16 text-white/90 group-hover:scale-110 mx-auto mb-6 transition-all" />
              <h3 className="font-heading text-2xl font-bold mb-3 text-center">Daily Reflection</h3>
              <p className="text-primary-100 text-center">Ayat Harian + Tafsir</p>
            </Link>
            <Link to="/mindful" className="group bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-3xl p-8 shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-2 transition-all duration-500 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-transparent transform group-hover:translate-x-4" />
              <Brain className="w-16 h-16 text-white/90 mx-auto mb-6 group-hover:rotate-12 transition-all" />
              <h3 className="font-heading text-2xl font-bold mb-3 text-center">Mindfulness</h3>
              <p className="text-primary-100 text-center">Pernapasan + Ayat Penenang</p>
            </Link>
            <Link to="/journal" className="group bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-2 transition-all duration-500 md:col-span-2 lg:col-span-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400/20 to-transparent transform group-hover:translate-x-4" />
              <Moon className="w-16 h-16 text-white/90 mx-auto mb-6 group-hover:scale-110" />
              <h3 className="font-heading text-2xl font-bold mb-3 text-center">Resilience Journal</h3>
              <p className="text-primary-100 text-center">Catatan + Ayat Inspirasi + PDF Export</p>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Badges & Ayat Preview */}
      <section className="py-20 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Badges */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h2 className="section-title">Badge Kamu ({dashboardData.badges.length}/9)</h2>
              <div className="grid grid-cols-3 gap-4">
                {dashboardData.badges.map((badge, i) => (
                  <motion.div
                    key={badge}
                    whileHover={{ scale: 1.1, y: -8 }}
                    className="group relative"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-4 shadow-2xl group-hover:shadow-primary-500/50 transition-all flex flex-col items-center justify-center text-white font-bold text-lg">
                      {badge.charAt(0)}
                    </div>
                    <p className="text-center text-sm font-medium text-neutral-700 mt-2 capitalize">{badge}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Daily Ayat Preview */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-white via-primary-50 to-primary-100 rounded-3xl p-12 shadow-2xl border border-primary-200/50 quran-card"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-accent-400 rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-7 h-7 text-neutral-900" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-neutral-900">Ayat Harian</h3>
                  <p className="text-primary-700 font-semibold">QS Al-Insyirah 5-6</p>
                </div>
              </div>
              <div className="arabic text-3xl font-bold text-quran-arabic mb-6 leading-relaxed text-right">
                فَإِذَا فَرَغْتَ فَانْصَبْ • وَإِلَىٰ رَبِّكَ فَارْغَبْ
              </div>
              <p className="text-lg text-quran-tafsir mb-6 leading-relaxed">
                "Maka apabila engkau telah selesai (dari suatu urusan), tetaplah bekerja keras (untuk urusan yang lain), dan kepada Tuhanmulah engkau berharap."
              </p>
              <audio controls className="w-full rounded-2xl shadow-lg">
                <track default kind="captions" />
                Your browser does not support the audio element.
              </audio>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mood History Chart (fake) */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-16">Mood History Minggu Ini</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dashboardData.moodHistory.map((mood, i) => (
              <div key={i} className="group text-center p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-3">
                <div className="mood-happy h-4 w-full rounded-full mb-4 mx-auto max-w-[120px]" style={{width: `${mood}%`}} />
                <p className="text-3xl font-bold text-neutral-900">{mood}%</p>
                <p className="text-sm text-neutral-600 font-medium capitalize mt-2">Hari {i+1}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

