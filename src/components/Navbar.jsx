import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Mosque, HeartPulse, Award, BookOpen, Brain, Users, Volume2, Moon, Gauge, Arabic } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Dashboard', to: '/dashboard', icon: Gauge },
  { label: 'Mood Tracker', to: '/mood', icon: HeartPulse },
  { label: 'Daily Ayat', to: '/daily', icon: BookOpen },
  { label: 'Mindfulness', to: '/mindful', icon: Brain },
  { label: 'Journal', to: '/journal', icon: Moon },
  { label: 'Gamify', to: '/gamify', icon: Award },
  { label: 'Tilawah', to: '/tilawah', icon: Volume2 },
  { label: 'Community', to: '/community', icon: Users },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [arabicMode, setArabicMode] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Fake progress for demo
    setProgress(Math.random() * 100)
  }, [])

  // Close menu on click outside
  useEffect(() => {
    if (!isMenuOpen) return
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  const handleNavClick = (to) => {
    setIsMenuOpen(false)
    if (to.includes('#')) {
      const [path, hash] = to.split('#')
      navigate(path || '/dashboard')
      setTimeout(() => {
        const el = document.getElementById(hash)
        el?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl shadow-primary-900/10' 
          : 'bg-white/80 backdrop-blur-md'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={menuRef}>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 group p-2 -m-2 rounded-xl hover:bg-primary-50 transition-all"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300 group-hover:scale-105"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Mosque className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <span className="font-heading font-bold text-2xl bg-gradient-to-r from-primary-700 via-neutral-900 to-primary-600 bg-clip-text text-transparent tracking-tight">
                JAGUAR
              </span>
              <span className="block text-xs font-medium text-primary-600 font-heading uppercase tracking-wider">
                القرآن الرقمي
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-2">
            {navLinks.map(({ label, to, icon: Icon }) => (
              <li key={label}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-5 py-3 text-sm font-body font-semibold transition-all duration-300 rounded-2xl relative group hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-50 hover:shadow-md ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                        : 'text-neutral-700 hover:text-primary-600'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <motion.span 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-current rounded-full"
                    initial={false}
                    animate={{ width: '80%' }}
                    transition={{ duration: 0.3 }}
                  />
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Arabic Toggle */}
            <motion.button
              className="p-2 hover:bg-primary-50 rounded-xl transition-all group"
              onClick={() => setArabicMode(!arabicMode)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Arabic className={`w-5 h-5 transition-colors ${arabicMode ? 'text-primary-600' : 'text-neutral-600'}`} />
            </motion.button>

            {/* Progress Badge */}
            <motion.div 
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg shadow-accent-500/30 hover:shadow-accent-500/50 transition-all cursor-pointer hover:scale-105">
                <Gauge className="w-5 h-5 text-neutral-900" />
              </div>
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-400 text-xs font-bold text-white rounded-full flex items-center justify-center shadow-md ring-2 ring-white"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {Math.floor(progress)}%
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <motion.button
              className="p-2 hover:bg-primary-50 rounded-xl transition-all group relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Gauge className="w-5 h-5 text-neutral-700 group-hover:text-primary-600" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-500 to-emerald-400 text-[10px] text-white rounded-full flex items-center justify-center font-bold shadow-sm">
                {Math.floor(progress)}%
              </div>
            </motion.button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-primary-50 rounded-xl transition-all"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-neutral-800" />
              ) : (
                <Menu className="w-6 h-6 text-neutral-800" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-neutral-100"
            >
              <div className="py-6 space-y-2 bg-white/50 backdrop-blur-md">
                {navLinks.map(({ label, to, icon: Icon }) => (
                  <NavLink
                    key={label}
                    to={to}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 w-full px-6 py-4 text-base font-body font-semibold rounded-2xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                          : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-600 hover:shadow-md'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {label}
                  </NavLink>
                ))}
                <div className="px-6 pt-4 border-t border-neutral-100">
                  <motion.button
                    className="flex items-center gap-3 w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-neutral-900 font-heading font-bold px-6 py-4 rounded-2xl transition-all shadow-lg hover:shadow-accent-500/30"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setArabicMode(!arabicMode)}
                  >
                    <Arabic className="w-5 h-5" />
                    {arabicMode ? 'English Mode' : 'وضع العربية'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

