/**
 * Accessibility (a11y) Utilities
 * Enterprise-grade accessibility helpers for keyboard navigation and ARIA
 */

/**
 * Handle keyboard events for clickable elements
 * Makes div/span elements behave like buttons for keyboard users
 */
export function handleKeyboardClick(event: React.KeyboardEvent, onClick?: () => void) {
  // Enter or Space key should trigger click
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onClick?.()
  }
}

/**
 * Handle keyboard events for interactive elements with Escape support
 */
export function handleKeyboardInteractive(
  event: React.KeyboardEvent,
  actions: {
    onEnter?: () => void
    onEscape?: () => void
    onArrowUp?: () => void
    onArrowDown?: () => void
    onArrowLeft?: () => void
    onArrowRight?: () => void
    onTab?: () => void
  }
) {
  const {
    onEnter,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
  } = actions

  switch (event.key) {
    case 'Enter':
      event.preventDefault()
      onEnter?.()
      break
    case 'Escape':
      event.preventDefault()
      onEscape?.()
      break
    case 'ArrowUp':
      event.preventDefault()
      onArrowUp?.()
      break
    case 'ArrowDown':
      event.preventDefault()
      onArrowDown?.()
      break
    case 'ArrowLeft':
      event.preventDefault()
      onArrowLeft?.()
      break
    case 'ArrowRight':
      event.preventDefault()
      onArrowRight?.()
      break
    case 'Tab':
      onTab?.()
      break
  }
}

/**
 * Generate unique ID for ARIA labels
 * Safe for SSR by checking window availability
 */
export function generateAriaId(prefix: string): string {
  const id = typeof crypto !== 'undefined' ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  return `${prefix}-${id}`
}

/**
 * Create ARIA live region announcer for screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (typeof document === 'undefined') return

  // Remove existing announcer if present
  const existing = document.getElementById('a11y-announcer')
  if (existing) {
    existing.remove()
  }

  // Create new announcer
  const announcer = document.createElement('div')
  announcer.id = 'a11y-announcer'
  announcer.setAttribute('role', 'status')
  announcer.setAttribute('aria-live', priority)
  announcer.setAttribute('aria-atomic', 'true')
  announcer.className = 'sr-only' // Visually hidden but accessible
  announcer.textContent = message

  document.body.appendChild(announcer)

  // Clean up after announcement is read
  setTimeout(() => {
    announcer.remove()
  }, 3000)
}

/**
 * Trap focus within a container (for modals, dialogs, menus)
 * Returns a cleanup function to remove the trap
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]',
  ].join(', ')

  const focusableElements = container.querySelectorAll<HTMLElement>(focusableSelectors)
  const firstFocusable = focusableElements[0]
  const lastFocusable = focusableElements[focusableElements.length - 1]

  // Focus first element
  firstFocusable?.focus()

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable?.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable?.focus()
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown)

  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Restore focus to a previously focused element
 * Useful when closing modals or dialogs
 */
export function restoreFocus(element: HTMLElement | null) {
  if (element && typeof element.focus === 'function') {
    element.focus()
  }
}

/**
 * Check if an element is currently focused
 */
export function isElementFocused(element: HTMLElement | null): boolean {
  if (!element) return false
  return element === document.activeElement
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]',
  ]

  const elements = container.querySelectorAll<HTMLElement>(focusableSelectors.join(', '))
  return Array.from(elements)
}

/**
 * Create a roving tabindex manager for composite widgets
 * (menus, tab lists, radio groups, etc.)
 */
export function createRovingTabindex<T extends HTMLElement>(
  container: HTMLElement,
  selector: string
) {
  const getItems = () => Array.from(container.querySelectorAll<T>(selector))

  function focusItem(index: number) {
    const items = getItems()
    if (items.length === 0) return

    // Clamp index
    const clampedIndex = ((index % items.length) + items.length) % items.length
    const item = items[clampedIndex]

    // Set tabindex
    items.forEach((element, itemIndex) => {
      element.setAttribute('tabindex', itemIndex === clampedIndex ? '0' : '-1')
    })

    item.focus()
  }

  function handleKeyDown(event: KeyboardEvent) {
    const items = getItems()
    const currentIndex = items.findIndex((item) => item === document.activeElement)

    if (currentIndex === -1) {
      focusItem(0)
      return
    }

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        focusItem(currentIndex + 1)
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        focusItem(currentIndex - 1)
        break
      case 'Home':
        event.preventDefault()
        focusItem(0)
        break
      case 'End':
        event.preventDefault()
        focusItem(items.length - 1)
        break
    }
  }

  // Initialize: set first item as tabbable
  const items = getItems()
  items.forEach((item, index) => {
    item.setAttribute('tabindex', index === 0 ? '0' : '-1')
  })

  container.addEventListener('keydown', handleKeyDown)

  return {
    focusItem,
    destroy: () => container.removeEventListener('keydown', handleKeyDown),
  }
}

export default {
  handleKeyboardClick,
  handleKeyboardInteractive,
  generateAriaId,
  announceToScreenReader,
  trapFocus,
  restoreFocus,
  isElementFocused,
  getFocusableElements,
  createRovingTabindex,
}
