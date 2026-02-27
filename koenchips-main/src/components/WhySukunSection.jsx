import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Leaf, Zap, Heart, Award } from 'lucide-react'

const benefits = [
  {
    icon: Leaf,
    title: 'Kaya Serat Alami',
    desc: 'Memberi rasa kenyang lebih lama tanpa terasa berat.',
  },
  {
    icon: Zap,
    title: 'Energi Lebih Stabil',
    desc: 'Tidak bikin cepat lemas setelah ngemil.',
  },
  {
    icon: Heart,
    title: 'Lebih Seimbang',
    desc: 'Diproses minim minyak sehingga lebih ringan dibanding keripik konvensional.',
  },
  {
    icon: Award,
    title: 'Memberdayakan Lokal',
    desc: 'Setiap kemasan KOENCHIPS ikut mendukung petani Indonesia.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function WhySukunSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="tentang" className="section-padding bg-primary-50 batik-diagonal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
            ref={ref}
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl">
              <img
                src="/Produk bg alam.png"
                alt="Sukun segar sebagai bahan baku KOENCHIPS"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/30 to-transparent" />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-5 -right-5 md:right-6 bg-white rounded-2xl p-4 shadow-xl max-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-primary-500" />
                </div>
                <span className="font-heading font-bold text-sm text-primary-700">100% Sukun</span>
              </div>
              <p className="text-xs text-gray-500">Pangan lokal pilihan terbaik</p>
            </div>

            {/* Blob background */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary-300/20 rounded-full blur-3xl" />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <motion.span
              variants={itemVariants}
              className="inline-block text-xs font-heading font-semibold text-primary-500 bg-primary-50 border border-primary-300 px-3 py-1 rounded-full mb-4"
            >
              Kenapa Kami Memilih Sukun?
            </motion.span>
            <motion.h2 variants={itemVariants} className="section-title mb-3">
              Kami Tidak Sekadar{' '}
              <span className="text-primary-500">Membuat Keripik</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 mb-8 leading-relaxed"
            >
              Banyak camilan enak, tapi tidak semua terasa ringan. Sukun adalah pangan
              tropis lokal yang kaya serat dan energi alami — cocok jadi camilan modern
              tanpa meninggalkan akar lokalnya. Kami mengubah bahan lokal menjadi
              pengalaman ngemil yang lebih nyaman.
            </motion.p>

            <motion.ul variants={containerVariants} className="space-y-4 mb-6">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <motion.li
                  key={title}
                  variants={itemVariants}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-neutral-900 mb-0.5">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>

            <motion.p
              variants={itemVariants}
              className="text-xs text-gray-400 italic flex items-center gap-1.5"
            >
              <span>⚠️</span>
              <span>
                KOENCHIPS bukan produk kesehatan atau medis — kami hanya membantu pilihan
                ngemil yang lebih seimbang.
              </span>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
