import type { DataType } from '../../types'

interface TypeBadgeProps {
  type: DataType
  className?: string
}

const TYPE_STYLES: Record<DataType, { bg: string; text: string; label: string }> = {
  string: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'str' },
  number: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'num' },
  boolean: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'bool' },
  array: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'arr' },
  object: { bg: 'bg-orange-500/20', text: 'text-orange-400', label: 'obj' },
  null: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', label: 'null' },
  mixed: { bg: 'bg-pink-500/20', text: 'text-pink-400', label: 'mix' },
}

export default function TypeBadge({ type, className = '' }: TypeBadgeProps) {
  const styles = TYPE_STYLES[type]

  return (
    <span
      className={`
        px-1.5 py-0.5 rounded text-[10px] font-medium font-mono uppercase
        ${styles.bg} ${styles.text} ${className}
      `}
      title={type}
    >
      {styles.label}
    </span>
  )
}
