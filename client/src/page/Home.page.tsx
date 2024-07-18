import { PiPlus } from 'react-icons/pi';
import { Nav } from '../comp/Nav.comp';
import { Navigate } from '../comp/Navigate.comp';
import { PostCard } from '../comp/PostCard.comp';
import { Side, SideUser } from '../comp/Side.comp';
import { useEffect, useState } from 'react';
import { SerializedPost } from '../../types/utilities/request.utilities.types';
import { request } from '../utilities/request.utilities';
import { Button } from '../comp/Button.comp';
import '../style/page/Home.page.scss';

export const Home = () => {
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState<SerializedPost[] | undefined>(undefined);

  const getPosts = async (currentPage = 0, incrememtPage = false) => {
    try {
      const postsData = await request<unknown, SerializedPost[]>(
        `/getPosts?page=${currentPage}`,
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
      }

      if (incrememtPage) {
        setPage((prevPage) => prevPage + 1);
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
        {posts &&
          posts?.map((post) => {
            return <PostCard key={post.post_id} post={post} />;
          })}
        {posts && (
          <Button
            type="button"
            onClick={async () => await getPosts(page + 1, true)}
            label="morePosts"
            className="buttonOutline"
            name="More posts"
          />
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
