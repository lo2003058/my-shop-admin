export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface RolesData {
  roles: Role[];
}

export interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editRole?: Role | null;
}

export interface RoleFormData {
  name: string;
  permissions: string[];
}

export interface RoleFormProps {
  onSave: (serializedData: RoleFormData) => Promise<void>;
  initialData?: Partial<RoleFormData>;
  isEditMode?: boolean;
}
