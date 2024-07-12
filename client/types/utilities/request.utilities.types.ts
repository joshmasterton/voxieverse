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
  comments?: number;
  friends?: number;
  created_at?: string;
  last_online?: string;
};
