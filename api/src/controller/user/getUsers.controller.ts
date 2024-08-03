import { Request, Response } from 'express';
import { User } from '../../model/user.model';

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const { user_id } = res.locals.user;
    const { page, sort, search, friends, profile_id } =
      req.query as unknown as {
        page?: number;
        sort?: string;
        search?: string;
        friends?: 'friend' | 'waiting';
        profile_id?: number;
      };

    const users = await new User(
      undefined,
      undefined,
      undefined,
      undefined,
      user_id
    ).gets(page, sort, profile_id || user_id, search, friends);

    return res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
