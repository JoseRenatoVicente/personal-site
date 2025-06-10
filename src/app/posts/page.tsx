import { getAllTags, GhostSettings, getAllSettings, GhostPostsOrPages, getAllPosts, getPostsByTag } from '@lib/ghost'
import { getSeoMetadata } from '@components/meta/seo'
import { Layout } from '@components/Layout'
import Link from 'next/link'
import { HeaderIndex } from '@components/HeaderIndex'
import { Subscribe } from '@components/Subscribe'
import { PostView } from '@components/PostView'

export const dynamic = 'force-static'

export const metadata = getSeoMetadata({
  title: 'Artigos',
  description: 'Navegue por todas as tags do blog',
  settings: await getAllSettings(),
})

export default async function PostsPage({ searchParams }: { searchParams?: Promise<{ tag?: string; q?: string }> }) {
  const settings: GhostSettings = await getAllSettings()
  const tags = await getAllTags()

  let tag = null,
    q = ''
  if (searchParams) {
    const params = await searchParams
    tag = params.tag || null
    q = params.q || ''
  }
  const selectedTag = tag
  const searchQuery = q

  let posts: GhostPostsOrPages
  posts = await (selectedTag ? getPostsByTag(selectedTag) : getAllPosts({ limit: 6 }));

  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    posts = Object.assign(
      posts.filter((post) => (post.title && post.title.toLowerCase().includes(q)) || (post.excerpt && post.excerpt.toLowerCase().includes(q))),
      { meta: posts.meta },
    )
  }

  return (
    <>
      <Layout settings={settings} bodyClass="tags-page" header={<HeaderIndex settings={settings} />}>
        {!selectedTag && (
          <section className="relative overflow-hidden py-16 md:py-24">
            <div className="absolute inset-0 z-0 opacity-10">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent"></div>
            </div>
            <div className="container relative z-10">
              <div className="mx-auto max-w-3xl text-center">
                <h1 className="animate-fade-in text-gradient mb-4 text-3xl font-bold md:mb-6 md:text-5xl">{settings.title}</h1>
                <p className="animate-fade-in text-lg text-muted-foreground md:text-xl">{settings.meta_description}</p>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"></div>
          </section>
        )}
        <section className="section">
          <div className="container">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Artigos Recentes</h2>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/posts" className={`badge text-xs ${selectedTag ? 'badge-outline' : 'badge-primary'}`} prefetch={false}>
                      Todos
                    </Link>
                    {tags.map((tag) => (
                      <Link key={tag.slug} href={`/posts/${tag.slug}`} className={`badge text-xs ${selectedTag === tag.slug ? 'badge-primary' : 'badge-outline'}`} prefetch={false}>
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="mb-8">
                  <form method="GET" action="/posts" className="flex gap-2">
                    <input type="text" name="q" placeholder="Pesquisar artigos..." className="input w-full" defaultValue={searchQuery} />
                    {selectedTag && <input type="hidden" name="tag" value={selectedTag} />}
                    <button type="submit" className="btn btn-primary">
                      Filtrar
                    </button>
                  </form>
                </div>
                <div className="space-y-8">
                  <PostView {...{ settings, posts, isHome: true }} />
                </div>
              </div>
              <div className="space-y-8">
                <Subscribe settings={settings} />
                <div className="card p-6">
                  <h3 className="mb-4 text-lg font-bold">Categorias</h3>
                  <ul className="space-y-2">
                    {tags.map((tag) => (
                      <li key={tag.slug}>
                        <Link href={`/tags/${tag.slug}`} className="flex w-full items-center justify-between text-left transition-colors hover:text-accent">
                          {tag.name}
                          <span className="badge badge-outline text-xs">{tag.count?.posts || 0}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}
