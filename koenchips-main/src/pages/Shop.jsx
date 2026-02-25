import { useState, useMemo, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Search, X, SlidersHorizontal, Filter } from 'lucide-react'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'

const FLAVORS = ['All', 'Chocolate', 'Matcha', 'Vanilla', 'Taro', 'Bundle']
const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Termurah' },
  { value: 'price-desc', label: 'Termahal' },
  { value: 'rating-desc', label: 'Rating Tertinggi' },
]

export default function Shop() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [sort, setSort] = useState('default')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const filtered = useMemo(() => {
    let result = [...products]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.flavor.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q)
      )
    }

    // Filter by flavor
    if (activeFilter !== 'All') {
      result = result.filter((p) => p.flavor === activeFilter)
    }

    // Sort
    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price)
    if (sort === 'rating-desc') result.sort((a, b) => b.rating - a.rating)

    return result
  }, [search, activeFilter, sort])

  return (
    <>
      {/* Page Hero */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-700 py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="shop-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#shop-grid)" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-3"
          >
            Katalog Produk
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-primary-200 text-base md:text-lg"
          >
            Temukan varian KOENCHIPS favoritmu — renyah, rendah lemak, rasa premium.
          </motion.p>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-neutral-100 min-h-[60vh] leaf-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
          {/* Search + Sort Bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="flex flex-col md:flex-row gap-3 mb-6"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="pl-9 pr-8 py-3 bg-white border border-gray-200 rounded-full text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer min-w-[160px]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Filter Chips */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            <Filter className="w-4 h-4 text-gray-400 self-center" />
            {FLAVORS.map((flavor) => (
              <button
                key={flavor}
                onClick={() => setActiveFilter(flavor)}
                className={`text-sm font-heading font-semibold px-4 py-1.5 rounded-full border transition-all duration-200 ${
                  activeFilter === flavor
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-700'
                }`}
              >
                {flavor}
              </button>
            ))}
          </motion.div>

          {/* Results count */}
          <p className="text-sm text-gray-500 mb-5">
            Menampilkan{' '}
            <span className="font-heading font-semibold text-primary-700">{filtered.length}</span>{' '}
            produk
            {search && (
              <span>
                {' '}untuk "<span className="font-semibold text-neutral-900">{search}</span>"
              </span>
            )}
          </p>

          {/* Products Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-heading font-semibold text-gray-400 text-xl mb-2">
                Produk tidak ditemukan
              </p>
              <p className="text-sm text-gray-400">
                Coba kata kunci lain atau hapus filter.
              </p>
              <button
                onClick={() => { setSearch(''); setActiveFilter('All') }}
                className="mt-4 text-primary-500 font-heading font-semibold text-sm underline"
              >
                Reset pencarian
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              <AnimatePresence>
                {filtered.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ProductCard
                      product={product}
                      onViewDetail={setSelectedProduct}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
