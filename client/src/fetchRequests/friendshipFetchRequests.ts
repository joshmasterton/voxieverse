import {type ValidationError} from '../context/UserContext';
import {apiUrl} from '../main';

export type Friendship = {
	userOne: string;
	userTwo: string;
	userInitiator: string;
	status: string;
	createdAt: string;
};

export const fetchCreateFriendship = async (usernameOne: string, usernameTwo: string): Promise<ValidationError | undefined> => {
	try {
		const createFriendshipResponse = await fetch(`${apiUrl}/createFriendship`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify({usernameOne, usernameTwo}),
		});

		if (!createFriendshipResponse.ok) {
			return undefined;
		}

		const createFriendshipData: ValidationError = await createFriendshipResponse.json() as ValidationError;

		if ('validationError' in createFriendshipData) {
			return createFriendshipData;
		}

		return undefined;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};

export const fetchDeleteFriendship = async (usernameOne: string, usernameTwo: string): Promise<ValidationError | undefined> => {
	try {
		const deleteFriendshipResponse = await fetch(`${apiUrl}/deleteFriendship`, {
			method: 'DELETE',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify({usernameOne, usernameTwo}),
		});

		if (!deleteFriendshipResponse.ok) {
			return undefined;
		}

		const deleteFriendshipData: ValidationError = await deleteFriendshipResponse.json() as ValidationError;

		if ('validationError' in deleteFriendshipData) {
			return deleteFriendshipData;
		}

		return undefined;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};

export const fetchGetFriendship = async (usernameOne: string, usernameTwo: string): Promise<Friendship | undefined> => {
	try {
		const getFriendshipResponse = await fetch(`${apiUrl}/getFriendship/${usernameOne}/${usernameTwo}`, {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
		});

		if (!getFriendshipResponse.ok) {
			return undefined;
		}

		const getFriendshipData: Friendship = await getFriendshipResponse.json() as Friendship;

		if ('status' in getFriendshipData) {
			return getFriendshipData;
		}

		return undefined;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};
