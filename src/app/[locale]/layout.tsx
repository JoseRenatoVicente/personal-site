import { locales } from '@/appConfig'
import { processEnv } from '@lib/processEnv'
import React from 'react'

import '@styles/globals.css'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
 
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  return (
    <html lang={(await params).locale}>
      <head>
        {locales.map((lang) => (
          <link
            key={lang}
            rel="alternate"
            hrefLang={lang}
            href={`https://${processEnv.siteUrl}/locale/${lang}`}
          />
        ))}
      </head>
      <body>{children}</body>
    </html>
  )
}