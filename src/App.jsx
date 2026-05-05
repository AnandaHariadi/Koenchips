import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import InstallBanner from './components/InstallBanner'
import Dashboard from './pages/Dashboard'
import MoodTracker from './pages/MoodTracker'
import { MoodProvider } from './context/MoodContext'\nimport { AppProvider } from './context/AppContext'\n// New page imports\nimport DailyReflection from './pages/DailyReflection'\nimport Mindfulness from './pages/Mindfulness'\nimport Journal from './pages/Journal'\nimport Gamification from './pages/Gamification'\nimport Community from './pages/Community'\nimport Tilawah from './pages/Tilawah'

// import OrderProvider from './context/OrderContext'
// New JAGUAR imports (stubs to be created)
import SplashScreen from './components/SplashScreen'
// import Dashboard from './pages/Dashboard'
// import MoodTracker from './pages/MoodTracker'
// import DailyReflection from './pages/DailyReflection'
// import Mindfulness from './pages/Mindfulness'
// import ResilienceJournal from './pages/ResilienceJournal'
// import Gamification from './pages/Gamification'
// import Community from './pages/Community'
// import Tilawah from './pages/Tilawah'

export default function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Splash auto-redirect after 3s
    const timer = setTimeout(() => setShowSplash(false), 3000)
    return () => clearTimeout(timer)
  }, [])

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

  if (!isOnline) {
    // TODO: Islamic offline page
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-600 text-white text-center p-8">
      <div>
        <h1 className="text-4xl font-arabic font-bold mb-4">القرآن</h1>
        <p>Periksa koneksi internet untuk mengakses ayat dan fitur.</p>
      </div>
    </div>
  }

  return (
    <AppProvider>
      <MoodProvider>
        <div className="min-h-screen flex flex-col arabesque-pattern">
          <Navbar />
          <InstallBanner />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={showSplash ? <SplashScreen /> : <Navigate to="/dashboard" replace />} />
              <Route path="/splash" element={<SplashScreen />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/mood" element={<MoodTracker />} />
              <Route path="/daily" element={<DailyReflection />} />
              <Route path="/mindful" element={<Mindfulness />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/gamify" element={<Gamification />} />
              <Route path="/community" element={<Community />} />
              <Route path="/tilawah" element={<Tilawah />} />
              <Route path="/katalog" element={<Navigate to="/daily" replace />} />
              <Route path="/checkout" element={<Navigate to="/journal" replace />} />
              <Route path="/lacak-pesanan/*" element={<Navigate to="/journal" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </MoodProvider>
    </AppProvider>
  )

}

