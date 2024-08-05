import { AuthProps, UserDetails } from '../../types/page/Auth.page.types';
import { BiSolidUser } from 'react-icons/bi';
import { Input } from '../comp/Input.comp';
import { FormEvent, useState } from 'react';
import { Button, ButtonTheme } from '../comp/Button.comp';
import { Navigate } from '../comp/Navigate.comp';
import { request } from '../utilities/request.utilities';
import { useUser } from '../context/User.context';
import { BsImage } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { usePopup } from '../context/Popup.context';
import { useTheme } from '../context/Theme.context';
import logoDark from '../../public/voxieverse_logo_dark.png';
import logoLight from '../../public/voxieverse_logo_light.png';
import '../style/page/Auth.page.scss';

export const Auth = ({ isSignup = false }: AuthProps) => {
  const { setUser } = useUser();
  const { theme } = useTheme();
  const { setPopup } = usePopup();
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    file: undefined
  });

  const handleOnNavigate = () => {
    setUserDetails({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      file: undefined
    });
  };

  const handleOnSubmit = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      setLoading(true);

      if (isSignup) {
        const formData = new FormData();
        formData.append('username', userDetails.username);
        formData.append('email', userDetails.email);
        formData.append('password', userDetails.password);
        formData.append('confirmPassword', userDetails.confirmPassword);

        if (userDetails.file) {
          formData.append('file', userDetails.file);
        }

        const signup = await request('/signup', 'POST', formData);
        if (signup) {
          setUser(signup);
        }
      } else {
        const login = await request('/login', 'POST', userDetails);
        if (login) {
          setUser(login);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        setPopup(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth">
      <form
        method="POST"
        autoComplete="off"
        noValidate
        onSubmit={(e) => handleOnSubmit(e)}
      >
        <header>
          <img alt="" src={theme === 'dark' ? logoLight : logoDark} />
          <h1>{isSignup ? 'Signup' : 'Login'}</h1>
          <ButtonTheme />
        </header>
        <main>
          <Input<UserDetails>
            id="username"
            type="text"
            value={userDetails.username}
            disabled={loading}
            setValue={setUserDetails}
            placeholder="Username"
            SVG={<BiSolidUser />}
          />
          {isSignup && (
            <>
              <Input<UserDetails>
                id="email"
                type="email"
                disabled={loading}
                value={userDetails.email}
                setValue={setUserDetails}
                placeholder="Email"
                SVG={<MdEmail />}
              />
              <Input<UserDetails>
                id="file"
                type="file"
                disabled={loading}
                className="file"
                setValue={setUserDetails}
                placeholder="Profile picture"
                SVG={<BsImage />}
              />
            </>
          )}
          <Input<UserDetails>
            id="password"
            className="labelPassword"
            type="password"
            disabled={loading}
            value={userDetails.password}
            setValue={setUserDetails}
            placeholder="Password"
            SVG={<RiLockPasswordFill />}
          />
          {isSignup && (
            <Input<UserDetails>
              id="confirmPassword"
              className="labelPassword"
              disabled={loading}
              type="password"
              value={userDetails.confirmPassword}
              setValue={setUserDetails}
              placeholder="Confirm password"
              SVG={<RiLockPasswordFill />}
            />
          )}
          <Button
            type="submit"
            loading={loading}
            onClick={() => {}}
            label={isSignup ? 'signup' : 'login'}
            className="buttonPrimary"
            name={isSignup ? 'Signup' : 'Login'}
          />
        </main>
        <footer>
          {isSignup ? (
            <>
              <div>Already have an account?</div>
              <Navigate
                to="/login"
                name="Login"
                onClick={() => handleOnNavigate()}
              />
            </>
          ) : (
            <>
              <div>Dont have an account?</div>
              <Navigate
                to="/signup"
                name="Signup"
                onClick={() => handleOnNavigate()}
              />
            </>
          )}
        </footer>
      </form>
    </div>
  );
};
