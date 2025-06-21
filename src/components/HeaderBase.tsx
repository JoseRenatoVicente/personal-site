import { GhostSettings } from '@lib/ghost'
import { SiteNav } from '@components/SiteNav'
import { getLang, get } from '@utils/use-lang'
import Link from 'next/link'

export const HeaderBase = (settings: GhostSettings) => {
  const text = get(getLang(settings.lang))
  const site = settings
  const brandTitle = text(`SITE_TITLE`, site.title)

  return (
    <header className={`sticky top-0 z-40 w-full bg-background/95 shadow-xs backdrop-blur-sm transition-all duration-200 supports-backdrop-filter:bg-background/60`}>
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="text-lg font-bold">
          <span className="text-gradient">&lt;/&gt;</span> {brandTitle}
        </Link>

        <SiteNav {...{ settings }} className="relative z-50" postTitle={brandTitle} />
      </div>
    </header>
  )
}
