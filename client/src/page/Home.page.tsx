import { Nav } from '../comp/Nav.comp';
import { Post } from '../comp/Post.comp';
import { useUser } from '../context/User.context';
import '../style/page/Home.page.scss';

export const Home = () => {
  const { user } = useUser();

  return (
    <>
      <Nav />
      <div id="home">
        {user && (
          <>
            <Post user={user} />
            <Post user={user} />
            <Post user={user} />
            <Post user={user} />
            <Post user={user} />
            <Post user={user} />
            <Post user={user} />
            <Post user={user} />
            <Post user={user} />
            <Post user={user} />
            <Post user={user} />
            <Post user={user} />
          </>
        )}
      </div>
    </>
  );
};
