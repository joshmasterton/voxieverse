export type ForgotPasswordProps = {
  isReset?: boolean;
};

export type ForgotDetails = {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
};
