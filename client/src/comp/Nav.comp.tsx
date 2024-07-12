import { BiLogOut } from 'react-icons/bi';
import { useUser } from '../context/User.context';
import { Button } from './Button.comp';

export const Nav = () => {
  const { user, logout } = useUser();

  return (
    <nav>
      <div>{user?.user_id}</div>
      <div>{user?.username}</div>
      <img alt="" src={user?.profile_picture} />
      <Button
        type="button"
        onClick={logout}
        label="logout"
        className="buttonPrimary"
        SVG={<BiLogOut />}
      />
    </nav>
  );
};
