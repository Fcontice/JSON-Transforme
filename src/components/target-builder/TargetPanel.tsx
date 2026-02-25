import { useDroppable } from '@dnd-kit/core'
import { Layers } from 'lucide-react'
import { useTargetStore, useInputStore } from '../../store'
import Panel from '../layout/Panel'
import TargetToolbar from './TargetToolbar'
import TargetTree from './TargetTree'
import EmptyState from '../shared/EmptyState'
import NodeContextMenu from './NodeContextMenu'

export default function TargetPanel() {
  const { nodes } = useTargetStore()
  const { isValid } = useInputStore()

  const { setNodeRef, isOver } = useDroppable({
    id: 'target-root',
    data: {
      type: 'target-root',
    },
  })

  const showEmpty = nodes.length === 0

  return (
    <Panel
      title="Target Schema"
      headerContent={<TargetToolbar />}
    >
      <div
        ref={setNodeRef}
        className={`
          h-full transition-colors
          ${isOver ? 'bg-accent-500/5' : ''}
        `}
      >
        {showEmpty ? (
          <EmptyState
            icon={Layers}
            title="Build your schema"
            description={
              isValid
                ? 'Drag keys from the left panel here, or use the toolbar to add structure'
                : 'Load JSON first, then drag keys here to build your output structure'
            }
          />
        ) : (
          <TargetTree />
        )}
      </div>
      <NodeContextMenu />
    </Panel>
  )
}
