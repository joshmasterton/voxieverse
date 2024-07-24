import { ThemeProvider } from '../../src/context/Theme.context';
import { createMemoryRouter } from 'react-router-dom';
import { routes } from '../../src/App';
import { ReactNode } from 'react';
import { UserProvider } from '../../src/context/User.context';

export const mockUser = {
  comments: 0,
  created_at: '23/07/2024, 13:59:12',
  dislikes: 0,
  email: 'z@email.com',
  friends: 0,
  last_online: '23/07/2024, 13:59:12',
  likes: 0,
  posts: 0,
  profile_picture:
    'https://voxieverse.s3.amazonaws.com/HD-wallpaper-halo-covenant-covenant-elite-halo.jpg',
  user_id: 1,
  username: 'Zonomaly'
};

export const mockPosts = [
  {
    id: 6,
    post_parent_id: null,
    comment_parent_id: null,
    user_id: 1,
    type: 'post',
    text: 'Hi',
    picture: null,
    likes: 0,
    dislikes: 0,
    comments: 0,
    created_at: '23/07/2024, 14:41:56',
    username: 'Zonomaly',
    profile_picture:
      'https://voxieverse.s3.amazonaws.com/HD-wallpaper-halo-covenant-covenant-elite-halo.jpg',
    has_liked: undefined,
    has_disliked: undefined
  }
];

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
