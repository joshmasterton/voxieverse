import {type User} from '../context/UserContext';

const apiUrl = 'http://localhost:9001';

export const fetchGetUsers = async (): Promise<User[] | undefined> => {
	try {
		const getUsersResponse = await fetch(`${apiUrl}/getUsers`, {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
		});

		if (!getUsersResponse.ok) {
			return undefined;
		}

		const getUsersData: User[] = await getUsersResponse.json() as User[];

		return getUsersData;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};

export const fetchGetUser = async (username: string | undefined): Promise<User | undefined> => {
	try {
		if (username) {
			const getContactResponse = await fetch(`${apiUrl}/getContact/${username}`, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'},
				credentials: 'include',
			});

			if (!getContactResponse.ok) {
				return undefined;
			}

			const getContactData: User | {error: string} = await getContactResponse.json() as User | {error: string};

			if ('error' in getContactData) {
				throw new Error('No user here');
			}

			return getContactData;
		}

		throw new Error('No user here');
	} catch (err) {
		if (err instanceof Error) {
			throw new Error(err.message);
		}
	}
};
