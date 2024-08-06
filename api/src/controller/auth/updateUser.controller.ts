import { Request, Response } from 'express';
import { uploadToS3 } from '../../utilities/uploadS3.utilities';
import { User } from '../../model/user.model';

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { user_id } = res.locals.user;
    const { username, email, password, confirmPassword } = req.body as {
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    };

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords must match' });
    }

    const profilePictureFile = req.file;
    let profilePicture: string | undefined;

    if (profilePictureFile) {
      profilePicture = await uploadToS3(profilePictureFile);

      if (!profilePicture) {
        throw new Error('Profile picture upload failed');
      }
    }

    const user = await new User(
      undefined,
      undefined,
      undefined,
      undefined,
      user_id
    ).get();

    const updatedUser = await user?.update(
      username,
      email,
      password,
      profilePicture
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
