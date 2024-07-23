import { Request, Response } from 'express';

export const createLikeDislikeController = async (
  req: Request,
  res: Response
) => {
  try {
    const { user_id } = res.locals.user;
    const { type, type_id, reaction } = req.body;

    return res.status(200).json({ user_id, type, type_id, reaction });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
