import {Link, useNavigate} from 'react-router-dom';
import {type ChangeEvent, useEffect, useState} from 'react';
import {useUser, type UserWithFriendship} from '../context/UserContext';
import {Loading, LoadingButtonTransparent} from '../comp/Loading';
import {NavReturn} from '../comp/NavReturn';
import {UserCard} from '../comp/UserCard';
import {SideFriends, SideUser} from '../comp/Side';
import {fetchGetUsers} from '../fetchRequests/usersFetchRequests';
import {MdClear} from 'react-icons/md';
import {BiPlus, BiSearch} from 'react-icons/bi';
import './style/FindUsers.scss';

export function Friends() {
	const navigate = useNavigate();
	const {user} = useUser();
	const [usersFriends, setUsersFriends] = useState<UserWithFriendship[] | undefined>(undefined);
	const [usersFriendsWaiting, setUsersFriendsWaiting] = useState<UserWithFriendship[] | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(true);
	const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
	const [searchInput, setSearchInput] = useState<string>('');

	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user]);

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
		}, 300);
	}, [searchInput]);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {value} = e.target;
		setSearchInput(value);
	};

	const handleSearchClear = () => {
		setSearchInput('');
	};

	if (user) {
		return (
			<>
				<NavReturn/>
				<SideUser
					isLeft
					user={user}
				/>
				<div id='users'>
					{loading ? (
						<Loading/>
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
											<LoadingButtonTransparent/>
										) : <MdClear/>}
									</button>
								</div>
							</form>
							<Link to='/findUser' id='findUser' aria-label='Find user'>
								<BiPlus/>
							</Link>
							<div className='usersList'>
								{(usersFriends?.length ?? 0) === 0 ? '' : <h2>Friends</h2>}
								{usersFriends?.map(user => (
									<UserCard key={user.username} user={user} />
								))}
								{(usersFriendsWaiting?.length ?? 0) === 0 ? '' : <h2>Friends in waiting</h2>}
								{usersFriendsWaiting?.map(user => (
									<UserCard key={user.username} user={user} />
								))}
							</div>
						</>
					)}
				</div>
				<SideFriends
					isLeft={false}
					usersFriends={usersFriends}
					usersFriendsWaiting={usersFriendsWaiting}
					loading={loading}
				/>
			</>
		);
	}
}
