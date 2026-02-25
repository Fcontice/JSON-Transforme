import { useDroppable } from '@dnd-kit/core'

interface DropIndicatorProps {
  parentId: string | null
  index: number
}

export default function DropIndicator({ parentId, index }: DropIndicatorProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-indicator-${parentId ?? 'root'}-${index}`,
    data: {
      type: 'drop-indicator',
      parentId,
      index,
    },
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        h-0.5 mx-2 my-0.5 rounded-full transition-all
        ${isOver ? 'h-1 bg-accent-500' : 'bg-transparent'}
      `}
    />
  )
}
