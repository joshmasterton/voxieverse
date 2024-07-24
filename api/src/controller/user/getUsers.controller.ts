import { Request, Response } from 'express';
import { User } from '../../model/user.model';

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const { page, sort } = req.query as unknown as {
      page: number;
      sort: string;
    };

    const users = await new User().gets(page, sort);

    return res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
