import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Package, Truck, CheckCircle, Clock, 
  Phone, Home, MessageCircle, RotateCcw,
  Search, PackageCheck, Send, User, FileText
} from 'lucide-react'
import { getDirectWALink } from '../utils/whatsapp'

// Shipping provider logos/names
const shippingProviders = {
  'jne': 'JNE Express',
  'sicepat': 'SiCepat',
  'gosend': 'GoSend',
  'grab': 'GrabExpress',
  'anteraja': 'AnterAja',
  'pos': 'Pos Indonesia',
  'wdk': 'Wahana',
}

// Status configuration
const statusConfig = {
  order_placed: { 
    icon: Package, 
    color: 'text-blue-500', 
    bg: 'bg-blue-50',
    label: 'Pesanan Diterima',
    desc: 'Pesananmu telah diterima dan sedang diproses'
  },
  processing: { 
    icon: PackageCheck, 
    color: 'text-yellow-500', 
    bg: 'bg-yellow-50',
    label: 'Sedang Diproses',
    desc: 'Pesanan sedang disiapkan'
  },
  shipped: { 
    icon: Send, 
    color: 'text-purple-500', 
    bg: 'bg-purple-50',
    label: 'Dikirim',
    desc: 'Pesanan telah handed over ke kurir'
  },
  in_transit: { 
    icon: Truck, 
    color: 'text-orange-500', 
    bg: 'bg-orange-50',
    label: 'Dalam Perjalanan',
    desc: 'Kurir sedang dalam perjalanan'
  },
  delivered: { 
    icon: CheckCircle, 
    color: 'text-green-500', 
    bg: 'bg-green-50',
    label: 'Diterima',
    desc: 'Pesanan telah diterima'
  },
}

// Sample tracking data
const sampleOrders = {
  'KC-2024A1': {
    customerName: 'Customer',
    customerPhone: '0822-6558-8823',
    customerAddress: 'Jl. Raya No. 123, Surabaya',
    items: ['KOENCHIPS Chocolate Bliss 70g', 'Bundle Quartet'],
    total: 92000,
    status: 'in_transit',
    orderDate: '2024-01-20',
    estimatedDelivery: '2024-01-23',
    shipping: 'sicepat',
    trackingNumber: 'SCP-123456789',
    timeline: [
      { status: 'order_placed', date: '2024-01-20 09:30:00', location: 'Sidoarjo', completed: true },
      { status: 'processing', date: '2024-01-20 11:00:00', location: 'Sidoarjo', completed: true },
      { status: 'shipped', date: '2024-01-21 08:00:00', location: 'Sidoarjo', completed: true },
      { status: 'in_transit', date: '2024-01-22 14:00:00', location: 'Surabaya', completed: true },
      { status: 'delivered', date: '-', location: '-', completed: false },
    ],
    tracking: {
      location: 'Surabaya Utara',
      driver: 'Budi Santoso',
      vehicle: 'Motor',
      phone: '+6282123456789',
    }
  },
  'KC-2024B2': {
    customerName: 'Customer',
    customerPhone: '0822-6558-8823',
    customerAddress: 'Jl. Mangga No. 45, Sidoarjo',
    items: ['KOENCHIPS Matcha Zen 70g'],
    total: 21000,
    status: 'shipped',
    orderDate: '2024-01-21',
    estimatedDelivery: '2024-01-24',
    shipping: 'jne',
    trackingNumber: 'JNE-987654321',
    timeline: [
      { status: 'order_placed', date: '2024-01-21 14:20:00', location: 'Sidoarjo', completed: true },
      { status: 'processing', date: '2024-01-21 16:00:00', location: 'Sidoarjo', completed: true },
      { status: 'shipped', date: '2024-01-22 09:00:00', location: 'Sidoarjo', completed: true },
      { status: 'in_transit', date: '-', location: '-', completed: false },
      { status: 'delivered', date: '-', location: '-', completed: false },
    ],
    tracking: {
      location: 'Sidoarjo',
      driver: '-',
      vehicle: '-',
      phone: '',
    }
  }
}

// Get orders from localStorage
const getStoredOrders = () => {
  try {
    const stored = localStorage.getItem('koenchips_orders')
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export default function OrderTracking() {
  const [searchParams] = useSearchParams()
  const initialOrderId = searchParams.get('id') || ''
  
  const [orderId, setOrderId] = useState(initialOrderId)
  const [searchInput, setSearchInput] = useState(initialOrderId)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Search for order
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchInput.trim()) {
      setError('Masukkan nomor pesanan terlebih dahulu')
      return
    }

    setLoading(true)
    setError(null)
    setOrder(null)

    await new Promise(resolve => setTimeout(resolve, 800))

    let foundOrder = sampleOrders[searchInput.toUpperCase()]
    
    if (!foundOrder) {
      const storedOrders = getStoredOrders()
      foundOrder = storedOrders[searchInput.toUpperCase()]
    }

    if (foundOrder) {
      setOrder(foundOrder)
      setOrderId(searchInput.toUpperCase())
    } else {
      setError('Pesanan tidak ditemukan. Pastikan nomor pesanan benar.')
    }

    setLoading(false)
  }

  // If orderId in URL, auto-search on mount
  useEffect(() => {
    if (initialOrderId) {
      setSearchInput(initialOrderId)
      setOrderId(initialOrderId)
      setLoading(true)
      setTimeout(() => {
        const foundOrder = sampleOrders[initialOrderId] || getStoredOrders()[initialOrderId]
        if (foundOrder) {
          setOrder(foundOrder)
        }
        setLoading(false)
      }, 500)
    }
  }, [initialOrderId])

  const currentStatusIndex = order ? order.timeline.findIndex(t => !t.completed) : 0
  const activeStep = currentStatusIndex === -1 ? order?.timeline.length - 1 : currentStatusIndex

  return (
    <section className="min-h-[80vh] py-10 md:py-14 bg-gradient-to-br from-neutral-50 via-primary-50/20 to-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
            <Truck className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-heading font-semibold text-gray-600">Lacak Pengiriman</span>
          </div>
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-neutral-900 mb-2">
            Lacak Pesanan KOENCHIPS 🚚
          </h1>
          <p className="text-gray-600 text-sm">
            Masukkan nomor pesanan untuk melihat status pengiriman
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-xl mb-6"
        >
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                placeholder="Contoh: KC-XXXXX-XXXXX"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-heading font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/30 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Lacak
                </>
              )}
            </motion.button>
          </form>

          {/* Sample order IDs */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Coba nomor pesanan ini:</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(sampleOrders).map((id) => (
                <button
                  key={id}
                  onClick={() => {
                    setSearchInput(id)
                    setOrderId(id)
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full font-mono transition ${
                    orderId === id 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-primary-50'
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 rounded-xl border border-red-100"
            >
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-body">Mencari pesanan...</p>
          </div>
        )}

        {/* Order Found - Show Details */}
        {!loading && order && (
          <AnimatePresence mode="wait">
            <motion.div
              key={orderId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Order Info Card */}
              <div className="bg-white rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-400 font-body mb-1">Nomor Pesanan</p>
                    <p className="font-heading font-bold text-xl text-primary-700">{orderId}</p>
                    {order.trackingNumber && (
                      <p className="text-xs text-gray-500 mt-1">
                        Resi: {order.trackingNumber} ({shippingProviders[order.shipping]})
                      </p>
                    )}
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-heading font-semibold ${
                    order.status === 'delivered' 
                      ? 'bg-green-50 text-green-700' 
                      : order.status === 'in_transit'
                      ? 'bg-orange-50 text-orange-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {order.status === 'delivered' ? (
                      <><CheckCircle className="w-4 h-4" /> Diterima</>
                    ) : order.status === 'in_transit' ? (
                      <><Truck className="w-4 h-4" /> Dalam Perjalanan</>
                    ) : (
                      <><Clock className="w-4 h-4" /> {statusConfig[order.status]?.label}</>
                    )}
                  </div>
                </div>

                {/* Map Section with Animated Truck */}
                <div className="relative h-56 md:h-64 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl mb-6 overflow-hidden">
                  <iframe
                    title="Delivery Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(30%) contrast(1.1)' }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.639290621062!2d112.7189!3d-7.4547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN3DCsDI3JzE2LjQiTiAxMTLCsDQzJzA5LjEiVw!5e0!3m2!1sen!2sid!4v1600000000000!5m2!1sen!2sid`}
                  />
                  
                  {/* Animated Truck Badge */}
                  {order.status !== 'delivered' && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Truck className="w-4 h-4 text-primary-500" />
                          <motion.div 
                            className="absolute -top-1 -right-1"
                            animate={{ x: [0, 3, 0], y: [0, -2, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                          </motion.div>
                        </div>
                        <span className="text-xs font-heading font-semibold text-gray-700">
                          {order.tracking.location}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  {order.status !== 'delivered' && (
                    <motion.div 
                      className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-heading font-semibold px-3 py-1.5 rounded-full shadow-lg"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      🚚 Sedang Dikirim
                    </motion.div>
                  )}
                </div>

                {/* Driver Info */}
                {order.status !== 'delivered' && order.tracking.driver !== '-' && (
                  <div className="bg-gradient-to-r from-primary-50 to-white rounded-2xl p-4 border border-primary-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <motion.div
                            animate={{ x: [0, 2, 0] }}
                            transition={{ repeat: Infinity, duration: 0.5 }}
                          >
                            <Truck className="w-6 h-6 text-primary-600" />
                          </motion.div>
                        </div>
                        <div>
                          <p className="font-heading font-bold text-neutral-900">{order.tracking.driver}</p>
                          <p className="text-xs text-gray-500">Kurir {shippingProviders[order.shipping]}</p>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/${order.tracking.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-heading font-semibold px-4 py-2 rounded-full transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Hubungi
                      </a>
                    </div>
                  </div>
                )}

                {/* Delivery Estimate */}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Estimasi tiba:</span>
                  <span className="font-heading font-semibold text-primary-700">
                    {order.status === 'delivered' ? 'Sudah diterima' : `${order.estimatedDelivery}`}
                  </span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-white rounded-3xl p-6 shadow-xl">
                <h2 className="font-heading font-bold text-lg text-neutral-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-500" />
                  Data Pemesan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <User className="w-4 h-4 text-primary-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Nama</p>
                      <p className="font-heading font-semibold text-neutral-900">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <Phone className="w-4 h-4 text-primary-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">No. HP</p>
                      <p className="font-heading font-semibold text-neutral-900">{order.customerPhone}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <MapPin className="w-4 h-4 text-primary-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-400">Alamat Pengiriman</p>
                      <p className="font-heading font-semibold text-neutral-900">{order.customerAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-3xl p-6 shadow-xl">
                <h2 className="font-heading font-bold text-lg text-neutral-900 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-500" />
                  Riwayat Pengiriman
                </h2>
                
                <div className="space-y-0">
                  {order.timeline.map((step, index) => {
                    const config = statusConfig[step.status]
                    const Icon = config.icon
                    const isActive = index === activeStep
                    const isCompleted = step.completed

                    return (
                      <div key={step.status} className="flex gap-4 relative">
                        {index < order.timeline.length - 1 && (
                          <div className={`absolute left-[22px] top-10 bottom-0 w-0.5 ${
                            isCompleted ? 'bg-primary-500' : 'bg-gray-200'
                          }`} />
                        )}
                        
                        <div className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-primary-500 shadow-lg shadow-primary-500/30' 
                            : isActive
                            ? 'bg-white border-2 border-primary-500 shadow-lg shadow-primary-500/20'
                            : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            isCompleted ? 'text-white' : isActive ? 'text-primary-500' : 'text-gray-400'
                          }`} />
                        </div>

                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-heading font-bold text-base ${
                              isCompleted || isActive ? 'text-neutral-900' : 'text-gray-400'
                            }`}>
                              {config.label}
                            </h3>
                            {isActive && (
                              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-heading font-semibold">
                                Saat Ini
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{step.date}</p>
                          {step.location !== '-' && (
                            <p className="text-sm text-gray-500 mt-1">{step.location}</p>
                          )}
                          <p className={`text-xs mt-1 ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                            {config.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-3xl p-6 shadow-xl">
                <h2 className="font-heading font-bold text-lg text-neutral-900 mb-4">
                  Detail Pesanan
                </h2>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Package className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="font-heading font-semibold text-gray-600">Total</span>
                    <span className="font-heading font-bold text-xl text-primary-700">
                      Rp {order.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/katalog"
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-700 text-white font-heading font-semibold py-3 rounded-full transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Kembali ke Beranda
                </Link>
                <a
                  href={getDirectWALink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-primary-500 text-primary-700 font-heading font-semibold py-3 rounded-full hover:bg-primary-50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Pesan Lagi
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Empty State */}
        {!loading && !order && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-primary-300" />
            </div>
            <p className="text-gray-500 font-body">
              Masukkan nomor pesanan kamu untuk melihat status pengiriman
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
