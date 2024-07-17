import { Request, Response } from 'express';
import { uploadToS3 } from '../../utilities/uploadS3.utilities';
import { Post } from '../../model/post.model';

export const createPostController = async (req: Request, res: Response) => {
  try {
    const { user_id } = res.locals.user;
    const { post } = req.body;
    const postPictureFile = req.file;

    if (postPictureFile) {
      const postPicture = await uploadToS3(postPictureFile);

      if (!postPicture) {
        throw new Error('Post picture upload failed');
      }

      const newPost = new Post(user_id, undefined, post, postPicture);
      await newPost.createPost();
      return res.status(200).json(newPost);
    }

    const newPost = new Post(user_id, undefined, post);
    await newPost.createPost();
    return res.status(200).json(newPost);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
  }
};
