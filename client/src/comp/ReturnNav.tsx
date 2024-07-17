import { useUser } from '../context/User.context';
import { Navigate } from './Navigate.comp';
import { IoIosArrowBack } from 'react-icons/io';
import '../style/comp/Nav.scss';

export const ReturnNav = () => {
  const { user } = useUser();
  return (
    <nav>
      <header>
        <div>
          <Navigate
            to=".."
            onClick={() => {}}
            SVG={<IoIosArrowBack />}
            className="transparent"
          />
          <img alt="" src={user?.profile_picture} />
        </div>
      </header>
    </nav>
  );
};
