import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/User.context';

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
