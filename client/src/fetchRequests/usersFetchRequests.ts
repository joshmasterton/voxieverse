import {type UserWithFriendship, type User} from '../context/UserContext';

const apiUrl = 'http://localhost:9001';

export const fetchGetUsers = async (filterFriends: boolean, filter: string | undefined): Promise<UserWithFriendship[] | undefined> => {
	try {
		const getUsersResponse = await fetch(`${apiUrl}/${filterFriends ? `getFriends/${filter}` : `getUsers/${filter}`}`, {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
		});

		if (!getUsersResponse.ok) {
			return undefined;
		}

		const getUsersData: UserWithFriendship[] = await getUsersResponse.json() as UserWithFriendship[];

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
			const getUserResponse = await fetch(`${apiUrl}/getUser/${username}`, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'},
				credentials: 'include',
			});

			if (!getUserResponse.ok) {
				return undefined;
			}

			const getContactData: User | {error: string} = await getUserResponse.json() as User | {error: string};

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
