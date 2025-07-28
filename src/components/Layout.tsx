import { ReactNode } from 'react'
import { DocumentHead } from '@components/DocumentHead'
import { GhostSettings } from '@lib/ghost'
import Footer from '@components/Footer'
import { TranslationKey } from '@lib/i18n/getTranslation'

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
