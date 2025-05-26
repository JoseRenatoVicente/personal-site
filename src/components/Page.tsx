/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'

import { readingTime as readingTimeHelper } from '@lib/readingTime'

import { resolveUrl } from '@utils/routing'
import { getLang, get } from '@utils/use-lang'

import { Layout } from '@components/Layout'
import { HeaderPost } from '@components/HeaderPost'
import { RenderContent } from '@components/RenderContent'
import { PostClass } from '@components/helpers/PostClass'
import { GhostPostOrPage, GhostSettings } from '@lib/ghost'
import { ISeoImage } from '@components/meta/seoImage'

/**
 * Single page (/:slug)
 *
 * This file renders a single page and loads all the content.
 *
 */

interface PageProps {
  cmsData: {
    page: GhostPostOrPage
    settings: GhostSettings
    seoImage: ISeoImage
    bodyClass: string
  }
}

export const Page = ({ cmsData }: PageProps) => {
  const { page, settings, bodyClass } = cmsData
  const { slug, url, meta_description, meta_title, excerpt, title } = page
  const { url: cmsUrl } = settings
  const description = meta_description || excerpt

  const { processEnv } = settings
  const { nextImages, toc, memberSubscriptions, commenting } = processEnv

  const lang = settings.lang
  const text = get(getLang(lang))
  const readingTime = readingTimeHelper(page).replace(`min read`, text(`MIN_READ`))
  const featImg = page.featureImage
  const postClass = PostClass({ tags: page.tags, isFeatured: !!featImg, isImage: !!featImg })

  const htmlAst = page.htmlAst
  if (htmlAst === undefined) throw Error('Post.tsx: htmlAst must be defined.')

  return (
    <>

      <Layout
        {...{ bodyClass, settings }}
        header={<HeaderPost {...{ settings, title }} />}
        previewPosts={<></>}
      >

        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent"></div>
          </div>
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 animate-fade-in text-gradient">
                {title}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground animate-fade-in">{page.custom_excerpt}</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"></div>
        </section>

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
            page.feature_image && (
              <figure className="post-full-image">
                <img src={page.feature_image} alt={title} />
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">

                <article className="post-content">
                  <RenderContent htmlAst={htmlAst} />
                </article>

                {page.primary_tag && (
                  <div className="mt-12 pt-8 border-t">
                    <div className="flex flex-wrap gap-2">
                      <Link className="badge badge-outline hover:bg-secondary transition-colors" href={resolveUrl({ cmsUrl, slug: page.primary_tag.slug, url: page.primary_tag.url })}>
                        {page.primary_tag.name}
                      </Link>
                    </div>
                  </div>
                )}


              </div>


            </div>
          </div>


        </section>

      </Layout>
    </>
  )
}
