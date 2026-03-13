/**
 * Drag-and-Drop Utilities for Admin Panels
 * Using HTML5 Drag and Drop API with React hooks
 * 
 * Note: This file contains only hooks (no JSX) for compatibility
 */

export interface DragItem {
  id: string
  type: string
  data?: Record<string, unknown>
}

export interface UseDraggableOptions {
  type: string
  data?: Record<string, unknown>
  onDragStart?: (item: DragItem) => void
  onDragEnd?: () => void
}

export interface UseDroppableOptions {
  accept: string | string[]
  onDrop?: (item: DragItem) => void
  onDragOver?: () => void
  onDragLeave?: () => void
}

/**
 * Hook for creating draggable elements
 */
export function useDraggable(
  options: UseDraggableOptions,
  deps: unknown[] = []
) {
  const React = require('react')
  const { type, data, onDragStart, onDragEnd } = options
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDragStart = React.useCallback(
    (event: React.DragEvent, id: string) => {
      const item: DragItem = { id, type, data }
      
      // Set drag data
      event.dataTransfer.setData('application/json', JSON.stringify(item))
      event.dataTransfer.effectAllowed = 'move'

      setIsDragging(true)
      onDragStart?.(item)

      // Add dragging class for styling
      const target = event.target as HTMLElement
      target.classList.add('dragging')
    },
    [type, data, ...deps]
  )

  const handleDragEnd = React.useCallback(
    (event: React.DragEvent) => {
      setIsDragging(false)
      onDragEnd?.()

      // Remove dragging class
      const target = event.target as HTMLElement
      target.classList.remove('dragging')
    },
    [onDragEnd, ...deps]
  )

  return {
    isDragging,
    dragProps: {
      draggable: true,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
    },
  }
}

/**
 * Hook for creating droppable zones
 */
export function useDroppable(
  options: UseDroppableOptions,
  deps: unknown[] = []
) {
  const React = require('react')
  const { accept, onDrop, onDragOver, onDragLeave } = options
  const [isOver, setIsOver] = React.useState(false)
  const [draggedItem, setDraggedItem] = React.useState(null)

  const accepts = React.useMemo(() => {
    return Array.isArray(accept) ? accept : [accept]
  }, [accept, ...deps])

  const handleDragOver = React.useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
      setIsOver(true)
      onDragOver?.()
    },
    [...deps]
  )

  const handleDragLeave = React.useCallback(
    (event: React.DragEvent) => {
      // Only trigger if leaving the droppable area entirely
      if (!event.currentTarget.contains(event.relatedTarget as Node)) {
        setIsOver(false)
        setDraggedItem(null)
        onDragLeave?.()
      }
    },
    [...deps]
  )

  const handleDrop = React.useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setIsOver(false)

      try {
        const data = event.dataTransfer.getData('application/json')
        const item = JSON.parse(data)

        if (accepts.includes(item.type)) {
          setDraggedItem(item)
          onDrop?.(item)
        }
      } catch (error) {
        console.error('Drop failed:', error)
      }
    },
    [accepts, ...deps]
  )

  return {
    isOver,
    draggedItem,
    dropProps: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
  }
}

/**
 * Higher-order component for drag-and-drop lists
 */
export function useDragAndDropList(
  items: Array<{ id: string }>,
  onReorder: (items: Array<{ id: string }>) => void
) {
  const React = require('react')
  const [dragIndex, setDragIndex] = React.useState(null)
  const [hoverIndex, setHoverIndex] = React.useState(null)

  const handleDragStart = React.useCallback(
    (event: React.DragEvent, index: number) => {
      setDragIndex(index)
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', index.toString())
    },
    []
  )

  const handleDragOver = React.useCallback(
    (event: React.DragEvent, index: number) => {
      event.preventDefault()
      setHoverIndex(index)
    },
    []
  )

  const handleDrop = React.useCallback(
    (event: React.DragEvent, dropIndex: number) => {
      event.preventDefault()
      
      if (dragIndex === null || dragIndex === dropIndex) {
        setDragIndex(null)
        setHoverIndex(null)
        return
      }

      const newItems = [...items]
      const [removed] = newItems.splice(dragIndex, 1)
      newItems.splice(dropIndex, 0, removed)

      onReorder(newItems)
      setDragIndex(null)
      setHoverIndex(null)
    },
    [items, onReorder]
  )

  const handleDragEnd = React.useCallback(() => {
    setDragIndex(null)
    setHoverIndex(null)
  }, [])

  return {
    dragIndex,
    hoverIndex,
    handlers: {
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      onDragEnd: handleDragEnd,
    },
  }
}

export default {
  useDraggable,
  useDroppable,
  useDragAndDropList,
}
