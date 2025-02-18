import { Role } from '@/types/role/types';

export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  roleId: number;
  role: Role;
  status: number;
}

export interface UsersData {
  paginatedUsers: {
    items: User[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editUser?: User | null;
}

export interface UserFormData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  roleId: number;
  password?: string;
}

export interface UserFormProps {
  onSave: (serializedData: UserFormData) => Promise<void>;
  initialData?: Partial<UserFormData>;
  isEditMode?: boolean;
}
