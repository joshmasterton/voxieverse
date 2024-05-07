import {Link} from 'react-router-dom';
import {type ChangeEvent, useEffect, useState} from 'react';
import {type UserWithFriendship} from '../context/UserContext';
import {Loading} from '../comp/Loading';
import {NavReturn} from '../comp/NavReturn';
import {UserCard} from '../comp/UserCard';
import {fetchGetUsers} from '../fetchRequests/usersFetchRequests';
import {MdClear} from 'react-icons/md';
import {BiPlus, BiSearch} from 'react-icons/bi';
import './style/Users.scss';

export function Friends() {
	const [usersFriends, setUsersFriends] = useState<UserWithFriendship[] | undefined>(undefined);
	const [usersFriendsWaiting, setUsersFriendsWaiting] = useState<UserWithFriendship[] | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(true);
	const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
	const [searchInput, setSearchInput] = useState<string>('');

	useEffect(() => {
		setLoadingSearch(true);
		setTimeout(() => {
			fetchGetUsers(true, searchInput)
				.then(usersFromRequest => {
					setUsersFriends(usersFromRequest?.filter(user => user.friendshipStatus === 'accepted'));
					setUsersFriendsWaiting(usersFromRequest?.filter(user => user.friendshipStatus === 'pending'));
					setLoadingSearch(false);
					setLoading(false);
				})
				.catch(err => {
					console.error(err);
					setLoadingSearch(false);
					setLoading(false);
				});
		}, 1000);
	}, [searchInput]);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {value} = e.target;
		setSearchInput(value);
	};

	const handleSearchClear = () => {
		setSearchInput('');
	};

	return (
		<>
			<NavReturn/>
			<div id='users'>
				{loading ? (
					<Loading onlyComponent={false} border=''/>
				) : (
					<>
						<form method='GET' autoComplete='off'>
							<div className='label'>
								<label>
									<BiSearch/>
									<input
										type='text'
										name='search'
										placeholder='Find friend...'
										value={searchInput}
										onChange={e => {
											handleInputChange(e);
										}}
										maxLength={120}
									/>
								</label>
								<button type='button' onClick={() => {
									handleSearchClear();
								}}>
									{loadingSearch ? (
										<Loading onlyComponent={false} border='0'/>
									) : <MdClear/>}
								</button>
							</div>
						</form>
						<Link to='/findUser' id='findUser' aria-label='Find user'>
							<BiPlus/>
						</Link>
						{(usersFriends?.length ?? 0) === 0 ? '' : 'Friends'}
						{usersFriends?.map(user => (
							<UserCard key={user.username} user={user} />
						))}
						{(usersFriendsWaiting?.length ?? 0) === 0 ? '' : 'Friends in waiting'}
						{usersFriendsWaiting?.map(user => (
							<UserCard key={user.username} user={user} />
						))}
					</>
				)}
			</div>
		</>
	);
}
