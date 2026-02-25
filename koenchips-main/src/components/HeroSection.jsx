import { Link } from 'react-router-dom'
import { MessageCircle, ArrowRight, Leaf, Shield, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { getDirectWALink } from '../utils/whatsapp'

const trustBadges = [
  { icon: Leaf, label: '🌿 Rendah Lemak' },
  { icon: Shield, label: '🇮🇩 Pangan Lokal' },
  { icon: Star, label: '✨ Rasa Premium' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 min-h-[90vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated blobs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-300/20 rounded-full animate-blob" />
        <div className="absolute top-1/2 -left-32 w-96 h-96 bg-primary-500/20 rounded-full animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full animate-blob animation-delay-4000" />

        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>

        {/* Leaf decorations */}
        <svg className="absolute top-10 left-10 w-16 h-16 opacity-20" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 5C30 5 55 20 55 40C55 52 42 57 30 57C18 57 5 52 5 40C5 20 30 5 30 5Z" fill="white"/>
          <path d="M30 5L30 57" stroke="#17A36B" strokeWidth="2"/>
        </svg>
        <svg className="absolute bottom-20 right-10 w-12 h-12 opacity-15 rotate-45" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 5C30 5 55 20 55 40C55 52 42 57 30 57C18 57 5 52 5 40C5 20 30 5 30 5Z" fill="white"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-white order-2 lg:order-1"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-heading font-semibold px-4 py-2 rounded-full">
                <Leaf className="w-3.5 h-3.5 text-primary-300" />
                Bukan Sekadar Keripik
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5"
            >
              Pangan Lokal, <span className="text-accent-500">Rasa Premium</span>.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-primary-100 text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
            >
              KOENCHIPS menghadirkan keripik sukun rendah lemak dengan rasa premium — renyah
              ringan, tidak enek, dan tetap memuaskan. Dibuat dari sukun lokal pilihan untuk
              kamu yang ingin ngemil tanpa rasa bersalah.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <Link
                to="/katalog"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-heading font-bold px-8 py-4 rounded-full hover:bg-primary-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg text-sm sm:text-base"
              >
                Lihat Katalog
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={getDirectWALink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary-500/80 backdrop-blur-sm border-2 border-white/30 text-white font-heading font-bold px-8 py-4 rounded-full hover:bg-primary-600 transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
              >
                <MessageCircle className="w-4 h-4" />
                Chat WhatsApp
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              {trustBadges.map(({ icon: Icon, label }) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full cursor-default"
                >
                  <Icon className="w-4 h-4 text-primary-300" />
                  <span className="text-white text-xs font-heading font-semibold">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Product Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl"
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1620984382-23e12b2fda62?w=600&h=600&fit=crop&auto=format"
                    alt="KOENCHIPS Keripik Sukun Premium"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-white">
                  <p className="font-heading font-bold text-xl">KOENCHIPS Premium</p>
                  <p className="text-primary-200 text-sm mt-1">Renyah Ringan · Minim minyak</p>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent-500 text-accent-500" />
                    ))}
                    <span className="text-xs text-primary-200 ml-2">4.8 (300+ ulasan)</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge 1 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute -left-4 top-1/4 bg-white rounded-2xl px-3 py-2 shadow-xl"
              >
                <p className="font-heading font-bold text-primary-700 text-xs">Rendah Lemak 🌿</p>
                <p className="text-gray-500 text-xs">Ngemil tanpa rasa bersalah</p>
              </motion.div>

              {/* Floating Badge 2 */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="absolute -right-4 bottom-1/4 bg-accent-500 rounded-2xl px-3 py-2 shadow-xl"
              >
                <p className="font-heading font-bold text-neutral-900 text-xs">4 Rasa ✨</p>
                <p className="text-neutral-900 text-xs opacity-75">Coklat / Matcha / Vanilla / Taro</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60H1440V20C1440 20 1080 60 720 40C360 20 0 60 0 60Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
