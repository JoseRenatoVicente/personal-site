/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'

import { readingTime as readingTimeHelper } from '@lib/readingTime'

import { resolveUrl } from '@utils/routing'

import { Layout } from '@components/Layout'
import { HeaderPost } from '@components/HeaderPost'
import { AuthorList } from '@components/AuthorList'
import { RenderContent } from '@components/RenderContent'
import { Subscribe } from '@components/Subscribe'

import { PostClass } from '@components/helpers/PostClass'
import { GhostPostOrPage, GhostPostsOrPages, GhostSettings } from '@lib/ghost'
import { collections } from '@lib/collections'

import { ISeoImage } from '@components/meta/seoImage'

import { IToC } from '@lib/toc'
import { TableOfContentsItem } from '@components/toc/TableOfContents'

import React from 'react'
import { TranslationKey } from '@lib/i18n/getTranslation'

interface PostProps {
  cmsData: {
    translation: TranslationKey
    post: GhostPostOrPage
    settings: GhostSettings
    seoImage: ISeoImage
    previewPosts?: GhostPostsOrPages
    prevPost?: GhostPostOrPage
    nextPost?: GhostPostOrPage
    bodyClass: string
  }
}

// Transform IToC[] to TableOfContentsItem[]
const transformToC = (toc: IToC[]): TableOfContentsItem[] =>
  toc.map((item) => ({
    id: item.id,
    text: item.heading || '', // Assuming 'heading' maps to 'text'
    children: item.items ? transformToC(item.items) : undefined,
  }))

export const Post = ({ cmsData }: PostProps) => {
  const { post, settings, seoImage, previewPosts, prevPost, nextPost, bodyClass } = cmsData
  const { slug, url, meta_description, excerpt, title } = post
  const { url: cmsUrl } = settings
  const translation = cmsData.translation;

  const { processEnv } = settings
  const { nextImages, toc, memberSubscriptions, commenting } = processEnv

  const featImg = post.featureImage
  const postClass = PostClass({
    tags: post.tags,
    isFeatured: !!featImg,
    isImage: !!featImg,
  })

  const htmlAst = post.htmlAst
  if (htmlAst === undefined) throw new Error('Post.tsx: htmlAst must be defined.')

  const collectionPath = collections.getCollectionByNode(post)

  return (
    <>
      <Layout {...{ translation, bodyClass, settings }} header={<HeaderPost {...{ translation, settings, title }} />} previewPosts={<></>}>
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground to-transparent"></div>
          </div>
          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="animate-fade-in text-gradient mb-4 text-3xl font-bold md:mb-6 md:text-5xl">{title}</h1>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-foreground/20 to-transparent"></div>
        </section>

        <AuthorList {...{ settings, authors: post.authors, isPost: true }} />

        {featImg &&
          (nextImages.feature && featImg.dimensions ? (
            <figure className="post-full-image" style={{ display: 'inherit' }}>
              <Image
                src={featImg.url}
                alt={title || ''}
                quality={nextImages.quality}
                style={{ objectFit: 'cover' }}
                sizes={`
                              (max-width: 350px) 350px,
                              (max-width: 530px) 530px,
                              (max-width: 710px) 710px,
                              (max-width: 1170px) 1170px,
                              (max-width: 2110px) 2110px, 2000px
                            `}
                {...featImg.dimensions}
              />
            </figure>
          ) : (
            post.feature_image && (
              <figure className="post-full-image">
                <img src={post.feature_image} alt={title} />
              </figure>
            )
          ))}
        {/* 
              <section className="post-full-content">
                {toc.enable && !!post.toc && (
                  <TableOfContents
                    {...{
                      toc: transformToC(post.toc),
                      url: resolveUrl({ cmsUrl, collectionPath, slug, url }),
                      maxDepth: toc.maxDepth,
                      lang,
                    }}
                  />
                )}



              </section> */}

        <section className="section">
          <div className="container">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <article className="prose max-w-none">
                  <RenderContent htmlAst={htmlAst} />
                </article>

                {post.tags && post.tags.length > 0 && (
                  <div className="mt-12 border-t pt-8">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => tag.visibility == 'public' && (
                        <Link key={tag.id} className="badge badge-outline transition-colors hover:bg-secondary" href={`/tags/${tag.slug}`}>
                          {tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* <div className="mt-12 border-t pt-8">
                  <h3 className="mb-6 text-xl font-bold">Comentários</h3>
                  <div className="card p-6">
                    <p className="text-center text-muted-foreground">Os comentários estão desabilitados neste artigo.</p>
                  </div>
                </div> */}
              </div>

              <div className="space-y-8">
                {memberSubscriptions && <Subscribe translation={translation} />}

                <div className="card p-6">
                  <ul className="space-y-4 divide-y">
                    {previewPosts?.map((post, i) => (
                      <li className="pt-4" key={i}>
                        <h3>
                          <Link
                            href={resolveUrl({
                              cmsUrl,
                              collectionPath: collections.getCollectionByNode(post),
                              slug: post.slug,
                              url: post.url,
                            })}
                            className="transition-colors hover:text-accent animate-fade-in text-gradient font-bold"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        <div className="read-next-card-meta">
                          <p>
                            <time className="text-xs text-muted-foreground" dateTime={post.published_at || ''}>
                              {translation.locale === 'en' 
                                                ? dayjs(post.published_at || '').format('MMMM D, YYYY')
                                                : dayjs(post.published_at || '').format('D [de] MMMM [de] YYYY')}
                            </time>{' '}
                            {/* – {readingTimeHelper(post).replace(`min read`, text(`MIN_READ`))} */}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}
