import type { MetadataRoute } from 'next'
import { getAllSettings } from '@lib/ghost'
import { defaultLocale } from '@appConfig'

export default async function manifest(): Promise<MetadataRoute.Manifest> {

  const settings = await getAllSettings()

  return {
    name: settings.title,
    short_name: settings.title,
    description: settings.meta_description || 'Renato Vicente personal website',
    start_url: `/${defaultLocale}`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#15171A',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/ghost-icon.png',
        sizes: '512x512',
        type: 'image/png',
      }
    ],
  }
}