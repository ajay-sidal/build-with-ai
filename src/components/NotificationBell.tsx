/**
 * Notification Bell Component
 * Displays real-time notifications with unread count badge
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, CheckCheck, X, Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'
import { useNotifications } from '@/lib/notifications'
import { Button } from '@/components/ui/button'
import { dropdownVariants, staggerContainerVariants, menuItemVariants } from '@/lib/animations'

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    isConnected,
  } = useNotifications()
  const [isOpen, setIsOpen] = React.useState(false)

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <Button
        variant="secondary"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="relative rounded-lg p-2 text-zinc-100 hover:bg-zinc-900/60 transition-colors"
      >
        <Bell size={20} />
        
        {/* Connection status indicator */}
        <span
          className={`absolute bottom-1 right-1 h-2 w-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
          aria-label={isConnected ? 'Connected' : 'Disconnected'}
        />

        {/* Unread count badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Panel */}
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute right-0 top-full z-50 mt-2 w-96 rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl"
              style={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                <h3 className="font-semibold text-zinc-100">Notifications</h3>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <Button
                      variant="secondary"
                      onClick={markAllAsRead}
                      className="h-8 text-xs"
                      aria-label="Mark all as read"
                    >
                      <CheckCheck size={14} className="mr-1" />
                      Mark all read
                    </Button>
                  )}
                  {notifications.length > 0 && (
                    <Button
                      variant="secondary"
                      onClick={clearAll}
                      className="h-8 text-xs"
                      aria-label="Clear all notifications"
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <motion.div
                variants={staggerContainerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-zinc-800"
              >
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-zinc-500">
                    <Bell size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      variants={menuItemVariants}
                      custom={index}
                      className={`group flex gap-3 px-4 py-3 hover:bg-zinc-900/60 transition-colors ${
                        !notification.read ? 'bg-zinc-900/30' : ''
                      }`}
                    >
                      {/* Icon */}
                      <div className="shrink-0 pt-0.5">{getIcon(notification.type)}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium text-zinc-100 truncate">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-zinc-500 whitespace-nowrap">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-zinc-400 line-clamp-2">
                          {notification.message}
                        </p>

                        {/* Action button if present */}
                        {notification.action && (
                          <button
                            onClick={notification.action.onClick}
                            className="mt-2 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {notification.action.label}
                          </button>
                        )}
                      </div>

                      {/* Mark as read / Remove */}
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-zinc-500 hover:text-green-500 transition-colors"
                            aria-label="Mark as read"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="text-zinc-500 hover:text-red-500 transition-colors"
                          aria-label="Remove notification"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="border-t border-zinc-800 px-4 py-2 text-center">
                  <p className="text-xs text-zinc-500">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
