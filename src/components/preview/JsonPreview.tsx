import { useMemo } from 'react'
import { useTargetStore, useInputStore, useUiStore } from '../../store'
import { transformData, generateSchema } from '../../lib/transformer'

export default function JsonPreview() {
  const { nodes } = useTargetStore()
  const { parsedData, isArray } = useInputStore()
  const { viewMode } = useUiStore()

  const output = useMemo(() => {
    if (viewMode === 'schema') {
      return generateSchema(nodes)
    }

    if (!parsedData) {
      return null
    }

    // Transform first record for preview
    const records = isArray ? (parsedData as unknown[]) : [parsedData]
    const firstRecord = records[0]

    if (!firstRecord) {
      return null
    }

    return transformData(firstRecord, nodes)
  }, [nodes, parsedData, isArray, viewMode])

  const jsonString = useMemo(() => {
    if (output === null || output === undefined) {
      return viewMode === 'schema' ? '// No schema defined' : '// No data to preview'
    }
    return JSON.stringify(output, null, 2)
  }, [output, viewMode])

  return (
    <div className="h-full overflow-auto">
      <pre className="p-4 text-sm font-mono leading-relaxed">
        <code>
          {jsonString.split('\n').map((line, index) => (
            <div key={index} className="flex">
              <span className="w-8 text-right pr-4 text-zinc-600 select-none">
                {index + 1}
              </span>
              <span className="flex-1">
                <SyntaxHighlightedLine line={line} />
              </span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}

// Simple syntax highlighting without external library
function SyntaxHighlightedLine({ line }: { line: string }) {
  // Match different JSON token types
  const parts: { text: string; className: string }[] = []
  let remaining = line

  while (remaining.length > 0) {
    // Match strings
    const stringMatch = remaining.match(/^"[^"\\]*(?:\\.[^"\\]*)*"/)
    if (stringMatch) {
      const text = stringMatch[0]
      // Check if it's a key (followed by colon) or value
      const isKey = remaining.slice(text.length).trimStart().startsWith(':')
      parts.push({
        text,
        className: isKey ? 'text-accent-400' : 'text-green-400',
      })
      remaining = remaining.slice(text.length)
      continue
    }

    // Match numbers
    const numberMatch = remaining.match(/^-?\d+\.?\d*(?:e[+-]?\d+)?/)
    if (numberMatch) {
      parts.push({
        text: numberMatch[0],
        className: 'text-blue-400',
      })
      remaining = remaining.slice(numberMatch[0].length)
      continue
    }

    // Match booleans and null
    const keywordMatch = remaining.match(/^(true|false|null)/)
    if (keywordMatch) {
      parts.push({
        text: keywordMatch[0],
        className: keywordMatch[0] === 'null' ? 'text-zinc-500' : 'text-yellow-400',
      })
      remaining = remaining.slice(keywordMatch[0].length)
      continue
    }

    // Match structural characters
    const structMatch = remaining.match(/^[\[\]{}:,]/)
    if (structMatch) {
      parts.push({
        text: structMatch[0],
        className: 'text-zinc-400',
      })
      remaining = remaining.slice(1)
      continue
    }

    // Match whitespace
    const wsMatch = remaining.match(/^\s+/)
    if (wsMatch) {
      parts.push({
        text: wsMatch[0],
        className: '',
      })
      remaining = remaining.slice(wsMatch[0].length)
      continue
    }

    // Fallback: single character
    parts.push({
      text: remaining[0]!,
      className: 'text-zinc-300',
    })
    remaining = remaining.slice(1)
  }

  return (
    <>
      {parts.map((part, i) => (
        <span key={i} className={part.className}>
          {part.text}
        </span>
      ))}
    </>
  )
}
