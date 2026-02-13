export interface AuthUser {
  id: string;
  email: string;
}

export interface SignUpInput {
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthActionResult {
  success: boolean;
  message?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
}
