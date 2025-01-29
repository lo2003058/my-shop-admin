import React from "react";
import { Metadata } from "next";
import OrderPage from '@/components/order/orderPage';

export const metadata: Metadata = {
  title: "Order | Yin.co admin panel",
};

const Order: React.FC = () => {
  return <OrderPage />;
};

export default Order;
