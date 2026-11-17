export type Role = "owner" | "repairer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
