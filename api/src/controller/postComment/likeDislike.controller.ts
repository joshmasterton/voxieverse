import { Request, Response } from 'express';
import { LikeDislike } from '../../model/likeDislike.model';

export const likeDislikeController = async (req: Request, res: Response) => {
  try {
    const { type, type_id, reaction } = req.body;
    const { user_id } = res.locals.user;

    const likeDislike = new LikeDislike(type, type_id, user_id, reaction);

    await likeDislike.create();
    const likeDislikeSerialized = await likeDislike.get();

    return res.status(201).json(likeDislikeSerialized);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
