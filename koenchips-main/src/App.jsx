import { Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import InstallBanner from './components/InstallBanner'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Checkout from './pages/Checkout'
import OfflinePage from './pages/OfflinePage'
import OrderTracking from './components/OrderTracking'

export default function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!isOnline) return <OfflinePage />

  return (
    <div className="min-h-screen flex flex-col batik-pattern">
      <Navbar />
      <CartDrawer />
      <InstallBanner />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/katalog" element={<Shop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/lacak-pesanan" element={<OrderTracking />} />
          <Route path="/lacak-pesanan/:orderId" element={<OrderTracking />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
