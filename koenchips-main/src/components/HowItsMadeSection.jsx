import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Search, Scissors, Flame, Package } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Seleksi Sukun',
    desc: 'Dipilih pada kematangan terbaik untuk tekstur ideal.',
  },
  {
    step: '02',
    icon: Scissors,
    title: 'Iris Presisi',
    desc: 'Ketebalan konsisten agar matang merata.',
  },
  {
    step: '03',
    icon: Flame,
    title: 'Proses Minim Minyak',
    desc: 'Lebih ringan, tidak berminyak.',
  },
  {
    step: '04',
    icon: Package,
    title: 'Packaging Premium',
    desc: 'Tetap renyah sampai kemasan terakhir.',
  },
]

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
}

export default function HowItsMadeSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="section-padding bg-white overflow-hidden leaf-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Steps */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              className="inline-block text-xs font-heading font-semibold text-primary-500 bg-primary-50 border border-primary-300 px-3 py-1 rounded-full mb-4"
            >
              Proses Kami
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="section-title mb-3"
            >
              Dibuat Dengan Perhatian,{' '}
              <span className="text-primary-500">Bukan Sekadar Diproduksi</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-600 mb-8 leading-relaxed"
            >
              Kami percaya rasa yang baik lahir dari proses yang benar. Setiap langkah
              dirancang untuk memastikan kualitas dan cita rasa terbaik sampai ke tanganmu.
            </motion.p>

            <motion.ol
              variants={container}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="space-y-6 relative"
            >
              {/* Connector line */}
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-primary-100 hidden sm:block" />

              {steps.map(({ step, icon: Icon, title, desc }) => (
                <motion.li key={step} variants={item} className="flex gap-5 relative">
                  <div className="shrink-0 w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-md z-10">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-heading font-bold text-primary-300">{step}</span>
                      <h3 className="font-heading font-bold text-base text-neutral-900">{title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>
          </div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-square shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=600&fit=crop&auto=format"
                alt="Pemrosesan KOENCHIPS yang higienis"
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-transparent" />
            </div>

            {/* Pattern overlay */}
            <div className="absolute -z-10 inset-0 translate-x-4 translate-y-4 bg-primary-100 rounded-3xl" />

            {/* Decorative blob */}
            <div className="absolute -z-20 -bottom-10 -right-10 w-48 h-48 bg-primary-300 rounded-full opacity-20 blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
