import {
  createContext,
  MouseEvent,
  useContext,
  useEffect,
  useState
} from 'react';
import { request } from '../utilities/request.utilities';
import { SerializedUser } from '../../types/utilities/request.utilities.types';
import {
  UserContext,
  UserProviderProps
} from '../../types/context/User.context.types';
import { Loading } from '../comp/Loading.comp';

const User = createContext<UserContext | undefined>(undefined);

export const useUser = () => {
  const context = useContext(User);

  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }

  return context;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<SerializedUser | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const getUser = async () => {
    try {
      setLoading(true);
      const userData = await request<unknown, SerializedUser>('/', 'GET');
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async (e?: MouseEvent<HTMLButtonElement>) => {
    try {
      e?.currentTarget.blur();
      const logoutData = await request('/logout', 'GET');
      if (logoutData) {
        setUser(undefined);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return <Loading />;
  } else {
    return (
      <User.Provider value={{ user, setUser, logout }}>
        {children}
      </User.Provider>
    );
  }
};
