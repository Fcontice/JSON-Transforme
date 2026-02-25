import { Download, Upload, Trash2, FileJson } from 'lucide-react'
import { useInputStore, useTargetStore, useUiStore } from '../../store'

export default function Header() {
  const { isValid, fileName, clear: clearInput } = useInputStore()
  const { nodes, clearAll: clearTarget } = useTargetStore()
  const { openExportModal, openImportModal } = useUiStore()

  const hasMapping = nodes.length > 0

  const handleClear = () => {
    clearInput()
    clearTarget()
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900">
      <div className="flex items-center gap-3">
        <FileJson className="w-6 h-6 text-accent-400" />
        <h1 className="text-lg font-semibold text-zinc-100">JSON Transformer</h1>
        {fileName && (
          <span className="px-2 py-0.5 text-xs font-mono bg-zinc-800 rounded text-zinc-400">
            {fileName}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={openImportModal}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md
                     text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title="Import mapping template"
        >
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Import</span>
        </button>

        <button
          onClick={openExportModal}
          disabled={!isValid || !hasMapping}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md
                     bg-accent-600 text-white hover:bg-accent-500 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-accent-600"
          title={!isValid ? 'Load valid JSON first' : !hasMapping ? 'Create a mapping first' : 'Export transformed JSON'}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <div className="w-px h-6 bg-zinc-700 mx-1" />

        <button
          onClick={handleClear}
          disabled={!isValid && nodes.length === 0}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md
                     text-zinc-400 hover:text-error-400 hover:bg-zinc-800 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
          title="Clear all"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>
    </header>
  )
}
