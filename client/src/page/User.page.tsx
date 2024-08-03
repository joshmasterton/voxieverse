import { useLocation } from 'react-router-dom';
import { request } from '../utilities/request.utilities';
import { useEffect, useRef, useState } from 'react';
import {
  FriendType,
  SerializedPostComment,
  SerializedUser
} from '../../types/utilities/request.utilities.types';
import { Side } from '../comp/Side.comp';
import { Button } from '../comp/Button.comp';
import { PostCard } from '../comp/card/PostCard.comp';
import { Loading } from '../comp/Loading.comp';
import { useUser } from '../context/User.context';
import { useNotification } from '../context/Notification.context';
import { CgClose, CgUserAdd, CgUserRemove } from 'react-icons/cg';
import { UserCard } from '../comp/card/UserCard.comp';
import { FaUserFriends } from 'react-icons/fa';
import '../style/page/User.page.scss';

export const User = () => {
  const location = useLocation();
  const user_id = location.pathname.split('/').pop();
  const { user } = useUser();
  const { getRequests } = useNotification();
  const [showFriends, setShowFriends] = useState(false);
  const [friends, setFriends] = useState<SerializedUser[] | undefined>(
    undefined
  );
  const [loadingRemoveFriend, setLoadingRemoveFriend] = useState(false);
  const [loadingFriend, setLoadingFriend] = useState(true);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [page, setPage] = useState(0);
  const [pageFriends, setPageFriends] = useState(0);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingMoreFriends, setLoadingMoreFriends] = useState(false);
  const [canLoadMoreFriends, setCanLoadMoreFriends] = useState(true);
  const [profile, setProfile] = useState<SerializedUser | undefined>(undefined);
  const [posts, setPosts] = useState<SerializedPostComment[] | undefined>(
    undefined
  );
  const [friendship, setFriendship] = useState<FriendType | undefined>(
    undefined
  );

  const userIdRef = useRef(user_id);

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

  const getFriends = async (
    currentPage = pageFriends,
    incrememtPage = true,
    search?: string
  ) => {
    try {
      setLoadingFriends(true);
      setLoadingMoreFriends(true);

      const friendsData = await request<unknown, SerializedUser[]>(
        `/getUsers?profile_id=${profile?.user_id}&page=${currentPage}&friends=friend${search ? `&search=${search}` : ''}`,
        'GET'
      );

      if (friendsData) {
        if (friendsData.length < 10) {
          setCanLoadMoreFriends(false);
        }

        setFriends((prevFriends) => {
          if (prevFriends && friendsData.length > 0) {
            return [...prevFriends, ...friendsData];
          }

          if (friendsData.length > 0) {
            return friendsData;
          }

          if (prevFriends) {
            return prevFriends;
          }

          return undefined;
        });

        if (incrememtPage) {
          setPageFriends((prevPage) => prevPage + 1);
        }
      }

      setShowFriends(true);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setCanLoadMoreFriends(false);
      }
    } finally {
      setLoadingFriends(false);
      setLoadingMoreFriends(false);
    }
  };

  const addFriend = async () => {
    try {
      setLoadingFriend(true);
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
    } finally {
      await getRequests();
      setLoadingFriend(false);
    }
  };

  const removeFriend = async () => {
    try {
      setLoadingRemoveFriend(true);
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
    } finally {
      await getRequests();
      setLoadingRemoveFriend(false);
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
    } finally {
      setLoadingFriend(false);
    }
  };

  useEffect(() => {
    if (userIdRef.current !== user_id) {
      userIdRef.current = user_id;
      setFriends(undefined);
      setShowFriends(false);
      setPageFriends(0);
      getUser().then(async () => {
        await getFriend();
      });
    } else if (!profile) {
      setFriends(undefined);
      setShowFriends(false);
      setPageFriends(0);
      getUser().then(async () => {
        await getFriend();
      });
    }
  }, [user_id]);

  return (
    <>
      <div id="userPage">
        {loading ? (
          <Loading className="full" />
        ) : (
          <>
            {profile && (
              <div id="userPageCon">
                {friends && showFriends && friends.length > 0 && (
                  <div>
                    <p />
                    <div>
                      <div>Friends</div>
                      <Button
                        type="button"
                        loading={loadingMoreFriends}
                        onClick={async () => {
                          setPageFriends(0);
                          setFriends(undefined);
                          setShowFriends(false);
                        }}
                        label="close"
                        SVG={<CgClose />}
                      />
                      {friends.map((friend) => (
                        <UserCard key={friend.user_id} profile={friend} />
                      ))}
                      {friends && showFriends && canLoadMoreFriends && (
                        <div className="buttonMore">
                          <Button
                            type="button"
                            loading={loadingMoreFriends}
                            onClick={async () => await getFriends()}
                            label="getMoreFriends"
                            className="buttonShade"
                            name="More friends"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <header>
                  <img alt="" src={profile?.profile_picture} />
                  <div>
                    <img alt="" src={profile?.profile_picture} />
                  </div>
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
                    <Button
                      type="button"
                      loading={loadingFriends}
                      onClick={async () => await getFriends()}
                      label="showFriends"
                      className="buttonFlat"
                      name={
                        <div>
                          <div>Friends</div>
                          <p>{profile?.friends}</p>
                        </div>
                      }
                    />
                    {profile?.friend_status === 'friend' && <FaUserFriends />}
                  </footer>
                  {user?.user_id !== profile.user_id && (
                    <div className="friends">
                      {friendship?.friend_accepted && (
                        <>
                          <Button
                            type="button"
                            loading={loadingRemoveFriend}
                            onClick={async () => await removeFriend()}
                            label="removeFriend"
                            className="buttonOutline"
                            SVG={<CgUserRemove />}
                            name={<p>Remove friend</p>}
                          />
                        </>
                      )}
                      {friendship?.friend_accepted === false &&
                        friendship.friend_initiator_id === user?.user_id && (
                          <>
                            <Button
                              type="button"
                              loading={loadingRemoveFriend}
                              onClick={async () => await removeFriend()}
                              label="cancelFriend"
                              className="buttonOutline"
                              SVG={<CgUserRemove />}
                              name={<p>Waiting</p>}
                            />
                          </>
                        )}
                      {friendship?.friend_accepted === false &&
                        friendship.friend_initiator_id !== user?.user_id && (
                          <>
                            <Button
                              type="button"
                              loading={loadingFriend}
                              onClick={async () => await addFriend()}
                              label="acceptFriend"
                              className="buttonOutline"
                              SVG={<CgUserAdd />}
                              name={<p>Accept</p>}
                            />
                            <Button
                              type="button"
                              loading={loadingRemoveFriend}
                              onClick={async () => await removeFriend()}
                              label="declineFriend"
                              className="buttonOutline"
                              SVG={<CgUserRemove />}
                              name={<p>Decline</p>}
                            />
                          </>
                        )}
                      {!friendship && (
                        <>
                          <Button
                            type="button"
                            loading={loadingFriend}
                            onClick={async () => await addFriend()}
                            label="addFriend"
                            className="buttonOutline"
                            SVG={<CgUserAdd />}
                            name={<p>Add friend</p>}
                          />
                        </>
                      )}
                    </div>
                  )}
                </main>
              </div>
            )}
            <>
              {posts ? (
                <>
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                  {posts && canLoadMore && (
                    <div className="buttonMore">
                      <Button
                        type="button"
                        loading={loadingMore}
                        onClick={async () => await getPosts()}
                        label="getMore"
                        className="buttonShade"
                        name="More posts"
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="empty">No posts</div>
              )}
            </>
          </>
        )}
      </div>
      <Side />
    </>
  );
};
