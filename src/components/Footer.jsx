import { Link } from 'react-router-dom'
import { Mosque, Book, HeartPulse, Award, Volume2, Users, Mail, MapPin, Phone, Moon, Shield } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-t from-primary-950 to-primary-900 text-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="kufi-pattern h-full w-full" />
        </div>
        
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 xl:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-500/40">
                <Mosque className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-2xl bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent tracking-tight">
                  JAGUAR
                </h2>
                <p className="arabic text-lg font-semibold text-primary-200 mt-1">
                  القرآن الرقمي التفاعلي
                </p>
              </div>
            </div>
            <p className="text-primary-200 leading-relaxed mb-8 max-w-sm">
              Qur'an Digital Interaktif dengan Mood Tracker dan Deteksi Wajah. Solusi Resilience Mental Spiritual untuk Gen Z Indonesia.
            </p>
            <div className="flex items-center gap-4">
              <a href="#contact" className="w-12 h-12 bg-primary-700/50 hover:bg-primary-600 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-primary-500/30">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#tilawah" className="w-12 h-12 bg-accent-500/20 hover:bg-accent-500 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-accent-500/30">
                <Volume2 className="w-5 h-5 text-accent-400" />
              </a>
              <button className="w-12 h-12 bg-gradient-to-br from-accent-500/20 to-accent-400/30 hover:from-accent-500 hover:to-accent-600 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg">
                <Shield className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Dashboard & Features */}
          <div>
            <h3 className="font-heading font-bold text-lg text-primary-100 mb-6 flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Dashboard
            </h3>
            <ul className="space-y-3">
              <li><Link to="/dashboard" className="text-primary-200 hover:text-white hover:translate-x-2 transition-all duration-200 flex items-center gap-2 text-sm">Dashboard Harian</Link></li>
              <li><Link to="/mood" className="text-primary-200 hover:text-white hover:translate-x-2 transition-all duration-200 flex items-center gap-2 text-sm"><HeartPulse className="w-4 h-4" /> Mood Tracker</Link></li>
              <li><Link to="/journal" className="text-primary-200 hover:text-white hover:translate-x-2 transition-all duration-200 flex items-center gap-2 text-sm"><Moon className="w-4 h-4" /> Resilience Journal</Link></li>
            </ul>
          </div>

          {/* Spiritual Features */}
          <div>
            <h3 className="font-heading font-bold text-lg text-primary-100 mb-6 flex items-center gap-2">
              <Book className="w-5 h-5" />
              Fitur Spiritual
            </h3>
            <ul className="space-y-3">
              <li><Link to="/daily" className="text-primary-200 hover:text-white hover:translate-x-2 transition-all duration-200 flex items-center gap-2 text-sm">Daily Reflection</Link></li>
              <li><Link to="/mindful" className="text-primary-200 hover:text-white hover:translate-x-2 transition-all duration-200 flex items-center gap-2 text-sm"><Brain className="w-4 h-4" /> Mindfulness Mode</Link></li>
              <li><Link to="/tilawah" className="text-primary-200 hover:text-white hover:translate-x-2 transition-all duration-200 flex items-center gap-2 text-sm"><Volume2 className="w-4 h-4" /> Tilawah Audio</Link></li>
            </ul>
          </div>

          {/* Gamification & Community */}
          <div>
            <h3 className="font-heading font-bold text-lg text-primary-100 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent-400" />
              Engagement
            </h3>
            <ul className="space-y-3">
              <li><Link to="/gamify" className="text-primary-200 hover:text-accent-400 hover:translate-x-2 transition-all duration-200 flex items-center gap-2 text-sm">Gamifikasi Qur'ani</Link></li>
              <li><Link to="/community" className="text-primary-200 hover:text-white hover:translate-x-2 transition-all duration-200 flex items-center gap-2 text-sm"><Users className="w-4 h-4" /> Community</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-heading font-bold text-lg text-primary-100 mb-6">Bantuan & Kontak</h3>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all">
                <MapPin className="w-5 h-5 text-primary-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-primary-100 text-sm">Indonesia</p>
                  <p className="text-primary-200 text-sm">Digital untuk Dunia</p>
                </div>
              </li>
              <li className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all cursor-pointer">
                <Phone className="w-5 h-5 text-primary-300 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-primary-100">Support Ayat</p>
                  <p className="text-primary-200 text-sm">alquran.cloud</p>
                </div>
              </li>
            </ul>
            <div className="bg-gradient-to-r from-primary-500/20 to-accent-500/20 backdrop-blur-sm p-6 rounded-3xl border border-primary-500/20">
              <h4 className="font-heading font-bold text-primary-100 mb-3 text-lg flex items-center gap-2">
                <Shield className="w-6 h-6 text-accent-400" />
                Keamanan Data
              </h4>
              <p className="text-primary-200 text-sm leading-relaxed">
                Mood dan jurnal disimpan lokal di perangkat. Tidak ada data dikirim ke server.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-12 border-t border-primary-800/50 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left text-xs">
          <p className="text-primary-300 font-medium">
            &copy; {year} JAGUAR. Dibuat dengan <HeartPulse className="inline w-3 h-3 text-accent-400 mx-1" /> untuk umat.
          </p>
          <div className="flex flex-wrap gap-4 text-primary-400">
            <Link to="/privacy" className="hover:text-white transition-colors">Privasi</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Syarat</Link>
            <span>|</span>
            <a href="https://alquran.cloud" target="_blank" rel="noopener" className="hover:text-accent-300 transition-colors">alquran.cloud</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

