import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles, Heart, Leaf, Award } from 'lucide-react'
import { testimonials } from '../data/products'

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrent((c) => (c + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  const prev = () => {
    setDirection(-1)
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  }

  const next = () => {
    setDirection(1)
    setCurrent((c) => (c + 1) % testimonials.length)
  }

  const variants = {
    enter: (dir) => ({ 
      opacity: 0, 
      x: dir > 0 ? 100 : -100,
      scale: 0.95 
    }),
    center: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' } 
    },
    exit: (dir) => ({ 
      opacity: 0, 
      x: dir > 0 ? -100 : 100,
      scale: 0.95,
      transition: { duration: 0.3 } 
    }),
  }

  const t = testimonials[current]

  return (
    <section className="section-padding bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 overflow-hidden relative">
      {/* Background with Pattern */}
      <div className="absolute inset-0">
        {/* Green gradient orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-500/30 to-transparent rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-primary-400/20 to-transparent rounded-full blur-3xl" 
        />
        
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leaf-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 5C30 5 55 20 55 40C55 52 42 57 30 57C18 57 5 52 5 40C5 20 30 5 30 5Z" fill="none" stroke="white" strokeWidth="1"/>
                <path d="M30 5L30 57" stroke="white" strokeWidth="1"/>
              </pattern>
              <pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1.5" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dot-pattern)" />
            <rect width="100%" height="100%" fill="url(#leaf-pattern)" opacity="0.5" />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-heading font-semibold px-5 py-2.5 rounded-full mb-4"
          >
            <Sparkles className="w-4 h-4 text-white" />
            Testimoni Pelanggan
          </motion.div>
          
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-3">
            Apa Kata{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-300 via-white to-primary-300">
              Pelanggan Kami?
            </span>
          </h2>
          <p className="text-white/80 text-base max-w-xl mx-auto font-medium">
            Ribuan pelanggan telah merasakan kelezatan KOENCHIPS
          </p>
        </motion.div>

        {/* Main Card */}
        <div className="relative">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              {/* Review Card - Glassmorphism */}
              <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
                {/* Quote icon */}
                <div className="flex justify-center mb-4">
                  <motion.div
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-500 rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <Quote className="w-6 h-6 text-white" />
                  </motion.div>
                </div>

                {/* Review text */}
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-body text-lg md:text-xl text-white text-center leading-relaxed mb-6"
                >
                  "{t.text}"
                </motion.p>

                {/* Rating stars */}
                <div className="flex justify-center mb-5">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
                      >
                        <Star
                          className={`w-5 h-5 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Customer info */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Info */}
                    <div>
                      <p className="font-heading font-bold text-white text-sm">{t.name}</p>
                      <p className="text-primary-200 text-xs">{t.role}</p>
                    </div>
                  </div>

                  {/* Flavor tag */}
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                    <Heart className="w-3.5 h-3.5 text-primary-300" />
                    <span className="text-white text-xs font-medium">{t.flavor}</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Decorative elements - Left Side - Bigger with gradient colors */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              x: [0, 8, 0],
              rotate: [0, 15, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -left-12 top-[15%] w-20 h-20 bg-gradient-to-br from-white via-yellow-100 to-green-200 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/40 shadow-2xl"
          >
            <Leaf className="w-10 h-10 text-primary-900" />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, 25, 0],
              x: [0, -8, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            className="absolute -left-10 bottom-[25%] w-16 h-16 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-xl"
          >
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </motion.div>
          <motion.div
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -left-16 top-1/2 w-10 h-10 bg-gradient-to-r from-yellow-300 to-white rounded-full blur-md"
          />
          <motion.div
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
            className="absolute -left-6 top-[30%] w-6 h-6 bg-gradient-to-br from-green-200 to-white rounded-full blur-sm"
          />

          {/* Decorative elements - Right Side - Bigger with gradient colors */}
          <motion.div
            animate={{ 
              y: [0, -25, 0],
              x: [0, -8, 0],
              rotate: [0, -15, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-12 top-[20%] w-20 h-20 bg-gradient-to-br from-white via-yellow-100 to-green-200 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/40 shadow-2xl"
          >
            <Award className="w-10 h-10 text-primary-900" />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              x: [0, 8, 0],
            }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 0.3 }}
            className="absolute -right-10 bottom-[20%] w-16 h-16 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30 shadow-xl"
          >
            <Star className="w-8 h-8 text-yellow-500" />
          </motion.div>
          <motion.div
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="absolute -right-16 top-1/2 w-10 h-10 bg-gradient-to-r from-green-200 to-white rounded-full blur-md"
          />
          <motion.div
            animate={{ 
              scale: [0.9, 1.3, 0.9],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.2 }}
            className="absolute -right-6 top-[25%] w-6 h-6 bg-gradient-to-br from-yellow-300 to-white rounded-full blur-sm"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prev}
            aria-label="Testimoni sebelumnya"
            className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => goTo(i)}
                aria-label={`Lihat testimoni ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current 
                    ? 'w-8 h-2.5 bg-gradient-to-r from-primary-400 to-primary-500 shadow-lg' 
                    : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={next}
            aria-label="Testimoni berikutnya"
            className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-6 md:gap-12 mt-8"
        >
          {[
            { value: '4.8+', label: 'Rating' },
            { value: '300+', label: 'Ulasan' },
            { value: '50rb+', label: 'Pelanggan' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-heading font-bold text-2xl md:text-3xl text-white">{stat.value}</p>
              <p className="text-primary-300 text-xs">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
