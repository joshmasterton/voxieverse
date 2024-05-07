import {Link} from 'react-router-dom';
import {type UserWithFriendship} from '../context/UserContext';
import logo from '../assets/Voxieverse_logo.png';
import './style/UserCard.scss';

export function UserCard({user}: {user: UserWithFriendship}) {
	return (
		<Link to={`/profile/${user.username}`} className={`userCard ${user.friendshipStatus}`}>
			<header>
				<img alt='user' src={logo} className='logo'/>
				<div>
					<div>{user?.username}</div>
					<p>{user?.email}</p>
				</div>
			</header>
			<footer>
			</footer>
		</Link>
	);
}
