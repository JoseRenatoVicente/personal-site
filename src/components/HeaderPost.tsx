import { GhostSettings, NextImage } from '@lib/ghost'
import { SiteNav } from '@components/SiteNav'
import Link from 'next/link'
import Image from 'next/image'
import { getLang, get } from '@utils/use-lang'
import { HeaderBase } from './HeaderBase'

interface HeaderPostProps {
  settings: GhostSettings
  title?: string
}

export const HeaderPost = ({ settings, title }: HeaderPostProps) => {
  return <HeaderBase {...settings} />
}
