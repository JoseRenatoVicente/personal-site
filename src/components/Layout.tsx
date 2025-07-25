import { ReactNode } from 'react'
import { DocumentHead } from '@components/DocumentHead'
import { GhostSettings } from '@lib/ghost'
import Footer from '@components/Footer'
import { TranslationKey } from '@lib/i18n/getTranslation'

/**
 * Main layout component
 *
 * The Layout component wraps around each page and template.
 * It also provides the header, footer as well as the main
 * styles, and meta data for each page.
 *
 */

interface LayoutProps {
  translation: TranslationKey
  settings: GhostSettings
  header: ReactNode
  children: ReactNode
  previewPosts?: ReactNode
  bodyClass: string
  errorClass?: string
}

export const Layout = ({ translation, settings, header, children, previewPosts, bodyClass, errorClass }: LayoutProps) => {
  const site = settings
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

        <Footer translation={translation} settings={settings} />
      </div>
    </>
  )
}
