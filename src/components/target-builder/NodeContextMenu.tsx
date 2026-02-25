import { useEffect, useRef } from 'react'
import {
  Pencil,
  Trash2,
  Copy,
  Braces,
  List,
  Plus,
} from 'lucide-react'
import { useTargetStore, useUiStore } from '../../store'

export default function NodeContextMenu() {
  const menuRef = useRef<HTMLDivElement>(null)

  const {
    contextMenuNodeId,
    contextMenuPosition,
    closeContextMenu,
    setEditingNodeId,
  } = useUiStore()

  const {
    deleteNode,
    duplicateNode,
    wrapInObject,
    wrapInArray,
    addSibling,
    findNode,
  } = useTargetStore()

  const node = contextMenuNodeId ? findNode(contextMenuNodeId) : null

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeContextMenu()
      }
    }

    if (contextMenuNodeId) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [contextMenuNodeId, closeContextMenu])

  if (!contextMenuNodeId || !contextMenuPosition || !node) {
    return null
  }

  const handleRename = () => {
    setEditingNodeId(contextMenuNodeId)
    closeContextMenu()
  }

  const handleDelete = () => {
    deleteNode(contextMenuNodeId)
    closeContextMenu()
  }

  const handleDuplicate = () => {
    duplicateNode(contextMenuNodeId)
    closeContextMenu()
  }

  const handleWrapInObject = () => {
    wrapInObject(contextMenuNodeId)
    closeContextMenu()
  }

  const handleWrapInArray = () => {
    wrapInArray(contextMenuNodeId)
    closeContextMenu()
  }

  const handleAddSibling = () => {
    addSibling(contextMenuNodeId, 'field')
    closeContextMenu()
  }

  // Position menu to stay within viewport
  const style: React.CSSProperties = {
    position: 'fixed',
    left: contextMenuPosition.x,
    top: contextMenuPosition.y,
    zIndex: 100,
  }

  return (
    <div
      ref={menuRef}
      style={style}
      className="min-w-44 py-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl"
    >
      <button
        onClick={handleRename}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
      >
        <Pencil className="w-4 h-4 text-zinc-500" />
        <span>Rename</span>
        <span className="ml-auto text-xs text-zinc-600">Double-click</span>
      </button>

      <button
        onClick={handleDuplicate}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
      >
        <Copy className="w-4 h-4 text-zinc-500" />
        <span>Duplicate</span>
      </button>

      <div className="h-px bg-zinc-700 my-1" />

      <button
        onClick={handleWrapInObject}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
      >
        <Braces className="w-4 h-4 text-orange-400" />
        <span>Wrap in Object</span>
      </button>

      <button
        onClick={handleWrapInArray}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
      >
        <List className="w-4 h-4 text-purple-400" />
        <span>Wrap in Array</span>
      </button>

      <button
        onClick={handleAddSibling}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
      >
        <Plus className="w-4 h-4 text-zinc-500" />
        <span>Add Sibling</span>
      </button>

      <div className="h-px bg-zinc-700 my-1" />

      <button
        onClick={handleDelete}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error-400 hover:bg-error-500/10 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete</span>
        <span className="ml-auto text-xs text-zinc-600">Del</span>
      </button>
    </div>
  )
}
