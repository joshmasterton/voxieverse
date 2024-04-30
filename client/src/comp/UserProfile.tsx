import {useUser} from '../context/UserContext';
import logo from '.././assets/Voxieverse_logo.png';
import './style/UserProfile.scss';

export function UserProfile() {
	const {user} = useUser();

	return (
		<div className='userProfile'>
			<header>
				<img className='logo' alt='User' src={logo}/>
				<h1>{user?.username}</h1>
				<p>{user?.email}</p>
			</header>
			<main>
				Short bio and description of the user,
				maybe a favourite hobby or interests
			</main>
			<footer>
				<p>
					{user?.lastOnline}
				</p>
			</footer>
		</div>
	);
}
