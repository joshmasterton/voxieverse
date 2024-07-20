export type SerializedComment = {
  post_id?: number;
  comment_id?: number;
  comment_parent_id?: number;
  user_id?: number;
  username?: string;
  comment?: string;
  profile_picture?: string;
  likes?: number;
  dislikes?: number;
  comments?: number;
  created_at?: string;
  hasLiked?: boolean;
  hasDisliked?: boolean;
};
