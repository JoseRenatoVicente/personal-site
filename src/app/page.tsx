import { getAllPosts, getAllSettings, GhostPostsOrPages, GhostSettings } from '@lib/ghost';
import { seoImage } from '@components/meta/seoImage';
import { getSeoMetadata } from '@components/meta/seo';
import { BodyClass } from '@components/helpers/BodyClass';
import { Layout } from '@components/Layout';
import { PostView } from '@components/PostView';
import { HeaderIndex } from '@components/HeaderIndex';
import { PostCard } from '@components/PostCard';
import { Subscribe } from '@components/Subscribe';
import Link from 'next/link';

export const metadata = async () => {
  const settings = await getAllSettings();
  return getSeoMetadata({
    title: settings.title,
    description: settings.meta_description ?? undefined,
    settings,
    seoImage: await seoImage({ siteUrl: settings.processEnv.siteUrl })
  });
};

export default async function HomePage() {
  const settings: GhostSettings = await getAllSettings();
  const featurePosts: GhostPostsOrPages = await getAllPosts({limit: 6, feature: true});
  const posts: GhostPostsOrPages = await getAllPosts({limit: 6, feature: false});
  const bodyClass = BodyClass({ isHome: true });

  return (
    <Layout settings={settings} bodyClass={bodyClass} header={<HeaderIndex settings={settings} />} isHome>
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-12">
            <div className="md:col-span-4 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Projetos em Destaque</h2>
                  <Link className="btn btn-sm btn-outline" href="/posts">Ver todos</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featurePosts?.map((post, i) => (
                    <PostCard key={post.id} {...{ settings, post, num: i }} />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Artigos Recentes</h2>
                  <Link className="btn btn-sm btn-outline" href="/posts">Ver todos</Link>
                </div>
                <div className="space-y-8">
                  <PostView {...{ settings, posts, isHome: true }} />
                </div>
              </div>
            </div>
            <div className="md:col-span-2 space-y-8">
              <div className="card p-6 space-y-4">
                <h3 className="text-lg font-bold mb-2">Especialidades</h3>
                <ul className="space-y-2">
                  <li className="flex items-start"><svg className="h-5 w-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M14.916 2.404a.75.75 0 01.32 1.012l-5 11a.75.75 0 01-1.342-.004l-3-6.5a.75.75 0 111.364-.63L9.106 11.5l4.798-10.548a.75.75 0 011.012-.32z"></path></svg><span>Arquitetura de Microsserviços</span></li>
                  <li className="flex items-start"><svg className="h-5 w-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M14.916 2.404a.75.75 0 01.32 1.012l-5 11a.75.75 0 01-1.342-.004l-3-6.5a.75.75 0 111.364-.63L9.106 11.5l4.798-10.548a.75.75 0 011.012-.32z"></path></svg><span>DevOps &amp; CI/CD Pipelines</span></li>
                  <li className="flex items-start"><svg className="h-5 w-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M14.916 2.404a.75.75 0 01.32 1.012l-5 11a.75.75 0 01-1.342-.004l-3-6.5a.75.75 0 111.364-.63L9.106 11.5l4.798-10.548a.75.75 0 011.012-.32z"></path></svg><span>Segurança de Aplicações</span></li>
                  <li className="flex items-start"><svg className="h-5 w-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M14.916 2.404a.75.75 0 01.32 1.012l-5 11a.75.75 0 01-1.342-.004l-3-6.5a.75.75 0 111.364-.63L9.106 11.5l4.798-10.548a.75.75 0 011.012-.32z"></path></svg><span>Cloud Native &amp; Kubernetes</span></li>
                  <li className="flex items-start"><svg className="h-5 w-5 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M14.916 2.404a.75.75 0 01.32 1.012l-5 11a.75.75 0 01-1.342-.004l-3-6.5a.75.75 0 111.364-.63L9.106 11.5l4.798-10.548a.75.75 0 011.012-.32z"></path></svg><span>Infraestrutura como Código</span></li>
                </ul>
                <div className="pt-4 border-t"><Link className="btn btn-sm btn-secondary w-full" href="/sobre">Saiba mais</Link></div>
              </div>
              <Subscribe settings={settings} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}