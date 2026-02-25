import type { ParseResult, JsonValidationError } from '../types'

export function parseJson(input: string): ParseResult {
  const trimmed = input.trim()

  if (!trimmed) {
    return {
      success: false,
      error: {
        line: 1,
        column: 1,
        message: 'Empty input',
      },
    }
  }

  try {
    const data = JSON.parse(trimmed)
    const isArray = Array.isArray(data)
    const recordCount = isArray ? data.length : 1

    return {
      success: true,
      data,
      isArray,
      recordCount,
    }
  } catch (err) {
    const error = extractErrorPosition(err, trimmed)
    return {
      success: false,
      error,
    }
  }
}

function extractErrorPosition(err: unknown, input: string): JsonValidationError {
  const message = err instanceof Error ? err.message : 'Invalid JSON'

  // Try to extract position from error message
  // Common formats:
  // - "at position 123"
  // - "at line 5 column 10"
  // - "Unexpected token } in JSON at position 456"

  const positionMatch = message.match(/position\s+(\d+)/i)
  const lineColMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i)

  if (lineColMatch) {
    return {
      line: parseInt(lineColMatch[1]!, 10),
      column: parseInt(lineColMatch[2]!, 10),
      message: cleanErrorMessage(message),
    }
  }

  if (positionMatch) {
    const position = parseInt(positionMatch[1]!, 10)
    const { line, column } = positionToLineColumn(input, position)
    return {
      line,
      column,
      message: cleanErrorMessage(message),
    }
  }

  // Fallback: try to find the first error by re-parsing character by character
  const errorPos = findFirstError(input)
  return {
    line: errorPos.line,
    column: errorPos.column,
    message: cleanErrorMessage(message),
  }
}

function positionToLineColumn(input: string, position: number): { line: number; column: number } {
  let line = 1
  let column = 1

  for (let i = 0; i < position && i < input.length; i++) {
    if (input[i] === '\n') {
      line++
      column = 1
    } else {
      column++
    }
  }

  return { line, column }
}

function findFirstError(input: string): { line: number; column: number } {
  // Simple heuristic: look for common JSON syntax issues
  const lines = input.split('\n')

  let bracketStack: string[] = []
  let inString = false
  let escaped = false

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx]!

    for (let colIdx = 0; colIdx < line.length; colIdx++) {
      const char = line[colIdx]!

      if (escaped) {
        escaped = false
        continue
      }

      if (char === '\\' && inString) {
        escaped = true
        continue
      }

      if (char === '"') {
        inString = !inString
        continue
      }

      if (inString) continue

      if (char === '{' || char === '[') {
        bracketStack.push(char)
      } else if (char === '}') {
        if (bracketStack.pop() !== '{') {
          return { line: lineIdx + 1, column: colIdx + 1 }
        }
      } else if (char === ']') {
        if (bracketStack.pop() !== '[') {
          return { line: lineIdx + 1, column: colIdx + 1 }
        }
      }
    }
  }

  // If we found unclosed brackets, report at the end
  if (bracketStack.length > 0) {
    return { line: lines.length, column: (lines[lines.length - 1]?.length ?? 0) + 1 }
  }

  return { line: 1, column: 1 }
}

function cleanErrorMessage(message: string): string {
  // Remove position info from message since we're showing it separately
  return message
    .replace(/\s*at position\s+\d+/gi, '')
    .replace(/\s*in JSON\s*/gi, '')
    .trim()
}

export function formatJsonWithHighlight(
  input: string,
  errorLine?: number
): { lines: string[]; errorLine?: number } {
  const lines = input.split('\n')
  return {
    lines,
    errorLine,
  }
}
