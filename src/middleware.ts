import { NextRequest, NextResponse } from 'next/server';
import { locales, Locale } from '@appConfig';
import { getMatchingLocale } from '@lib/i18n/getMatchingLocale';

export default function middleware(request: NextRequest) {
  // Internationalization.
  // Loop through available locales in i18n config, set to true when
  // iterated locale is not found in current request url.
  const localeNotFound: boolean = locales.every(
    (locale: Locale) =>
      !request.nextUrl.pathname.startsWith(`/${locale}/`) &&
      request.nextUrl.pathname !== `/${locale}`
  );

  // Locale not found in request url, redirect to matched locale url.
  if (localeNotFound) {
    // Get matching locale for user.
    const newLocale: Locale = getMatchingLocale(request.headers);

    // Return new url redirect and redirect user to correct locale url.
    return NextResponse.redirect(
      new URL(`/${newLocale}/${request.nextUrl.pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|_vercel|.*\\..*).*)'],
}