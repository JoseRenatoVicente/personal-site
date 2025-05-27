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

export default async function PostOrPage({ params }: { params?: Promise<{ slug: string[] }> }) {
  const resolvedParams = params ? await params : undefined
  if (!resolvedParams?.slug || !Array.isArray(resolvedParams.slug)) notFound()
  const slug = resolvedParams.slug[resolvedParams.slug.length - 1]
  const settings = await getAllSettings()

  const post = await getPostBySlug(slug)
  let page: GhostPostOrPage | null = null
  const isPost = !!post

  if (!isPost) {
    page = await getPageBySlug(slug)
  } else if (post?.primary_tag) {
    const primaryTag = await getTagBySlug(post.primary_tag.slug)
    post.primary_tag = primaryTag
  }

  if (!post && !page) notFound()

  let previewPosts: GhostPostsOrPages = Object.assign([], {
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
  let prevPost: GhostPostOrPage | undefined
  let nextPost: GhostPostOrPage | undefined

  if (isPost && post?.id && post?.slug) {
    const tagSlug = post?.primary_tag?.slug
    previewPosts =
      (tagSlug && (await getPostsByTag(tagSlug, 3, post?.id))) ||
      Object.assign([], {
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
    const postSlugs = await getAllPostSlugs()
    const index = postSlugs.indexOf(post?.slug)
    const prevSlug = index > 0 ? postSlugs[index - 1] : null
    const nextSlug = index < postSlugs.length - 1 ? postSlugs[index + 1] : null
    prevPost = (prevSlug && (await getPostBySlug(prevSlug))) || undefined
    nextPost = (nextSlug && (await getPostBySlug(nextSlug))) || undefined
  }

  const siteUrl = settings.processEnv.siteUrl
  const imageUrl = (post || page)?.feature_image || undefined
  const image = await seoImage({ siteUrl, imageUrl })
  const tags = (page && page.tags) || undefined
  const bodyClass = BodyClass({ isPost, page: page || undefined, tags })

  if (isPost && post) {
    return (
      <Post
        cmsData={{
          settings,
          post,
          seoImage: image,
          previewPosts,
          prevPost,
          nextPost,
          bodyClass,
        }}
      />
    )
  } else if (page) {
    return <Page cmsData={{ settings, page, seoImage: image, bodyClass }} />
  } else {
    notFound()
  }
}

export async function generateStaticParams() {
  const { enable, maxNumberOfPosts, maxNumberOfPages } = processEnv.isr
  const limitForPosts = (enable && { limit: maxNumberOfPosts }) || undefined
  const limitForPages = (enable && { limit: maxNumberOfPages }) || undefined
  const posts = await getAllPosts(limitForPosts)
  const pages = await getAllPages(limitForPages)
  const settings = await getAllSettings()
  const { url: cmsUrl } = settings
  const postRoutes = posts.map((post: GhostPostOrPage) => {
    const collectionPath = collections.getCollectionByNode(post)
    const { slug, url } = post
    return { slug: [slug] }
  })
  const pageRoutes = pages.map((page: GhostPostOrPage) => ({
    slug: [page.slug],
  }))
  return [...postRoutes, ...pageRoutes]
}
