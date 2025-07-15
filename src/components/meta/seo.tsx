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

const getPublicTags = (tags: Tag[] | undefined) => (tags ? tags.filter((tag) => tag.name?.slice(0, 5) !== 'hash-') : [])

export function getSeoMetadata(props: SEOProps): Metadata {
  const { title: t, description: d, seoImage, settings, article, canonical } = props
  const { og_title, og_description, published_at, updated_at, primary_author, primary_tag, twitter_title, twitter_description } = article || {}
  const type = article ? 'article' : 'website'
  const siteUrl = settings.processEnv.siteUrl
  const { twitter, title: settingsTitle, description: settingsDescription, meta_title, meta_description } = settings
  const title = t || meta_title || settingsTitle || siteTitleMeta
  const description = d || meta_description || settingsDescription || siteDescriptionMeta
  const urlCanonical = canonical || siteUrl
  const robots = 'index, follow'
  const charSet = 'utf-8'
  const keywords = article && article.tags ? getPublicTags(article.tags).map((tag) => tag.name).join(', ') : undefined
  const ogImage = seoImage ? seoImage.url : `${siteUrl}/site-meta.png`
  const ogImageWidth = seoImage ? seoImage.dimensions.width : 1120
  const ogImageHeight = seoImage ? seoImage.dimensions.height : 768
  const ogImageAlt = title
  const ogImageType = 'image/png'
  const ogLocale = settings.locale || 'pt_BR'
  const articleAuthor = primary_author?.name

  return {
    applicationName: settingsTitle,
    title,
    description,
    keywords,
    robots: { index: true, follow: true },
    metadataBase: new URL(siteUrl),
    alternates: { canonical: urlCanonical },
    openGraph: {
      type,
      title: og_title || title,
      description: og_description || description,
      url: urlCanonical,
      siteName: title,
      locale: ogLocale,
      images: [
        {
          url: ogImage,
          width: ogImageWidth,
          height: ogImageHeight,
          alt: ogImageAlt,
          type: ogImageType,
        },
      ],
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
      images: [ogImage],
      ...(primary_author && {
        label1: 'Written by',
        data1: primary_author.name,
      }),
      ...(primary_tag && { label2: 'Filed under', data2: primary_tag.name }),
    },
    other: {
      'charSet': charSet,
      ...(published_at && { 'article:published_time': published_at }),
      ...(article && updated_at && { 'article:modified_time': updated_at }),
      ...(article && articleAuthor && { 'article:author': articleAuthor }),
    },
     appleWebApp: {
    title: "Blog | Minh Vu",
    statusBarStyle: "default",
    capable: true
  },
  // verification: {
  //   google: "YOUR_DATA",
  //   yandex: ["YOUR_DATA"],
  //   other: {
  //     "msvalidate.01": ["YOUR_DATA"],
  //     "facebook-domain-verification": ["YOUR_DATA"]
  //   }
  // },
  // icons: {
  //   icon: [
  //     {
  //       url: "/favicon.ico",
  //       type: "image/x-icon"
  //     },
  //     {
  //       url: "/favicon-16x16.png",
  //       sizes: "16x16",
  //       type: "image/png"
  //     }
  //     // add favicon-32x32.png, favicon-96x96.png, android-chrome-192x192.png
  //   ],
  //   shortcut: [
  //     {
  //       url: "/favicon.ico",
  //       type: "image/x-icon"
  //     }
  //   ],
  //   apple: [
  //     {
  //       url: "/apple-icon-57x57.png",
  //       sizes: "57x57",
  //       type: "image/png"
  //     },
  //     {
  //       url: "/apple-icon-60x60.png",
  //       sizes: "60x60",
  //       type: "image/png"
  //     }
  //     // add apple-icon-72x72.png, apple-icon-76x76.png, apple-icon-114x114.png, apple-icon-120x120.png, apple-icon-144x144.png, apple-icon-152x152.png, apple-icon-180x180.png
  //   ]
  // }
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