import Image from 'next/image'

import { SiteNav } from '@components/SiteNav'
import { HeaderBackground } from '@components/HeaderBackground'
import { getLang, get } from '@utils/use-lang'
import Link from 'next/link'
import { AvatarIcon } from '@components/icons/AvatarIcon'
import { GhostAuthor, GhostSettings, NextImage } from '@lib/ghost'

interface HeaderAuthorProps {
  settings: GhostSettings
  author: GhostAuthor
}

export const HeaderAuthor = ({ settings, author }: HeaderAuthorProps) => {
  const { nextImages } = settings.processEnv
  const text = get(getLang(settings.lang))
  const twitterUrl = author.twitter ? `https://twitter.com/${author.twitter.replace(/^@/, ``)}` : null
  const facebookUrl = author.facebook ? `https://www.facebook.com/${author.facebook.replace(/^\//, ``)}` : null

  const coverImg = author.cover_image || ''
  const profileImg = author.profileImage

  const numberOfPosts = author.count?.posts

  const site = settings
  const title = text(`SITE_TITLE`, site.title)
  const siteLogo = site.logoImage

  // targetHeight is coming from style .site-nav-logo img
  const targetHeight = 21
  const calcSiteLogoWidth = (image: NextImage, targetHeight: number) => {
    const { width, height } = image.dimensions
    return (targetHeight * width) / height
  }

  return (
    <header className={`sticky top-0 z-40 w-full bg-background/95 shadow-xs backdrop-blur-sm transition-all duration-200 supports-backdrop-filter:bg-background/60`}>
      <div className="container flex h-16 items-center justify-between py-4">
        <Link href="/" className="text-lg font-bold">
          {siteLogo && nextImages.feature ? (
            <div
              style={{
                height: `${targetHeight}px`,
                width: `${calcSiteLogoWidth(siteLogo, targetHeight)}px`,
              }}
            >
              <Image className="site-nav-logo" src={siteLogo.url} alt={title} width={siteLogo.dimensions.width} height={siteLogo.dimensions.height} quality={nextImages.quality} />
            </div>
          ) : (site.logo ? (
            <Image src={site.logo} alt={title} />
          ) : (
            title
          ))}
        </Link>
        <SiteNav {...{ settings }} className="relative z-50" />
      </div>
      <HeaderBackground srcImg={coverImg}>
        <div className="inner">
          <div className="site-header-content author-header">
            {profileImg && nextImages.feature ? (
              <div className="author-profile-image">
                <Image
                  className="author-profile-image"
                  src={profileImg.url}
                  alt={author.name || ''}
                  quality={nextImages.quality}
                  width={profileImg.dimensions.width}
                  height={profileImg.dimensions.height}
                />
              </div>
            ) : (author.profile_image ? (
              <Image className="author-profile-image" src={author.profile_image} alt={author.name || ''} />
            ) : (
              <div className="author-profile-image">
                <AvatarIcon />
              </div>
            ))}
            <div className="author-header-content">
              <h1 className="site-title">{author.name}</h1>
              {author.bio && <h2 className="author-bio">{author.bio}</h2>}
              <div className="author-meta">
                {author.location && <div className="author-location">{author.location}</div>}
                <div className="author-stats">{(numberOfPosts && ` ${numberOfPosts} ${1 < numberOfPosts ? text(`POSTS`) : text(`POST`)}`) || `${text(`NO_POSTS`)}`}</div>
                {author.website && (
                  <span className="author-social-link">
                    <a href={author.website} target="_blank" rel="noopener noreferrer">
                      {text(`WEBSITE`)}
                    </a>
                  </span>
                )}
                {twitterUrl && (
                  <span className="author-social-link">
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                      Twitter
                    </a>
                  </span>
                )}
                {facebookUrl && (
                  <span className="author-social-link">
                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                      Facebook
                    </a>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </HeaderBackground>
    </header>
  )
}
