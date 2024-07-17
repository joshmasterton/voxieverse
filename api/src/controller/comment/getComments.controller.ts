import { Request, Response } from 'express';
import { Comment } from '../../model/comment.model';

export const getCommentsController = async (req: Request, res: Response) => {
  try {
    const { page } = req.query as unknown as { page: number };

    const comment = new Comment();
    const comments = await comment.getComments(page || 0);

    return res.status(200).json(comments);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
