import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import { NotificationContextType } from '../../types/context/Notification.context.types';
import { request } from '../utilities/request.utilities';
import {
  FriendType,
  SerializedUser
} from '../../types/utilities/request.utilities.types';
import { useUser } from './User.context';

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }

  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<SerializedUser[] | undefined>(
    undefined
  );

  const getRequests = async () => {
    try {
      setLoading(true);
      const requestsData = await request<unknown, SerializedUser[]>(
        `/getUsers?friends=waiting`,
        'GET'
      );

      if (requestsData) {
        const getFriendshipPromises = requestsData.map(async (requestData) => {
          const friend = await request<unknown, FriendType>(
            `/getFriend?friend_id=${requestData?.user_id}`,
            'GET'
          );

          if (friend) {
            if (
              friend?.friend_accepted === false &&
              friend.friend_initiator_id !== user?.user_id
            ) {
              return requestData;
            }
          }
        });

        const friendships = (await Promise.all(getFriendshipPromises)).filter(
          (friendship) => friendship !== undefined
        );

        if (friendships && friendships.length > 0) {
          setRequests(friendships);
        } else {
          setRequests(undefined);
        }
      } else {
        setRequests(undefined);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getRequests();

      const requestsInterval = setInterval(async () => {
        await getRequests();
      }, 30000);

      return () => clearInterval(requestsInterval);
    }
  }, [user]);

  return (
    <NotificationContext.Provider value={{ loading, requests, getRequests }}>
      {children}
    </NotificationContext.Provider>
  );
};
