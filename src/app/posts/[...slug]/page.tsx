import { getAllTags, GhostSettings, getAllSettings, GhostPostsOrPages, getPostsByTag, getTagBySlug } from '@lib/ghost';
import { getSeoMetadata } from '@components/meta/seo';
import { Layout } from '@components/Layout';
import Link from 'next/link';
import { HeaderIndex } from '@components/HeaderIndex';
import { Subscribe } from '@components/Subscribe';
import { PostView } from '@components/PostView';
import { notFound } from 'next/navigation';

export const dynamic = "force-static";

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map(tag => ({ slug: [tag.slug] }))
}


export async function generateMetadata({ params }: PostsTagPageProps) {
  const resolved = await params
  if (!resolved?.slug) notFound()

  const slug = resolved.slug[resolved.slug.length - 1]
  let tag;

  try {
    tag = await getTagBySlug(slug);
  } catch (e) {
    notFound();
  }
  if (!tag) notFound()

  const settings = await getAllSettings()

  return getSeoMetadata({
    title: tag.name,
    description: tag.description ?? undefined,
    settings
  })
}
interface PostsTagPageProps {
  params?: Promise<{ slug: string[] }>
}

export default async function PostsByTagPage({ params }: PostsTagPageProps) {
  const resolved = await params
  if (!resolved?.slug || !Array.isArray(resolved.slug)) notFound()

  const slug = resolved.slug[resolved.slug.length - 1]
  const tag = await getTagBySlug(slug)
  if (!tag) notFound()
  const settings: GhostSettings = await getAllSettings();
  const tags = await getAllTags();
  const selectedTag = tag.slug;
  const posts: GhostPostsOrPages = await getPostsByTag(selectedTag);

  return (
    <Layout settings={settings} bodyClass="tags-page" header={<HeaderIndex settings={settings} />}>
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 animate-fade-in text-gradient">{settings.title}</h1>
            <p className="text-lg md:text-xl text-muted-foreground animate-fade-in">{settings.meta_description}</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"></div>
      </section>
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Artigos da Tag: {selectedTag}</h2>
                <div className="flex flex-wrap gap-2">
                  <Link href="/posts" className={`badge text-xs badge-outline`} prefetch={false}>Todos</Link>
                  {tags.map(tag => (
                    <Link
                      key={tag.slug}
                      href={`/posts/${tag.slug}`}
                      className={`badge text-xs ${selectedTag === tag.slug ? 'badge-primary' : 'badge-outline'}`}
                      prefetch={false}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="space-y-8">
                <PostView {...{ settings, posts, isHome: true }} />
              </div>
            </div>
            <div className="space-y-8">
              <Subscribe settings={settings} />
              <div className="card p-6">
                <h3 className="text-lg font-bold mb-4">Categorias</h3>
                <ul className="space-y-2">
                  {tags.map((tag) => (
                    <li key={tag.slug}>
                      <Link href={`/tags/${tag.slug}`} className="flex items-center justify-between w-full text-left hover:text-accent transition-colors">
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
  );
}
