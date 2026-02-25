import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, Star, ShoppingCart, Package, Tag, Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatCurrency'

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart()
  const isOutOfStock = product.stock === 0

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addItem(product)
    toast.success(`${product.name} ditambahkan ke keranjang!`)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        key="modal-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 pointer-events-none"
      >
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Image */}
          <div className="relative aspect-video overflow-hidden rounded-t-3xl">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={onClose}
              aria-label="Tutup modal"
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white text-gray-700 font-heading font-bold px-4 py-1.5 rounded-full">
                  Stok Habis
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-heading font-semibold bg-primary-50 text-primary-700 border border-primary-200 px-2.5 py-0.5 rounded-full"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>

            <h2 className="font-heading font-bold text-xl text-neutral-900 mb-1">
              {product.name}
            </h2>
            <p className="text-sm text-gray-500 mb-3">{product.weight}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-accent-500 text-accent-500'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} ulasan)
              </span>
            </div>

            {/* Long Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-5">{product.longDesc}</p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5 text-sm">
              <Package className="w-4 h-4 text-gray-400" />
              <span className={product.stock > 0 ? 'text-primary-600' : 'text-red-500'}>
                {product.stock > 0 ? `Stok tersedia: ${product.stock} pcs` : 'Stok habis'}
              </span>
            </div>

            {/* Price + CTA */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <span className="font-heading font-bold text-2xl text-primary-700">
                {formatPrice(product.price)}
              </span>
              <motion.button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
                className={`flex items-center gap-2 font-heading font-bold px-5 py-2.5 rounded-full transition-all duration-200 ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-primary-500 text-white hover:bg-primary-700 hover:scale-[1.02]'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Tambah ke Keranjang
              </motion.button>
            </div>

            {/* Lacak Pesanan Button */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link
                to="/lacak-pesanan"
                className="flex items-center justify-center gap-2 w-full bg-primary-50 hover:bg-primary-100 text-primary-700 font-heading font-semibold py-3 rounded-full transition-colors"
              >
                <Truck className="w-4 h-4" />
                Lacak Pesanan Saya
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
