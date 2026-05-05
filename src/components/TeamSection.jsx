import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Instagram, Linkedin } from 'lucide-react'
import { teamMembers } from '../data/products'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function TeamSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (

    <section id="team" className="section-padding bg-primary-50 batik-diagonal">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-heading font-semibold text-primary-500 bg-white border border-primary-300 px-3 py-1 rounded-full mb-4">
            Tim Kami
          </span>
          <h2 className="section-title">
            Kami Bukan Sekadar{' '}
            <span className="text-primary-500">Jualan Snack</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Kami ingin pangan lokal terasa modern.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              variants={item}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative w-20 h-20 mx-auto mb-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/team/photo-template.svg'
                  }}
                  className="w-full h-full rounded-full object-cover border-4 border-primary-100"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>

              <h3 className="font-heading font-bold text-base text-neutral-900 mb-0.5">
                {member.name}
              </h3>
              <p className="text-xs font-heading font-semibold text-primary-500 mb-3">{member.role}</p>
              <p className="text-xs text-gray-500 mb-3">{member.studyProgram}</p>
              <p className="text-xs text-gray-500 italic leading-relaxed mb-4">{member.quote}</p>

              <div className="flex items-center justify-center gap-2">
                <a
                  href={member.instagram}
                  aria-label={`Instagram ${member.name}`}
                  className="w-8 h-8 bg-primary-50 hover:bg-primary-500 hover:text-white text-primary-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href={member.linkedin}
                  aria-label={`LinkedIn ${member.name}`}
                  className="w-8 h-8 bg-primary-50 hover:bg-primary-500 hover:text-white text-primary-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
