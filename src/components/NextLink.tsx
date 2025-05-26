import Link from 'next/link'
import { Node } from 'unist'

import { RenderContent } from '@components/RenderContent'

interface PropertyProps {
  href?: string
}

interface LinkNode extends Node {
  children: Node[]
  properties: PropertyProps
}

export const NextLink = (props: { node: LinkNode }) => {
  const { node } = props
  const href = node && node.properties ? node.properties.href : undefined
  const child = node && node.children && node.children.length > 0 ? node.children[0] : undefined

  return (
    <>
      {!!href && child && (
        <Link href={href}>
          <RenderContent htmlAst={child} />
        </Link>
      )}
    </>
  )
}
