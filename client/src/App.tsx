import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Auth } from './page/Auth.page';
import { ThemeProvider } from './context/Theme.context';
import { ForgotPassword } from './page/ForgotPassword.page';
import './style/App.scss';

export const routes = [
  {
    path: '/*',
    element: <Auth />
  },
  {
    path: '/signup',
    element: <Auth isSignup />
  },
  {
    path: '/forgotPassword',
    element: <ForgotPassword />
  },
  {
    path: '/resetPassword',
    element: <ForgotPassword isReset />
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
