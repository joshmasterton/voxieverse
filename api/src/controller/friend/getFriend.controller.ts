import { Request, Response } from 'express';
import { Friend } from '../../model/friend.model';

export const getFriendController = async (req: Request, res: Response) => {
  try {
    const { user_id } = res.locals.user;
    const { friend_id } = req.query as unknown as { friend_id: number };

    const friend = await new Friend(user_id, user_id, friend_id).get();

    if (!friend) {
      return res.status(200).json({});
    }

    return res.status(200).json(friend);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
