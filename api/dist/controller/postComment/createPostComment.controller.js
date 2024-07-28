import { PostComment } from '../../model/postComment.model.js';
import { uploadToS3 } from '../../utilities/uploadS3.utilities.js';
export const createPostCommentController = async (req, res) => {
    try {
        const { user_id } = res.locals.user;
        const { type, text, post_parent_id, comment_parent_id } = req.body;
        const { file } = req;
        let picture;
        if (file) {
            picture = await uploadToS3(file);
        }
        const postComment = await new PostComment(undefined, post_parent_id, comment_parent_id, user_id, type, text, picture).create();
        return res.status(200).json(await postComment?.get());
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};
