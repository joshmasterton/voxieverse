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
import { useNavigate } from 'react-router-dom';
import '../style/comp/Nav.scss';

export const Nav = ({ isReturn = false }: { isReturn?: boolean }) => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { requests } = useNotification();
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

  useEffect(() => {
    if (isReturn) {
      setIsMenu(false);
    }
  }, [isReturn]);

  return (
    <>
      <SideUser requests={requests} />
      <nav className={isMenu ? 'active' : 'hidden'}>
        {isReturn ? (
          <header id="returnNav">
            <div>
              <Button
                type="button"
                label="back"
                onClick={() => navigate(-1)}
                SVG={<IoIosArrowBack />}
                className="transparent"
              />
              <Navigate
                to={`/profile/${user?.user_id}`}
                onClick={() => {}}
                SVG={<img alt="" src={user?.profile_picture} />}
              />
            </div>
          </header>
        ) : (
          <header>
            <div>
              <Navigate
                to={`/profile/${user?.user_id}`}
                onClick={handleMenuChange}
                SVG={<img alt="" src={user?.profile_picture} />}
              />
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
                      requests > 0 && (
                        <div>
                          <p>{requests}</p>
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
                name={<div>{requests > 0 && <p>{requests}</p>}</div>}
                SVG={isMenu ? <CgClose /> : <BiMenu />}
              />
            </div>
          </header>
        )}
        {!isReturn && (
          <main>
            <div>
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
                        {requests > 0 && <p>{requests}</p>}
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
              </ul>
            </div>
          </main>
        )}
      </nav>
    </>
  );
};
