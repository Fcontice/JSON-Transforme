import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useTargetStore, useInputStore, useUiStore } from '../../store'
import { transformData, generateSchema } from '../../lib/transformer'

export default function CopyButton() {
  const [copied, setCopied] = useState(false)

  const { nodes } = useTargetStore()
  const { parsedData, isArray } = useInputStore()
  const { viewMode } = useUiStore()

  const handleCopy = async () => {
    let output: unknown

    if (viewMode === 'schema') {
      output = generateSchema(nodes)
    } else if (parsedData) {
      const records = isArray ? (parsedData as unknown[]) : [parsedData]
      const firstRecord = records[0]
      if (firstRecord) {
        output = transformData(firstRecord, nodes)
      }
    }

    if (output !== undefined) {
      const jsonString = JSON.stringify(output, null, 2)

      try {
        await navigator.clipboard.writeText(jsonString)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`
        flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded transition-all
        ${
          copied
            ? 'bg-success-500/20 text-success-400'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
        }
      `}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  )
}
