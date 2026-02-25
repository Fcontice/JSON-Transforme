/// <reference types="vite/client" />

declare module 'lucide-react' {
  import type { ComponentType, SVGProps } from 'react'

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number
    absoluteStrokeWidth?: boolean
  }

  export type Icon = ComponentType<IconProps>
  export type LucideIcon = Icon

  export const Upload: Icon
  export const FileJson: Icon
  export const X: Icon
  export const ChevronRight: Icon
  export const ChevronDown: Icon
  export const ChevronUp: Icon
  export const GripVertical: Icon
  export const Plus: Icon
  export const Trash2: Icon
  export const Copy: Icon
  export const Check: Icon
  export const Search: Icon
  export const AlertCircle: Icon
  export const Download: Icon
  export const Settings2: Icon
  export const Braces: Icon
  export const List: Icon
  export const Type: Icon
  export const Hash: Icon
  export const ToggleLeft: Icon
  export const Code2: Icon
  export const Layers: Icon
  export const MoreVertical: Icon
  export const Edit2: Icon
  export const Folder: Icon
  export const Database: Icon
  export const Eye: Icon
  export const RotateCcw: Icon
  export const Sparkles: Icon
  export const Key: Icon
  export const Pencil: Icon
  export const ArrowRight: Icon
  export const Wand2: Icon
}
