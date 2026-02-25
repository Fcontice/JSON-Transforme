import type { TransformType } from '../types'

export interface TransformOption {
  value: TransformType
  label: string
  description: string
  requiresArg?: boolean
  argLabel?: string
  argPlaceholder?: string
}

export const transformOptions: TransformOption[] = [
  {
    value: 'none',
    label: 'None',
    description: 'Keep original value',
  },
  {
    value: 'toString',
    label: 'To String',
    description: 'Convert value to string',
  },
  {
    value: 'toNumber',
    label: 'To Number',
    description: 'Parse value as number',
  },
  {
    value: 'toBoolean',
    label: 'To Boolean',
    description: 'Convert to true/false',
  },
  {
    value: 'uppercase',
    label: 'Uppercase',
    description: 'Convert string to uppercase',
  },
  {
    value: 'lowercase',
    label: 'Lowercase',
    description: 'Convert string to lowercase',
  },
  {
    value: 'flatten',
    label: 'Flatten',
    description: 'Flatten nested array',
  },
  {
    value: 'default',
    label: 'Default',
    description: 'Use default if null/undefined',
    requiresArg: true,
    argLabel: 'Default value',
    argPlaceholder: 'Enter default value',
  },
]

export function applyTransform(
  value: unknown,
  transform: TransformType,
  arg?: unknown
): unknown {
  switch (transform) {
    case 'none':
      return value

    case 'toString':
      if (value === null || value === undefined) return ''
      if (typeof value === 'object') return JSON.stringify(value)
      return String(value)

    case 'toNumber': {
      if (value === null || value === undefined) return 0
      const num = Number(value)
      return isNaN(num) ? 0 : num
    }

    case 'toBoolean':
      if (value === null || value === undefined) return false
      if (typeof value === 'boolean') return value
      if (typeof value === 'string') {
        const lower = value.toLowerCase()
        return lower === 'true' || lower === '1' || lower === 'yes'
      }
      if (typeof value === 'number') return value !== 0
      return Boolean(value)

    case 'uppercase':
      if (typeof value === 'string') return value.toUpperCase()
      return value

    case 'lowercase':
      if (typeof value === 'string') return value.toLowerCase()
      return value

    case 'flatten':
      if (Array.isArray(value)) {
        return value.flat(Infinity)
      }
      return value

    case 'default':
      if (value === null || value === undefined) {
        return arg
      }
      return value

    default:
      return value
  }
}

export function getTransformLabel(transform: TransformType): string {
  const option = transformOptions.find(o => o.value === transform)
  return option?.label ?? 'Unknown'
}
