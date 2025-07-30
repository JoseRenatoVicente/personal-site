import { NextResponse } from 'next/server'
import { getAllPosts, getAllSettings, GhostPostsOrPages } from '@lib/ghost'
import { generateRSSFeed } from '@utils/rss'
import { processEnv } from '@lib/processEnv'

export const revalidate = 60 // revalidate every minute

export async function GET() {
  try {
    // Verificar se o RSS feed está habilitado
    if (!processEnv.rssFeed) {
      return new NextResponse('RSS feed is disabled', { status: 404 })
    }

    // Buscar configurações e posts
    const settings = await getAllSettings()
    const posts = await getAllPosts()
    
    // Gerar o feed RSS
    const rssData = generateRSSFeed({ posts, settings })
    
    // Retornar como resposta XML
    return new NextResponse(rssData, {
      headers: {
        'Content-Type': 'text/xml',
      },
    })
  } catch (error) {
    console.error('Failed to generate RSS feed:', error)
    return new NextResponse('Failed to generate RSS feed', { status: 500 })
  }
}
