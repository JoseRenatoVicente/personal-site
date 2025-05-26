import Link from 'next/link'
import { ReactNode } from 'react'

import { DocumentHead } from '@components/DocumentHead'
import { StickyNav } from '@components/StickyNav'
import { getLang, get } from '@utils/use-lang'
import { GhostSettings } from '@lib/ghost'

import { resolve } from 'url'
import Footer from './Footer'

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
      <div className="flex flex-col min-h-screen">
        {/* The main header section on top of the screen */}
        {header}
        {/* The main content area */}
        <main className={`flex-grow ${errorClass}`}>
          {/* All the main content gets inserted here, index.js, post.js */}
          {children}
        </main>
        {/* Links to Previous/Next posts */}
        {previewPosts}

        {/* O novo Footer migrado do sombra-digital-brilhante */}
        <Footer {...{ settings }} />
      </div>
    </>
  )
}
