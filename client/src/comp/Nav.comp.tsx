import { useUser } from '../context/User.context';
import { Button, ButtonTheme } from './Button.comp';
import {
  BiMenu,
  BiSolidGroup,
  BiSolidHome,
  BiSolidUser,
  BiUserPlus
} from 'react-icons/bi';
import { IoLogOut } from 'react-icons/io5';
import { Navigate } from './Navigate.comp';
import { useEffect, useState } from 'react';
import '../style/comp/Nav.scss';

export const Nav = () => {
  const { user, logout } = useUser();
  const [loading, setLoading] = useState(false);
  const [isMenu, setIsMenu] = useState(false);

  const handleMenuChange = () => {
    setIsMenu(!isMenu);
  };

  const handleScroll = () => {
    setIsMenu(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenu]);

  return (
    <nav className={isMenu ? 'active' : 'hidden'}>
      <header>
        <div>
          <Navigate
            to={`/profile/${user?.user_id}`}
            onClick={() => {}}
            SVG={<img alt="" src={user?.profile_picture} />}
          />
          <ul>
            <li>
              <Navigate
                to="/"
                className="transparent"
                onClick={() => {}}
                SVG={<BiSolidHome />}
              />
            </li>
            <li>
              <Navigate
                to={`/profile/${user?.user_id}`}
                className="transparent"
                onClick={() => {}}
                SVG={<BiSolidUser />}
              />
            </li>
            <li>
              <Navigate
                to="/friends"
                className="transparent"
                onClick={() => {}}
                SVG={<BiSolidGroup />}
              />
            </li>
            <li>
              <Navigate
                to="/requests"
                className="transparent"
                onClick={() => {}}
                SVG={<BiUserPlus />}
              />
            </li>
            <li>
              <Button
                type="button"
                loading={loading}
                onClick={async () => {
                  setLoading(true);
                  await logout();
                }}
                label="logout"
                SVG={<IoLogOut />}
              />
            </li>
            <li>
              <ButtonTheme />
            </li>
          </ul>
          <Button
            type="button"
            onClick={handleMenuChange}
            label="menu"
            SVG={<BiMenu />}
          />
        </div>
      </header>
      <main>
        <div>
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
                to={`/profile/${user?.user_id}`}
                className="transparent"
                onClick={() => {}}
                SVG={<BiSolidUser />}
                name="Profile"
              />
            </li>
            <li>
              <Navigate
                to="/friends"
                className="transparent"
                onClick={() => {}}
                SVG={<BiSolidGroup />}
                name="Friends"
              />
            </li>
            <li>
              <Navigate
                to="/requests"
                className="transparent"
                onClick={() => {}}
                SVG={<BiUserPlus />}
                name="Requests"
              />
            </li>
            <li>
              <Button
                type="button"
                loading={loading}
                onClick={async () => {
                  setLoading(true);
                  await logout();
                }}
                label="logout"
                name="Logout"
                SVG={<IoLogOut />}
              />
            </li>
            <li>
              <ButtonTheme />
            </li>
          </ul>
        </div>
      </main>
    </nav>
  );
};
