import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Droplets, Award, Sprout } from 'lucide-react'

const highlights = [
  {
    icon: Droplets,
    title: 'Rendah Lemak, Tetap Renyah',
    desc: 'Crunchy tanpa rasa berminyak di tangan.',
    color: 'bg-blue-50',
    iconColor: 'text-blue-500',
    bgIcon: 'bg-blue-100',
  },
  {
    icon: Award,
    title: 'Rasa Premium yang Tidak Membosankan',
    desc: 'Chocolate Bliss, Matcha Zen, Vanilla Cloud, Taro Twist - ringan tapi tetap terasa.',
    color: 'bg-primary-50',
    iconColor: 'text-primary-500',
    bgIcon: 'bg-primary-100',
  },
  {
    icon: Sprout,
    title: 'Lokal tapi Modern',
    desc: 'Dari sukun Indonesia, dengan standar snack kekinian.',
    color: 'bg-amber-50',
    iconColor: 'text-amber-600',
    bgIcon: 'bg-amber-100',
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function ProductHighlightsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="section-padding bg-white leaf-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-heading font-semibold text-primary-500 bg-primary-50 border border-primary-300 px-3 py-1 rounded-full mb-4">
            Kenapa Beralih ke KOENCHIPS?
          </span>
          <h2 className="section-title">
            Ngemil Tetap Nikmat,{' '}
            <span className="text-primary-500">Tanpa Berat di Badan</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Keripik biasa sering berminyak dan bikin cepat enek. KOENCHIPS dibuat dengan
            proses minim minyak - terasa lebih ringan, tapi tetap crunchy dan nagih.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {highlights.map(({ icon: Icon, title, desc, color, iconColor, bgIcon }) => (
            <motion.div
              key={title}
              variants={item}
              whileHover={{ y: -6 }}
              className={`${color} rounded-3xl p-7 text-center shadow-sm hover:shadow-md transition-shadow duration-300`}
            >
              <div className={`${bgIcon} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                <Icon className={`w-8 h-8 ${iconColor}`} />
              </div>
              <h3 className="font-heading font-bold text-xl text-neutral-900 mb-3">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
