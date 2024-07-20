import { Request, Response } from 'express';
import { Post } from '../../model/post.model';

export const getPostsController = async (req: Request, res: Response) => {
  try {
    const { user_id } = res.locals.user;
    const { page } = req.query as unknown as { page: number };

    const post = new Post(user_id);
    const posts = await post.getPosts(page || 0);

    return res.status(200).json(posts);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
