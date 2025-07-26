import '@styles/globals.css'
import React from 'react'

export async function generateStaticParams() {
  const { locales } = await import('@appConfig')
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
      <body>{children}</body>
    </html>
  )
}