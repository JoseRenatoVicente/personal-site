import { GhostSettings, NextImage } from '@lib/ghost'
import { SiteNav } from '@components/SiteNav'
import Link from 'next/link'
import { getLang, get } from '@utils/use-lang'
import Image from 'next/image'
import { HeaderBase } from './HeaderBase'

interface HeaderPageProps {
  settings: GhostSettings
}

export const HeaderPage = ({ settings }: HeaderPageProps) => {
  return <HeaderBase {...settings} />
}
