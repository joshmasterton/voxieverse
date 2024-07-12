import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Auth } from './page/Auth.page';
import { ThemeProvider } from './context/Theme.context';
import { ForgotPassword } from './page/ForgotPassword.page';
import { UserProvider } from './context/User.context';
import { Public } from './comp/Public.comp';
import { Private } from './comp/Private.comp';
import { Nav } from './comp/Nav.comp';
import './style/App.scss';

export const routes = [
  {
    path: '/*',
    element: (
      <Private>
        <Nav />
      </Private>
    )
  },
  {
    path: '/login',
    element: (
      <Public>
        <Auth />
      </Public>
    )
  },
  {
    path: '/signup',
    element: (
      <Public>
        <Auth isSignup />
      </Public>
    )
  },
  {
    path: '/forgotPassword',
    element: (
      <Public>
        <ForgotPassword />
      </Public>
    )
  },
  {
    path: '/resetPassword',
    element: (
      <Public>
        <ForgotPassword isReset />
      </Public>
    )
  }
];

const router = createBrowserRouter(routes);

export const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ThemeProvider>
  );
};
