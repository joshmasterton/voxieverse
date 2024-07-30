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
  const [requests, setRequests] = useState(0);

  const getRequests = async () => {
    try {
      const requestsData = await request<unknown, SerializedUser[]>(
        `/getUsers?friends=waiting`,
        'GET'
      );
      if (requestsData) {
        setRequests(requestsData.length);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  return (
    <NotificationContext.Provider value={{ requests, getRequests }}>
      {children}
    </NotificationContext.Provider>
  );
};
