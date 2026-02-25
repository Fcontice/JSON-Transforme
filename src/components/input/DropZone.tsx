import { useCallback, useState, useRef } from 'react'
import { Upload, FileJson } from 'lucide-react'
import { useInputStore } from '../../store'

export default function DropZone() {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setFromFile, isValid } = useInputStore()

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith('.json')) {
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setFromFile(content, file.name)
      }
      reader.readAsText(file)
    },
    [setFromFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  // Don't show drop zone if we already have valid JSON
  if (isValid) {
    return null
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      className={`
        flex flex-col items-center justify-center gap-3 p-6 m-3 mb-0
        border-2 border-dashed rounded-lg cursor-pointer transition-all
        ${
          isDragging
            ? 'border-accent-500 bg-accent-500/10'
            : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/30'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div
        className={`p-3 rounded-full transition-colors ${
          isDragging ? 'bg-accent-500/20' : 'bg-zinc-800'
        }`}
      >
        {isDragging ? (
          <FileJson className="w-6 h-6 text-accent-400" />
        ) : (
          <Upload className="w-6 h-6 text-zinc-400" />
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-zinc-300">
          {isDragging ? 'Drop your JSON file' : 'Drop JSON file here'}
        </p>
        <p className="text-xs text-zinc-500 mt-1">or click to browse</p>
      </div>
    </div>
  )
}
