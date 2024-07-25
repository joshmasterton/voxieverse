import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Auth } from './page/Auth.page';
import { ThemeProvider } from './context/Theme.context';
import { ForgotPassword } from './page/ForgotPassword.page';
import { UserProvider } from './context/User.context';
import { Home } from './page/Home.page';
import { CreatePost } from './page/CreatePost.page';
import { Post } from './page/Post.page';
import { Private } from './comp/security/Private.comp';
import { Public } from './comp/security/Public.comp';
import { User } from './page/User.page';
import { Popup, PopupProvider } from './context/Popup.context';
import { Error } from './comp/security/Error.comp';
import './style/App.scss';

export const routes = [
  {
    path: '/',
    element: (
      <Private>
        <Home />
      </Private>
    ),
    errorElement: <Error />
  },
  {
    path: '/profile/:user_id',
    element: (
      <Private>
        <User />
      </Private>
    ),
    errorElement: <Error />
  },
  {
    path: '/post/:post_id',
    element: (
      <Private>
        <Post />
      </Private>
    ),
    errorElement: <Error />
  },
  {
    path: '/createPost',
    element: (
      <Private>
        <CreatePost />
      </Private>
    ),
    errorElement: <Error />
  },
  {
    path: '/login',
    element: (
      <Public>
        <Auth />
      </Public>
    ),
    errorElement: <Error />
  },
  {
    path: '/signup',
    element: (
      <Public>
        <Auth isSignup />
      </Public>
    ),
    errorElement: <Error />
  },
  {
    path: '/forgotPassword',
    element: (
      <Public>
        <ForgotPassword />
      </Public>
    ),
    errorElement: <Error />
  },
  {
    path: '/resetPassword',
    element: (
      <Public>
        <ForgotPassword isReset />
      </Public>
    ),
    errorElement: <Error />
  }
];

const router = createBrowserRouter(routes);

export const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <PopupProvider>
          <RouterProvider router={router} />
          <Popup />
        </PopupProvider>
      </UserProvider>
    </ThemeProvider>
  );
};
