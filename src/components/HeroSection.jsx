import { Link } from 'react-router-dom'
import { MessageCircle, ArrowRight, Leaf, Shield, Star, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { getDirectWALink } from '../utils/whatsapp'

const trustBadges = [
  { icon: Leaf, label: 'Rendah Lemak', emoji: '🌿' },
  { icon: Shield, label: 'Pangan Lokal', emoji: '🏠' },
  { icon: Star, label: 'Rasa Premium', emoji: '✨' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: 'easeOut' } 
  },
}

const floatAnimation = {
  y: [0, -15, 0],
  transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 min-h-[90vh] flex items-center">
      {/* Enhanced Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-primary-400/40 to-accent-500/30 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-purple-500/20 to-primary-400/30 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -bottom-32 right-1/4 w-[350px] h-[350px] bg-gradient-to-br from-accent-500/20 to-primary-300/20 rounded-full blur-3xl" 
        />

        {/* Animated rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/4 right-1/4 w-64 h-64 border border-white/5 rounded-full" 
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-white/5 rounded-full" 
        />

        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-white order-2 lg:order-1"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-heading font-semibold px-5 py-2.5 rounded-full">
                <Sparkles className="w-4 h-4 text-accent-400" />
                Bukan Sekadar Keripik
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-100 to-white drop-shadow-sm">
                Pangan Lokal,
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 drop-shadow-lg" style={{ textShadow: '0 0 30px rgba(252, 211, 77, 0.5)' }}>
                Rasa Premium
              </span>
            </motion.h1>

            {/* Product Description */}
            <motion.p
              variants={itemVariants}
              className="text-white/80 text-base sm:text-lg leading-relaxed mb-6"
            >
              KOENCHIPS menghadirkan keripik sukun rendah lemak dengan rasa premium. Renyah
              ringan, tidak enek, dan tetap memuaskan. Dibuat dari sukun lokal pilihan untuk
              kamu yang ingin ngemil tanpa rasa bersalah.
            </motion.p>

            {/* Rating Stars - Shifted right */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 ml-8 mb-8"
            >
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
              <span className="text-white/80 text-sm">100% Sukun Lokal Bahan pilihan</span>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              {trustBadges.map(({ icon: Icon, label, emoji }, index) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full cursor-default ${
                    index % 2 === 0 
                      ? 'bg-white/20 border border-white/30' 
                      : 'bg-primary-500/80 border border-primary-400'
                  }`}
                >
                  <span className="text-lg">{emoji}</span>
                  <span className="text-white text-sm font-heading font-semibold">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Product Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-full max-w-sm sm:max-w-md">
              <motion.div
                animate={floatAnimation}
                className="relative"
              >
                {/* Main Card - Smaller */}
                <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-2xl border border-white/30 rounded-[2.5rem] p-4 sm:p-6 shadow-2xl">
                  <div className="aspect-square rounded-3xl overflow-hidden mb-4 relative">
                    {/* Image overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
                    <img
                      src="/produk-samping.png"
                      alt="KOENCHIPS Keripik Sukun Premium"
                      className="w-full h-full object-contain bg-white/10 scale-90"
                    />
                    {/* Premium badge */}
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: 'spring' }}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full z-20"
                    >
                      <p className="text-xs font-bold text-primary-700">PREMIUM</p>
                    </motion.div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="text-white">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-heading font-bold text-2xl lg:text-3xl">KOENCHIPS</p>
                        <p className="text-white/70 text-sm mt-1">Renyah Ringan · Minim minyak</p>
                      </div>
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="bg-accent-500 px-3 py-1.5 rounded-full"
                      >
                        <p className="font-heading font-bold text-neutral-900 text-sm">BEST SELLER</p>
                      </motion.div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ 
                              scale: 1, 
                              rotate: 0,
                            }}
                            transition={{ 
                              delay: 1 + i * 0.1,
                              type: 'spring',
                              stiffness: 200
                            }}
                          >
                            <motion.div
                              animate={{ 
                                scale: [1, 1.2, 1],
                                filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.3
                              }}
                            >
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" style={{ filter: 'drop-shadow(0 0 4px rgba(250, 204, 21, 0.6))' }} />
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                      <span className="text-white/90 text-sm ml-1 font-medium">4.8 (300+ ulasan)</span>
                    </div>
                  </div>
                </div>

                {/* Glowing effect behind card */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent-500/30 to-primary-400/30 blur-3xl -z-10 rounded-[2.5rem]" />
              </motion.div>

              {/* Floating Badge 1 - Left */}
              <motion.div
                initial={{ opacity: 0, x: -30, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
                className="absolute -left-6 top-1/4 bg-gradient-to-br from-white to-primary-50 rounded-2xl px-4 py-3 shadow-2xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-primary-800 text-sm">Rendah Lemak</p>
                    <p className="text-gray-500 text-xs">Ngemil sehat</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge 2 - Right */}
              <motion.div
                initial={{ opacity: 0, x: 30, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.9, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
                className="absolute -right-4 bottom-1/3 bg-gradient-to-br from-accent-500 to-accent-400 rounded-2xl px-4 py-3 shadow-2xl"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-neutral-900" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-neutral-900 text-sm">4 Rasa</p>
                    <p className="text-neutral-800/70 text-xs">Coklat / Matcha / Vanilla / Taro</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge 3 - Bottom - Shifted right */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.1, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
                className="absolute -bottom-3 -right-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl px-4 py-3 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    {/* Star indicator */}
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
                    >
                      <span className="text-[10px]">★</span>
                    </motion.div>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-white text-sm">100% Sukun Lokal</p>
                    <p className="text-white/70 text-xs">Bahan pilihan</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave with gradient */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#134E4A" />
              <stop offset="50%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#134E4A" />
            </linearGradient>
          </defs>
          <path 
            d="M0 80H1440V30C1440 30 1080 80 720 50C360 20 0 80 0 80Z" 
            fill="url(#waveGradient)" 
          />
        </svg>
      </div>
    </section>
  )
}
