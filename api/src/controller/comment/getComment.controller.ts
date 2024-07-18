import { Request, Response } from 'express';
import { Comment } from '../../model/comment.model';

export const getCommentController = async (req: Request, res: Response) => {
  try {
    const { comment_id } = req.query as unknown as { comment_id: number };

    if (!comment_id) {
      throw new Error('comment_id required');
    }

    const comment = new Comment(undefined, undefined, comment_id);
    await comment.get();

    return res.status(200).json(comment.serializeComment());
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
