import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Camera, Heart, Frown, Smile, Zap, MoodHappy, MoodSad, MoodNeutral, Send, Face } from 'lucide-react'
import { useMood } from '../context/MoodContext'
import { sampleAyat, moodAyatMap } from '../data/ayat'

// MediaPipe Face Detection
let faceLandmarker = null
let lastVideoTime = 0
let rafId = null

export default function MoodTracker() {
  const [currentMood, setCurrentMood] = useState('neutral')
  const [expression, setExpression] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [note, setNote] = useState('')
  const [suggestedAyat, setSuggestedAyat] = useState(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const { setMood, todayMood } = useMood()

  // Initialize MediaPipe
  useEffect(() => {
    import('@mediapipe/tasks-vision').then(({ FaceLandmarker, FilesetResolver }) => {
      const createFaceLandmarker = async () => {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        )
        faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numFaces: 1
        })
        setCameraReady(true)
      }
      createFaceLandmarker()
    })

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const predictWebcam = useCallback(() => {
    if (!faceLandmarker || !videoRef.current || Date.now() - lastVideoTime < 100) return

    lastVideoTime = Date.now()
    const results = faceLandmarker.detectForVideo(videoRef.current, performance.now())

    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
      // Simple expression detection from landmarks (eyes, mouth)
      const landmarks = results.faceLandmarks[0]
      const leftEye = landmarks[33][1] // Left eye center Y
      const rightEye = landmarks[362][1] // Right eye center Y
      const mouthLeft = landmarks[61][1] // Mouth left Y
      const mouthRight = landmarks[291][1] // Mouth right Y
      const eyeDist = Math.abs(leftEye - rightEye)
      const mouthWidth = Math.abs(landmarks[61][0] - landmarks[291][0])
      const mouthHeight = Math.abs(mouthLeft - mouthRight)

      // Detect smile (wide mouth, raised mouth corners)
      if (mouthWidth > 0.08 && mouthHeight < 0.04) {
        setExpression('happy')
        setCurrentMood('happy')
      } 
      // Sad (droopy mouth)
      else if (mouthHeight > 0.06 && eyeDist < 0.02) {
        setExpression('sad')
        setCurrentMood('sad')
      } 
      // Neutral/angry (narrow mouth)
      else {
        setExpression('neutral')
        setCurrentMood('neutral')
      }
    }

    rafId = requestAnimationFrame(predictWebcam)
  }, [])

  const startCamera = async () => {
    setShowCamera(true)
    setIsDetecting(true)
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { width: 640, height: 480, facingMode: 'user' } 
    })
    if (videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play()
        predictWebcam()
      }
    }
  }

  const stopCamera = () => {
    setShowCamera(false)
    setIsDetecting(false)
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
    }
    if (rafId) cancelAnimationFrame(rafId)
  }

  const handleSaveMood = () => {
    const ayatId = moodAyatMap[currentMood]?.[Math.floor(Math.random() * moodAyatMap[currentMood]?.length || 1)]
    const suggested = ayatId ? sampleAyat.find(a => a.id === ayatId) : null

    setMood({
      mood: currentMood,
      expression,
      note,
      ayat: suggested
    })

    setSuggestedAyat(suggested)
    setNote('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-3xl shadow-2xl mb-8 quran-card glow-primary">
            <Face className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-heading font-bold">Mood Tracker</h1>
              <p className="text-primary-100 font-medium">Catat & Deteksi Otomatis</p>
            </div>
          </div>
          {todayMood && (
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-6 border border-primary-200"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <p className="text-sm text-neutral-500 uppercase tracking-wider">Hari ini</p>
              <p className="text-4xl font-bold capitalize text-primary-700">{todayMood}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Detection Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Manual Mood Selection */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 border border-primary-200 quran-card"
          >
            <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center font-heading">Pilih Mood</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['happy', 'sad', 'neutral', 'anxious', 'calm', 'motivated'].map((m) => (
                <motion.button
                  key={m}
                  onClick={() => setCurrentMood(m)}
                  className={`p-6 rounded-2xl font-bold transition-all group hover:scale-105 hover:shadow-2xl border-4 ${
                    currentMood === m 
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/40 border-emerald-400' 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 text-neutral-700 border-gray-200 hover:border-primary-300 hover:shadow-primary-200'
                  }`}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-16 h-16 rounded-2xl mx-auto mb-3 shadow-lg flex items-center justify-center text-xl font-black ${currentMood === m ? 'bg-white/20 backdrop-blur-sm' : ''}`}>
                    {m === 'happy' && '😊'}
                    {m === 'sad' && '😢'}
                    {m === 'neutral' && '😐'}
                    {m === 'anxious' && '😰'}
                    {m === 'calm' && '😌'}
                    {m === 'motivated' && '💪'}
                  </div>
                  <span className="capitalize">{m}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Camera Detection */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 border border-primary-200 quran-card relative overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-6">
              <Camera className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-neutral-900 font-heading">Deteksi Wajah</h2>
            </div>
            
            {showCamera ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover rounded-2xl shadow-inner"
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                  <div className={`p-4 rounded-2xl text-2xl font-black shadow-2xl glow-${expression === 'happy' ? 'primary' : expression === 'sad' ? 'accent' : ''}`}>
                    {expression === 'happy' && '😊'}
                    {expression === 'sad' && '😢'}
                    {expression === 'neutral' && '😐'}
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <motion.button
                    onClick={stopCamera}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    Stop Kamera
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center h-64 justify-center bg-gradient-to-br from-primary-500/5 to-primary-500/10 rounded-2xl border-2 border-dashed border-primary-300 border-dashed-dotted group hover:border-primary-400 transition-all">
                <Camera className={`w-20 h-20 text-primary-400 group-hover:text-primary-500 group-hover:scale-110 transition-all mb-4 ${cameraReady ? 'animate-bounce' : ''}`} />
                <p className="text-lg font-semibold text-neutral-700 mb-2 text-center">Klik untuk deteksi otomatis</p>
                <p className="text-sm text-neutral-500 text-center max-w-sm mx-auto">Gunakan kamera untuk analisis ekspresi wajah real-time</p>
                <motion.button
                  onClick={startCamera}
                  disabled={!cameraReady || isDetecting}
                  className="mt-6 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-primary-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {cameraReady ? 'Mulai Deteksi' : 'Loading...'}
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Note & Save */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border border-primary-200 quran-card"
        >
          <label className="block text-lg font-bold text-neutral-900 mb-4 font-heading">Catatan Opsional</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Apa yang kamu rasakan hari ini? Ayat favorit?..."
            className="w-full p-6 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 resize-vertical min-h-[120px] text-lg leading-relaxed font-medium"
            rows="3"
          />
          <motion.button
            onClick={handleSaveMood}
            className="w-full mt-8 bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-heading font-bold py-5 px-8 rounded-3xl text-xl shadow-2xl hover:shadow-primary-500/50 transition-all hover:-translate-y-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Send className="w-6 h-6 inline mr-2" />
            Simpan Mood + Dapatkan Ayat Relevan
          </motion.button>
        </motion.div>

        {/* Suggested Ayat */}
        {suggestedAyat && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 bg-gradient-to-br from-emerald-500/95 to-emerald-600/95 text-white rounded-3xl p-10 shadow-2xl border border-emerald-400/50"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 font-arabic">Ayat yang Relevan</h2>
              <p className="text-emerald-100 text-lg font-medium">Untuk mood {currentMood}</p>
            </div>
            <div className="arabic text-4xl font-bold mb-8 text-center leading-relaxed py-8 bg-white/20 backdrop-blur-sm rounded-3xl glow-primary">
              {suggestedAyat.arabic}
            </div>
            <p className="text-xl leading-relaxed mb-6 text-emerald-50 font-medium italic">
              "{suggestedAyat.translation}"
            </p>
            <div className="flex gap-4 justify-center">
              <audio controls className="rounded-2xl shadow-2xl w-full max-w-md">
                <source src={suggestedAyat.audio_url} type="audio/mpeg" />
              </audio>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

