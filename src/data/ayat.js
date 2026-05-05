// Sample Quran ayat with mood mapping for JAGUAR
// Source: alquran.cloud API - fetch live in production

export const sampleAyat = [
  {
    id: 1,
    surah: 'Al-Insyirah',
    ayah: '5-6',
    arabic: 'فَإِذَا فَرَغْتَ فَانْصَبْ • وَإِلَىٰ رَبِّكَ فَارْغَبْ',
    latin: 'Fa iza faraghta fansab, wa ila rabbika fargab',
    translation: 'Maka apabila engkau telah selesai (dari urusan), tetaplah bekerja keras (untuk urusan yang lain), dan kepada Tuhanmu engkau berharap.',
    tafsir_short: 'Motivasi untuk terus berusaha dan berdoa setelah kesulitan.',
    mood_tags: ['motivated', 'hopeful', 'sabr'],
    audio_url: 'https://cdn.alquran.cloud/media/ayah/ar.alafasy/94_5.mp3',
    category: 'daily',
    rating: 4.9,
  },
  {
    id: 2,
    surah: 'Ad-Dhuha',
    ayah: '3-5',
    arabic: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ • وَلَلْآخِرَةُ خَيْرٌ لَكَ مِنَ الْأُولَىٰ • وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
    latin: 'Ma wadda\'aka rabbuka wa ma qala, wa lal akhiratu khairul laka minal ula, wa lasawfa yu\'tika rabbuka fatardha',
    translation: 'Tuhanmu tidak meninggalkanmu dan tidak (pula) membencimu, dan sesungguhnya akhir itu lebih baik bagimu daripada yang permulaan. Dan nanti Tuhanmu pasti memberikan karunia-Nya kepadamu, maka engkau menjadi puas hati.',
    tafsir_short: 'Janji Allah bahwa setelah kesulitan ada kemudahan.',
    mood_tags: ['sad', 'anxious', 'hopeful'],
    audio_url: 'https://cdn.alquran.cloud/media/ayah/ar.alafasy/93_3.mp3',
    category: 'sabr',
    rating: 4.9,
  },
  {
    id: 3,
    surah: 'Ibrahim',
    ayah: '7',
    arabic: 'لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِنْ كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ',
    latin: 'La\'in syakartum la azidannakum, wa la\'in kafartum inna \'azabi lasyadid',
    translation: 'Jika kamu bersyukur, pasti Kami akan menambah (nikmat) kepadamu, dan jika kamu mengingkari (nikmat-Ku), maka sesungguhnya azab-Ku sangat pedas.',
    tafsir_short: 'Syukur membuka pintu lebih banyak berkah.',
    mood_tags: ['happy', 'grateful', 'shukr'],
    audio_url: 'https://cdn.alquran.cloud/media/ayah/ar.alafasy/14_7.mp3',
    category: 'syukur',
    rating: 4.8,
  },
  // Add more ayat for different moods...
  {
    id: 4,
    surah: 'Al-Baqarah',
    ayah: '286',
    arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    latin: 'La yukallifullahu nafsan illa wus\'aha',
    translation: 'Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.',
    tafsir_short: 'Allah tidak membebani di luar kemampuan kita.',
    mood_tags: ['overwhelmed', 'stressed', 'tawakkal'],
    audio_url: 'https://cdn.alquran.cloud/media/ayah/ar.alafasy/2_286.mp3',
    category: 'tawakkal',
    rating: 4.9,
  },
]

export const moodAyatMap = {
  happy: [3],
  sad: [2],
  anxious: [1, 4],
  stressed: [4],
  calm: [1],
  grateful: [3],
  motivated: [1],
  overwhelmed: [4],
}

export const badges = [
  { id: 'sabr', name: 'Sabr', icon: '⏳', desc: 'Konsistensi harian', requirement: '7 hari streak' },
  { id: 'syukur', name: 'Syukur', icon: '🙏', desc: 'Mood positive 5x', requirement: 'Positive mood streak' },
  { id: 'tawakkal', name: 'Tawakkal', icon: '🛡', desc: 'Journal saat susah', requirement: 'Journal 10x sad mood' },
]

