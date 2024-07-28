import jwt from 'jsonwebtoken';
import { User } from '../model/user.model.js';
import { generateToken } from '../utilities/generateToken.utilities.js';
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
export const authenticate = async (req, res, next) => {
    try {
        if (ACCESS_TOKEN_SECRET) {
            const { accessToken } = req.cookies;
            if (!accessToken) {
                throw new Error('No access token');
            }
            const decodedAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
            if (!decodedAccessToken) {
                throw new Error('Failed to verify access token');
            }
            const user = new User(undefined, undefined, undefined, undefined, decodedAccessToken.user_id);
            await user.get();
            res.locals.user = user.serializeUser();
            next();
        }
        else {
            throw new Error('Environment variables missing');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            try {
                if (REFRESH_TOKEN_SECRET) {
                    const { refreshToken } = req.cookies;
                    if (!refreshToken) {
                        throw new Error('No tokens');
                    }
                    const decodedRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
                    if (!decodedRefreshToken) {
                        throw new Error('Failed to verify refresh token');
                    }
                    const user = new User(undefined, undefined, undefined, undefined, decodedRefreshToken.user_id);
                    const newAccessToken = generateToken(decodedRefreshToken.user_id, 'access');
                    await user.get();
                    res.locals.user = user.serializeUser();
                    res.cookie('accessToken', newAccessToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                        maxAge: 5 * 60 * 1000
                    });
                    next();
                }
                else {
                    throw new Error('Environment variables missing');
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(403).json({ error: error.message });
                }
            }
        }
    }
};
