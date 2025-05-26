import { Layout } from '@components/Layout'
import { HeaderPage } from '@components/HeaderPage'
import { getAllSettings } from '@lib/ghost'
import { getLang, get } from '@utils/use-lang'
import { BodyClass } from '@helpers/BodyClass'
import Link from 'next/link'

export default async function NotFound() {
  let settings
  try {
    settings = await getAllSettings()
  } catch (e) {
    settings = {
      title: 'Página não encontrada',
      lang: 'pt',
      processEnv: {
        siteUrl: '',
        platform: '',
        gaMeasurementId: '',
        darkMode: {
          defaultMode: 'light' as import('../../appConfig').DarkMode,
          overrideOS: false,
        },
        nextImages: {
          feature: false,
          inline: false,
          quality: 75,
          source: false,
        },
        rssFeed: false,
        memberSubscriptions: false,
        commenting: { system: null, commentoUrl: '', disqusShortname: '' },
        prism: { enable: false, ignoreMissing: false },
        contactPage: false,
        toc: { enable: false, maxDepth: 2 },
        customNavigation: [],
        isr: {
          enable: false,
          revalidate: 60,
          maxNumberOfPosts: 10,
          maxNumberOfPages: 10,
        },
      },
      meta_description: '',
      meta: {
        pagination: {
          page: 1,
          limit: 1,
          pages: 1,
          total: 1,
          next: null,
          prev: null,
        },
      },
    }
  }
  const bodyClass = BodyClass({})
  const text = get(getLang(settings.lang))

  return (
    <Layout {...{ settings, bodyClass }} header={<HeaderPage {...{ settings }} />} errorClass="error-content">
      <div className="container py-20">
        <section className="max-w-lg mx-auto text-center">
          <div className="inline-block p-6 bg-muted rounded-full mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">{text(`PAGE_NOT_FOUND`)}</p>

          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <Link href="/" className="btn btn-sm btn-primary w-full">
                {text(`GOTO_FRONT_PAGE`)} →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
