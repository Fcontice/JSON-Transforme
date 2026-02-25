import { Search, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useSourceKeysStore } from '../../store'

export default function KeySearchBar() {
  const { searchQuery, setSearchQuery, expandAll, collapseAll } = useSourceKeysStore()

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter keys..."
          className="w-32 pl-7 pr-7 py-1 text-xs rounded
                     bg-zinc-800 border border-zinc-700 text-zinc-200 placeholder-zinc-500
                     focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-zinc-700"
          >
            <X className="w-3 h-3 text-zinc-500" />
          </button>
        )}
      </div>

      <div className="flex items-center border-l border-zinc-700 pl-2">
        <button
          onClick={expandAll}
          className="p-1 rounded hover:bg-zinc-700 transition-colors"
          title="Expand all"
        >
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
        </button>
        <button
          onClick={collapseAll}
          className="p-1 rounded hover:bg-zinc-700 transition-colors"
          title="Collapse all"
        >
          <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
        </button>
      </div>
    </div>
  )
}
