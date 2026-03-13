/**
 * Sortable List Component with Drag-and-Drop
 * For admin panels and reorderable lists
 */

'use client'

import * as React from 'react'
import { useDragAndDropList } from '@/lib/drag-and-drop'

export interface SortableListProps<T extends { id: string }> {
  items: T[]
  onReorder: (items: T[]) => void
  renderItem: (item: T, index: number, isDragging: boolean) => React.ReactNode
  className?: string
}

export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  className = '',
}: SortableListProps<T>) {
  const { dragIndex, hoverIndex, handlers } = useDragAndDropList(
    items as Array<{ id: string }>,
    onReorder as (items: Array<{ id: string }>) => void
  )

  return (
    <div className={className}>
      {items.map((item, index) => {
        const isDragging = dragIndex === index
        const isHovered = hoverIndex === index
        const opacity = isDragging ? 0.5 : isHovered ? 0.8 : 1

        return (
          <div
            key={item.id}
            onDragStart={(e) => handlers.onDragStart(e, index)}
            onDragOver={(e) => handlers.onDragOver(e, index)}
            onDrop={(e) => handlers.onDrop(e, index)}
            onDragEnd={handlers.onDragEnd}
            style={{ opacity }}
            className="cursor-move touch-none"
          >
            {renderItem(item, index, isDragging)}
          </div>
        )
      })}
    </div>
  )
}

export default SortableList
