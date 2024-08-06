import { Dispatch, SetStateAction } from 'react';
import {
  FriendType,
  SerializedUser
} from '../../types/utilities/request.utilities.types';
import { request } from './request.utilities';

export const addFriend = async (
  setLoading: Dispatch<SetStateAction<boolean>>,
  setFriendship: Dispatch<SetStateAction<FriendType | undefined>>,
  getRequests: () => Promise<void>,
  profile: SerializedUser | undefined
) => {
  try {
    setLoading(true);
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
    setLoading(false);
  }
};

export const removeFriend = async (
  setLoading: Dispatch<SetStateAction<boolean>>,
  setFriendship: Dispatch<SetStateAction<FriendType | undefined>>,
  getRequests: () => Promise<void>,
  profile: SerializedUser | undefined
) => {
  try {
    setLoading(true);
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
    setLoading(false);
  }
};

export const getFriend = async (
  setLoading: Dispatch<SetStateAction<boolean>>,
  setFriendship: Dispatch<SetStateAction<FriendType | undefined>>,
  user_id?: string | number
) => {
  try {
    setLoading(true);
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
    setLoading(false);
  }
};
