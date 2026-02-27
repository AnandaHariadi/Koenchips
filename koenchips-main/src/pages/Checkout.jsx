import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShoppingBag, Trash2, Plus, Minus, MessageCircle,
  User, Phone, MapPin, FileText, ArrowLeft, CheckCircle,
  Truck, Package, CreditCard, Wallet, Edit3
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
const saveOrder = (orderId, items, form, total, shippingCost, paymentMethod) => {
  try {
    const existingOrders = JSON.parse(localStorage.getItem('koenchips_orders') || '{}')
    
    const newOrder = {
      id: orderId,
      customerName: form.name,
      phone: form.phone,
      address: form.address,
      items: items.map(({ product, qty }) => ({
        name: product.name,
        image: product.image,
        price: product.price,
        qty: qty,
        subtotal: product.price * qty
      })),
      total: total,
      shippingCost: shippingCost,
      paymentMethod: paymentMethod,
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
  const [shippingCost, setShippingCost] = useState(0)
  const [courier, setCourier] = useState('jne')
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [showForm, setShowForm] = useState(false)

  const shippingOptions = [
    { id: 'jne', name: 'JNE', cost: 15000, estimate: '1-2 Hari' },
    { id: 'jnt', name: 'J&T', cost: 12000, estimate: '1-2 Hari' },
    { id: 'sicepat', name: 'SiCepat', cost: 10000, estimate: '1-3 Hari' },
    { id: 'grab', name: 'GrabExpress', cost: 20000, estimate: 'Same Day' },
  ]

  const paymentOptions = [
    { id: 'COD', name: 'COD (Bayar di Tempat)', icon: Truck },
    { id: 'Transfer', name: 'Transfer Bank', icon: CreditCard },
    { id: 'E-Wallet', name: 'E-Wallet', icon: Wallet },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleCourierChange = (option) => {
    setCourier(option.id)
    setShippingCost(option.cost)
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Nama wajib diisi'
    if (!form.phone.trim()) newErrors.phone = 'Nomor HP wajib diisi'
    if (!form.address.trim()) newErrors.address = 'Alamat wajib diisi'
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
      toast.error('Mohon lengkapi data pengiriman!')
      return
    }
    
    // Generate order ID
    const newOrderId = generateOrderId()
    const grandTotal = totalPrice + shippingCost
    
    // Save order to localStorage for tracking
    saveOrder(newOrderId, items, form, grandTotal, shippingCost, paymentMethod)
    
    // Open WhatsApp with order ID
    openWhatsApp(items, form, newOrderId)
    
    // Clear cart and redirect to tracking page
    clearCart()
    navigate(`/lacak-pesanan?id=${newOrderId}`)
  }

  const grandTotal = totalPrice + shippingCost

  return (
    <section className="bg-gray-100 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="font-heading font-bold text-xl text-neutral-900">
            Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4 space-y-3">
        {items.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
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
          <>
            {/* Alamat Pengiriman */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-primary-50 px-4 py-2 border-b border-primary-100">
                <h2 className="font-heading font-bold text-sm text-primary-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Alamat Pengiriman
                </h2>
              </div>
              <div className="p-4">
                {showForm ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Nama Penerima <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nama lengkap"
                        className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Nomor HP <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="08xx-xxxx-xxxx"
                        className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                          errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Alamat Lengkap <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Jl. Contoh No. 1, Kota, Provinsi"
                        rows={2}
                        className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
                          errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200'
                        }`}
                      />
                      {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                    </div>
                    <button
                      onClick={() => setShowForm(false)}
                      className="w-full bg-primary-500 text-white font-semibold py-2 rounded-lg text-sm"
                    >
                      Simpan Alamat
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{form.name || 'Nama Penerima'}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-600">{form.phone || 'Nomor HP'}</span>
                      </div>
                      <p className="text-sm text-gray-600">{form.address || 'Alamat belum diisi'}</p>
                      {(!form.name || !form.phone || !form.address) && (
                        <p className="text-xs text-orange-500 mt-2">Mohon lengkapi alamat pengiriman</p>
                      )}
                    </div>
                    <button
                      onClick={() => setShowForm(true)}
                      className="flex items-center gap-1 text-primary-600 font-semibold text-sm hover:text-primary-700"
                    >
                      <Edit3 className="w-4 h-4" />
                      Ubah
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Metode Pengiriman */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-primary-50 px-4 py-2 border-b border-primary-100">
                <h2 className="font-heading font-bold text-sm text-primary-800 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Metode Pengiriman
                </h2>
              </div>
              <div className="p-4 space-y-2">
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition ${
                      courier === option.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="courier"
                        checked={courier === option.id}
                        onChange={() => handleCourierChange(option)}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        courier === option.id ? 'border-primary-500' : 'border-gray-300'
                      }`}>
                        {courier === option.id && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{option.name}</p>
                        <p className="text-xs text-gray-500">Estimasi: {option.estimate}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-primary-700">
                      {formatPrice(option.cost)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Metode Pembayaran */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-primary-50 px-4 py-2 border-b border-primary-100">
                <h2 className="font-heading font-bold text-sm text-primary-800 flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Metode Pembayaran
                </h2>
              </div>
              <div className="p-4 space-y-2">
                {paymentOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                        paymentMethod === option.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === option.id}
                        onChange={() => setPaymentMethod(option.id)}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === option.id ? 'border-primary-500' : 'border-gray-300'
                      }`}>
                        {paymentMethod === option.id && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                      </div>
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="font-semibold text-sm">{option.name}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Produk */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-primary-50 px-4 py-2 border-b border-primary-100">
                <h2 className="font-heading font-bold text-sm text-primary-800 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Produk ({items.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map(({ product, qty }) => (
                  <div key={product.id} className="p-4 flex gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-neutral-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">{product.flavor} - {product.weight}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => decreaseQty(product.id)}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold">{qty}</span>
                          <button
                            onClick={() => increaseQty(product.id)}
                            className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-sm text-primary-700">
                          {formatPrice(product.price * qty)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="self-start p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Ringkasan Pembayaran */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-primary-50 px-4 py-2 border-b border-primary-100">
                <h2 className="font-heading font-bold text-sm text-primary-800 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Ringkasan Pembayaran
                </h2>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Harga ({items.length} produk)</span>
                  <span className="font-semibold">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Ongkos Kirim</span>
                  <span className="font-semibold">{formatPrice(shippingCost)}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-neutral-900">Grand Total</span>
                    <span className="font-bold text-xl text-orange-600">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky Button */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500">Total Pembayaran</p>
              <p className="font-bold text-xl text-orange-600">{formatPrice(grandTotal)}</p>
            </div>
            <motion.button
              onClick={handleCheckout}
              whileTap={{ scale: 0.97 }}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-green-500/30 flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Checkout via WhatsApp
            </motion.button>
          </div>
        </div>
      )}
    </section>
  )
}
