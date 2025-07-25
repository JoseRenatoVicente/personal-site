import { Layout } from '@components/Layout'
import { HeaderPage } from '@components/HeaderPage'
import { getAllSettings } from '@lib/ghost'
import { BodyClass } from '@helpers/BodyClass'
import Link from 'next/link'
import { getTranslation } from '@lib/i18n/getTranslation'
import { headers } from 'next/headers'
import { getMatchingLocale } from '@lib/i18n/getMatchingLocale'

export default async function NotFound() {
  const headersList = await headers();
  const locale = getMatchingLocale(headersList)
  const translation = await getTranslation(locale);

  let settings = await getAllSettings()

  const bodyClass = BodyClass({})

  return (
    <Layout {...{ translation, settings, bodyClass }} header={<HeaderPage {...{ settings, translation }} />} errorClass="error-content">
      <div className="container py-20">
        <section className="mx-auto max-w-lg text-center">
          <div className="mb-8 inline-block rounded-full bg-muted p-6">
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
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-8 text-xl text-muted-foreground">{translation(`notfound.pagenotfound`)}</p>

          <div className="space-y-4">
            <div className="flex justify-center space-x-4">
              <Link href={`/${locale}`} className="btn btn-sm btn-primary w-full">
                {translation(`notfound.gotofrontpage`)} →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}