import {useEffect, useState} from 'react';
import {UserProfile} from './UserProfile';
import {fetchGetUsers, type Contact} from '../users/usersFetchRequests';
import {Loading} from './Loading';
import {UserCard} from './UserCard';
import './style/Side.scss';

export function Side({side}: {side: string}) {
	const [loading, setLoading] = useState<boolean>(true);
	const [users, setUsers] = useState<Contact [] | undefined>(undefined);

	useEffect(() => {
		setTimeout(() => {
			fetchGetUsers()
				.then(usersFromRequest => {
					setUsers(usersFromRequest);
					setLoading(false);
				})
				.catch(err => {
					console.error(err);
					setLoading(false);
				});
		}, 1000);
	}, []);

	console.log(users);

	return (
		<div className={`side ${side}`}>
			{loading ? (
				<Loading onlyComponent={false} marginTop='1rem' height='calc(100% - 2rem)' border=''/>
			) : (
				<>
					{side === 'left' && <UserProfile/>}
					{side === 'right' && (
						<div id='users'>
							<h1>Users</h1>
							{users?.map(user => (
								<UserCard key={user.username} user={user}/>
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
}
