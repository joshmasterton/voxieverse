import {type ValidationError} from '../context/UserContext';

const apiUrl = 'http://localhost:9001';

export type PostType = {
	id: number;
	post: string;
	username: string;
	likes: number;
	hasLiked: boolean;
	dislikes: number;
	hasDisliked: boolean;
	comments: number;
	createdAt: string;
};

export const fetchAddPost = async <T>(post: T): Promise<ValidationError | undefined> => {
	try {
		const addPostResponse = await fetch(`${apiUrl}/addPost`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify({post}),
		});

		if (!addPostResponse.ok) {
			return undefined;
		}

		const addPostData: ValidationError = await addPostResponse.json() as ValidationError;

		if ('validationError' in addPostData) {
			return addPostData;
		}

		return undefined;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};

export const fetchGetPosts = async (sort: string, page: number): Promise<PostType[] | undefined> => {
	try {
		const getPostsResponse = await fetch(`${apiUrl}/getPosts/${sort}/${page}`, {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
		});

		if (!getPostsResponse.ok) {
			return undefined;
		}

		const getPostsdata: PostType[] = await getPostsResponse.json() as PostType[];

		return getPostsdata;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};

export const fetchGetPost = async (postId: number): Promise<PostType | undefined> => {
	try {
		const getPostResponse = await fetch(`${apiUrl}/getPost/${postId}`, {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
		});

		if (!getPostResponse.ok) {
			return undefined;
		}

		const getPostdata: PostType = await getPostResponse.json() as PostType;

		return getPostdata;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};

export const fetchGetPostsFromUser = async (username: string, page: number): Promise<PostType[] | undefined> => {
	try {
		const getPostsFromUserResponse = await fetch(`${apiUrl}/getPostsFromUser/${username}/${page}`, {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
		});

		if (!getPostsFromUserResponse.ok) {
			return undefined;
		}

		const getPostFromUserData: PostType[] = await getPostsFromUserResponse.json() as PostType[];

		return getPostFromUserData;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};

export const fetchLikePost = async (postId: number): Promise<PostType | undefined> => {
	try {
		const likePostResponse = await fetch(`${apiUrl}/likeDislikePost`, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify({postId, action: 'like'}),
		});

		if (!likePostResponse.ok) {
			return undefined;
		}

		const likePostData: PostType = await likePostResponse.json() as PostType;

		if (likePostData.id) {
			return likePostData;
		}

		console.log(likePostData);
		return undefined;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};

export const fetchDislikePost = async (postId: number): Promise<PostType | undefined> => {
	try {
		const dislikePostResponse = await fetch(`${apiUrl}/likeDislikePost`, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify({postId, action: 'dislike'}),
		});

		if (!dislikePostResponse.ok) {
			return undefined;
		}

		const dislikePostData: PostType = await dislikePostResponse.json() as PostType;

		if (dislikePostData.id) {
			return dislikePostData;
		}

		console.log(dislikePostData);
		return undefined;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};
