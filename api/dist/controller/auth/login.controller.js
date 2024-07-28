import { User } from '../../model/user.model.js';
export const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await new User(username, password).login();
        if (!user) {
            throw new Error('User login failed');
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
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};
