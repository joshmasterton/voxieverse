import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Auth } from './page/Auth';
import './style/App.scss';
import { ThemeProvider } from './context/Theme';

export const routes = [
  {
    path: '/*',
    element: <Auth />
  },
  {
    path: '/signup',
    element: <Auth isSignup />
  }
];

const router = createBrowserRouter(routes);

export const App = () => {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};
