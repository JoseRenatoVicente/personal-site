import Link from 'next/link'
import dayjs from 'dayjs'

import { readingTime as readingTimeHelper } from '@lib/readingTime'
import { resolveUrl } from '@utils/routing'
import { getLang, get } from '@utils/use-lang'

import { AuthorList } from '@components/AuthorList'
import { PostClass } from '@components/helpers/PostClass'
import { collections } from '@lib/collections'
import { GhostPostsOrPages, GhostSettings } from '@lib/ghost'

interface PostViewProps {
  settings: GhostSettings
  posts: GhostPostsOrPages
  isHome?: boolean
}

export const PostView = (props: PostViewProps) => {
  return (
    <>
      {props.posts.map((post, i) => (
        <article className="border-b pb-8 last:border-b-0 last:pb-0" key={post.id || i}>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="w-full">
              <h3 className="mb-2 text-xl font-bold">
                <a href={`/${post.slug}`} className="transition-colors hover:text-accent">
                  {post.title}
                </a>
              </h3>
              <time className="mb-2 block text-sm text-muted-foreground" dateTime={post.published_at || ''}>
                {dayjs(post.published_at || '').format('D MMM YYYY')}&nbsp;
              </time>
              <p className="mb-3 text-muted-foreground">{post.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <a key={tag.id || tag.slug} href={`/tags/${tag.slug}`} className="badge badge-outline text-xs transition-colors hover:bg-secondary">
                    {tag.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </article>
      ))}
    </>
  )
}
