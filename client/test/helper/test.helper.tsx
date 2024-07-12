import { ThemeProvider } from '../../src/context/Theme.context';
import { createMemoryRouter } from 'react-router-dom';
import { routes } from '../../src/App';
import { ReactNode } from 'react';
import { UserProvider } from '../../src/context/User.context';

export const createTestRouter = (initalEntry: string) => {
  return createMemoryRouter(routes, { initialEntries: [initalEntry] });
};

export const ContextWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <UserProvider>{children}</UserProvider>
    </ThemeProvider>
  );
};
