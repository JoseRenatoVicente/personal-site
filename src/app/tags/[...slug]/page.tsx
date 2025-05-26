import { notFound } from 'next/navigation'
import { HeaderTag } from '@components/HeaderTag'
import { Layout } from '@components/Layout'
import { PostView } from '@components/PostView'
import { getSeoMetadata } from '@components/meta/seo'
import { getTagBySlug, getAllTags, getAllSettings, getPostsByTag } from '@lib/ghost'
import { BodyClass } from '@components/helpers/BodyClass'

interface TagPageProps {
  params?: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: TagPageProps) {
  const resolved = await params
  if (!resolved?.slug) notFound()

  const slug = resolved.slug[resolved.slug.length - 1]
  const tag = await getTagBySlug(slug)
  if (!tag) notFound()

  const settings = await getAllSettings()

  return getSeoMetadata({
    title: tag.name,                                 // título da tag
    description: tag.description ?? undefined,       // null => undefined
    settings
  })
}


export default async function TagPage({ params }: TagPageProps) {
  const resolved = await params
  if (!resolved?.slug || !Array.isArray(resolved.slug)) notFound()

  const slug = resolved.slug[resolved.slug.length - 1]
  let tag;

  try {
    tag = await getTagBySlug(slug);
  } catch (e) {
    notFound()
  }

  if (!tag) notFound()

  const posts = await getPostsByTag(slug)
  const settings = await getAllSettings()
  const bodyClass = BodyClass({ tags: [tag] })

  return (
    <Layout {...{ settings, bodyClass }} header={<HeaderTag {...{ settings, tag }} />}>
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-12">
            <div className="md:col-span-4 space-y-12">
              <PostView {...{ settings, posts, isHome: true }} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}


export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map(tag => ({ slug: [tag.slug] }))
}
