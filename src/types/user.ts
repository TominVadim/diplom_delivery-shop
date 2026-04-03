export interface User {
  id: number;
  email: string;
  password_hash: string;
  name?: string;
  birth_date?: string;
  phone?: string;
  created_at: Date;
}

export interface UserPublic {
  id: number;
  email: string;
  name?: string;
  created_at: Date;
}
