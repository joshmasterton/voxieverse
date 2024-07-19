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
};

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
};
