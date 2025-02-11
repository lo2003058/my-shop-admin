import "next-auth";
import { Role } from '@/types/role/types';

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role: Role;
    accessToken: string;
  }

  interface Session {
    accessToken?: string;
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
