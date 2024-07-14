import { useState } from 'react';
import { Input } from '../comp/Input.comp';
import { Button, ButtonTheme } from '../comp/Button.comp';
import { Navigate } from '../comp/Navigate.comp';
import { RiLockPasswordFill } from 'react-icons/ri';
import { MdEmail } from 'react-icons/md';
import { GiToken } from 'react-icons/gi';
import {
  ForgotDetails,
  ForgotPasswordProps
} from '../../types/page/ForgotPassword.page.types';
import '../style/page/Auth.page.scss';

export const ForgotPassword = ({ isReset = false }: ForgotPasswordProps) => {
  const [forgotDetails, setForgotDetails] = useState({
    email: '',
    token: '',
    newPassword: '',
    newConfirmPassword: ''
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
              SVG={<GiToken />}
            />
            <Input<ForgotDetails>
              id="newPassword"
              className="labelPassword"
              type="password"
              value={forgotDetails.newPassword}
              setValue={setForgotDetails}
              placeholder="New password"
              SVG={<RiLockPasswordFill />}
            />{' '}
            <Input<ForgotDetails>
              id="newConfirmPassword"
              className="labelPassword"
              type="password"
              value={forgotDetails.newConfirmPassword}
              setValue={setForgotDetails}
              placeholder="Confirm new password"
              SVG={<RiLockPasswordFill />}
            />
          </>
        ) : (
          <Input<ForgotDetails>
            id="email"
            type="email"
            value={forgotDetails.email}
            setValue={setForgotDetails}
            placeholder="Email"
            SVG={<MdEmail />}
          />
        )}
        {isReset ? (
          <Navigate
            to="/forgotPassword"
            name="Forgot password?"
            onClick={() => {}}
          />
        ) : (
          <Navigate
            to="/resetPassword"
            name="Reset password?"
            onClick={() => {}}
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
        <Navigate to="/login" name="Login" onClick={() => {}} />
      </footer>
    </form>
  );
};
