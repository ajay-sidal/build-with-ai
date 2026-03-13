'use client'

import * as React from 'react'
import type { Product } from '@/lib/openprovider-products'

interface CartItem extends Product {
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
  clearCart: () => void
  itemCount: number
}

const CartContext = React.createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'buildwithai_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([])

  // Load cart from localStorage on initial mount
  React.useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (storedCart) {
        setCartItems(JSON.parse(storedCart))
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage', error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
    } catch (error) {
      console.error('Failed to save cart to localStorage', error)
    }
  }, [cartItems])

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) return prevItems // Prevent adding duplicates
      return [...prevItems, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const increaseQuantity = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  const decreaseQuantity = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
        )
        .filter((item) => item.quantity > 0) // This line is for if you want to remove the item when quantity is 0
    )
  }

  const clearCart = () => setCartItems([])

  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, itemCount }}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const context = React.useContext(CartContext)
  if (context === undefined) throw new Error('useCart must be used within a CartProvider')
  return context
}