import {Link} from 'react-router-dom';
import logo from '../assets/Voxieverse_logo.png';
import './style/Error.scss';

export function Error() {
	return (
		<div id='error'>
			<header>
				<img alt='' src={logo}/>
			</header>
			<main>
				<h1>Error</h1>
				<Link to='/' onClick={() => {
					window.location.reload();
				}}>Try again</Link>
			</main>
		</div>
	);
}
