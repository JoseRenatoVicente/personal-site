import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import 'dayjs/locale/en'
import 'dayjs/locale/es'


import { GhostPostsOrPages, GhostSettings } from '@lib/ghost'

interface PostViewProps {
  locale: string
  settings: GhostSettings
  posts: GhostPostsOrPages
  isHome?: boolean
}

export const PostView = (props: PostViewProps) => {
  dayjs.locale(props.locale || 'pt-br')
  
  return (
    <>
      {props.posts.map((post, i) => (
        <article className="border-b pb-8 last:border-b-0 last:pb-0" key={post.id || i}>
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="w-full">
              <h3 className="mb-2 text-xl font-bold">
                <a href={`/${props.locale}/${post.slug}`} className="transition-colors hover:text-accent animate-fade-in text-gradient font-bold">
                  {post.title}
                </a>
              </h3>
              <time className="mb-2 block text-sm text-muted-foreground" dateTime={post.published_at || ''}>
                {props.locale === 'en' 
                  ? dayjs(post.published_at || '').format('MMMM D, YYYY')
                  : dayjs(post.published_at || '').format('D [de] MMMM [de] YYYY')}&nbsp;
              </time>
              <p className="mb-3 text-muted-foreground">{post.excerpt}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  tag.visibility === 'public' && (
                  <a key={tag.id || tag.slug} href={`/tags/${tag.slug}`} className="badge badge-outline text-xs transition-colors hover:bg-secondary">
                    {tag.name}
                  </a>
                )))}
              </div>
            </div>
          </div>
        </article>
      ))}
    </>
  )
}
