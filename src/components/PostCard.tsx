import Link from 'next/link'
import dayjs from 'dayjs'

import { readingTime as readingTimeHelper } from '@lib/readingTime'
import { resolveUrl } from '@utils/routing'
import { getLang, get } from '@utils/use-lang'

import { AuthorList } from '@components/AuthorList'
import { collections } from '@lib/collections'
import { GhostPostOrPage, GhostSettings } from '@lib/ghost'
import { PostClass } from './helpers/PostClass'
import Image from 'next/image'

interface PostCardProps {
  settings: GhostSettings
  post: GhostPostOrPage
  num?: number
  isHome?: boolean
}

export const PostCard = ({ settings, post, num, isHome }: PostCardProps) => {
  const { nextImages } = settings.processEnv
  const text = get(getLang(settings.lang))
  const cmsUrl = settings.url
  const collectionPath = collections.getCollectionByNode(post)
  const url = resolveUrl({
    cmsUrl,
    collectionPath,
    slug: post.slug,
    url: post.url,
  })
  const featImg = typeof post.featureImage === 'string' ? post.featureImage : ''
  const readingTime = readingTimeHelper(post).replace(`min read`, text(`MIN_READ`))
  const postClass = PostClass({
    tags: post.tags,
    isFeatured: post.featured,
    isImage: !!featImg,
  })
  const large = (featImg && isHome && num !== undefined && 0 === num % 6 && `post-card-large`) || ``
  const authors = post?.authors?.filter((_, i) => (i < 2 ? true : false))

  return (
    <article className="card overflow-hidden transition-shadow hover:shadow-md">
      <Link href={url} aria-label={post.title || ''} className="block">
        <div className="aspect-video overflow-hidden bg-muted">
          {featImg ? (
            <Image
              src={featImg}
              alt={post.title || ''}
              sizes="(max-width: 640px) 320px, (max-width: 1000px) 500px, 680px"
              quality={nextImages.quality}
              className="size-full object-cover transition-transform duration-300 hover:scale-105"
              fill
            />
          ) : (
            <Image src="/ghost-icon.png" alt={post.title || ''} width={680} height={382} className="size-full object-cover transition-transform duration-300 hover:scale-105" />
          )}
        </div>
      </Link>
      <div className="p-5">
        <h3 className="mb-2 line-clamp-2 text-lg font-bold">
          <Link href={url} className="transition-colors hover:text-accent">
            {post.title}
          </Link>
        </h3>
        <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <a key={tag.id || tag.slug} href={`/tags/${tag.slug}`} className="badge badge-outline text-xs transition-colors hover:bg-secondary">
              {tag.name}
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}
