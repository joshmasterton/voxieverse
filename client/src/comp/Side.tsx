import {type UserWithFriendship, type User} from '../context/UserContext';
import {UserCardSmall} from './UserCard';
import {useEffect, useState} from 'react';
import {fetchGetPostsFromUser, type PostType} from '../fetchRequests/postFetchRequests';
import {Loading} from './Loading';
import {PostCardSmall} from './PostCard';
import logo from '../assets/Voxieverse_logo.png';
import './style/Side.scss';

type SidePostProps = {
	isLeft: boolean;
	loading: boolean;
	content: PostType[] | undefined;
};

type SideFriendsProps = {
	isLeft: boolean;
	loading: boolean;
	usersFriends: UserWithFriendship[] | undefined;
	usersFriendsWaiting: UserWithFriendship[] | undefined;
};

type SideUserProps = {
	isLeft: boolean;
	user: User;
};

export function SideUser({isLeft, user}: SideUserProps) {
	const [posts, setPosts] = useState<PostType[] | undefined>(undefined);
	const [totalLikes, setTotalLikes] = useState<number>(0);
	const [totalDislikes, setTotalDislikes] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (user) {
			setTimeout(async () => {
				fetchGetPostsFromUser(user?.username, 0)
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
			}, 300);
		}
	}, []);

	return (
		<div className={`side ${isLeft ? 'left' : 'right'}`}>
			{loading ? (
				<Loading/>
			) : (
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
							<div>
								<p>Posts</p>
								<p>{posts ? posts?.length : 0}</p>
							</div>
							<div>
								<p>Likes</p>
								<p>{totalLikes - totalDislikes}</p>
							</div>
						</div>
					</footer>
				</div>
			)}
		</div>
	);
}

export function SidePost({isLeft, loading, content}: SidePostProps) {
	return (
		<div className={`sidePost ${isLeft ? 'left' : 'right'}`}>
			{loading ? (
				<Loading/>
			) : (
				<>
					Trending posts
					{content?.map(content => (
						<PostCardSmall key={content.id} post={content} />
					))}
				</>
			)}
		</div>
	);
}

export function SideFriends({isLeft, loading, usersFriends, usersFriendsWaiting}: SideFriendsProps) {
	return (
		<div className={`sideFriends ${isLeft ? 'left' : 'right'}`}>
			{loading ? (
				<Loading/>
			) : (
				<>
					{(usersFriends?.length ?? 0) === 0 ? '' : 'Friends'}
					{usersFriends?.map(friend => (
						<UserCardSmall key={friend.username} user={friend} />
					))}
					{(usersFriendsWaiting?.length ?? 0) === 0 ? '' : 'Friends in waiting'}
					{usersFriendsWaiting?.map(friend => (
						<UserCardSmall key={friend.username} user={friend} />
					))}
				</>
			)}
		</div>
	);
}

