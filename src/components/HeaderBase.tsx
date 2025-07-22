import { GhostSettings } from '@lib/ghost'
import { SiteNav } from '@components/SiteNav'
import { getLang, get } from '@utils/use-lang'
import Link from 'next/link'
import { TranslationKey } from '@lib/i18n/getTranslation'

interface HeaderBaseProps {
  translation: TranslationKey
  settings: GhostSettings
}

export const HeaderBase = ({ settings, translation }: HeaderBaseProps) => {
  const site = settings
  const brandTitle = site.title

  return (
    <header className={`sticky top-0 z-40 w-full bg-background/95 shadow-xs backdrop-blur-sm transition-all duration-200 supports-backdrop-filter:bg-background/60`}>
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href={`/${translation.locale}`} className="text-lg font-bold">
          <span className="text-gradient">&lt;/&gt;</span> {brandTitle}
        </Link>

        <SiteNav {...{ translation, settings }} className="relative z-50" postTitle={brandTitle} />
      </div>
    </header>
  )
}
