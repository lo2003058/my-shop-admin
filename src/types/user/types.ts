import { Role } from '@/types/role/types';

export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: Role;
}
