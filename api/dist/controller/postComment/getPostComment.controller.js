import { PostComment } from '../../model/postComment.model.js';
export const getPostCommentController = async (req, res) => {
    try {
        const { user_id } = res.locals.user;
        const { type, type_id, post_parent_id, comment_parent_id } = req.query;
        const postComment = await new PostComment(type_id, post_parent_id, comment_parent_id, undefined, type).get(user_id);
        return res.status(200).json(postComment);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};
