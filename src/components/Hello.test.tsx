import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Hello } from './Hello';

// Mock currentUser from @clerk/nextjs/server
vi.mock('@clerk/nextjs/server', () => ({
  currentUser: async () => ({
    primaryEmailAddress: { emailAddress: 'test@example.com' },
  }),
}));

// Mock getTranslations from next-intl/server
vi.mock('next-intl/server', async () => {
  const actual = await vi.importActual('next-intl/server');
  return {
    ...actual,
    getTranslations: async () => {
      const t = (key: string, params?: any) => {
        if (key === 'hello_message') {
          return `Hello, ${params.email}!`;
        }
        return key;
      };
      // @ts-ignore
      t.rich = (key: string, params?: any) => {
        if (key === 'alternative_message') {
          // Simulate the structure that t.rich would provide to the component
          // In this case, it calls the 'url' function passed in params
          if (params && typeof params.url === 'function') {
            return ['Check out our ', params.url(), '.'];
          }
          return 'Check out our Next.js Boilerplate SaaS.';
        }
        return key;
      };
      return t;
    },
  };
});

// Mock Sponsors component
vi.mock('./Sponsors', () => ({
  Sponsors: () => <div>Sponsors Mock</div>,
}));

describe('Hello component', () => {
  it('renders and matches snapshot', async () => {
    // Since Hello is an async component, we need to handle the promise it returns
    const HelloComponent = await Hello();
    const { container } = render(HelloComponent);
    expect(container).toMatchSnapshot();
  });
});
