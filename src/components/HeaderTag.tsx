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

      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground to-transparent"></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 animate-fade-in text-gradient">Artigos sobre: {tag.name}</h1>
            <p className="text-lg md:text-xl text-muted-foreground animate-fade-in">
              {tag.description ||
                `${text(`A_COLLECTION_OF`)} ${
                  (numberOfPosts && numberOfPosts > 0 && (numberOfPosts === 1 ? `1 ${text(`POST`)}` : `${numberOfPosts} ${text(`POSTS`)}`)) || `${text(`POSTS`)}`
                }`}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"></div>
      </section>
    </>
  )
}
