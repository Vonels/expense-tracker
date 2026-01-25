export interface AuthCredentials {
  name: string;
  email: string;
  password: string;
}

export type SessionResponse = {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
};

export interface LoginCredentials {
  email: string;
  password: string;
}
