import { useState } from 'react'
import { Download, FileJson, Copy, Check } from 'lucide-react'
import Modal from '../shared/Modal'
import { useUiStore, useTargetStore, useInputStore } from '../../store'
import { transformData, generateSchema } from '../../lib/transformer'
import { exportMapping } from '../../lib/mappingSerializer'

export default function ExportModal() {
  const { isExportModalOpen, closeExportModal, viewMode } = useUiStore()
  const { nodes } = useTargetStore()
  const { parsedData } = useInputStore()

  const [format, setFormat] = useState<'json' | 'mapping'>('json')
  const [prettify, setPrettify] = useState(true)
  const [copied, setCopied] = useState(false)

  const getExportContent = (): string => {
    if (format === 'mapping') {
      return exportMapping(nodes)
    }

    if (viewMode === 'schema') {
      const schema = generateSchema(nodes)
      return prettify ? JSON.stringify(schema, null, 2) : JSON.stringify(schema)
    }

    const transformed = transformData(parsedData, nodes)
    return prettify ? JSON.stringify(transformed, null, 2) : JSON.stringify(transformed)
  }

  const handleDownload = () => {
    const content = getExportContent()
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url

    if (format === 'mapping') {
      a.download = 'mapping.jsonmap'
    } else if (viewMode === 'schema') {
      a.download = 'schema.json'
    } else {
      a.download = 'transformed.json'
    }

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    closeExportModal()
  }

  const handleCopy = async () => {
    const content = getExportContent()
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Modal isOpen={isExportModalOpen} onClose={closeExportModal} title="Export">
      <div className="space-y-4">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Export Format
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('json')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                format === 'json'
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-750'
              }`}
            >
              <FileJson className="w-4 h-4" />
              <span>
                {viewMode === 'schema' ? 'Schema JSON' : 'Transformed JSON'}
              </span>
            </button>
            <button
              onClick={() => setFormat('mapping')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                format === 'mapping'
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-750'
              }`}
            >
              <FileJson className="w-4 h-4" />
              <span>Mapping Template</span>
            </button>
          </div>
        </div>

        {/* Prettify Toggle (only for JSON) */}
        {format === 'json' && (
          <div className="flex items-center justify-between">
            <label className="text-sm text-zinc-300">Prettify output</label>
            <button
              onClick={() => setPrettify(!prettify)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                prettify ? 'bg-blue-600' : 'bg-zinc-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  prettify ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        )}

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Preview
          </label>
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 max-h-48 overflow-auto">
            <pre className="text-xs text-zinc-400 font-mono whitespace-pre-wrap break-all">
              {getExportContent().slice(0, 500)}
              {getExportContent().length > 500 && '...'}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-zinc-200 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </Modal>
  )
}
