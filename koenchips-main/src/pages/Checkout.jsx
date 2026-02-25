import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShoppingBag, Trash2, Plus, Minus, MessageCircle,
  User, Phone, MapPin, FileText, ArrowLeft, CheckCircle,
  Truck, Package
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatCurrency'
import { openWhatsApp } from '../utils/whatsapp'
import toast from 'react-hot-toast'

// Generate random order ID
const generateOrderId = () => {
  const prefix = 'KC'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

// Save order to localStorage
const saveOrder = (orderId, items, form, total) => {
  try {
    const existingOrders = JSON.parse(localStorage.getItem('koenchips_orders') || '{}')
    
    const newOrder = {
      id: orderId,
      customerName: form.name,
      items: items.map(({ product, qty }) => `${product.name} x${qty}`),
      total: total,
      status: 'order_placed',
      orderDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      shipping: 'sicepat',
      trackingNumber: '',
      timeline: [
        { status: 'order_placed', date: new Date().toLocaleString('id-ID'), location: 'Sidoarjo', completed: true },
        { status: 'processing', date: '-', location: 'Sidoarjo', completed: false },
        { status: 'shipped', date: '-', location: '-', completed: false },
        { status: 'in_transit', date: '-', location: '-', completed: false },
        { status: 'delivered', date: '-', location: '-', completed: false },
      ],
      tracking: {
        location: 'Sidoarjo',
        driver: '-',
        vehicle: '-',
        phone: '',
      },
      form: { ...form }
    }
    
    existingOrders[orderId] = newOrder
    localStorage.setItem('koenchips_orders', JSON.stringify(existingOrders))
    
    return newOrder
  } catch (e) {
    console.error('Failed to save order:', e)
    return null
  }
}

export default function Checkout() {
  const { items, totalPrice, removeItem, increaseQty, decreaseQty, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Nama wajib diisi'
    return newErrors
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Keranjang masih kosong!')
      return
    }
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Generate order ID
    const newOrderId = generateOrderId()
    
    // Save order to localStorage for tracking
    saveOrder(newOrderId, items, form, totalPrice)
    
    // Open WhatsApp with order ID
    openWhatsApp(items, form, newOrderId)
    
    // Clear cart and redirect to tracking page
    clearCart()
    navigate(`/lacak-pesanan?id=${newOrderId}`)
  }

  return (
    <section className="bg-neutral-100 min-h-[80vh] py-10 md:py-14 leaf-pattern">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white hover:bg-gray-50 rounded-full shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-neutral-900">
            Checkout
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="font-heading font-semibold text-gray-400 text-xl mb-2">
              Keranjang kosong
            </p>
            <p className="text-sm text-gray-400 mb-6">Belum ada produk yang dipilih.</p>
            <Link
              to="/katalog"
              className="bg-primary-500 text-white font-heading font-semibold px-6 py-3 rounded-full hover:bg-primary-700 transition-colors text-sm"
            >
              Lihat Katalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            {/* Left: Cart items */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="font-heading font-bold text-base text-neutral-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-primary-500" />
                  Pesanan Kamu ({items.length} produk)
                </h2>

                <ul className="space-y-3">
                  {items.map(({ product, qty }) => (
                    <motion.li
                      key={product.id}
                      layout
                      className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="w-16 h-16 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-sm text-neutral-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 mb-2">{product.weight}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => decreaseQty(product.id)}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-primary-50 hover:border-primary-500 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-sm font-heading font-bold">{qty}</span>
                            <button
                              onClick={() => increaseQty(product.id)}
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-primary-50 hover:border-primary-500 transition-colors"
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
                        className="self-start p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Form */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="font-heading font-bold text-base text-neutral-900 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary-500" />
                  Detail Pemesan
                </h2>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-heading font-semibold text-gray-700 mb-1.5">
                      Nama Lengkap <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nama kamu..."
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition ${
                          errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs red-500 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-heading font-semibold text-gray-700 mb-1.5">
                      No. HP{' '}
                      <span className="text-gray-400 font-body font-normal">(opsional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="08xx-xxxx-xxxx"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-heading font-semibold text-gray-700 mb-1.5">
                      Alamat Pengiriman{' '}
                      <span className="text-gray-400 font-body font-normal">(opsional)</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Jl. Contoh No. 1, Kota..."
                        rows={2}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-heading font-semibold text-gray-700 mb-1.5">
                      Catatan{' '}
                      <span className="text-gray-400 font-body font-normal">(opsional)</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Catatan tambahan untuk pesanan..."
                        rows={2}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-20">
                <h2 className="font-heading font-bold text-base text-neutral-900 mb-4">
                  Ringkasan Pesanan
                </h2>

                <div className="space-y-2 mb-4">
                  {items.map(({ product, qty }) => (
                    <div key={product.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate flex-1 mr-2">
                        {product.name} x{qty}
                      </span>
                      <span className="font-heading font-semibold text-neutral-900 shrink-0">
                        {formatPrice(product.price * qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-3 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="font-heading font-semibold text-gray-700">Total</span>
                    <span className="font-heading font-bold text-xl text-primary-700">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                <motion.button
                  onClick={handleCheckout}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-heading font-bold py-3.5 rounded-full transition-all duration-300 hover:scale-[1.01] shadow-lg shadow-primary-500/30"
                >
                  <MessageCircle className="w-4 h-4" />
                  Checkout via WhatsApp
                </motion.button>

                <p className="text-center text-xs text-gray-400 mt-3">
                  Kamu akan diarahkan ke WhatsApp untuk konfirmasi pesanan.
                </p>
                
                {/* Tracking Button - More Visible */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                  <Link 
                    to="/lacak-pesanan" 
                    className="flex items-center justify-center gap-2 w-full bg-primary-50 hover:bg-primary-100 text-primary-700 font-heading font-semibold py-2.5 rounded-full transition-colors text-sm"
                  >
                    <Truck className="w-4 h-4" />
                    Cek Pesanan & Lacak Paket
                  </Link>
                  <p className="text-center text-xs text-gray-400">
                    Sudah pernah pesan? Klik untuk lacak
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
