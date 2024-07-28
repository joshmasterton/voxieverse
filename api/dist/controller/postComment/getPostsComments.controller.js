import { PostComment } from '../../model/postComment.model.js';
export const getPostsCommentsController = async (req, res) => {
    try {
        const { user_id } = res.locals.user;
        const { type, type_id, post_parent_id, comment_parent_id, page, sort, profile_id } = req.query;
        const postComments = await new PostComment(type_id, post_parent_id, comment_parent_id, user_id, type).gets(page, sort, user_id, profile_id);
        return res.status(200).json(postComments);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};
