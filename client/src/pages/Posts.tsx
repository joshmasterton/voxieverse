import {Nav} from '../comp/Nav';
import {Side} from '../comp/Side';
import {Post} from '../comp/Post';
import './style/Posts.scss';

export function Posts() {
	return (
		<>
			<Nav/>
			<Side side='left'/>
			<div id='posts'>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
				<Post/>
			</div>
			<Side side='right'/>
		</>
	);
}
