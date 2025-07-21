import { ReactNode } from 'react'
import { DocumentHead } from '@components/DocumentHead'
import { getLang, get } from '@utils/use-lang'
import { GhostSettings } from '@lib/ghost'
import Footer from '@components/Footer'

/**
 * Main layout component
 *
 * The Layout component wraps around each page and template.
 * It also provides the header, footer as well as the main
 * styles, and meta data for each page.
 *
 */

interface LayoutProps {
  settings: GhostSettings
  header: ReactNode
  children: ReactNode
  isHome?: boolean
  previewPosts?: ReactNode
  bodyClass: string
  errorClass?: string
}

export const Layout = ({ settings, header, children, isHome, previewPosts, bodyClass, errorClass }: LayoutProps) => {
  const lang = settings.lang
  const text = get(getLang(lang))
  const site = settings
  const title = text(`SITE_TITLE`, site.title)
  const { siteUrl, memberSubscriptions } = settings.processEnv

  const twitterUrl = site.twitter && `https://twitter.com/${site.twitter.replace(/^@/, ``)}`
  const facebookUrl = site.facebook && `https://www.facebook.com/${site.facebook.replace(/^\//, '')}`

  errorClass = errorClass || ``

  return (
    <>
      <DocumentHead className={bodyClass} />
      <div className="flex min-h-screen flex-col">
        {header}
        <main className={`grow ${errorClass}`}>
          {children}
        </main>
        {previewPosts}

        <Footer {...{ settings }} />
      </div>
    </>
  )
}
