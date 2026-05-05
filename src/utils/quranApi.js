// Quran API utils - alquran.cloud (public, no key needed)
const API_BASE = 'https://api.alquran.cloud/v1';

export const fetchSurah = async (surahNumber) => {
  try {
    const res = await fetch(`${API_BASE}/surah/${surahNumber}/id.indonesian`);
    return await res.json();
  } catch (error) {
    console.error('Quran API error:', error);
    return null;
  }
};

export const searchAyat = async (query) => {
  try {
    const res = await fetch(`${API_BASE}/search/${query}/id.indonesian`);
    return await res.json();
  } catch (error) {
    console.error('Search error:', error);
    return { data: { matches: [] } };
  }
};

export const getTafsir = async (surah, ayah) => {
  try {
    const res = await fetch(`${API_BASE}/tafsir/2/id/${surah}/${ayah}`);
    return await res.json();
  } catch (error) {
    return null;
  }
};

export const getAudio = (surah, ayah, reciter = 'alafasy') => 
  `https://cdn.alquran.cloud/media/ayah/${reciter}/${surah}_${ayah}.mp3`;

export const fetchRandomAyat = async () => {
  const surah = Math.floor(Math.random() * 114) + 1;
  const ayah = Math.floor(Math.random() * 20) + 1;
  return await fetchSurah(surah);
};

// Cache helper
let ayahCache = new Map();

export const getAyatCached = async (surah, ayah) => {
  const key = `${surah}-${ayah}`;
  if (ayahCache.has(key)) return ayahCache.get(key);
  
  const data = await fetch(`${API_BASE}/ayah/${surah}:${ayah}/id.indonesian`);
  const json = await data.json();
  ayahCache.set(key, json);
  return json;
};

export default { fetchSurah, searchAyat, getTafsir, getAudio, fetchRandomAyat, getAyatCached };

