import {
	type ReactNode, createContext, useContext, useEffect, useState,
	type Dispatch, type SetStateAction,
} from 'react';
import {fetchValidateUser} from '../fetchRequests/authFetchRequests';
import {LoadingTransparent} from '../comp/Loading';

type UserContextType = {
	user: User | undefined;
	setUser: Dispatch<SetStateAction<User | undefined>>;
};

export type User = {
	username: string;
	email: string;
	createdAt: string;
	lastOnline: string;
};

export type UserWithFriendship = {
	username: string;
	email: string;
	createdAt: string;
	lastOnline: string;
	friendshipStatus: string | undefined;
};

export type ValidationError = {
	validationError: string;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error('userUser muse be used withing UserProvider');
	}

	return context;
};

export const UserProvider = ({children}: {children: ReactNode}) => {
	const [user, setUser] = useState<User | undefined>(undefined);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
			setTimeout(async () => {
				const fetchUser = await fetchValidateUser();
				setUser(fetchUser);
				setLoading(false);
			}, 300);
		};

		fetchUser()
			.catch(err => {
				console.error(err.message);
				setLoading(false);
			});

		const checkUserInterval = setInterval(async () => {
			const fetchUser = await fetchValidateUser();
			setUser(fetchUser);
			setLoading(false);
		}, 60000);

		return () => {
			clearInterval(checkUserInterval);
		};
	}, []);

	if (loading) {
		return <LoadingTransparent/>;
	}

	return (
		<UserContext.Provider value={{user, setUser}}>
			{children}
		</UserContext.Provider>
	);
};
