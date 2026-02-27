import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, User, Phone, MapPin, ShoppingBag, CreditCard, Truck, Plus, Minus } from 'lucide-react'
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
    const existingOrders = JSON.parse(localStorage.getItem('koenchips_orders') || '[]')
    
    const newOrder = {
      id: orderId,
      customerName: form.name,
      phone: form.phone,
      address: form.address,
      paymentMethod: form.paymentMethod,
      items: items.map(({ product, qty }) => ({
        name: product.name,
        flavor: product.flavor,
        qty: qty,
        price: product.price
      })),
      total: total,
      status: 'order_placed',
      orderDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      timeline: [
        { status: 'order_placed', date: new Date().toLocaleString('id-ID'), location: 'Sidoarjo', completed: true },
        { status: 'processing', date: '-', location: 'Sidoarjo', completed: false },
        { status: 'shipped', date: '-', location: '-', completed: false },
        { status: 'in_transit', date: '-', location: '-', completed: false },
        { status: 'delivered', date: '-', location: '-', completed: false },
      ],
    }
    
    existingOrders.push(newOrder)
    localStorage.setItem('koenchips_orders', JSON.stringify(existingOrders))
    
    return newOrder
  } catch (e) {
    console.error('Failed to save order:', e)
    return null
  }
}

export default function OrderForm({ product, qty: initialQty = 1, onClose }) {
  const [qty, setQty] = useState(initialQty)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'COD',
    notes: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalPrice = product.price * qty

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const incrementQty = () => {
    if (qty < product.stock) {
      setQty(qty + 1)
    }
  }

  const decrementQty = () => {
    if (qty > 1) {
      setQty(qty - 1)
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Nama wajib diisi'
    if (!form.phone.trim()) newErrors.phone = 'Nomor HP wajib diisi'
    if (!form.address.trim()) newErrors.address = 'Alamat wajib diisi'
    return newErrors
  }

  const handleSubmit = () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    // Generate order ID
    const newOrderId = generateOrderId()
    
    // Create items array for the order
    const items = [{ product, qty }]
    
    // Save order to localStorage
    saveOrder(newOrderId, items, form, totalPrice)
    
    // Open WhatsApp with order details
    openWhatsApp(items, form, newOrderId)
    
    // Show success message
    toast.success('Pesanan dibuat! Mengarahkan ke WhatsApp...')
    
    setIsSubmitting(false)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 pointer-events-none"
      >
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-heading font-bold text-lg text-neutral-900">
              Pesan Langsung
            </h2>
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Product Summary */}
          <div className="px-5 py-4 bg-primary-50 border-b border-primary-100">
            <div className="flex items-center gap-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 object-cover rounded-xl"
              />
              <div className="flex-1">
                <p className="font-heading font-bold text-sm text-neutral-900">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500">{product.flavor}</p>
                
                {/* Quantity Control */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Jumlah:</span>
                    <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 px-1">
                      <button
                        onClick={decrementQty}
                        disabled={qty <= 1}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                      <span className="text-sm font-heading font-semibold w-6 text-center">{qty}</span>
                      <button
                        onClick={incrementQty}
                        disabled={qty >= product.stock}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <span className="font-heading font-bold text-primary-700">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-5 space-y-4">
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
                  placeholder="Nama lengkap Anda"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition ${
                    errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-heading font-semibold text-gray-700 mb-1.5">
                Nomor HP <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="08xx-xxxx-xxxx"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition ${
                    errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-heading font-semibold text-gray-700 mb-1.5">
                Alamat Rumah <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Jl. Contoh No. 1, Kota, Provinsi"
                  rows={2}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none ${
                    errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.address && (
                <p className="text-xs text-red-500 mt-1">{errors.address}</p>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-heading font-semibold text-gray-700 mb-2">
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition ${
                    form.paymentMethod === 'COD'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={form.paymentMethod === 'COD'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <Truck className="w-4 h-4" />
                  <span className="text-sm font-heading font-semibold">COD</span>
                </label>
                <label
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition ${
                    form.paymentMethod === 'Transfer'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Transfer"
                    checked={form.paymentMethod === 'Transfer'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm font-heading font-semibold">Transfer</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-heading font-semibold text-gray-700 mb-1.5">
                Catatan <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Catatan tambahan..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition resize-none"
              />
            </div>

            {/* Total & Submit */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-body text-gray-600 text-sm">Total Pesanan</span>
                <span className="font-heading font-bold text-xl text-primary-700">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-heading font-bold py-3 rounded-full transition-all duration-300 shadow-lg shadow-primary-500/30 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                {isSubmitting ? 'Memproses...' : 'Pesan via WhatsApp'}
              </motion.button>
              
              <p className="text-center text-xs text-gray-400">
                Kamu akan diarahkan ke WhatsApp untuk konfirmasi
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
