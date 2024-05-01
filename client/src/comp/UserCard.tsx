import {type Contact} from '../users/usersFetchRequests';
import logo from '../assets/Voxieverse_logo.png';
import './style/UserCard.scss';

export function UserCard({user}: {user: Contact}) {
	return (
		<button type='button' className='userCard'>
			<header>
				<img alt='user' src={logo} className='logo'/>
				<div>
					<div>{user?.username}</div>
					<p>{user?.email}</p>
				</div>
			</header>
			<footer></footer>
		</button>
	);
}
