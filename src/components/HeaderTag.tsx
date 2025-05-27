import { Tag } from '@tryghost/content-api'
import { GhostSettings, NextImage } from '@lib/ghost'
import { SiteNav } from '@components/SiteNav'
import { getLang, get } from '@utils/use-lang'
import Link from 'next/link'
import Image from 'next/image'
import { HeaderBase } from './HeaderBase'

interface HeaderTagProps {
  settings: GhostSettings
  tag: Tag
}

export const HeaderTag = ({ settings, tag }: HeaderTagProps) => {
  const text = get(getLang(settings.lang))
  const numberOfPosts = tag.count?.posts

  return (
    <>
      <HeaderBase {...settings} />

      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent"></div>
        </div>
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="animate-fade-in text-gradient mb-4 text-3xl font-bold md:mb-6 md:text-5xl">Artigos sobre: {tag.name}</h1>
            <p className="animate-fade-in text-lg text-muted-foreground md:text-xl">
              {tag.description ||
                `${text(`A_COLLECTION_OF`)} ${
                  (numberOfPosts && numberOfPosts > 0 && (numberOfPosts === 1 ? `1 ${text(`POST`)}` : `${numberOfPosts} ${text(`POSTS`)}`)) || `${text(`POSTS`)}`
                }`}
            </p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"></div>
      </section>
    </>
  )
}
