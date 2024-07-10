import { Request, Response } from 'express';
import { User } from '../../model/user.model';
import { uploadToS3 } from '../../utilities/uploadS3.utilities';

export const signupController = async (req: Request, res: Response) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const profilePictureFile = req.file;

    if (!profilePictureFile) {
      return res.status(400).json({ error: 'Profile picture required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords must match' });
    }

    const profilePicture = await uploadToS3(profilePictureFile);

    if (!profilePicture) {
      throw new Error('Profile picture upload failed');
    }

    const user = await new User(
      username,
      email,
      password,
      profilePicture
    ).create();

    if (!user) {
      throw new Error('User signup failed');
    }

    return res.status(201).json(user.serializeUser());
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
