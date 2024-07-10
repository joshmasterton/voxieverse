import { ThemeProvider } from '../../src/context/Theme.context';
import { createMemoryRouter } from 'react-router-dom';
import { routes } from '../../src/App';
import { ReactNode } from 'react';

export const createTestRouter = (initalEntry: string) => {
  return createMemoryRouter(routes, { initialEntries: [initalEntry] });
};

export const ContextWrapper = ({ children }: { children: ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
