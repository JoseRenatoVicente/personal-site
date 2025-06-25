import { notFound } from 'next/navigation'
import { Post } from '@components/Post'
import { Page } from '@components/Page'
import {
  getPostBySlug,
  getPageBySlug,
  getAllPosts,
  getAllPages,
  getAllSettings,
  getAllPostSlugs,
  getPostsByTag,
  getTagBySlug,
  GhostPostOrPage,
  GhostPostsOrPages,
} from '@lib/ghost'
import { collections } from '@lib/collections'
import { seoImage } from '@components/meta/seoImage'
import { processEnv } from '@lib/processEnv'
import { BodyClass } from '@components/helpers/BodyClass'
import { getSeoMetadata } from '@components/meta/seo'

export const metadata = async () => {
  const settings = await getAllSettings()
  return getSeoMetadata({
    title: settings.title,
    description: settings.meta_description ?? undefined,
    settings,
    seoImage: await seoImage({ siteUrl: settings.processEnv.siteUrl }),
  })
}

function isValidSlug(slug: string) {
  return /^[a-zA-Z0-9-_]+$/.test(slug)
}

async function getPreviewPosts(post: GhostPostOrPage) {
  const tagSlug = post.primary_tag?.slug
  if (!tagSlug) return emptyPreviewPosts()
  return (await getPostsByTag(tagSlug, 3, post.id)) || emptyPreviewPosts()
}

function emptyPreviewPosts(): GhostPostsOrPages {
  return Object.assign([], {
    meta: {
      pagination: {
        page: 1,
        limit: 3,
        pages: 1,
        total: 0,
        next: null,
        prev: null,
      },
    },
  })
}

async function getPrevNextPosts(slug: string) {
  const postSlugs = await getAllPostSlugs()
  const index = postSlugs.indexOf(slug)
  const prevSlug = index > 0 ? postSlugs[index - 1] : null
  const nextSlug = index < postSlugs.length - 1 ? postSlugs[index + 1] : null
  const [prevPost, nextPost] = await Promise.all([
    prevSlug ? getPostBySlug(prevSlug) : undefined,
    nextSlug ? getPostBySlug(nextSlug) : undefined,
  ])
  return { prevPost, nextPost }
}

export default async function PostOrPage({ params }: { params?: Promise<{ slug: string[] }> }) {
  const resolvedParams = params ? await params : undefined
  const slug = resolvedParams?.slug?.at(-1)
  if (!slug || !isValidSlug(slug)) return notFound()

  const settings = await getAllSettings()
  let post = await getPostBySlug(slug)
  let page: GhostPostOrPage | null = null

  if (!post) {
    page = await getPageBySlug(slug)
    if (!page) return notFound()
  } else {
    if (post.primary_tag) {
      post.primary_tag = await getTagBySlug(post.primary_tag.slug)
    }
  }

  const isPost = !!post
  const siteUrl = settings.processEnv.siteUrl
  const imageUrl = (post || page)?.feature_image
  const image = await seoImage({ siteUrl, imageUrl })
  const tags = page?.tags
  const bodyClass = BodyClass({ isPost, page: page || undefined, tags })

  if (isPost && post) {
    const previewPosts = await getPreviewPosts(post)
    const { prevPost, nextPost } = await getPrevNextPosts(post.slug)
    return (
      <Post
        cmsData={{
          settings,
          post,
          seoImage: image,
          previewPosts,
          prevPost: prevPost || undefined,
          nextPost: nextPost || undefined,
          bodyClass,
        }}
      />
    )
  }
  if (page) {
    return <Page cmsData={{ settings, page, seoImage: image, bodyClass }} />
  }
  return notFound()
}

export async function generateStaticParams() {
  const { enable, maxNumberOfPosts, maxNumberOfPages } = processEnv.isr
  const limitForPosts = enable ? { limit: maxNumberOfPosts } : undefined
  const limitForPages = enable ? { limit: maxNumberOfPages } : undefined
  const [posts, pages] = await Promise.all([
    getAllPosts(limitForPosts),
    getAllPages(limitForPages),
  ])
  const postRoutes = posts.map((post: GhostPostOrPage) => ({ slug: [post.slug] }))
  const pageRoutes = pages.map((page: GhostPostOrPage) => ({ slug: [page.slug] }))
  return [...postRoutes, ...pageRoutes]
}
