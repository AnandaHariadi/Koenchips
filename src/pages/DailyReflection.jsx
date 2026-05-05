import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, Heart, Share2 } from 'lucide-react';
import { useMood } from '../context/MoodContext';
import { useApp } from '../context/AppContext';
import { getRandomAyat } from '../data/quran';
import { fetchRandomAyat, getAudio } from '../utils/quranApi';

export default function DailyReflection() {
  const [dailyAyat, setDailyAyat] = useState(getRandomAyat());
  const [tafsir, setTafsir] = useState('');
  const [journalPrompt, setJournalPrompt] = useState('');
  const [note, setNote] = useState('');
  const { todayMood } = useMood();
  const { setLoading, dispatch } = useApp();

  useEffect(() => {
    setLoading(true);
    fetchRandomAyat().then((data) => {
      if (data?.data) {
        const ayat = data.data.ayahs[0];
        setDailyAyat(ayat);
        setJournalPrompt(`Bagaimana ayat ini berbicara kepada mood-mu hari ini (${todayMood || 'hari ini'})?`);
        setLoading(false);
      }
    });
  }, []);

  const saveReflection = () => {
    dispatch.addJournalEntry({
      date: new Date().toISOString().split('T')[0],
      ayatId: dailyAyat.numberInSurah,
      note,
      mood: todayMood,
    });
    setNote('');
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-br from-neutral-50 to-primary-50">
      <div className="max-w-3xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-heading font-bold text-center bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent mb-4"
        >
          Daily Reflection
        </motion.h1>
        <motion.p 
          className="text-xl text-neutral-600 text-center mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Ayat harian + refleksi untuk resilience spiritual
        </motion.p>

        {/* Ayat Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-12 border border-primary-200/50 quran-card"
        >
          <div className="flex items-start gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <BookOpen className="w-8 h-8 text-neutral-900" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Ayat Harian</h2>
              <p className="text-primary-700 font-semibold">QS. {dailyAyat?.surah?.name} : {dailyAyat?.numberInSurah}</p>
            </div>
          </div>
          <div className="arabic text-4xl font-bold mb-8 text-right leading-relaxed py-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl">
            {dailyAyat?.text}
          </div>
          <p className="text-xl leading-relaxed italic mb-8 text-neutral-700 max-w-2xl">
            "{dailyAyat?.translation}"
          </p>
          <div className="flex gap-4 items-center justify-center">
            <audio controls className="w-full max-w-md rounded-2xl shadow-xl">
              <source src={getAudio(dailyAyat?.surah?.number, dailyAyat?.numberInSurah)} type="audio/mpeg" />
            </audio>
            <button className="p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl shadow-lg transition-all hover:shadow-primary-500/40">
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </motion.div>

        {/* Journal Prompt */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-8 quran-card"
        >
          <h3 className="text-2xl font-bold text-neutral-900 mb-4 font-heading">Refleksi Pribadi</h3>
          <p className="text-lg text-neutral-600 italic mb-6 bg-primary-50 p-4 rounded-2xl">
            {journalPrompt}
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tuliskan refleksi-mu..."
            className="w-full p-6 border-2 border-neutral-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 resize-vertical min-h-[120px] text-lg"
            rows="4"
          />
          <motion.button
            onClick={saveReflection}
            className="w-full mt-6 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-primary-500/40 transition-all"
            whileHover={{ scale: 1.02 }}
          >
            Simpan Refleksi + Badge Syukur
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

