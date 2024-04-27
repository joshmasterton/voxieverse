import {FaArrowUpLong, FaArrowDownLong} from 'react-icons/fa6';
import {MdModeComment} from 'react-icons/md';
import logo from '../assets/Voxieverse_logo_light-modified.png';
import './style/Post.scss';

export function Post() {
	return (
		<div className='post'>
			<header>
				<img className='logo' alt='' src={logo}/>
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
				</button>
				<button type='button' aria-label='like'>
					<FaArrowDownLong/>
				</button>
				<button type='button' aria-label='like'>
					<MdModeComment/>
				</button>
			</footer>
		</div>
	);
}
