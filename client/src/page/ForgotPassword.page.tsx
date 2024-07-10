import { useState } from 'react';
import { Input } from '../comp/Input.comp';
import { TfiEmail } from 'react-icons/tfi';
import { Button, ButtonTheme } from '../comp/Button.comp';
import { Navigate } from '../comp/Navigate.comp';
import { RiLockPasswordLine } from 'react-icons/ri';
import { RxTokens } from 'react-icons/rx';
import {
  ForgotDetails,
  ForgotPasswordProps
} from '../../types/page/ForgotPassword.page.types';
import '../style/page/Auth.page.scss';

export const ForgotPassword = ({ isReset = false }: ForgotPasswordProps) => {
  const [forgotDetails, setForgotDetails] = useState({
    email: '',
    token: '',
    password: '',
    confirmPassword: ''
  });

  return (
    <form id="auth" method="POST" autoComplete="off">
      <header>
        <h1>{isReset ? 'Reset password' : 'Forgot password'}</h1>
        <ButtonTheme />
      </header>
      <main>
        {isReset ? (
          <>
            <Input<ForgotDetails>
              id="token"
              type="text"
              value={forgotDetails.token}
              setValue={setForgotDetails}
              placeholder="Token"
              SVG={<RxTokens />}
            />
            <Input<ForgotDetails>
              id="password"
              className="labelPassword"
              type="password"
              value={forgotDetails.password}
              setValue={setForgotDetails}
              placeholder="Password"
              SVG={<RiLockPasswordLine />}
            />{' '}
            <Input<ForgotDetails>
              id="confirmPassword"
              className="labelPassword"
              type="password"
              value={forgotDetails.confirmPassword}
              setValue={setForgotDetails}
              placeholder="Confirm password"
              SVG={<RiLockPasswordLine />}
            />
          </>
        ) : (
          <Input<ForgotDetails>
            id="email"
            type="email"
            value={forgotDetails.email}
            setValue={setForgotDetails}
            placeholder="Email"
            SVG={<TfiEmail />}
          />
        )}
        {isReset ? (
          <Navigate
            to="/forgotPassword"
            name="Forgot password?"
            onClick={(e) => e?.currentTarget.blur()}
          />
        ) : (
          <Navigate
            to="/resetPassword"
            name="Reset password?"
            onClick={(e) => e?.currentTarget.blur()}
          />
        )}
        <Button
          type="submit"
          onClick={() => {}}
          label={isReset ? 'resetPassword' : 'sendEmail'}
          className="buttonPrimary"
          name={isReset ? 'Reset' : 'Send'}
        />
      </main>
      <footer>
        <div>Remember your password?</div>
        <Navigate
          to="/login"
          name="Login"
          onClick={(e) => e?.currentTarget.blur()}
        />
      </footer>
    </form>
  );
};
