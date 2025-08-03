import { locales, Locale } from '@/appConfig'
import Link from 'next/link'

interface LanguageSwitcherServerProps {
  currentLocale: string
  pathname: string
}

/**
 * LanguageSwitcherServer - Uma versão sem JavaScript do componente de seleção de idioma
 * Este componente é renderizado totalmente no servidor, sem JavaScript do lado do cliente
 */
export const LanguageSwitcherServer = ({ currentLocale, pathname }: LanguageSwitcherServerProps) => {
  
  // Determinar o caminho atual sem o prefixo de idioma
  const getPathWithoutLocale = () => {
    // Remover o prefixo de idioma do caminho
    const pathParts = pathname.split('/')
    // Se houver um idioma válido na URL, remova-o
    if (locales.includes(pathParts[1] as Locale)) {
      const pathWithoutLocale = pathParts.slice(2).join('/')
      return pathWithoutLocale ? `/${pathWithoutLocale}` : ''
    }
    // Se não houver idioma na URL, retorne o caminho atual
    return pathname
  }

  const getLocaleName = (locale: string) => {
    switch (locale) {
      case 'en':
        return 'English'
      case 'es':
        return 'Español'
      case 'pt':
        return 'Português'
      default:
        return locale
    }
  }

  return (
    <details className="relative group [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/50 transition-colors cursor-pointer list-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent">
        <span className="hidden sm:inline">{getLocaleName(currentLocale)}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 ml-1 transition-transform group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      
      <div className="absolute right-0 mt-2 w-48 bg-background rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 origin-top-right">
        <div className="py-1">
          {locales.map((locale) => (
            <Link
              key={locale}
              href={`/${locale}${getPathWithoutLocale()}`}
              className={`flex items-center px-4 py-2 text-sm hover:bg-accent/50 transition-colors ${
                locale === currentLocale ? 'bg-accent/30 font-medium' : ''
              }`}
              aria-current={locale === currentLocale ? 'page' : undefined}
            >
              {getLocaleName(locale)}
            </Link>
          ))}
        </div>
      </div>
    </details>
  )
}
