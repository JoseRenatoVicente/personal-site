import { jsx, jsxs, Fragment } from 'react/jsx-runtime'
import rehypeReact from 'rehype-react'
import { unified } from 'unified'
import { Node } from 'unist'
import { ComponentProps } from 'react';

import { NextLink } from '@components/NextLink'
import { NextImage } from '@components/NextImage'


const options = {
  Fragment,
  jsx,
  jsxs,
  passNode: true,
  components: {
    Link: NextLink,
    Image: NextImage,
    script: (props: ComponentProps<'script'>) => {
      return null;
    },
  },
}

const renderAst = unified().use(rehypeReact, options)

interface RenderContentProps {
  htmlAst: Node | null
}

export const RenderContent = ({ htmlAst }: RenderContentProps) => {
  if (!htmlAst) return null
  return <>{renderAst.stringify(htmlAst)}</>;
}

//<div className="post-content load-external-scripts">{renderAst.stringify(htmlAst)}</div>
