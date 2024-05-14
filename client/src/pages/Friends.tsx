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
	const [loadingMore, setLoadingMore] = useState(false);
	const [page, setPage] = useState(0);
	const [noMoreUsers, setNoMoreUsers] = useState(true);
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
			fetchGetUsers(true, searchInput, page)
				.then(usersFromRequest => {
					if (usersFromRequest && usersFromRequest.length > 0) {
						if (usersFromRequest.length === 10) {
							setNoMoreUsers(false);
						} else {
							setNoMoreUsers(true);
						}

						setUsersFriends(usersFromRequest?.filter(user => user.friendshipStatus === 'accepted'));
						setUsersFriendsWaiting(usersFromRequest?.filter(user => user.friendshipStatus === 'pending'));
						setPage(prevPage => prevPage + 1);
					}

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

	const fetchMoreUsers = async () => {
		setLoadingMore(true);
		setTimeout(() => {
			fetchGetUsers(true, searchInput, page + 1)
				.then(usersFromRequest => {
					if (usersFromRequest && usersFromRequest.length > 0) {
						if (usersFromRequest.length === 10) {
							setNoMoreUsers(false);
						} else {
							setNoMoreUsers(true);
						}

						const filteredFriends = usersFromRequest?.filter(user => user.friendshipStatus === 'accepted');
						const filteredFriendsInWaiting = usersFromRequest?.filter(user => user.friendshipStatus === 'pending');

						setUsersFriends(prevUsers => {
							if (prevUsers && filteredFriends) {
								return [...prevUsers, ...filteredFriends];
							}

							return prevUsers;
						});

						setUsersFriendsWaiting(prevUsers => {
							if (prevUsers && filteredFriendsInWaiting) {
								return [...prevUsers, ...filteredFriendsInWaiting];
							}

							return prevUsers;
						});

						setPage(prevPage => prevPage + 1);
					}

					setLoadingMore(false);
				})
				.catch(err => {
					console.error(err);
					setLoadingMore(false);
				});
		}, 300);
	};

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
								{(usersFriends?.length ?? 0) === 0 ? <h2>No friends yet</h2> : <h2>Friends</h2>}
								{usersFriends?.map(user => (
									<UserCard key={user.username} user={user} />
								))}
								{(usersFriendsWaiting?.length ?? 0) === 0 ? '' : <h2>Friends in waiting</h2>}
								{usersFriendsWaiting?.map(user => (
									<UserCard key={user.username} user={user} />
								))}
								{noMoreUsers ? null : (
									<button type='button' className='fetchMore' onClick={async () => fetchMoreUsers()}>
										{loadingMore ? (
											<LoadingButtonTransparent/>
										) : 'Load more...'}
									</button>
								)}
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
