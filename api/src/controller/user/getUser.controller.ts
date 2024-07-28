import { Request, Response } from 'express';
import { User } from '../../model/user.model';

export const getUserController = async (req: Request, res: Response) => {
  try {
    const auth_user_id = res.locals.user.user_id;
    const { user_id } = req.query as unknown as { user_id: number };

    const user = new User(undefined, undefined, undefined, undefined, user_id);

    return res.status(200).json(await user.get(auth_user_id));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
