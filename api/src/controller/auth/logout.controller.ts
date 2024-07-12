import { Request, Response } from 'express';

export const logoutController = async (_req: Request, res: Response) => {
  try {
    res.locals.user = undefined;
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
