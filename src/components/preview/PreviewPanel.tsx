import { Eye } from 'lucide-react'
import { useTargetStore, useInputStore, useUiStore } from '../../store'
import Panel from '../layout/Panel'
import PreviewToggle from './PreviewToggle'
import JsonPreview from './JsonPreview'
import CopyButton from './CopyButton'
import EmptyState from '../shared/EmptyState'

export default function PreviewPanel() {
  const { nodes } = useTargetStore()
  useInputStore() // Hook for reactivity
  useUiStore() // Hook for reactivity

  const showEmpty = nodes.length === 0

  return (
    <Panel
      title="Output Preview"
      headerContent={
        !showEmpty && (
          <div className="flex items-center gap-2">
            <PreviewToggle />
            <CopyButton />
          </div>
        )
      }
    >
      {showEmpty ? (
        <EmptyState
          icon={Eye}
          title="Preview will appear here"
          description="Build your target schema to see the transformed JSON output"
        />
      ) : (
        <JsonPreview />
      )}
    </Panel>
  )
}
