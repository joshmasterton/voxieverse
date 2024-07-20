export type SerializedPost = {
  post_id?: number;
  user_id?: number;
  username?: string;
  post?: string;
  profile_picture?: string;
  post_picture?: string;
  likes?: number;
  dislikes?: number;
  comments?: number;
  created_at?: string;
  hasLiked?: boolean;
  hasDisliked?: boolean;
};
