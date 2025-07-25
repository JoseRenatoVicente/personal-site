import { getAllPosts, getAllSettings, GhostPostsOrPages, GhostSettings } from '@lib/ghost'
import { seoImage } from '@components/meta/seoImage'
import { getSeoMetadata } from '@components/meta/seo'
import { BodyClass } from '@components/helpers/BodyClass'
import { Layout } from '@components/Layout'
import { PostView } from '@components/PostView'
import { HeaderIndex } from '@components/HeaderIndex'
import { PostCard } from '@components/PostCard'
import { Subscribe } from '@components/Subscribe'
import Link from 'next/link'

export const revalidate = 60
 
export const metadata = async () => {
  const settings = await getAllSettings()
  return getSeoMetadata({
    title: settings.title,
    description: settings.meta_description ?? undefined,
    settings,
    seoImage: await seoImage({ siteUrl: settings.processEnv.siteUrl }),
  })
}

export default async function HomePage() {
  const settings: GhostSettings = await getAllSettings()
  const featurePosts: GhostPostsOrPages = await getAllPosts({
    limit: 6,
    feature: true,
  })
  const posts: GhostPostsOrPages = await getAllPosts({
    limit: 6,
    feature: false,
  })
  const bodyClass = BodyClass({ isHome: true })

  return (
    <Layout settings={settings} bodyClass={bodyClass} header={<HeaderIndex settings={settings} />} isHome>
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground to-transparent"></div>
        </div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="animate-fade-in text-gradient mb-4 text-3xl font-bold md:mb-6 md:text-5xl">{settings.title}</h1>
            <p className="animate-fade-in text-lg text-muted-foreground md:text-xl">{settings.meta_description}</p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-foreground/20 to-transparent"></div>
      </section>
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-6">
            <div className="space-y-12 md:col-span-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Em Destaque</h2>
                  <Link className="btn btn-sm btn-outline" href="/posts" prefetch={false}>
                    Ver todos
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featurePosts?.map((post, i) => <PostCard key={post.id} {...{ settings, post, num: i }} />)}
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Artigos Recentes</h2>
                  <Link className="btn btn-sm btn-outline" href="/posts" prefetch={false}>
                    Ver todos
                  </Link>
                </div>
                <div className="space-y-8">
                  <PostView {...{ settings, posts, isHome: true }} />
                </div>
              </div>
            </div>
            <div className="space-y-8 md:col-span-2">
              <div className="card space-y-4 p-6">
                <h3 className="mb-2 text-lg font-bold">Especialidades</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg className="mr-2 size-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M14.916 2.404a.75.75 0 01.32 1.012l-5 11a.75.75 0 01-1.342-.004l-3-6.5a.75.75 0 111.364-.63L9.106 11.5l4.798-10.548a.75.75 0 011.012-.32z"></path>
                    </svg>
                    <span>Arquitetura de Microsserviços</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 size-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M14.916 2.404a.75.75 0 01.32 1.012l-5 11a.75.75 0 01-1.342-.004l-3-6.5a.75.75 0 111.364-.63L9.106 11.5l4.798-10.548a.75.75 0 011.012-.32z"></path>
                    </svg>
                    <span>Segurança de Aplicações</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="mr-2 size-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M14.916 2.404a.75.75 0 01.32 1.012l-5 11a.75.75 0 01-1.342-.004l-3-6.5a.75.75 0 111.364-.63L9.106 11.5l4.798-10.548a.75.75 0 011.012-.32z"></path>
                    </svg>
                    <span>Cloud Native &amp; Kubernetes</span>
                  </li>
                </ul>
                <div className="border-t pt-4">
                  <Link className="btn btn-sm btn-secondary w-full" href="/sobre" prefetch={false}>
                    Saiba mais
                  </Link>
                </div>
              </div>
              <Subscribe settings={settings} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
