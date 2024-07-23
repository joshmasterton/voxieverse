import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/User.context';

export const Public = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      navigate(location?.state?.pathname || '/');
    }
  }, [user, navigate, location]);

  if (!user) {
    return <>{children}</>;
  }
};
