import {type ChangeEvent, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {LightMode} from '../context/LightModeContext';
import {useUser} from '../context/UserContext';
import {fetchLogout} from '../auth/authFetchRequests';
import {BiSearch, BiUser} from 'react-icons/bi';
import {MdClear} from 'react-icons/md';
import {CgLogOut, CgMenu} from 'react-icons/cg';
import logo from '../assets/Voxieverse_logo.png';
import './style/Nav.scss';

export function Nav() {
	const {user, setUser} = useUser();
	const naviate = useNavigate();
	const [isMenu, setIsMenu] = useState<boolean>(false);
	const [searchInput, setSearchInput] = useState<string>('');

	const handleSwitchMenu = () => {
		setIsMenu(!isMenu);
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const {value} = e.target;
		setSearchInput(value);
	};

	const handleSearchClear = () => {
		setSearchInput('');
	};

	const handleLogout = async () => {
		await fetchLogout();
		setUser(undefined);
		naviate('/login');
	};

	return (
		<nav id='nav'>
			<header>
				<img className='logo' alt='' src={logo}/>
				<button type='button' aria-label='Menu' onClick={() => {
					handleSwitchMenu();
				}}>
					<CgMenu/>
				</button>
			</header>
			<main>
				<img className='logo' alt='' src={logo}/>
				<div className='label'>
					<label>
						<BiSearch/>
						<input
							type='text'
							placeholder='Search posts'
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
				<Link to='/'>
					<BiUser/>
				</Link>
				<Link to='/'>
					<BiUser/>
				</Link>
				<button type='button' onClick={async () => {
					await handleLogout();
				}}>
					<CgLogOut/>
				</button>
				<LightMode/>
			</main>
			<footer className={isMenu ? 'open' : 'close'}>
				<Link to='/'>
					<BiUser/>
					{user?.username}
				</Link>
				<Link to='/'>
					<BiUser/>
					User
				</Link>
				<button type='button' onClick={async () => {
					await handleLogout();
				}}>
					<CgLogOut/>
					Logout
				</button>
				<LightMode/>
			</footer>
		</nav>
	);
}
