import { Request, Response } from 'express';
import { Post } from '../../model/post.model';

export const getPostController = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.query as unknown as { post_id: number };

    if (!post_id) {
      throw new Error('post_id required');
    }

    const post = new Post(undefined, post_id);
    await post.get();

    return res.status(200).json(post.serializePost());
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
