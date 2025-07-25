import React from 'react'
import Link from 'next/link'
import { NavItem } from '@lib/ghost'
import { TranslationKey } from '../lib/i18n/getTranslation'

interface NavigationProps {
  translation: TranslationKey
  data?: NavItem[]
  navClass?: string
}

const Navigation = ({ data, navClass, translation }: NavigationProps) => {
  const renderLinks = () =>
    data?.map((navItem, i) => {
      const isExternal = navItem.url.match(/^[\s]?http(s?)/gi)
      const className = navItem.label === 'Newsletter' ? 'btn btn-primary btn-sm' : 'text-muted-foreground hover:text-foreground transition-colors'
      return isExternal ? (
          <Link key={i} href={`/${translation('navigation.' + navItem.label).toLowerCase()}`} className={className} prefetch={false} target="_blank" rel="noopener noreferrer">
             {translation('navigation.' + navItem.label)}
          </Link>
        ) : (
          <Link key={i} href={`/${translation('navigation.' + navItem.label).toLowerCase()}`} className={className} prefetch={false}>
            {translation('navigation.' + navItem.label)}
          </Link>
        );
    })

  return <nav className={navClass}>{renderLinks()}</nav>
}

export default Navigation
