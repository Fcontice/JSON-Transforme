import { useState, useRef } from 'react'
import { Upload, FileJson, AlertCircle } from 'lucide-react'
import Modal from '../shared/Modal'
import { useUiStore, useTargetStore } from '../../store'
import { importMapping } from '../../lib/mappingSerializer'

export default function ImportModal() {
  const { isImportModalOpen, closeImportModal } = useUiStore()
  const { setNodes } = useTargetStore()

  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setError(null)

    if (!file.name.endsWith('.jsonmap') && !file.name.endsWith('.json')) {
      setError('Please select a .jsonmap or .json file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const result = importMapping(content)

      if (result.error) {
        setError(result.error)
        return
      }

      if (result.nodes) {
        setNodes(result.nodes)
        closeImportModal()
      }
    }

    reader.onerror = () => {
      setError('Failed to read file')
    }

    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Modal isOpen={isImportModalOpen} onClose={closeImportModal} title="Import Mapping">
      <div className="space-y-4">
        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-zinc-700 hover:border-zinc-600'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jsonmap,.json"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-zinc-800 rounded-full">
              <Upload className="w-6 h-6 text-zinc-400" />
            </div>
            <div>
              <p className="text-zinc-300 font-medium">
                Drop your mapping file here
              </p>
              <p className="text-sm text-zinc-500 mt-1">
                or{' '}
                <button
                  onClick={handleBrowseClick}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  browse
                </button>{' '}
                to select
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <FileJson className="w-4 h-4" />
              <span>Supports .jsonmap and .json files</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-950/50 border border-red-900 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-zinc-500 bg-zinc-800/50 rounded-lg p-3">
          <p className="font-medium text-zinc-400 mb-1">What is a mapping file?</p>
          <p>
            A mapping file (.jsonmap) contains your saved target structure configuration.
            Import a previously exported mapping to restore your field mappings and transforms.
          </p>
        </div>
      </div>
    </Modal>
  )
}
