import { lang, StringKeyObjectMap } from '@utils/lang'

const getLang = (locale: string = 'en') => {
  const normalizedLocale = locale.replace(/-/g, '')
  return lang[normalizedLocale] ?? lang.en
}

const get = (text: StringKeyObjectMap) => (name: string, fallback?: string) => {
  if (text[name] === undefined && fallback === null) {
    throw new Error(`Cannot find ${name} in lang file.`)
  }

  if (text[name] === undefined) {
    return fallback || 'UNDEFINED'
  }

  return text[name]
}

export { getLang, get }
