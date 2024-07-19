import { Request, Response } from 'express';
import { Comment } from '../../model/comment.model';

export const createCommentController = async (req: Request, res: Response) => {
  try {
    const { user_id } = res.locals.user;
    const { comment, post_id, comment_parent_id } = req.body;

    const newComment = new Comment(
      user_id,
      post_id,
      undefined,
      comment_parent_id,
      comment
    );
    const updatedPostComment = await newComment.createComment();
    return res.status(200).json(updatedPostComment);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
