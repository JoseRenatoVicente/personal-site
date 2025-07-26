import { MetadataRoute } from 'next'
import { processEnv } from '@lib/processEnv'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = processEnv.siteUrl

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}