import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { 
  ShoppingCart, Clock, CheckCircle, Package, Truck, 
  Home, Star, Phone, MapPin, Bell, X, ChevronLeft,
  ArrowRight, XCircle
} from 'lucide-react'
import { useOrder, statusLabels, statusOrder, canCancelOrder } from '../context/OrderContext'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom styled icons - more professional looking
const createCustomIcon = (emoji, bgColor, borderColor) => L.divIcon({
  html: `
    <div style="
      width: 40px;
      height: 40px;
      background: ${bgColor};
      border: 3px solid ${borderColor};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    ">
      <span style="
        transform: rotate(45deg);
        font-size: 20px;
        filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
      ">${emoji}</span>
    </div>
  `,
  className: 'custom-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
})

const restaurantIcon = createCustomIcon('🏭', '#0D9488', '#0F766E')
const customerIcon = createCustomIcon('🏠', '#6366F1', '#4F46E5')
const courierIcon = createCustomIcon('🏍️', '#F59E0B', '#D97706')

// Map center component
function MapCenter({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 14)
    }
  }, [center, map])
  return null
}

// Notification component
function NotificationToast({ notifications, onClose }) {
  if (!notifications.length) return null

  return (
    <div className="fixed top-20 right-4 z-[1000] space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in ${
            notif.type === 'info' ? 'bg-blue-500' :
            notif.type === 'warning' ? 'bg-orange-500' :
            notif.type === 'success' ? 'bg-green-500' : 'bg-gray-500'
          } text-white`}
        >
          <Bell className="w-5 h-5" />
          <div className="flex-1">
            <p className="font-semibold text-sm">{notif.title}</p>
            <p className="text-xs opacity-90">{notif.message}</p>
          </div>
          <button onClick={() => onClose(notif.id)} className="hover:bg-white/20 p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

// Status timeline component
function StatusTimeline({ history, currentStatus }) {
  const getStepIndex = (status) => statusOrder.indexOf(status)
  const currentIndex = getStepIndex(currentStatus)

  const statusIcons = {
    pesanan_dibuat: <ShoppingCart className="w-5 h-5" />,
    pembayaran_dikonfirmasi: <CheckCircle className="w-5 h-5" />,
    seller_menyiapkan: <Package className="w-5 h-5" />,
    kurir_mengambil: <Truck className="w-5 h-5" />,
    dalam_perjalanan: <Truck className="w-5 h-5" />,
    pesanan_sampai: <Home className="w-5 h-5" />,
    selesai: <CheckCircle className="w-5 h-5" />
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-heading font-semibold text-primary-900 mb-4">Status Pesanan</h3>
      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        <div className="space-y-4">
          {statusOrder.slice(0, -1).map((status, index) => {
            const isCompleted = index <= currentIndex
            const isCurrent = status === currentStatus
            const historyItem = history.find(h => h.status === status)
            
            return (
              <div key={status} className="relative flex items-start gap-4">
                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {statusIcons[status]}
                </div>
                <div className="flex-1 pt-2">
                  <p className={`font-medium ${isCompleted ? 'text-primary-900' : 'text-gray-400'}`}>
                    {statusLabels[status]}
                  </p>
                  {historyItem && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(historyItem.timestamp).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                  {isCurrent && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded-full">
                      Saat Ini
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Order summary component
function OrderSummary({ order }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-heading font-semibold text-primary-900 mb-4">Ringkasan Pesanan</h3>
      <div className="space-y-3">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.quantity}x {item.name}
            </span>
            <span className="font-medium">Rp {item.price.toLocaleString('id-ID')}</span>
          </div>
        ))}
        <div className="border-t pt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>Rp {order.subtotal.toLocaleString('id-ID')}</span>
          </div>
          {order.promo > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Promo</span>
              <span>-Rp {order.promo.toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Ongkir</span>
            <span>Rp {order.shipping.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between font-bold text-primary-900 text-base pt-2 border-t">
            <span>Total</span>
            <span>Rp {order.total.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Courier info component
function CourierInfo({ courier, eta }) {
  if (!courier) return null

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-heading font-semibold text-primary-900 mb-4">Info Kurir</h3>
      <div className="flex items-center gap-4">
        <img 
          src={courier.avatar} 
          alt={courier.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-primary-200"
        />
        <div className="flex-1">
          <p className="font-semibold text-primary-900">{courier.name}</p>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{courier.rating}</span>
            <span className="text-gray-400">•</span>
            <span>{courier.vehicle}</span>
          </div>
        </div>
        <a 
          href={`https://wa.me/${courier.phone.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>
      {eta !== null && (
        <div className="mt-4 p-3 bg-primary-50 rounded-lg flex items-center gap-3">
          <Clock className="w-5 h-5 text-primary-500" />
          <div>
            <p className="text-sm text-gray-600">Estimasi Waktu</p>
            <p className="font-semibold text-primary-900">{eta} menit</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Cancel order modal
function CancelModal({ order, onConfirm, onCancel }) {
  if (!order) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
<XCircle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-primary-900">Batalkan Pesanan?</h3>
            <p className="text-sm text-gray-500">Order #{order.id}</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-6">
          Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Tidak
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Ya, Batalkan
          </button>
        </div>
      </div>
    </div>
  )
}

// Main tracking page
export default function OrderTrackingPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { orders, currentOrder, selectOrder, cancelOrder, notifications, addNotification } = useOrder()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [mapCenter, setMapCenter] = useState(null)

  useEffect(() => {
    if (orderId) {
      selectOrder(orderId)
    } else if (orders.length > 0) {
      selectOrder(orders[0].id)
    }
  }, [orderId, orders, selectOrder])

  useEffect(() => {
    if (currentOrder) {
      if (currentOrder.status === 'dalam_perjalanan' && currentOrder.courier) {
        setMapCenter(currentOrder.courier.location)
      } else if (currentOrder.restaurant) {
        setMapCenter(currentOrder.restaurant.location)
      }
    }
  }, [currentOrder])

  const handleCancelOrder = () => {
    if (currentOrder) {
      cancelOrder(currentOrder.id)
      setShowCancelModal(false)
      navigate('/lacak-pesanan')
    }
  }

  const getRouteCoordinates = () => {
    if (!currentOrder) return []
    
    if (currentOrder.status === 'dalam_perjalanan' && currentOrder.courier) {
      return [
        [currentOrder.courier.location.lat, currentOrder.courier.location.lng],
        [currentOrder.restaurant.location.lat, currentOrder.restaurant.location.lng],
        [currentOrder.customer.location.lat, currentOrder.customer.location.lng]
      ]
    }
    
    return [
      [currentOrder.restaurant.location.lat, currentOrder.restaurant.location.lng],
      [currentOrder.customer.location.lat, currentOrder.customer.location.lng]
    ]
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="font-heading font-semibold text-primary-900 mb-2">Pesanan Tidak Ditemukan</h2>
          <p className="text-gray-500 mb-6">Silakan pilih pesanan dari daftar</p>
          
          {/* Order List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-md mx-auto">
            {orders.map(order => (
              <button
                key={order.id}
                onClick={() => navigate(`/lacak-pesanan/${order.id}`)}
                className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-500" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-primary-900">{order.id}</p>
                  <p className="text-sm text-gray-500">{statusLabels[order.status]}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
          </div>
          
          <Link to="/" className="inline-block mt-6 text-primary-500 hover:text-primary-600">
            Kembali ke Home
          </Link>
        </div>
      </div>
    )
  }

  const canCancel = canCancelOrder(currentOrder.status)
  const showMap = ['kurir_mengambil', 'dalam_perjalanan', 'pesanan_sampai'].includes(currentOrder.status)

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-4">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="font-heading font-semibold text-primary-900">Lacak Pesanan</h1>
              <p className="text-sm text-gray-500">{currentOrder.id}</p>
            </div>
            {canCancel && (
              <button 
                onClick={() => setShowCancelModal(true)}
                className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
              >
                Batalkan
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Map */}
        {showMap && (
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="h-[300px] lg:h-[400px]">
              <MapContainer 
                center={[mapCenter?.lat || -7.2655, mapCenter?.lng || 112.7455]} 
                zoom={14} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapCenter center={mapCenter} />
                
                {/* Restaurant marker */}
                <Marker position={[currentOrder.restaurant.location.lat, currentOrder.restaurant.location.lng]} icon={restaurantIcon}>
                  <Popup>
                    <div className="text-center">
                      <p className="font-semibold">🏭 {currentOrder.restaurant.name}</p>
                      <p className="text-sm text-gray-500">Lokasi Pengiriman</p>
                    </div>
                  </Popup>
                </Marker>
                
                {/* Customer marker */}
                <Marker position={[currentOrder.customer.location.lat, currentOrder.customer.location.lng]} icon={customerIcon}>
                  <Popup>
                    <div className="text-center">
                      <p className="font-semibold">🏠 {currentOrder.customer.name}</p>
                      <p className="text-sm text-gray-500">{currentOrder.customer.address}</p>
                    </div>
                  </Popup>
                </Marker>
                
                {/* Courier marker (only when in transit) */}
                {currentOrder.status === 'dalam_perjalanan' && currentOrder.courier && (
                  <Marker position={[currentOrder.courier.location.lat, currentOrder.courier.location.lng]} icon={courierIcon}>
                    <Popup>
                      <div className="text-center">
                        <p className="font-semibold">🏍️ {currentOrder.courier.name}</p>
                        <p className="text-sm text-gray-500">Kurir Anda</p>
                      </div>
                    </Popup>
                  </Marker>
                )}
                
                {/* Route line */}
                <Polyline 
                  positions={getRouteCoordinates()} 
                  color="#0D9488" 
                  weight={4} 
                  opacity={0.7}
                  dashArray="10, 10"
                />
              </MapContainer>
            </div>
          </div>
        )}

        {/* Mobile: Status Progress Bar */}
        <div className="lg:hidden">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary-900">{statusLabels[currentOrder.status]}</span>
              {currentOrder.eta && (
                <span className="text-sm text-primary-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentOrder.eta} menit
                </span>
              )}
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 transition-all duration-500"
                style={{ width: `${(statusOrder.indexOf(currentOrder.status) / (statusOrder.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Desktop: Two column layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          <StatusTimeline history={currentOrder.history} currentStatus={currentOrder.status} />
          <div className="space-y-6">
            <OrderSummary order={currentOrder} />
            <CourierInfo courier={currentOrder.courier} eta={currentOrder.eta} />
          </div>
        </div>

        {/* Mobile: Accordion sections */}
        <div className="lg:hidden space-y-4">
          <StatusTimeline history={currentOrder.history} currentStatus={currentOrder.status} />
          <OrderSummary order={currentOrder} />
          {currentOrder.courier && <CourierInfo courier={currentOrder.courier} eta={currentOrder.eta} />}
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-heading font-semibold text-primary-900 mb-3">Alamat Pengiriman</h3>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary-500 mt-0.5" />
            <div>
              <p className="font-medium text-primary-900">{currentOrder.customer.name}</p>
              <p className="text-sm text-gray-600">{currentOrder.customer.address}</p>
              <p className="text-sm text-gray-500">{currentOrder.customer.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <CancelModal 
          order={currentOrder}
          onConfirm={handleCancelOrder}
          onCancel={() => setShowCancelModal(false)}
        />
      )}

      {/* Notifications */}
      <NotificationToast 
        notifications={notifications} 
        onClose={() => {}} 
      />
    </div>
  )
}
