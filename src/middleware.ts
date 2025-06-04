import type { NextFetchEvent, NextRequest } from 'next/server';
import { detectBot } from '@arcjet/next';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import arcjet from '@/libs/Arcjet';
import { routing } from './libs/i18nRouting';

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/:locale/dashboard(.*)',
]);

const isAuthPage = createRouteMatcher([
  '/sign-in(.*)',
  '/:locale/sign-in(.*)',
  '/sign-up(.*)',
  '/:locale/sign-up(.*)',
]);

const isHomePage = createRouteMatcher(['/', '/:locale/']);

// Improve security with Arcjet
const aj = arcjet.withRule(
  detectBot({
    mode: 'LIVE',
    // Block all bots except the following
    allow: [
      // See https://docs.arcjet.com/bot-protection/identifying-bots
      'CATEGORY:SEARCH_ENGINE', // Allow search engines
      'CATEGORY:PREVIEW', // Allow preview links to show OG images
      'CATEGORY:MONITOR', // Allow uptime monitoring services
    ],
  }),
);

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // Verify the request with Arcjet
  // Use `process.env` instead of Env to reduce bundle size in middleware
  if (process.env.ARCJET_KEY) {
    const decision = await aj.protect(request);

    if (decision.isDenied()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // Clerk keyless mode doesn't work with i18n, this is why we need to run the middleware conditionally
  // Add isHomePage to the condition to ensure clerkMiddleware runs for home page requests.
  if (
    isAuthPage(request) || isProtectedRoute(request) || isHomePage(request)
  ) {
    return clerkMiddleware(async (auth, req) => {
      const { userId } = auth();
      const { pathname } = req.nextUrl;

      // Extract locale from pathname (e.g., /en/dashboard -> en)
      const pathParts = pathname.split('/');
      const possibleLocale = pathParts[1];
      const detectedLocale = routing.locales.includes(possibleLocale as any) ? possibleLocale : '';
      const basePath = detectedLocale ? `/${detectedLocale}` : '';

      // Rule 1: Unauthenticated users
      // If NOT authenticated, AND current page is NOT an auth page, AND current page is NOT the home page
      // THEN redirect to the home page.
      if (!userId && !isAuthPage(req) && !isHomePage(req)) {
        // This redirection should not conflict with isProtectedRoute.
        // If a route is protected, auth.protect() will handle redirection to sign-in.
        // This rule applies to other non-auth, non-home pages when the user is not logged in.
        const homeUrl = new URL(`${basePath}/`, req.url);
        return NextResponse.redirect(homeUrl);
      }

      // Rule 2: Authenticated users
      // If authenticated AND current page IS the home page
      // THEN redirect to the dashboard page.
      if (userId && isHomePage(req)) {
        const dashboardUrl = new URL(`${basePath}/dashboard`, req.url);
        return NextResponse.redirect(dashboardUrl);
      }

      // Existing protected route handling
      if (isProtectedRoute(req)) {
        // Use the basePath calculated above for consistency in forming the signInUrl.
        const signInUrl = new URL(`${basePath}/sign-in`, req.url);
        await auth.protect({
          unauthenticatedUrl: signInUrl.toString(),
        });
      }

      // If none of the above conditions are met, proceed with i18n routing.
      return handleI18nRouting(request);
    })(request, event);
  }

  return handleI18nRouting(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  // matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
