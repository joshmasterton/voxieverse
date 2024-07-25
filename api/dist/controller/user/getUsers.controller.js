import { User } from '../../model/user.model.js';
export const getUsersController = async (req, res) => {
  try {
    const { page, sort } = req.query;
    const users = await new User().gets(page, sort);
    return res.status(200).json(users);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};
