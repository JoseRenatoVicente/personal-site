/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import { AvatarIcon } from '@components/icons/AvatarIcon'
import { GhostAuthor, GhostSettings } from '@lib/ghost'
import { LinkedInIcon } from '@icons/LinkedInIcon'
import { TwitterIcon } from '@icons/TwitterIcon'

interface AuthorListProps {
  settings: GhostSettings
  authors?: GhostAuthor[]
  isPost?: boolean
}

export const AuthorList = ({ settings, authors, isPost }: AuthorListProps) => {
  const { nextImages } = settings.processEnv

  if (isPost && authors && authors.length > 0) {
    const author = authors[0]
    const profileImg = author.profileImage
    return (
      <section className="border-b py-6">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="size-10 overflow-hidden rounded-full">
                {profileImg && nextImages.feature ? (
                  <Image
                    src={profileImg.url || ''}
                    alt={author.name || ''}
                    className="size-full object-cover"
                    width={profileImg.dimensions?.width}
                    height={profileImg.dimensions?.height}
                    quality={nextImages.quality}
                  />
                ) : (author.profile_image ? (
                  <img src={author.profile_image} alt={author.name || ''} className="size-full object-cover" />
                ) : (
                  <span className="author-profile-image">
                    <AvatarIcon />
                  </span>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium">{author.name}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <a
                href="https://twitter.com/intent/tweet?text=Como%20projetar%20microsservi%C3%A7os%20que%20realmente%20escalam&amp;url=http%3A%2F%2Flocalhost%3A4173%2Fblog%2Fprojetando-microsservicos-escalaveis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Compartilhar no Twitter"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://www.linkedin.com/sharing/share-offsite/?url=http%3A%2F%2Flocalhost%3A4173%2Fblog%2Fprojetando-microsservicos-escalaveis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Compartilhar no LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <button className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Copiar link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <ul className="author-list">
      {/* {authors?.map((author, i) => {
        const url = resolveUrl({ cmsUrl, slug: author.slug, url: author.url || undefined }) || ''
        const profileImg = author.profileImage

        return (
          <HoverOnAvatar
            key={i}
            activeClass="hovered"
            render={(hover) => (
              <li key={i} ref={hover.anchorRef} className="author-list-item">
                {!isPost && <div className="author-name-tooltip">{author.name}</div>}
                {isPost && (
                  <div className={`author-card ${hover.state.currentClass}`}>
                    <div className="author-profile-image">
                      {profileImg && nextImages.feature ? (
                        <Image
                          className="author-profile-image"
                          src={profileImg.url || ''}
                          alt={author.name || ''}
                          width={profileImg.dimensions?.width}
                          height={profileImg.dimensions?.height}
                          quality={nextImages.quality}
                        />
                      ) : (
                        author.profile_image && <img src={author.profile_image} alt={author.name || ''} />
                      )}
                    </div>
                    <div className="author-info">
                      {author.bio ? (
                        <div className="bio">
                          <h2>{author.name}</h2>
                          <p>{author.bio}</p>
                          <p>
                            <Link href={url}>
                              {text(`MORE_POSTS`)}
                            </Link>{' '}
                            {text(`BY`)} {author.name}.
                          </p>
                        </div>
                      ) : (
                        <>
                          <h2>{author.name}</h2>
                          <p>
                            {text(`READ`)}{' '}
                            <Link href={url}>
                              {text(`MORE_POSTS_SM`)}
                            </Link>{' '}
                            {text(`BY_THIS_AUTHOR`)}.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <Link href={url} className={`${(isPost && `author`) || `static`}-avatar`} aria-label={author.name || ''}>
                  {profileImg && nextImages.feature ? (
                    <Image src={profileImg.url || ''} alt={author.name || ''} width={profileImg.dimensions?.width} height={profileImg.dimensions?.height} quality={nextImages.quality} />
                  ) : author.profile_image ? (
                    <img src={author.profile_image} alt={author.name || ''} />
                  ) : (
                    <span className="author-profile-image"><AvatarIcon /></span>
                  )}
                </Link>
              </li>
            )}
          />
        )
      })} */}
    </ul>
  )
}
