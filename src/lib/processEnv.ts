import * as appConfig from '@appConfig'
import { NavItem } from '@lib/ghost'

// siteUrl, platform, ghostAPIUrl, ghostAPIKey must be defined here
export const ghostAPIUrl = process.env.CMS_GHOST_API_URL || 'https://cms.gotsby.org'
export const ghostAPIKey = process.env.CMS_GHOST_API_KEY || '387f956eaa95345f7bb484d0b8'

const siteUrl = process.env.SITE_URL || (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) || process.env.URL || 'http://localhost:3000'

const platform = (process.env.NETLIFY === 'true' && 'netlify') || 'vercel'

// Environment variables that can be used to override the defaults in appconfig.js
const resolveBool = (value: string | undefined, defaultValue: boolean) => {
  if (!value) return defaultValue
  if (value === 'true') return true
  return false
}

const resolveNumber = (value: string | undefined, defaultValue: number): number => {
  if (!value) return defaultValue
  return Number.parseInt(value, 10)
}

const resolveDarkMode = (value: string | undefined, defaultValue: appConfig.DarkMode): appConfig.DarkMode => {
  if (!value) return defaultValue
  if (value === 'dark') return 'dark'
  return 'light'
}

function reolveJSON<T>(value: string | undefined, defaultValue: T): T {
  if (!value) return defaultValue
  return JSON.parse(value) as T
}

export interface ProcessEnvProps {
  siteUrl: string
  platform: string
  gaMeasurementId: string
  darkMode: {
    defaultMode: appConfig.DarkMode
    overrideOS: boolean
  }
  nextImages: {
    feature: boolean
    inline: boolean
    quality: number
    source: boolean
  }
  rssFeed: boolean
  memberSubscriptions: boolean
  commenting: {
    system: appConfig.CommentingSystem
    commentoUrl: string
    disqusShortname: string
  }
  prism: {
    enable: boolean
    ignoreMissing: boolean
  }
  contactPage: boolean
  toc: {
    enable: boolean
    maxDepth: number
  }
  customNavigation: NavItem[]
  isr: {
    enable: boolean
    revalidate: number
    maxNumberOfPosts: number
    maxNumberOfPages: number
  }
}

export const processEnv: ProcessEnvProps = {
  siteUrl,
  platform,
  gaMeasurementId: process.env.SOMBRA_GA_MEASUREMENT_ID || appConfig.gaMeasurementId,
  darkMode: {
    defaultMode: resolveDarkMode(process.env.SOMBRA_DARK_MODE_DEFAULT, appConfig.defaultMode),
    overrideOS: resolveBool(process.env.SOMBRA_DARK_MODE_OVERRIDE_OS, appConfig.overrideOS),
  },
  nextImages: {
    feature: resolveBool(process.env.SOMBRA_NEXT_FEATURE_IMAGES, appConfig.nextFeatureImages),
    inline: resolveBool(process.env.SOMBRA_NEXT_INLINE_IMAGES, appConfig.nextInlineImages),
    quality: resolveNumber(process.env.SOMBRA_NEXT_IMAGES_QUALITY, appConfig.imageQuality),
    source: resolveBool(process.env.SOMBRA_NEXT_SOURCE_IMAGES, appConfig.sourceImages),
  },
  rssFeed: resolveBool(process.env.SOMBRA_RSS_FEED, appConfig.rssFeed),
  memberSubscriptions: resolveBool(process.env.SOMBRA_MEMBER_SUBSCRIPTIONS, appConfig.memberSubscriptions),
  commenting: {
    system: (process.env.SOMBRA_COMMENTING_SYSTEM as appConfig.CommentingSystem) || appConfig.commenting,
    commentoUrl: process.env.SOMBRA_COMMENTO_URL || appConfig.commentoUrl,
    disqusShortname: process.env.SOMBRA_DISQUS_SHORTNAME || appConfig.disqusShortname,
  },
  prism: {
    enable: resolveBool(process.env.SOMBRA_PRISM, appConfig.prism),
    ignoreMissing: resolveBool(process.env.SOMBRA_PRISM_IGNORE_MISSING, appConfig.prismIgnoreMissing),
  },
  contactPage: resolveBool(process.env.SOMBRA_CONTACT_PAGE, appConfig.contactPage),
  toc: {
    enable: resolveBool(process.env.SOMBRA_TOC, appConfig.toc),
    maxDepth: resolveNumber(process.env.SOMBRA_TOC_MAX_DEPTH, appConfig.maxDepth),
  },
  customNavigation: reolveJSON(process.env.SOMBRA_CUSTOM_NAVIGATION, appConfig.customNavigation),
  isr: {
    enable: resolveBool(process.env.SOMBRA_NEXT_ISR, appConfig.isr),
    revalidate: resolveNumber(process.env.SOMBRA_NEXT_ISR_REVALIDATE, appConfig.revalidate),
    maxNumberOfPosts: resolveNumber(process.env.SOMBRA_NEXT_ISR_MAX_NUMBER_POSTS, appConfig.maxNumberOfPosts),
    maxNumberOfPages: resolveNumber(process.env.SOMBRA_NEXT_ISR_MAX_NUMBER_PAGES, appConfig.maxNumberOfPages),
  },
}
