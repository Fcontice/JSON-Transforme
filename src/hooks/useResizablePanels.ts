import { useCallback } from 'react'
import { useUiStore } from '../store'

export function useResizablePanels() {
  const { panelSizes, setPanelSizes } = useUiStore()

  const resetPanels = useCallback(() => {
    setPanelSizes({
      left: 25,
      center: 40,
      right: 35,
    })
  }, [setPanelSizes])

  const setLeftPanelSize = useCallback(
    (size: number) => {
      const remaining = 100 - size
      const ratio = panelSizes.center / (panelSizes.center + panelSizes.right)
      setPanelSizes({
        left: size,
        center: remaining * ratio,
        right: remaining * (1 - ratio),
      })
    },
    [panelSizes, setPanelSizes]
  )

  const setRightPanelSize = useCallback(
    (size: number) => {
      const remaining = 100 - size
      const ratio = panelSizes.left / (panelSizes.left + panelSizes.center)
      setPanelSizes({
        left: remaining * ratio,
        center: remaining * (1 - ratio),
        right: size,
      })
    },
    [panelSizes, setPanelSizes]
  )

  return {
    panelSizes,
    resetPanels,
    setLeftPanelSize,
    setRightPanelSize,
  }
}
