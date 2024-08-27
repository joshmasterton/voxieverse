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
  const themeColorTag = document.getElementById('metaThemeColor');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    themeColorTag?.setAttribute(
      'content',
      theme === 'dark' ? 'rgb(18, 18, 20)' : 'rgb(247, 247, 250)'
    );
  }, [theme]);

  const changeTheme = (e: MouseEvent<HTMLButtonElement>) => {
    e?.currentTarget.blur();

    const newTheme = theme === 'dark' ? 'light' : 'dark';

    localStorage.setItem('voxieverse_theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <Theme.Provider value={{ theme, changeTheme }}>{children}</Theme.Provider>
  );
};
