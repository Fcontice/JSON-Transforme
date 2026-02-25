import { Key } from 'lucide-react'
import { useSourceKeysStore, useInputStore } from '../../store'
import Panel from '../layout/Panel'
import KeySearchBar from './KeySearchBar'
import SourceKeyTree from './SourceKeyTree'
import EmptyState from '../shared/EmptyState'

export default function SourceKeysPanel() {
  const { keys } = useSourceKeysStore()
  const { isValid } = useInputStore()

  const showEmpty = !isValid || keys.length === 0

  return (
    <Panel
      title="Source Keys"
      headerContent={!showEmpty && <KeySearchBar />}
      className="flex-1"
    >
      {showEmpty ? (
        <EmptyState
          icon={Key}
          title={isValid ? 'No keys found' : 'No JSON loaded'}
          description={
            isValid
              ? 'The JSON appears to be empty or have no extractable keys'
              : 'Paste JSON or drop a file above to see available keys'
          }
        />
      ) : (
        <SourceKeyTree />
      )}
    </Panel>
  )
}
