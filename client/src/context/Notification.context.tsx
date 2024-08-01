import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';
import { NotificationContextType } from '../../types/context/Notification.context.types';
import { request } from '../utilities/request.utilities';
import { SerializedUser } from '../../types/utilities/request.utilities.types';

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
        setRequests(requestsData);
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
    getRequests();
  }, []);

  return (
    <NotificationContext.Provider value={{ loading, requests, getRequests }}>
      {children}
    </NotificationContext.Provider>
  );
};
