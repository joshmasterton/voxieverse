import {
  FriendType,
  SerializedUser
} from '../../../types/utilities/request.utilities.types';
import { Navigate } from '../Navigate.comp';
import { useEffect, useState } from 'react';
import { request } from '../../utilities/request.utilities';
import { Button } from '../Button.comp';
import { useUser } from '../../context/User.context';
import { useNotification } from '../../context/Notification.context';
import { CgUserAdd, CgUserRemove } from 'react-icons/cg';
import { FaUserFriends } from 'react-icons/fa';
import '../../style/comp/card/UserCard.comp.scss';
import { Loading } from '../Loading.comp';

export const UserCard = ({
  profile,
  isRequest = false
}: {
  profile: SerializedUser;
  isRequest?: boolean;
}) => {
  const { user } = useUser();
  const { getRequests } = useNotification();
  const [loadingFriend, setLoadingFriend] = useState(true);
  const [loadingRemoveFriend, setLoadingRemoveFriend] = useState(false);
  const [friendship, setFriendship] = useState<FriendType | undefined>(
    undefined
  );

  const getFriend = async () => {
    try {
      const friend = await request<unknown, FriendType>(
        `/getFriend?friend_id=${profile.user_id}`,
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

  useEffect(() => {
    getFriend();
  }, []);

  return (
    <div className={`userCard ${profile?.friend_status ?? ''}`}>
      {!isRequest && (
        <Navigate to={`/profile/${profile?.user_id}`} onClick={() => {}} />
      )}
      <header>
        {isRequest ? (
          <Navigate
            to={`/profile/${profile?.user_id}`}
            onClick={() => {}}
            SVG={<img alt="" src={profile?.profile_picture} />}
          />
        ) : (
          <img alt="" src={profile?.profile_picture} />
        )}
        <div>
          <div>
            {profile?.username} - <p>{profile?.created_at}</p>
          </div>
          <p>{profile?.email}</p>
        </div>
      </header>
      <div>
        {loadingFriend ? (
          <Loading />
        ) : (
          friendship?.friend_accepted && <FaUserFriends />
        )}
      </div>
      <footer>
        {isRequest && (
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
                    label="waitingFriend"
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
                  />{' '}
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
      </footer>
    </div>
  );
};
