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

export type AuthMessageKey =
  | "validation.fixFields"
  | "signUp.duplicateEmail"
  | "signUp.createFailed"
  | "signIn.invalidCredentials"
  | "signIn.failed"
  | "signOut.failed";

export type AuthFieldErrorKey =
  | "field.email.required"
  | "field.email.invalid"
  | "field.email.alreadyInUse"
  | "field.password.required"
  | "field.password.minLength";

export interface AuthActionResult {
  success: boolean;
  messageKey?: AuthMessageKey;
  message?: string;
  fieldErrorKeys?: {
    email?: AuthFieldErrorKey;
    password?: AuthFieldErrorKey;
  };
  fieldErrors?: {
    email?: string;
    password?: string;
  };
}
