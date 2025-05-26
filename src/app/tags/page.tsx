import { getAllTags, GhostTags, GhostSettings, getAllSettings } from '@lib/ghost'
import { getSeoMetadata } from '@components/meta/seo'
import { Layout } from '@components/Layout'
import Link from 'next/link'
import { HeaderIndex } from '@components/HeaderIndex'

export const metadata = getSeoMetadata({
  title: 'Tags',
  description: 'Navegue por todas as tags do blog',
  settings: await getAllSettings(),
})

export default async function TagsPage() {
  const settings: GhostSettings = await getAllSettings()
  const tags: GhostTags = await getAllTags()

  return (
    <>
      <Layout settings={settings} bodyClass="tags-page" header={<HeaderIndex settings={settings} />}>
        <section className="section">
          <div className="container">
            <h1 className="text-3xl md:text-5xl font-bold mb-8 text-gradient">Tags</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {tags.map((tag) => (
                <Link key={tag.slug} href={`/tags/${tag.slug}`} className="card p-6 hover:shadow-lg transition-shadow">
                  <h2 className="text-xl font-semibold mb-2">{tag.name}</h2>
                  <p className="text-muted-foreground text-sm">{tag.description}</p>
                  <span className="text-xs text-primary">{tag.count?.posts || 0} posts</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}
