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
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full">
              <h3 className="text-xl font-bold mb-2">
                <a
                  href={`/${post.slug}`}
                  className="hover:text-accent transition-colors"
                >
                  {post.title}
                </a>
              </h3>
              <time
                className="text-sm text-muted-foreground mb-2 block"
                dateTime={post.published_at || ''}
              >
                {dayjs(post.published_at || '').format('D MMM YYYY')}&nbsp;
              </time>
              <p className="text-muted-foreground mb-3">{post.excerpt}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags?.map((tag) => (
                  <a
                    key={tag.id || tag.slug}
                    href={`/tags/${tag.slug}`}
                    className="badge badge-outline text-xs hover:bg-secondary transition-colors"
                  >
                    {tag.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </article>
      ))}
    </>
  );
}