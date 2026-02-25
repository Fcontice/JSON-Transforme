import { DndContext } from '@dnd-kit/core'
import Header from './components/layout/Header'
import ResizablePanels from './components/layout/ResizablePanels'
import InputPanel from './components/input/InputPanel'
import SourceKeysPanel from './components/source-keys/SourceKeysPanel'
import TargetPanel from './components/target-builder/TargetPanel'
import PreviewPanel from './components/preview/PreviewPanel'
import ExportModal from './components/modals/ExportModal'
import ImportModal from './components/modals/ImportModal'
import { useDragAndDrop } from './hooks/useDragAndDrop'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

export default function App() {
  const { sensors, handleDragStart, handleDragEnd, handleDragOver } = useDragAndDrop()

  // Register keyboard shortcuts
  useKeyboardShortcuts()

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex flex-col h-screen bg-zinc-925">
        <Header />
        <ResizablePanels
          leftPanel={
            <div className="flex flex-col h-full">
              <InputPanel />
              <SourceKeysPanel />
            </div>
          }
          centerPanel={<TargetPanel />}
          rightPanel={<PreviewPanel />}
        />
      </div>

      {/* Modals */}
      <ExportModal />
      <ImportModal />
    </DndContext>
  )
}
