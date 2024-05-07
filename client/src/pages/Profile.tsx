import {useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {useUser, type User} from '../context/UserContext';
import {fetchGetPostsFromUser, type PostType} from '../fetchRequests/postFetchRequests';
import {NavReturn} from '../comp/NavReturn';
import {fetchGetUser} from '../fetchRequests/usersFetchRequests';
import {
	type Friendship, fetchCreateFriendship, fetchDeleteFriendship, fetchGetFriendship,
} from '../fetchRequests/friendshipFetchRequests';
import {Loading} from '../comp/Loading';
import {PostCard} from '../comp/PostCard';
import {BiMinus, BiPlus} from 'react-icons/bi';
import logo from '../assets/Voxieverse_logo.png';
import './style/Profile.scss';

export function Profile() {
	const navigate = useNavigate();
	const {user} = useUser();
	const [profileUser, setProfileUser] = useState<User | undefined>(undefined);
	const [loading, setLoading] = useState<boolean>(true);
	const [posts, setPosts] = useState<PostType[] | undefined>(undefined);
	const [friendship, setFriendship] = useState<Friendship | undefined>(undefined);
	const [totalLikes, setTotalLikes] = useState<number>(0);
	const [totalDislikes, setTotalDislikes] = useState<number>(0);

	const usernamePath = window?.location.hash.split('/').pop();

	useEffect(() => {
		setTimeout(() => {
			fetchGetUser(usernamePath)
				.then(async userData => {
					setProfileUser(userData);
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
		if (profileUser) {
			setLoading(true);
			fetchGetPostsFromUser(profileUser?.username)
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

		if (profileUser && user && profileUser.username !== user?.username) {
			setLoading(true);
			fetchGetFriendship(profileUser?.username, user?.username)
				.then(friendshipData => {
					setFriendship(friendshipData);
				})
				.catch(err => {
					console.error(err.message);
					setLoading(false);
				});
		}
	}, [profileUser]);

	const addFriend = async () => {
		if (user && profileUser && profileUser?.username !== user?.username) {
			await fetchCreateFriendship(user?.username, profileUser?.username);
			fetchGetFriendship(profileUser?.username, user?.username)
				.then(friendshipData => {
					setFriendship(friendshipData);
				})
				.catch(err => {
					console.error(err.message);
					setLoading(false);
				});
		}
	};

	const deleteFriend = async () => {
		if (user && profileUser && profileUser?.username !== user?.username) {
			await fetchDeleteFriendship(user?.username, profileUser?.username);
			fetchGetFriendship(profileUser?.username, user?.username)
				.then(friendshipData => {
					setFriendship(friendshipData);
				})
				.catch(err => {
					console.error(err.message);
					setLoading(false);
				});
		}
	};

	return (
		<>
			<NavReturn/>
			<div id='profile'>
				{loading ? (
					<Loading onlyComponent={false} border=''/>
				) : (
					<>
						{user && (
							<div id='profileUser' className={friendship?.status}>
								<header>
									<img alt='user' src={logo} className='logo'/>
									<div>
										<div>{profileUser?.username}</div>
										<p>{profileUser?.email}</p>
									</div>
									{friendship?.status === 'accepted' && (
										<div>Friends</div>
									)}
									{friendship?.status === 'pending' && friendship.userInitiator === user.username && (
										<div>Waiting for person to respond to friend request</div>
									)}
									{friendship?.status === 'pending' && friendship.userInitiator !== user.username && (
										<div>Waiting for you to responsd to friend request</div>
									)}

								</header>
								<footer>
									<div>
										<div>
											<p>Posts</p>
											<p>{posts ? posts?.length : 0}</p>
										</div>
										<div>
											<p>Likes</p>
											<p>{totalLikes - totalDislikes}</p>
										</div>
									</div>
									{user.username !== profileUser?.username && (
										<div>
											<button type='button' aria-label='Add friend' onClick={async () => {
												await addFriend();
											}}>
												<BiPlus/>
											</button>
											<button type='button' aria-label='Remove friend' onClick={async () => {
												await deleteFriend();
											}}>
												<BiMinus/>
											</button>
										</div>
									)}
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
