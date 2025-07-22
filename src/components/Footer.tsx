import React from 'react'
import Link from 'next/link'
import { GhostSettings } from '@lib/ghost'
import { TranslationKey } from '@lib/i18n/getTranslation'

const Footer = ({ settings, translation }: { settings: GhostSettings, translation: TranslationKey }) => {
  const currentYear = new Date().getFullYear()
  const site = settings
  const brandTitle = site.title
  const navigation = site.navigation

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href={`/${translation.locale}`} className="text-lg font-bold">
              <span className="text-gradient">&lt;/&gt;</span> {brandTitle}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {translation('footer.description')}
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="https://github.com/JoseRenatoVicente" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="GitHub">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/JoseRenatoVicente" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground" aria-label="LinkedIn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider">Menu</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {navigation?.map((navItem, i) => (
                <li key={i}>
                  <Link href={navItem.url} className="text-muted-foreground hover:text-foreground" prefetch={false}>
                    {navItem.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider">Especialidades</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/posts?tag=arquitetura" className="text-muted-foreground hover:text-foreground">
                  Arquitetura Backend
                </Link>
              </li>
              <li>
                <Link href="/posts?tag=devops" className="text-muted-foreground hover:text-foreground">
                  DevOps & CI/CD
                </Link>
              </li>
              <li>
                <Link href="/posts?tag=microservices" className="text-muted-foreground hover:text-foreground">
                  Microsserviços
                </Link>
              </li>
              <li>
                <Link href="/posts?tag=seguranca" className="text-muted-foreground hover:text-foreground">
                  Segurança
                </Link>
              </li>
              <li>
                <Link href="/posts?tag=cloud" className="text-muted-foreground hover:text-foreground">
                  Cloud Native
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-sm text-muted-foreground">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p>
              &copy; {currentYear} {brandTitle}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
