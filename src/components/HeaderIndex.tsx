import { GhostSettings } from '@lib/ghost'
import { HeaderBase } from '@components/HeaderBase'
import { TranslationKey } from '@lib/i18n/getTranslation'

interface HeaderIndexProps {
  translation: TranslationKey
  settings: GhostSettings
}

export const HeaderIndex = ({ settings, translation }: HeaderIndexProps) => {
  return <HeaderBase settings={settings} translation={translation} />
}
