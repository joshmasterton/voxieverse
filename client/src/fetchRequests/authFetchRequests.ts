import {type User, type ValidationError} from '../context/UserContext';
import {apiUrl} from '../main';

export const fetchLogin = async <T>(authInfo: T): Promise<User | ValidationError | undefined> => {
	try {
		const loginResponse = await fetch(`${apiUrl}/login`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify(authInfo),
		});

		if (!loginResponse.ok) {
			return undefined;
		}

		const loginData: User | ValidationError = await loginResponse.json() as User | ValidationError;

		if ('username' in loginData) {
			return loginData;
		}

		if ('validationError' in loginData) {
			return loginData;
		}

		return undefined;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};

export const fetchSignup = async <T>(authInfo: T): Promise<User | ValidationError | undefined> => {
	try {
		const signupResponse = await fetch(`${apiUrl}/signup`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify(authInfo),
		});

		if (!signupResponse.ok) {
			return undefined;
		}

		const signupData: User | ValidationError = await signupResponse.json() as User | ValidationError;

		if ('username' in signupData) {
			return signupData;
		}

		if ('validationError' in signupData) {
			return signupData;
		}

		return undefined;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};

export const fetchValidateUser = async (): Promise<User | undefined> => {
	try {
		const validateUserResponse = await fetch(`${apiUrl}/validateUser`, {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
		});

		const validateUserData: User = await validateUserResponse.json() as User;
		if (validateUserData.username) {
			return validateUserData;
		}

		return undefined;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
			return undefined;
		}
	}
};

export const fetchLogout = async (): Promise<string | undefined> => {
	try {
		const fetchLogoutResponse = await fetch(`${apiUrl}/logout`, {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
		});

		const logoutData: string | undefined = await fetchLogoutResponse.json() as string | undefined;
		return logoutData;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};

