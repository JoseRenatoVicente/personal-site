import { NextResponse } from 'next/server'
import { processEnv } from '@lib/processEnv'
import { getAllSettings, getAllPosts } from '@/src/lib/ghost'
import { locales } from '@/appConfig'

interface StaticPage {
    url: string;
    priority: string;
    changefreq: string;
    locale: string;
    slug: string;
    alternateLinks?: string;
}

// Mapeamento fixo para os caminhos de posts em cada idioma
const postsPathByLocale: Record<string, string> = {
    'en': 'posts',
    'es': 'articulos',
    'pt-br': 'artigos'
};

export async function GET() {
    const siteUrl = processEnv.siteUrl
    const currentDate = new Date().toISOString()

    const postPages: StaticPage[] = [];

    // Obter posts para cada idioma
    for (const locale of locales) {
        const postsPath = postsPathByLocale[locale] || 'posts';
        
        // Obtenha todos os posts para este idioma
        const posts = await getAllPosts({ tag: `hash-${locale}` });
        
        // Adicionar cada post ao array de páginas
        for (const post of posts) {
            const url = `${siteUrl}/${locale}/${postsPath}/${post.slug}/`;
            
            postPages.push({
                url,
                priority: '0.7',
                changefreq: 'monthly',
                locale,
                slug: post.slug
            });
        }
    }

    const prepareAlternateLinks = async () => {
        const pagesWithLinks: StaticPage[] = [];
        
        for (const page of postPages) {
            // Para cada post, verificar se existem posts correspondentes em outros idiomas
            const alternateLinks = await Promise.all(locales.map(async loc => {
                if (page.locale === loc) {
                    return `        <xhtml:link rel="alternate" hreflang="${loc}" href="${page.url}" />`;
                }

                const postsPath = postsPathByLocale[loc] || 'posts';
                
                // Verificar se existe um post com o mesmo slug em outro idioma
                const locPosts = await getAllPosts({ tag: `hash-${loc}` });
                const matchingPost = locPosts.find(post => post.slug === page.slug);
                
                if (matchingPost) {
                    const locUrl = `${siteUrl}/${loc}/${postsPath}/${page.slug}/`;
                    return `        <xhtml:link rel="alternate" hreflang="${loc}" href="${locUrl}" />`;
                }
                
                return '';
            }));
            
            pagesWithLinks.push({
                ...page,
                alternateLinks: alternateLinks.filter(link => link !== '').join('\n')
            });
        }
        
        return pagesWithLinks;
    };
    
    const pagesWithLinks = await prepareAlternateLinks();
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${siteUrl}/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
        ${pagesWithLinks.map(page => `  <url>
            <loc>${page.url}</loc>
            <lastmod>${currentDate}</lastmod>
            <changefreq>${page.changefreq}</changefreq>
            <priority>${page.priority}</priority>
                ${page.alternateLinks}
        </url>`).join('\n')}
        </urlset>`

    return new NextResponse(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600'
        }
    })
} 