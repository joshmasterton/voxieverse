import { ReactNode, useEffect } from 'react';
import { useUser } from '../context/User.context';
import { useNavigate } from 'react-router-dom';

export const Private = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user]);

  if (user) {
    return <>{children}</>;
  }
};
