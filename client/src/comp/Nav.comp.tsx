import { useUser } from '../context/User.context';
import { Button, ButtonTheme } from './Button.comp';
import { BiMenu, BiSolidGroup, BiSolidHome, BiSolidUser } from 'react-icons/bi';
import { IoLogOut } from 'react-icons/io5';
import { Navigate } from './Navigate.comp';
import { useEffect, useState } from 'react';
import '../style/comp/Nav.scss';

export const Nav = () => {
  const { user, logout } = useUser();
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
          <img alt="" src={user?.profile_picture} />
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
                to="/"
                className="transparent"
                onClick={() => {}}
                SVG={<BiSolidUser />}
              />
            </li>
            <li>
              <Navigate
                to="/"
                className="transparent"
                onClick={() => {}}
                SVG={<BiSolidGroup />}
              />
            </li>
            <li>
              <Button
                type="button"
                onClick={logout}
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
        </div>
      </main>
    </nav>
  );
};
