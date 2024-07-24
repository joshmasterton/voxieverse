import { PiPlus } from 'react-icons/pi';
import { Nav } from '../comp/Nav.comp';
import { Navigate } from '../comp/Navigate.comp';
import { Side, SideUser } from '../comp/Side.comp';
import { useEffect, useState } from 'react';
import { request } from '../utilities/request.utilities';
import { SerializedPostComment } from '../../types/utilities/request.utilities.types';
import { PostCard } from '../comp/card/PostCard.comp';
import { Button } from '../comp/Button.comp';
import { Loading } from '../comp/Loading.comp';
import '../style/page/Home.page.scss';

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState<SerializedPostComment[] | undefined>(
    undefined
  );

  const getPosts = async (currentPage = page, incrememtPage = true) => {
    try {
      setLoadingMore(true);

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
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    getPosts().finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Nav />
      <SideUser />
      <div id="home">
        {loading ? (
          <Loading />
        ) : (
          posts && (
            <>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              <Button
                type="button"
                loading={loadingMore}
                onClick={async () => getPosts()}
                label="getMore"
                className="buttonOutline"
                name="More posts"
              />
            </>
          )
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
