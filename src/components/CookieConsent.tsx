/**
 * Cookie Consent Banner
 * GDPR/CCPA compliant cookie consent management
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cookie, Settings, Check } from 'lucide-react'
import { Button } from './ui/button'
import { slideInVariants } from '@/lib/animations'

export type CookieCategory = 'essential' | 'functional' | 'analytics' | 'marketing'

export interface CookiePreferences {
  essential: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true, // Always enabled
  functional: false,
  analytics: false,
  marketing: false,
}

const COOKIE_CATEGORIES = [
  {
    id: 'essential' as CookieCategory,
    title: 'Essential Cookies',
    description: 'Required for basic functionality. Cannot be disabled.',
    required: true,
  },
  {
    id: 'functional' as CookieCategory,
    title: 'Functional Cookies',
    description: 'Remember your preferences and settings.',
    required: false,
  },
  {
    id: 'analytics' as CookieCategory,
    title: 'Analytics Cookies',
    description: 'Help us improve by collecting usage information.',
    required: false,
  },
  {
    id: 'marketing' as CookieCategory,
    title: 'Marketing Cookies',
    description: 'Used for personalized advertising.',
    required: false,
  },
]

export default function CookieConsent({
  onAccept,
  onReject,
  onPreferencesChange,
}: {
  onAccept?: (preferences: CookiePreferences) => void
  onReject?: () => void
  onPreferencesChange?: (preferences: CookiePreferences) => void
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [showPreferences, setShowPreferences] = React.useState(false)
  const [preferences, setPreferences] = React.useState<CookiePreferences>(DEFAULT_PREFERENCES)

  // Check for existing consent on mount
  React.useEffect(() => {
    const hasConsent = localStorage.getItem('cookie-consent')
    if (!hasConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsOpen(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    const allEnabled: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    saveConsent(allEnabled)
    onAccept?.(allEnabled)
    setIsOpen(false)
  }

  const handleRejectAll = () => {
    saveConsent(DEFAULT_PREFERENCES)
    onReject?.()
    setIsOpen(false)
  }

  const handleSavePreferences = () => {
    saveConsent(preferences)
    onPreferencesChange?.(preferences)
    setShowPreferences(false)
    setIsOpen(false)
  }

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      preferences: prefs,
      timestamp: Date.now(),
    }))

    // Set cookies based on preferences
    if (prefs.functional !== DEFAULT_PREFERENCES.functional) {
      document.cookie = `cookie-functional=${prefs.functional}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
    }
    if (prefs.analytics !== DEFAULT_PREFERENCES.analytics) {
      document.cookie = `cookie-analytics=${prefs.analytics}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
    }
    if (prefs.marketing !== DEFAULT_PREFERENCES.marketing) {
      document.cookie = `cookie-marketing=${prefs.marketing}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
    }
  }

  const togglePreference = (category: CookieCategory) => {
    if (category === 'essential') return // Cannot disable essential
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for preferences modal */}
          {showPreferences && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setShowPreferences(false)}
            />
          )}

          {/* Main Banner */}
          <motion.div
            variants={slideInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-800 shadow-2xl"
            role="alertdialog"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-description"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              {!showPreferences ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Cookie className="h-6 w-6 text-zinc-400 shrink-0 mt-0.5" />
                    <div>
                      <h3
                        id="cookie-consent-title"
                        className="text-sm font-semibold text-zinc-100"
                      >
                        We use cookies
                      </h3>
                      <p
                        id="cookie-consent-description"
                        className="mt-1 text-sm text-zinc-400"
                      >
                        We use cookies to enhance your browsing experience, analyze site traffic, 
                        and personalize content. By clicking "Accept All", you consent to our use 
                        of cookies. Visit our{' '}
                        <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                          Privacy Policy
                        </a>{' '}
                        for more information.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="secondary"
                      onClick={() => setShowPreferences(true)}
                      className="text-xs h-9"
                    >
                      <Settings size={14} className="mr-1" />
                      Preferences
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleRejectAll}
                      className="text-xs h-9"
                    >
                      Reject All
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleAcceptAll}
                      className="text-xs h-9"
                    >
                      Accept All
                    </Button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors"
                      aria-label="Dismiss"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                /* Preferences Panel */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-zinc-100">
                      Cookie Preferences
                    </h3>
                    <button
                      onClick={() => setShowPreferences(false)}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors"
                      aria-label="Close preferences"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {COOKIE_CATEGORIES.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-zinc-100">
                              {category.title}
                            </span>
                            {category.required && (
                              <span className="text-xs text-zinc-500">(Required)</span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-zinc-400">
                            {category.description}
                          </p>
                        </div>
                        <button
                          onClick={() => togglePreference(category.id)}
                          disabled={category.required}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                            preferences[category.id]
                              ? 'bg-blue-600'
                              : 'bg-zinc-700'
                          } ${category.required ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-600'}`}
                          role="switch"
                          aria-checked={preferences[category.id]}
                          aria-label={`Toggle ${category.title}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              preferences[category.id] ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                    <a
                      href="/privacy"
                      className="text-xs text-blue-400 hover:text-blue-300 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn more in our Privacy Policy
                    </a>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setShowPreferences(false)}
                        className="text-xs h-9"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleSavePreferences}
                        className="text-xs h-9"
                      >
                        <Check size={14} className="mr-1" />
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
