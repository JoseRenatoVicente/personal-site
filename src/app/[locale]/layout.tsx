import { locales } from '@/appConfig'
import { processEnv } from '@lib/processEnv'
import React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

import '@styles/globals.css'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
 

export const metadata: Metadata = {
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {

  const locale = (await params).locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        {locales.map((lang) => (
          <link
            key={lang}
            rel="alternate"
            hrefLang={lang}
            href={`${processEnv.siteUrl}/${lang}`}
          />
        ))}
      </head>
      <body>{children}</body>
    </html>
  )
}