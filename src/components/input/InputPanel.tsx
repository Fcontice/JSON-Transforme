import { useInputStore } from '../../store'
import Panel from '../layout/Panel'
import DropZone from './DropZone'
import JsonTextArea from './JsonTextArea'
import SampleDataButton from './SampleDataButton'
import ErrorBanner from '../shared/ErrorBanner'

export default function InputPanel() {
  const { error, isValid, recordCount, isArray } = useInputStore()

  return (
    <Panel
      title="Input JSON"
      headerContent={
        <div className="flex items-center gap-2">
          {isValid && (
            <span className="text-xs text-zinc-500 font-mono">
              {recordCount} {isArray ? 'records' : 'object'}
            </span>
          )}
          <SampleDataButton />
        </div>
      }
      className="border-b border-zinc-800"
    >
      <div className="flex flex-col h-full">
        <DropZone />
        <div className="flex-1 flex flex-col min-h-0 p-3">
          {error && (
            <div className="mb-3">
              <ErrorBanner error={error} />
            </div>
          )}
          <JsonTextArea />
        </div>
      </div>
    </Panel>
  )
}
