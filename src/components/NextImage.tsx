import Image from 'next/image'
import { Node } from 'unist'
import { Dimensions } from '@lib/images'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

interface PropertyProps {
  src: string
  className?: string[]
}

interface ImageNode extends Node {
  imageDimensions: Dimensions
  properties: PropertyProps
}

export const NextImage = (props: { node: ImageNode }) => {
  const { node } = props
  if (!node) return null
  const imageNode = node
  const imageDimensions = imageNode.imageDimensions
  const { src, className: classArray } = imageNode.properties
  const className = classArray?.join(' ')

  return (
    <div className="next-image-wrapper">
      <div {...{ className }}>
        <Zoom>
          <Image src={src} width={imageDimensions.width} height={imageDimensions.height} className={className} alt="" />
        </Zoom>
      </div>
    </div>
  )
}
