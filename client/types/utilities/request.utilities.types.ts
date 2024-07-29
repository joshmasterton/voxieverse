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
  friend_status?: 'friend' | 'waiting';
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

export type FriendType = {
  id: number;
  friend_initiator_id: number;
  friend_one_id: number;
  friend_two_id: number;
  friend_accepted: boolean;
  created_at: string;
};
