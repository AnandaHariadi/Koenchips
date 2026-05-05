import { createContext, useContext, useReducer, useEffect } from 'react';
import { getRandomAyat } from '../data/quran';
import { fetchRandomAyat } from '../utils/quranApi';

const AppContext = createContext();

const initialState = {
  user: {
    name: 'Mahasiswa Qur\'ani',
    level: 1,
    rank: 47,
    totalPoints: 0,
  },
  journal: JSON.parse(localStorage.getItem('jaguar_journal')) || [],
  gamify: {
    badges: [],
    streak: 0,
    leaderboard: [], // Mock
  },
  community: {
    posts: [],
    notifications: [],
  },
  quran: {
    currentAyat: getRandomAyat(),
    bookmarks: JSON.parse(localStorage.getItem('jaguar_bookmarks')) || [],
    searchResults: [],
  },
  ui: {
    loading: false,
    theme: 'light',
    notificationsEnabled: false,
  },
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'ADD_JOURNAL':
      const newJournal = [...state.journal, action.payload];
      localStorage.setItem('jaguar_journal', JSON.stringify(newJournal));
      return { ...state, journal: newJournal };
    case 'UPDATE_GAMIFY':
      localStorage.setItem('jaguar_gamify', JSON.stringify(action.payload));
      return { ...state, gamify: action.payload };
    case 'SET_QURAN_AYAT':
      return { ...state, quran: { ...state.quran, currentAyat: action.payload } };
    case 'ADD_BOOKMARK':
      const newBookmarks = [...state.quran.bookmarks, action.payload];
      localStorage.setItem('jaguar_bookmarks', JSON.stringify(newBookmarks));
      return { ...state, quran: { ...state.quran, bookmarks: newBookmarks } };
    case 'SET_LOADING':
      return { ...state, ui: { ...state.ui, loading: action.payload } };
    case 'UPDATE_COMMUNITY':
      return { ...state, community: { ...state.community, ...action.payload } };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Load gamify from localStorage
    const gamify = JSON.parse(localStorage.getItem('jaguar_gamify') || '{}');
    if (Object.keys(gamify).length) {
      dispatch({ type: 'UPDATE_GAMIFY', payload: gamify });
    }

    // Fetch fresh ayat
    fetchRandomAyat().then(data => {
      if (data?.data) {
        dispatch({ type: 'SET_QURAN_AYAT', payload: data.data.ayahs[0] });
      }
    });
  }, []);

  const value = {
    ...state,
    dispatch,
    addJournalEntry: (entry) => dispatch({ type: 'ADD_JOURNAL', payload: entry }),
    updateGamify: (data) => dispatch({ type: 'UPDATE_GAMIFY', payload: data }),
    setCurrentAyat: (ayat) => dispatch({ type: 'SET_QURAN_AYAT', payload: ayat }),
    addBookmark: (ayat) => dispatch({ type: 'ADD_BOOKMARK', payload: ayat }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    updateCommunity: (data) => dispatch({ type: 'UPDATE_COMMUNITY', payload: data }),
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

