import { Request, Response } from 'express';
import { User } from '../../model/user.model';

export const loginController = async (req: Request, res: Response) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords must match' });
    }
    const user = await new User(username, email, password).create();

    if (!user) {
      throw new Error('User login failed');
    }

    return res.status(201).json(user.serializeUser());
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
