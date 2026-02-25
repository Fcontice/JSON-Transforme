import { create } from 'zustand'
import { parseJson } from '../lib/jsonParser'
import { extractKeys } from '../lib/keyExtractor'
import type { JsonValidationError } from '../types'
import { useSourceKeysStore } from './sourceKeysStore'

interface InputState {
  rawJson: string
  parsedData: unknown | null
  isArray: boolean
  recordCount: number
  error: JsonValidationError | null
  isValid: boolean
  fileName: string | null

  setRawJson: (json: string) => void
  setFromFile: (json: string, fileName: string) => void
  clear: () => void
}

export const useInputStore = create<InputState>((set) => ({
  rawJson: '',
  parsedData: null,
  isArray: false,
  recordCount: 0,
  error: null,
  isValid: false,
  fileName: null,

  setRawJson: (json: string) => {
    const result = parseJson(json)

    if (result.success) {
      const keys = extractKeys(result.data)
      useSourceKeysStore.getState().setKeys(keys)

      set({
        rawJson: json,
        parsedData: result.data,
        isArray: result.isArray,
        recordCount: result.recordCount,
        error: null,
        isValid: true,
      })
    } else {
      useSourceKeysStore.getState().setKeys([])

      set({
        rawJson: json,
        parsedData: null,
        isArray: false,
        recordCount: 0,
        error: result.error,
        isValid: false,
      })
    }
  },

  setFromFile: (json: string, fileName: string) => {
    const result = parseJson(json)

    if (result.success) {
      const keys = extractKeys(result.data)
      useSourceKeysStore.getState().setKeys(keys)

      set({
        rawJson: json,
        parsedData: result.data,
        isArray: result.isArray,
        recordCount: result.recordCount,
        error: null,
        isValid: true,
        fileName,
      })
    } else {
      useSourceKeysStore.getState().setKeys([])

      set({
        rawJson: json,
        parsedData: null,
        isArray: false,
        recordCount: 0,
        error: result.error,
        isValid: false,
        fileName,
      })
    }
  },

  clear: () => {
    useSourceKeysStore.getState().setKeys([])

    set({
      rawJson: '',
      parsedData: null,
      isArray: false,
      recordCount: 0,
      error: null,
      isValid: false,
      fileName: null,
    })
  },
}))
