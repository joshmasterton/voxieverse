import {
  BiSolidGroup,
  BiSolidHome,
  BiSolidUser,
  BiUserPlus
} from 'react-icons/bi';
import { useUser } from '../context/User.context';
import { Navigate } from './Navigate.comp';
import { Button, ButtonTheme } from './Button.comp';
import { IoLogOut } from 'react-icons/io5';
import { useState } from 'react';
import '../style/comp/Side.comp.scss';

export const Side = () => {
  return (
    <div id="side">
      <div>
        <div />
      </div>
    </div>
  );
};

export const SideUser = ({ requests }: { requests: number }) => {
  const { user, logout } = useUser();
  const [loading, setLoading] = useState(false);

  return (
    <div id="sideUser">
      <div>
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
        </main>
      </div>
    </div>
  );
};
