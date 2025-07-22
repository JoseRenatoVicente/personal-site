import '@styles/globals.css'
import React from 'react'

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const locale = (await params).locale
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}