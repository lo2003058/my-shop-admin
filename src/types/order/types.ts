import { Product } from '@/types/product/types';
import { Payment } from '@/types/payment/types';
import { Customer } from '@/types/customer/types';

export interface Order {
  id: number;
  tax: number;
  shippingFee: number;
  originalTotal: number;
  total: number;
  status: string;
  pointsEarned: number;
  createdAt: Date;
  updatedAt: Date;
  customer: Customer
  orderProduct: OrderProduct[];
  payment?: Payment;
  orderAddress: OrderAddress;
}

export interface OrdersData {
  paginatedOrders: {
    items: Order[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface OrderProduct {
  orderId: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface OrderAddress {
  name: string;
  phone: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}
