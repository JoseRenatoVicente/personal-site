import React from 'react'
import Link from 'next/link'
import { NavItem } from '@lib/ghost'

interface NavigationProps {
  data?: NavItem[]
  navClass?: string
}

const Navigation = ({ data, navClass }: NavigationProps) => {
  const renderLinks = () =>
    data?.map((navItem, i) => {
      const isExternal = navItem.url.match(/^[\s]?http(s?)/gi)
      const className = navItem.label === 'Newsletter' ? 'btn btn-primary btn-sm' : navClass || 'text-muted-foreground hover:text-foreground transition-colors'
      return isExternal ? (
          <Link key={i} href={navItem.url} className={className} target="_blank" rel="noopener noreferrer">
            {navItem.label}
          </Link>
        ) : (
          <Link key={i} href={navItem.url} className={className}>
            {navItem.label}
          </Link>
        );
    })

  return <nav className="hidden md:flex md:items-center md:space-x-6">{renderLinks()}</nav>
}

export default Navigation
