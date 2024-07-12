export type ForgotPasswordProps = {
  isReset?: boolean;
};

export type ForgotDetails = {
  email: string;
  token: string;
  newPassword: string;
  newConfirmPassword: string;
};
