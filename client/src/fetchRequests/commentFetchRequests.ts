import {type ValidationError} from '../context/UserContext';
import {apiUrl} from '../main';

export type CommentType = {
	id: number;
	postId: number;
	// eslint-disable-next-line @typescript-eslint/ban-types
	commentParentId: number | null;
	username: string;
	comment: string;
	likes: number;
	hasLiked: boolean;
	dislikes: number;
	hasDisliked: boolean;
	comments: number;
	createdAt: string;
};

export const fetchAddComment = async <T>(postId: T, commentParentId: T, comment: T): Promise<ValidationError | undefined> => {
	try {
		const addCommentResponse = await fetch(`${apiUrl}/addComment`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify({comment, postId, commentParentId}),
		});

		if (!addCommentResponse.ok) {
			return undefined;
		}

		const addCommentData: ValidationError = await addCommentResponse.json() as ValidationError;

		if ('validationError' in addCommentData) {
			return addCommentData;
		}

		return undefined;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};

export const fetchGetComment = async (username: string, sort: string, page: number): Promise<CommentType[] | undefined> => {
	try {
		const getCommentResponse = await fetch(`${apiUrl}/getComment/${username}/${sort}/${page}`, {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
		});

		if (!getCommentResponse.ok) {
			return undefined;
		}

		const getCommentdata: CommentType[] = await getCommentResponse.json() as CommentType[];

		return getCommentdata;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};

export const fetchGetComments = async (postId: number, sort: string, page: number): Promise<CommentType[] | undefined> => {
	try {
		const getCommentsResponse = await fetch(`${apiUrl}/getComments/${postId}/${sort}/${page}`, {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
		});

		if (!getCommentsResponse.ok) {
			return undefined;
		}

		const getCommentsdata: CommentType[] = await getCommentsResponse.json() as CommentType[];

		return getCommentsdata;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};

export const fetchGetReplies = async (commentParentId: number, sort: string, page: number): Promise<CommentType[] | undefined> => {
	try {
		const getRepliesResponse = await fetch(`${apiUrl}/getReplies/${commentParentId}/${sort}/${page}`, {
			method: 'GET',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
		});

		if (!getRepliesResponse.ok) {
			return undefined;
		}

		const getRepliesdata: CommentType[] = await getRepliesResponse.json() as CommentType[];

		return getRepliesdata;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};

export const fetchLikeComment = async (commentId: number): Promise<CommentType | undefined> => {
	try {
		const likeCommentResponse = await fetch(`${apiUrl}/likeDislikeComment`, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify({commentId, action: 'like'}),
		});

		if (!likeCommentResponse.ok) {
			return undefined;
		}

		const likeCommentData: CommentType = await likeCommentResponse.json() as CommentType;

		if (likeCommentData.id) {
			return likeCommentData;
		}

		return undefined;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};

export const fetchDislikeComment = async (commentId: number): Promise<CommentType | undefined> => {
	try {
		const dislikeCommentResponse = await fetch(`${apiUrl}/likeDislikeComment`, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			credentials: 'include',
			body: JSON.stringify({commentId, action: 'dislike'}),
		});

		if (!dislikeCommentResponse.ok) {
			return undefined;
		}

		const dislikeCommentData: CommentType = await dislikeCommentResponse.json() as CommentType;

		if (dislikeCommentData.id) {
			return dislikeCommentData;
		}

		return undefined;
	} catch (err) {
		if (err instanceof Error) {
			console.error(err.message);
		}
	}
};
