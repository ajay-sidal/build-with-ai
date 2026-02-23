/**
 * Real-time Notifications System
 * Uses Server-Sent Events (SSE) for real-time updates
 * Falls back to polling if SSE is not available
 */

'use client'

import * as React from 'react'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: number
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  isConnected: boolean
}

const NotificationContext = React.createContext<NotificationContextType | null>(null)

// Polling interval in milliseconds
const POLL_INTERVAL = 30000 // 30 seconds

/**
 * Custom hook for using notifications
 */
export function useNotifications() {
  const context = React.useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

/**
 * Provider component for notifications
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [isConnected, setIsConnected] = React.useState(false)

  // Load notifications from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('notifications')
      if (stored) {
        try {
          setNotifications(JSON.parse(stored))
        } catch (e) {
          console.error('Failed to parse stored notifications:', e)
        }
      }
    }
  }, [])

  // Save notifications to localStorage whenever they change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('notifications', JSON.stringify(notifications))
    }
  }, [notifications])

  // Set up SSE connection or polling for real-time updates
  React.useEffect(() => {
    let eventSource: EventSource | null = null
    let pollInterval: NodeJS.Timeout | null = null

    // Try SSE first
    if (typeof EventSource !== 'undefined') {
      eventSource = new EventSource('/api/notifications/stream')

      eventSource.onopen = () => {
        setIsConnected(true)
        console.log('Notification stream connected')
      }

      eventSource.onerror = () => {
        setIsConnected(false)
        console.log('Notification stream disconnected, falling back to polling')
        eventSource?.close()

        // Fall back to polling
        startPolling()
      }

      eventSource.addEventListener('notification', (event) => {
        try {
          const notification: Omit<Notification, 'read' | 'timestamp'> = JSON.parse(event.data)
          addNotification({
            type: notification.type,
            title: notification.title,
            message: notification.message,
          })
        } catch (e) {
          console.error('Failed to parse notification:', e)
        }
      })
    } else {
      // SSE not supported, use polling
      startPolling()
    }

    function startPolling() {
      pollInterval = setInterval(async () => {
        try {
          const response = await fetch('/api/notifications')
          if (response.ok) {
            const data = await response.json()
            setIsConnected(true)
            // Add new notifications
            data.forEach((notification: any) => {
              if (!notifications.find((n) => n.id === notification.id)) {
                addNotification({
                  type: notification.type,
                  title: notification.title,
                  message: notification.message,
                })
              }
            })
          }
        } catch (e) {
          setIsConnected(false)
        }
      }, POLL_INTERVAL)
    }

    return () => {
      if (eventSource) {
        eventSource.close()
      }
      if (pollInterval) {
        clearInterval(pollInterval)
      }
    }
  }, [])

  const addNotification = React.useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
        ...notification,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        read: false,
      }
      setNotifications((prev) => [newNotification, ...prev])

      // Show browser notification if permission granted
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/icon.png',
        })
      }
    },
    []
  )

  const markAsRead = React.useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }, [])

  const markAllAsRead = React.useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const removeNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = React.useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = React.useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  const value = React.useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
      isConnected,
    }),
    [
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
      isConnected,
    ]
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof Notification === 'undefined') {
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission === 'denied') {
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

/**
 * Hook for requesting notification permission on mount
 */
export function useNotificationPermission() {
  const [permission, setPermission] = React.useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  )

  React.useEffect(() => {
    setPermission(typeof Notification !== 'undefined' ? Notification.permission : 'denied')
  }, [])

  const request = React.useCallback(async () => {
    if (typeof Notification === 'undefined') return false
    const result = await Notification.requestPermission()
    setPermission(result)
    return result === 'granted'
  }, [])

  return { permission, request }
}

export default {
  NotificationProvider,
  useNotifications,
  requestNotificationPermission,
  useNotificationPermission,
}
