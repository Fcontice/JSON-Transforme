import { useRef, useCallback, type ReactNode } from 'react'
import { useUiStore } from '../../store'

interface ResizablePanelsProps {
  leftPanel: ReactNode
  centerPanel: ReactNode
  rightPanel: ReactNode
}

export default function ResizablePanels({
  leftPanel,
  centerPanel,
  rightPanel,
}: ResizablePanelsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { panelSizes, setPanelSizes } = useUiStore()
  const dragStateRef = useRef<{
    divider: 'left' | 'right'
    startX: number
    startSizes: typeof panelSizes
  } | null>(null)

  const handleMouseDown = useCallback(
    (divider: 'left' | 'right') => (e: React.MouseEvent) => {
      e.preventDefault()
      dragStateRef.current = {
        divider,
        startX: e.clientX,
        startSizes: { ...panelSizes },
      }

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!dragStateRef.current || !containerRef.current) return

        const containerWidth = containerRef.current.offsetWidth
        const deltaX = moveEvent.clientX - dragStateRef.current.startX
        const deltaPercent = (deltaX / containerWidth) * 100

        const { divider, startSizes } = dragStateRef.current
        const minSize = 15 // Minimum panel size in percent

        if (divider === 'left') {
          let newLeft = startSizes.left + deltaPercent
          let newCenter = startSizes.center - deltaPercent

          // Enforce minimum sizes
          if (newLeft < minSize) {
            newCenter = newCenter + (newLeft - minSize)
            newLeft = minSize
          }
          if (newCenter < minSize) {
            newLeft = newLeft - (minSize - newCenter)
            newCenter = minSize
          }

          // Clamp values
          newLeft = Math.max(minSize, Math.min(100 - startSizes.right - minSize, newLeft))
          newCenter = Math.max(minSize, Math.min(100 - startSizes.right - minSize, newCenter))

          setPanelSizes({
            left: newLeft,
            center: newCenter,
          })
        } else {
          let newCenter = startSizes.center + deltaPercent
          let newRight = startSizes.right - deltaPercent

          // Enforce minimum sizes
          if (newRight < minSize) {
            newCenter = newCenter - (minSize - newRight)
            newRight = minSize
          }
          if (newCenter < minSize) {
            newRight = newRight + (newCenter - minSize)
            newCenter = minSize
          }

          // Clamp values
          newCenter = Math.max(minSize, Math.min(100 - startSizes.left - minSize, newCenter))
          newRight = Math.max(minSize, Math.min(100 - startSizes.left - minSize, newRight))

          setPanelSizes({
            center: newCenter,
            right: newRight,
          })
        }
      }

      const handleMouseUp = () => {
        dragStateRef.current = null
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    },
    [panelSizes, setPanelSizes]
  )

  return (
    <div ref={containerRef} className="flex flex-1 overflow-hidden">
      {/* Left Panel */}
      <div
        className="overflow-hidden border-r border-zinc-800"
        style={{ width: `${panelSizes.left}%` }}
      >
        {leftPanel}
      </div>

      {/* Left Divider */}
      <div
        onMouseDown={handleMouseDown('left')}
        className="w-1 cursor-col-resize bg-zinc-800 hover:bg-accent-600 transition-colors shrink-0"
      />

      {/* Center Panel */}
      <div
        className="overflow-hidden border-r border-zinc-800"
        style={{ width: `${panelSizes.center}%` }}
      >
        {centerPanel}
      </div>

      {/* Right Divider */}
      <div
        onMouseDown={handleMouseDown('right')}
        className="w-1 cursor-col-resize bg-zinc-800 hover:bg-accent-600 transition-colors shrink-0"
      />

      {/* Right Panel */}
      <div className="overflow-hidden" style={{ width: `${panelSizes.right}%` }}>
        {rightPanel}
      </div>
    </div>
  )
}
