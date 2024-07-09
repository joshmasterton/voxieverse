import {
  createContext,
  MouseEvent,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  ThemeContext,
  ThemeProviderProps
} from '../../types/context/Theme.types';

const Theme = createContext<ThemeContext | undefined>(undefined);

const getTheme = () => {
  const currentTheme = localStorage.getItem('voxieverse_theme');

  if (!currentTheme) {
    localStorage.setItem('voxieverse_theme', 'dark');
    return 'dark';
  }

  return currentTheme;
};

export const useTheme = () => {
  const context = useContext(Theme);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const changeTheme = (e: MouseEvent<HTMLButtonElement>) => {
    e?.currentTarget.blur();
    if (theme === 'dark') {
      localStorage.setItem('voxieverse_theme', 'light');
      setTheme('light');
    } else {
      localStorage.setItem('voxieverse_theme', 'dark');
      setTheme('dark');
    }
  };

  return (
    <Theme.Provider value={{ theme, changeTheme }}>{children}</Theme.Provider>
  );
};
