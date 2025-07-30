import { locales } from '@appConfig';
import { MetadataRoute } from 'next'
import { processEnv } from '@lib/processEnv';

const host = processEnv.siteUrl || "http://localhost:3000";

export const revalidate = 60

export default function sitemap(): MetadataRoute.Sitemap {

    const routes = locales.map(locale => ({ 
        path: `/${locale}/sitemap.xml`, 
        priority: 0.8 
    }));

    return routes.map((route) => {
        // Extrai o locale do path (ex: /en/sitemap.xml -> en)
        const currentLocale = route.path.split('/')[1];
        
        return {
            url: `${host}${route.path}`,
            alternates: {
                languages: Object.fromEntries(
                    // Filtra o locale atual para não incluir na lista de alternativas
                    locales
                        .filter(altLocale => altLocale !== currentLocale)
                        .map((altLocale) => [altLocale, `${host}/${altLocale}/sitemap.xml`])
                ),
            },
        };
    });
}