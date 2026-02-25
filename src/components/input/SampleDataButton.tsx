import { Sparkles } from 'lucide-react'
import { useInputStore } from '../../store'
import { sampleJson } from '../../lib/sampleData'

export default function SampleDataButton() {
  const { setRawJson, isValid } = useInputStore()

  const handleClick = () => {
    setRawJson(sampleJson)
  }

  if (isValid) {
    return null
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded
                 text-accent-400 hover:text-accent-300 hover:bg-accent-500/10 transition-colors"
      title="Load sample e-commerce order data"
    >
      <Sparkles className="w-3.5 h-3.5" />
      <span>Sample</span>
    </button>
  )
}
