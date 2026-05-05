import { sampleAyat, moodAyatMap, badges } from './ayat.js';

// Full Quran structure (initial cache + API fetch)
// Production: fetch from alquran.cloud/v1

export const quranData = {
  surahs: [
    { number: 94, name: 'Al-Insyirah', englishName: 'The Relief', revelationType: 'Meccan', numberOfAyahs: 8 },
    { number: 93, name: 'Ad-Dhuha', englishName: 'The Morning Brightness', revelationType: 'Meccan', numberOfAyahs: 11 },
    { number: 14, name: 'Ibrahim', englishName: 'Abraham', revelationType: 'Meccan', numberOfAyahs: 52 },
    { number: 2, name: 'Al-Baqarah', englishName: 'The Cow', revelationType: 'Medinan', numberOfAyahs: 286 },
    // Add all 114 surahs or fetch dynamically
  ],
  categories: {
    sabr: [2, 94],
    syukur: [14],
    tawakkal: [2],
    resilience: [93, 94],
  },
  tafsirSources: ['indonesian', 'english_simple', 'tafsir_jalalayn'],
};

// Extended mood ayat mapping
export const extendedMoodAyatMap = {
  ...moodAyatMap,
  stressed: [4, 1],
  overwhelmed: [4],
  grateful: [3],
  hopeful: [2, 1],
};

// Mock full ayahs cache (expand with API)
export const fullAyahs = [
  ...sampleAyat,
  // More ayahs fetched via API
];

export const getAyatByMood = (mood) => {
  const ids = extendedMoodAyatMap[mood] || [1];
  return sampleAyat.filter(ayat => ids.includes(ayat.id));
};

export const getRandomAyat = (category = 'daily') => {
  return sampleAyat[Math.floor(Math.random() * sampleAyat.length)];
};

export default { quranData, fullAyahs, getAyatByMood, getRandomAyat };

