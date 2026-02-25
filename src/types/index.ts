export type DataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'null'
  | 'mixed'

export interface SourceKey {
  id: string
  path: string
  type: DataType
  occurrences: number
  sample: unknown
  depth: number
  parentPath: string | null
  isArray: boolean
  children: string[]
}

export type TransformType =
  | 'none'
  | 'toString'
  | 'toNumber'
  | 'toBoolean'
  | 'uppercase'
  | 'lowercase'
  | 'flatten'
  | 'default'

export interface TargetNode {
  id: string
  type: 'object' | 'array' | 'field' | 'literal'
  targetKey: string
  sourceKeyPath?: string
  literalValue?: unknown
  transform?: TransformType
  transformArg?: unknown
  children: TargetNode[]
}

export interface MappingConfig {
  version: '1.0'
  created: string
  nodes: TargetNode[]
}

export interface JsonValidationError {
  line: number
  column: number
  message: string
}

export interface ParsedJsonResult {
  success: true
  data: unknown
  isArray: boolean
  recordCount: number
}

export interface ParsedJsonError {
  success: false
  error: JsonValidationError
}

export type ParseResult = ParsedJsonResult | ParsedJsonError

export type ViewMode = 'schema' | 'data'

export type ExportFormat = 'prettified' | 'minified'

export interface DragItem {
  type: 'source-key' | 'target-node'
  id: string
  path?: string
}
