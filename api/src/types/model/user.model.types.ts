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
  is_online?: boolean;
  friend_status?: 'friend' | 'waiting';
};
