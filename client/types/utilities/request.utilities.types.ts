export type ErrorResponse = {
  error: string;
};

export type SerializedUser = {
  user_id?: number;
  username?: string;
  email?: string;
  profile_picture?: string;
  likes?: number;
  dislikes?: number;
  posts?: number;
  comments?: number;
  friends?: number;
  created_at?: string;
  last_online?: string;
};

export type SerializedPostComment = {
  id?: number;
  post_parent_id?: number;
  comment_parent_id?: number;
  user_id?: number;
  type?: string;
  text?: string;
  picture?: string;
  likes?: number;
  dislikes?: number;
  comments?: number;
  created_at?: string;
  username?: string;
  profile_picture?: string;
  has_liked?: boolean;
  has_disliked?: boolean;
};
