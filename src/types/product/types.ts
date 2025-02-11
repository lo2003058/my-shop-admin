export interface Product {
  id: number;
  name: string;
  description: string;
  price: number; // Ensure price is consistently a number
  stock: number;
  isVirtual: boolean;
  imageUrl?: string;
  isCustomerWishListed?: boolean;
}

export interface RecommendProduct {
  id: number;
  name: string;
  description: string;
  price: number; // Changed to number for consistency
  stock: number;
  isVirtual: boolean;
  imageUrl?: string;
}

export interface GetProduct {
  product: Product;
}

export interface GetProductForClient {
  productForClient: Product;
}

export interface GetProducts {
  products: Product[];
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
  imageUrl?: string;
}

export interface ProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  isVirtual: boolean;
  imageUrl?: string;
}
