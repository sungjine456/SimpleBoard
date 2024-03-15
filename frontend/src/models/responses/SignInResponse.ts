interface SignInResponse {
  id: number;
  name: string;
  email: string;
  token: string;
  accessExpired: Date;
  refreshExpired: Date;
  message: string;
}

export default SignInResponse;
