import { useLocation } from 'react-router-dom';
import { request } from '../utilities/request.utilities';
import { useEffect, useState } from 'react';
import {
  FriendType,
  SerializedPostComment,
  SerializedUser
} from '../../types/utilities/request.utilities.types';
import { ReturnNav } from '../comp/ReturnNav';
import { Side, SideUser } from '../comp/Side.comp';
import { Button } from '../comp/Button.comp';
import { PostCard } from '../comp/card/PostCard.comp';
import { Loading } from '../comp/Loading.comp';
import { useUser } from '../context/User.context';
import '../style/page/User.page.scss';

export const User = () => {
  const location = useLocation();
  const user_id = location.pathname.split('/').pop();
  const { user } = useUser();
  const [page, setPage] = useState(0);
  const [friendship, setFriendship] = useState<FriendType | undefined>(
    undefined
  );
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [profile, setProfile] = useState<SerializedUser | undefined>(undefined);
  const [posts, setPosts] = useState<SerializedPostComment[] | undefined>(
    undefined
  );

  const getUser = async () => {
    try {
      setLoading(true);
      setProfile(undefined);
      setPosts(undefined);
      setPage(0);

      const userFromDb = await request<unknown, SerializedUser>(
        `/getUser?user_id=${user_id}`,
        'GET'
      );

      console.log(userFromDb);
      if (userFromDb) {
        setProfile(userFromDb);
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

  const addFriend = async () => {
    try {
      const friend = await request<unknown, FriendType>('/addFriend', 'POST', {
        friend_id: profile?.user_id
      });

      if (friend) {
        setFriendship(friend);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const removeFriend = async () => {
    try {
      const friend = await request<unknown, FriendType>(
        '/removeFriend',
        'DELETE',
        {
          friend_id: profile?.user_id
        }
      );

      if (friend) {
        setFriendship(undefined);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const getFriend = async () => {
    try {
      const friend = await request<unknown, FriendType>(
        `/getFriend?friend_id=${user_id}`,
        'GET'
      );

      if (friend) {
        setFriendship(friend);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    getUser().then(async () => {
      await getFriend();
    });
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
            {profile && (
              <div id="userPageCon">
                <div>
                  <img alt="" src={profile?.profile_picture} />
                </div>
                <header>
                  <img alt="" src={profile?.profile_picture} />
                </header>
                <main>
                  <div>
                    <div>{profile?.username}</div>
                    <p>{profile?.email}</p>
                  </div>
                  <div>
                    <div>Joined</div>
                    <p>{profile?.created_at}</p>
                  </div>
                  <footer>
                    <div>
                      <div>Karma</div>
                      <p>{profile?.likes}</p>
                    </div>
                    <div>
                      <div>Posts</div>
                      <p>{profile?.posts}</p>
                    </div>
                    <div>
                      <div>Friends</div>
                      <p>{profile?.friends}</p>
                    </div>
                  </footer>
                  {user?.user_id !== profile.user_id && (
                    <div>
                      {friendship?.friend_accepted && (
                        <Button
                          type="button"
                          loading={loadingMore}
                          onClick={async () => await removeFriend()}
                          label="removeFriend"
                          className="buttonPrimary"
                          name="Remove"
                        />
                      )}
                      {friendship?.friend_accepted === false &&
                        friendship.friend_initiator_id === user?.user_id && (
                          <Button
                            type="button"
                            loading={loadingMore}
                            onClick={async () => await removeFriend()}
                            label="addFriend"
                            className="buttonPrimary"
                            name="Cancel friend request"
                          />
                        )}
                      {friendship?.friend_accepted === false &&
                        friendship.friend_initiator_id !== user?.user_id && (
                          <Button
                            type="button"
                            loading={loadingMore}
                            onClick={async () => await addFriend()}
                            label="addFriend"
                            className="buttonPrimary"
                            name="Accept friend request"
                          />
                        )}
                      {!friendship && (
                        <Button
                          type="button"
                          loading={loadingMore}
                          onClick={async () => await addFriend()}
                          label="addFriend"
                          className="buttonPrimary"
                          name="Add"
                        />
                      )}
                    </div>
                  )}
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
