import {
  FriendType,
  SerializedUser
} from '../../../types/utilities/request.utilities.types';
import { Navigate } from '../Navigate.comp';
import { useEffect, useState } from 'react';
import { request } from '../../utilities/request.utilities';
import { Button } from '../Button.comp';
import { useUser } from '../../context/User.context';
import '../../style/comp/card/UserCard.comp.scss';

export const UserCard = ({
  profile,
  isRequest = false
}: {
  profile: SerializedUser;
  isRequest?: boolean;
}) => {
  const { user } = useUser();
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

  useEffect(() => {
    getFriend();
  }, []);

  return (
    <div className="userCard">
      {!isRequest && (
        <Navigate to={`/profile/${profile?.user_id}`} onClick={() => {}} />
      )}
      <header>
        {isRequest ? (
          <Navigate
            to={`/profile/${profile.user_id}`}
            onClick={() => {}}
            SVG={<img alt="" src={profile?.profile_picture} />}
          />
        ) : (
          <img alt="" src={profile?.profile_picture} />
        )}
        <div>
          <div>{profile.username}</div>
          <p>{profile.created_at}</p>
        </div>
      </header>
      <footer>
        {isRequest && (
          <div>
            {friendship?.friend_accepted && (
              <Button
                type="button"
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
                  onClick={async () => await addFriend()}
                  label="addFriend"
                  className="buttonPrimary"
                  name="Accept friend request"
                />
              )}
            {!friendship && (
              <Button
                type="button"
                onClick={async () => await addFriend()}
                label="addFriend"
                className="buttonPrimary"
                name="Add"
              />
            )}
          </div>
        )}
      </footer>
    </div>
  );
};
