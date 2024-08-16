import { useLocation } from 'react-router-dom';
import { request } from '../utilities/request.utilities';
import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  EditDetails,
  FriendType,
  SerializedPostComment,
  SerializedUser
} from '../../types/utilities/request.utilities.types';
import { Side } from '../comp/Side.comp';
import { Button } from '../comp/Button.comp';
import { PostCard } from '../comp/card/PostCard.comp';
import { Loading } from '../comp/Loading.comp';
import { useUser } from '../context/User.context';
import { CgClose, CgUserAdd, CgUserRemove } from 'react-icons/cg';
import { UserCard } from '../comp/card/UserCard.comp';
import { FaUserFriends } from 'react-icons/fa';
import { BiEdit, BiSolidUser } from 'react-icons/bi';
import { getPosts } from '../utilities/post.utilities';
import {
  addFriend,
  getFriend,
  removeFriend
} from '../utilities/friend.utilities';
import { useNotification } from '../context/Notification.context';
import { Input } from '../comp/Input.comp';
import { MdEmail } from 'react-icons/md';
import { BsImage } from 'react-icons/bs';
import { RiLockPasswordFill } from 'react-icons/ri';
import { usePopup } from '../context/Popup.context';
import { validatorCheck } from '../utilities/form.utilities';
import '../style/page/User.page.scss';

export const User = () => {
  const location = useLocation();
  const user_id = location.pathname.split('/').pop();
  const { user } = useUser();
  const { setPopup } = usePopup();
  const { getRequests } = useNotification();
  const [showFriends, setShowFriends] = useState(false);
  const [editDetails, setEditDetails] = useState<EditDetails>({
    username: '',
    email: '',
    file: undefined,
    password: '',
    confirmPassword: ''
  });
  const [isEditMode, setIsEdit] = useState(false);
  const [friends, setFriends] = useState<SerializedUser[] | undefined>(
    undefined
  );
  const [validator, setValidator] = useState<
    { type: string; text: string } | undefined
  >(undefined);
  const [loadingRemoveFriend, setLoadingRemoveFriend] = useState(false);
  const [loadingFriend, setLoadingFriend] = useState(true);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [page, setPage] = useState(0);
  const [pageFriends, setPageFriends] = useState(0);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingEdit, setLoadingEdit] = useState(false);
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
        await getPosts(
          0,
          true,
          setPosts,
          setCanLoadMore,
          setPage,
          setLoadingMore,
          userFromDb.user_id
        );
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

  const handleOnSubmit = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoadingEdit(true);

      const formData = new FormData();
      if (editDetails.username.length > 0) {
        formData.append('username', editDetails.username);
      }

      if (editDetails.email.length > 0) {
        formData.append('email', editDetails.email);
      }

      if (editDetails.password.length > 0) {
        formData.append('password', editDetails.password);
      }

      if (editDetails.password.length > 0) {
        formData.append('confirmPassword', editDetails.confirmPassword);
      }

      if (editDetails.file) {
        formData.append('file', editDetails.file);
      }

      await request('/updateUser', 'POST', formData);

      window.location.reload();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setPopup(error.message);
      }
    } finally {
      setLoadingEdit(false);
    }
  };

  useEffect(() => {
    if (userIdRef.current !== user_id) {
      userIdRef.current = user_id;
      setFriends(undefined);
      setShowFriends(false);
      setPageFriends(0);
      getUser().then(async () => {
        await getFriend(setLoadingFriend, setFriendship, user_id);
      });
    } else if (!profile) {
      setFriends(undefined);
      setShowFriends(false);
      setPageFriends(0);
      getUser().then(async () => {
        await getFriend(setLoadingFriend, setFriendship, user_id);
      });
    }
  }, [user_id]);

  useEffect(() => {
    if (showFriends && friends && friends?.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showFriends]);

  useEffect(() => {
    setValidator(validatorCheck(editDetails, true, false));
  }, [editDetails]);

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
                {isEditMode ? (
                  <>
                    <header>
                      <img
                        alt=""
                        src={
                          editDetails.file
                            ? URL.createObjectURL(editDetails.file)
                            : profile?.profile_picture
                        }
                      />
                      <div>
                        {profile?.is_online && (
                          <div className="online">
                            <div />
                            <div />
                          </div>
                        )}
                        <img
                          alt=""
                          src={
                            editDetails.file
                              ? URL.createObjectURL(editDetails.file)
                              : profile?.profile_picture
                          }
                        />
                      </div>
                    </header>
                    <form
                      method="POST"
                      autoComplete="off"
                      noValidate
                      onSubmit={async (e) => await handleOnSubmit(e)}
                    >
                      <Input<EditDetails>
                        id="username"
                        type="text"
                        value={editDetails.username}
                        disabled={loadingEdit}
                        setValue={setEditDetails}
                        placeholder={user?.username ?? 'Username'}
                        SVG={<BiSolidUser />}
                      />
                      {validator?.type === 'username' && (
                        <p>{validator.text}</p>
                      )}
                      <Input<EditDetails>
                        id="email"
                        type="email"
                        disabled={loadingEdit}
                        value={editDetails.email}
                        setValue={setEditDetails}
                        placeholder={user?.email ?? 'Email'}
                        SVG={<MdEmail />}
                      />
                      {validator?.type === 'email' && <p>{validator.text}</p>}
                      <Input<EditDetails>
                        id="file"
                        type="file"
                        disabled={loadingEdit}
                        className="file"
                        setValue={setEditDetails}
                        placeholder="Profile picture"
                        SVG={<BsImage />}
                      />
                      {validator?.type === 'file' && <p>{validator.text}</p>}
                      <Input<EditDetails>
                        id="password"
                        className="labelPassword"
                        type="password"
                        disabled={loadingEdit}
                        value={editDetails.password}
                        setValue={setEditDetails}
                        placeholder="New password"
                        SVG={<RiLockPasswordFill />}
                      />
                      {validator?.type === 'password' && (
                        <p>{validator.text}</p>
                      )}
                      <Input<EditDetails>
                        id="confirmPassword"
                        className="labelPassword"
                        disabled={loadingEdit}
                        type="password"
                        value={editDetails.confirmPassword}
                        setValue={setEditDetails}
                        placeholder="Confirm password"
                        SVG={<RiLockPasswordFill />}
                      />
                      {validator?.type === 'confirmPassword' && (
                        <p>{validator.text}</p>
                      )}
                      <Button
                        type="submit"
                        loading={loadingEdit}
                        onClick={() => {}}
                        label="editSubmit"
                        className="buttonPrimary"
                        name="Save"
                      />
                    </form>
                  </>
                ) : (
                  <>
                    <header>
                      <img alt="" src={profile?.profile_picture} />
                      <div>
                        {profile.is_online && (
                          <div className="online">
                            <div />
                            <div />
                          </div>
                        )}
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
                          <p>
                            {(profile?.likes ?? 0) - (profile?.dislikes ?? 0)}
                          </p>
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
                        {profile?.friend_status === 'friend' && (
                          <FaUserFriends />
                        )}
                      </footer>
                      {user?.user_id !== profile.user_id && (
                        <div className="friends">
                          {friendship?.friend_accepted && (
                            <>
                              <Button
                                type="button"
                                loading={loadingRemoveFriend}
                                disabled={loadingFriend || loadingRemoveFriend}
                                onClick={async () =>
                                  await removeFriend(
                                    setLoadingRemoveFriend,
                                    setFriendship,
                                    getRequests,
                                    profile
                                  )
                                }
                                label="removeFriend"
                                className="buttonShadeExtra"
                                SVG={<CgUserRemove />}
                                name={<p>Remove friend</p>}
                              />
                            </>
                          )}
                          {friendship?.friend_accepted === false &&
                            friendship.friend_initiator_id ===
                              user?.user_id && (
                              <>
                                <Button
                                  type="button"
                                  loading={loadingRemoveFriend}
                                  disabled={
                                    loadingFriend || loadingRemoveFriend
                                  }
                                  onClick={async () =>
                                    await removeFriend(
                                      setLoadingRemoveFriend,
                                      setFriendship,
                                      getRequests,
                                      profile
                                    )
                                  }
                                  label="cancelFriend"
                                  className="buttonShadeExtra"
                                  SVG={<CgUserRemove />}
                                  name={<p>Waiting</p>}
                                />
                              </>
                            )}
                          {friendship?.friend_accepted === false &&
                            friendship.friend_initiator_id !==
                              user?.user_id && (
                              <>
                                <Button
                                  type="button"
                                  loading={loadingFriend}
                                  disabled={
                                    loadingFriend || loadingRemoveFriend
                                  }
                                  onClick={async () =>
                                    await addFriend(
                                      setLoadingFriend,
                                      setFriendship,
                                      getRequests,
                                      profile
                                    )
                                  }
                                  label="acceptFriend"
                                  className="buttonShadeExtra"
                                  SVG={<CgUserAdd />}
                                  name={<p>Accept</p>}
                                />
                                <Button
                                  type="button"
                                  loading={loadingRemoveFriend}
                                  disabled={
                                    loadingFriend || loadingRemoveFriend
                                  }
                                  onClick={async () =>
                                    await removeFriend(
                                      setLoadingRemoveFriend,
                                      setFriendship,
                                      getRequests,
                                      profile
                                    )
                                  }
                                  label="declineFriend"
                                  className="buttonShadeExtra"
                                  SVG={<CgUserRemove />}
                                  name={<p>Decline</p>}
                                />
                              </>
                            )}
                          {(!friendship || !friendship?.id) && (
                            <>
                              <Button
                                type="button"
                                loading={loadingFriend}
                                disabled={loadingFriend || loadingRemoveFriend}
                                onClick={async () =>
                                  await addFriend(
                                    setLoadingFriend,
                                    setFriendship,
                                    getRequests,
                                    profile
                                  )
                                }
                                label="addFriend"
                                className="buttonShadeExtra"
                                SVG={<CgUserAdd />}
                                name={<p>Add friend</p>}
                              />
                            </>
                          )}
                        </div>
                      )}
                    </main>
                  </>
                )}
                {profile?.user_id === user?.user_id && (
                  <Button
                    type="button"
                    onClick={() => setIsEdit(!isEditMode)}
                    label="editProfile"
                    className="buttonShade edit"
                    SVG={isEditMode ? <CgClose /> : <BiEdit />}
                  />
                )}
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
                        onClick={async () =>
                          await getPosts(
                            page,
                            true,
                            setPosts,
                            setCanLoadMore,
                            setPage,
                            setLoadingMore,
                            profile?.user_id
                          )
                        }
                        label="getMore"
                        className="buttonShade"
                        name="More posts"
                      />
                    </div>
                  )}
                  {posts.length < 2 && <div className="empty" />}
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
