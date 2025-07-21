import { GhostSettings } from '@lib/ghost'
import { HeaderBase } from '@components/HeaderBase'

interface HeaderPageProps {
  settings: GhostSettings
}

export const HeaderPage = ({ settings }: HeaderPageProps) => {
  return <HeaderBase {...settings} />
}
