import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUser} from '../context/UserContext';
import {Nav} from '../comp/Nav';
import {Side} from '../comp/Side';
import {Post} from '../comp/Post';
import './style/Posts.scss';

export function Posts() {
	const navigate = useNavigate();
	const {user} = useUser();

	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user]);

	if (user) {
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
}
