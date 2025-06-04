import type { Metadata } from 'next';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { DemoBadge } from '@/components/DemoBadge';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { routing } from '@/libs/i18nRouting';
import '@/styles/global.css';

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

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <ClerkProvider>
      <html lang={locale} data-theme="cupcake">
        <body>
          <div className="drawer">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
              {/* Navbar */}
              <div className="navbar bg-base-300 w-full">
                <div className="flex-none lg:hidden">
                  <label
                    htmlFor="my-drawer-3"
                    aria-label="open sidebar"
                    className="btn btn-square btn-ghost"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block h-6 w-6 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </label>
                </div>
                <div className="mx-2 flex-1 px-2">Next.js Boilerplate</div>
                <div className="hidden flex-none lg:block">
                  <ul className="menu menu-horizontal">
                    {/* Navbar menu content here */}
                    <li>
                      <a>Navbar Item 1</a>
                    </li>
                    <li>
                      <a>Navbar Item 2</a>
                    </li>
                    <li className="mr-2">
                      <LocaleSwitcher />
                    </li>
                    <SignedOut>
                      <li className="mr-2">
                        <SignInButton />
                      </li>
                      <li>
                        <SignUpButton />
                      </li>
                    </SignedOut>
                    <SignedIn>
                      <li>
                        <UserButton />
                      </li>
                    </SignedIn>
                  </ul>
                </div>
              </div>
              {/* Page content here */}
              <NextIntlClientProvider>
                <PostHogProvider>{props.children}</PostHogProvider>
                <DemoBadge />
              </NextIntlClientProvider>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer-3"
                aria-label="close sidebar"
                className="drawer-overlay"
              />
              <ul className="menu bg-base-200 min-h-full w-80 p-4">
                {/* Sidebar content here */}
                <li>
                  <a>Sidebar Item 1</a>
                </li>
                <li>
                  <a>Sidebar Item 2</a>
                </li>
                <li>
                  <LocaleSwitcher />
                </li>
                <SignedOut>
                  <li>
                    <SignInButton />
                  </li>
                  <li>
                    <SignUpButton />
                  </li>
                </SignedOut>
                <SignedIn>
                  <li>
                    <UserButton />
                  </li>
                </SignedIn>
              </ul>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
