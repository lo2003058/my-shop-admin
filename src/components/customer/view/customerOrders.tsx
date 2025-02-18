import React from 'react';
import { CustomerViewProps } from '@/types/customer/types';


const CustomerOrders: React.FC<CustomerViewProps> = ({ customerData = {} }) => {
  return (
    <>
      {
        JSON.stringify(customerData)
      }
      this is the customer orders
    </>
  );
};

export default CustomerOrders;
