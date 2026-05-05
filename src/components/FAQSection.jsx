import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { faqs } from '../data/products'
import { getDirectWALink } from '../utils/whatsapp'

export default function FAQSection() {
  const [openId, setOpenId] = useState(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id))

  return (
    <section id="faq" className="section-padding bg-white leaf-pattern">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-heading font-semibold text-primary-500 bg-primary-50 border border-primary-300 px-3 py-1 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="section-title">
            Ada <span className="text-primary-500">Pertanyaan?</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Temukan jawaban untuk pertanyaan yang sering ditanyakan.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`rounded-2xl border transition-colors duration-200 overflow-hidden ${
                openId === faq.id
                  ? 'border-primary-300 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-primary-200'
              }`}
            >
              <button
                onClick={() => toggle(faq.id)}
                aria-expanded={openId === faq.id}
                className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
              >
                <span className="font-heading font-semibold text-sm md:text-base text-neutral-900">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-primary-500" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 text-center bg-primary-50 rounded-3xl p-8 border border-primary-200"
        >
          <p className="font-heading font-bold text-lg text-neutral-900 mb-2">
            Masih ada pertanyaan?
          </p>
          <p className="text-sm text-gray-600 mb-5">
            Tim kami siap membantu kamu melalui WhatsApp.
          </p>
          <a
            href={getDirectWALink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-700 text-white font-heading font-semibold px-6 py-3 rounded-full transition-all duration-200 hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4" />
            Chat WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
