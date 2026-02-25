import type { MappingConfig, TargetNode } from '../types'

export function exportMapping(nodes: TargetNode[]): string {
  return serializeMapping(nodes)
}

export function importMapping(json: string): { nodes: TargetNode[] | null; error: string | null } {
  const nodes = deserializeMapping(json)
  if (!nodes) {
    return { nodes: null, error: 'Invalid mapping file format' }
  }
  return { nodes, error: null }
}

export function serializeMapping(nodes: TargetNode[]): string {
  const config: MappingConfig = {
    version: '1.0',
    created: new Date().toISOString(),
    nodes,
  }

  return JSON.stringify(config, null, 2)
}

export function deserializeMapping(json: string): TargetNode[] | null {
  try {
    const parsed = JSON.parse(json)

    // Validate structure
    if (!parsed || typeof parsed !== 'object') {
      return null
    }

    // Support both full config format and raw nodes array
    if (Array.isArray(parsed)) {
      return validateNodes(parsed) ? parsed : null
    }

    if (parsed.version && Array.isArray(parsed.nodes)) {
      return validateNodes(parsed.nodes) ? parsed.nodes : null
    }

    return null
  } catch {
    return null
  }
}

function validateNodes(nodes: unknown[]): nodes is TargetNode[] {
  return nodes.every(node => {
    if (!node || typeof node !== 'object') return false

    const n = node as Record<string, unknown>

    // Required fields
    if (typeof n.id !== 'string') return false
    if (typeof n.targetKey !== 'string') return false
    if (!['object', 'array', 'field', 'literal'].includes(n.type as string)) return false
    if (!Array.isArray(n.children)) return false

    // Recursively validate children
    return validateNodes(n.children)
  })
}

export function downloadMapping(nodes: TargetNode[], filename: string = 'mapping.jsonmap') {
  const content = serializeMapping(nodes)
  downloadFile(content, filename, 'application/json')
}

export function downloadJson(data: unknown, filename: string = 'output.json', prettify: boolean = true) {
  const content = prettify ? JSON.stringify(data, null, 2) : JSON.stringify(data)
  downloadFile(content, filename, 'application/json')
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

export function readMappingFile(file: File): Promise<TargetNode[] | null> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const content = e.target?.result as string
      const nodes = deserializeMapping(content)
      resolve(nodes)
    }

    reader.onerror = () => {
      resolve(null)
    }

    reader.readAsText(file)
  })
}
