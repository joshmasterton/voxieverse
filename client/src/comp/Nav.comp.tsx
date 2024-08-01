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
import { SideUser } from './Side.comp';
import { IoIosArrowBack } from 'react-icons/io';
import { useNotification } from '../context/Notification.context';
import { CgClose } from 'react-icons/cg';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { useLocation } from 'react-router-dom';
import '../style/comp/Nav.scss';

export const Nav = ({ isReturn = false }: { isReturn?: boolean }) => {
  const location = useLocation();
  const { user, logout } = useUser();
  const { requests } = useNotification();
  const [loading, setLoading] = useState(false);
  const [isMenu, setIsMenu] = useState(false);

  const getCurrentTitle = () => {
    const normalLocation = location.pathname.split('/').pop();

    if (isReturn) {
      const returnLocation = location.pathname.split('/').splice(1).shift();

      const locationFirstLetter = returnLocation?.slice(0, 1).toUpperCase();
      const locationLetters = returnLocation?.slice(1);

      if (locationFirstLetter && locationLetters) {
        return locationFirstLetter + locationLetters;
      }
    } else if (normalLocation) {
      const locationFirstLetter = normalLocation.slice(0, 1).toUpperCase();
      const locationLetters = normalLocation.slice(1);

      if (locationFirstLetter && locationLetters) {
        return locationFirstLetter + locationLetters;
      }
    } else {
      return 'Home';
    }
  };

  const handleMenuChange = () => {
    setIsMenu(!isMenu);
  };

  const handleScroll = () => {
    setIsMenu(false);
  };

  useEffect(() => {
    if (isReturn) {
      setIsMenu(false);
    }
  }, [isReturn]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <SideUser requests={requests?.length ?? 0} />
      <nav className={isMenu ? 'active' : 'hidden'}>
        {isReturn ? (
          <header id="returnNav">
            <div>
              <Navigate
                to=".."
                onClick={() => {}}
                SVG={<IoIosArrowBack />}
                className="transparent"
              />
              <div>
                {getCurrentTitle()}
                <HiOutlineMenuAlt3 />
              </div>
            </div>
          </header>
        ) : (
          <header>
            <div>
              <div>
                <HiOutlineMenuAlt3 />
                {getCurrentTitle()}
              </div>
              <ul>
                <li>
                  <Navigate
                    to="/"
                    className="transparent"
                    onClick={handleMenuChange}
                    SVG={<BiSolidHome />}
                  />
                </li>
                <li>
                  <Navigate
                    to={`/profile/${user?.user_id}`}
                    className="transparent"
                    onClick={handleMenuChange}
                    SVG={<BiSolidUser />}
                  />
                </li>
                <li>
                  <Navigate
                    to="/friends"
                    className="transparent"
                    onClick={handleMenuChange}
                    SVG={<BiSolidGroup />}
                  />
                </li>
                <li>
                  <Navigate
                    to="/requests"
                    className="transparent"
                    onClick={handleMenuChange}
                    SVG={<BiUserPlus />}
                    name={
                      requests &&
                      requests.length > 0 && (
                        <div>
                          <p>{requests.length}</p>
                        </div>
                      )
                    }
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
                className="buttonNotification"
                name={
                  <div>
                    {requests && requests.length > 0 && (
                      <p>{requests.length}</p>
                    )}
                  </div>
                }
                SVG={isMenu ? <CgClose /> : <BiMenu />}
              />
            </div>
          </header>
        )}
        <main>
          <div />
          <ul>
            <li>
              <Navigate
                to="/"
                className="transparent"
                onClick={handleMenuChange}
                SVG={<BiSolidHome />}
                name="Home"
              />
            </li>
            <li>
              <Navigate
                to={`/profile/${user?.user_id}`}
                className="transparent"
                onClick={handleMenuChange}
                SVG={<BiSolidUser />}
                name="Profile"
              />
            </li>
            <li>
              <Navigate
                to="/friends"
                className="transparent"
                onClick={handleMenuChange}
                SVG={<BiSolidGroup />}
                name="Friends"
              />
            </li>
            <li>
              <Navigate
                to="/requests"
                className="transparent"
                onClick={handleMenuChange}
                SVG={<BiUserPlus />}
                name={
                  <div>
                    <div>Requests</div>
                    {requests && requests.length > 0 && (
                      <p>{requests.length}</p>
                    )}
                  </div>
                }
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
            <Button
              type="button"
              onClick={handleMenuChange}
              label="menu"
              className="buttonNotification"
              SVG={isMenu ? <CgClose /> : <BiMenu />}
            />
          </ul>
        </main>
      </nav>
    </>
  );
};
