import { motion } from 'framer-motion'
import { WifiOff, RefreshCw } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-12 h-12 text-primary-300" />
        </div>

        <h1 className="font-heading font-bold text-3xl text-white mb-3">
          Kamu Sedang Offline
        </h1>
        <p className="text-primary-200 text-base mb-2 max-w-sm mx-auto leading-relaxed">
          Tapi tenang — katalog terakhir masih bisa dilihat.
          Sambungkan kembali ke internet untuk pengalaman lengkap.
        </p>
        <p className="text-primary-300 text-sm mb-8">
          Cart kamu tersimpan dan tidak akan hilang.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 bg-white text-primary-700 font-heading font-bold px-6 py-3 rounded-full hover:bg-primary-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
      </motion.div>
    </div>
  )
}
