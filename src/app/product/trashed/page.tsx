import React from 'react';
import { Metadata } from 'next';
import TrashedProductPage from '@/components/product/trashedProductPage';

export const metadata: Metadata = {
  title: 'Trashed product | Yin.co admin panel',
};

const TrashedProduct: React.FC = () => {
  return <TrashedProductPage />;
};

export default TrashedProduct;
