import {
  FriendType,
  SerializedUser
} from '../../../types/utilities/request.utilities.types';
import { Navigate } from '../Navigate.comp';
import { useEffect, useState } from 'react';
import { Button } from '../Button.comp';
import { useUser } from '../../context/User.context';
import { useNotification } from '../../context/Notification.context';
import { CgUserAdd, CgUserRemove } from 'react-icons/cg';
import { FaUserFriends } from 'react-icons/fa';
import { Loading } from '../Loading.comp';
import {
  addFriend,
  getFriend,
  removeFriend
} from '../../utilities/friend.utilities';
import '../../style/comp/card/UserCard.comp.scss';

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

  useEffect(() => {
    getFriend(setLoadingFriend, setFriendship, profile.user_id);
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
          <div>{profile?.username}</div>
          <p>{profile?.email}</p>
        </div>
        {profile.is_online && (
          <div className="online">
            <div />
            <div />
          </div>
        )}
      </header>
      {!isRequest && (
        <div>
          {loadingFriend ? (
            <Loading />
          ) : (
            friendship?.friend_accepted && <FaUserFriends />
          )}
        </div>
      )}
      <footer>
        {isRequest && (
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
                  className="buttonShade"
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
                    disabled={loadingFriend || loadingRemoveFriend}
                    onClick={async () =>
                      await removeFriend(
                        setLoadingRemoveFriend,
                        setFriendship,
                        getRequests,
                        profile
                      )
                    }
                    label="waitingFriend"
                    className="buttonShade"
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
                    disabled={loadingFriend || loadingRemoveFriend}
                    onClick={async () =>
                      await addFriend(
                        setLoadingFriend,
                        setFriendship,
                        getRequests,
                        profile
                      )
                    }
                    label="acceptFriend"
                    className="buttonShade"
                    SVG={<CgUserAdd />}
                    name={<p>Accept</p>}
                  />{' '}
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
                    label="declineFriend"
                    className="buttonShade"
                    SVG={<CgUserRemove />}
                    name={<p>Decline</p>}
                  />
                </>
              )}
            {(!friendship || !friendship.id) && (
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
                  className="buttonShade"
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
