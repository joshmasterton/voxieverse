import {useNavigate} from 'react-router-dom';
import {LightMode} from '../context/LightModeContext';
import {CgChevronLeft} from 'react-icons/cg';
import './style/NavReturn.scss';

export function NavReturn() {
	const navigate = useNavigate();

	return (
		<nav id='navReturn'>
			<button type='button' onClick={() => {
				navigate(-1);
			}}>
				<CgChevronLeft/>
			</button>
			<LightMode/>
		</nav>
	);
}
