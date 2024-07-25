import { useLocation } from 'react-router-dom';
import { request } from '../utilities/request.utilities';
import { useEffect, useState } from 'react';
import {
  SerializedPostComment,
  SerializedUser
} from '../../types/utilities/request.utilities.types';
import { ReturnNav } from '../comp/ReturnNav';
import { Side, SideUser } from '../comp/Side.comp';
import { Button } from '../comp/Button.comp';
import { PostCard } from '../comp/card/PostCard.comp';
import { Loading } from '../comp/Loading.comp';
import '../style/page/User.page.scss';

export const User = () => {
  const location = useLocation();
  const user_id = location.pathname.split('/').pop();
  const [page, setPage] = useState(0);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [user, setUser] = useState<SerializedUser | undefined>(undefined);
  const [posts, setPosts] = useState<SerializedPostComment[] | undefined>(
    undefined
  );

  const getUser = async () => {
    try {
      setLoading(true);
      setUser(undefined);
      setPosts(undefined);
      setPage(0);

      const userFromDb = await request<unknown, SerializedUser>(
        `/getUser?user_id=${user_id}`,
        'GET'
      );
      if (userFromDb) {
        setUser(userFromDb);
        await getPosts(0);
      } else {
        throw new Error('No user found');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getPosts = async (currentPage = page, incrememtPage = true) => {
    try {
      setLoadingMore(true);

      const postsData = await request<unknown, SerializedPostComment[]>(
        `/getPostsComments?page=${currentPage}&type=post&profile_id=${user_id}`,
        'GET'
      );

      if (postsData) {
        if (postsData.length < 10) {
          setCanLoadMore(false);
        }

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
        setCanLoadMore(false);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [location]);

  return (
    <>
      <ReturnNav />
      <SideUser />
      <div id="userPage">
        {loading ? (
          <Loading />
        ) : (
          <>
            {user && (
              <div id="userPageCon">
                <header>
                  <img alt="" src={user?.profile_picture} />
                  <img alt="" src={user?.profile_picture} />
                </header>
                <main>
                  <div>
                    <div>{user?.username}</div>
                    <p>{user?.email}</p>
                  </div>
                  <footer>
                    <div>
                      <div>Karma</div>
                      <p>{user?.likes}</p>
                    </div>
                    <div>
                      <div>Posts</div>
                      <p>{user?.posts}</p>
                    </div>
                    <div>
                      <div>Friends</div>
                      <p>{user?.friends}</p>
                    </div>
                  </footer>
                  <div>
                    <div>Creation</div>
                    <p>{user?.created_at}</p>
                  </div>
                </main>
              </div>
            )}
            {posts && (
              <>
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
                {canLoadMore && (
                  <Button
                    type="button"
                    loading={loadingMore}
                    onClick={async () => getPosts()}
                    label="getMore"
                    className="buttonOutline"
                    name="More posts"
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
      <Side />
    </>
  );
};
