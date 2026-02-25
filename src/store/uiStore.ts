import { create } from 'zustand'
import type { ViewMode, ExportFormat } from '../types'

interface PanelSizes {
  left: number
  center: number
  right: number
}

interface UiState {
  panelSizes: PanelSizes
  viewMode: ViewMode
  exportFormat: ExportFormat
  isExportModalOpen: boolean
  isImportModalOpen: boolean
  contextMenuNodeId: string | null
  contextMenuPosition: { x: number; y: number } | null
  editingNodeId: string | null
  draggedItemId: string | null

  setPanelSizes: (sizes: Partial<PanelSizes>) => void
  setViewMode: (mode: ViewMode) => void
  setExportFormat: (format: ExportFormat) => void
  openExportModal: () => void
  closeExportModal: () => void
  openImportModal: () => void
  closeImportModal: () => void
  openContextMenu: (nodeId: string, position: { x: number; y: number }) => void
  closeContextMenu: () => void
  setEditingNodeId: (id: string | null) => void
  setDraggedItemId: (id: string | null) => void
}

const DEFAULT_PANEL_SIZES: PanelSizes = {
  left: 25,
  center: 40,
  right: 35,
}

export const useUiStore = create<UiState>((set) => ({
  panelSizes: DEFAULT_PANEL_SIZES,
  viewMode: 'data',
  exportFormat: 'prettified',
  isExportModalOpen: false,
  isImportModalOpen: false,
  contextMenuNodeId: null,
  contextMenuPosition: null,
  editingNodeId: null,
  draggedItemId: null,

  setPanelSizes: (sizes) => {
    set(state => ({
      panelSizes: { ...state.panelSizes, ...sizes },
    }))
  },

  setViewMode: (mode) => {
    set({ viewMode: mode })
  },

  setExportFormat: (format) => {
    set({ exportFormat: format })
  },

  openExportModal: () => {
    set({ isExportModalOpen: true })
  },

  closeExportModal: () => {
    set({ isExportModalOpen: false })
  },

  openImportModal: () => {
    set({ isImportModalOpen: true })
  },

  closeImportModal: () => {
    set({ isImportModalOpen: false })
  },

  openContextMenu: (nodeId, position) => {
    set({
      contextMenuNodeId: nodeId,
      contextMenuPosition: position,
    })
  },

  closeContextMenu: () => {
    set({
      contextMenuNodeId: null,
      contextMenuPosition: null,
    })
  },

  setEditingNodeId: (id) => {
    set({ editingNodeId: id })
  },

  setDraggedItemId: (id) => {
    set({ draggedItemId: id })
  },
}))
