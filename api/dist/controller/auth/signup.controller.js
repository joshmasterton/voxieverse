import { User } from '../../model/user.model.js';
import { uploadToS3 } from '../../utilities/uploadS3.utilities.js';
export const signupController = async (req, res) => {
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
      password,
      email,
      profilePicture
    ).signup();
    if (!user) {
      throw new Error('User signup failed');
    }
    const tokens = await user.tokens();
    res.cookie('accessToken', tokens?.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 5 * 60 * 1000
    });
    res.cookie('refreshToken', tokens?.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    });
    return res.status(201).json(user.serializeUser());
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
