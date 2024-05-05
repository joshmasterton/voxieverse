import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {type User} from '../context/UserContext';
import {fetchGetPostsFromUser, type PostType} from '../fetchRequests/postFetchRequests';
import {NavReturn} from '../comp/NavReturn';
import {fetchGetUser} from '../fetchRequests/usersFetchRequests';
import {Loading} from '../comp/Loading';
import {PostCard} from '../comp/PostCard';
import logo from '../assets/Voxieverse_logo.png';
import './style/Profile.scss';

export function Profile() {
	const navigate = useNavigate();
	const [user, setUser] = useState<User | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(true);
	const [posts, setPosts] = useState<PostType[] | undefined>(undefined);
	const [totalLikes, setTotalLikes] = useState<number>(0);
	const [totalDislikes, setTotalDislikes] = useState<number>(0);

	const usernamePath = window?.location.hash.split('/').pop();

	useEffect(() => {
		setTimeout(() => {
			fetchGetUser(usernamePath)
				.then(async userData => {
					setUser(userData);
					setLoading(false);
				})
				.catch(err => {
					console.error(err.message);
					setLoading(false);
					navigate(-1);
				});
		}, 1000);
	}, []);

	useEffect(() => {
		if (user) {
			setLoading(true);
			fetchGetPostsFromUser(user?.username)
				.then(postData => {
					if (postData) {
						if (postData[0]) {
							setTotalLikes(postData.reduce((total, post) => total + post.likes, 0));
							setTotalDislikes(postData.reduce((total, post) => total + post.dislikes, 0));
							setPosts(postData);
						} else {
							setPosts(undefined);
						}
					}

					setLoading(false);
				})
				.catch(err => {
					console.error(err.message);
					setLoading(false);
				});
		}
	}, [user]);

	return (
		<>
			<NavReturn/>
			<div id='profile'>
				{loading ? (
					<Loading onlyComponent={false} border=''/>
				) : (
					<>
						{user && (
							<div id='profileUser'>
								<header>
									<img alt='user' src={logo} className='logo'/>
									<div>
										<div>{user?.username}</div>
										<p>{user?.email}</p>
									</div>
								</header>
								<footer>
									<div>
										<p>Posts</p>
										|
										<p>{posts ? posts?.length : 0}</p>
									</div>
									<div>
										<p>Likes</p>
										|
										<p>{totalLikes - totalDislikes}</p>
									</div>
								</footer>
							</div>
						)}
						{posts?.map(post => (
							<PostCard key={post.id} post={post} />
						))}
					</>
				)}
			</div>
		</>
	);
}
