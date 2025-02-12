export interface Model {
  id: number;
  name: string;
  apiUrl: string;
  apiKey: string;
  isDefault: boolean;
  isShow: boolean;
}

export interface ModelsData {
  paginatedModel: {
    items: Model[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ModelFormData {
  name: string;
  apiUrl: string;
  apiKey: string;
  isDefault: boolean;
  isShow: boolean;
}

export interface ModelFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editModel?: Model | null;
}

export interface ModelFormProps {
  onSave: (serializedData: ModelFormData) => Promise<void>;
  initialData?: Partial<ModelFormData>;
  isEditMode?: boolean;
}
