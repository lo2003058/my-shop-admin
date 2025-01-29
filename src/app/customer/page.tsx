import React from 'react';
import { Metadata } from 'next';
import CustomerPage from '@/components/customer/customerPage';

export const metadata: Metadata = {
  title: 'Customer | Yin.co admin panel',
};

const Customer: React.FC = () => {
  return <CustomerPage />;
};

export default Customer;
