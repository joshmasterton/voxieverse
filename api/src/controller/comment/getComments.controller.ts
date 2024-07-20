import { Request, Response } from 'express';
import { Comment } from '../../model/comment.model';

export const getCommentsController = async (req: Request, res: Response) => {
  try {
    const { user_id } = res.locals.user;
    const { page, post_id, comment_parent_id } = req.query as unknown as {
      page: number;
      post_id: number;
      comment_parent_id: number;
    };

    const comment = new Comment(
      user_id,
      undefined,
      post_id,
      undefined,
      comment_parent_id
    );
    const comments = await comment.getComments(page || 0);

    return res.status(200).json(comments);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
