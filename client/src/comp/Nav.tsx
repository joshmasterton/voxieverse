import {type ChangeEvent, useState} from 'react';
import {Link} from 'react-router-dom';
import {LightMode} from '../context/LightModeContext';
import {BiSearch, BiUser} from 'react-icons/bi';
import {MdClear} from 'react-icons/md';
import {CgLogOut, CgMenu} from 'react-icons/cg';
import logoLight from '../assets/Voxieverse_logo_light-modified.png';
import './style/Nav.scss';

export function Nav() {
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

	return (
		<nav id='nav'>
			<header>
				<img className='logo' alt='' src={logoLight}/>
				<button type='button' aria-label='Menu' onClick={() => {
					handleSwitchMenu();
				}}>
					<CgMenu/>
				</button>
			</header>
			<main>
				<img className='logo' alt='' src={logoLight}/>
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
				<Link to='/login'>
					<CgLogOut/>
				</Link>
				<LightMode/>
			</main>
			<footer className={isMenu ? 'open' : 'close'}>
				<Link to='/'>
					<BiUser/>
					User
				</Link>
				<Link to='/'>
					<BiUser/>
					User
				</Link>
				<Link to='/login'>
					<CgLogOut/>
					Logout
				</Link>
				<LightMode/>
			</footer>
		</nav>
	);
}
