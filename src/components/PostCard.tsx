import Link from 'next/link'
import { resolveUrl } from '@utils/routing'
import { collections } from '@lib/collections'
import { GhostPostOrPage, GhostSettings } from '@lib/ghost'
import Image from 'next/image'

interface PostCardProps {
  settings: GhostSettings
  post: GhostPostOrPage
  num?: number
  isHome?: boolean
}

export const PostCard = ({ settings, post, num, isHome }: PostCardProps) => {
  const { nextImages } = settings.processEnv

  const cmsUrl = settings.url
  const collectionPath = collections.getCollectionByNode(post)
  const url = resolveUrl({
    cmsUrl,
    collectionPath,
    slug: post.slug,
    url: post.url,
  })
  const featImg = typeof post.featureImage === 'string' ? post.featureImage : ''

  return (
    <article className="card overflow-hidden transition-shadow hover:shadow-md">
      <Link href={url} aria-label={post.title || ''} prefetch={false} className="block">
        <div className="aspect-video overflow-hidden bg-muted">
          {featImg ? (
            <Image
              src={featImg}
              alt={post.title || ''}
              sizes="(max-width: 640px) 320px, (max-width: 1000px) 500px, 680px"
              quality={nextImages.quality}
              priority={isHome && num === 0} 
              className="size-full object-cover transition-transform duration-300 hover:scale-105"
              fill
            />
          ) : (
            <Image 
              src={post.featureImage?.url || '/ghost-icon.png'} 
              alt={post.title || ''} 
              width={680} 
              height={382} 
              priority={isHome && num === 0}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBmRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAExAAIAAAAQAAAATgAAAAAAAABgAAAAAQAAAGAAAAABcGFpbnQubmV0IDUuMC4xAP/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIABkAGQMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APn+iiigAooooAKKKKACiiigAooooAKKKKAP/9k="
              className="size-full object-cover transition-transform duration-300 hover:scale-105" />
          )}
        </div>
      </Link>
      <div className="p-5">
        <h3 className="mb-2 line-clamp-2 text-lg font-bold">
          <Link href={url} className="transition-colors hover:text-accent animate-fade-in text-gradient font-bold" prefetch={false}>
            {post.title}
          </Link>
        </h3>
        <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            tag.visibility === 'public' && (
            <a key={tag.id || tag.slug} href={`/tags/${tag.slug}`} className="badge badge-outline text-xs transition-colors hover:bg-secondary">
              {tag.name}
            </a>
          )))}
        </div>
      </div>
    </article>
  )
}
