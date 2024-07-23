import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/User.context';

export const Private = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: location });
    }
  }, [user]);

  if (user) {
    return <>{children}</>;
  }
};
