import { GhostSettings } from '@lib/ghost'
import { HeaderBase } from '@components/HeaderBase'

interface HeaderPostProps {
  settings: GhostSettings
  title?: string
}

export const HeaderPost = ({ settings, title }: HeaderPostProps) => {
  return <HeaderBase {...settings} />
}
