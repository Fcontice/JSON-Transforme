import { Braces, List, Type, Trash2 } from 'lucide-react'
import { useTargetStore } from '../../store'

export default function TargetToolbar() {
  const { addNode, nodes, clearAll } = useTargetStore()

  const handleAddObject = () => {
    addNode({
      type: 'object',
      targetKey: 'newObject',
    })
  }

  const handleAddArray = () => {
    addNode({
      type: 'array',
      targetKey: 'newArray',
    })
  }

  const handleAddLiteral = () => {
    addNode({
      type: 'literal',
      targetKey: 'newValue',
      literalValue: '',
    })
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleAddObject}
        className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded
                   text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
        title="Add object"
      >
        <Braces className="w-3.5 h-3.5" />
        <span>Object</span>
      </button>

      <button
        onClick={handleAddArray}
        className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded
                   text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
        title="Add array"
      >
        <List className="w-3.5 h-3.5" />
        <span>Array</span>
      </button>

      <button
        onClick={handleAddLiteral}
        className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded
                   text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 transition-colors"
        title="Add literal value"
      >
        <Type className="w-3.5 h-3.5" />
        <span>Literal</span>
      </button>

      {nodes.length > 0 && (
        <>
          <div className="w-px h-4 bg-zinc-700 mx-1" />
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded
                       text-zinc-500 hover:text-error-400 hover:bg-zinc-700 transition-colors"
            title="Clear all nodes"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  )
}
