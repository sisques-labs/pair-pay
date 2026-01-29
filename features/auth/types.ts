// Types for Authentication feature

export type AuthError = {
  message: string;
  code?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  email: string;
  password: string;
  fullName: string;
};

export type AuthResponse = {
  success: boolean;
  error?: AuthError;
};
