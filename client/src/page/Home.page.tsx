import { PiPlus } from 'react-icons/pi';
import { Nav } from '../comp/Nav.comp';
import { Navigate } from '../comp/Navigate.comp';
import { Side, SideUser } from '../comp/Side.comp';
import { useEffect, useState } from 'react';
import { request } from '../utilities/request.utilities';
import { SerializedPostComment } from '../../types/utilities/request.utilities.types';
import '../style/page/Home.page.scss';
import { PostCard } from '../comp/card/PostCard.comp';
import { Button } from '../comp/Button.comp';

export const Home = () => {
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState<SerializedPostComment[] | undefined>(
    undefined
  );

  const getPosts = async (currentPage = page, incrememtPage = true) => {
    try {
      const postsData = await request<unknown, SerializedPostComment[]>(
        `/getPostsComments?page=${currentPage}&type=post`,
        'GET'
      );

      if (postsData) {
        setPosts((prevPosts) => {
          if (prevPosts && postsData.length > 0) {
            return [...prevPosts, ...postsData];
          }

          if (postsData.length > 0) {
            return postsData;
          }

          if (prevPosts) {
            return prevPosts;
          }

          return undefined;
        });

        if (incrememtPage) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <Nav />
      <SideUser />
      <div id="home">
        {posts && (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            <Button
              type="button"
              onClick={async () => getPosts()}
              label="getMore"
              className="buttonOutline"
              name="More posts"
            />
          </>
        )}
        <Navigate
          to="/createPost"
          onClick={() => {}}
          SVG={<PiPlus />}
          className="buttonPrimary"
        />
      </div>
      <Side />
    </>
  );
};
