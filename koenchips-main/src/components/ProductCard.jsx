import { useState } from 'react'
import { ShoppingCart, Star, Eye, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatCurrency'

export default function ProductCard({ product, onViewDetail }) {
  const { addItem, openDrawer } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderQty, setOrderQty] = useState(1)
  const isOutOfStock = product.stock === 0

  const handleAddToCart = () => {
    if (isOutOfStock) return
    setIsAdding(true)
    addItem(product)
    toast.success(`${product.name} ditambahkan ke keranjang!`)
    setTimeout(() => setIsAdding(false), 600)
  }

  const handleDirectOrder = () => {
    if (isOutOfStock) return
    setOrderQty(1)
    setShowOrderForm(true)
  }

  const flavorColor = {
    Chocolate: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800',
    Matcha: 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-800',
    Vanilla: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800',
    Taro: 'bg-gradient-to-r from-violet-100 to-violet-200 text-violet-800',
    Bundle: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800',
  }

  return (
    <motion.div
      className="card-product flex flex-col group relative"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Enhanced shadow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
      
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-square rounded-t-2xl">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Enhanced overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Tags - Enhanced */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-heading font-bold bg-white/95 backdrop-blur-sm text-primary-700 px-2.5 py-1 rounded-full shadow-md border border-primary-100"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View Detail Button - Enhanced */}
        {onViewDetail && (
          <motion.button
            onClick={() => onViewDetail(product)}
            aria-label={`Lihat detail ${product.name}`}
            className="absolute bottom-3 right-3 p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary-50 hover:scale-110"
            whileTap={{ scale: 0.9 }}
          >
            <Eye className="w-4 h-4 text-primary-700" />
          </motion.button>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-white text-gray-700 font-heading font-bold px-4 py-1.5 rounded-full text-sm shadow-lg">
              Habis
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 bg-white rounded-b-2xl relative z-10">
        {/* Enhanced Flavor badge */}
        <span
          className={`text-[10px] font-heading font-bold px-3 py-1 rounded-full w-fit mb-3 shadow-sm ${flavorColor[product.flavor] || 'bg-gray-100 text-gray-600'}`}
        >
          {product.flavor}
        </span>

        <h3 className="font-heading font-bold text-base text-neutral-900 leading-tight mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-1 leading-relaxed">
          {product.shortDesc}
        </p>

        {/* Rating & Stock - Enhanced */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-accent-500 text-accent-500' : 'fill-gray-200 text-gray-200'}`} 
              />
            ))}
            <span className="text-xs font-body font-medium text-gray-500 ml-1">
              {product.rating} ({product.reviews})
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
            <Package className="w-3 h-3" />
            <span>{product.stock > 0 ? `${product.stock} tersedia` : 'Habis'}</span>
          </div>
        </div>

        {/* Price + Add to Cart - Enhanced */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-body">Harga</span>
            <span className="font-heading font-bold text-xl text-primary-700">
              {formatPrice(product.price)}
            </span>
          </div>
          <div className="flex gap-2 w-full">
            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              whileTap={!isOutOfStock ? { scale: 0.9 } : {}}
              aria-label={`Tambah ${product.name} ke keranjang`}
              className={`flex items-center gap-2 text-xs font-heading font-bold px-3 py-2.5 rounded-xl transition-all duration-300 ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isAdding
                  ? 'bg-primary-300 text-primary-900 scale-95 shadow-inner'
                  : 'bg-primary-500 text-white hover:bg-primary-700 hover:shadow-lg shadow-md shadow-primary-500/30'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {isAdding ? 'Ditambahkan!' : 'Tambah'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Direct Order Form Modal */}
      {showOrderForm && (
        <OrderForm
          product={product}
          qty={orderQty}
          onClose={() => setShowOrderForm(false)}
        />
      )}
    </motion.div>
  )
}
