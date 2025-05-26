import { DarkMode } from '@appConfig'

interface DocumentHeadProps {
  className: string
}

interface ClassProps {
  className: string
}

interface AddDarkClassProps extends ClassProps {
  dark: DarkMode
}

interface AddActionClassProps extends ClassProps {
  action?: string | string[]
  success?: string | string[]
}

const addDarkClass = ({ className, dark }: AddDarkClassProps): string => `${className} ${dark === `dark` ? dark : ``}`

const addActionClass = ({ className, action = `ssr`, success }: AddActionClassProps): string => {
  if (!success || Array.isArray(action) || Array.isArray(success)) {
    return className
  }
  return `${className} ${action === `subscribe` ? (success === `true` ? ` subscribe-success` : ` subscribe-failure`) : ``}`
}

export const DocumentHead = ({ className }: DocumentHeadProps): null => {
  const cln = className

  /**
   * Not declarative, but allows to get rid of Helmet which
   * 1. saves 5 KB in bundle size
   * 2. allows strict mode in next.config
   *
   */

  return null
}
