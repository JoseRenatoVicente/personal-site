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

    return routes.map((route) => ({
            url: `${host}${route.path}`,
            // alternates: {
            //     languages: Object.fromEntries(
            //         locales.map((altLocale) => [altLocale, `${host}/${altLocale}${route.path === "/" ? "" : route.path}`])
            //     ),
            // },
        }));
}