import { NextResponse } from 'next/server'
import { processEnv } from '@lib/processEnv'
import { getAllSettings } from '@/src/lib/ghost'
import { locales } from '@/appConfig'
import { getTranslation } from '@/src/lib/i18n/getTranslation'

interface StaticPage {
    url: string;
    priority: string;
    changefreq: string;
    locale: string;
    label?: string;
    alternateLinks?: string;
}

export async function GET() {
    const siteUrl = processEnv.siteUrl
    const currentDate = new Date().toISOString()
    const settings = await getAllSettings()

    const staticPages: StaticPage[] = [];

    for (const locale of locales) {
        const translation = await getTranslation(locale);

        for (const navItem of settings.navigation || []) {
            const itemPath = navItem.label === 'home'
                ? ''
                : translation('navigation.' + navItem.label).toLowerCase();

            const url = `${siteUrl}/${locale}/${itemPath}`;

            let priority = '0.7';
            let changefreq = 'monthly';

            if (navItem.label === 'home') {
                priority = '1.0';
                changefreq = 'daily';
            } else if (navItem.label === 'posts') {
                priority = '0.9';
                changefreq = 'weekly';
            } else if (navItem.label === 'tags') {
                priority = '0.8';
                changefreq = 'weekly';
            }

            staticPages.push({
                url,
                priority,
                changefreq,
                locale,
                label: navItem.label
            });
        }
    }

    const prepareAlternateLinks = async () => {
        const newStaticPages: StaticPage[] = [];
        
        for (const page of staticPages) {
            const alternateLinks = await Promise.all(locales.map(async loc => {
                if (page.locale === loc) {
                    return '';
                }

                const locTranslation = await getTranslation(loc);
                const itemPath = page.label === 'home' 
                    ? '' 
                    : locTranslation('navigation.' + page.label).toLowerCase();
                
                const locUrl = `${siteUrl}/${loc}/${itemPath}`;
                
                return `        <xhtml:link rel="alternate" hreflang="${loc}" href="${locUrl}" />`;
            }));
            
            newStaticPages.push({
                ...page,
                alternateLinks: alternateLinks.join('\n    ')
            });
        }
        
        return newStaticPages;
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