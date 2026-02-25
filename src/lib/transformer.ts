import type { TargetNode } from '../types'
import { getValueAtPath } from './keyExtractor'
import { applyTransform } from './valueTransforms'

export function transformData(input: unknown, nodes: TargetNode[]): unknown {
  if (nodes.length === 0) {
    return {}
  }

  // If there's a single root node that's an object or array, return its structure
  if (nodes.length === 1) {
    const root = nodes[0]!
    if (root.type === 'object' || root.type === 'array') {
      return { [root.targetKey]: transformNode(input, root) }
    }
  }

  // Multiple root nodes - wrap in object
  const result: Record<string, unknown> = {}

  for (const node of nodes) {
    result[node.targetKey] = transformNode(input, node)
  }

  return result
}

function transformNode(input: unknown, node: TargetNode): unknown {
  switch (node.type) {
    case 'field': {
      let value = node.sourceKeyPath
        ? getValueAtPath(input, node.sourceKeyPath)
        : undefined

      // Apply transform if specified
      if (node.transform && node.transform !== 'none') {
        value = applyTransform(value, node.transform, node.transformArg)
      }

      return value
    }

    case 'literal':
      return node.literalValue

    case 'object': {
      const result: Record<string, unknown> = {}

      for (const child of node.children) {
        result[child.targetKey] = transformNode(input, child)
      }

      return result
    }

    case 'array': {
      // If source key path is set, try to map over array in input
      if (node.sourceKeyPath) {
        const sourceArray = getValueAtPath(input, node.sourceKeyPath)

        if (Array.isArray(sourceArray)) {
          return sourceArray.map(item => {
            // Transform each item with children nodes
            const result: Record<string, unknown> = {}

            for (const child of node.children) {
              result[child.targetKey] = transformNode(item, child)
            }

            return result
          })
        }
      }

      // Otherwise, return children as array elements
      return node.children.map(child => transformNode(input, child))
    }

    default:
      return undefined
  }
}

export function transformAllRecords(input: unknown, nodes: TargetNode[]): unknown {
  if (Array.isArray(input)) {
    return input.map(record => transformData(record, nodes))
  }

  return transformData(input, nodes)
}

export function generateSchema(nodes: TargetNode[]): unknown {
  if (nodes.length === 0) {
    return {}
  }

  const result: Record<string, unknown> = {}

  for (const node of nodes) {
    result[node.targetKey] = generateNodeSchema(node)
  }

  return result
}

function generateNodeSchema(node: TargetNode): unknown {
  switch (node.type) {
    case 'field': {
      // Return placeholder based on expected type
      const typePlaceholder = node.sourceKeyPath
        ? `<${node.sourceKeyPath}>`
        : '<field>'
      return node.transform && node.transform !== 'none'
        ? `${typePlaceholder} | ${node.transform}`
        : typePlaceholder
    }

    case 'literal':
      return node.literalValue

    case 'object': {
      const result: Record<string, unknown> = {}

      for (const child of node.children) {
        result[child.targetKey] = generateNodeSchema(child)
      }

      return result
    }

    case 'array': {
      if (node.children.length === 0) {
        return []
      }

      // Show first child as array item template
      const itemSchema: Record<string, unknown> = {}

      for (const child of node.children) {
        itemSchema[child.targetKey] = generateNodeSchema(child)
      }

      return [itemSchema]
    }

    default:
      return undefined
  }
}
