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
      <Navigation data={navigation} />
      {/* {postTitle && <span className={`nav-post-title ${site.logo ? `` : `dash`}`}>{postTitle}</span>} */}
      {/* <div className="site-nav-right">
        {secondaryNav ? (
          <Navigation data={site.secondary_navigation} />
        ) : (
          <div className="social-links">
            <SocialLinks {...{ siteUrl, site }} />
          </div>
        )}
        <DarkMode {...{ settings }} />
        {memberSubscriptions && <SubscribeButton {...{ lang: settings.lang }} />}
      </div> */}
    </nav>
  )
}
