import { motion } from 'framer-motion'
import { Mosque, Sparkles, Heart } from 'lucide-react'

const splashVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.3
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.5 }
  }
}

const logoVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: { 
    scale: 1, 
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      delay: 0.5
    }
  }
}

export default function SplashScreen() {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 text-white p-8 overflow-hidden relative"
      variants={splashVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Animated background elements */}
      <motion.div 
        className="absolute inset-0"
        animate={{ 
          background: [
            'radial-gradient(circle at 20% 80%, rgba(16,185,129,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(217,119,6,0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 40%, rgba(16,185,129,0.2) 0%, transparent 50%)'
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Crescent moons */}
      <motion.div 
        className="absolute top-20 left-20 w-24 h-24 border border-white/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div 
        className="absolute bottom-32 right-24 w-20 h-20 border border-white/10 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        {/* Logo */}
        <motion.div 
          variants={logoVariants}
          className="mb-8"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-primary-400 via-primary-500 to-accent-500 rounded-3xl p-6 shadow-2xl glow-primary mb-6 mx-auto">
            <Mosque className="w-20 h-20 text-white mx-auto" />
          </div>
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-arabic font-bold bg-gradient-to-r from-white via-primary-100 to-accent-200 bg-clip-text text-transparent mb-4 tracking-wide"
          >
            JAGUAR
          </motion.h1>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <h2 className="arabic text-2xl md:text-3xl font-bold text-primary-100 mb-3">
              القرآن الرقمي التفاعلي
            </h2>
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="text-xl md:text-2xl text-primary-100/90 font-heading font-semibold leading-tight mb-8 max-w-lg mx-auto"
        >
          Deteksi Ekspresi Wajah &amp; Mood Tracker
        </motion.p>
        <motion.p 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.8 }}
          className="text-lg md:text-xl text-primary-200/80 font-medium max-w-md mx-auto"
        >
          Solusi Krisis Resilience Mental Spiritual Generasi Muda Indonesia
        </motion.p>

        {/* Features preview */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.8 }}
          className="flex flex-wrap gap-4 mt-12 justify-center"
        >
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-neutral-900" />
            </div>
            <span className="font-heading font-semibold text-sm">Gamifikasi Qur'ani</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-semibold text-sm">Mood Tracking</span>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.7, duration: 1.5 }}
          className="w-24 h-2 bg-white/20 rounded-full mt-16 mx-auto overflow-hidden"
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-accent-400 to-primary-400 rounded-full"
          />
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-900 to-transparent" />
    </motion.div>
  )
}

