export interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // Ensure price is consistently a number
  stock: number;
  isVirtual: boolean;
  isShow: boolean;
  imageUrl?: string;
  isCustomerWishListed?: boolean;
}

export interface ProductsData {
  productsV2: {
    items: Product[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface EditProductData {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  isVirtual: boolean;
  isShow: boolean;
  imageUrl?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  stock: number;
  price: number;
  isVirtual: boolean;
  isShow: boolean;
  imageUrl: string;
}

export interface ProductViewProps {
  productData?: Partial<{
    name: string;
    price: number;
    description: string;
    stock: number;
    isVirtual: boolean;
    imageUrl: string;
  }>;
}

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editProduct?: EditProductData | null;
}

export interface ProductFormProps {
  onSave: (serializedData: {
    name: string;
    description: string;
    stock: number;
    price: number;
    isVirtual: boolean;
    isShow: boolean;
    imageUrl: string;
  }) => Promise<void>;
  initialData?: Partial<{
    name: string;
    price: number;
    description: string;
    stock: number;
    isVirtual: boolean;
    isShow: boolean;
    imageUrl: string;
  }>;
  isEditMode?: boolean;
}

export interface ProductAiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturn: (response: ProductAiFormResponse) => Promise<void> | void;
  productData?: ProductFormData;
}

export interface ProductAiFormResponse {
  response: string;
}

export interface ProductAiFormProps {
  onReturn: (response: ProductAiFormResponse) => Promise<void> | void;
  productData?: ProductFormData;
}
