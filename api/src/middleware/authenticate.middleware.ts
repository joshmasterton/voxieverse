import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Db, tableConfigManager } from '../database/db.database';
import { User } from '../model/user.model';
import { generateToken } from '../utilities/generateToken.utilities';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tokensTable } = tableConfigManager.getConfig();

  try {
    if (ACCESS_TOKEN_SECRET) {
      const { accessToken } = req.cookies;

      if (!accessToken) {
        throw new Error('No access token');
      }

      const decodedAccessToken = jwt.verify(
        accessToken,
        ACCESS_TOKEN_SECRET
      ) as JwtPayload;

      if (!decodedAccessToken) {
        throw new Error('Failed to verify access token');
      }

      const user = new User(
        undefined,
        undefined,
        undefined,
        undefined,
        decodedAccessToken.user_id
      );

      await user.get();
      res.locals.user = user.serializeUser();

      next();
    } else {
      throw new Error('Environment variables missing');
    }
  } catch (error) {
    if (error instanceof Error) {
      try {
        if (REFRESH_TOKEN_SECRET) {
          const { refreshToken } = req.cookies;

          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          const db = new Db();
          const existingRefreshToken = await db.query(
            `
							SELECT * FROM ${tokensTable ?? 'voxieverse_tokens'}
							WHERE refresh_token = $1	
						`,
            [refreshToken]
          );

          if (!existingRefreshToken?.rows[0]) {
            return res.status(403).json({ error: 'Unauthorized' });
          }

          const decodedRefreshToken = jwt.verify(
            existingRefreshToken?.rows[0].refresh_token,
            REFRESH_TOKEN_SECRET
          ) as JwtPayload;

          if (!decodedRefreshToken) {
            throw new Error('Failed to verify refresh token');
          }

          const user = new User(
            undefined,
            undefined,
            undefined,
            undefined,
            decodedRefreshToken.user_id
          );

          const newAccessToken = generateToken(
            decodedRefreshToken.user_id,
            'access'
          );

          await user.get();
          res.locals.user = user.serializeUser();

          res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 5 * 60 * 1000
          });
          next();
        } else {
          throw new Error('Environment variables missing');
        }
      } catch (error) {
        if (error instanceof Error) {
          const { refreshToken } = req.cookies;

          const db = new Db();
          await db.query(
            `
							DELETE FROM ${tokensTable ?? 'voxieverse_tokens'}
							WHERE refresh_token = $1
						`,
            [refreshToken]
          );

          return res.status(403).json({ error: 'Unauthorized' });
        }
      }
    }
  }
};
