import { UserDetails } from '../../types/page/Auth.page.types';
import { EditDetails } from '../../types/utilities/request.utilities.types';

export const validatorCheck = (
  details: UserDetails | EditDetails,
  isSignup = false,
  isAuth = true
) => {
  if (
    details.username === '' &&
    details.email === '' &&
    details.file === undefined &&
    details.password === ''
  ) {
    return;
  }

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (details.username.length < 6) {
    if (isAuth) {
      return {
        type: 'username',
        text: 'Username must be at least 6 characters'
      };
    } else if (details.username.length > 0) {
      return {
        type: 'username',
        text: 'Username must be at least 6 characters'
      };
    }
  }

  if (isSignup && !emailRegex.test(details.email)) {
    if (isAuth) {
      return {
        type: 'email',
        text: 'Must be a valid email type'
      };
    } else if (!isAuth && details.email.length > 0) {
      return {
        type: 'email',
        text: 'Must be a valid email type'
      };
    }
  }

  if (isSignup && !details.file && isAuth) {
    return {
      type: 'file',
      text: 'Profile picture required'
    };
  }

  if (details.password.length < 6) {
    if (isAuth) {
      return {
        type: 'password',
        text: 'Password must be at least 6 characters'
      };
    } else if (!isAuth && details.password.length > 0) {
      return {
        type: 'password',
        text: 'Password must be at least 6 characters'
      };
    }
  }

  if (isSignup && details.password !== details.confirmPassword) {
    return {
      type: 'confirmPassword',
      text: 'Passwords must match'
    };
  }
};
