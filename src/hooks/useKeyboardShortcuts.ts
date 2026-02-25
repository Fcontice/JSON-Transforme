import { useEffect } from 'react'
import { useTargetStore, useUiStore } from '../store'

export function useKeyboardShortcuts() {
  const { deleteNode } = useTargetStore()
  const { contextMenuNodeId, closeContextMenu, editingNodeId, setEditingNodeId } = useUiStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // Delete key - delete selected node
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (contextMenuNodeId) {
          deleteNode(contextMenuNodeId)
          closeContextMenu()
        }
      }

      // Escape - close context menu or cancel editing
      if (e.key === 'Escape') {
        if (contextMenuNodeId) {
          closeContextMenu()
        }
        if (editingNodeId) {
          setEditingNodeId(null)
        }
      }

      // Enter on context menu - confirm rename
      if (e.key === 'Enter' && editingNodeId) {
        // The input will handle this
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [contextMenuNodeId, editingNodeId, deleteNode, closeContextMenu, setEditingNodeId])
}
