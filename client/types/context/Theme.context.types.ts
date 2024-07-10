import { MouseEvent, ReactNode } from 'react';

export type ThemeContext = {
  theme: string;
  changeTheme: (e: MouseEvent<HTMLButtonElement>) => void;
};

export type ThemeProviderProps = {
  children: ReactNode;
};
