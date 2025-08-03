import { NextResponse } from 'next/server'
import { processEnv } from '@lib/processEnv'
import { getAllSettings, getAllTags } from '@/src/lib/ghost'
import { locales } from '@/appConfig'

interface StaticPage {
    url: string;
    priority: string;
    changefreq: string;
    locale: string;
    slug: string;
    alternateLinks?: string;
}

// Mapeamento fixo para os caminhos de tags em cada idioma
const tagsPathByLocale: Record<string, string> = {
    'en': 'tags',
    'es': 'etiquetas',
    'pt-br': 'tags'
};

export async function GET() {
    const siteUrl = processEnv.siteUrl
    const currentDate = new Date().toISOString()

    const tagPages: StaticPage[] = [];

    // Obter tags para cada idioma
    for (const locale of locales) {
        const tagsPath = tagsPathByLocale[locale] || 'tags';
        
        // Obtenha todas as tags para este idioma
        const tags = await getAllTags(locale);
        
        // Adicionar cada tag ao array de páginas
        for (const tag of tags) {
            // Ignorar tags internas como 'hash-*'
            if (tag.slug.startsWith('hash-')) continue;
            
            const url = `${siteUrl}/${locale}/${tagsPath}/${tag.slug}/`;
            
            tagPages.push({
                url,
                priority: '0.5',
                changefreq: 'weekly',
                locale,
                slug: tag.slug
            });
        }
    }

    const prepareAlternateLinks = async () => {
        const pagesWithLinks: StaticPage[] = [];
        
        for (const page of tagPages) {
            // Para cada tag, verificar se existem tags correspondentes em outros idiomas
            const alternateLinks = await Promise.all(locales.map(async loc => {
                if (page.locale === loc) {
                    return `        <xhtml:link rel="alternate" hreflang="${loc}" href="${page.url}" />`;
                }

                const tagsPath = tagsPathByLocale[loc] || 'tags';
                
                // Verificar se existe uma tag com o mesmo slug em outro idioma
                const locTags = await getAllTags(loc);
                const matchingTag = locTags.find(tag => tag.slug === page.slug);
                
                if (matchingTag) {
                    const locUrl = `${siteUrl}/${loc}/${tagsPath}/${page.slug}/`;
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