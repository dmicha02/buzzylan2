import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RootLayout from './layout';

// Mock ClerkProvider
vi.mock('@clerk/nextjs', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SignInButton: () => <button>Sign In</button>,
  SignUpButton: () => <button>Sign Up</button>,
  SignedIn: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  UserButton: () => <button>User Button</button>,
}));

// Mock next-intl setRequestLocale
vi.mock('next-intl/server', () => ({
  setRequestLocale: vi.fn(),
  getTranslations: async () => (key: string) => key,
}));

// Mock PostHogProvider
vi.mock('@/components/analytics/PostHogProvider', () => ({
  PostHogProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock DemoBadge
vi.mock('@/components/DemoBadge', () => ({
  DemoBadge: () => <div>Demo Badge</div>,
}));

// Mock LocaleSwitcher
vi.mock('@/components/LocaleSwitcher', () => ({
  LocaleSwitcher: () => <div>Locale Switcher</div>,
}));

describe('RootLayout', () => {
  it('renders and matches snapshot', async () => {
    const messages = {
      Dashboard: {
        hello_message: 'Hello, {email}!',
        alternative_message: 'Check out our <url>Next.js Boilerplate SaaS</url>.',
      },
      CounterForm: {
        presentation: 'Current count:',
        label_increment: 'Increment by:',
        button_increment: 'Increment',
      },
      // Add other necessary translations if layout uses them directly
    };

    const params = { locale: 'en' };
    // We need to resolve the promise for params
    const resolvedParams = await Promise.resolve(params);

    const { container } = render(
      <NextIntlClientProvider locale={resolvedParams.locale} messages={messages}>
        <RootLayout params={params}>
          <div>Test Children</div>
        </RootLayout>
      </NextIntlClientProvider>,
    );

    // Wait for any async operations within RootLayout if necessary
    // For example, if RootLayout itself fetches data or has async effects
    // await screen.findByText('Test Children'); // Example assertion to wait for content

    expect(container).toMatchSnapshot();
  });
});
