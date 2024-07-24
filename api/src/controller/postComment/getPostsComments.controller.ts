import { Request, Response } from 'express';
import { PostComment } from '../../model/postComment.model';

export const getPostsCommentsController = async (
  req: Request,
  res: Response
) => {
  try {
    const { user_id } = res.locals.user;
    const {
      type,
      type_id,
      post_parent_id,
      comment_parent_id,
      page,
      sort,
      profile_id
    } = req.query as unknown as {
      type?: string;
      type_id?: number;
      post_parent_id?: number;
      comment_parent_id?: number;
      page?: number;
      sort?: string;
      profile_id?: number;
    };

    const postComments = await new PostComment(
      type_id,
      post_parent_id,
      comment_parent_id,
      user_id,
      type
    ).gets(page, sort, user_id, profile_id);

    return res.status(200).json(postComments);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
