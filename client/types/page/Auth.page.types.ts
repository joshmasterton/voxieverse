export type AuthProps = {
  isSignup?: boolean;
};

export type UserDetails = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  file?: File;
};
