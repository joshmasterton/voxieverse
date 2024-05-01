import {Link} from 'react-router-dom';
import {LightMode} from '../context/LightModeContext';
import {CgChevronLeft} from 'react-icons/cg';
import './style/ReturnNav.scss';

export function ReturnNav() {
	return (
		<nav id='returnNav'>
			<Link to='/'>
				<CgChevronLeft/>
			</Link>
			<LightMode/>
		</nav>
	);
}
