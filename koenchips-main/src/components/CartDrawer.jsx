import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { X, ShoppingCart, Plus, Minus, Trash2, ShoppingBag, Truck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatCurrency'

export default function CartDrawer() {
  const { items, totalItems, totalPrice, removeItem, increaseQty, decreaseQty, isDrawerOpen, closeDrawer } = useCart()

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 flex flex-col bg-white shadow-2xl w-full sm:w-[420px]"
            aria-label="Keranjang belanja"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary-500" />
                <h2 className="font-heading font-bold text-lg text-neutral-900">
                  Keranjang
                  {totalItems > 0 && (
                    <span className="ml-2 text-sm font-body font-normal text-gray-500">
                      ({totalItems} item)
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeDrawer}
                aria-label="Tutup keranjang"
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
                  <p className="font-heading font-semibold text-gray-400 text-lg mb-2">
                    Keranjang masih kosong
                  </p>
                  <p className="text-sm text-gray-400 mb-6">
                    Yuk, pilih keripik sukun favoritmu!
                  </p>
                  {/* Buttons Row */}
                  <div className="flex flex-col gap-2 w-full max-w-[200px]">
                    <Link
                      to="/katalog"
                      onClick={closeDrawer}
                      className="bg-primary-500 text-white font-heading font-semibold px-5 py-2.5 rounded-full hover:bg-primary-700 transition-colors text-sm"
                    >
                      Lihat Katalog
                    </Link>
                    {/* Lacak Pesanan Button - Empty Cart */}
                    <Link
                      to="/lacak-pesanan"
                      onClick={closeDrawer}
                      className="flex items-center justify-center gap-2 border-2 border-primary-300 text-primary-600 font-heading font-semibold px-5 py-2.5 rounded-full hover:bg-primary-50 transition-colors text-sm"
                    >
                      <Truck className="w-4 h-4" />
                      Lacak Pesanan
                    </Link>
                  </div>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  <ul className="space-y-3">
                    {items.map(({ product, qty }) => (
                      <motion.li
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.15 }}
                        className="flex gap-3 bg-gray-50 rounded-2xl p-3"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="w-16 h-16 object-cover rounded-xl shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-heading font-semibold text-sm text-neutral-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 mb-2">{product.weight}</p>
                          <div className="flex items-center justify-between">
                            {/* Qty Control */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => decreaseQty(product.id)}
                                aria-label="Kurangi"
                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-primary-50 hover:border-primary-500 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center text-sm font-heading font-semibold">
                                {qty}
                              </span>
                              <button
                                onClick={() => increaseQty(product.id)}
                                aria-label="Tambah"
                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-primary-50 hover:border-primary-500 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="font-heading font-bold text-sm text-primary-700">
                              {formatPrice(product.price * qty)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(product.id)}
                          aria-label={`Hapus ${product.name}`}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors self-start"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-body text-gray-600 text-sm">Total Pesanan</span>
                  <span className="font-heading font-bold text-xl text-primary-700">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <Link
                  to="/checkout"
                  onClick={closeDrawer}
                  className="block w-full text-center bg-primary-500 hover:bg-primary-700 text-white font-heading font-semibold py-3 rounded-full transition-all duration-200 hover:scale-[1.01]"
                >
                  Checkout via WhatsApp
                </Link>
                <div className="flex gap-2">
                  <Link
                    to="/katalog"
                    onClick={closeDrawer}
                    className="flex-1 block text-center border-2 border-primary-500 text-primary-700 font-heading font-semibold py-2.5 rounded-full hover:bg-primary-50 transition-colors text-sm"
                  >
                    Lanjut Belanja
                  </Link>
                  <Link
                    to="/lacak-pesanan"
                    onClick={closeDrawer}
                    className="flex-1 flex items-center justify-center gap-1 bg-primary-50 text-primary-700 font-heading font-semibold py-2.5 rounded-full hover:bg-primary-100 transition-colors text-sm"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    Lacak
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
