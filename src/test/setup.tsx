import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { vi } from 'vitest';
import i18n from '../locales';
import '@testing-library/jest-dom';
import { AllTheProviders } from './TestProviders';

// Initialize i18n for tests
i18n.changeLanguage('en');

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Custom render function with all necessary providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Export only the functions we need for tests
export {
  screen,
  waitFor,
  fireEvent,
  within,
  getByText,
  getByRole,
  getByTestId,
  queryByText,
  queryByRole,
  queryByTestId,
  findByText,
  findByRole,
  findByTestId,
} from '@testing-library/react';

// Override render method
export { customRender as render };
