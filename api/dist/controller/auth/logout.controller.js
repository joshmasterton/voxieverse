export const logoutController = async (_req, res) => {
    try {
        res.locals.user = undefined;
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: 'Logout successful' });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
};
