import { Metadata } from 'next'
import { GhostSettings } from '@lib/ghost'
import { Author, PostOrPage, Tag } from '@tryghost/content-api'
import { ISeoImage } from '@components/meta/seoImage'
import { siteTitleMeta, siteDescriptionMeta, siteIcon } from '@components/meta/siteDefaults'

interface SEOProps {
  title?: string
  description?: string
  sameAs?: string
  settings: GhostSettings
  canonical?: string
  seoImage?: ISeoImage
  article?: PostOrPage
}

const getPublicTags = (tags: Tag[] | undefined) => (tags ? tags.filter((tag) => tag.name?.substr(0, 5) !== 'hash-') : [])

export function getSeoMetadata(props: SEOProps): Metadata {
  const { title: t, description: d, seoImage, settings, article, canonical } = props
  const { og_title, og_description, published_at, updated_at, primary_author, primary_tag, twitter_title, twitter_description } = article || {}
  const type = article ? 'article' : 'website'
  const siteUrl = settings.processEnv.siteUrl
  const { twitter, title: settingsTitle, description: settingsDescription, meta_title, meta_description } = settings
  const title = t || meta_title || settingsTitle || siteTitleMeta
  const description = d || meta_description || settingsDescription || siteDescriptionMeta
  const urlCanonical = canonical || siteUrl

  return {
    title,
    description,
    alternates: { canonical: urlCanonical },
    openGraph: {
      type,
      title: og_title || title,
      description: og_description || description,
      url: urlCanonical,
      siteName: title,
      images: seoImage
        ? [
            {
              url: seoImage.url,
              width: seoImage.dimensions.width,
              height: seoImage.dimensions.height,
            },
          ]
        : undefined,
      ...(published_at && { publishedTime: published_at }),
      ...(updated_at && { modifiedTime: updated_at }),
      ...(primary_author && { authors: [primary_author.name] }),
      ...(primary_tag && { tags: [primary_tag.name] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: twitter_title || title,
      description: twitter_description || description,
      site: twitter ? `https://twitter.com/${twitter.replace(/^@/, ``)}/` : undefined,
      creator: twitter,
      images: seoImage ? [seoImage.url] : undefined,
      ...(primary_author && {
        label1: 'Written by',
        data1: primary_author.name,
      }),
      ...(primary_tag && { label2: 'Filed under', data2: primary_tag.name }),
    },
  }
}

export const authorSameAs = (author: Author) => {
  const { website, twitter, facebook } = author

  const authorProfiles = [website, twitter && `https://twitter.com/${twitter.replace(/^@/, ``)}/`, facebook && `https://www.facebook.com/${facebook.replace(/^\//, ``)}/`].filter(
    (element) => !!element,
  )

  return (authorProfiles.length > 0 && `["${authorProfiles.join(`", "`)}"]`) || undefined
}

const getJsonLd = ({ title, description, canonical, seoImage, settings, sameAs, article }: SEOProps) => {
  const siteUrl = settings.processEnv.siteUrl
  // Corrige pubLogoUrl para usar URL nativa
  const pubLogoUrl = settings.logo || new URL(siteIcon, siteUrl).toString()
  const type = article ? 'Article' : 'WebSite'

  return {
    '@context': `https://schema.org/`,
    '@type': type,
    sameAs,
    url: canonical,
    ...(article && { ...getArticleJsonLd(article) }),
    image: {
      ...(seoImage && {
        '@type': `ImageObject`,
        url: seoImage.url,
        ...seoImage.dimensions,
      }),
    },
    publisher: {
      '@type': `Organization`,
      name: title,
      logo: {
        '@type': `ImageObject`,
        url: pubLogoUrl,
        width: 60,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': `WebPage`,
      '@id': siteUrl,
    },
    description,
  }
}

const getArticleJsonLd = (article: PostOrPage) => {
  const { published_at, updated_at, primary_author, tags, meta_title, title } = article
  const name = primary_author?.name
  const image = primary_author?.profile_image
  const sameAs = (primary_author && authorSameAs(primary_author)) || undefined
  const publicTags = getPublicTags(tags)
  const keywords = publicTags?.length ? publicTags.join(`, `) : undefined
  const headline = meta_title || title

  return {
    datePublished: published_at,
    dateModified: updated_at,
    author: {
      '@type': 'Article',
      name,
      image,
      sameAs,
    },
    keywords,
    headline,
  }
}
