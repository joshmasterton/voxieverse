import jwt from 'jsonwebtoken';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const generateToken = (user_id: number, type: 'access' | 'refresh') => {
  if (ACCESS_TOKEN_SECRET && REFRESH_TOKEN_SECRET) {
    if (type === 'access') {
      return jwt.sign({ user_id }, ACCESS_TOKEN_SECRET, {
        expiresIn: '5m'
      });
    } else if (type === 'refresh') {
      return jwt.sign({ user_id }, REFRESH_TOKEN_SECRET, {
        expiresIn: '1d'
      });
    }
  }
};
