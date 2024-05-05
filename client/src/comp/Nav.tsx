import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {LightMode} from '../context/LightModeContext';
import {useUser} from '../context/UserContext';
import {fetchLogout} from '../fetchRequests/authFetchRequests';
import {BiGroup, BiUser} from 'react-icons/bi';
import {CgLogOut, CgMenu} from 'react-icons/cg';
import logo from '../assets/Voxieverse_logo.png';
import './style/Nav.scss';

export function Nav() {
	const naviate = useNavigate();
	const {user, setUser} = useUser();
	const [isMenu, setIsMenu] = useState<boolean>(false);

	const handleSwitchMenu = () => {
		setIsMenu(!isMenu);
	};

	const handleLogout = async () => {
		await fetchLogout();
		setUser(undefined);
		naviate('/login');
	};

	const handleScroll = () => {
		setIsMenu(false);
	};

	useEffect(() => {
		window.addEventListener('scroll', () => {
			handleScroll();
		});

		return () => {
			window.removeEventListener('scroll', () => {
				handleScroll();
			});
		};
	}, []);

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
				<h1>
					<img className='logo' alt='' src={logo}/>
				</h1>
				<Link to={`/profile/${user?.username}`}>
					<BiUser/>
				</Link>
				<Link to='/users'>
					<BiGroup/>
				</Link>
				<button type='button' onClick={async () => {
					await handleLogout();
				}}>
					<CgLogOut/>
				</button>
				<LightMode/>
			</main>
			<footer className={isMenu ? 'open' : 'close'}>
				<Link to={`/profile/${user?.username}`}>
					<BiUser/>
					{user?.username}
				</Link>
				<Link to='/users'>
					<BiGroup/>
					Users
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
