import {FaArrowUpLong, FaArrowDownLong} from 'react-icons/fa6';
import {MdModeComment} from 'react-icons/md';
import logo from '../assets/Voxieverse_logo.png';
import './style/Post.scss';

export function Post() {
	return (
		<div className='post'>
			<header>
				<button type='button'>
					<img className='logo' alt='' src={logo}/>
				</button>
				<div>
					<div>Username</div>
					<p>Email@gmail.com</p>
				</div>
			</header>
			<main>
				Content post will be here it can also
				be an image that will go along
				with the text post content
			</main>
			<footer>
				<button type='button' aria-label='like'>
					<FaArrowUpLong/>
					10
				</button>
				<button type='button' aria-label='like'>
					<FaArrowDownLong/>
					100
				</button>
				<button type='button' aria-label='like'>
					<MdModeComment/>
					43
				</button>
			</footer>
		</div>
	);
}
