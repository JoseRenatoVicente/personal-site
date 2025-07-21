import { GhostSettings } from '@lib/ghost'
import { HeaderBase } from '@components/HeaderBase'

interface HeaderIndexProps {
  settings: GhostSettings
}

export const HeaderIndex = ({ settings }: HeaderIndexProps) => {
  return <HeaderBase {...settings} />
}
