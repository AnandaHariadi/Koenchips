import { createContext, useContext, useReducer, useEffect, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'koenchips_cart'

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.product.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { product: action.product, qty: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) }
    case 'INCREASE_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, qty: i.qty + 1 } : i
        ),
      }
    case 'DECREASE_QTY': {
      const item = state.items.find((i) => i.product.id === action.productId)
      if (!item) return state
      if (item.qty <= 1) {
        return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, qty: i.qty - 1 } : i
        ),
      }
    }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'LOAD_CART':
      return { ...state, items: action.items }
    default:
      return state
  }
}

const initialState = { items: [] }

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          dispatch({ type: 'LOAD_CART', items: parsed })
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items])

  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.product.price * i.qty, 0)

  const addItem = (product) => dispatch({ type: 'ADD_ITEM', product })
  const removeItem = (productId) => dispatch({ type: 'REMOVE_ITEM', productId })
  const increaseQty = (productId) => dispatch({ type: 'INCREASE_QTY', productId })
  const decreaseQty = (productId) => dispatch({ type: 'DECREASE_QTY', productId })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        increaseQty,
        decreaseQty,
        clearCart,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
