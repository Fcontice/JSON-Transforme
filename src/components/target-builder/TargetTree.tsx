import { useTargetStore } from '../../store'
import TargetNode from './TargetNode'

export default function TargetTree() {
  const { nodes } = useTargetStore()

  return (
    <div className="p-3 space-y-1">
      {nodes.map((node, index) => (
        <TargetNode
          key={node.id}
          node={node}
          depth={0}
          index={index}
          parentId={null}
        />
      ))}
    </div>
  )
}
