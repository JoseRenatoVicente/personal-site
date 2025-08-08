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


export async function GET() {
    const siteUrl = processEnv.siteUrl
    const currentDate = new Date().toISOString()

    const tagPages: StaticPage[] = [];

    for (const locale of locales) {
        const tagsPath = 'tags';
        
        const tags = await getAllTags(locale);
        
        for (const tag of tags) {
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
            const alternateLinks = await Promise.all(locales.map(async loc => {
                if (page.locale === loc) {
                    return `        <xhtml:link rel="alternate" hreflang="${loc}" href="${page.url}" />`;
                }

                const tagsPath = 'tags';
                
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