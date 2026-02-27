import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const OrderContext = createContext(null)

// Mock data for orders
const mockOrders = [
  {
    id: 'ORD-001',
    status: 'dalam_perjalanan',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    customer: {
      name: 'Budi Santoso',
      phone: '+62822-6558-8823',
      address: 'Jl. Sudirman No. 45, Surabaya',
      location: { lat: -7.2575, lng: 112.7521 }
    },
    items: [
      { name: 'Chocolate Bliss 70g', quantity: 2, price: 25000 },
      { name: 'Matcha Zen 70g', quantity: 1, price: 25000 }
    ],
    subtotal: 75000,
    promo: 5000,
    shipping: 8000,
    total: 78000,
    courier: {
      name: 'Ahmad Fahmi',
      phone: '+62812-3456-7890',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 4.9,
      vehicle: 'Motor',
      location: { lat: -7.2655, lng: 112.7455 }
    },
    restaurant: {
      name: 'KOENCHIPS Factory',
      location: { lat: -7.2755, lng: 112.7555 }
    },
    eta: 15,
    history: [
      { status: 'pesanan_dibuat', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { status: 'pembayaran_dikonfirmasi', timestamp: new Date(Date.now() - 3500000).toISOString() },
      { status: 'penjual_menyiapkan', timestamp: new Date(Date.now() - 3000000).toISOString() },
      { status: 'kurir_mengambil', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { status: 'dalam_perjalanan', timestamp: new Date(Date.now() - 600000).toISOString() }
    ]
  },
  {
    id: 'ORD-002',
    status: 'penjual_menyiapkan',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    customer: {
      name: 'Siti Rahayu',
      phone: '+62822-6558-8823',
      address: 'Jl. Ahmad Yani No. 88, Surabaya',
      location: { lat: -7.2450, lng: 112.7350 }
    },
    items: [
      { name: 'Bundle Quartet', quantity: 1, price: 85000 }
    ],
    subtotal: 85000,
    promo: 10000,
    shipping: 8000,
    total: 83000,
    courier: null,
    restaurant: {
      name: 'KOENCHIPS Factory',
      location: { lat: -7.2755, lng: 112.7555 }
    },
    eta: null,
    history: [
      { status: 'pesanan_dibuat', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { status: 'pembayaran_dikonfirmasi', timestamp: new Date(Date.now() - 1700000).toISOString() },
      { status: 'penjual_menyiapkan', timestamp: new Date(Date.now() - 600000).toISOString() }
    ]
  }
]

// Status labels in Indonesian
export const statusLabels = {
  pesanan_dibuat: 'Pesanan Dibuat',
  pembayaran_dikonfirmasi: 'Pembayaran Dikonfirmasi',
  seller_menyiapkan: 'Penjual Menyiapkan',
  kurir_mengambil: 'Kurir Mengambil',
  dalam_perjalanan: 'Dalam Perjalanan',
  pesanan_sampai: 'Pesanan Sampai',
  selesai: 'Selesai'
}

// Status order for display
export const statusOrder = [
  'pesanan_dibuat',
  'pembayaran_dikonfirmasi',
  'penjual_menyiapkan',
  'kurir_mengambil',
  'dalam_perjalanan',
  'pesanan_sampai',
  'selesai'
]

// Check if order can be cancelled
export const canCancelOrder = (status) => {
  return ['pesanan_dibuat', 'pembayaran_dikonfirmasi', 'penjual_menyiapkan'].includes(status)
}

export default function OrderProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [currentOrder, setCurrentOrder] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Simulate fetching orders
  useEffect(() => {
    const timer = setTimeout(() => {
      setOrders(mockOrders)
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Simulate real-time location updates
  useEffect(() => {
    if (!currentOrder || currentOrder.status !== 'dalam_perjalanan') return

    const interval = setInterval(() => {
      setCurrentOrder(prev => {
        if (!prev || !prev.courier) return prev
        
        // Simulate courier moving towards destination
        const currentLat = prev.courier.location.lat
        const currentLng = prev.courier.location.lng
        const destLat = prev.customer.location.lat
        const destLng = prev.customer.location.lng
        
        const newLat = currentLat + (destLat - currentLat) * 0.1
        const newLng = currentLng + (destLng - currentLng) * 0.1
        
        // Calculate distance and ETA
        const distance = Math.sqrt(
          Math.pow(destLat - newLat, 2) + Math.pow(destLng - newLng, 2)
        ) * 111 // rough km conversion
        
        const newEta = Math.max(1, Math.round(distance * 5))
        
        // Add notification when approaching
        if (distance < 0.5 && prev.eta > 5) {
          addNotification({
            type: 'info',
            title: 'Kurir Mendekati',
            message: 'Kurir hampir sampai di lokasi tujuan!'
          })
        }
        
        return {
          ...prev,
          courier: {
            ...prev.courier,
            location: { lat: newLat, lng: newLng }
          },
          eta: newEta
        }
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [currentOrder?.id, currentOrder?.status])

  const addNotification = useCallback((notification) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { ...notification, id }])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }, [])

  const selectOrder = useCallback((orderId) => {
    const order = orders.find(o => o.id === orderId)
    setCurrentOrder(order || null)
  }, [orders])

  const cancelOrder = useCallback((orderId) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'dibatalkan',
          history: [
            ...o.history,
            { status: 'dibatalkan', timestamp: new Date().toISOString() }
          ]
        }
      }
      return o
    }))
    
    addNotification({
      type: 'warning',
      title: 'Pesanan Dibatalkan',
      message: `Pesanan ${orderId} telah dibatalkan.`
    })
  }, [addNotification])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const value = {
    orders,
    currentOrder,
    notifications,
    isLoading,
    selectOrder,
    cancelOrder,
    clearNotifications,
    addNotification
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}
