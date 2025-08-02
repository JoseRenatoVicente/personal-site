import { locales } from '@/appConfig'
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
  const locale = (await params).locale;

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}