import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/User.context';

export const Public = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  if (!user) {
    return <>{children}</>;
  }
};
