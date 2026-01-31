export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  twoFactorEnabled: boolean;
}

export interface UpdateUserInput {
  name?: string;
  image?: string;
}
