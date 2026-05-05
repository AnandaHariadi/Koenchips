import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Play, Pause, Bookmark, Search, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchSurah, searchAyat, getAudio } from '../utils/quranApi';

export default function Tilawah() {
  const [currentSurah, setCurrentSurah] = useState(null);
  const [currentAyah, setCurrentAyah] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [audio, setAudio] = useState(null);
  const { quran, dispatch } = useApp();

  useEffect(() => {
    fetchSurah(94).then((data) => {
      setCurrentSurah(data);
    });
    if (audio) {
      audio.onended = () => setIsPlaying(false);
    }
  }, []);

  const playAyah = (ayahIndex) => {
    const ayah = currentSurah.data.ayahs[ayahIndex];
    const audioUrl = getAudio(currentSurah.data.number, ayah.numberInSurah);
    
    if (audio) audio.pause();
    
    const newAudio = new Audio(audioUrl);
    newAudio.play();
    setIsPlaying(true);
    setCurrentAyah(ayahIndex);
    setAudio(newAudio);
    
    dispatch.setCurrentAyat(ayah);
  };

  const handleSearch = () => {
    searchAyat(searchQuery).then((data) => {
      setSearchResults(data.data.matches || []);
    });
  };

  const addBookmark = () => {
    const ayah = currentSurah.data.ayahs[currentAyah];
    dispatch.addBookmark(ayah);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-arabic font-bold text-center mb-12 bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent drop-shadow-2xl"
        >
          تلاوة القرآن
        </motion.h1>

        {/* Search */}
        <motion.div 
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-12 border border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex gap-4 items-center">
            <Search className="w-8 h-8 text-emerald-300 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ayat berdasarkan kata kunci (sabr, syukur, tawakkal...)"
              className="flex-1 bg-white/20 border border-white/30 rounded-2xl px-6 py-4 text-xl placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-emerald-400/30 focus:border-emerald-300 text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <motion.button
              onClick={handleSearch}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-10 py-4 rounded-2xl shadow-xl hover:shadow-emerald-500/40 transition-all whitespace-nowrap"
              whileHover={{ scale: 1.02 }}
            >
              Cari Ayat
            </motion.button>
          </div>
        </motion.div>

        {searchResults.length > 0 ? (
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {searchResults.slice(0, 9).map((match) => (
              <motion.div
                key={match.id}
                className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30 hover:bg-white/30 transition-all cursor-pointer group hover:scale-105 shadow-xl hover:shadow-2xl"
                whileHover={{ y: -8 }}
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  fetchSurah(match.surah.number).then(setCurrentSurah);
                  setTimeout(() => setCurrentAyah(match.verse_key.split(':')[1] - 1), 500);
                }}
              >
                <div className="arabic text-3xl font-bold mb-4 text-right leading-relaxed h-24 flex items-center">
                  {match.text}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-emerald-300">{match.surah.name}</span>
                  <span className="text-sm opacity-75">{match.verse_key}</span>
                </div>
                <div className="text-lg leading-relaxed text-emerald-100 line-clamp-2 group-hover:line-clamp-none">
                  {match.translation}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <>
            {/* Surah Navigation */}
            {currentSurah && (
              <motion.div 
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 mb-12 border border-white/20 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.button
                  className="p-4 bg-white/20 hover:bg-white/30 rounded-2xl transition-all"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setCurrentSurah(null)}
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </motion.button>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-1">{currentSurah.data.name}</h3>
                  <p className="text-emerald-300 opacity-90">({currentSurah.data.englishName})</p>
                  <p className="text-sm opacity-75 mt-1">{currentSurah.data.numberOfAyahs} ayat</p>
                </div>
                <motion.button className="p-4 bg-white/20 hover:bg-white/30 rounded-2xl transition-all" whileHover={{ scale: 1.1 }}>
                  <ChevronRight className="w-8 h-8 text-white" />
                </motion.button>
              </motion.div>
            )}

            {/* Ayah Player */}
            <motion.div 
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {currentSurah?.data.ayahs.slice(currentAyah, currentAyah + 5).map((ayah, index) => (
                <motion.div
                  key={ayah.number}
                  className={`bg-white/20 backdrop-blur-xl rounded-3xl p-8 mb-6 border border-white/30 cursor-pointer relative group hover:bg-white/30 transition-all shadow-xl hover:shadow-2xl ${
                    currentAyah === index ? 'ring-4 ring-emerald-400/50 scale-105' : ''
                  }`}
                  whileHover={{ y: -4 }}
                  onClick={() => playAyah(index)}
                >
                  {/* Ayah Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg ring-4 ring-white">
                    {ayah.numberInSurah}
                  </div>

                  {/* Arabic */}
                  <div className="arabic text-4xl font-bold mb-6 text-right leading-relaxed py-6 bg-white/30 rounded-2xl group-hover:scale-[1.02] transition-transform">
                    {ayah.text}
                  </div>

                  {/* Translation */}
                  <p className="text-xl leading-relaxed mb-6 text-emerald-100 italic font-medium">
                    "{ayah.translation}"
                  </p>

                  {/* Controls */}
                  <div className="flex items-center gap-4 justify-between">
                    <div className="flex gap-2 opacity-75 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        className="p-3 bg-white/30 hover:bg-white/50 rounded-2xl transition-all flex-shrink-0"
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addBookmark();
                        }}
                      >
                        <Bookmark className="w-6 h-6" />
                      </motion.button>
                      <button className="p-3 bg-white/30 hover:bg-white/50 rounded-2xl transition-all flex-shrink-0">
                        <Volume2 className={`w-6 h-6 ${isPlaying ? 'animate-pulse' : ''}`} />
                      </button>
                    </div>
                    <button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-emerald-500/40 transition-all whitespace-nowrap">
                      {isPlaying ? 'Pause' : 'Play'} Ayat
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

