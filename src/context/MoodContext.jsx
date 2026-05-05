import { createContext, useContext, useReducer, useEffect } from 'react'

const MoodContext = createContext()

const initialState = {
  moods: JSON.parse(localStorage.getItem('jaguar_moods')) || [],
  streak: parseInt(localStorage.getItem('jaguar_streak')) || 0,
  points: parseInt(localStorage.getItem('jaguar_points')) || 0,
  badges: JSON.parse(localStorage.getItem('jaguar_badges')) || [],
  todayMood: null,
  loading: false,
}

function moodReducer(state, action) {
  switch (action.type) {
    case 'SET_MOOD':
      const newMood = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        mood: action.payload.mood,
        expression: action.payload.expression || null,
        note: action.payload.note || '',
        ayatSuggested: action.payload.ayat || null,
      }
      const updatedMoods = [newMood, ...state.moods.slice(0, 30)] // Keep last 30
      const newStreak = newMood.date === new Date().toISOString().split('T')[0] && state.streak < 30 ? state.streak + 1 : 1
      const newPoints = state.points + (newMood.expression ? 50 : 20)
      
      return {
        ...state,
        moods: updatedMoods,
        streak: newStreak,
        points: newPoints,
        todayMood: newMood.mood,
      }
    case 'UPDATE_STREAK':
      return { ...state, streak: action.payload }
    case 'ADD_BADGE':
      return {
        ...state,
        badges: [...state.badges, action.payload]
      }
    case 'LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export function MoodProvider({ children }) {
  const [state, dispatch] = useReducer(moodReducer, initialState)

  useEffect(() => {
    localStorage.setItem('jaguar_moods', JSON.stringify(state.moods))
    localStorage.setItem('jaguar_streak', state.streak.toString())
    localStorage.setItem('jaguar_points', state.points.toString())
    localStorage.setItem('jaguar_badges', JSON.stringify(state.badges))
  }, [state.moods, state.streak, state.points, state.badges])

  const value = {
    ...state,
    setMood: (moodData) => dispatch({ type: 'SET_MOOD', payload: moodData }),
    updateStreak: (streak) => dispatch({ type: 'UPDATE_STREAK', payload: streak }),
    addBadge: (badge) => dispatch({ type: 'ADD_BADGE', payload: badge }),
    setLoading: (loading) => dispatch({ type: 'LOADING', payload: loading }),
  }

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  )
}

export function useMood() {
  const context = useContext(MoodContext)
  if (!context) {
    throw new Error('useMood must be used within MoodProvider')
  }
  return context
}

