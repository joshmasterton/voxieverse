/* eslint-disable complexity */
import {type ForgottenPasswordType} from './ForgottenPassword';
import {type LoginInfo} from './Login';
import {type SignupInfo} from './Signup';
import './style/Validator.scss';

export type ValidationResult = {
	name: string;
	message: string;
};

export const validation = (authInfo: SignupInfo | LoginInfo | ForgottenPasswordType): ValidationResult | undefined => {
	if ('email' in authInfo && 'confirmPassword' in authInfo) {
		if (
			authInfo.username === ''
			&& authInfo.email === ''
			&& authInfo.password === ''
			&& authInfo.confirmPassword === ''
		) {
			return undefined;
		}

		if (authInfo.username.length < 6) {
			return {name: 'username', message: 'Username must be at least 6 characters'};
		}

		if (authInfo.email.length < 6) {
			const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
			if (!emailRegex.test(authInfo.email)) {
				return {name: 'email', message: 'Muse be a valid email type'};
			}
		}

		if (authInfo.password.length < 6) {
			return {name: 'password', message: 'Password must be at least 6 characters'};
		}

		if (authInfo.confirmPassword !== authInfo.password) {
			return {name: 'confirmPassword', message: 'Passwords must match'};
		}
	}

	if ('email' in authInfo && !('username' in authInfo)) {
		if (authInfo.email.length < 6 && authInfo.email.length > 0) {
			const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
			if (!emailRegex.test(authInfo.email)) {
				return {name: 'email', message: 'Muse be a valid email type'};
			}
		}

		return undefined;
	}

	if (authInfo.username === '' && authInfo.password === '') {
		return undefined;
	}

	if (authInfo.username.length < 6) {
		return {name: 'username', message: 'Username must be at least 6 characters'};
	}

	if (authInfo.password.length < 6) {
		return {name: 'password', message: 'Password must be at least 6 characters'};
	}

	return undefined;
};

export function Validator({value}: {value: string}) {
	return (
		<div id='validator'>
			<div />
			<p>{value}</p>
		</div>
	);
}
