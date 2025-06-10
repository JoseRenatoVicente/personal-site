import Navigation from '@components/Navigation'
import { getLang, get } from '@utils/use-lang'
import { GhostSettings, NavItem, NextImage } from '@lib/ghost'

export interface SiteNavProps {
  settings: GhostSettings
  className: string
  postTitle?: string
}

export const SiteNav = ({ settings, className, postTitle }: SiteNavProps) => {
  const text = get(getLang(settings.lang))
  const { processEnv } = settings
  const { customNavigation, nextImages, memberSubscriptions } = processEnv
  const config: {
    overwriteNavigation: NavItem[]
    addNavigation: NavItem[]
  } = {
    overwriteNavigation: customNavigation || [],
    addNavigation: customNavigation || [],
  }
  const site = settings
  const siteUrl = settings.processEnv.siteUrl
  const secondaryNav = site.secondary_navigation && site.secondary_navigation.length > 0

  const navigation = site.navigation

  // overwrite navigation if specified in options
  const labels = navigation?.map((item) => item.label)
  if (labels && labels.length > 0 && config.overwriteNavigation && config.overwriteNavigation.length > 0) {
    config.overwriteNavigation.map((item) => {
      const index = (item.label && labels.indexOf(item.label)) || -1
      if (index > -1 && navigation && navigation[index]) {
        navigation[index].url = item.url
      }
    })
  }

  // add navigation if specified in options
  const urls = navigation?.map((item) => item.url)
  if (config.addNavigation && config.addNavigation.length > 0) {
    config.addNavigation.map((item) => urls?.indexOf(item.url) === -1 && navigation?.push(item))
  }

  return (
    <nav className={className}>
      {/* Checkbox hack para menu mobile */}
      <input id="mobile-menu-toggle" type="checkbox" className="peer sr-only" />
      <label htmlFor="mobile-menu-toggle" className="relative z-40 block cursor-pointer size-8 md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="block peer-checked:hidden"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="hidden peer-checked:block"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </label>
      {/* Mobile menu usando peer-checked */}
      <div className="absolute right-0 top-full z-40 mt-2 w-48 origin-top-right rounded-md border bg-background shadow-lg animate-fade-in hidden peer-checked:block md:hidden">
        <div className="py-2 space-y-1">
          <Navigation data={navigation} navClass="block px-4 py-2 text-sm hover:bg-muted" />
        </div>
      </div>
      <div className="md:flex md:items-center md:space-x-6 hidden">
        <Navigation data={navigation} navClass="flex md:items-center md:space-x-6" />
      </div>
    </nav>
  )
}
