import { LikeDislike } from '../../model/likeDislike.model.js';
export const createLikeDislikeController = async (req, res) => {
  try {
    const { user_id } = res.locals.user;
    const { type, type_id, reaction } = req.body;
    const likeDislike = await new LikeDislike(
      user_id,
      type_id,
      type,
      reaction
    ).create();
    if (likeDislike) {
      return res.status(200).json(await likeDislike.get());
    } else {
      throw new Error('Error creating like dislike');
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
