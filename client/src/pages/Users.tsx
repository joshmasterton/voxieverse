import {type ChangeEvent, useEffect, useState} from 'react';
import {type User} from '../context/UserContext';
import {Loading} from '../comp/Loading';
import {NavReturn} from '../comp/NavReturn';
import {UserCard} from '../comp/UserCard';
import {fetchGetUsers} from '../fetchRequests/usersFetchRequests';
import {MdClear} from 'react-icons/md';
import {CgChevronUp} from 'react-icons/cg';
import {BiSearch} from 'react-icons/bi';
import './style/Users.scss';

export function Users() {
	const [users, setUsers] = useState<User [] | undefined>(undefined);
	const [sortUsers, setSortUsers] = useState<User [] | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchInput, setSearchInput] = useState<string>('');

	useEffect(() => {
		setTimeout(() => {
			fetchGetUsers()
				.then(usersFromRequest => {
					setUsers(usersFromRequest);
					setSortUsers(usersFromRequest);
					setLoading(false);
				})
				.catch(err => {
					console.error(err);
					setLoading(false);
				});
		}, 1000);
	}, []);

	useEffect(() => {
		setSortUsers(users);
		setSortUsers(users => users?.filter(user => user.username.toLocaleLowerCase().includes(searchInput)
			|| user.username.includes(searchInput)));
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
									<MdClear/>
								</button>
							</div>
						</form>
						<button type='button' id='up' onClick={() => {
							handleScrollToTop();
						}}>
							<CgChevronUp/>
						</button>
						{sortUsers?.map(user => (
							<UserCard key={user.username} user={user} />
						))}
					</>
				)}
			</div>
		</>
	);
}
