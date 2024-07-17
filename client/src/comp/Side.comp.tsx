import { BiSolidGroup, BiSolidHome, BiSolidUser } from 'react-icons/bi';
import { useUser } from '../context/User.context';
import { Navigate } from './Navigate.comp';
import { Button, ButtonTheme } from './Button.comp';
import { IoLogOut } from 'react-icons/io5';
import '../style/comp/Side.comp.scss';

export const Side = () => {
  return (
    <div id="side">
      <div />
    </div>
  );
};

export const SideUser = () => {
  const { user, logout } = useUser();

  return (
    <div id="sideUser">
      <div>
        <header>
          <img alt="" src={user?.profile_picture} className="imgUser" />
          <div>
            <div>{user?.username}</div>
            <p>{user?.email}</p>
          </div>
        </header>
        <main>
          <ul>
            <li>
              <Navigate
                to="/"
                className="transparent"
                onClick={() => {}}
                SVG={<BiSolidHome />}
                name="Home"
              />
            </li>
            <li>
              <Navigate
                to="/"
                className="transparent"
                onClick={() => {}}
                SVG={<BiSolidUser />}
                name="Profile"
              />
            </li>
            <li>
              <Navigate
                to="/"
                className="transparent"
                onClick={() => {}}
                SVG={<BiSolidGroup />}
                name="Friends"
              />
            </li>
            <li>
              <Button
                type="button"
                onClick={logout}
                label="logout"
                name="Logout"
                SVG={<IoLogOut />}
              />
            </li>
            <li>
              <ButtonTheme />
            </li>
          </ul>
        </main>
      </div>
    </div>
  );
};
