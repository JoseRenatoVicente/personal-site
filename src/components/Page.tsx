/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import Link from 'next/link'

import { readingTime as readingTimeHelper } from '@lib/readingTime'

import { resolveUrl } from '@utils/routing'
import { getLang, get } from '@utils/use-lang'

import { Layout } from '@components/Layout'
import { HeaderPost } from '@components/HeaderPost'
import { RenderContent } from '@components/RenderContent'
import { PostClass } from '@components/helpers/PostClass'
import { GhostPostOrPage, GhostSettings } from '@lib/ghost'
import { ISeoImage } from '@components/meta/seoImage'
import { TranslationKey } from '@lib/i18n/getTranslation'

/**
 * Single page (/:slug)
 *
 * This file renders a single page and loads all the content.
 *
 */

interface PageProps {
  cmsData: {
    translation: TranslationKey
    page: GhostPostOrPage
    settings: GhostSettings
    seoImage: ISeoImage
    bodyClass: string
  }
}

export const Page = ({ cmsData }: PageProps) => {
  const { translation, page, settings, bodyClass } = cmsData
  const { slug, url, meta_description, meta_title, excerpt, title } = page
  const { url: cmsUrl } = settings
  const description = meta_description || excerpt

  const { processEnv } = settings
  const { nextImages, toc, memberSubscriptions, commenting } = processEnv

  const lang = settings.lang
  const text = get(getLang(lang))
  const readingTime = readingTimeHelper(page).replace(`min read`, text(`MIN_READ`))
  const featImg = page.featureImage
  const postClass = PostClass({
    tags: page.tags,
    isFeatured: !!featImg,
    isImage: !!featImg,
  })

  const htmlAst = page.htmlAst
  if (htmlAst === undefined) throw new Error('Post.tsx: htmlAst must be defined.')

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
              <p className="animate-fade-in text-lg text-muted-foreground md:text-xl">{page.custom_excerpt}</p>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-foreground/20 to-transparent"></div>
        </section>

        {featImg &&
          (nextImages.feature && featImg.dimensions ? (
            <figure className="post-full-image" style={{ display: 'inherit' }}>
              <Image
                src={featImg.url}
                alt={title || ''}
                quality={nextImages.quality}
                priority={true}
                loading="eager"
                fetchPriority="high"
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
                <img src={page.feature_image} alt={title} loading="eager" fetchPriority="high" />
              </figure>
            )
          ))}
        <section className="section">
          <div className="container">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <article className="post-content">
                  <RenderContent htmlAst={htmlAst} />
                </article>

                {page.primary_tag && (
                  <div className="mt-12 border-t pt-8">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        className="badge badge-outline transition-colors hover:bg-secondary"
                        href={resolveUrl({
                          cmsUrl,
                          slug: page.primary_tag.slug,
                          url: page.primary_tag.url,
                        })}
                      >
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
