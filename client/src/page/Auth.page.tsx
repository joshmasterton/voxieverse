import { AuthProps, UserDetails } from '../../types/page/Auth.page.types';
import { BiUser } from 'react-icons/bi';
import { Input } from '../comp/Input.comp';
import { FormEvent, MouseEvent, useState } from 'react';
import { Button, ButtonTheme } from '../comp/Button.comp';
import { Navigate } from '../comp/Navigate.comp';
import { request } from '../utilities/request.utilities';
import { TfiEmail } from 'react-icons/tfi';
import { BsImage } from 'react-icons/bs';
import { RiLockPasswordLine } from 'react-icons/ri';
import '../style/page/Auth.page.scss';

export const Auth = ({ isSignup = false }: AuthProps) => {
  const [userDetails, setUserDetails] = useState<UserDetails>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: undefined
  });

  const handleOnNavigate = (e: MouseEvent<HTMLAnchorElement>) => {
    e?.currentTarget?.blur();
    setUserDetails({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      profilePicture: undefined
    });
  };

  const handleOnSubmit = async (e: FormEvent) => {
    try {
      e?.preventDefault();
      if (isSignup) {
        const signup = await request('/signup', 'POST', userDetails);
        console.log(signup);
      } else {
        const login = await request('/login', 'POST', userDetails);
        console.log(login);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <form
      id="auth"
      method="POST"
      autoComplete="off"
      onSubmit={(e) => handleOnSubmit(e)}
    >
      <header>
        <h1>{isSignup ? 'Signup' : 'Login'}</h1>
        <ButtonTheme />
      </header>
      <main>
        <Input<UserDetails>
          id="username"
          type="text"
          value={userDetails.username}
          setValue={setUserDetails}
          placeholder="Username"
          SVG={<BiUser />}
        />
        {isSignup && (
          <>
            <Input<UserDetails>
              id="email"
              type="email"
              value={userDetails.email}
              setValue={setUserDetails}
              placeholder="Email"
              SVG={<TfiEmail />}
            />
            <Input<UserDetails>
              id="profilePicture"
              type="file"
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
          value={userDetails.password}
          setValue={setUserDetails}
          placeholder="Password"
          SVG={<RiLockPasswordLine />}
        />
        {!isSignup && (
          <Navigate
            to="/forgotPassword"
            name="Forgot password?"
            onClick={() => {}}
          />
        )}
        {isSignup && (
          <Input<UserDetails>
            id="confirmPassword"
            className="labelPassword"
            type="password"
            value={userDetails.confirmPassword}
            setValue={setUserDetails}
            placeholder="Confirm password"
            SVG={<RiLockPasswordLine />}
          />
        )}
        <Button
          type="submit"
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
              onClick={(e) => handleOnNavigate(e)}
            />
          </>
        ) : (
          <>
            <div>Dont have an account?</div>
            <Navigate
              to="/signup"
              name="Signup"
              onClick={(e) => handleOnNavigate(e)}
            />
          </>
        )}
      </footer>
    </form>
  );
};
