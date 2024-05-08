import {useNavigate} from 'react-router-dom';
import {type ChangeEvent, useEffect, useState} from 'react';
import {useUser, type UserWithFriendship} from '../context/UserContext';
import {Loading, LoadingButtonTransparent} from '../comp/Loading';
import {NavReturn} from '../comp/NavReturn';
import {UserCard} from '../comp/UserCard';
import {SideFriends, SideUser} from '../comp/Side';
import {fetchGetUsers} from '../fetchRequests/usersFetchRequests';
import {MdClear} from 'react-icons/md';
import {CgChevronUp} from 'react-icons/cg';
import {BiSearch} from 'react-icons/bi';
import './style/FindUsers.scss';

export function FindUsers() {
	const navigate = useNavigate();
	const {user} = useUser();
	const [users, setUsers] = useState<UserWithFriendship [] | undefined>(undefined);
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
			fetchGetUsers(false, searchInput)
				.then(usersFromRequest => {
					setUsers(usersFromRequest?.filter(user => user.friendshipStatus === undefined));
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

	const handleScrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
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
											placeholder='Find user...'
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
							<button type='button' id='up' onClick={() => {
								handleScrollToTop();
							}}>
								<CgChevronUp/>
							</button>
							<div className='usersList'>
								{(users?.length ?? 0) === 0 ? '' : <h2>People</h2>}
								{users?.map(user => (
									<UserCard key={user.username} user={user} />
								))}
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
