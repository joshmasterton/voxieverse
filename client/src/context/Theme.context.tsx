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
} from '../../types/context/Theme.context.types';

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
    const themeMetaTag = document.getElementById('themeMetaTag');

    if (theme === 'dark') {
      localStorage.setItem('voxieverse_theme', 'light');
      themeMetaTag?.setAttribute('content', 'rgb(247, 247, 250)');
      setTheme('light');
    } else {
      localStorage.setItem('voxieverse_theme', 'dark');
      themeMetaTag?.setAttribute('content', 'rgba(25, 25, 30)');
      setTheme('dark');
    }
  };

  return (
    <Theme.Provider value={{ theme, changeTheme }}>{children}</Theme.Provider>
  );
};
