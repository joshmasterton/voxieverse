export type Contact = {
	username: string;
	email: string;
	createdAt: string;
	lastOnline: string;
};

const apiUrl = 'http://localhost:9001';

export const fetchGetUsers = async (): Promise<Contact[] | undefined> => {
	try {
		const getUsersResponse = await fetch(`${apiUrl}/getUsers`, {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
		});

		if (!getUsersResponse.ok) {
			return undefined;
		}

		const getUsersData: Contact[] = await getUsersResponse.json() as Contact[];

		return getUsersData;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};
