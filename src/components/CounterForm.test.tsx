import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { CounterForm } from './CounterForm';

// Mock useTranslations from next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    if (key === 'presentation') return 'Current count:';
    if (key === 'label_increment') return 'Increment by:';
    if (key === 'button_increment') return 'Increment';
    return key;
  },
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock useRouter from next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

describe('CounterForm component', () => {
  it('renders and matches snapshot', () => {
    const { container } = render(<CounterForm />);
    expect(container).toMatchSnapshot();
  });
});
