import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingCart, Menu, X, Leaf, MessageCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { getDirectWALink } from '../utils/whatsapp'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Katalog', to: '/katalog' },
  { label: 'Tentang', to: '/#tentang' },
  { label: 'Team', to: '/#team' },
  { label: 'FAQ', to: '/#faq' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { totalItems, openDrawer } = useCart()
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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
      if (path === '/' || path === '') {
        const el = document.getElementById(hash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        else navigate('/')
      } else {
        navigate(path)
        setTimeout(() => {
          const el = document.getElementById(hash)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 300)
      }
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-primary-900/5' 
          : 'bg-white/80 backdrop-blur-md'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={menuRef}>
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center group-hover:from-primary-400 group-hover:to-primary-600 transition-all duration-300 shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-primary-900 tracking-tight group-hover:text-primary-700 transition-colors">
              KOEN<span className="text-primary-500">CHIPS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.to.includes('#') ? (
                  <button
                    onClick={() => handleNavClick(link.to)}
                    className="px-4 py-2 text-sm font-body font-medium text-neutral-900 hover:text-primary-500 transition-all duration-200 rounded-lg hover:bg-primary-50 relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary-500 group-hover:w-3/4 transition-all duration-200 rounded-full" />
                  </button>
                ) : (
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `px-4 py-2 text-sm font-body font-medium transition-all duration-200 rounded-lg relative group ${
                        isActive
                          ? 'text-primary-500 bg-primary-50'
                          : 'text-neutral-900 hover:text-primary-500 hover:bg-primary-50'
                      }`
                    }
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary-500 group-hover:w-3/4 transition-all duration-200 rounded-full" />
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <motion.a
              href={getDirectWALink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-heading font-semibold px-5 py-2.5 rounded-full hover:from-primary-600 hover:to-primary-700 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle className="w-4 h-4" />
              Chat WhatsApp
            </motion.a>
            <motion.button
              onClick={openDrawer}
              aria-label={`Buka keranjang, ${totalItems} item`}
              className="relative p-2.5 hover:bg-primary-50 rounded-full transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-primary-50 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
              <ShoppingCart className="w-5 h-5 text-neutral-900 relative z-10" />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-accent-500 to-yellow-400 text-neutral-900 text-xs font-heading font-bold rounded-full flex items-center justify-center shadow-md"
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <motion.button
              onClick={openDrawer}
              aria-label={`Buka keranjang, ${totalItems} item`}
              className="relative p-2.5 hover:bg-primary-50 rounded-full transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="w-5 h-5 text-neutral-900" />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-accent-500 to-yellow-400 text-neutral-900 text-xs font-heading font-bold rounded-full flex items-center justify-center shadow-md"
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </motion.span>
              )}
            </motion.button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="p-2.5 hover:bg-primary-50 rounded-full transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-neutral-900" />
              ) : (
                <Menu className="w-5 h-5 text-neutral-900" />
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
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="lg:hidden overflow-hidden border-t border-gray-100/50"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    {link.to.includes('#') ? (
                      <button
                        onClick={() => handleNavClick(link.to)}
                        className="w-full text-left px-4 py-3 text-sm font-body font-medium text-neutral-900 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all duration-200"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <NavLink
                        to={link.to}
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-3 text-sm font-body font-medium rounded-xl transition-all duration-200 ${
                            isActive
                              ? 'text-primary-500 bg-primary-50'
                              : 'text-neutral-900 hover:text-primary-500 hover:bg-primary-50'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    )}
                  </div>
                ))}
                <div className="pt-3 px-4">
                  <a
                    href={getDirectWALink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-heading font-semibold px-4 py-3 rounded-full hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
