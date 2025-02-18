import React from 'react';
import { Metadata } from 'next';
import RolePage from '@/components/role/rolePage';

export const metadata: Metadata = {
  title: 'Role | Yin.co admin panel',
};

const Role: React.FC = () => {
  return <RolePage />;
};

export default Role;
