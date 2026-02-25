import { useCallback, useRef, useEffect } from 'react'
import { useInputStore } from '../../store'

export default function JsonTextArea() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { rawJson, setRawJson, error } = useInputStore()

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setRawJson(e.target.value)
    },
    [setRawJson]
  )

  // Scroll to error line when error changes
  useEffect(() => {
    if (error && textareaRef.current) {
      const lines = rawJson.split('\n')
      let charIndex = 0
      for (let i = 0; i < error.line - 1 && i < lines.length; i++) {
        charIndex += (lines[i]?.length ?? 0) + 1 // +1 for newline
      }
      charIndex += error.column - 1

      // Set selection to error position
      textareaRef.current.setSelectionRange(charIndex, charIndex)
      textareaRef.current.focus()
    }
  }, [error, rawJson])

  return (
    <div className="relative flex-1 min-h-0">
      <textarea
        ref={textareaRef}
        value={rawJson}
        onChange={handleChange}
        placeholder='Paste your JSON here...&#10;&#10;{&#10;  "example": "data"&#10;}'
        spellCheck={false}
        className={`
          w-full h-full p-3 rounded-md resize-none
          font-mono text-sm leading-relaxed
          bg-zinc-950 text-zinc-200 placeholder-zinc-600
          border transition-colors
          focus:outline-none focus:ring-2 focus:ring-accent-500/50
          ${error ? 'border-error-500/50' : 'border-zinc-800 focus:border-accent-500'}
        `}
      />

      {/* Line numbers overlay (optional enhancement) */}
      {rawJson && (
        <div className="absolute bottom-2 right-2 text-xs text-zinc-600 font-mono pointer-events-none">
          {rawJson.split('\n').length} lines
        </div>
      )}
    </div>
  )
}
