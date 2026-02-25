import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { products } from '../data/products'
import ProductCard from './ProductCard'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function BestSellersSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const bestSellers = products.slice(0, 4)

  return (
    <section className="section-padding bg-neutral-100 leaf-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <div>
            <span className="inline-block text-xs font-heading font-semibold text-primary-500 bg-primary-50 border border-primary-300 px-3 py-1 rounded-full mb-3">
              Pilihan Terbaik
            </span>
            <h2 className="section-title mb-1">
              Produk <span className="text-primary-500">Terfavorit</span>
            </h2>
            <p className="text-gray-600 text-sm">Yang paling sering dipesan. Sudah tahu kenapa.</p>
          </div>
          <Link
            to="/katalog"
            className="shrink-0 flex items-center gap-2 border-2 border-primary-500 text-primary-700 font-heading font-semibold px-5 py-2.5 rounded-full hover:bg-primary-50 transition-colors text-sm"
          >
            Lihat Semua
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {bestSellers.map((product) => (
            <motion.div key={product.id} variants={item}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
