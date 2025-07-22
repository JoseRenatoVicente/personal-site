import { GhostSettings } from '@lib/ghost'
import { HeaderBase } from '@components/HeaderBase'
import { TranslationKey } from '@lib/i18n/getTranslation'

interface HeaderPageProps {
  translation: TranslationKey
  settings: GhostSettings
}

export const HeaderPage = ({ settings, translation }: HeaderPageProps) => {
  return <HeaderBase settings={settings} translation={translation} />
}
