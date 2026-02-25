import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
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
    }, 4500)
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
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, transition: { duration: 0.3 } }),
  }

  const t = testimonials[current]

  return (
    <section className="section-padding bg-gradient-to-br from-primary-900 to-primary-700 overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="15" cy="15" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-heading font-semibold text-primary-300 bg-white/10 border border-primary-300/30 px-3 py-1 rounded-full mb-4">
            Kata Mereka
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-3">
            Ngemil KOENCHIPS, Terus Nambah
          </h2>
          <p className="text-primary-200">
            Bukan kami yang bilang. Ini kata pelanggan kami.
          </p>
        </motion.div>

        <div className="relative min-h-[260px] flex items-center justify-center">
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
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-10 text-center">
                <Quote className="w-8 h-8 text-primary-300 mx-auto mb-4 opacity-60" />
                <p className="font-body text-lg md:text-xl text-white leading-relaxed mb-6">
                  {t.text}
                </p>
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? 'fill-accent-500 text-accent-500' : 'text-gray-500'}`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary-300"
                  />
                  <div className="text-left">
                    <p className="font-heading font-bold text-white text-sm">{t.name}</p>
                    <p className="text-primary-300 text-xs">{t.role}</p>
                  </div>
                  <span className="ml-2 text-xs bg-primary-500/50 text-primary-100 px-2 py-0.5 rounded-full">
                    {t.flavor}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={prev}
            aria-label="Testimoni sebelumnya"
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Lihat testimoni ${i + 1}`}
                className={`rounded-full transition-all duration-200 ${
                  i === current ? 'w-6 h-2.5 bg-accent-500' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Testimoni berikutnya"
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </section>
  )
}
