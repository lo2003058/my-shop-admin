import React from 'react';
import { Metadata } from 'next';
import OrderViewPage from '@/components/order/view/orderViewPage';

export const metadata: Metadata = {
  title: 'Order view | Yin.co admin panel',
};

const OrderView: React.FC = () => {
  return <OrderViewPage />;
};

export default OrderView;
