import { Request, Response } from 'express';
import { PostComment } from '../../model/postComment.model';

export const getPostCommentController = async (req: Request, res: Response) => {
  try {
    const { user_id } = res.locals.user;
    const { type, type_id, post_parent_id, comment_parent_id } =
      req.query as unknown as {
        type: string;
        type_id: number;
        post_parent_id: number;
        comment_parent_id: number;
      };

    const postComment = await new PostComment(
      type_id,
      post_parent_id,
      comment_parent_id,
      undefined,
      type
    ).get(user_id);

    return res.status(200).json(postComment);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
