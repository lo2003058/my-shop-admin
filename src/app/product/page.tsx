import React from 'react';
import { Metadata } from 'next';
import ProductPage from '@/components/product/productPage';

export const metadata: Metadata = {
  title: 'Product | Yin.co admin panel',
};

const Product: React.FC = () => {
  return <ProductPage />;
};

export default Product;
