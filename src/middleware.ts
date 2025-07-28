import { NextRequest, NextResponse } from 'next/server';
import { locales, Locale } from '@appConfig';
import { getMatchingLocale } from '@lib/i18n/getMatchingLocale';

export default function middleware(request: NextRequest) {
  const localeNotFound: boolean = locales.every(
    (locale: Locale) =>
      !request.nextUrl.pathname.startsWith(`/${locale}/`) &&
      request.nextUrl.pathname !== `/${locale}`
  );

  if (localeNotFound) {
    const newLocale: Locale = getMatchingLocale(request.headers);
    return NextResponse.redirect(
      new URL(`/${newLocale}/${request.nextUrl.pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|_vercel|.*\\..*).*)'],
}