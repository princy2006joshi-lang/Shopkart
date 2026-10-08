import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { axiosInstance } from '../axiosCalls/axios'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { customer, loading: authLoading } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [cartLoading, setCartLoading] = useState(true)
  const [cartError, setCartError] = useState('')

  const refreshCart = useCallback(async () => {
    if (!customer) {
      setCartItems([])
      setCartLoading(false)
      setCartError('')
      return
    }

    try {
      setCartLoading(true)
      setCartError('')
      const response = await axiosInstance.get('/cart')
      setCartItems(response.data.cart || [])
    } catch (error) {
      if (error.response?.status === 401) {
        setCartItems([])
        setCartError('')
        return
      }

      setCartItems([])
      setCartError('Unable to load your cart. Please try again.')
    } finally {
      setCartLoading(false)
    }
  }, [customer])

  const addToCart = useCallback(async (productId) => {
    try {
      setCartError('')
      const response = await axiosInstance.post(`/cart/${productId}`)
      setCartItems(response.data.cart || [])
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to add this product to your cart.'
      setCartError(message)
      throw error
    }
  }, [])

  const updateQuantity = useCallback(async (productId, quantity) => {
    try {
      setCartError('')
      const response = await axiosInstance.patch(`/cart/${productId}`, { quantity })
      setCartItems(response.data.cart || [])
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to update your cart.'
      setCartError(message)
      throw error
    }
  }, [])

  const removeFromCart = useCallback(async (productId) => {
    try {
      setCartError('')
      const response = await axiosInstance.delete(`/cart/${productId}`)
      setCartItems(response.data.cart || [])
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to remove this product from your cart.'
      setCartError(message)
      throw error
    }
  }, [])

  useEffect(() => {
    if (authLoading) return

    if (!customer) {
      setCartItems([])
      setCartLoading(false)
      setCartError('')
      return
    }

    refreshCart()
  }, [authLoading, customer, refreshCart])

  const cartCount = useMemo(() => cartItems.reduce((total, item) => total + Number(item.quantity || 0), 0), [cartItems])
  const subtotal = useMemo(() => cartItems.reduce((total, item) => total + Number(item.product?.price || 0) * Number(item.quantity || 0), 0), [cartItems])

  return (
    <CartContext.Provider value={{
      cartItems,
      cartLoading,
      cartError,
      cartCount,
      subtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return context
}
