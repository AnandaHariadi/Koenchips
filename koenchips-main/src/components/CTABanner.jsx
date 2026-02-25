import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { getDirectWALink } from '../utils/whatsapp'

export default function CTABanner() {
  return (
    <section className="section-padding bg-white leaf-pattern">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-br from-primary-700 to-primary-500 rounded-3xl px-8 py-14 md:py-16 text-center shadow-2xl"
        >
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-16 translate-y-16" />

          <p className="text-primary-200 text-sm font-heading font-semibold mb-3 tracking-wider uppercase">
            Ngemil Tanpa Overthinking
          </p>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
            Pesan KOENCHIPS Sekarang.
          </h2>
          <p className="text-primary-100 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Renyah, ringan, dan tetap memuaskan. Siap dikirim ke seluruh Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/katalog"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-heading font-bold px-7 py-3.5 rounded-full hover:bg-primary-50 transition-all duration-200 hover:scale-[1.02] shadow-lg"
            >
              Lihat Katalog
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={getDirectWALink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-heading font-bold px-7 py-3.5 rounded-full hover:bg-white/10 transition-all duration-200 hover:scale-[1.02]"
            >
              <MessageCircle className="w-4 h-4" />
              Beli via WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
