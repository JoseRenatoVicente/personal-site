import { notFound } from 'next/navigation'
import { HeaderTag } from '@components/HeaderTag'
import { Layout } from '@components/Layout'
import { PostView } from '@components/PostView'
import { getSeoMetadata } from '@components/meta/seo'
import { getTagBySlug, getAllTags, getAllSettings, getPostsByTag } from '@lib/ghost'
import { BodyClass } from '@components/helpers/BodyClass'
import { Locale } from '@appConfig'
import { getTranslation } from '@lib/i18n/getTranslation'

export const revalidate = 60

interface TagPageProps {
  params?: Promise<{ slug: string[], locale: Locale }>
}

export async function generateMetadata({ params }: TagPageProps) {
  const resolved = await params
  if (!resolved?.slug) notFound()

  const slug = resolved.slug[resolved.slug.length - 1]
  const tag = await getTagBySlug(slug)
  if (!tag) notFound()

  const settings = await getAllSettings()

  return getSeoMetadata({
    title: tag.name, // título da tag
    description: tag.description ?? undefined, // null => undefined
    settings,
  })
}

export default async function TagPage({ params }: TagPageProps) {
  const locale = (await params)?.locale as Locale;
  const translation = await getTranslation(locale);

  const resolved = await params
  if (!resolved?.slug || !Array.isArray(resolved.slug)) notFound()

  const slug = resolved.slug[resolved.slug.length - 1]
  let tag

  try {
    tag = await getTagBySlug(slug)
  } catch {
    notFound()
  }

  if (!tag) notFound()

  const posts = await getPostsByTag(slug)
  const settings = await getAllSettings()
  const bodyClass = BodyClass({ tags: [tag] })

  return (
    <Layout {...{ translation, settings, bodyClass }} header={<HeaderTag {...{ translation, settings, tag }} />}>
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-6">
            <div className="space-y-12 md:col-span-4">
              <PostView {...{ locale, settings, posts, isHome: true }} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  const { locales } = await import('@appConfig');
  
  const routes: { locale: string; slug: string[] }[] = [];
  
  for (const locale of locales) {
    tags.forEach((tag) => {
      routes.push({
        locale: locale,
        slug: [tag.slug]
      });
    });
  }
  
  return routes;
}
