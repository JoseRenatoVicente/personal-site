import { GhostSettings } from '@lib/ghost'
import { HeaderBase } from '@components/HeaderBase'
import { TranslationKey } from '@lib/i18n/getTranslation'

interface HeaderPostProps {
  settings: GhostSettings
  translation: TranslationKey
}

export const HeaderPost = ({ settings, translation }: HeaderPostProps) => {
  return <HeaderBase {...{ settings, translation }} />
}
